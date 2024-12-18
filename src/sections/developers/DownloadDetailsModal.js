import React, { useEffect, useState } from 'react';

import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    ListItemText,
    MenuItem,
    Modal,
    Slider,
    TextField,
    Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';
import { UseCityData, useCountryData, UsegetCouncil, UsegetParkingType, UsegetPropertiesType, UsegetPropertySatatus, UseStateData } from 'src/api/propertytype';
import DatePicker from 'react-datepicker';
import { UsegetAmenities } from 'src/api/amenities';
import { useDropzone } from 'react-dropzone';


const LazyTemplate2 = React.lazy(() => import('../menu/templates/Template2'));
const LazyTemplate3 = React.lazy(() => import('../menu/templates/Template3'));
const LazyTemplate4 = React.lazy(() => import('../menu/templates/Template4'));



export default function DownloadDetailsModal({ open, onClose, row }) {
    const [formData, setFormData] = useState(row);
    const { products: amenities } = UsegetAmenities();
    const { propertyStatus: propertyStatuses } = UsegetPropertySatatus();
    const [countries, setCountries] = useState([]);
    const { parking: parkings, parkingLoading: parkingTypesLoading } = UsegetParkingType();
    const { products: propertyTypes, productsLoading: propertyTypesLoading } = UsegetPropertiesType();
    const { council: councils } = UsegetCouncil();
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const [id, setId] = useState()
    const [sid, setSid] = useState(row?.state_id || 0)
    const [selectedState, setSelectedState] = useState(row?.state_id);
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [selectedPhonecode, setSelectedPhonecode] = useState('');
    const [selectedCity, setSelectedCity] = useState(row?.city_id);
    const [templateModal, setTemplateModal] = useState(false)
    const [data, setData] = useState()
    const getCountries = useCountryData();

    const [files, setFiles] = useState(row.files || []);
    const [selectedImages, setSelectedImages] = useState([]);



    const handleOpen = () => setTemplateModal(true);
    const handleClose = () => setTemplateModal(false);

    // Handle file drop
    const onDrop = (acceptedFiles) => {
        const newFiles = acceptedFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
    });

    // Handle image selection
    const toggleImageSelection = (file) => {
        setSelectedImages((prevSelected) =>
            prevSelected?.includes(file)
                ? prevSelected.filter((selected) => selected !== file)
                : [...prevSelected, file]
        );
    };

    useEffect(() => {
        if (getCountries.data) {
            setCountries(getCountries.data.data);
        }
    }, [getCountries.data]);

    useEffect(() => {
        const fetchId = async () => {
            const id = countries.find((country) => country.name === row?.location)?.id || 'N/A';
            const currency = countries.find((country) => country.name === row?.location)?.currency || 'N/A';
            const phonecode = countries.find((country) => country.name === row?.location)?.phonecode || 'N/A';
            setId(id);
            setSelectedCurrency(currency)
            setSelectedPhonecode(phonecode)
        };
        fetchId();
    }, [row, open, countries]);

    useEffect(() => {
        const FetchStates = async () => {
            try {
                const data = await UseStateData(id);
                setStates(data.data);
            } catch (error) {
                console.error('Error fetching states:', error);
            }
        };
        if (id) {
            FetchStates();
        }
    }, [id, selectedState, row, open]);
    useEffect(() => {
        const FetchCities = async () => {
            try {
                const data = await UseCityData(sid);
                setCities(data.data);
            } catch (error) {
                console.error('Error fetching states:', error);
            }
        };
        if (sid) {
            FetchCities();
        }
    }, [sid, selectedCity, row, id, open]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = () => {
        const countryName = countries?.find((country) => country.id === formData.location)?.name || 'N/A';



        const stateName = states?.find((state) => state.id === formData.state_id)?.name || 'N/A';

        console.log("statee", states);
        console.log("statee1", stateName);



        const cityName = cities?.find((city) => city.id === formData.city_id)?.name || 'N/A';

        console.log('Saved Data:', {
            ...formData,
            location: countryName,
            state_id: stateName,
            city_id: cityName,
            files: selectedImages
        });
        console.log('Dataaaa1', formData);
        setData(() => (
            {
                ...formData,
                state_id: stateName,
                city_id: cityName,
                files: selectedImages
            }
        ))
        handleOpen()
    };
    console.log("Dataaaa", formData);
    console.log("Dataaaa2", cities);

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">

                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Edit Download Details</Typography>
                        <IconButton onClick={onClose}>
                            <Iconify icon="eva:close-fill" />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent style={{ paddingBottom: '30px', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: "30px" }}>
                    <TextField
                        label="Developer Name"
                        value={formData.developer_name}
                        onChange={(e) => { handleChange('developer_name', e.target.value) }}
                        fullWidth
                        style={{ marginTop: "5px" }}
                    />
                    <TextField
                        label="Location"
                        select
                        value={id || ''}
                        onChange={(e) => {
                            setId(e.target.value);
                            handleChange('location', e.target.value);
                        }}
                        fullWidth
                    >
                        {countries.length > 0 ? (
                            countries.map((country) => (
                                <MenuItem key={country.id} value={country.id}>
                                    {country.name}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>Select country first</MenuItem>
                        )}
                    </TextField>

                    {states?.length > 0 && (
                        <TextField
                            label="State"
                            select
                            value={selectedState || ''}
                            onChange={(e) => {
                                setSid(e.target.value)
                                setSelectedState(e.target.value)
                                handleChange('state_id', e.target.value)
                            }}
                            fullWidth
                        >
                            {states.length > 0 ? (
                                states.map((state) => (
                                    <MenuItem key={state.id} value={state.id}>
                                        {state.name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>Select country first</MenuItem>
                            )}
                        </TextField>
                    )}
                    {cities?.length > 0 && (
                        <TextField
                            label="City"
                            select
                            value={selectedCity}
                            onChange={(e) => {
                                setSelectedCity(e.target.value)
                                handleChange('city_id', e.target.value)
                            }}
                            fullWidth
                        >
                            {cities.length > 0 ? (
                                cities.map((city) => (
                                    <MenuItem key={city.id} value={city.id}>
                                        {city.name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>Select state first</MenuItem>
                            )}
                        </TextField>
                    )}
                    <TextField
                        label="Pincode"
                        value={formData.pincode}
                        onChange={(e) => handleChange('pincode', e.target.value)}
                        fullWidth
                    />



                    <TextField
                        label="Email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Phone Number"
                        value={formData.phone_number}
                        onChange={(e) => handleChange('phone_number', e.target.value)}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Typography variant="body1">+{selectedPhonecode}</Typography>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Starting Price"
                        value={formData.starting_price}
                        onChange={(e) => handleChange('starting_price', e.target.value)}
                        fullWidth
                        type="number"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <TextField
                                        select
                                        value={selectedCurrency}
                                        onChange={(e) => setSelectedCurrency(e.target.value)}
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

                    <TextField
                        label="Starting Price"
                        value={formData.starting_price}
                        onChange={(e) => handleChange('starting_price', e.target.value)}
                        fullWidth
                        type="number"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <TextField
                                        select
                                        value={selectedCurrency}
                                        onChange={(e) => setSelectedCurrency(e.target.value)}
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

                    <TextField
                        label="No. of Bedrooms"
                        select
                        SelectProps={{
                            multiple: true,
                            renderValue: (selected) => selected.join(', '),
                        }}
                        value={formData.no_of_bedrooms}
                        onChange={(e) => handleChange('no_of_bedrooms', e.target.value)}
                    >
                        {Array.from({ length: 10 }, (_, index) => (
                            <MenuItem key={index + 1} value={index + 1}>
                                <Checkbox checked={formData.no_of_bedrooms.includes(index + 1)} />
                                <ListItemText primary={index + 1} />
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="No. of Bathrooms"
                        select
                        SelectProps={{
                            multiple: true,
                            renderValue: (selected) => selected.join(', '),
                        }}
                        value={formData.no_of_bathrooms}
                        onChange={(e) => handleChange('no_of_bathrooms', e.target.value)}
                    >
                        {Array.from({ length: 10 }, (_, index) => (
                            <MenuItem key={index + 1} value={index + 1}>
                                <Checkbox checked={formData.no_of_bathrooms.includes(index + 1)} />
                                <ListItemText primary={index + 1} />
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Property Types"
                        select
                        SelectProps={{
                            multiple: true,
                            renderValue: (selected) =>
                                selected
                                    .map((id) => propertyTypes.find((type) => type.id === id)?.property_type)
                                    .join(', '),
                        }}
                        value={formData.property_type}
                        onChange={(e) => handleChange('property_types', e.target.value)}
                    >
                        {propertyTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                <Checkbox checked={formData?.property_type.includes(type.id)} />
                                <ListItemText primary={type.property_type} />
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Owner Name"
                        value={formData.owner_name}
                        onChange={(e) => handleChange('owner_name', e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Council Tax Band"
                        select
                        value={formData.council_tax_band}
                        onChange={(e) => handleChange('council_tax_band', e.target.value)}
                    >
                        {councils.map((band) => (
                            <MenuItem key={band.id} value={band.id}>
                                {band.title}
                            </MenuItem>
                        ))}
                    </TextField>

                    <DatePicker
                        selected={formData.handover_date} // Set to null if field.value is null
                        onChange={(e) => handleChange('handover_date', e.target.value)}
                        dateFormat="dd-MM-yyyy"
                        customInput={<TextField fullWidth sx={{ zIndex: 10 }} />}
                        placeholderText={'dd-mm-yyyy'} // Ensure placeholder is shown
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                    />

                    <Typography></Typography>
                    <Slider
                        value={[formData.range_min || 0, formData.range_max || 20000]}
                        onChange={(_, newValue) => {
                            const [min, max] = newValue;
                            handleChange('range_min', min); // Update range_min field
                            handleChange('range_max', max); // Update range_max field
                        }}
                        valueLabelDisplay="auto"
                        step={100}
                        min={0}
                        max={20000}
                    />

                    {/* Display the min and max values in TextFields */}
                    <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2px" }}>
                            Min:
                            <TextField
                                type="number"
                                value={formData.range_min || 0}
                                onChange={(e) => {
                                    const min = Number(e.target.value);
                                    const max = field.value[1];
                                    const newValue = [Math.min(min, max), max]; // Ensure min <= max
                                    field.onChange(newValue); // Update the field value
                                    setValue('range_min', newValue[0]); // Update range_min field
                                    setValue('range_max', newValue[1]); // Update range_max field
                                }}
                                inputProps={{ min: 0, max: 20000, step: 100 }}
                                variant="outlined"
                                size="small"
                                sx={{ width: '50%' }}
                            /> sqft
                        </div>

                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2px" }}>
                            Max:
                            <TextField
                                type="number"
                                value={formData.range_max || 20000}
                                onChange={(e) => {
                                    const max = Number(e.target.value);
                                    const min = field.value[0];
                                    const newValue = [min, Math.max(min, max)]; // Ensure max >= min
                                    field.onChange(newValue); // Update the field value
                                    setValue('range_min', newValue[0]); // Update range_min field
                                    setValue('range_max', newValue[1]); // Update range_max field
                                }}
                                inputProps={{ min: 0, max: 20000, step: 100 }}
                                variant="outlined"
                                size="small"
                                sx={{ width: '50%' }}
                            /> sqft
                        </div>
                    </Box>



                    <TextField
                        label="Parking"
                        select
                        value={formData.parking}
                        onChange={(e) => handleChange('parking', e.target.value)}
                    >

                        <MenuItem value={"yes"}>
                            Yes
                        </MenuItem>
                        <MenuItem value={"no"}>
                            No
                        </MenuItem>

                    </TextField>



                    {formData.parking === "yes" && (
                        <TextField
                            label="Parking Types"
                            select
                            SelectProps={{
                                multiple: true,
                                renderValue: (selected) =>
                                    selected
                                        .map((id) => parkings.find((type) => type.id === id)?.title)
                                        .join(', '),
                            }}
                            value={formData.parking_option}
                            onChange={(e) => handleChange('parking_option', e.target.value)}
                        >
                            {parkings.map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                    <Checkbox checked={formData?.parking_option.includes(type.id)} />
                                    <ListItemText primary={type.title} />
                                </MenuItem>
                            ))}
                        </TextField>
                    )}


                    <TextField
                        label="Furnished"
                        select
                        value={formData.furnished}
                        onChange={(e) => handleChange('furnished', e.target.value)}
                    >

                        <MenuItem value={"yes"}>
                            Yes
                        </MenuItem>
                        <MenuItem value={"no"}>
                            No
                        </MenuItem>

                    </TextField>

                    <TextField
                        label="Leasehold/Freehold"
                        select
                        value={formData.account_type}
                        onChange={(e) => handleChange('account_type', e.target.value)}
                    >

                        <MenuItem value={"Freehold"}>
                            Freehold
                        </MenuItem>
                        <MenuItem value={"Leasehold"}>
                            Leasehold
                        </MenuItem>

                    </TextField>


                    {
                        formData.account_type === "Leasehold" && (
                            <TextField
                                label="Leasehold Length"
                                value={formData.leasehold_length}
                                onChange={(e) => handleChange('leasehold_length', e.target.value)}
                                type='number'
                                fullWidth
                            />
                        )
                    }

                    <TextField
                        label="Amenities"
                        select
                        SelectProps={{
                            multiple: true,
                            renderValue: (selected) =>
                                selected
                                    .map((id) => amenities.find((type) => type.id === id)?.amenity_name)
                                    .join(', '),
                        }}
                        value={formData.amenities}
                        onChange={(e) => handleChange('amenities', e.target.value)}
                    >
                        {amenities.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                <Checkbox checked={formData?.amenities.includes(type.id)} />
                                <ListItemText primary={type.amenity_name} />
                            </MenuItem>
                        ))}
                    </TextField>


                    <TextField
                        label="Service Charge psqft"
                        value={formData.service_charges}
                        onChange={(e) => handleChange('service_charges', e.target.value)}
                        fullWidth
                        type="number"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <TextField
                                        select
                                        value={selectedCurrency}
                                        onChange={(e) => setSelectedCurrency(e.target.value)}
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

                    <TextField
                        label="Property Status"
                        select
                        value={formData.property_status}
                        onChange={(e) => handleChange('property_status', e.target.value)}
                    >
                        {propertyStatuses.map((band) => (
                            <MenuItem key={band.id} value={band.id}>
                                {band.title}
                            </MenuItem>
                        ))}
                    </TextField>





                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Select Images
                        </Typography>

                        {/* Drag and Drop Section */}
                        {/* <Box
                            {...getRootProps()}
                            sx={{
                                border: '2px dashed #ccc',
                                borderRadius: 2,
                                p: 3,
                                textAlign: 'center',
                                backgroundColor: isDragActive ? 'primary.lighter' : 'background.paper',
                                cursor: 'pointer',
                            }}
                        >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <Typography variant="body1">Drop the files here...</Typography>
                            ) : (
                                <Typography variant="body1">
                                    Drag and drop files here, or click to select files
                                </Typography>
                            )}
                        </Box> */}

                        {/* Display Uploaded Images */}
                        <Grid container spacing={2} sx={{ mt: 3 }}>
                            {files.map((file, index) => (
                                <Grid item xs={6} sm={4} md={3} key={index}>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            border: selectedImages && selectedImages?.includes(file) ? '2px solid #1976d2' : '2px solid transparent',
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <img
                                            src={file.preview || file}
                                            alt={`uploaded-${index}`}
                                            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                        />
                                        <Checkbox
                                            checked={selectedImages && selectedImages.includes(file)}
                                            onChange={() => toggleImageSelection(file)}
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                backgroundColor: 'white',
                                                borderRadius: '50%',
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <TextField
                        label="Note"
                        value={formData.note}
                        onChange={(e) => handleChange('note', e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                    />
                    <Button variant="contained" onClick={handleSave}>
                        Save
                    </Button>


                </DialogContent>
            </Dialog>

            <Modal
                open={templateModal}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 700,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2">
                        Templates
                    </Typography>
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        <React.Suspense fallback={<div>Loading...</div>}>
                            {/* <LazyTemplate2 onClose={handleClose} />
                            <LazyTemplate3 onClose={handleClose} /> */}
                            <LazyTemplate4 onClose={handleClose} data={data} currency={selectedCurrency} />
                        </React.Suspense>
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleClose}
                        sx={{ mt: 2 }}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </>
    );
}

DownloadDetailsModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};