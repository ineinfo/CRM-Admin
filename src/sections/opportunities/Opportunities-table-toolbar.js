import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { UseCityData, useCountryData, UsegetPropertiesType, UsegetPropertySatatus, UseStateData } from 'src/api/propertytype'; // Assuming this fetches the property type data
import { UsegetAmenities } from 'src/api/amenities'; // Assuming this fetches the amenities data
import { Slider } from '@mui/material';

// ----------------------------------------------------------------------

export default function UserTableToolbar({ filters, onFilters }) {
  const popover = usePopover();
  const getCountries = useCountryData();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryId, setCountryId] = useState(null);
  const [stateId, setStateId] = useState(null);


  // Fetch property types
  const { products: propertyTypes } = UsegetPropertiesType();

  // Fetch amenities
  const { products: amenities } = UsegetAmenities();
  const { propertyStatus: propertyStatuses } = UsegetPropertySatatus();


  useEffect(() => {
    if (getCountries.data) {
      setCountries(getCountries.data.data);
    }
  }, [getCountries.data]);

  useEffect(() => {
    if (countryId) {

      const filteredCountry = countries.filter((country) => country.name === countryId);
      console.log("Countryyryr", filteredCountry[0].id);

      const c_id = filteredCountry[0].id || 0
      UseStateData(c_id).then((response) => setStates(response.data));
    } else {
      setStates([]);
    }
  }, [countryId]);

  // Fetch cities when stateId changes
  useEffect(() => {
    if (stateId) {
      UseCityData(stateId).then((response) => setCities(response.data));
    } else {
      setCities([]);
    }
  }, [stateId]);

  console.log("Filter", filters);

  // Mapping property type options from property types data
  const propertyTypeOptions = propertyTypes.map((type) => ({
    id: type.id,
    name: type.property_type,
  }));

  // Mapping amenities options from amenities data
  const amenityOptions = amenities.map((type) => ({
    id: type.id,
    name: type.amenity_name,
  }));

  const propertyStatusesOption = propertyStatuses.map((type) => ({
    id: type.id,
    name: type.title,
  }));

  const countryOptions = countries.map((type) => ({
    id: type.id,
    name: type.name,
  }));

  const stateOptions = states?.map((type) => ({
    id: type.id,
    name: type.name,
  }));
  console.log("States", states);

  const cityOptions = cities?.map((type) => ({
    id: type.id,
    name: type.name,
  }));

  // Generate a list of bedroom numbers (1 to 10)
  const bedroomOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterPropertyType = useCallback(
    (event) => {
      const selectedIds = Array.isArray(event.target.value)
        ? event.target.value
        : event.target.value.split(',');
      onFilters('property_type', selectedIds);
    },
    [onFilters]
  );

  const handleFilterBedrooms = useCallback(
    (event) => {
      const selectedBedrooms = Array.isArray(event.target.value)
        ? event.target.value
        : event.target.value.split(',');
      onFilters('no_of_bedrooms', selectedBedrooms);
    },
    [onFilters]
  );

  const handleFilterAmenities = useCallback(
    (event) => {
      const selectedIds = Array.isArray(event.target.value)
        ? event.target.value
        : event.target.value.split(',');
      onFilters('amenities', selectedIds); // Save selected amenities as array
    },
    [onFilters]
  );

  const handleRangeChange = (event, newValue) => {
    onFilters('range_min', newValue[0]); // Save range_min value
    onFilters('range_max', newValue[1]); // Save range_max value
  };

  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value;
    setCountryId(selectedCountryId);
    setStates([])
    onFilters('location', selectedCountryId);
    setStateId(null); // Reset state and city when country changes
    setCities([]);
  };

  const handleStateChange = (event) => {
    const selectedStateId = event.target.value;
    setStateId(selectedStateId);
    onFilters('state', selectedStateId);
  };

  const handleCityChange = (event) => {
    const selectedCityId = event.target.value;
    onFilters('city', selectedCityId);
  };

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        {/* <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Property Type</InputLabel>
          <Select
            multiple
            value={filters.property_type || []}
            onChange={handleFilterPropertyType}
            input={<OutlinedInput label="Property Type" />}
            renderValue={(selected) =>
              selected
                .map(
                  (value) => propertyTypeOptions.find((type) => type.id === value)?.name || value
                )
                .join(', ')
            }
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {propertyTypeOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.property_type.includes(option.id)}
                />
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Bedrooms</InputLabel>
          <Select
            multiple
            value={filters.no_of_bedrooms || []}
            onChange={handleFilterBedrooms}
            input={<OutlinedInput label="Bedrooms" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {bedroomOptions.map((number) => (
              <MenuItem key={number} value={number}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.no_of_bedrooms?.includes(number)}
                />
                {number}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Amenities</InputLabel>
          <Select
            multiple
            value={filters.amenities || []}
            onChange={handleFilterAmenities}
            input={<OutlinedInput label="Amenities" />}
            renderValue={(selected) =>
              selected
                .map(
                  (value) => amenityOptions.find((amenity) => amenity.id === value)?.name || value
                )
                .join(', ')
            }
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {amenityOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.amenities?.includes(option.id)}
                />
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />


        </Stack>

        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel>Country</InputLabel>
          <Select
            value={filters.location || ''}
            onChange={handleCountryChange}
            input={<OutlinedInput label="Country" />}
          >
            {countryOptions.map((option) => (
              <MenuItem key={option.id} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* State Dropdown */}
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }} disabled={!countryId}>
          <InputLabel>State</InputLabel>
          <Select
            value={filters.state || ''}
            onChange={handleStateChange}
            input={<OutlinedInput label="State" />}
          >
            {stateOptions?.length > 0 ? stateOptions?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            )) : <MenuItem disabled>
              No States Available
            </MenuItem>}
          </Select>
        </FormControl>

        {/* City Dropdown */}
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }} disabled={!stateId}>
          <InputLabel>City</InputLabel>
          <Select
            value={filters.city || ''}
            onChange={handleCityChange}
            input={<OutlinedInput label="City" />}
          >
            {cityOptions?.length > 0 ? cityOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            )) : <MenuItem disabled>
              No Cities Available
            </MenuItem>}
          </Select>
        </FormControl>

        <IconButton onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem onClick={popover.onClose}>
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem onClick={popover.onClose}>
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem onClick={popover.onClose}>
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>

      {/* <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 300 },
            p: 2,
          }}
        >
          <InputLabel shrink>Price Range</InputLabel>
          <Slider
            value={[filters.range_min || 0, filters.range_max || 20000]}
            onChange={handleRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={20000}
          // marks={marks} // Optional for better UX
          />
        </FormControl>

        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Parking</InputLabel>
          <Select
            value={filters.parking || ''}
            onChange={(event) => onFilters('parking', event.target.value)}
            input={<OutlinedInput label="Parking" />}
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Account Type</InputLabel>
          <Select
            value={filters.account_type || ''}
            onChange={(event) => onFilters('account_type', event.target.value)}
            input={<OutlinedInput label="account_type" />}
          >
            <MenuItem value="freehold">Freehold</MenuItem>
            <MenuItem value="leasehold">Leasehold</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Property Status</InputLabel>
          <Select
            value={filters.property_status || ''}
            onChange={(event) => onFilters('property_status', event.target.value)}
            input={<OutlinedInput label="Property Status" />}
          >
            {propertyStatusesOption.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack> */}
    </>
  );
}

UserTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
};
