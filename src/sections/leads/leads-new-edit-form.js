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
  UsegetFinance,
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
import { CreateLead, UpdateLead } from 'src/api/leads';

export default function PropertyForm({ currentLead }) {
  const router = useRouter();
  const { products: amenities } = UsegetAmenities();
  const { products: propertyTypes, productsLoading: propertyTypesLoading } = UsegetPropertiesType();
  const { parking: parkings, parkingLoading: parkingTypesLoading } = UsegetParkingType();

  const { council: councils } = UsegetCouncil();
  const { finance: finances } = UsegetFinance();

  const { propertyStatus: propertyStatuses } = UsegetPropertySatatus();
  console.log('Councils', finances);
  console.log('Councils', councils);

  const { enqueueSnackbar } = useSnackbar();
  const [id, setId] = useState(0);
  const [sid, setSid] = useState(0);
  const getCountries = useCountryData();
  const [error, setError] = useState(false); // Define the error state

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedPhonecode, setSelectedPhonecode] = useState();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(currentLead?.location);
  const [showParkingType, setShowParkingType] = useState(false);
  const [isCurrentLeadSet, setIsCurrentLeadSet] = useState(false);

  const handleParkingChange = (event) => {
    const value = event.target.value;
    if (value === 'yes') {
      setShowParkingType(true);
    }
    if (value === 'no') {
      setShowParkingType(false);
    }
  };

  // if (currentLead) {
  //   const defaultdate = () => {
  //     const dateString = currentLead?.handover_date;
  //     const date = new Date(dateString);

  //     const day = String(date.getDate()).padStart(2, '0');
  //     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  //     const year = date.getFullYear();
  //     return `${day}-${month}-${year}`;
  //   };
  // }

  const PropertySchema = Yup.object().shape({
    developer_name: Yup.string().required('Lead Name is required'),
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
    // pincode: Yup.string().required('Pincode is required'),
    // council_tax_band: Yup.number().required('Council Tax Band is required'),
    // note: Yup.string(),
    lead_type: Yup.number().positive().required('Lead is required'),
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
      developer_name: currentLead?.developer_name || '',
      pincode: currentLead?.pincode || '0',
      service_charges: currentLead?.service_charges || '0',
      property_type: currentLead?.property_type || [],
      parking_option: currentLead?.parking_option || [],
      location: currentLead?.location || '0',
      state_id: currentLead?.state_id || '0',
      city_id: currentLead?.city_id || '0',
      starting_price: currentLead?.starting_price || '0',
      number_of_bathrooms: currentLead?.no_of_bathrooms || [],
      owner_name: currentLead?.owner_name || '',
      handover_date: dayjs(currentLead?.handover_date).format('DD-MM-YYYY') || null,
      email: currentLead?.email || '', // New field
      phone_number: currentLead?.phone_number || '', // New field
      currency: currentLead?.currency || 'GBP',
      sqft_starting_size: Number(currentLead?.sqft_starting_size) || '0',
      parking: currentLead?.parking || 'no',
      furnished: currentLead?.furnished || 'no',
      account_type: currentLead?.account_type || 'Freehold',
      leasehold_length: currentLead?.leasehold_length || '0',
      note: currentLead?.note || '',
      range_min: currentLead?.range_min || '0',
      range_max: currentLead?.range_max || '20000',
      council_tax_band: currentLead?.council_tax_band || '0',
      lead_type: currentLead?.lead_type || 0,
      finance: currentLead?.finance || '0',
      property_status: currentLead?.property_status || '0',
      range_size: [currentLead?.range_min || 0, currentLead?.range_max || 20000],
      amenities: currentLead?.amenities || [],
      files: (currentLead?.files || [])
        .filter((filename) => isImage(filename))
        .map((filename) => ({
          preview: `${filename}`,
        })),
      documents: (currentLead?.files || [])
        .filter((filename) => isPDF(filename))
        .map((filename) => ({
          preview: `${filename}`,
        })),
    };
  }, [currentLead]);

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

  // useEffect(() => {
  //   if (currentLead) {
  //     setId(currentLead.location || '');
  //     setSid(currentLead.state_id || '');
  //   }
  // }, [currentLead]);

  // useEffect(() => {
  //   const FetchStates = async () => {
  //     try {
  //       const data = await useStateData(id);
  //       console.log('States Data:', data.data); // Log state data for debugging
  //       setStates(data.data);
  //     } catch (stateError) {
  //       console.error('Error fetching states:', stateError);
  //     }
  //   };
  //   if (id) {
  //     FetchStates();
  //   }
  // }, [id]);

  // useEffect(() => {
  //   const FetchCities = async () => {
  //     try {
  //       const data = await useCityData(sid);
  //       console.log('Cities Data:', data.data); // Log city data for debugging
  //       setCities(data.data);
  //     } catch (cityError) {
  //       console.error('Error fetching cities:', cityError);
  //     }
  //   };
  //   if (sid) {
  //     FetchCities();
  //   }
  // }, [sid]);

  useEffect(() => {
    if (selectedCountry && !isCurrentLeadSet) {
      const country = countries.find((c) => c.name === selectedCountry);
      if (country) {
        setSelectedCurrency(country.currency);
        setSelectedPhonecode(country.phonecode);
        setId(country.id);
        // Reset state and city only if country is manually selected, not when currentLead is setting data
        setValue('state_id', 0);
        setValue('city_id', 0);
        setValue('pincode', 0);
      }
    }
  }, [selectedCountry, countries, setValue, isCurrentLeadSet]);

  // Handles when the current property is loaded
  useEffect(() => {
    if (currentLead) {
      const locationId = currentLead?.location;
      const stateId = currentLead?.state_id;
      const cityId = currentLead?.city_id;

      if (locationId) {
        const matchedCountry = countries.find((country) => country.id === locationId);
        if (matchedCountry) {
          setSelectedCountry(matchedCountry.name);
          setSelectedCurrency(matchedCountry.currency);
          setSelectedPhonecode(matchedCountry.phonecode);
          setId(locationId);
          setSid(stateId);
          setValue('city_id', cityId);
          setValue('state_id', stateId);
          setValue('pincode', currentLead?.pincode);
        }
      }

      setShowParkingType(currentLead?.parking === 'yes');
      setIsCurrentLeadSet(true); // Mark that currentLead data has been set
    }
  }, [currentLead, setValue, countries]);

  useEffect(() => {
    const FetchStates = async () => {
      try {
        if (id) {
          const data = await useStateData(id);
          setStates(data.data);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    FetchStates();
  }, [id]);

  useEffect(() => {
    const FetchCities = async () => {
      try {
        if (sid) {
          const data = await useCityData(sid);
          setCities(data.data);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    FetchCities();
  }, [sid]);

  // useEffect(() => {
  //   setSelectedDate(dayjs(currentLead?.handover_date).format('YYYY-MM-DD'));
  // }, [selectedDate]);

  useEffect(() => {
    reset(defaultValues);
    console.log('defaultValuesdefaultValues', defaultValues);
  }, [currentLead, reset, defaultValues]);

  const handleDropPdf = useCallback(
    async (acceptedFiles) => {
      // Filter out non-PDF files
      const pdfFiles = acceptedFiles.filter((file) => file.type === 'application/pdf');

      // Handle invalid files
      if (acceptedFiles.length > pdfFiles.length) {
        setError(true); // Set error if there are non-PDF files
      } else {
        setError(false); // Clear error if all files are PDFs
      }

      // Process PDF files only if valid
      if (pdfFiles.length > 0) {
        const files = values.documents || [];
        const newFiles = await Promise.all(
          pdfFiles.map(async (file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );

        // Update state with valid PDF files
        setValue('documents', [...files, ...newFiles], { shouldValidate: true });
      }
    },
    [setValue, values.documents]
  );

  const handleRemovePdf = useCallback(
    (inputFile) => {
      // Ensure `pdfFiles` is correctly defined and `file.preview` matches the `inputFile.preview`
      const filtered = values.documents.filter((file) => file.preview !== inputFile.preview);
      setValue('documents', filtered);
    },
    [setValue, values.documents]
  );

  const onSubmit = handleSubmit(async (data) => {
    console.log('date', data.handover_date);

    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (
          key === 'parking_option' ||
          key === 'property_type' ||
          key === 'amenities' ||
          key === 'number_of_bathrooms'
        ) {
          formData.append(key, JSON.stringify(data[key]));
        } else if (Array.isArray(data[key])) {
          data[key].forEach((value) => formData.append(key, value));
        } else {
          formData.append(key, data[key]);
        }
      });

      // Handling file inputs
      const fileInputs = document.querySelector('input[type="file"]');
      if (fileInputs && fileInputs.files) {
        Array.from(fileInputs.files).forEach((file) => formData.append('files', file));
      }

      // Log FormData contents
      // for (let pair of formData.entries()) {
      //   console.log(`${pair[0]}: ${pair[1]}`);
      // }

      if (currentLead) {
        await UpdateLead(currentLead.id, formData, Token);
        enqueueSnackbar('Lead updated successfully!', { variant: 'success' });
      } else {
        await CreateLead(formData, Token);
        enqueueSnackbar('Lead created successfully!', { variant: 'success' });
      }
      router.push(paths.dashboard.leads.list);
      reset();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Unknown error', { variant: 'error' });
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
              Property Requirements
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
              <RHFTextField name="developer_name" label="Lead Name" />
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
                        setId(newValue ? newValue.id : '');
                        setSelectedCurrency(newValue?.currency);
                        setSelectedPhonecode(newValue?.phonecode);
                        // Reset state, city, and pincode when country changes
                        setValue('state_id', 0);
                        setValue('city_id', 0);
                        setValue('pincode', 0);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Location" variant="outlined" />
                      )}
                      isOptionEqualToValue={(option, value) => option.id === value}
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
                          setValue('pincode', 0);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="State / City" variant="outlined" />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value}
                      />
                    )}
                  />
                </FormControl>
              )}
              {cities && cities.length > 0 && (
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
                          setValue('pincode', 0);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Area / City" variant="outlined" />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value}
                      />
                    )}
                  />
                </FormControl>
              )}
              <RHFTextField name="pincode" label="Postcode" />
              <FormControl fullWidth>
                <RHFTextField
                  name="starting_price"
                  label="Budget"
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
                />
              </FormControl>

              <FormControl fullWidth>
                <Controller
                  name="lead_type"
                  control={control}
                  rules={{ required: 'Lead type is required' }} // Add required rule
                  render={(
                    { field, fieldState: { error: leadError } } // Rename 'error' to 'fieldError'
                  ) => (
                    <>
                      <InputLabel id="lead-type-label">Lead Type</InputLabel>{' '}
                      {/* Ensure labelId matches */}
                      <Select
                        {...field}
                        labelId="lead-type-label" // Link to InputLabel
                        id="lead-type-select" // Optional id for the select component
                        label="Lead Type" // Add label prop
                        value={field.value || ''} // Default to empty string if no value is selected
                        onChange={(event) => {
                          field.onChange(event.target.value);
                        }}
                        error={!!leadError} // Display error styling if validation fails
                      >
                        <MenuItem value="1">Buyer</MenuItem>
                        <MenuItem value="2">Seller</MenuItem>
                      </Select>
                      {leadError && (
                        <FormHelperText error>Lead Type is Required</FormHelperText> // Show error message if validation fails
                      )}
                    </>
                  )}
                />
              </FormControl>

              <RHFTextField name="email" label="Email" />
              <FormControl fullWidth>
                <RHFTextField
                  name="phone_number"
                  label="Mobile Number"
                  type="mobile"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="body1">+{selectedPhonecode}</Typography>
                      </InputAdornment>
                    ),
                  }}
                  value={values.phone_number.replace(`+${selectedPhonecode} `, '')}
                />
              </FormControl>

              <FormControl fullWidth>
                <Controller
                  name="number_of_bathrooms"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel id="number-of-bathrooms-label">Number of Bathrooms</InputLabel>

                      <Select
                        {...field}
                        labelId="number-of-bathrooms-label" // Link to InputLabel
                        id="number-of-bathrooms-select" // Optional id for select
                        label="Number of Bathrooms" // Add label prop
                        multiple
                        value={field.value || []} // Ensure value is an array
                        onChange={(event) => {
                          field.onChange(event.target.value);
                        }}
                        renderValue={(selected) => selected.join(', ')} // Display selected values
                      >
                        {Array.from({ length: 10 }, (_, index) => (
                          <MenuItem key={index + 1} value={index + 1}>
                            <Checkbox checked={field.value.includes(index + 1)} />
                            <ListItemText primary={index + 1} />
                          </MenuItem>
                        ))}
                      </Select>
                    </>
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
                            (pr_id) =>
                              propertyTypes.find((property) => property.id === pr_id)?.property_type
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

              <Controller
                name="finance"
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel id="finance-label">Finance</InputLabel> {/* Added labelId */}
                    <Select
                      {...field}
                      labelId="finance-label" // Link InputLabel with Select
                      id="finance-select" // Optional id for select
                      label="Finance" // Add label prop
                      value={field.value || ''} // Ensure default is empty string if undefined
                      onChange={(event) => field.onChange(event.target.value)} // Properly set the selected value
                      renderValue={(selected) => {
                        // Ensure selected value maps to the correct finance item
                        const selectedFinance = finances[0]
                          ? finances[0][selected] // directly access the selected value
                          : '';
                        return selectedFinance || 'Select Finance'; // Default display if not selected
                      }}
                    >
                      {finances[0] &&
                        Object.entries(finances[0]).map(([key, value]) => (
                          <MenuItem key={key} value={key}>
                            {value}
                          </MenuItem>
                        ))}
                    </Select>
                    {fieldState.error && (
                      <FormHelperText>{fieldState.error.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

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
                          renderValue={(selected) =>
                            (selected || [])
                              .map((pid) => parkings.find((type) => type.id === pid)?.title)
                              .join(', ')
                          }
                        >
                          {propertyTypesLoading ? (
                            <MenuItem disabled>
                              <CircularProgress size={24} />
                            </MenuItem>
                          ) : (
                            parkings?.map((type) => (
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
                        <MenuItem value="Freehold">Freehold</MenuItem>
                        <MenuItem value="Leasehold">Leasehold</MenuItem>
                      </Select>
                      {fieldState.error && (
                        <FormHelperText>{fieldState.error.message}</FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
              {values.account_type === 'Leasehold' && (
                <RHFTextField name="leasehold_length" label="Leasehold Length" type="number" />
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
                          .map(
                            (aid) => amenities.find((amenity) => amenity.id === aid)?.amenity_name
                          )
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
                        const selectedPropertyStatus = propertyStatuses?.find(
                          (property) => property.id === selected
                        );
                        return selectedPropertyStatus ? selectedPropertyStatus.title : '';
                      }}
                    >
                      {propertyStatuses &&
                        propertyStatuses.length > 0 &&
                        propertyStatuses.map((property) => (
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
              </Box>

              <Box sx={{ gridColumn: 'span 2', position: 'relative' }}>
                <FormLabel sx={{ fontSize: '1.2rem', color: 'white', mb: 1 }}>Documents</FormLabel>
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

                {error && (
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      bottom: '-24px', // Adjust this value based on your design
                      left: 0,
                      right: 0,
                      p: 1,
                      textAlign: 'center',
                      color: 'red',
                      backgroundColor: 'rgba(255, 0, 0, 0.1)',
                      borderRadius: '4px',
                      fontSize: '0.75rem', // Adjust font size if needed
                    }}
                  >
                    Only PDF files are allowed
                  </Typography>
                )}

                <Typography
                  variant="caption"
                  sx={{ mt: 2, display: 'block', textAlign: 'center', color: 'text.secondary' }}
                >
                  Allowed *.pdf
                  <br /> max size of 5MB
                </Typography>
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
                {!currentLead ? 'Create Lead' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

PropertyForm.propTypes = {
  currentLead: PropTypes.object,
};
