import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { formatDate } from '@fullcalendar/core';
import { useCountryData } from 'src/api/propertytype';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const {
    developer_name,
    location, // This is your location value
    starting_price,
    parking,
    owner_name,
    handover_date,
    furnished,
    sqft_starting_size,
    email,
  } = row;

  const confirm = useBoolean();
  const popover = usePopover();
  const { data: countriesData } = useCountryData();

  // Extract country name based on location ID
  const [countryName, setCountryName] = useState('');
  console.log('countriesData', countriesData);

  useEffect(() => {
    // Ensure countriesData is an array and location is defined
    if (location) {
      const country = countriesData?.data.find((country) => country.id === location);
      console.log('country', country);

      setCountryName(country ? country.name : 'Country Data Not Available');
    } else {
      setCountryName('Country Data Not Available');
    }
  }, [countriesData, location]);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={developer_name ? ` ${developer_name}` : ''}
            secondary={countryName}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{starting_price}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{parking}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{owner_name}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(handover_date)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{furnished}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{sqft_starting_size}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

UserTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
