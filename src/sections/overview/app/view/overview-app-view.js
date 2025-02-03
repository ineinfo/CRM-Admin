"use client"

import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled, _topUsers } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import { Alert, alpha, Box, Card, CardContent, CardHeader, List, ListItem, Paper, Snackbar, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material';
import { useGetEvents } from 'src/api/calendar';
import { isToday } from 'date-fns'; // Importing isToday for date comparison
import AppTopInstalledCountries from '../app-top-installed-countries';
import AppTopAuthors from '../app-top-authors';
import AppWidgetSummary from '../app-widget-summary';
import AppWidget from '../app-widget';
import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
import AppNewInvoice from '../app-new-invoice';
import AppTopRelated from '../app-top-related';
import AppAreaInstalled from '../app-area-installed';
import AppCurrentDownload from '../app-current-download';
import { endpoints } from 'src/utils/axios';
import { enqueueSnackbar } from 'notistack';
import axios from 'axios';
import dayjs from 'dayjs';
import { CalendarView } from 'src/sections/calendar/view';
import { useAuthContext } from 'src/auth/hooks';
import { UsegetRoles } from 'src/api/roles';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  // const { user } = useMockedUser();
  const theme = useTheme();
  const { events } = useGetEvents();
  const settings = useSettingsContext();
  const [todayData, setTodayData] = useState([]);
  const [previousData, setPreviousData] = useState([]);
  const [futureData, setFutureData] = useState([]);
  const [followupData, setFollowupData] = useState([]);
  const [todaysEvents, setTodaysEvents] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [openFollowups, setOpenFollowups] = useState([]);  // Track open state for each follow-up
  const [pastEvents, setPastEvents] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [agent, setAgent] = useState(false);
  const { products: roles } = UsegetRoles();
  // const [open, setOpen] = useState(true);
  // const today = dayjs().format("YYYY-MM-DD");

  const { user } = useAuthContext()
  const fetchRoles = (data) => {
    const userRole = data.find(role => role.id === user.role_id);
    // if (userRole && userRole.role_name === 'Super Admin' || userRole.role_name === 'Colleagues and Agents') {
    if (userRole && userRole.role_name === 'Super Admin') {
      setShow(true);
    }
    if (userRole && userRole.role_name === 'Colleagues and Agents') {
      setShow(true);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRoles(roles);
    }
  }, [user, roles]);


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
  }, []); // This runs once when the component mounts

  console.log("FollowupData", followupData.slice(40));

  const today = dayjs().startOf("day"); // Start of the current day for accurate comparison

  // Filter today's follow-ups based on the 'followup_date'
  const todaysFollowups = followupData.filter((item) =>
    dayjs(item.followup_date).isSame(today, "day")
  );

  // Initialize the open state when the component mounts
  useEffect(() => {
    if (todaysFollowups.length > 0 && openFollowups.length === 0) {
      setOpenFollowups(new Array(todaysFollowups.length).fill(true));
    }
  }, [todaysFollowups]); // This will only run once, when 'todaysFollowups' is set for the first time
  const handleClose = (index) => {
    console.log(`Closing Snackbar at index: ${index}`);

    setOpenFollowups((prevState) => {
      console.log("Previous State:", prevState);

      // Create a new array with updated state where only the targeted index is closed
      const newState = [...prevState];
      newState[index] = false;  // Close the specific Snackbar at the given index

      console.log("Closing Snackbar at index: 222", newState);
      return newState;
    });
  };
  const handleCloseauto = (index) => {
    console.log(`Closing Snackbar at index: ${index}`);

    setOpenFollowups((prevState) => {
      console.log("Previous State:", prevState);

      // Create a new array with updated state where only the targeted index is closed
      const newState = [...prevState];
      newState[index] = false;  // Close the specific Snackbar at the given index

      console.log("Closing Snackbar at index: 222", newState);
      return newState;
    });
  };


  useEffect(() => {
    const today = dayjs().startOf('day');

    // Sorting Helper Function
    // const sortByDate = (data, ascending = true) => {
    //   return data.sort((a, b) => {
    //     const dateA = dayjs(a.followup_date);
    //     const dateB = dayjs(b.followup_date);
    //     return ascending ? dateA.diff(dateB) : dateB.diff(dateA);
    //   });
    // };

    // Filtering Data
    const todayDataFiltered = followupData.filter(item =>
      dayjs(item.followup_date).isSame(today, 'day')
    );

    const previousDataFiltered = followupData
      .filter(item => dayjs(item.followup_date).isBefore(today, 'day'))
      .sort((a, b) => dayjs(b.followup_date).diff(dayjs(a.followup_date))); // Sort Descending for Previous

    const futureDataFiltered = followupData
      .filter(item => dayjs(item.followup_date).isAfter(today, 'day'))
      .sort((a, b) => dayjs(a.followup_date).diff(dayjs(b.followup_date))); // Sort Ascending for Future

    // Setting State
    setTodayData(todayDataFiltered);
    setPreviousData(previousDataFiltered);
    setFutureData(futureDataFiltered);
  }, [followupData]);

  // const todaysFollowups = followupData.filter((item) =>
  //   dayjs(item.followup_date).isSame(today, "date")
  // );

  // console.log("FollowupData1", todaysFollowups);

  // const handleClose = () => {
  //   setOpen(false);
  // };

  useEffect(() => {
    const currentTime = new Date();

    const todayEvents = events?.filter(event => {
      const eventStart = new Date(event.start);
      return isToday(eventStart); // Filter events happening today
    }) || [];

    const upcomingEvents = todayEvents.filter(event => new Date(event.start) > currentTime);
    const completedEvents = todayEvents.filter(event => new Date(event.start) <= currentTime);

    setTodaysEvents(upcomingEvents);
    setPastEvents(completedEvents);
  }, [events]);

  useEffect(() => {
    // Simulate API call to fetch top users
    setTopUsers(_topUsers);
  }, []);

  const allData = [...todayData, ...previousData, ...futureData];

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const renderTable = (data) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell align="left">{`${item.lead_first_name} ${item.lead_last_name}`}</TableCell>
              <TableCell align="left">{dayjs(item.followup_date).format('DD-MM-YYYY')}</TableCell>
              <TableCell align="left" width={'50%'}>{item.summary}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );






  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={24} md={12}>
          <AppWelcome
            title={`Welcome back, ${user?.first_name} 👋 `}
            description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."

            action={
              <Button variant="contained" color="primary">
                Go Now
              </Button>
            }

          />

        </Grid>

        <Grid xs={12} md={6} lg={24}>
          <CalendarView />
        </Grid>

        {/* 
        <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid> */}
        {/* <Grid xs={24} md={12}> */}
        {/* 
          <Tabs value={tabIndex} onChange={handleChange} centered>
            <Tabs
              value={tabIndex}
              onChange={handleChange}
              centered
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  mx: 1,
                  transition: 'all 0.3s ease',
                },
                '& .today': {
                  color: '#2E7D32',
                  '&.Mui-selected': {
                    color: '#1B5E20',
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                  },
                },
                '& .upcoming': {
                  color: '#0277BD',
                  '&.Mui-selected': {
                    color: '#01579B',
                    backgroundColor: 'rgba(2, 119, 189, 0.1)',
                  },
                },
                '& .completed': {
                  color: '#F57F17',
                  '&.Mui-selected': {
                    color: '#E65100',
                    backgroundColor: 'rgba(245, 127, 23, 0.1)',
                  },
                },
                '& .all': {
                  color: '#6A1B9A',
                  '&.Mui-selected': {
                    color: '#4A148C',
                    backgroundColor: 'rgba(106, 27, 154, 0.1)',
                  },
                },
                '& .MuiTabs-indicator': {
                  display: 'none', // Removes the indicator line
                },
              }}
            >
              <Tab label={`Today (${todayData.length})`} className="today" />
              <Tab label={`Upcoming (${futureData.length})`} className="upcoming" />
              <Tab label={`Completed (${previousData.length})`} className="completed" />
              <Tab label={`All (${allData.length})`} className="all" />
            </Tabs>

          </Tabs>
          <Box sx={{ py: 1, borderRadius: 2 }}>
            {tabIndex === 0 && renderTable(todayData)}
            {tabIndex === 1 && renderTable(futureData)}
            {tabIndex === 2 && renderTable(previousData)}
            {tabIndex === 3 && renderTable(allData)}
          </Box> */}
        {/* </Grid> */}


        {/* <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Active Users"
            percent={2.6}
            total={18765}
            chart={{
              series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Installed"
            percent={0.2}
            total={4876}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Downloads"
            percent={-0.1}
            total={678}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid> */}

        {show && (
          <Grid xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title="Total Sales"
              chart={{
                series: [
                  { label: 'GBP', value: 2500 },
                  { label: 'AED', value: 2500 },
                  { label: 'EURO', value: 2500 },
                  { label: 'INR', value: 3000 },
                ],
              }}
              targetValue={10000}  // Set your target value here
            />
          </Grid>
        )}

        {agent && (
          <Grid xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title="Total Sales"
              chart={{
                series: [
                  { label: 'Sale 1', value: 2500 },
                  { label: 'Sale 2', value: 2500 },
                  { label: 'Sale 3', value: 2500 },
                  { label: 'Sale 4', value: 3000 },
                ],
              }}
              targetValue={10000}  // Set your target value here
            />
          </Grid>
        )}

        {show && (
          <Grid xs={12} md={6} lg={8}>
            <AppAreaInstalled
              title="Sales Graph"
              subheader="(+43%) than last year"
              chart={{
                categories: [
                  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                ],
                series: [
                  {
                    year: '2023',
                    data: [
                      { name: 'AED', data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49] },
                      { name: 'GBP', data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77] },
                    ],
                  },
                  {
                    year: '2024',
                    data: [
                      { name: 'AED', data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49] },
                      { name: 'GBP', data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77] },
                    ],
                  },
                  {
                    year: '2025',
                    data: [
                      { name: 'AED', data: [51,] },
                      { name: 'GBP', data: [56,] },
                    ],
                  },
                ],
              }}
            />
          </Grid>
        )}

        {/* <Grid xs={12} md={3}>
          <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.2), borderRadius: 2 }}>
            <CardHeader
              title="Event Reminder"
              titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
              sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.4), color: 'white', borderRadius: '2px 2px 0 0', paddingBottom: "7px" }}
            />
            <CardContent>
              <Typography variant="h6">Upcoming Events:</Typography>
              <List>
                {todaysEvents.length === 0 ? (
                  <ListItem>No upcoming events for today.</ListItem>
                ) : (
                  todaysEvents.map(event => (
                    <ListItem key={event.id}>
                      <Typography variant="body1">
                        {event.title} - {new Date(event.start).toLocaleTimeString()}
                      </Typography>
                    </ListItem>
                  ))
                )}
              </List>

              <Typography variant="h6">Completed Events:</Typography>
              <List>
                {pastEvents.length === 0 ? (
                  <ListItem>No completed events for today.</ListItem>
                ) : (
                  pastEvents.map(event => (
                    <ListItem key={event.id}>
                      <Typography variant="body1">
                        {event.title} - {new Date(event.start).toLocaleTimeString()}
                      </Typography>
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid> */}

        {agent && (
          <Grid xs={12} lg={8}>
            <AppNewInvoice
              title="New Invoice"
              tableData={_appInvoices}
              tableLabels={[
                { id: 'id', label: 'Invoice ID' },
                { id: 'category', label: 'Category' },
                { id: 'price', label: 'Price' },
                { id: 'status', label: 'Status' },
                { id: '' },
              ]}
            />
          </Grid>
        )}

        <Grid xs={12} md={6} lg={4}>
          <AppTopRelated title="Top Users" list={topUsers} />
        </Grid>
        {/* 
        <Grid xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title="Top Authors" list={_appAuthors} />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <Stack spacing={3}>
            <AppWidget
              title="Conversion"
              total={38566}
              icon="solar:user-rounded-bold"
              chart={{
                series: 48,
              }}
            />

            <AppWidget
              title="Applications"
              total={55566}
              icon="fluent:mail-24-filled"
              color="info"
              chart={{
                series: 75,
              }}
            />
          </Stack>
        </Grid> */}

      </Grid>

      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {todaysFollowups.length > 0 &&
          todaysFollowups.map((followup, index) => (
            <Snackbar
              key={followup.id}  // Ensure each Snackbar has a unique key
              open={openFollowups[index]}  // Track open state for each follow-up
              autoHideDuration={8000}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              sx={{ marginTop: `${index * 170}px` }}
              onClose={() => handleCloseauto(index)}
            >

              <Card
                sx={{
                  background: "linear-gradient(135deg, #eceff1, #cfd8dc)",
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      gutterBottom
                      sx={{ color: "#00796b", fontWeight: "bold" }}
                    >
                      Follow-up Reminder 🚀
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#37474f" }}>
                      <strong>Lead Name:</strong> {followup.lead_first_name}{" "}
                      {followup.lead_last_name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#37474f", mt: 1, }}>
                      <strong>Summary:</strong> {followup.summary}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#546e7a", mt: 1, display: "block" }}
                    >
                      Don't forget to follow up with this lead today!
                    </Typography>
                  </CardContent>
                  {/* <div onClose={() => handleCloseauto(index)} style={{ padding: "5px 10px", borderRadius: "50%", background: "black", marginRight: "2px", marginTop: "2px", cursor: "pointer" }}>x</div> */}
                </div>
              </Card>
            </Snackbar>
          ))}
      </Box>


    </Container >
  );
}
