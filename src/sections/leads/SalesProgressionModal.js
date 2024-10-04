import React, { useEffect, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Checkbox,
    MenuItem,
    Select,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
} from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';
import { useCountryData } from 'src/api/propertytype';
import { NumericFormat } from 'react-number-format';

const steps = [
    'Offer Accepted',
    'Reservation form sent to the client',
    'Reservation form completed and signed by the client',
    'Solicitor instructed',
    'Mortgage or Cash buyer',
    'Survey or Searches',
    'Conveyancing Enquiries',
    'Sales Invoice Created',
    'Exchange of contracts and details',
    'Completion Date',
];

const SalesProgressionModal = ({ open, onClose, row }) => {
    const getCountries = useCountryData();
    const [countries, setCountries] = useState([])
    const [isChecked, setIsChecked] = useState(true);
    const [currency, setCurrency] = useState('');
    const [phoneCode, setPhoneCode] = useState('')
    const [type, setType] = useState('')
    const methods = useForm({
        defaultValues: {
            stepsData: Array(steps.length).fill(''),
            solicitor: {
                companyName: '',
                address: '',
                email: '',
                contact: '',
            },
            mortgageType: '',
            mortgageDetails: '',
            invoiceStatus: '',
            amount: '',
            completionDate: null,
        },
    });

    const { control, handleSubmit, setValue, getValues } = methods;

    const [activeStep, setActiveStep] = useState(0);
    const [isSaved, setIsSaved] = useState(Array(steps.length).fill(false));
    console.log("===========>2", row);
    useEffect(() => {
        if (getCountries.data) {
            setCountries(getCountries.data.data);
        }
    }, [getCountries.data]);

    const handleCountryChange = async (name) => {
        const matchedCountry = await countries.find(country => country.name === name);
        if (matchedCountry) {
            setCurrency(matchedCountry.currency);
            setPhoneCode(matchedCountry.phonecode)// Assuming `currency` is the key you're looking for
        }
    };
    useEffect(() => {
        if (open && row.location) {
            handleCountryChange(row.location);
        }
    }, [open, row.location, countries]);
    const handleSave = () => {
        const currentValues = getValues(`stepsData[${activeStep}]`);
        console.log(`Saving step ${activeStep}:`, currentValues); // Debug log
        setIsSaved((prev) => {
            const newSavedStatus = [...prev];
            newSavedStatus[activeStep] = true;
            return newSavedStatus;
        });
        handleSubmit(onSubmit)();
    };

    const onSubmit = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((prev) => prev + 1);
        }
    };
    const handleComplete = () => {
        onClose()
        alert('Moved to Previous Buyer')
    }
    const renderStepContent = (index) => {
        switch (index) {
            case 0: // Offer Accepted
                return (
                    <Controller
                        name={`stepsData[${index}]`}
                        control={control}
                        render={({ field }) => (
                            <NumericFormat
                                {...field}
                                customInput={RHFTextField}
                                fullWidth
                                variant="outlined"
                                placeholder="Enter amount"
                                allowNegative={false}
                                thousandSeparator={true}
                                isNumericString={true}
                                decimalScale={0} // no decimals
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" style={{ border: "none" }}>
                                            <Select
                                                sx={{
                                                    border: "none", // remove the border
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        border: "none", // remove the border of the select box
                                                    },
                                                }}
                                                value={currency} // use the currency from state
                                                onChange={(e) => setCurrency(e.target.value)} // update currency on selection
                                                displayEmpty
                                                renderValue={(selected) => (selected ? selected : "Select Currency")} // display placeholder if no currency
                                            >
                                                {countries.map((country) => (
                                                    <MenuItem key={country.id} value={country.currency}>
                                                        {country.currency}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </InputAdornment>
                                    ),
                                }}
                                onValueChange={({ value }) => field.onChange(value)} // handle value change
                            />
                        )}
                    />

                );

            case 1: // Reservation form sent
                return (
                    <Controller
                        name={`stepsData[${index}]`}
                        control={control}
                        render={({ field }) => (
                            <div>
                                <Checkbox
                                    {...field}
                                    checked={!!field.value} // Checkbox remains checkable
                                    onChange={(e) => {
                                        const newValue = e.target.checked ? 'Yes' : '';
                                        field.onChange(newValue);
                                    }}
                                />
                                <Typography variant="caption">Form sent?</Typography>
                            </div>
                        )}
                    />
                );

            case 2: // Reservation form completed
                return (
                    <div>
                        {/* Checkbox to confirm the form is signed */}
                        <Controller
                            name={`stepsData[${index}]`}
                            control={control}
                            defaultValue="Yes" // Default value for form state
                            render={({ field }) => (
                                <div>
                                    <Checkbox
                                        {...field}
                                        checked={isChecked} // Use local state for checked
                                        onChange={(e) => {
                                            setIsChecked(e.target.checked); // Update local state
                                            field.onChange(e.target.checked ? "Yes" : "No"); // Update form state
                                        }}
                                    />
                                    <Typography variant="caption">Form signed?</Typography>
                                </div>
                            )}
                        />

                        {/* Show the file upload only if the checkbox is checked */}
                        {isChecked ? (
                            <Controller
                                name={`documentUpload[${index}]`}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{
                                            accept: 'application/pdf', // Only PDF allowed
                                        }}
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                // Check file type and size
                                                const isValidFile =
                                                    file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024;

                                                if (!isValidFile) {
                                                    alert('Please upload a valid PDF file less than 5 MB.');
                                                    return;
                                                }

                                                field.onChange(file); // Save the file to the form state
                                                setValue(`stepsData[${index}]`, file.name); // Set the step value as the file name
                                            }
                                        }}
                                    />
                                )}
                            />
                        ) : (
                            // <Typography variant="body2">Not completed yet</Typography> 
                            ''
                        )}

                        {/* Display the file name after document upload */}
                        {/* {getValues(`stepsData[${index}]`) && (
                            <Typography color="success" variant="body2">
                                {getValues(`stepsData[${index}]`)} 
                            </Typography>
                        )} */}
                    </div>
                );


            case 3: // Solicitor instructed
                return (
                    <div style={{ marginBottom: '16px' }}> {/* Add margin for spacing */}
                        {/* Company Name */}
                        <Controller
                            name={`stepsData[${index}].companyName`}
                            control={control}
                            render={({ field }) => (
                                <div style={{ marginBottom: '8px' }}> {/* Margin for each field */}
                                    {/* <Typography variant="caption">Company Name</Typography> */}
                                    <TextField
                                        {...field}
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Company Name"
                                    />
                                </div>
                            )}
                        />

                        {/* Address */}
                        <Controller
                            name={`stepsData[${index}].address`}
                            control={control}
                            render={({ field }) => (
                                <div style={{ marginBottom: '8px' }}> {/* Margin for each field */}
                                    {/* <Typography variant="caption">Address</Typography> */}
                                    <TextField
                                        {...field}
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Address"
                                    />
                                </div>
                            )}
                        />

                        {/* Solicitors Name */}
                        <Controller
                            name={`stepsData[${index}].solicitorsName`}
                            control={control}
                            render={({ field }) => (
                                <div style={{ marginBottom: '8px' }}> {/* Margin for each field */}
                                    {/* <Typography variant="caption">Solicitors Name</Typography> */}
                                    <TextField
                                        {...field}
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Solicitors Name"
                                    />
                                </div>
                            )}
                        />

                        {/* Number */}
                        <Controller
                            name={`stepsData[${index}].number`}
                            control={control}
                            render={({ field }) => (
                                <div style={{ marginBottom: '8px' }}> {/* Margin for each field */}
                                    <TextField
                                        {...field}
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Number"
                                        type="tel" // Specify input type as tel for number input
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">{phoneCode}</InputAdornment>, // Display phone code as an adornment
                                        }}
                                        onChange={(e) => {
                                            // Allow only numbers and update field value
                                            const value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                                            field.onChange(value ? value : ''); // Update field value without the phone code
                                        }}
                                        value={field.value || ''} // Display number as is
                                    />
                                </div>
                            )}
                        />

                        {/* Email */}
                        <Controller
                            name={`stepsData[${index}].email`}
                            control={control}
                            render={({ field }) => (
                                <div style={{ marginBottom: '8px' }}> {/* Margin for each field */}
                                    {/* <Typography variant="caption">Email</Typography> */}
                                    <TextField
                                        {...field}
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Email"
                                        type="email" // Specify input type as email
                                    />
                                </div>
                            )}
                        />
                    </div>
                )

            case 4: // Mortgage or Cash buyer
                return (
                    <div>
                        <Controller
                            name="mortgageType"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    fullWidth
                                    label="Select"
                                    variant="outlined"
                                    onChange={(e) => {
                                        const selectedValue = e.target.value;
                                        field.onChange(selectedValue); // Update the form state
                                        setType(selectedValue); // Update the local state
                                    }}
                                >
                                    <MenuItem value="mortgage">Mortgage</MenuItem>
                                    <MenuItem value="cashBuyer">Cash Buyer</MenuItem>
                                </TextField>
                            )}
                        />
                        {getValues('mortgageType') === "mortgage" && ( // Check local state instead of getValues
                            <div style={{ marginTop: '8px' }}>
                                <Controller
                                    name="mortgageDetails"
                                    control={control}
                                    render={({ field }) => (
                                        <RHFTextField
                                            {...field}
                                            fullWidth
                                            variant="outlined"
                                            label="Mortgage Details"
                                            placeholder="Enter mortgage details"
                                        />
                                    )}
                                />
                            </div>
                        )}
                    </div>
                );


            case 5: // Survey or Searches
            case 6: // Conveyancing Enquiries
                return (
                    <FormControl fullWidth variant="outlined" sx={{ marginTop: "10px" }}>
                        <Controller
                            name={`stepsData[${index}]`}
                            control={control}
                            render={({ field }) => (
                                <RHFTextField
                                    {...field}
                                    id={`stepsData[${index}]`} // Adding id for accessibility
                                    placeholder="Enter Details"
                                    label={index == 5 ? 'Survey or Searches' : 'Conveyancing Enquiries'}
                                />
                            )}
                        />
                    </FormControl>
                );

            case 7: // Sales Invoice Created
                return (
                    <FormControl fullWidth variant="outlined">
                        <Controller
                            name={`stepsData[${index}]`}
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        id={`stepsData[${index}]`} // Adding id for accessibility
                                        displayEmpty
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 200, // Set a max height for the dropdown menu
                                                },
                                            },
                                        }}
                                        sx={{ height: '56px', display: 'flex', alignItems: 'center' }} // Ensure adequate height
                                    >
                                        <MenuItem value="">Select an option</MenuItem> {/* Placeholder */}
                                        <MenuItem value="yes">Yes</MenuItem>
                                        <MenuItem value="no">No</MenuItem>
                                    </Select>
                                </>
                            )}
                        />
                    </FormControl>
                );

            case 8: // Exchange of contracts
                return (

                    <>
                        <Controller
                            name={`stepsData[${index}].amount`} // Name for the numeric field
                            control={control}
                            render={({ field }) => (
                                <NumericFormat
                                    {...field}
                                    customInput={RHFTextField}
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Enter amount"
                                    allowNegative={false}
                                    thousandSeparator={true}
                                    isNumericString={true}
                                    decimalScale={0} // no decimals
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">{currency}</InputAdornment>
                                    }}
                                    onValueChange={({ value }) => field.onChange(value)} // handle value change
                                />
                            )}
                        />

                        <FormControl fullWidth variant="outlined" sx={{ marginTop: "10px" }}>
                            <Controller
                                name={`stepsData[${index}].date`}
                                control={control}
                                render={({ field }) => (
                                    <RHFTextField
                                        {...field}
                                        type="date"
                                        id={`stepsData[${index}].date`} // Adding id for accessibility
                                        InputLabelProps={{ shrink: true }} // Ensures the label stays shrunk when a date is selected
                                    />
                                )}
                            />
                        </FormControl>
                    </>
                );

            case 9: // Completion Date
                return (
                    <FormControl fullWidth variant="outlined">
                        <Controller
                            name={`stepsData[${index}]`}
                            control={control}
                            render={({ field }) => (
                                <RHFTextField
                                    {...field}
                                    type="date"
                                    id={`stepsData[${index}]`} // Adding id for accessibility
                                    InputLabelProps={{ shrink: true }} // Ensures the label stays shrunk when a date is selected
                                />
                            )}
                        />
                    </FormControl>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Sales Progression</DialogTitle>
            <FormProvider {...methods}>
                <DialogContent>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel>
                                    {label} {isSaved[index] && ` - ${index == 3 ? getValues(`stepsData[${index}].companyName`) : index == 4 ? type : index == 8 ? getValues(`stepsData[${index}].amount`) : getValues(`stepsData[${index}]`) || ''}`}
                                </StepLabel>
                                {activeStep === index && !isSaved[index] && (
                                    <>
                                        {renderStepContent(index)}
                                        <Button
                                            onClick={handleSave}
                                            color="primary"
                                            variant="contained"
                                            sx={{ margin: '10px' }}
                                        >
                                            Save
                                        </Button>
                                    </>
                                )}
                            </Step>
                        ))}
                    </Stepper>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Close
                    </Button>
                    {isSaved[steps.length - 1] && (
                        <Button onClick={handleComplete} color="primary" variant="contained">
                            Completed
                        </Button>
                    )}
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
};

export default SalesProgressionModal;
