'use client';

import axios from 'axios';
import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { endpoints } from 'src/utils/axios';

import { _roles } from 'src/_mock';
import { DeleteProperty } from 'src/api/properties';
import { useSearchParams } from "next/navigation";
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
    useTable,
    emptyRows,
    TableNoData,
    getComparator,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from 'src/components/table';

import { useCountryData, UsegetPropertiesType } from 'src/api/propertytype';
import UserTableRow from 'src/sections/clients/clients-table-row';
import UserTableFiltersResult from 'src/sections/clients/clients-table-filters-result';
import { DeleteFollowUp, DeleteMultipleFollowUp } from 'src/api/leads';
import FollowupTableToolbar from '../Followup-table-toolbar';
import FollowupTableRow from '../Followup-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Lead name', width: 150 },
    { id: 'followup_date', label: 'Followup Date', width: 100 },
    { id: 'status', label: 'Status', width: 80 },
    { id: 'summary', label: 'Summary', width: 150 },
    { id: '', label: '', width: 0 },
];

const defaultFilters = {
    name: '',
    role: [],
    status: 'all',
    property_type: [],
    no_of_bedrooms: [],
    amenities: [],
    property_status: 0,
    range_min: 0,
    range_max: 20000,
    parking: '',
    account_type: '',
};

// ----------------------------------------------------------------------

export default function FollowupListView({ id }) {
    const searchParams = useSearchParams();

    const report = searchParams.get('report') || false;
    console.log("report", report);

    const { enqueueSnackbar } = useSnackbar();
    const table = useTable();
    const CountryApi = useCountryData();
    const CountryList = CountryApi.data?.data;
    const settings = useSettingsContext();

    const router = useRouter();

    const confirm = useBoolean();

    const [tableData, setTableData] = useState([]);

    const [filters, setFilters] = useState(defaultFilters);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters,
    });

    const dataInPage = dataFiltered.slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
    );

    const denseHeight = table.dense ? 56 : 56 + 20;

    const canReset = !isEqual(defaultFilters, filters);

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    const handleFilters = useCallback(
        (name, value) => {
            table.onResetPage();
            setFilters((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        },
        [table]
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                let fetchedData = []
                if (id) {
                    const response = await axios.get(endpoints.followup.details(id));
                    fetchedData = response.data.data;
                } else {
                    const response = await axios.get(endpoints.followup.list);
                    fetchedData = response.data.data;
                }

                // Replace location ID with the corresponding country name from CountryList
                if (CountryList && CountryList.length) {
                    fetchedData = fetchedData.map((item) => {
                        const country = CountryList.find((c) => c.id === item.location);
                        if (country) {
                            return { ...item, location: country.name }; // Replace location ID with country name
                        }
                        return item; // If no match is found, return the item unchanged
                    });
                }

                setTableData(fetchedData);
            } catch (err) {
                const errorMessage = err.response?.data?.message || "Data Not Found";
                enqueueSnackbar(errorMessage, { variant: 'error' });
            }
        };

        fetchData();
    }, [enqueueSnackbar, CountryList]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(endpoints.propertypage.list);
    //             // console.log("========>",response.data.data);
    //             setTableData(response.data.data);
    //         } catch (err) {
    //             console.log(err);
    //             enqueueSnackbar('Failed to load data', { variant: 'error' });
    //         }
    //     };
    //     fetchData();
    // }, [enqueueSnackbar]);

    const handleResetFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    const handleDeleteRow = useCallback(
        async (iD) => {
            try {
                await DeleteFollowUp(id); // Assuming deleteRole is an API function that deletes the role by ID
                const deleteRow = tableData.filter((row) => row.id !== iD);

                enqueueSnackbar('Delete success!');

                setTableData(deleteRow);
            } catch (error) {
                enqueueSnackbar('Delete failed!', { variant: 'error' });
                console.error(error);
            }
        },
        [enqueueSnackbar, tableData]
    );

    const handleDeleteRows = useCallback(async () => {
        // Simulating an async operation, e.g., fetching data
        const fetchData = async () => {
            console.log("data");

            return tableData;
        };

        // Fetch the current table data
        const currentTableData = await fetchData();

        // Filter out the rows that are selected for deletion
        const deleteRows = currentTableData.filter((row) => {
            const isSelected = table.selected.includes(row.id);
            return isSelected; // Keep only selected rows
        });

        // Extract the IDs of the rows to be deleted
        const deletedRowIds = deleteRows.map((row) => row.id);
        console.log('Row IDs to be deleted:', deletedRowIds); // Log the IDs of rows to be deleted

        // Call your API to delete the rows
        try {
            await DeleteMultipleFollowUp(deletedRowIds); // Replace with your actual API call
            enqueueSnackbar('Delete success!'); // Show success message

            // Update the state of the table data to reflect the deletion
            setTableData(currentTableData.filter((row) => !table.selected.includes(row.id)));

            table.onUpdatePageDeleteRows({
                totalRowsInPage: dataInPage.length,
                totalRowsFiltered: dataFiltered.length,
            });
        } catch (error) {
            console.error('Error deleting rows:', error);
            enqueueSnackbar('Delete failed!', { variant: 'error' }); // Show error message
        }
    }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);


    const handleEditRow = useCallback(
        (Id) => {
            router.push(`${paths.dashboard.followup.edit(Id)}?id=${Id}`);
        },
        [router]
    );

    return (
        <>
            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="List"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        report ? {
                            name: 'Power Report',
                            href: paths.dashboard.report
                        } : {
                            name: 'Leads',
                            href: paths.dashboard.leads.list,
                        },
                        { name: 'Followup', href: `${paths.dashboard.followup.root}?id=${id}` },
                        { name: 'List' },
                    ]}
                    action={
                        report ? "" : <Button
                            component={RouterLink}
                            href={`${paths.dashboard.followup.new}?id=${id}`}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            Create
                        </Button>
                    }
                    sx={{
                        mb: { xs: 3, md: 5 },
                    }}
                />
                <Card>
                    <FollowupTableToolbar filters={filters} onFilters={handleFilters} />
                    {canReset && (
                        <UserTableFiltersResult
                            filters={filters}
                            onFilters={handleFilters}
                            onResetFilters={handleResetFilters}
                            results={dataFiltered.length}
                            sx={{ p: 2.5, pt: 0 }}
                        />
                    )}
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <TableSelectedAction
                            dense={table.dense}
                            numSelected={table.selected.length}
                            rowCount={dataFiltered.length}
                            onSelectAllRows={(checked) =>
                                table.onSelectAllRows(
                                    checked,
                                    dataFiltered.map((row) => row.id)
                                )
                            }
                            action={
                                <Tooltip title="Delete">
                                    <IconButton color="primary" onClick={confirm.onTrue}>
                                        <Iconify icon="solar:trash-bin-trash-bold" />
                                    </IconButton>
                                </Tooltip>
                            }
                        />
                        <Scrollbar>
                            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                                <TableHeadCustom
                                    order={table.order}
                                    orderBy={table.orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={dataFiltered.length}
                                    numSelected={table.selected.length}
                                    onSort={table.onSort}
                                    onSelectAllRows={(checked) =>
                                        table.onSelectAllRows(
                                            checked,
                                            dataFiltered.map((row) => row.id)
                                        )
                                    }
                                />
                                <TableBody>
                                    {dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row) => (
                                            <FollowupTableRow
                                                key={row.id}
                                                row={row}
                                                selected={table.selected.includes(row.id)}
                                                onSelectRow={() => table.onSelectRow(row.id)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                onEditRow={() => handleEditRow(row.id)}
                                                report={report}
                                            />
                                        ))}
                                    <TableEmptyRows
                                        height={denseHeight}
                                        emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                                    />
                                    <TableNoData notFound={notFound} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>
                    <TablePaginationCustom
                        count={dataFiltered.length}
                        page={table.page}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                        dense={table.dense}
                        onChangeDense={table.onChangeDense}
                    />
                </Card>
            </Container>
            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content={
                    <>
                        Are you sure want to delete <strong> {table.selected.length} </strong> items?
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDeleteRows();
                            confirm.onFalse();
                        }}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    );
}

// ----------------------------------------------------------------------
function applyFilter({ inputData, comparator, filters }) {
    const {
        name,
        // status,
        // role,
        // property_type,
        // no_of_bedrooms,
        // amenities,
        // range_min,
        // range_max,
        // parking,
        // account_type,
        // property_status,
    } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    // Filter by name
    if (name) {
        inputData = inputData.filter(
            (user) =>
                user.lead_first_name.toLowerCase().includes(name.toLowerCase()) ||
                user.lead_last_name.toLowerCase().includes(name.toLowerCase())
            // user.email.toLowerCase().includes(name.toLowerCase())
        );
    }

    // Filter by status
    // if (status) {
    //     inputData = inputData.filter((user) => user.status === status);
    // }

    // Filter by role
    // if (role.length) {
    //     inputData = inputData.filter((user) => role.includes(user.role));
    // }

    // Filter by property type
    // if (property_type.length) {
    //     inputData = inputData.filter((user) =>
    //         user.property_type.some((type) => property_type.includes(type))
    //     );
    // }

    // Filter by number of bedrooms
    // if (no_of_bedrooms.length) {
    //     inputData = inputData.filter((user) =>
    //         user.no_of_bedrooms.some((type) => no_of_bedrooms.includes(type))
    //     );
    // }

    // Filter by amenities
    // if (amenities.length) {
    //     inputData = inputData.filter((user) => user.amenities.some((type) => amenities.includes(type)));
    // }

    // **Correct filtering for range_min and range_max**
    // if (range_min !== undefined && range_min !== null) {
    //     inputData = inputData.filter((user) => user.range_min >= range_min);
    // }

    // if (range_max !== undefined && range_max !== null) {
    //     inputData = inputData.filter((user) => user.range_max <= range_max);
    // }

    // if (parking) {
    //     inputData = inputData.filter((user) =>
    //         user.parking.toLowerCase().includes(parking.toLowerCase())
    //     );
    // }

    // if (account_type) {
    //     inputData = inputData.filter((user) =>
    //         user.account_type.toLowerCase().includes(account_type.toLowerCase())
    //     );
    // }

    // if (property_status) {
    //     inputData = inputData.filter((user) => user.property_status === property_status);
    // }

    return inputData;
}
