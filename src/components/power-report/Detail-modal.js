import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, Grid, CircularProgress, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { UseCityData, useCountryData, UseStateData } from 'src/api/propertytype';
import { UpdateLeadNote } from 'src/api/leads';
import { useAuthContext } from 'src/auth/hooks';
import { enqueueSnackbar } from 'notistack';

const DetailsModal = ({ open, handleClose, propertyData, unarchive }) => {
    const {
        developer_name,
        email,
        phone_number,
        handover_date,
        sales_status,
        created,
        status,
        first_name,
        last_name,
        parking,
        location,    // This is the country ID
        state_id,    // This is the state ID
        city_id,     // This is the city ID
        note,
        no_of_bathrooms
    } = propertyData;

    const formatDate = (dateString) => dayjs(dateString).format('DD-MM-YYYY');

    const [countryName, setCountryName] = useState('');
    const [stateName, setStateName] = useState('');
    const [cityName, setCityName] = useState('');
    const [notes, setNotes] = useState(propertyData ? propertyData.note : '');
    const [loading, setLoading] = useState({ country: true, state: true, city: true });
    const [error, setError] = useState({ country: null, state: null, city: null });


    const getCountries = useCountryData();
    const { user } = useAuthContext();
    const Token = user?.accessToken;


    useEffect(() => {
        const fetchCountry = async () => {
            setLoading((prev) => ({ ...prev, country: true }));
            try {
                if (getCountries.data) {
                    const countries = getCountries.data.data;
                    const matchedCountry = countries.find(country => country.id === location);
                    setCountryName(matchedCountry ? matchedCountry.name : 'Country not found');
                }
            } catch (err) {
                setError((prev) => ({ ...prev, country: 'Failed to load country' }));
            } finally {
                setLoading((prev) => ({ ...prev, country: false }));
            }
        };

        const fetchState = async (id) => {
            setLoading((prev) => ({ ...prev, state: true }));
            try {
                const state = await UseStateData(id);
                console.log("City1", state.data);
                const states = state.data;
                const matchedState = states.find(state1 => state1.id === state_id);
                setStateName(matchedState ? matchedState.name : 'State not found');
            } catch (err) {
                setError((prev) => ({ ...prev, state: 'Failed to load state' }));
            } finally {
                setLoading((prev) => ({ ...prev, state: false }));
            }
        };

        const fetchCity = async (id) => {
            setLoading((prev) => ({ ...prev, city: true }));
            try {
                const city = await UseCityData(id);
                console.log("City2", city);
                const cities = city.data;
                const matchedCity = cities.find(city1 => city1.id === city_id);
                setCityName(matchedCity ? matchedCity.name : 'City not found');
            } catch (err) {
                setError((prev) => ({ ...prev, city: 'Failed to load city' }));
            } finally {
                setLoading((prev) => ({ ...prev, city: false }));
            }
        };

        if (location) fetchCountry();
        if (location) fetchState(location);
        if (state_id) fetchCity(state_id);

        setNotes(propertyData ? propertyData.note : '')
    }, [location, state_id, city_id, getCountries.data, open]);


    const handleUpdateNote = async () => {
        try {
            // Call your API to update the note
            const id = propertyData?.id
            const data = {
                "note": notes
            }
            unarchive(data)
            enqueueSnackbar('Note updated successfully!', { variant: 'success' });
            handleClose()
        } catch (er) {
            console.error('Error updating the note:', er);
        }
    };

    const renderContent = (loading1, error2, value) => {
        if (loading1) {
            return <CircularProgress size={16} />;
        }
        if (error2) {
            return error2;
        }
        return value;
    };


    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{
                marginTop: '-100px'
            }}
        >
            <Box
                sx={{
                    width: "50%",
                    maxWidth: '750px',
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    boxShadow: 24,
                    p: 4,
                    mx: 'auto',
                    mt: '10%',
                    transition: 'all 0.3s ease',
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{

                        fontWeight: 'bold',
                        color: 'primary.main',
                        mb: 3,
                    }}
                >
                    Property Details
                </Typography>

                <Grid container spacing={3} >
                    <Grid item xs={12} sm={6} >
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Lead Name
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {first_name ? `${first_name} ${last_name}` : developer_name || '-'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Email
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {email || '-'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Phone Number
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {phone_number || '-'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Handover Date
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {handover_date ? formatDate(handover_date) : '-'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Sales Status
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {sales_status || '-'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Created
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {formatDate(created)}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>Bathrooms</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {no_of_bathrooms && no_of_bathrooms.length > 0
                                ? no_of_bathrooms.join(', ')
                                : '-'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Status
                        </Typography>
                        <Typography variant="body2" color={status === 0 ? 'GrayText' : 'success.main'}>
                            {status === 0 ? 'Archived' : ''}
                        </Typography>
                    </Grid>


                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>Country</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {renderContent(loading.country, error.country, countryName)}
                        </Typography>
                    </Grid>

                    {/* State */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>State</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {renderContent(loading.state, error.state, stateName)}
                        </Typography>
                    </Grid>

                    {/* City */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>City</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {renderContent(loading.city, error.city, cityName)}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Parking
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {parking || '-'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Note
                        </Typography>
                        <TextField
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                        />
                        {/* <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpdateNote}
                            sx={{ mt: 2 }}
                        >
                            Update Note
                        </Button> */}
                    </Grid>
                </Grid>

                {/* Footer */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 4,
                        gap: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleClose}
                        sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            transition: '0.3s',
                            '&:hover': {
                                bgcolor: 'secondary.light',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdateNote}
                        sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            transition: '0.3s',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            },
                        }}
                    >
                        Unarchive
                    </Button>

                </Box>
            </Box>
        </Modal>
    );
};

export default DetailsModal;
