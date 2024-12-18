import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSettingsContext } from 'src/components/settings';
import { useGetEvents } from 'src/api/calendar';
import { useEffect, useState } from 'react';
import { differenceInMinutes, isToday } from 'date-fns';
import { Alert, Snackbar } from '@mui/material';
import NavVertical from './nav-vertical';
import NavHorizontal from './nav-horizontal';
import Main from './main';
import Header from './header';
import NavMini from './nav-mini';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const settings = useSettingsContext();
  const [reminders, setReminders] = useState([]);
  const [open, setOpen] = useState({});
  const { events } = useGetEvents();
  const lgUp = useResponsive('up', 'lg');
  const nav = useBoolean();

  const isHorizontal = settings.themeLayout === 'horizontal';
  const isMini = settings.themeLayout === 'mini';

  const renderNavMini = <NavMini />;
  const renderHorizontal = <NavHorizontal />;
  const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />;

  useEffect(() => {
    const checkReminders = () => {
      const currentTime = new Date();
      const upcomingEvents = events?.filter(event => {
        const eventStart = new Date(event.start);
        const timeDiff = differenceInMinutes(eventStart, currentTime);
        return timeDiff >= 0 && timeDiff <= 1440 && isToday(eventStart); // Events in the next 24 hours
      });

      setReminders(upcomingEvents);

      const openState = {};
      upcomingEvents?.forEach(event => {
        openState[event.id] = true; // Open each Snackbar initially
      });
      setOpen(openState);
    };

    checkReminders(); // Check initially
    const interval = setInterval(checkReminders, 6000);
    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [events]);

  const handleClose = (eventId) => {
    setOpen((prev) => ({
      ...prev,
      [eventId]: false, // Close only the specific snackbar
    }));
  };

  const renderSnackbars = () => {
    console.log("data");

    return reminders?.map((event, index) => (
      <Snackbar
        key={event.id}
        open={open[event.id] || false}
        autoHideDuration={6000}
        onClose={() => handleClose(event.id)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        style={{ marginTop: index * 60 }} // Adjust margin for stacking
      >
        <Alert onClose={() => handleClose(event.id)} severity="info" sx={{ width: '100%' }}>
          Reminder: {event.title} is starting at {new Date(event.start).toLocaleTimeString()}!
        </Alert>
      </Snackbar>
    ));
  };

  if (isHorizontal) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />
        {lgUp ? renderHorizontal : renderNavVertical}
        <Main>{children}</Main>
      </>
    );
  }

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />
        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}
          <Main>{children}</Main>
        </Box>
        {renderSnackbars()} {/* Render the snackbars */}
      </>
    );
  }

  return (
    <>
      <Header onOpenNav={nav.onTrue} />
      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        {renderNavVertical}
        <Main>{children}</Main>
      </Box>
      {renderSnackbars()} {/* Render the snackbars */}
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
