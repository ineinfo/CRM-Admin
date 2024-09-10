import React, { useState } from 'react';
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

const PropertyDetailsModal = ({ open, onClose, row }) => {
  const CountryApi = useCountryData();
  const CountryList = CountryApi.data?.data;
  const [selectedRows, setSelectedRows] = useState([]);

  if (!row) return null;

  // Handle checkbox toggle
  const handleSelectRow = (property) => {
    const isSelected = selectedRows.some((selectedRow) => selectedRow === property);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((selectedRow) => selectedRow !== property));
    } else {
      setSelectedRows([...selectedRows, property]);
    }
  };

  // Handle log selected rows to console
  const handleLogSelectedRows = () => {
    console.log('Selected Rows:', selectedRows);
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
                      checked={selectedRows.includes(property)}
                      onChange={() => handleSelectRow(property)}
                    />
                  </TableCell>
                  <TableCell>{property.developer_name}</TableCell>
                  <TableCell>{property.location}</TableCell>
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
