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
import { DetailLead, MatchLead, SelectedLead } from 'src/api/leads';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { alpha, Link } from '@mui/material';
import PropertyDetailsModal from 'src/sections/leads/PropertyDetailsModal';
import OfferModal from 'src/sections/leads/OfferModal';
import { useAuthContext } from 'src/auth/hooks';
import DetailsModal from './Detail-modal';

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onUnarchiveRow }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [matchedData, setMatchedData] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    const confirm = useBoolean();
    const confirmArchive = useBoolean();
    const popover = usePopover();
    const invoiceRef = useRef();

    const { user } = useAuthContext();
    // console.log("nedded",user.accessToken);
    const token = user?.accessToken;

    const triggerDownload = () => {
        if (invoiceRef.current) {
            invoiceRef.current.handleDownload();
        }
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
        status
    } = row;

    const router = useRouter()

    const handleDetail = async (Id, Token) => {
        // try {
        //     const Data = await SelectedLead(row?.id);
        //     setSelectedData(Data.data);
        // } catch (error) {
        //     console.log(error);
        // }
        try {
            const res = await DetailLead(Id, Token);
            console.log('Selected lead', res);
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

    const handleUnarchive = (data) => {
        onUnarchiveRow(data)
        setModalOpen(false);
    };

    const handlefollowupDate = () => {
        router.push(`/dashboard/followup?id=${id}&report=true`)

    }

    return (
        <>
            <TableRow
                hover
                selected={selected}
                sx={{

                    alignItems: 'center'
                }}

            >
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>
                <TableCell sx={{ display: 'flex', alignItems: 'center' }}>

                    {/* <Link color="inherit" sx={{ cursor: "pointer" }} onClick={() => {
                        onEditRow();
                    }}> */}
                    <ListItemText
                        primary={!first_name ? `${developer_name}` : `${first_name} ${last_name}`}
                        secondary={location}
                        primaryTypographyProps={{ typography: 'body2' }}
                        secondaryTypographyProps={{
                            component: 'span',
                            color: 'text.disabled',
                        }}
                        sx={{ height: "35px" }}
                    />
                    {/* </Link> */}

                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{phone_number}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {handover_date ? dayjs(handover_date).format('DD-MM-YYYY') : <div style={{ marginLeft: "40px" }}>-</div>}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell>


                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Button variant="contained" color="secondary" onClick={handlefollowupDate}>
                        <Iconify icon="eva:calendar-outline" />
                    </Button>
                </TableCell>

                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Button variant="outlined" color="inherit" onClick={() => { handleDetail(id, token) }}>
                        Detail

                    </Button>
                </TableCell>


            </TableRow >


            <DetailsModal open={modalOpen} handleClose={handleCloseModal} propertyData={matchedData} unarchive={(data) => handleUnarchive(data)} />

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
