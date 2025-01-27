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

import { _roles, USER_STATUS_OPTIONS } from 'src/_mock';
import { ArchiveLead, DeleteLead, UnarchiveLead } from 'src/api/leads';

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

import { useCountryData } from 'src/api/propertytype';
import { alpha, Tab, Tabs } from '@mui/material';
import Label from 'src/components/label';
import { useAuthContext } from 'src/auth/hooks';
import UserTableFiltersResult from 'src/sections/leads/leads-table-filters-result';
import UserTableToolbar from '../PowerReport-table-toolbar';
import UserTableRow from '../PowerReport-table-row';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];
const TABLE_HEAD = [
    { id: 'customer_name', label: 'Name', width: 120 },
    { id: 'customer_mobile', label: 'Phone', width: 120 },
    { id: 'handover_date', label: 'Move in date', width: 50 },
    { id: 'email', label: 'Email', width: 100 },
    { id: 'Followup_date', label: 'Followup date', width: 30 },
    { id: 'detail', label: 'Detail', width: 30 },
    // { id: '', width: 50 },
    // { id: '', width: 50 },
    // { id: '', width: 50 },
];

const defaultFilters = {
    name: '',
    role: [],
    status: 'all',
    property_type: [],
    no_of_bathrooms: [],
    amenities: [],
    property_status: 0,
    finance: 0,
    location: "",
    stateId: "",
    cityId: "",
    note: "",
    range_min: 0,
    range_max: 20000,
    parking: '',
    account_type: '',
};


// ----------------------------------------------------------------------

export default function PowerReportListView() {
    const { enqueueSnackbar } = useSnackbar();
    const table = useTable();

    const { user } = useAuthContext();
    const Token = user?.accessToken;

    const CountryApi = useCountryData();
    const CountryList = CountryApi.data?.data;

    const settings = useSettingsContext();

    const router = useRouter();

    const confirm = useBoolean();

    const [tableData, setTableData] = useState([]);

    const [filters, setFilters] = useState(defaultFilters);
    const [activeTab, setActiveTab] = useState('all'); // Initial tab selection

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
                const response = await axios.get(endpoints.report.list);
                let fetchedData = response.data.data;

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
                console.log(err);
                enqueueSnackbar('Failed to load data', { variant: 'error' });
            }
        };

        fetchData();
    }, [enqueueSnackbar, CountryList]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(endpoints.report.list); // Update with your API endpoint
                setTableData(response.data.data);
            } catch (err) {
                console.log(err);
                enqueueSnackbar('Failed to load data', { variant: 'error' });
            }
        };
        fetchData();
    }, [enqueueSnackbar]);

    const handleResetFilters = useCallback(() => {
        setFilters({
            ...defaultFilters,
            location: '',
            stateId: '',
            cityId: '',
        });
    }, []);

    const handleDeleteRow = useCallback(
        async (id) => {
            try {
                await DeleteLead(id);
                const deleteRow = tableData.filter((row) => row.id !== id);

                enqueueSnackbar('Delete success!');

                setTableData(deleteRow);
            } catch (error) {
                enqueueSnackbar('Delete failed!', { variant: 'error' });
                console.error(error);
            }
        },
        [enqueueSnackbar, tableData]
    );

    const handleUnarchiveRow = useCallback(
        async (id, data) => {
            try {
                await UnarchiveLead(id, data, Token);
                const deleteRow = tableData.filter((row) => row.id !== id);

                enqueueSnackbar('Unarcheived success!');

                setTableData(deleteRow);
            } catch (error) {
                enqueueSnackbar('Unarchive failed!', { variant: 'error' });
                console.error(error);
            }
        },
        [enqueueSnackbar, tableData]
    );

    const handleDeleteRows = useCallback(() => {
        const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

        enqueueSnackbar('Delete success!');

        setTableData(deleteRows);

        table.onUpdatePageDeleteRows({
            totalRowsInPage: dataInPage.length,
            totalRowsFiltered: dataFiltered.length,
        });
    }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

    const handleEditRow = useCallback(
        (id) => {
            router.push(paths.dashboard.leads.edit(id));
        },
        [router]
    );

    const handleFilterStatus = useCallback(
        (event, newValue) => {
            handleFilters('status', newValue);
        },
        [handleFilters]
    );
    return (
        <>
            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="List"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'Power Report', href: paths.dashboard.report },
                        { name: 'List' },
                    ]}
                    // action={
                    //     <Button
                    //         component={RouterLink}
                    //         href={paths.dashboard.leads.new}
                    //         variant="contained"
                    //         startIcon={<Iconify icon="mingcute:add-line" />}
                    //     >
                    //         Create
                    //     </Button>
                    // }
                    sx={{
                        mb: { xs: 3, md: 5 },
                    }}
                />
                <Card>
                    {/* <Tabs
                        value={filters.status}
                        onChange={handleFilterStatus}
                        sx={{
                            px: 2.5,
                            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
                        }}
                    >
                        {STATUS_OPTIONS.map((tab) => (
                            <Tab
                                key={tab.value}
                                iconPosition="end"
                                value={tab.value}
                                label={tab.label}
                                icon={
                                    <Label
                                        variant={
                                            ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                                        }
                                        sx={{
                                            color: `${(tab.value === 'active' && 'purple') ||
                                                (tab.value === 'inactive' && 'blue') ||
                                                (tab.value === 'previous' && '#ffbb00') ||
                                                'default'
                                                }`,
                                            backgroundColor: "white"
                                        }}
                                    >
                                        {['active', 'inactive', 'previous'].includes(tab.value)
                                            ? tableData.filter((user) =>
                                                (tab.value === 'active' && user.status === 1) ||
                                                (tab.value === 'inactive' && user.status === 2) ||
                                                (tab.value === 'previous' && user.status === 3)
                                            ).length
                                            : tableData.length}
                                    </Label>
                                }
                            />
                        ))}


                    </Tabs> */}

                    <UserTableToolbar filters={filters} onFilters={handleFilters} roleOptions={_roles} />
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
                                            <UserTableRow
                                                key={row.id}
                                                row={row}
                                                selected={table.selected.includes(row.id)}
                                                onSelectRow={() => table.onSelectRow(row.id)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                onUnarchiveRow={(data) => handleUnarchiveRow(row.id, data)}
                                                onEditRow={() => handleEditRow(row.id)}

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
        status,
        role,
        property_type,
        no_of_bathrooms,
        amenities,
        range_min,
        range_max,
        parking,
        account_type,
        property_status,
        finance,
        location,
        stateId,
        cityId,
    } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index]);
    console.log("Data nedded", location, stateId, cityId);
    console.log("Data nedded1", inputData);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    // Filter by name
    if (name) {
        // Split the input name by spaces to handle cases where both first and last names are entered
        const nameParts = name.toLowerCase().split(' ');

        inputData = inputData.filter((user) => {
            const fullName = `${user.first_name?.toLowerCase()} ${user.last_name?.toLowerCase()}`.trim();

            // Check if all parts of the name input are found in the full name (both first and last name entered)
            return nameParts.every(part => fullName.includes(part)) ||
                user.first_name?.toLowerCase().includes(name.toLowerCase()) ||
                user.last_name?.toLowerCase().includes(name.toLowerCase()) ||
                user.developer_name?.toLowerCase().includes(name.toLowerCase()) ||
                user.note?.toLowerCase().includes(name.toLowerCase()) ||
                user.email?.toLowerCase().includes(name.toLowerCase());
        });
    }

    // Filter by status
    if (status !== 'all') {
        if (status === 'active') {
            inputData = inputData.filter((user) => user.status === 1);
        } else if (status === 'inactive') {
            inputData = inputData.filter((user) => user.status === 2);
        } else if (status === 'previous') {
            inputData = inputData.filter((user) => user.status === 3);
        }
    }

    // Filter by role
    if (role.length) {
        inputData = inputData.filter((user) => role.includes(user.role));
    }

    // Filter by property type
    if (property_type?.length) {
        inputData = inputData.filter((user) =>
            user.property_type.some((type) => property_type.includes(type))
        );
    }

    // Filter by  Finance
    if (finance.length) {
        inputData = inputData.filter((user) => finance.includes(user.finance));
    }

    // Filter by Country
    if (location.length) {
        inputData = inputData.filter((user) => location.includes(user.location));
    }

    // Filter by State
    if (stateId.length) {
        inputData = inputData.filter((user) => stateId.includes(user.state_id));
    }

    // Filter by City
    if (cityId.length) {
        inputData = inputData.filter((user) => cityId.includes(user.city_id));
    }

    // Filter by number of bedrooms
    if (no_of_bathrooms?.length) {
        inputData = inputData.filter((user) =>
            user.no_of_bathrooms.some((type) => no_of_bathrooms.includes(type))
        );
    }

    // Filter by amenities
    if (amenities?.length) {
        inputData = inputData.filter((user) => user.amenities.some((type) => amenities.includes(type)));
    }

    // **Correct filtering for range_min and range_max**
    if (range_min !== undefined && range_min !== null) {
        inputData = inputData.filter((user) => user.range_min >= range_min);
    }

    if (range_max !== undefined && range_max !== null) {
        inputData = inputData.filter((user) => user.range_max <= range_max);
    }

    if (parking) {
        inputData = inputData.filter((user) =>
            user.parking?.toLowerCase().includes(parking.toLowerCase())
        );
    }

    if (account_type) {
        inputData = inputData.filter((user) =>
            user.account_type?.toLowerCase().includes(account_type.toLowerCase())
        );
    }

    if (property_status) {
        inputData = inputData.filter((user) => user.property_status === property_status);
    }

    return inputData;
}

