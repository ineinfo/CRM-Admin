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
import {
  UsegetPropertySatatus,
  useCityData,
  useCountryData,
  useStateData,
} from 'src/api/propertytype';
import { CreateProspect, UpdateProspect } from 'src/api/properties';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUpload } from 'src/components/hook-form';

export default function PropertyForm({ currentProperty }) {
  const router = useRouter();
  const { propertyStatus: propertyStatuses } = UsegetPropertySatatus();
  console.log('propertyStatuses', propertyStatuses);

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
  const [selectedCountry, setSelectedCountry] = useState(currentProperty?.countryId);
  const [iscurrentPropertySet, setIscurrentPropertySet] = useState(false);

  const PropertySchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    // countryId: Yup.string().required('countryId is required'),
    // stateId: Yup.string().required('State is required'),
    // cityId: Yup.string().required('City is required'),
    developmentType: Yup.string().required('Development Type is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    mobileNumber: Yup.string().required('Mobile number is required'),
    followupDate: Yup.string().required('Follow Up Date is required'),
    postcode: Yup.string().required('postcode is required'),
    note: Yup.string().required('Note is required'),
  });

  const { user } = useAuthContext();
  const Token = user?.accessToken;

  console.log("current", currentProperty);


  const defaultValues = useMemo(() => {

    return {
      firstName: currentProperty?.first_name || '',
      lastName: currentProperty?.last_name || '',
      postcode: currentProperty?.postcode || '',
      countryId: currentProperty?.country_id || 0,
      stateId: currentProperty?.state_id || 0,
      cityId: currentProperty?.city_id || 0,
      developmentType: currentProperty?.development_type || '',
      followupDate: currentProperty?.followup ? dayjs(currentProperty.followup).format('DD-MM-YYYY') : null,
      email: currentProperty?.email || '',
      mobileNumber: currentProperty?.mobile || '',
      note: currentProperty?.note || '',
    };
  }, [currentProperty]);


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



  // Handles when the user manually selects a country
  useEffect(() => {
    if (selectedCountry && !iscurrentPropertySet) {
      const country = countries.find((c) => c.name === selectedCountry);
      if (country) {
        setSelectedCurrency(country.currency);
        setSelectedPhonecode(country.phonecode);
        setId(country.id);
        // Reset state, city, and postcode only when a country is manually selected
        setValue('stateId', 0); // Clear the state
        setValue('cityId', 0); // Clear the city
        setValue('postcode', ''); // Clear the postcode
      }
    }
  }, [selectedCountry, countries, setValue, iscurrentPropertySet]);

  // Handles when the current property is loaded
  useEffect(() => {
    if (currentProperty) {
      const countryIdId = currentProperty?.country_id;
      const stateId = currentProperty?.state_id;
      const cityId = currentProperty?.city_id;

      if (countryIdId) {
        const matchedCountry = countries.find((country) => country.id === countryIdId);
        if (matchedCountry) {
          setSelectedCountry(matchedCountry.name);
          setSelectedCurrency(matchedCountry.currency);
          setSelectedPhonecode(matchedCountry.phonecode);
          setId(countryIdId);
          setSid(stateId);
          setValue('cityId', cityId);
          setValue('stateId', stateId);
          setValue('postcode', currentProperty?.postcode);
        }
      }

      setIscurrentPropertySet(true); // Mark that currentProperty data has been set
    }
  }, [currentProperty, setValue, countries]);

  useEffect(() => {
    const FetchStates = async () => {
      try {
        const data = await useStateData(id);
        setStates(data.data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    if (id) {
      FetchStates();
    }
  }, [id, selectedState, currentProperty]);

  useEffect(() => {
    const FetchCities = async () => {
      try {
        const data = await useCityData(sid);
        setCities(data.data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    if (sid) {
      FetchCities();
    }
  }, [sid, selectedCity, currentProperty, selectedCountry, id]);

  useEffect(() => {
    setSelectedDate(dayjs(currentProperty?.handover_date).format('DD-MM-YYYY'));
  }, [selectedDate]);

  useEffect(() => {
    reset(defaultValues);
    console.log('defaultValuesdefaultValues', defaultValues);
  }, [currentProperty, reset, defaultValues]);



  const onSubmit = handleSubmit(async (data) => {
    const modifiedData = {
      ...data,
      mobileNumber: Number(data.mobileNumber),
      developmentType: Number(data.developmentType),
    };
    console.log('data+++++++++++=>', modifiedData);

    try {
      if (currentProperty) {
        await UpdateProspect(currentProperty.id, modifiedData, Token);
        enqueueSnackbar('Prospect updated successfully!', { variant: 'success' });
      } else {
        await CreateProspect(modifiedData, Token);
        enqueueSnackbar('Prospect created successfully!', { variant: 'success' });
      }
      router.push(paths.dashboard.opportunity.root);
      reset();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Unknown error', { variant: 'error' });
    }
  });



  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Prospects Details
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
              <RHFTextField name="firstName" label="First Name" />
              <RHFTextField name="lastName" label="Last Name" />
              <FormControl fullWidth>
                <Controller
                  name="countryId"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Autocomplete
                        {...field}
                        id="countryId"
                        options={countries}
                        getOptionLabel={(option) => option.name}
                        value={countries.find((country) => country.id === field.value) || null}
                        onChange={(event, newValue) => {
                          field.onChange(newValue ? newValue.id : '');
                          setSelectedCountry(newValue ? newValue.name : '');
                          setId(newValue ? newValue.id : '');
                          setSelectedCurrency(newValue?.currency);
                          setSelectedPhonecode(newValue?.phonecode);

                          // Reset state, city, and postcode when country changes
                          setValue('stateId', 0);
                          setValue('cityId', 0);
                          setValue('postcode', 0);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Country"
                            variant="outlined"
                            error={!!error} // Apply error styling
                            helperText={error ? error.message : null} // Display error message
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                      />

                    </>
                  )}
                />


              </FormControl>

              {states && states.length > 0 && (
                <FormControl fullWidth>
                  <Controller
                    name="stateId"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Autocomplete
                          {...field}
                          id="stateId"
                          options={states}
                          getOptionLabel={(option) => option.name}
                          value={states.find((state) => state.id === field.value) || null}
                          onChange={(event, newValue) => {
                            field.onChange(newValue ? newValue.id : '');
                            setSelectedState(newValue ? newValue.name : '');
                            setSid(newValue ? newValue.id : '');
                            setValue('postcode', '');
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="State / City"
                              variant="outlined"
                              error={!!error} // Apply error styling
                              helperText={error ? error.message : null} // Display error message
                            />
                          )}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          freeSolo // Enable free text input
                        />

                      </>
                    )}
                  />

                </FormControl>
              )}


              {cities && cities.length > 0 && (
                <FormControl fullWidth>
                  <Controller
                    name="cityId"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        id="cityId"
                        options={cities}
                        getOptionLabel={(option) => option.name}
                        value={cities.find((city) => city.id === field.value) || null}
                        onChange={(event, newValue) => {
                          field.onChange(newValue ? newValue.id : '');
                          setSelectedCity(newValue ? newValue.name : '');
                          setValue('postcode', '');
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Area / City" variant="outlined" />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value}
                        freeSolo // Enable free text input
                      />
                    )}
                  />
                </FormControl>
              )}


              <RHFTextField name="postcode" label="Postcode" />


              <RHFTextField name="email" label="Email" />

              <FormControl fullWidth>
                <RHFTextField
                  name="mobileNumber"
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
                  value={values.mobileNumber.replace(`+${selectedPhonecode} `, '')}
                />
              </FormControl>

              <FormControl fullWidth > {/* Set error based on validation */}
                <InputLabel id="property-type-label">Development Type</InputLabel>
                <Controller
                  name="developmentType"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select
                        {...field}
                        error={!!error}
                        labelId="property-type-label"
                        id="property-type-select"
                        label="Development Type"
                        value={field.value || ''} // Ensure the value is a single string
                        onChange={(event) => {
                          field.onChange(event.target.value);
                        }}
                      >
                        {/* Custom options */}
                        <MenuItem value="1">Houses</MenuItem>
                        <MenuItem value="2">Apartments</MenuItem>
                        <MenuItem value="3">Penthouses</MenuItem>
                        <MenuItem value="4">Bungalows</MenuItem>
                      </Select>
                      {error && (

                        <FormHelperText error={!!error}>{error.message}</FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>


              <FormControl fullWidth>
                <Controller
                  name="followupDate" // Ensure this matches your schema
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <RHFTextField
                        {...field}

                        label="Follow Up Date"
                        type="date"
                        placeholder="DD-MM-YYYY"
                        error={!!error} // Apply error styling
                        helperText={error ? error.message : null} // Display error message
                      />
                      {error && <Typography color="error">{error.message}</Typography>} {/* Optional, to show error message */}
                    </>
                  )}
                />
              </FormControl>

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
                {!currentProperty ? 'Create Prospect' : 'Save Changes'}
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
