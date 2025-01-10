import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import dayjs from 'dayjs';
import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { MatchLead, SelectedLead } from 'src/api/leads';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { alpha, Link } from '@mui/material';
import OfferModal from './OfferModal';
import PropertyDetailsModal from './PropertyDetailsModal'; // Adjust the path as needed
import { useAuthContext } from 'src/auth/hooks';


export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onArchiveRow }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [matchedData, setMatchedData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const confirm = useBoolean();
  const confirmArchive = useBoolean();
  const popover = usePopover();
  const invoiceRef = useRef();
  const { user } = useAuthContext()
  // console.log("Nehal", user?.editable);
  const show = user?.editable

  const triggerDownload = () => {
    if (invoiceRef.current) {
      invoiceRef.current.handleDownload();
    }
  };

  const getLatestFollowupDate = (followups) => {
    if (followups.length === 0) return null;
    const latestFollowup = followups.reduce((latest, current) => {
      return dayjs(current.followup_date).isAfter(dayjs(latest.followup_date)) ? current : latest;
    });
    return latestFollowup.followup_date;
  };

  const {
    developer_name,
    location,
    starting_price,
    first_name,
    last_name,
    parking,
    phone_number,
    owner_name,
    handover_date,
    furnished,
    sqft_starting_size,
    email,
    id,
    status, followup
  } = row;

  const router = useRouter()

  const handleMatchPropertyClick = async () => {
    try {
      const Data = await SelectedLead(row?.id);
      setSelectedData(Data.data);
    } catch (error) {
      console.log(error);
    }
    try {
      const res = await MatchLead(id);
      console.log('Selected lead', selected);
      setMatchedData(res.data);

      setModalOpen(true);
    } catch (error) {
      enqueueSnackbar('No Data Match', { variant: 'error' });
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handlefollowupDate = () => {
    router.push(`/dashboard/followup?id=${id}`)
  }

  let backgroundColor;

  if (status === 3) {
    backgroundColor = 'transparent';
  } else if (row?.sales_status) {
    backgroundColor = alpha('#fda92d', 0.25);
  } else {
    backgroundColor = 'transparent';
  }

  return (
    <>
      <TableRow
        hover
        selected={selected}
        sx={{
          backgroundColor,
          '&:hover': {
            backgroundColor: alpha('#4CAF50', 0.25),
          },
          alignItems: 'center'
        }}

      >
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>

          <Link color="inherit" sx={{ cursor: "pointer" }} onClick={() => {
            onEditRow();
          }}><ListItemText
              primary={!first_name ? `${developer_name}` : `${first_name} ${last_name}`}
              secondary={location}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
              }}
              sx={{ height: "35px" }}
            /></Link>

        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phone_number}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {handover_date ? dayjs(handover_date).format('DD-MM-YYYY') : <center>-</center>}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell>


        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {followup.length > 0 ? (
            <Button Button variant="contained" color="secondary" onClick={handlefollowupDate}>
              {dayjs(getLatestFollowupDate(followup)).format('DD-MM-YYYY')}
            </Button>

          ) : (
            <Button variant="contained" color="secondary" onClick={handlefollowupDate}>
              Create Followup
            </Button>
          )}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <OfferModal row={row} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Button variant="contained" color="secondary" onClick={handleMatchPropertyClick}>
            Property Match
          </Button>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow >
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
            confirmArchive.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'info' }}
        >
          <Iconify icon="mage:archive-fill" />
          Archive
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
          <Button variant="contained" color="info" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmArchive.value}
        onClose={confirmArchive.onFalse}
        title="Archive"
        content="Are you sure want to Archive?"
        action={
          <Button variant="contained" color="info" onClick={onArchiveRow} >
            Archive
          </Button>
        }
      />

      <PropertyDetailsModal
        open={modalOpen}
        onClose={handleCloseModal}
        row={matchedData}
        id={id}
        selected={selectedData}
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
