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
import { ArchiveLead, DeleteLead } from 'src/api/leads';

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
import { useAuthContext } from 'src/auth/hooks';
import Label from 'src/components/label';
import { alpha, Tab, Tabs } from '@mui/material';
import UserTableToolbar from '../leads-table-toolbar';
import UserTableFiltersResult from '../leads-table-filters-result';
import UserTableRow from '../leads-table-row';
import Invoice from '../Invoice';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'previous', label: 'Previous' },
];
const TABLE_HEAD = [
  { id: 'customer_name', label: 'Name', width: 180 },
  { id: 'customer_mobile', label: 'Phone', width: 180 },
  { id: 'handover_date', label: 'Move in date', width: 120 },
  { id: 'email', label: 'Email', width: 100 },
  { id: 'Followup_date', label: 'Followup date', width: 130 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 50 },
  { id: '', width: 50 },
  // { id: '', width: 50 },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function UserListView() {
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
        const response = await axios.get(endpoints.leads.list);
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
        const response = await axios.get(endpoints.leads.list); // Update with your API endpoint
        console.log('required_response', response.data.data);

        setTableData(response.data.data);
      } catch (err) {
        console.log(err);
        enqueueSnackbar('Failed to load data', { variant: 'error' });
      }
    };
    fetchData();
  }, [enqueueSnackbar]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
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

  const handleArchiveRow = useCallback(
    async (id) => {
      try {
        await ArchiveLead(id, Token);
        const deleteRow = tableData.filter((row) => row.id !== id);

        enqueueSnackbar('Archeived success!');

        setTableData(deleteRow);
      } catch (error) {
        enqueueSnackbar('Archive failed!', { variant: 'error' });
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
            { name: 'Leads', href: paths.dashboard.leads.list },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.leads.new}
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
          <Tabs
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
                        user?.followup?.some((followup) => {
                          const followupDate = new Date(followup.followup_date);
                          const today = new Date();
                          const oneWeekFromNow = new Date(today);
                          oneWeekFromNow.setDate(today.getDate() + 7);
                          const thirtyDaysFromNow = new Date(today);
                          thirtyDaysFromNow.setDate(today.getDate() + 30);
                          if (tab.value === 'active') {
                            return followupDate >= today && followupDate <= oneWeekFromNow;
                          } else if (tab.value === 'inactive') {
                            return followupDate > oneWeekFromNow && followupDate <= thirtyDaysFromNow;
                          } else if (tab.value === 'previous') {
                            return followupDate < today;
                          }
                          return false;
                        })
                      ).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}


          </Tabs>

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
                        onArchiveRow={() => handleArchiveRow(row.id)}
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
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // Filter by name (assuming the 'developer_name' or 'owner_name' needs filtering by the 'name' filter)
  if (filters.name) {
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

  // Filter by followup_date
  const today = new Date();
  const oneWeekFromNow = new Date(today);
  oneWeekFromNow.setDate(today.getDate() + 7);
  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  if (status !== 'all') {
    inputData = inputData.filter((user) => {
      if (user?.followup?.length === 0) return false;

      return user?.followup?.some((followup) => {
        const followupDate = new Date(followup.followup_date);
        if (status === 'active') {
          return followupDate >= today && followupDate <= oneWeekFromNow;
        } else if (status === 'inactive') {
          return followupDate > oneWeekFromNow && followupDate <= thirtyDaysFromNow;
        } else if (status === 'previous') {
          return followupDate < today;
        }
        return false;
      });
    });
  }

  // Filter by role
  if (role.length) {
    inputData = inputData.filter((user) =>
      role.some((selectedRole) => user.role.includes(selectedRole))
    );
  }

  return inputData;
}
