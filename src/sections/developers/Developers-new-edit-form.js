import * as Yup from 'yup';
import PropTypes, { any } from 'prop-types';
import { useMemo, useEffect, useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LoadingButton from '@mui/lab/LoadingButton';
import { formatDate } from '@fullcalendar/core';
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  CircularProgress,
  Checkbox,
  ListItemText,
  Typography,
  TextField,
  InputAdornment,
  Autocomplete,
  Slider,
  FormLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';

import { UsegetAmenities } from 'src/api/amenities';
import {
  UsegetCouncil,
  UsegetParkingType,
  UsegetPropertiesType,
  UsegetPropertySatatus,
  useCityData,
  useCountryData,
  useStateData,
} from 'src/api/propertytype';
import { CreateProperty, UpdateProperty } from 'src/api/properties';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUpload } from 'src/components/hook-form';

export default function PropertyForm({ currentProperty }) {
  const router = useRouter();
  const { products: amenities } = UsegetAmenities();
  const { products: propertyTypes, productsLoading: propertyTypesLoading } = UsegetPropertiesType();
  const { parking: parking, parkingLoading: parkingTypesLoading } = UsegetParkingType();
  const { council: councils } = UsegetCouncil();
  const { propertyStatus: propertyStatus } = UsegetPropertySatatus();
  // console.log('Councils', councils);

  const { enqueueSnackbar } = useSnackbar();
  const [id, setId] = useState(0);
  const [sid, setSid] = useState(0);
  const getCountries = useCountryData();

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedPhonecode, setSelectedPhonecode] = useState();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(currentProperty?.location);
  const [showParkingType, setShowParkingType] = useState(false);

  const handleParkingChange = (event) => {
    const value = event.target.value;
    if (value === 'yes') {
      setShowParkingType(true);
    }
  };

  const PropertySchema = Yup.object().shape({
    developer_name: Yup.string().required('Developer Name is required'),
    // location: Yup.number().required('Location is required'),
    // // city_id: Yup.number().required('Location is required'),
    // state_id: Yup.number().required('Location is required'),
    // starting_price: Yup.number().required('Starting Price is required').positive(),
    // no_of_bathrooms: Yup.array().of(Yup.number()),
    // property_type: Yup.array().of(Yup.number()),
    // parking_option: Yup.array().of(Yup.number()),
    // owner_name: Yup.string().required('Owner Name is required'),
    // amenities: Yup.array().of(Yup.number()),
    email: Yup.string().email('Invalid email format').required('Email is required'), // New validation
    phone_number: Yup.string().required('Mobile number is required'),
    // // handover_date: Yup.date().required('Handover Date is required'),
    // sqft_starting_size: Yup.number().required('Sqft: Starting Size is required').positive(),
    // parking: Yup.string().required('Parking status is required'),
    // furnished: Yup.string().required('Furnishing status is required'),
    // account_type: Yup.string().required('Leasehold/Freehold is required'),
    // // leasehold_length: Yup.number().when('account_type', {
    // //   is: 'Leasehold',
    // //   then: Yup.number().required('Leasehold Length is required').positive(),
    // // }),
    // files: Yup.array().min(1, 'Images are required'),
    // documents: Yup.array().min(1, 'PDF files are required'),
    // service_charges: Yup.number().required('Service Charge is required').positive(),
    // range_min: Yup.number().required('Min range is required').positive(),
    // range_max: Yup.number().required('Max range is required').positive(),
    // pincode: Yup.number().required('Pincode is required'),
    // council_tax_band: Yup.number().required('Council Tax Band is required'),
    // note: Yup.string(),
  });

  const { user } = useAuthContext();
  // console.log("nedded",user.accessToken);
  const Token = user?.accessToken;

  const defaultValues = useMemo(() => {
    // Helper function to check if the file is an image
    const isImage = (filename) => /\.(jpg|jpeg|png|gif)$/i.test(filename);
    // Helper function to check if the file is a PDF
    const isPDF = (filename) => /\.pdf$/i.test(filename);

    return {
      developer_name: currentProperty?.developer_name || '',
      pincode: currentProperty?.pincode || '0',
      service_charges: currentProperty?.service_charges || '0',
      property_type: currentProperty?.property_type || [],
      parking_option: currentProperty?.parking_option || [],
      location: currentProperty?.location || '0',
      state_id: currentProperty?.state_id || '0',
      city_id: currentProperty?.city_id || '0',
      starting_price: currentProperty?.starting_price || '0',
      number_of_bathrooms: currentProperty?.no_of_bathrooms || [],
      owner_name: currentProperty?.owner_name || '',
      handover_date: dayjs(currentProperty?.handover_date).format('DD-MM-YYYY') || '',
      email: currentProperty?.email || '', // New field
      phone_number: currentProperty?.phone_number || '', // New field
      currency: currentProperty?.currency || 'GBP',
      sqft_starting_size: Number(currentProperty?.sqft_starting_size) || '0',
      parking: currentProperty?.parking || 'no',
      furnished: currentProperty?.furnished || 'no',
      account_type: currentProperty?.account_type || 'Freehold',
      leasehold_length: currentProperty?.leasehold_length || '0',
      note: currentProperty?.note || '',
      range_min: currentProperty?.range_min || '0',
      range_max: currentProperty?.range_max || '20000',
      council_tax_band: currentProperty?.council_tax_band || '0',
      property_status: currentProperty?.property_status || '0',
      range_size: [currentProperty?.range_min || 0, currentProperty?.range_max || 20000],
      amenities: currentProperty?.amenities || [],
      files: (currentProperty?.files || [])
        .filter((filename) => isImage(filename))
        .map((filename) => ({
          preview: `${filename}`,
        })),
      documents: (currentProperty?.files || [])
        .filter((filename) => isPDF(filename))
        .map((filename) => ({
          preview: `${filename}`,
        })),
    };
  }, [currentProperty]);

  // console.log("date", selectedDate);

  const methods = useForm({
    resolver: yupResolver(PropertySchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (getCountries.data) {
      setCountries(getCountries.data.data);
    }
  }, [getCountries.data]);

  useEffect(() => {
    if (currentProperty) {
      setId(currentProperty.location || '');
      setSid(currentProperty.state_id || '');
    }
  }, [currentProperty, id, sid]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const data = await useStateData(id);
        setStates(data.data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    if (id) {
      fetchStates();
    }
  }, [id, selectedState, currentProperty]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const data = await useCityData(sid);
        setCities(data.data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    if (sid) {
      fetchStates();
    }
  }, [sid, selectedCity, currentProperty, selectedCountry, id]);

  // Handles when the user manually selects a country
  useEffect(() => {
    if (selectedCountry) {
      const country = countries.find((c) => c.name === selectedCountry);
      if (country) {
        setSelectedCurrency(country.currency);
        setSelectedPhonecode(country.phonecode);
        setId(country.id);
        setValue('state_id', 0); // Reset city ID when country changes
        setValue('pincode', 0); // Reset city ID when country changes

        setValue('city_id', 0); // Reset city ID when country changes
      }
    }
  }, [selectedCountry, countries, setValue]);

  // Handles when the current property is loaded
  useEffect(() => {
    if (currentProperty) {
      const locationId = currentProperty?.location; // Get location ID from currentProperty
      if (locationId) {
        const matchedCountry = countries.find((country) => country.id === locationId);
        if (matchedCountry) {
          console.log('Matched Country:1', matchedCountry); // Verify the matched country
          setSelectedCountry(matchedCountry.name); // Set the country based on location ID
          setSelectedCurrency(matchedCountry.currency);
          setSelectedPhonecode(matchedCountry.phonecode);
          // setId(matchedCountry.id); // Set the country ID
          setValue('city_id', currentProperty?.city_id);
          setValue('state_id', currentProperty?.state_id);
          setValue('pincode', currentProperty?.pincode);
        }
      }
      setValue(
        'setShowParkingType',
        currentLead?.parking === 'yes' ? setShowParkingType(true) : ''
      );
    }
  }, [currentProperty, countries, setValue]);

  useEffect(() => {
    setSelectedDate(dayjs(currentProperty?.handover_date).format('DD-MM-YYYY'));
  }, [selectedDate]);

  useEffect(() => {
    reset(defaultValues);
    console.log('defaultValuesdefaultValues', defaultValues);
  }, [currentProperty, reset, defaultValues]);

  const handleDropPdf = useCallback(
    async (acceptedFiles) => {
      const files = values.documents || [];
      const newFiles = await Promise.all(
        acceptedFiles.map(async (file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      setValue('documents', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.documents]
  );

  const handleRemovePdf = useCallback(
    (inputFile) => {
      const filtered = values.pdfFiles.filter((file) => file.preview !== inputFile.preview);
      setValue('pdfFiles', filtered);
    },
    [setValue, values.pdfFiles]
  );

  const onSubmit = handleSubmit(async (data) => {
    console.log('data+++++++++++=>', data);

    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (
          key === 'parking_option' ||
          key === 'property_type' ||
          key === 'amenities' ||
          key === 'number_of_bathrooms'
        ) {
          // Convert specific keys to JSON string if needed
          formData.append(key, JSON.stringify(data[key]));
        } else if (Array.isArray(data[key])) {
          // Handle array values by appending each item
          data[key].forEach((value) => formData.append(key, value));
        } else {
          // Handle all other values
          formData.append(key, data[key]);
        }
      });

      const fileInputs = document.querySelector('input[type="file"]');
      if (fileInputs && fileInputs.files) {
        Array.from(fileInputs.files).forEach((file) => formData.append('files', file));
      }

      // Log FormData contents
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      if (currentProperty) {
        await UpdateProperty(currentProperty.id, formData, Token);
        enqueueSnackbar('Property updated successfully!', { variant: 'success' });
      } else {
        await CreateProperty(formData, Token);
        enqueueSnackbar('Property created successfully!', { variant: 'success' });
      }
      router.push(paths.dashboard.propertypage.root);
      reset();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Unknown error', { variant: 'error' });
    }
  });

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.files.filter((file) => file.preview !== inputFile.preview);
      setValue('files', filtered);
    },
    [setValue, values.files]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('files', []);
  }, [setValue]);

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const files = values.files || [];
      const newFiles = await Promise.all(
        acceptedFiles.map(async (file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      setTimeout(() => {
        setValue('files', [...files, ...newFiles], { shouldValidate: true });
      }, 10);
    },
    [setValue, values.files]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Property Details
            </Typography>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="developer_name" label="Developer Name" />
              <FormControl fullWidth>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      id="location"
                      options={countries}
                      getOptionLabel={(option) => option.name}
                      value={countries.find((country) => country.id === field.value) || null}
                      onChange={(event, newValue) => {
                        field.onChange(newValue ? newValue.id : '');
                        setSelectedCountry(newValue ? newValue.name : '');
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Location" variant="outlined" />
                      )}
                      isOptionEqualToValue={(option, value) => option.name === value.name}
                    />
                  )}
                />
              </FormControl>
              {states && states.length > 0 && (
                <FormControl fullWidth>
                  <Controller
                    name="state_id"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        id="state_id"
                        options={states}
                        getOptionLabel={(option) => option.name}
                        value={states.find((state) => state.id === field.value) || null}
                        onChange={(event, newValue) => {
                          field.onChange(newValue ? newValue.id : '');
                          setSelectedState(newValue ? newValue.name : '');
                          setSid(newValue ? newValue.id : '');
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="State / City" variant="outlined" />
                        )}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                      />
                    )}
                  />
                </FormControl>
              )}
              {states && states.length > 0 && cities && cities.length > 0 && (
                <FormControl fullWidth>
                  <Controller
                    name="city_id"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        id="city_id"
                        options={cities}
                        getOptionLabel={(option) => option.name}
                        value={cities.find((city) => city.id === field.value) || null}
                        onChange={(event, newValue) => {
                          field.onChange(newValue ? newValue.id : '');
                          setSelectedCity(newValue ? newValue.name : '');
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Area / City" variant="outlined" />
                        )}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                      />
                    )}
                  />
                </FormControl>
              )}
              <RHFTextField name="pincode" label="Postcode" />
              <FormControl fullWidth>
                <RHFTextField
                  name="starting_price"
                  label="Starting Price"
                  variant="outlined"
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <TextField
                          select
                          value={selectedCurrency}
                          variant="standard"
                          sx={{
                            width: 'auto',
                            minWidth: 60,
                            '& .MuiSelect-root': { fontSize: '0.875rem' },
                          }}
                        >
                          {countries.map((country) => (
                            <MenuItem key={country.id} value={country.currency}>
                              {country.currency}
                            </MenuItem>
                          ))}
                        </TextField>
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              </FormControl>
              <RHFTextField name="email" label="Email" />
              <FormControl fullWidth>
                <RHFTextField
                  name="phone_number"
                  label="Mobile Number"
                  type={'mobile'}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="body1">+{selectedPhonecode}</Typography>
                      </InputAdornment>
                    ),
                  }}
                  value={values.phone_number.replace(`+${selectedPhonecode} `, '')} // Remove the country code from the value
                  onChange={(e) => {
                    setValue('phone_number', `${e.target.value}`);
                  }}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="number-of-bathrooms-label">Number of Bathrooms</InputLabel>{' '}
                {/* Added labelId */}
                <Controller
                  name="number_of_bathrooms"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="number-of-bathrooms-label" // Link InputLabel with Select
                      id="number-of-bathrooms-select" // Optional id for select
                      label="Number of Bathrooms" // Add label prop
                      multiple
                      value={field.value || []} // Ensure value is an array
                      onChange={(event) => {
                        field.onChange(event.target.value);
                      }}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {Array.from({ length: 10 }, (_, index) => (
                        <MenuItem key={index + 1} value={index + 1}>
                          <Checkbox checked={field.value.includes(index + 1)} />
                          <ListItemText primary={index + 1} />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
              <Controller
                name="property_type"
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel id="property-type-label">Property Type</InputLabel>{' '}
                    {/* Added labelId */}
                    <Select
                      {...field}
                      labelId="property-type-label" // Link InputLabel with Select
                      id="property-type-select" // Optional id for select
                      label="Property Type" // Add label prop
                      multiple
                      renderValue={(selected) =>
                        selected
                          .map(
                            (id) =>
                              propertyTypes.find((property) => property.id === id)?.property_type
                          )
                          .join(', ')
                      }
                    >
                      {propertyTypes.map((property) => (
                        <MenuItem key={property.id} value={property.id}>
                          <Checkbox checked={field.value.includes(property.id)} />
                          <ListItemText primary={property.property_type} />
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <FormHelperText>{fieldState.error.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <RHFTextField name="owner_name" label="Owner Name" />
              <Controller
                name="council_tax_band"
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel id="council-tax-band-label">Council Tax Band</InputLabel>{' '}
                    {/* Added labelId */}
                    <Select
                      {...field}
                      labelId="council-tax-band-label" // Link InputLabel with Select
                      id="council-tax-band-select" // Optional id for select
                      label="Council Tax Band" // Add label prop
                      value={field.value || ''}
                      onChange={(event) => field.onChange(event.target.value)}
                      renderValue={(selected) => {
                        const selectedCouncil = councils.find((council) => council.id === selected);
                        return selectedCouncil ? selectedCouncil.title : '';
                      }}
                    >
                      {councils &&
                        councils.length > 0 &&
                        councils.map((council) => (
                          <MenuItem key={council.id} value={council.id}>
                            {council.title}
                          </MenuItem>
                        ))}
                    </Select>
                    {fieldState.error && (
                      <FormHelperText>{fieldState.error.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              <FormControl fullWidth>
                {' '}
                <RHFTextField
                  name="handover_date"
                  label="Handover Date"
                  type="date"
                  placeholder="DD-MM-YYYY"
                />
              </FormControl>

              <FormControl fullWidth>
                <Controller
                  name="range_size"
                  control={control}
                  defaultValue={[0, 20000]} // Ensure a default value is set
                  render={({ field }) => (
                    <>
                      <Slider
                        {...field}
                        value={Array.isArray(field.value) ? field.value : [0, 20000]}
                        onChange={(_, newValue) => {
                          const [min, max] = newValue;
                          field.onChange(newValue);
                          setValue('range_min', min); // Update range_min field
                          setValue('range_max', max); // Update range_max field
                        }}
                        valueLabelDisplay="auto"
                        step={100}
                        min={0}
                        max={20000}
                      />
                      <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          Min : {field.value ? `${field.value[0]} sqft` : '0 sqft'}
                        </Typography>
                        <Typography variant="body2">
                          Max : {field.value ? `${field.value[1]} sqft` : '20000 sqft'}
                        </Typography>
                      </Box>
                    </>
                  )}
                />
              </FormControl>
              <FormControl>
                {' '}
                <Controller
                  name="parking"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <InputLabel>Parking</InputLabel>
                      <Select
                        {...field}
                        label="Parking"
                        error={!!fieldState.error}
                        onChange={(event) => {
                          handleParkingChange(event);
                          field.onChange(event.target.value);
                        }}
                      >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                      {fieldState.error && (
                        <FormHelperText>{fieldState.error.message}</FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
              {showParkingType && (
                <FormControl fullWidth>
                  <InputLabel>Parking Type</InputLabel>
                  <Controller
                    name="parking_option"
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <Select
                          {...field}
                          label="Parking Type"
                          multiple
                          value={field.value || []} // Default to an empty array if field.value is undefined
                          onChange={(event) => field.onChange(event.target.value || [])} // Ensure value is an array
                          error={!!fieldState.error}
                          disabled={propertyTypesLoading}
                          sx={{ transition: 'all 0.3s ease' }}
                          renderValue={(selected) => {
                            // Ensure selected is an array
                            return (selected || [])
                              .map((id) => parking.find((type) => type.id === id)?.title)
                              .join(', ');
                          }}
                        >
                          {propertyTypesLoading ? (
                            <MenuItem disabled>
                              <CircularProgress size={24} />
                            </MenuItem>
                          ) : (
                            parking.map((type) => (
                              <MenuItem key={type.id} value={type.id}>
                                <Checkbox checked={(field.value || []).includes(type.id)} />{' '}
                                {/* Ensure field.value is an array */}
                                <ListItemText primary={type.title} />
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        {fieldState.error && (
                          <FormHelperText>{fieldState.error.message}</FormHelperText>
                        )}
                      </>
                    )}
                  />
                </FormControl>
              )}
              <FormControl fullWidth>
                <InputLabel>Furnished</InputLabel>
                <Controller
                  name="furnished"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select {...field} label="Furnished" error={!!fieldState.error}>
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                      {fieldState.error && (
                        <FormHelperText>{fieldState.error.message}</FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Leasehold/Freehold</InputLabel>
                <Controller
                  name="account_type"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select {...field} label="Leasehold/Freehold" error={!!fieldState.error}>
                        <MenuItem value="Leasehold">Leasehold</MenuItem>
                        <MenuItem value="Freehold">Freehold</MenuItem>
                      </Select>
                      {fieldState.error && (
                        <FormHelperText>{fieldState.error.message}</FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
              {values.account_type === 'Leasehold' && (
                <RHFTextField name="leasehold_length" label="Leasehold Length" type={'number'} />
              )}
              <Controller
                name="amenities"
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel id="amenities-label">Amenities</InputLabel> {/* Added labelId */}
                    <Select
                      {...field}
                      labelId="amenities-label" // Link InputLabel with Select
                      id="amenities-select" // Optional id for select
                      label="Amenities" // Add label prop
                      multiple
                      renderValue={(selected) =>
                        selected
                          .map((id) => amenities.find((amenity) => amenity.id === id)?.amenity_name)
                          .join(', ')
                      }
                    >
                      {amenities.map((amenity) => (
                        <MenuItem key={amenity.id} value={amenity.id}>
                          <Checkbox checked={field.value.includes(amenity.id)} />
                          <ListItemText primary={amenity.amenity_name} />
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <FormHelperText>{fieldState.error.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <FormControl fullWidth>
                <RHFTextField
                  name="service_charges"
                  label="Service Charge psqft"
                  variant="outlined"
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <TextField
                          select
                          value={selectedCurrency}
                          variant="standard"
                          sx={{
                            width: 'auto',
                            minWidth: 60,
                            '& .MuiSelect-root': { fontSize: '0.875rem' },
                          }}
                        >
                          {countries.map((country) => (
                            <MenuItem key={country.id} value={country.currency}>
                              {country.currency}
                            </MenuItem>
                          ))}
                        </TextField>
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              </FormControl>
              <Controller
                name="property_status"
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel id="property-status-label">Property Status</InputLabel>{' '}
                    {/* Added labelId */}
                    <Select
                      {...field}
                      labelId="property-status-label" // Link InputLabel with Select
                      id="property-status-select" // Optional id for select
                      label="Property Status" // Add label prop
                      value={field.value || ''}
                      onChange={(event) => field.onChange(event.target.value)}
                      renderValue={(selected) => {
                        const selectedPropertyStatus = propertyStatus.find(
                          (property) => property.id === selected
                        );
                        return selectedPropertyStatus ? selectedPropertyStatus.title : '';
                      }}
                    >
                      {propertyStatus &&
                        propertyStatus.length > 0 &&
                        propertyStatus.map((property) => (
                          <MenuItem key={property.id} value={property.id}>
                            {property.title}
                          </MenuItem>
                        ))}
                    </Select>
                    {fieldState.error && (
                      <FormHelperText>{fieldState.error.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Box sx={{ gridColumn: 'span 2' }}>
                <FormControl fullWidth>
                  <FormLabel sx={{ fontSize: '1.2rem', color: 'white', mb: 1 }}>Images</FormLabel>
                  <RHFUpload
                    multiple
                    thumbnail
                    name="files"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    onRemove={handleRemoveFile}
                    onRemoveAll={handleRemoveAllFiles}
                    onUpload={() => console.log('ON UPLOAD')}
                  />
                  <Typography
                    variant="caption"
                    sx={{ mt: 2, display: 'block', textAlign: 'center', color: 'text.secondary' }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of 3MB
                  </Typography>
                </FormControl>
              </Box>

              <Box sx={{ gridColumn: 'span 2' }}>
                <FormControl fullWidth>
                  <FormLabel sx={{ fontSize: '1.2rem', color: 'white', mb: 1 }}>
                    Documents
                  </FormLabel>
                  <RHFUpload
                    multiple
                    name="documents" // Ensure this matches your form field name
                    maxSize={5242880} // 5MB limit for PDFs
                    accept="application/pdf"
                    onDrop={handleDropPdf}
                    onRemove={handleRemovePdf}
                    onRemoveAll={() => setValue('documents', [])}
                    onUpload={() => console.log('ON UPLOAD')}
                  />
                  <Typography
                    variant="caption"
                    sx={{ mt: 2, display: 'block', textAlign: 'center', color: 'text.secondary' }}
                  >
                    Allowed *.pdf
                    <br /> max size of 5MB
                  </Typography>
                </FormControl>
              </Box>
              <Box sx={{ gridColumn: 'span 2' }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Note
                </Typography>
                <RHFTextField name="note" multiline rows={4} variant="outlined" fullWidth />
              </Box>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 4 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
              >
                {!currentProperty ? 'Create Property' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

PropertyForm.propTypes = {
  currentProperty: PropTypes.object,
};
