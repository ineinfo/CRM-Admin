"use client"

import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Logo from 'src/components/logo';
import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';

import Searchbar from '../common/searchbar';
import { NAV, HEADER } from '../config-layout';
import SettingsButton from '../common/settings-button';
import AccountPopover from '../common/account-popover';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { endpoints } from 'src/utils/axios';
import dayjs from 'dayjs';
import { Box, Button, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';
import { CloseIcon } from 'yet-another-react-lightbox';
import NotificationsIcon from '@mui/icons-material/Notifications';
// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const theme = useTheme();
  const [followupData, setFollowupData] = useState([]);

  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state) => {
    setOpen(state);
  }
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


  const today = dayjs().startOf("day"); // Start of the current day for accurate comparison

  // Filter today's follow-ups based on the 'followup_date'
  const todaysFollowups = followupData.filter((item) =>
    dayjs(item.followup_date).isSame(today, "day")
  );

  console.log("FollowupData535", todaysFollowups);



  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      <Searchbar />

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
      >
        <SettingsButton />
        <AccountPopover />
        <Button
          variant="text"
          color="primary"
          startIcon={<NotificationsIcon />}
          onClick={() => toggleDrawer(true)}

        />
      </Stack>


      <Drawer anchor="right" open={open} onClose={() => toggleDrawer(false)}>
        <Box
          sx={{
            width: 350,
            padding: 2,
            backgroundColor: 'black',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">Notifications</Typography>
            <IconButton onClose={() => toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Notification List */}
          <List>
            {todaysFollowups.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  backgroundColor: 'grey',
                  marginBottom: 1,
                  borderRadius: 1,
                  boxShadow: 1,
                  padding: 2,
                }}
              >
                <ListItemText
                  primary={`${notification.lead_first_name} ${notification.lead_last_name}`}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {notification.summary}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notification.followup_date).toLocaleDateString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>




    </>
  );

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
