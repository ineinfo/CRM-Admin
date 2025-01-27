import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fCurrency, fShortenNumber } from 'src/utils/format-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useTheme } from '@mui/material';

// ----------------------------------------------------------------------

export default function AppTopRelated({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, minWidth: 360 }}>
          {list.map((app) => (
            <ApplicationItem key={app.id} app={app} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

AppTopRelated.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function ApplicationItem({ app }) {
  const theme = useTheme();

  const { avatarUrl, name, sales, thisMonthPosition, lastMonthPosition } = app;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar
        variant="rounded"
        src={avatarUrl}
        sx={{
          width: 48,
          height: 48,
          bgcolor: 'background.neutral',
        }}
      />
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
        <Stack direction="row" alignItems="center" sx={{ mt: 0.5, color: 'text.secondary' }}>
          <Typography variant="caption" sx={{ ml: 0.5, mr: 1 }}>
            {fCurrency(sales)}
          </Typography>
        </Stack>
      </Box>
      <Stack alignItems="flex-end">
        <Typography variant="caption" sx={{ mt: 0.5, color: theme.palette.primary.main, fontWeight: 'bold', fontSize: '16px' }}>
          {thisMonthPosition}
        </Typography>
        <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
          Last Month: {lastMonthPosition}
        </Typography>
      </Stack>
    </Stack>
  );
}

ApplicationItem.propTypes = {
  app: PropTypes.object,
};
