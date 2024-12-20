import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';
import {
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TableFooter,
  TablePagination,
} from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { endpoints } from 'src/utils/axios';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

export default function AppWelcome({ title, description, action, img, ...other }) {
  const theme = useTheme();
  const [todayData, setTodayData] = useState([]);
  const [previousData, setPreviousData] = useState([]);
  const [futureData, setFutureData] = useState([]);
  const [followupData, setFollowupData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const allData = [...todayData, ...previousData, ...futureData];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(endpoints.followup.list);
        setFollowupData(response.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const today = dayjs().startOf('day');

    const todayDataFiltered = followupData.filter(item =>
      dayjs(item.followup_date).isSame(today, 'day')
    );

    const previousDataFiltered = followupData
      .filter(item => dayjs(item.followup_date).isBefore(today, 'day'))
      .sort((a, b) => dayjs(b.followup_date).diff(dayjs(a.followup_date)));

    const futureDataFiltered = followupData
      .filter(item => dayjs(item.followup_date).isAfter(today, 'day'))
      .sort((a, b) => dayjs(a.followup_date).diff(dayjs(b.followup_date)));

    setTodayData(todayDataFiltered);
    setPreviousData(previousDataFiltered);
    setFutureData(futureDataFiltered);
  }, [followupData]);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderTable = (data) => {
    const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', }}>
        <Table>
          <TableHead sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
            <TableRow>
              <TableCell width={300} align="left" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>Name</TableCell>
              <TableCell width={180} align="left" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>Date</TableCell>
              <TableCell width={600} align="left" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: alpha(theme.palette.primary.light, 0.05),
                  },
                }}
              >
                <TableCell align="left">{`${item.lead_first_name} ${item.lead_last_name}`}</TableCell>
                <TableCell align="left">{dayjs(item.followup_date).format('DD-MM-YYYY')}</TableCell>
                <TableCell align="left" width={'50%'}>{item.summary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Stack
      flexDirection={{ xs: 'column', md: 'row' }}
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: alpha(theme.palette.primary.light, 0.2),
          endColor: alpha(theme.palette.primary.main, 0.2),
        }),
        height: { md: 1 },
        borderRadius: 2,
        position: 'relative',
        color: 'primary.darker',
        backgroundColor: 'common.white',
        width: "100%"
      }}
      {...other}
    >
      <Stack
        flexGrow={1}
        justifyContent="center"
        alignItems={{ xs: 'center', md: 'flex-start' }}
        sx={{
          p: {
            xs: theme.spacing(5, 3, 0, 3),
            md: theme.spacing(5),
          },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          Your Task
        </Typography>

        <Tabs value={tabIndex} onChange={handleChange} centered>
          <Tab label={`Today (${todayData.length})`} />
          <Tab label={`Upcoming (${futureData.length})`} />
          <Tab label={`Completed (${previousData.length})`} />
          <Tab label={`All (${allData.length})`} />
        </Tabs>

        <Box sx={{ py: 1, borderRadius: 2 }}>
          {tabIndex === 0 && (todayData.length > 0 ? renderTable(todayData) : <>No Data</>)}
          {tabIndex === 1 && (futureData.length > 0 ? renderTable(futureData) : <>No Data</>)}
          {tabIndex === 2 && (previousData.length > 0 ? renderTable(previousData) : <>No Data</>)}
          {tabIndex === 3 && (allData.length > 0 ? renderTable(allData) : <>No Data</>)}
        </Box>

        {/* <Typography
          variant="body2"
          sx={{
            opacity: 0.8,
            maxWidth: 360,
            mb: { xs: 3, xl: 5 },
          }}
        >
          {description}
        </Typography> */}

        {action && action}
      </Stack>

      {img && (
        <Stack
          component="span"
          justifyContent="center"
          sx={{
            p: { xs: 5, md: 3 },
            maxWidth: 380,
            mx: 'auto',

          }}
        >
          {img}
        </Stack>
      )}
    </Stack>
  );
}

AppWelcome.propTypes = {
  img: PropTypes.node,
  action: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
};
