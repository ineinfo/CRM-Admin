// src/components/OfferModal.js
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, FormControl } from '@mui/material';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import SalesProgressionModal from './SalesProgressionModal';

const OfferModal = ({ row }) => {
    const [open, setOpen] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [salesProgressionOpen, setSalesProgressionOpen] = useState(false); // State for sales progression modal
    const method = useForm();
    const methods = useForm({
        defaultValues: {
            amount: '',
            status: ''
        }
    });
    console.log("===========>", row);


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormSubmitted(false);
        methods.reset();  // Reset the form when closing the dialog
    };

    const handleSalesProgressionClose = () => {
        setSalesProgressionOpen(false);
    };

    const onSubmit = (data) => {
        if (data?.status === "accepted") {
            setFormSubmitted(true);
            console.log('Form Data:', data);
        } else {
            setFormSubmitted(false);
        }
    };

    const handleSalesProgressionOpen = () => {
        setSalesProgressionOpen(true);
        handleClose(); // Close the current modal
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleOpen}>
                Offer
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
                                        <MenuItem value="accepted">Accepted</MenuItem>
                                        <MenuItem value="rejected">Rejected</MenuItem>
                                        <MenuItem value="withdrawn">Withdrawn</MenuItem>
                                    </RHFTextField>
                                )}
                            />

                            <Button type="submit" variant="contained" color="primary" sx={{ marginBottom: '20px' }}>
                                Submit
                            </Button>
                        </form>

                        {formSubmitted && (
                            <DialogActions>
                                <Button variant="contained" color="secondary" onClick={handleSalesProgressionOpen}>
                                    Sales Progression
                                </Button>
                            </DialogActions>
                        )}
                    </FormProvider>
                </DialogContent>
            </Dialog>
            <FormProvider {...method}>
                <SalesProgressionModal open={salesProgressionOpen} onClose={handleSalesProgressionClose} row={row} />
            </FormProvider>
        </div>
    );
};

export default OfferModal;
