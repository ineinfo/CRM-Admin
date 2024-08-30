import * as Yup from 'yup';
import PropTypes from 'prop-types';
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
import { Select, MenuItem, InputLabel, FormControl, FormHelperText, CircularProgress, Checkbox, ListItemText, Typography, TextField, InputAdornment, Autocomplete } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';

import { UsegetAmenities } from 'src/api/amenities';
import { UsegetPropertiesType, useCountryData } from 'src/api/propertytype';
import { CreateProperty, UpdateProperty } from 'src/api/properties';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUpload } from 'src/components/hook-form';

export default function PropertyForm({ currentProperty }) {

  const router = useRouter();
  const { products: amenities } = UsegetAmenities();
  const { products: propertyTypes, productsLoading: propertyTypesLoading } = UsegetPropertiesType();
  const { enqueueSnackbar } = useSnackbar();

  const getCountries = useCountryData();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [countries, setCountries] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('AED');
  const [selectedCountry, setSelectedCountry] = useState(currentProperty?.location);

  useEffect(() => {
    if (getCountries.data) {
      setCountries(getCountries.data.data);
    }
  }, [getCountries.data]);

  useEffect(() => {
    if (selectedCountry) {
      const country = countries.find(c => c.name === selectedCountry);
      if (country) {
        setSelectedCurrency(country.currency);
      }
    }
  }, [selectedCountry, countries]);


useEffect(()=>{
  setSelectedDate(dayjs(currentProperty?.handover_date).format('YYYY-MM-DD'))
},[selectedDate])

console.log("values",selectedDate);

  const PropertySchema = Yup.object().shape({
    developer_name: Yup.string().required('Developer Name is required'),
    location: Yup.string().required('Location is required'),
    starting_price: Yup.number().required('Starting Price is required').positive(),
    number_of_bathrooms: Yup.number().required('Number of Bedrooms is required'),
    property_type_id: Yup.string().required('Property Type is required'),
    owner_name: Yup.string().required('Owner Name is required'),
    amenities: Yup.array().of(Yup.number()),
    email: Yup.string().email('Invalid email format').required('Email is required'),  // New validation
    phone_number: Yup.string().required('Mobile number is required').matches(/^[0-9]{10,15}$/, 'Mobile number is not valid'), // New validation
    // handover_date: Yup.date().required('Handover Date is required'),
    sqft_starting_size: Yup.number().required('Sqft: Starting Size is required').positive(),
    parking: Yup.string().required('Parking status is required'),
    furnished: Yup.string().required('Furnishing status is required'),
    account_type: Yup.string().required('Leasehold/Freehold is required'),
    // leasehold_length: Yup.number().when('account_type', {
    //   is: 'Leasehold',
    //   then: Yup.number().required('Leasehold Length is required').positive(),
    // }),
    files: Yup.array().min(1, 'Images are required'),
  });


  const { user } = useAuthContext();
  // console.log("nedded",user.accessToken);
  const Token = user.accessToken



  const defaultValues = useMemo(
    () => ({
      developer_name: currentProperty?.developer_name || '',
      property_type_id: currentProperty?.property_type_id || '',
      location: currentProperty?.location || '',
      starting_price: currentProperty?.starting_price || '',
      number_of_bathrooms: currentProperty?.number_of_bathrooms || '',
      owner_name: currentProperty?.owner_name || '',
      handover_date: dayjs(currentProperty?.handover_date).format('YYYY-MM-DD') || '',
      email: currentProperty?.email || '',  // New field
      phone_number: currentProperty?.phone_number || '',  // New field
      currency: currentProperty?.currency || 'GBP',
      sqft_starting_size: currentProperty?.sqft_starting_size || '',
      parking: currentProperty?.parking || 'no',
      furnished: currentProperty?.furnished || 'no',
      account_type: currentProperty?.account_type || 'Freehold',
      leasehold_length: currentProperty?.leasehold_length || '0',
      amenities: currentProperty?.amenities || [],
      files: (currentProperty?.files || []).map(imageFilename => ({
        preview: `${imageFilename}`,
      })),
    }),
    [currentProperty]
  );

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
    reset(defaultValues);
    console.log('defaultValuesdefaultValues', defaultValues);
  }, [currentProperty, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach(key => {
        if (key === 'amenities') {
          // Convert the amenities array into a string of comma-separated values
          formData.append(key, JSON.stringify(data[key]));
        } else if (Array.isArray(data[key])) {
          data[key].forEach(value => formData.append(key, value));
        } else if (key === 'handover_date' && (data[key])) {
          const date = dayjs(data[key]);  // yeh format hona chahiye yyyy-mm-dd
          const formattedDate = date.format('DD-MM-YYYY');

          formData.append(key, formattedDate);
        } else {
          formData.append(key, data[key]);
        }
      });

      const fileInputs = document.querySelector('input[type="file"]');
      if (fileInputs && fileInputs.files) {
        Array.from(fileInputs.files).forEach(file => formData.append('files', file));
      }

      // // Log FormData contents
      // for (let pair of formData.entries()) {
      //   console.log(`${pair[0]}: ${pair[1]}`);
      // }


      if (currentProperty) {
        await UpdateProperty(currentProperty.id, formData);
        enqueueSnackbar('Property updated successfully!', { variant: 'success' });
      } else {
        await CreateProperty(formData, Token);
        enqueueSnackbar('Property created successfully!', { variant: 'success' });
      }
      router.push(paths.dashboard.propertypage.root);
      reset();
    } catch (error) {
      enqueueSnackbar((error.response?.data?.message || 'Unknown error'), { variant: 'error' });
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
                      value={countries.find((country) => country.name === field.value) || null}
                      onChange={(event, newValue) => {
                        field.onChange(newValue ? newValue.name : '');
                        setSelectedCountry(newValue ? newValue.name : '');
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Location'
                          variant="outlined"
                        />
                      )}
                      isOptionEqualToValue={(option, value) => option.name === value.name}
                    />
                  )}
                />
              </FormControl>

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
              <RHFTextField name="phone_number" label="Mobile Number" />

              <FormControl fullWidth>
                <InputLabel>Number of Bedrooms</InputLabel>
                <Controller
                  name="number_of_bathrooms"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        {...field}
                        label="Number of Bedrooms"
                        error={!!fieldState.error}
                        sx={{ transition: 'all 0.3s ease' }}
                      >
                        <MenuItem value="0">Studio</MenuItem>
                        <MenuItem value="1">1 bed</MenuItem>
                        <MenuItem value="2">2 bed</MenuItem>
                        <MenuItem value="3">3 bed</MenuItem>
                        <MenuItem value="4">4 bed</MenuItem>
                        <MenuItem value="5">5 bed</MenuItem>
                        <MenuItem value="6">6 bed</MenuItem>
                        <MenuItem value="7">7 bed</MenuItem>
                      </Select>
                      {fieldState.error && (
                        <FormHelperText>{fieldState.error.message}</FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Property Type</InputLabel>
                <Controller
                  name="property_type_id"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        {...field}
                        label="Property Type"
                        error={!!fieldState.error}
                        disabled={propertyTypesLoading}
                        sx={{ transition: 'all 0.3s ease' }}
                      >
                        {propertyTypesLoading ? (
                          <MenuItem disabled>
                            <CircularProgress size={24} />
                          </MenuItem>
                        ) : (
                          propertyTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                              {type.property_type}
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

              <RHFTextField name="owner_name" label="Owner Name" />

              <RHFTextField
                name="handover_date"
                label="Handover Date"
                type="date" // Keep the type as "date" to show the calendar
                placeholder="dd-mm-yyyy"
                InputLabelProps={{
                  shrink: true,
                }}
              />


              <RHFTextField name="sqft_starting_size" label="Sqft: Starting Size" />

              <FormControl fullWidth>
                <InputLabel>Parking</InputLabel>
                <Controller
                  name="parking"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select {...field} label="Parking" error={!!fieldState.error}>
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
                      <Select
                        {...field}
                        label="Leasehold/Freehold"
                        error={!!fieldState.error}
                      >
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
                <RHFTextField name="leasehold_length" label="Leasehold Length" />
              )}

              <Controller
                name="amenities"
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel>Amenities</InputLabel>
                    <Select
                      {...field}
                      multiple
                      renderValue={(selected) =>
                        selected
                          .map((id) =>
                            amenities.find((amenity) => amenity.id === id)?.amenity_name
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

              <Box sx={{ gridColumn: 'span 2' }}>
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
