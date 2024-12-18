import React, { useEffect, useRef, useState } from 'react';
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
import { GetSalesStatus, UpdateLead, UpdateSalesStatus } from 'src/api/leads';
import { useAuthContext } from 'src/auth/hooks';
import { enqueueSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';
import dayjs from 'dayjs';
import Invoice from './Invoice';


const steps = [
    'Offer Accepted',
    'Reservation form sent to the client',
    'Reservation form completed and signed by the client',
    'Solicitor instructed',
    'Mortgage or Cash buyer',
    'Survey or Searches',
    'Conveyancing Enquiries',
    'Sales Invoice Created',
    'Commission invoice sent',
    'Exchange of contracts and details',
    'Completion Date',
];

const keys = [
    'amount',
    ''
]

const Fields = {
    inv_sale_date: null,
    inv_seller_developer_name: "",
    inv_property_address: "",
    inv_apartment_type: "",
    inv_buyer_name: "",
    inv_selling_real_estate_company_name: "",
    inv_selling_agent_name: "",
    inv_total_purchase_price: '',
    inv_commission: '',
    inv_selling_brokerage_commission: "",
    inv_selling_brokerage_currency: "",
    inv_closing_note: "",
    inv_prepared_by: "",
    inv_name: "",
    inv_company_name: "",
    inv_phone: "",
    inv_email: "",
    inv_address: "",
    inv_bank_name: "",
    inv_bank_account_name: "",
    inv_bank_account_number: "",
    inv_bank_sort_code: "",
    inv_bank_reference: "",
};

const SalesProgressionModal = ({ open, onClose, row, data }) => {
    const getCountries = useCountryData();
    const [countries, setCountries] = useState([])
    const [isChecked, setIsChecked] = useState(true);
    const [download, setDownload] = useState(false);
    const [currency, setCurrency] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [countryCode, setCountryCode] = useState(0);
    const [phoneCode, setPhoneCode] = useState('')
    const [error, setError] = useState(false)
    const [type, setType] = useState('')
    const [activeStep, setActiveStep] = useState(0);
    const [moved, setMoved] = useState(true)
    const [showInvoice, setShowInvoice] = useState(false)
    const [invoiceFields, setInvoiceFields] = useState({ ...Fields });

    const invoiceRef = useRef();


    const triggerDownload = () => {
        if (invoiceRef.current) {
            invoiceRef.current.handleDownload();
        }
    };



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
            invoiceStatus: '',
            amount: '',
            completionDate: null,
        },
    });

    const { user } = useAuthContext();
    const Token = user?.accessToken;




    const { control, handleSubmit, setValue, getValues } = methods;

    const [isSaved, setIsSaved] = useState(Array(steps.length).fill(false));
    console.log("===========>2", row);
    useEffect(() => {
        if (getCountries.data) {
            setCountries(getCountries.data.data);
        }
    }, [getCountries.data]);

    useEffect(() => {
        if (open && row?.location) {
            handleCountryChange(row?.location);

        }
        // Always reset error on open
        setError(false);
    }, [open, row?.location, countries]);

    const handleCountryChange = async (name) => {
        const matchedCountry = countries.find(country => country.name === name);
        if (matchedCountry) {
            // Only set currency and phone code if they are not already set
            if (!currency) {
                setCurrency(matchedCountry.currency);
                setPhoneCode(matchedCountry.phonecode);
                setCountryCode(matchedCountry.id);
            }
        }
    };
    const handleSave = () => {
        const currentValues = getValues(`stepsData[${activeStep}]`);
        if (activeStep === 8) {
            setShowInvoice(true)
        }
        if (!currentValues) {
            return setError(true);
        }
        if (activeStep === 2 && !getValues(`documentUpload[${activeStep}]`)) {
            return setError(true);
        }
        if (activeStep === 3 &&
            (!getValues(`stepsData[${activeStep}].companyName`)?.trim() ||
                !getValues(`stepsData[${activeStep}].address`)?.trim() ||
                !getValues(`stepsData[${activeStep}].solicitorsName`)?.trim() ||
                !getValues(`stepsData[${activeStep}].number`)?.trim() ||
                !getValues(`stepsData[${activeStep}].email`)?.trim())) {
            return setError(true);
        }

        if (activeStep === 4) {
            console.log("mortgage", getValues(`stepsData[${activeStep}]`));

            // Check local state 'type' instead of using getValues
            if (type === "mortgage" && !getValues(`stepsData[${activeStep}].details`)) {
                return setError(true);  // Trigger error if no details are provided
            }
        }


        if (activeStep === 7) {
            let hasError = false;
            let errorMessage1 = ''; // Track specific error messages

            // Loop through each key in the invoiceFields
            Object.keys(invoiceFields).forEach((key) => {
                const fieldValue = getValues(`stepsData[${activeStep}].${key}`)?.trim();

                // Check if the field is empty
                if (!fieldValue) {
                    hasError = true;
                    errorMessage1 = 'All fields are required.';
                }

                // Check if the field is a number for specific keys
                if (
                    (key === 'inv_total_purchase_price' ||
                        key === 'inv_commission' ||
                        key === 'inv_selling_brokerage_commission')
                    && Number.isNaN(fieldValue)
                ) {
                    hasError = true;
                    errorMessage1 = `The field ${key.replace(/^inv_/, '').replace(/_/g, ' ')} must be a valid number.`;
                }
            });

            // If any field has an error, set the error flag and show the specific message
            if (hasError) {
                setError(true);
                setErrorMessage(errorMessage1); // You can set the error message to display the correct message
                return true;
            }
        }


        if (activeStep === 9 &&
            (!getValues(`stepsData[${activeStep}].amount`)?.trim() ||
                !getValues(`stepsData[${activeStep}].date`)?.trim())) {
            return setError(true);
        }

        if (activeStep === 10 &&
            (!getValues(`documentUpload[${activeStep}]`))) {
            return setError(true);
        }
        setError(false)
        console.log(`Saving step ${activeStep}:`, currentValues); // Debug log
        setIsSaved((prev) => {
            const newSavedStatus = [...prev];
            newSavedStatus[activeStep] = true;
            return newSavedStatus;
        });
        handleSubmit(onSubmit)();

        return true
    };

    const onSubmit = async () => {
        let data1 = {

        };
        if (activeStep === 0) {
            const stepDataValue = Number(getValues(`stepsData[${activeStep}]`).replace(/[^0-9.-]+/g, ""));
            data1 = {
                lead_id: row?.id,
                [keys[activeStep]]: stepDataValue, // Use the converted number here
                lead_status: activeStep + 1
            }
        }

        if (activeStep === 1) {
            data1 = {
                lead_id: row?.id,
                lead_status: activeStep + 1
            };
        }
        if (activeStep === 2) {
            data1 = new FormData();
            data1.append('lead_id', row?.id);
            data1.append('lead_status', activeStep + 1);

            // Assuming document is the file to be uploaded
            const documentFile = await getValues(`documentUpload[${activeStep}]`);
            console.log("File", documentFile);

            if (documentFile) {
                data1.append('document', documentFile); // Append the document file
            }
        }

        if (activeStep === 3) {
            data1 = {
                lead_id: row?.id,
                company_name: getValues(`stepsData[${activeStep}].companyName`),
                address: getValues(`stepsData[${activeStep}].address`),
                solicitor_name: getValues(`stepsData[${activeStep}].solicitorsName`),
                number: getValues(`stepsData[${activeStep}].number`),
                email: getValues(`stepsData[${activeStep}].email`),
                lead_status: activeStep + 1
            }
        }
        if (activeStep === 4) {
            data1 = {
                lead_id: row?.id,
                mortgage_status: type === "mortgage" ? 1 : 2,
                mortgage_amount: getValues(`stepsData[${activeStep}].details`),
                lead_status: activeStep + 1
            }
        }
        if (activeStep === 5) {
            data1 = {
                lead_id: row?.id,
                servey_search: getValues(`stepsData[${activeStep}]`),
                lead_status: activeStep + 1
            }
        }
        if (activeStep === 6) {
            data1 = {
                lead_id: row?.id,
                conveyancing: getValues(`stepsData[${activeStep}]`),
                lead_status: activeStep + 1
            }
        }
        if (activeStep === 7) {
            // Start with the base data1 object
            data1 = {
                lead_id: row?.id,
                sales_invoice_credited: "yes",
                lead_status: activeStep + 1,
            };

            // Add the invoiceFields keys and their values to the data1 object
            Object.keys(invoiceFields).forEach((key) => {
                const value = getValues(`stepsData[${activeStep}].${key}`);

                // Convert to number if the key is inv_commission or inv_total_purchase_price
                if (key === 'inv_commission' || key === 'inv_total_purchase_price' || key === 'inv_selling_brokerage_commission') {
                    data1[key] = Number(value) || 0; // Convert to number, default to 0 if NaN
                } else {
                    data1[key] = value; // Keep the original value
                }
            });
        }

        if (activeStep === 7) {
            const updatedFields = { ...invoiceFields }; // Create a copy to update

            Object.keys(invoiceFields).forEach((key) => {
                const value = getValues(`stepsData[${activeStep}].${key}`);

                // Set value in updatedFields
                if (key === 'inv_commission' || key === 'inv_total_purchase_price' || key === 'inv_selling_brokerage_commission') {
                    updatedFields[key] = Number(value) || 0; // Convert to number, default to 0 if NaN
                } else {
                    updatedFields[key] = value || ""; // Set value, default to empty string if no value
                }
            });

            setInvoiceFields(updatedFields); // Update the state
            setShowInvoice(true);
            console.log('Invoice2', updatedFields); // Log the updated fields
        }

        if (activeStep === 8) {
            data1 = {
                lead_id: row?.id,
                commission_invoice_value: getValues(`stepsData[${activeStep}]`),
                lead_status: activeStep + 1
            }
        }


        if (activeStep === 9) {
            data1 = {
                lead_id: row?.id,
                exchange_of_contract_amount: Number(getValues(`stepsData[${activeStep}].amount`).replace(/[^0-9.-]+/g, "")),
                exchange_of_contract_date: getValues(`stepsData[${activeStep}].date`),
                lead_status: activeStep + 1
            }
        }
        if (activeStep === 10) {
            data1 = new FormData();
            data1.append('lead_id', row?.id);
            data1.append('lead_status', activeStep + 1);
            const completionDate = await getValues(`stepsData[${activeStep}]`);
            if (completionDate) {
                data1.append('completion_date', completionDate);
            }
            const documentFile = await getValues(`documentUpload[${activeStep}]`);
            console.log("File", documentFile);

            if (documentFile) {
                data1.append('document', documentFile); // Append the document file
            }
        }


        try {
            await UpdateSalesStatus(data1, Token)
            if (activeStep < steps.length - 1) {
                setActiveStep((prev) => prev + 1);

            }
        } catch (errr) {
            console.log(errr);

        }


    };

    const getStatus = async () => {
        try {
            const value = await GetSalesStatus(row?.id, Token);

            if (value && value.length > 0) {
                console.log("Status", value);
                const updatedFields = { ...invoiceFields }; // Create a copy for updates

                // Loop through each item in value
                value.forEach((item, index) => {
                    console.log('Item:', item); // Log item structure for debugging

                    if (item.lead_status === 8) {
                        Object.keys(invoiceFields).forEach((key) => {
                            const value1 = item[key]; // Change item.key to item[key]

                            // Set value in updatedFields
                            if (key === 'inv_commission' || key === 'inv_total_purchase_price' || key === 'inv_selling_brokerage_commission') {
                                updatedFields[key] = Number(value1) || 0; // Convert to number, default to 0 if NaN
                            } else {
                                updatedFields[key] = value1 || ""; // Set value, default to empty string if no value
                            }
                        });
                        setInvoiceFields(updatedFields); // Update the state after the loop
                        console.log('Invoice', updatedFields, item);
                        setShowInvoice(true)
                    }



                    setActiveStep((prev) => prev + 1);
                });
            }
        } catch (err) {
            console.error("Error fetching status:", err);
        }
    };


    const getStepLabelValue = (index) => {
        if (index === 3) {
            return getValues(`stepsData[${index}].companyName`);
        }
        if (index === 4) {
            return type;
        }
        if (index === 8) {
            return getValues(`stepsData[${index}].amount`);
        }
        if (index === 7) {
            return 'Yes';
        }
        if (index === 9) {
            return getValues(`stepsData[${index}].date`);
        }
        return getValues(`stepsData[${index}]`) || '';
    };


    // Call getStatus on component mount or when row changes
    useEffect(() => {
        if (open && row?.id) {
            getStatus();
            if (row?.status === 3) {
                setMoved(false)
            } else {
                setMoved(true)
            }
        } else if (!open) {
            // Reset state when modal is closed
            setActiveStep(0);
            setIsSaved(Array(steps.length).fill(false));
        }
    }, [open, row?.id]);


    const handleComplete = async () => {
        // Reset states when closing modal
        const formData = new FormData();

        // Add row data to formData
        Object.keys(row).forEach(key => {
            if (key === 'status') {
                formData.append('status', 3); // Update status to 3
            } else if (key === 'location') {
                formData.append('location', countryCode);
            } else if (key === 'handover_date') {
                // Format the handover_date to dd-mm-yyyy
                const formattedDate = dayjs(row[key]).format('DD-MM-YYYY');
                formData.append('handover_date', formattedDate);
            } else if (['parking_option', 'no_of_bathrooms', 'property_type', 'amenities', 'match_property', 'files'].includes(key)) {
                // Convert the array to a JSON string and append it
                formData.append(key, JSON.stringify(row[key]));
            } else {
                formData.append(key, row[key]);
            }
        });

        try {
            // Make the API call to update the lead with formData
            await UpdateLead(row.id, formData, Token);
            enqueueSnackbar('Moved to previous buyer', { variant: 'success' });
        } catch (errr) {
            enqueueSnackbar(errr.response?.data?.message || 'Unknown error', { variant: 'error' });
        }

        setActiveStep(0);
        setIsSaved(Array(steps.length).fill(false));
        onClose();
        setActiveStep((prev) => prev + 1);
        setMoved(false);
    };



    console.log("1121222", activeStep, moved);


    const renderStepContent = (index) => {
        switch (index) {
            case 0: // Offer Accepted
                return (
                    <>
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
                                    thousandSeparator
                                    isNumericString
                                    decimalScale={0} // no decimals
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" style={{ border: "none" }}>
                                                <Select
                                                    sx={{
                                                        border: "none",
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            border: "none",
                                                        },
                                                    }}
                                                    value={currency}
                                                    onChange={(e) => setCurrency(e.target.value)}
                                                    displayEmpty
                                                    renderValue={(selected) => selected || "Select Currency"}
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

                        {error && <div style={{ color: "red", marginTop: "5px" }}>Field is mandatory</div>}
                    </>
                );


            case 1: // Reservation form sent
                return (
                    <>
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
                        {error && <div style={{ color: "red", marginTop: "5px" }}>
                            Field is mandatory
                        </div>}
                    </>
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
                                            field.onChange(e.target.checked ? "Yes" : ""); // Update form state
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
                        {error && !getValues(`stepsData[${index}].documentUpload`) && (
                            <div style={{ color: "red", marginTop: "5px" }}>
                                All Field is mandatory
                            </div>
                        )}
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
                                            field.onChange(value || ''); // Update field value without the phone code
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
                        {error && <div style={{ color: "red", marginTop: "5px" }}>
                            All Fields are mandatory
                        </div>}
                    </div>
                )

            case 4: // Mortgage or Cash buyer
                return (
                    <>
                        <Controller
                            name={`stepsData[${index}]`}
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
                        {type === "mortgage" && ( // Check local state instead of getValues
                            <div style={{ marginTop: '8px' }}>
                                <Controller
                                    name={`stepsData[${index}].details`}
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
                        {error && <div style={{ color: "red", marginTop: "5px" }}>
                            Field is mandatory
                        </div>}
                    </>
                );


            case 5: // Survey or Searches
            case 6: // Conveyancing Enquiries
                return (
                    <>
                        <FormControl fullWidth variant="outlined" sx={{ marginTop: "10px" }}>
                            <Controller
                                name={`stepsData[${index}]`}
                                control={control}
                                render={({ field }) => (
                                    <RHFTextField
                                        {...field}
                                        id={`stepsData[${index}]`} // Adding id for accessibility
                                        placeholder="Enter Details"
                                        label={index === 5 ? 'Survey or Searches' : 'Conveyancing Enquiries'}
                                    />
                                )}
                            />
                        </FormControl>
                        {error && <div style={{ color: "red", marginTop: "5px" }}>
                            Field is mandatory
                        </div>}
                    </>
                );

            case 7: // Sales Invoice Created
                return (
                    <>
                        <div style={{ display: "flex" }}>
                            <FormControl fullWidth variant="outlined" sx={{ marginBottom: "10px" }}>
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
                                                onChange={(event) => {
                                                    const value = event.target.value;
                                                    field.onChange(value); // Update the form state

                                                    // Set download state based on selection
                                                    setDownload(value === 'yes');
                                                }}
                                            >
                                                <MenuItem value="">Select an option</MenuItem> {/* Placeholder */}
                                                <MenuItem value="yes">Yes</MenuItem>
                                                <MenuItem value="">No</MenuItem>
                                            </Select>
                                        </>
                                    )}
                                />
                            </FormControl>


                        </div>

                        {download && (
                            <>
                                {Object.keys(invoiceFields).map((key) => (
                                    <div style={{ marginTop: "10px" }} key={key}> {/* Add key here for the div */}
                                        <Controller
                                            name={`stepsData[${index}].${key}`} // Use a nested structure for the invoice data
                                            control={control}
                                            defaultValue={invoiceFields[key]} // Set the default value from the object
                                            render={({ field }) => {
                                                // Check if the current key is 'inv_selling_brokerage_currency'
                                                if (key === 'inv_selling_brokerage_currency') {
                                                    return (
                                                        <FormControl fullWidth variant="outlined" style={{ marginBottom: "10px" }}>
                                                            <InputLabel id={`select-${key}-label`}>
                                                                {key.replace(/^inv_/, '').replace(/_/g, ' ').toUpperCase()} {/* Label formatting */}
                                                            </InputLabel>
                                                            <Select
                                                                {...field}
                                                                labelId={`select-${key}-label`}
                                                                label={key.replace(/^inv_/, '').replace(/_/g, ' ').toUpperCase()} // Label for the select box
                                                                style={{ marginBottom: "10px" }} // Consistent styling
                                                            >
                                                                <MenuItem value="">
                                                                    <em>Select Currency</em> {/* Placeholder option */}
                                                                </MenuItem>
                                                                <MenuItem value="AED">AED</MenuItem>
                                                                <MenuItem value="GBP">GBP</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    );
                                                }

                                                return (
                                                    <RHFTextField
                                                        {...field}
                                                        label={key.replace(/^inv_/, '').replace(/_/g, ' ').toUpperCase()} // Formatting the label
                                                        type={invoiceFields[key] === null ? 'date' : 'text'}
                                                        variant="outlined"
                                                        fullWidth
                                                        style={{ marginBottom: "10px" }}
                                                    />
                                                );
                                            }}
                                        />
                                    </div>
                                ))}
                            </>
                        )}

                        {error && (
                            <div style={{ color: "red", marginTop: "5px" }}>
                                {errorMessage || "Field is Required"}
                            </div>
                        )}
                    </>
                );

            case 8: // Conveyancing Enquiries
                return (
                    <>
                        <FormControl fullWidth variant="outlined" sx={{ marginTop: "10px" }}>
                            <Controller
                                name={`stepsData[${index}]`}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id={`stepsData[${index}]`} // Adding id for accessibility
                                        placeholder="Enter Details"
                                        label="Commission invoice sent"
                                        variant="outlined"
                                        type="number" // Restrict input to numbers
                                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // Prevent non-numeric input
                                    />
                                )}
                            />
                        </FormControl>
                        {error && (
                            <div style={{ color: "red", marginTop: "5px" }}>
                                Field is mandatory
                            </div>
                        )}
                    </>
                );
            case 9: // Exchange of contracts
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
                                    thousandSeparator
                                    isNumericString
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
                        {error && <div style={{ color: "red", marginTop: "5px" }}>
                            Field is mandatory
                        </div>}
                    </>
                );

            case 10: // Completion Date and ID Proof
                return (
                    <>
                        {/* Completion Date Field */}
                        <FormControl fullWidth variant="outlined">
                            <Controller
                                name={`stepsData[${index}]`}
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <RHFTextField
                                        {...field}
                                        type="date"
                                        label="Completion Date"
                                        id={`stepsData[${index}].completionDate`} // Adding id for accessibility
                                        InputLabelProps={{ shrink: true }} // Ensures the label stays shrunk when a date is selected
                                    />
                                )}
                            />
                        </FormControl>



                        {/* ID Proof Upload Field */}
                        <FormControl fullWidth variant="outlined" style={{ marginTop: "15px" }}>
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
                                                // Set the step value as the file name
                                            }
                                        }}
                                    />
                                )}
                            />
                        </FormControl>

                        {error && <div style={{ color: "red", marginTop: "5px" }}>
                            Field is mandatory
                        </div>}
                    </>
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
                                    {label} {isSaved[index] && ` - ${getStepLabelValue(index)}`}
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

                    {showInvoice && <>
                        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                            <Invoice ref={invoiceRef} data={invoiceFields} />
                        </div>

                        <Button onClick={triggerDownload} variant="contained" color="info">
                            Invoice <Iconify icon="solar:import-bold" />
                        </Button>
                    </>}

                    <Button onClick={onClose} color="secondary">
                        Close
                    </Button>
                    {moved && isSaved[steps.length - 1] && (
                        <Button onClick={handleComplete} color="primary" variant="contained">
                            Completed
                        </Button>
                    )}
                    {!moved && (
                        <Button color="warning" variant="outlined">
                            Moved to previous buyer
                        </Button>
                    )}
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
};

export default SalesProgressionModal;
