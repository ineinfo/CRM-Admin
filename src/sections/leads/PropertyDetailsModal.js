import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
} from '@mui/material';
import { useCountryData, UseStateData } from 'src/api/propertytype';
import { SelectLead } from 'src/api/leads';
import { enqueueSnackbar } from 'notistack';

const PropertyDetailsModal = ({ open, onClose, row, id, selected }) => {
  const [countryList, setCountryList] = useState([]);
  const [stateLists, setStateLists] = useState({}); // To store states for each location
  const [selectedRows, setSelectedRows] = useState([]);

  const CountryApi = useCountryData();

  // Function to fetch state list for each row's location
  const FetchStateList = async (locationId) => {
    // Fetch the state data unconditionally using the hook
    const { data: StateApi, error } = UseStateData(locationId);

    if (locationId && !stateLists[locationId]) {
      try {
        if (StateApi) {
          setStateLists((prevStateLists) => ({
            ...prevStateLists,
            [locationId]: StateApi, // Store the fetched states for each location
          }));
        }
      } catch (err) {
        console.error('Failed to fetch state data for location:', locationId);
      }
    }
  };
  useEffect(() => {
    if (CountryApi.data?.data) {
      setCountryList(CountryApi.data.data);
    }
  }, [CountryApi.data]);

  // Fetch state list for each location in `row`
  useEffect(() => {
    if (row) {
      row.forEach((property) => {
        if (property.location) {
          FetchStateList(property.location); // Fetch state list for each row's location
        }
      });
    }
  }, [row]);

  useEffect(() => {
    if (row && selected) {
      const initiallySelectedRows = row
        .filter((property) => selected.some((sel) => sel.developer_id === property.id))
        .map((property) => property.id);

      setSelectedRows(initiallySelectedRows);
    }
  }, [row, selected]);

  if (!row) return null;

  const handleSelectRow = (property) => {
    const isSelected = selectedRows.includes(property.id);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((selectedId) => selectedId !== property.id));
    } else {
      setSelectedRows([...selectedRows, property.id]);
    }
  };

  const handleLogSelectedRows = async () => {
    const data = {
      developer_id: selectedRows,
    };
    console.log('Selected data:', id, data);

    try {
      await SelectLead(id, data);
      onClose();
      enqueueSnackbar('Data updated successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Unknown error', { variant: 'error' });
    }
  };

  const getCountryName = (locationId) => {
    const country = countryList.find((cou) => cou.id === locationId);
    return country ? country.name : '-';
  };

  // Helper function to get state name by state_id and locationId from stored stateLists
  const getStateName = (locationId, stateId) => {
    const states = stateLists[locationId] || [];
    const state = states.find((st) => st.id === stateId); // Find the matching state by state_id
    return state ? state.name : '-';
  };

  function formatPrice(price) {
    if (price >= 1_000_000_000) {
      return `${(price / 1_000_000_000).toFixed(1)}B`; // Billion
    }
    if (price >= 1_000_000) {
      return `${(price / 1_000_000).toFixed(1)}M`; // Million
    }
    return new Intl.NumberFormat('en-US').format(price); // Below million, show with commas
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Property Details</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <Button variant="contained" color="primary" onClick={handleLogSelectedRows}>
            Selected Rows
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Developer Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>State</TableCell> {/* Changed State ID to State Name */}
                <TableCell>Parking</TableCell>
                <TableCell>Range Min</TableCell>
                <TableCell>Starting Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row.map((property, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(property.id)}
                      onChange={() => handleSelectRow(property)}
                    />
                  </TableCell>
                  <TableCell>{property.developer_name}</TableCell>
                  <TableCell>{getCountryName(property.location)}</TableCell>
                  <TableCell>{getStateName(property.location, property.state_id)}</TableCell>{' '}
                  {/* Display state name */}
                  <TableCell>{property.parking}</TableCell>
                  <TableCell>
                    {' '}
                    {property.range_min ? formatPrice(property.range_min) : '-'} sqft
                  </TableCell>
                  <TableCell>
                    {' '}
                    {property.starting_price ? formatPrice(property.starting_price) : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsModal;
