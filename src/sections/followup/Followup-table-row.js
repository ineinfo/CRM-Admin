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
import dayjs from 'dayjs';

import { useState } from 'react';
import { Link } from '@mui/material';

// ----------------------------------------------------------------------

export default function FollowupTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, report }) {
    const { lead_first_name, lead_last_name, followup_date, summary, createdAt, updatedAt, followup_status } = row;
    const confirm = useBoolean();
    const popover = usePopover();
    const [isExpanded, setIsExpanded] = useState(false);

    // Check if summary is defined, fallback to an empty string if not
    const displayedSummary = summary || '';

    const handleExpanded = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell><Link color="inherit" sx={{ cursor: "pointer" }} onClick={() => {
                    onEditRow();
                }}>
                    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                        <ListItemText
                            primary={(lead_first_name && lead_last_name ? `${lead_first_name} ${lead_last_name}` : '-')}
                            secondary={updatedAt ? `Updated at ${dayjs(updatedAt).format('DD-MM-YYYY')}` : `Created at ${dayjs(createdAt).format('DD-MM-YYYY')}`}
                            primaryTypographyProps={{ typography: 'body2' }}
                            secondaryTypographyProps={{
                                component: 'span',
                                color: 'text.disabled',
                            }}
                        />
                    </TableCell></Link>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{followup_date ? (
                    dayjs(followup_date).format('DD-MM-YYYY')
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>-</div>
                )}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{followup_status ? (
                    followup_status === 1 ? "In Progress" : "Completed"
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>-</div>
                )}</TableCell>
                <TableCell sx={{ maxWidth: 300, overflow: 'hidden' }}>
                    <div style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', WebkitLineClamp: isExpanded ? 'none' : 2 }}>
                        {displayedSummary}
                    </div>
                    {!isExpanded && displayedSummary.split(' ').length > 20 && (
                        <Button size="small" onClick={handleExpanded}>
                            Read more
                        </Button>
                    )}
                    {isExpanded && (
                        <>
                            <Button size="small" onClick={handleExpanded}>
                                Show less
                            </Button>
                        </>
                    )}
                </TableCell>
                {report ? '' : <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                    <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>}
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
                content="Are you sure you want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={onDeleteRow}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}

FollowupTableRow.propTypes = {
    onDeleteRow: PropTypes.func,
    onEditRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    row: PropTypes.object,
    selected: PropTypes.bool,
};
