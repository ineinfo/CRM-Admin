import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
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
import { useAuthContext } from 'src/auth/hooks';
import { UsegetRoles } from 'src/api/roles';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

const DEFAULT_AVATAR_URL = '/logo/logo_single.png';
export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { first_name, last_name, avatarurl, email, role_name, mobile_number } = row;
  const [show, setShow] = useState(false);
  const { products: roles } = UsegetRoles();

  const confirm = useBoolean();

  const popover = usePopover();
  const { user } = useAuthContext()

  const fetchRoles = (data) => {
    const userRole = data.find(role => role.id === user.role_id);
    if (userRole && userRole.role_name === 'Super Admin' || userRole.role_name === 'Colleagues and Agents') {
      setShow(true);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRoles(roles);
    }
  }, [user, roles]);


  return (
    <>
      <TableRow hover selected={selected}>
        {show ?
          <TableCell padding="checkbox">
            <Checkbox checked={selected} onChange={onSelectRow} />
          </TableCell>
          : ''}

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={first_name} src={avatarurl || DEFAULT_AVATAR_URL} sx={{ mr: 2 }} />

          <ListItemText
            primary={(first_name ? ` ${first_name}` : '') + (last_name ? ` ${last_name}` : '')}
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{role_name}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{mobile_number}</TableCell>

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
