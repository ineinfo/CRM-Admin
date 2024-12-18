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
import { useCountryData, UsegetPropertiesType } from 'src/api/propertytype';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Link } from '@mui/material';

// ----------------------------------------------------------------------

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const {
    first_name,
    last_name,
    country_id,
    property_type_id,
    mobile,
    followup,
    // sqft_starting_size,
    email,
  } = row;
  console.log("Data====>12", row);

  const confirm = useBoolean();
  const popover = usePopover();
  const { products: propertyTypes, productsLoading: propertyTypesLoading } = UsegetPropertiesType();
  // State to manage "see more / see less" for each row
  const [expandedRows, setExpandedRows] = useState({});

  // Toggle function for "see more / see less"
  const toggleExpand = (rowId) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [rowId]: !prevExpandedRows[rowId],
    }));
  };


  return (
    <>
      <TableRow
        hover
        selected={selected}

      >
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center', }}>
          <Link color="inherit" sx={{ cursor: "pointer", minHeight: "100%" }} onClick={() => {
            onEditRow();
          }}><ListItemText
              primary={first_name ? ` ${first_name} ${last_name}` : ''}
              secondary={country_id === 0 ? '-' : country_id}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
              }}
            /></Link>
        </TableCell>
        <TableCell>
          {property_type_id && property_type_id.length > 0 ? (
            <>
              {property_type_id
                .slice(0, expandedRows[row.id] ? property_type_id.length : 3)
                .map((typeId) => {
                  const property = propertyTypes.find((prop) => prop.id === typeId);
                  return property ? property.property_type : '-';
                })
                .join(', ')}
              {property_type_id.length > 3 && (
                <Link
                  component="button"
                  onClick={() => toggleExpand(row.id)}
                  sx={{ color: 'primary.main', ml: 1 }}
                >
                  {expandedRows[row.id] ? 'See less' : 'See more'}
                </Link>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>-</div>
          )}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {
            mobile
            ||
            <div style={{ display: 'flex', justifyContent: 'center' }}>-</div>
          }
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {followup ? (
            dayjs(followup).format('DD-MM-YYYY')
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>-</div>
          )}
        </TableCell>

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
