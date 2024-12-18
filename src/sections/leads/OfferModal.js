import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, FormControl, Tooltip, Box } from '@mui/material';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import { useAuthContext } from 'src/auth/hooks';
import { CreateSales, GetSales } from 'src/api/leads';
import SalesProgressionModal from './SalesProgressionModal';

const OfferModal = ({ row }) => {
    const [open, setOpen] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [salesProgressionOpen, setSalesProgressionOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null); // State for the selected sale object
    const [sales, setSales] = useState([]); // State for sales data
    const [shouldRefetchSales, setShouldRefetchSales] = useState(false); // State to trigger refetch
    const method = useForm();
    const methods = useForm({
        defaultValues: {
            amount: '',
            status: ''
        }
    });

    const { user } = useAuthContext();
    const Token = user?.accessToken;

    // Fetch sales data when the component mounts or when shouldRefetchSales changes
    useEffect(() => {
        const fetchSales = async () => {
            try {
                const salesData = await GetSales(row?.id, Token);
                setSales(salesData);

                // If there are sales with status 1, prefill form values
                if (salesData?.length > 0) {
                    const sale = salesData.find(sale2 => sale2.status === 1);
                    if (sale) {
                        methods.setValue('amount', sale.amount); // Prefill amount
                        methods.setValue('status', sale.status); // Prefill status
                    }
                }
            } catch (error) {
                console.error("Error fetching sales:", error);
            }
        };

        if (row?.id && Token) {
            fetchSales();
        }
    }, [row?.id, Token, shouldRefetchSales]);  // Refetch sales when shouldRefetchSales changes

    // Filter sales to get those with status '1'
    const filteredSales = sales?.filter(sale => sale.status === 1);

    const handleOpen = () => {
        setOpen(true);

        // Prefill the form with sale data if available
        if (sales?.length > 0) {
            const sale = sales.find(sale1 => sale1.status === 1);
            if (sale) {
                methods.setValue('amount', sale.amount);
                methods.setValue('status', sale.status);
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setFormSubmitted(false);

        // Only reset the form if necessary (e.g., after submission)
        if (formSubmitted) {
            methods.reset();  // Reset form only if the form was submitted
        }
    };

    const handleSalesProgressionClose = () => {
        setSalesProgressionOpen(false);
    };

    const onSubmit = async (data) => {
        // Add token and lead_id to the data object
        const updatedData = {
            token: Token,
            lead_id: row?.id,
            ...data,
        };

        // Check status and proceed
        if (updatedData) {
            await CreateSales(updatedData, Token);
            setFormSubmitted(true);
            console.log('Form Data:', updatedData);

            // After submitting, trigger refetch of sales data
            setShouldRefetchSales(prev => !prev); // This will toggle and trigger the useEffect to refetch sales
        } else {
            setFormSubmitted(false);
        }
    };

    const handleSalesProgressionOpen = (sale) => {
        setSelectedSale(sale); // Set the selected sale
        setSalesProgressionOpen(true);
        handleClose(); // Close the current modal
    };

    return (
        <div>
            {/* <Tooltip title={row?.status == 3 ? '' : row?.sales_status || ''} placement='top' arrow >
                <Button
                    variant="outlined"
                    onClick={handleOpen}
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {row && row?.status == 3 ? 'Previous Buyer' : "Offer"}

                    {row?.sales_status && (
                        <Box
                            sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: row?.status == 3 ? '' : 'green',
                                position: 'relative',
                                ml: 1,
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    backgroundColor: row?.status == 3 ? '' : 'green',
                                    animation: 'wave 1s infinite ease-out',
                                    opacity: 0.7,
                                },
                                '@keyframes wave': {
                                    '0%': {
                                        transform: 'scale(1.5)',
                                        opacity: 0.7,
                                    },
                                    '50%': {
                                        transform: 'scale(3)',
                                        opacity: 0,
                                    },
                                    '100%': {
                                        transform: 'scale(4)',
                                        opacity: 0,
                                    },
                                },
                            }}
                        />

                    )}
                </Button>
            </Tooltip> */}

            <Button variant="outlined"
                onClick={handleOpen}>
                {row && row?.status === 3 ? 'Previous Buyer' : "Offer"}
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Offer Form</DialogTitle>
                <DialogContent>
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)}>
                            <FormControl fullWidth sx={{ margin: "5px 0" }}>
                                <Controller
                                    name="amount"
                                    control={methods.control}
                                    rules={{ required: 'Amount is required' }}
                                    render={({ field, fieldState: { error } }) => (
                                        <RHFTextField
                                            label='Amount'
                                            name="amount"
                                            type="number"
                                            placeholder="Enter Amount"
                                        />
                                    )}
                                />
                            </FormControl>

                            <Controller
                                name="status"
                                control={methods.control}
                                rules={{ required: 'Offer status is required' }}
                                render={({ field, fieldState: { error } }) => (
                                    <RHFTextField
                                        {...field}
                                        select
                                        sx={{ margin: "20px 0" }}
                                        label='Status'
                                        type="text"
                                        placeholder="Select Offer Status"
                                        helperText={error ? error.message : ''}
                                    >
                                        <MenuItem value="1">Accepted</MenuItem>
                                        <MenuItem value="2">Rejected</MenuItem>
                                        <MenuItem value="3">Withdrawn</MenuItem>
                                    </RHFTextField>
                                )}
                            />

                            {/* Hide submit button if sales data is available */}
                            {!filteredSales?.length && (
                                <Button type="submit" variant="contained" color="primary" sx={{ marginBottom: '20px' }}>
                                    Submit
                                </Button>
                            )}
                        </form>

                        {/* Render Sales Progression buttons for sales with status 1 */}
                        {filteredSales?.map((sale, index) => (
                            <DialogActions key={index}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleSalesProgressionOpen(sale)}
                                >
                                    Sales Progression for Sale
                                </Button>
                            </DialogActions>
                        ))}
                    </FormProvider>
                </DialogContent>
            </Dialog>

            {/* Pass the selected sale object to the SalesProgressionModal */}
            <FormProvider {...method}>
                <SalesProgressionModal
                    open={salesProgressionOpen}
                    onClose={handleSalesProgressionClose}
                    row={row}
                    data={selectedSale}
                />
            </FormProvider>
        </div>
    );
};

export default OfferModal;
