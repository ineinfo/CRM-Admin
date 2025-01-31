import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  ListItemText,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import dayjs from 'dayjs';
import DownloadDetailsModal from './DownloadDetailsModal';
import { useAuthContext } from 'src/auth/hooks';
import { UsegetRoles } from 'src/api/roles';


// ----------------------------------------------------------------------


export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const {
    developer_name,
    location,
    starting_price,
    parking,
    phone_number,
    handover_date,
    furnished,
    email,
  } = row;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const confirm = useBoolean();
  const popover = usePopover();

  const { user } = useAuthContext()
  const [show, setShow] = useState(false);
  const { products: roles } = UsegetRoles();

  const fetchRoles = (data) => {
    const userRole = data.find(role => role.id === user.role_id);
    // if (userRole && userRole.role_name === 'Super Admin' || userRole.role_name === 'Colleagues and Agents') {
    if (userRole && userRole.role_name === 'Super Admin') {
      setShow(true);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRoles(roles);
    }
  }, [user, roles]);


  function formatPrice(price) {
    if (price >= 1_000_000_000) {
      return `${(price / 1_000_000_000).toFixed(1)}B`; // Billion
    }
    if (price >= 1_000_000) {
      return `${(price / 1_000_000).toFixed(1)}M`; // Million
    }
    return new Intl.NumberFormat('en-US').format(price); // Below million, show with commas
  }

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <>
      <TableRow hover selected={selected}>
        {show ?
          <TableCell padding="checkbox">
            <Checkbox checked={selected} onChange={onSelectRow} />
          </TableCell>
          : ''}
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Link
            color="inherit"
            sx={{ cursor: 'pointer' }}
            onClick={onEditRow}
          >
            <ListItemText
              primary={developer_name ? ` ${developer_name}` : ''}
              secondary={location}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
              }}
            />
          </Link>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {starting_price ? (
            formatPrice(starting_price)
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>-</div>
          )}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {parking?.charAt(0).toUpperCase() + parking?.slice(1)}
          </div>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {phone_number || <div style={{ display: 'flex', justifyContent: 'center' }}>-</div>}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {handover_date ? (
            dayjs(handover_date).format('DD-MM-YYYY')
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>-</div>
          )}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {furnished?.charAt(0).toUpperCase() + furnished?.slice(1)}
          </div>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell>
        {show ? (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            <Button variant="contained" color="secondary" onClick={handleModalOpen}>
              <Iconify icon="eva:download-fill" />
            </Button>
          </TableCell>
        ) : ''}
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
        {show ? (
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
        ) : ''}
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

      <DownloadDetailsModal open={isModalOpen} onClose={handleModalClose} row={row} />
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
