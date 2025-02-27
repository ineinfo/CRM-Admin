import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  results,
  ...other
}) {
  const handleRemoveKeyword = useCallback(() => {
    onFilters('name', '');
  }, [onFilters]);

  const handleRemoveStatus = useCallback(() => {
    onFilters('status', 'all');
  }, [onFilters]);

  const handleRemoveRole = useCallback(
    (inputValue) => {
      const newValue = filters.role.filter((item) => item !== inputValue);
      onFilters('role', newValue);
    },
    [filters.role, onFilters]
  );

  const handleRemoveFirstName = useCallback(() => {
    onFilters('first_name', '');
  }, [onFilters]);

  const handleRemoveLastName = useCallback(() => {
    onFilters('last_name', '');
  }, [onFilters]);

  const handleRemoveLocation = useCallback(() => {
    onFilters('location', '');
  }, [onFilters]);

  const handleRemoveStateId = useCallback(() => {
    onFilters('stateId', '');
  }, [onFilters]);

  const handleRemoveCityId = useCallback(() => {
    onFilters('cityId', '');
  }, [onFilters]);

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.status !== 'all' && (
          <Block label="Status:">
            <Chip size="small" label={filters.status} onDelete={handleRemoveStatus} />
          </Block>
        )}

        {!!filters.role.length && (
          <Block label="Role:">
            {filters.role.map((item) => (
              <Chip key={item} label={item} size="small" onDelete={() => handleRemoveRole(item)} />
            ))}
          </Block>
        )}

        {!!filters.name && (
          <Block label="Keyword:">
            <Chip label={filters.name} size="small" onDelete={handleRemoveKeyword} />
          </Block>
        )}

        {!!filters.first_name && (
          <Block label="First Name:">
            <Chip label={filters.first_name} size="small" onDelete={handleRemoveFirstName} />
          </Block>
        )}

        {!!filters.last_name && (
          <Block label="Last Name:">
            <Chip label={filters.last_name} size="small" onDelete={handleRemoveLastName} />
          </Block>
        )}

        {/* {!!filters.location && (
          <Block label="Location:">
            <Chip label={filters.location} size="small" onDelete={handleRemoveLocation} />
          </Block>
        )}

        {!!filters.stateId && (
          <Block label="State:">
            <Chip label={filters.stateId} size="small" onDelete={handleRemoveStateId} />
          </Block>
        )}

        {!!filters.cityId && (
          <Block label="City:">
            <Chip label={filters.cityId} size="small" onDelete={handleRemoveCityId} />
          </Block>
        )} */}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  );
}

UserTableFiltersResult.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onResetFilters: PropTypes.func,
  results: PropTypes.number,
};

// ----------------------------------------------------------------------

function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}

Block.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  sx: PropTypes.object,
};
