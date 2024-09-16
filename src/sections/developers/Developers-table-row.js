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
import dayjs from 'dayjs';

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
    // sqft_starting_size,
    email,
  } = row;

  const confirm = useBoolean();
  const popover = usePopover();

  function formatPrice(price) {
    if (price >= 1_000_000_000) {
      return (price / 1_000_000_000).toFixed(1) + 'B'; // Billion
    } else if (price >= 1_000_000) {
      return (price / 1_000_000).toFixed(1) + 'M'; // Million
    } else {
      return new Intl.NumberFormat('en-US').format(price); // Below million, show with commas
    }
  }

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={developer_name ? ` ${developer_name}` : ''}
            secondary={location}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {starting_price ? formatPrice(starting_price) : '-'}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{parking}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{owner_name}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {handover_date ? (
            dayjs(handover_date).format('DD-MM-YYYY')
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>-</div>
          )}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>{furnished}</div>
        </TableCell>
        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{sqft_starting_size}</TableCell> */}
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
