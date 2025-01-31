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
import { useCityData, useCountryData, UsegetFinance, UsegetPropertiesType, UsegetPropertySatatus, useStateData } from 'src/api/propertytype'; // Assuming this fetches the property type data
import { UsegetAmenities } from 'src/api/amenities'; // Assuming this fetches the amenities data
import { Slider } from '@mui/material';

// ----------------------------------------------------------------------

export default function UserTableToolbar({ filters, onFilters }) {
  const popover = usePopover();
  const getCountries = useCountryData();
  const [countries, setCountries] = useState([]);
  const [currency, setCurrency] = useState();

  // Fetch property types
  const { products: propertyTypes } = UsegetPropertiesType();

  // Fetch amenities
  const { products: amenities } = UsegetAmenities();
  const { propertyStatus: propertyStatuses } = UsegetPropertySatatus();
  const { finance: finances } = UsegetFinance();

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const getStates = useStateData(selectedCountry);
  const getCities = useCityData(selectedState);

  useEffect(() => {
    if (getCountries.data) {
      setCountries(getCountries.data.data);
    }
  }, [getCountries.data]);

  useEffect(() => {
    if (getStates.data) {
      setStates(getStates.data.data);
    }
  }, [getStates.data]);

  useEffect(() => {
    if (getCities.data) {
      setCities(getCities.data.data);
    }
  }, [getCities.data]);

  useEffect(() => {
    if (!filters.location) {
      setSelectedCountry('');
      setCurrency('');
      setSelectedState('');
      setStates([]);
      setCities([]);
    }
  }, [filters.location]);

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

  const CountryOption = countries.map((type) => ({
    id: type.id,
    name: type.name,
    currency: type.currency,
  }));


  const FinancesOption = finances.length > 0 && finances[0]
    ? Object.entries(finances[0]).map(([key, value]) => ({
      id: key,
      name: value,
    }))
    : [];


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
      onFilters('no_of_bathrooms', selectedBedrooms);
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

  const handleFilterCountry = useCallback(
    (event) => {
      const selectedCountry = event.target.value;
      const selectedCountryData = CountryOption.find((country) => country.id === selectedCountry);
      onFilters('location', selectedCountryData ? selectedCountryData.name : '');
      setCurrency(selectedCountryData ? selectedCountryData.currency : '');
      setSelectedCountry(selectedCountryData ? selectedCountryData.id : '');
      setSelectedState('');
      setCities([]);
    },
    [onFilters, CountryOption]
  );

  const handleFilterState = useCallback(
    (event) => {
      const selectedState = event.target.value;
      onFilters('stateId', selectedState);
      setSelectedState(selectedState);
      setCities([]);
    },
    [onFilters]
  );

  const handleFilterCity = useCallback(
    (event) => {
      const selectedCity = event.target.value;
      onFilters('cityId', selectedCity);
    },
    [onFilters]
  );

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


          <FormControl
            sx={{
              flexShrink: 0,
              width: { xs: 1, md: 200 },
            }}
          >
            <InputLabel>Country</InputLabel>
            <Select
              value={selectedCountry || ''}
              onChange={handleFilterCountry}
              input={<OutlinedInput label="Country" />}
            >
              {CountryOption.map((option) => (
                <MenuItem key={option.id} value={option.id}>
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
            disabled={!selectedCountry}
          >
            <InputLabel>State</InputLabel>
            <Select
              value={selectedState || ''}
              onChange={handleFilterState}
              input={<OutlinedInput label="State" />}
            >
              {states.map((option) => (
                <MenuItem key={option.id} value={option.id}>
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
            disabled={!selectedState}
          >
            <InputLabel>City</InputLabel>
            <Select
              value={filters.cityId || ''}
              onChange={handleFilterCity}
              input={<OutlinedInput label="City" />}
            >
              {cities.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
        </Stack>
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


    </>
  );
}

UserTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
};
