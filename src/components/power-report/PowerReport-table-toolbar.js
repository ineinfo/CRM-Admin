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
import { useCountryData, UsegetFinance, UsegetPropertiesType, UsegetPropertySatatus } from 'src/api/propertytype'; // Assuming this fetches the property type data
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

    useEffect(() => {
        if (getCountries.data) {
            setCountries(getCountries.data.data);
        }
    }, [getCountries.data]);

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
            onFilters('location', selectedCountry);
            const selectedCountryData = CountryOption.find((country) => country.name === selectedCountry);
            console.log("Selected Country", selectedCountryData);

            if (selectedCountryData) {
                setCurrency(selectedCountryData.currency);
            }
        },
        [onFilters, CountryOption]
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
                <FormControl
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
                                    checked={filters.property_type?.includes(option.id)}
                                />
                                {option.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Number of Bedrooms Select */}
                <FormControl
                    sx={{
                        flexShrink: 0,
                        width: { xs: 1, md: 200 },
                    }}
                >
                    <InputLabel>Bedrooms</InputLabel>
                    <Select
                        multiple
                        value={filters.no_of_bathrooms || []}
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
                                    checked={filters.no_of_bathrooms?.includes(number)}
                                />
                                {number}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Amenities Select */}
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
                </FormControl>

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

                    <IconButton onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
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

            <Stack
                spacing={1}
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
                        width: { xs: 1, md: 450 },
                        p: 2,
                    }}
                >
                    <InputLabel shrink>Price Range {currency ? `in ${currency}` : ''}</InputLabel>
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

            </Stack>
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
                <FormControl
                    sx={{
                        flexShrink: 0,
                        width: { xs: 1, md: 200 },
                    }}
                >
                    <InputLabel>Finance</InputLabel>
                    <Select
                        value={filters.finance || ''}
                        onChange={(event) => onFilters('finance', event.target.value)}
                        input={<OutlinedInput label="Finance" />}
                    >
                        {FinancesOption.map((option) => (
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
                >
                    <InputLabel>Country</InputLabel>
                    <Select
                        value={filters.location || ''}
                        onChange={handleFilterCountry}
                        input={<OutlinedInput label="Country" />}
                    >
                        {CountryOption.map((option) => (
                            <MenuItem key={option.id} value={option.name}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>
        </>
    );
}

UserTableToolbar.propTypes = {
    filters: PropTypes.object,
    onFilters: PropTypes.func,
};
