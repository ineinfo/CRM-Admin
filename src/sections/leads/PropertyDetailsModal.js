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
import { useCountryData } from 'src/api/propertytype';
import { SelectLead } from 'src/api/leads';
import { enqueueSnackbar } from 'notistack';

const PropertyDetailsModal = ({ open, onClose, row, id, selected }) => {
  const CountryApi = useCountryData();
  const CountryList = CountryApi.data?.data;
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (row && selected) {
      // Match developer_id with property.id
      const initiallySelectedRows = row
        .filter((property) => selected.some((sel) => sel.developer_id === property.id))
        .map((property) => property.id);

      setSelectedRows(initiallySelectedRows);
    }
  }, [row, selected]);

  // Create a map of country ID to name for quick lookup
  const countryMap = React.useMemo(() => {
    const map = new Map();
    CountryList?.forEach((country) => {
      map.set(country.id, country.name); // assuming country object has id and name properties
    });
    return map;
  }, [CountryList]);

  if (!row) return null;

  // Handle checkbox toggle
  const handleSelectRow = (property) => {
    const isSelected = selectedRows.includes(property.id);

    if (isSelected) {
      // If selected, remove the property id from the selectedRows array
      setSelectedRows(selectedRows.filter((selectedId) => selectedId !== property.id));
    } else {
      // If not selected, add the property id to the selectedRows array
      setSelectedRows([...selectedRows, property.id]);
    }
  };

  // Handle logging selected rows and create FormData
  const handleLogSelectedRows = async () => {
    // Create JSON object
    const data = {
      developer_id: selectedRows,
    };
    console.log('devs', id, data);

    try {
      await SelectLead(id, data);
      onClose();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Unknown error', { variant: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Property Details</DialogTitle>
      <DialogContent>
        {/* Button to log selected rows */}
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
                <TableCell>State ID</TableCell>
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
                  <TableCell>{countryMap.get(property.location) || 'Unknown Country'}</TableCell>
                  <TableCell>{property.state_id}</TableCell>
                  <TableCell>{property.parking}</TableCell>
                  <TableCell>{property.range_min}</TableCell>
                  <TableCell>{property.starting_price}</TableCell>
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
