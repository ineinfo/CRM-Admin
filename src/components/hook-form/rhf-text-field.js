import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';

// Function to format number with commas
export const formatNumberWithCommas = (value) => {
  if (!value) return '';
  const stringValue = value.toString().replace(/[^\d.]/g, ''); // Allow digits and decimal point
  const parts = stringValue.split('.');
  parts[0] = parts[0].replace(/^0+/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Remove leading zeros and format with commas
  return parts.join('.');
};

// Function to format date to DD-MM-YYYY
const formatDateToDDMMYYYY = (date) => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Function to parse date from DD-MM-YYYY
const parseDateFromDDMMYYYY = (value) => {
  if (!value || !/^\d{2}-\d{2}-\d{4}$/.test(value)) return null; // Return null if no value or invalid format
  const [day, month, year] = value.split('-');
  const parsedDate = new Date(`${year}-${month}-${day}`);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate; // Check for invalid date
};

export default function RHFTextField({ name, helperText, type, placeholder, ...other }) {
  const { control } = useFormContext();
  const [selectedDate, setSelectedDate] = useState(null); // Initialize state for selected date

  // Date Picker Component
  // Date Picker Component
  const renderDatePicker = (field, error) => (
    <DatePicker
      selected={selectedDate || (field.value ? parseDateFromDDMMYYYY(field.value) : null)} // Set to null if field.value is null
      onChange={(date) => {
        const formattedDate = date ? formatDateToDDMMYYYY(date) : '';
        setSelectedDate(date); // Update state with selected date
        field.onChange(formattedDate); // Pass formatted date or empty string
      }}
      dateFormat="dd-MM-yyyy"
      customInput={<TextField {...other} fullWidth sx={{ zIndex: 10 }} />}
      placeholderText={placeholder || 'dd-mm-yyyy'} // Ensure placeholder is shown
      isClearable={false}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      todayButton="Today" // Optional, if you want to add a button to select today’s date
    />
  );


  // Mobile Input Component
  const renderMobileInput = (field, error) => (
    <TextField
      {...field}
      fullWidth
      type="text" // Use text input for mobile numbers
      value={field.value ? field.value.replace(/\D/g, '') : ''} // Ensure only numbers are displayed
      onChange={(event) => {
        const rawValue = event.target.value;
        const numericValue = rawValue.replace(/\D/g, ''); // Remove non-numeric characters
        if (numericValue.length <= 5000) {
          // Limit the input to 15 characters
          field.onChange(numericValue);
        }
      }}
      error={!!error}
      helperText={error ? error?.message : helperText}
      placeholder={placeholder}
      {...other}
    />
  );

  // Number or Other Input Component
  const renderNumberOrOtherInput = (field, error) => (
    <TextField
      {...field}
      fullWidth
      type={type === 'number' ? 'text' : type}
      value={type === 'number' ? formatNumberWithCommas(field.value || '') : field.value}
      onChange={(event) => {
        const rawValue = event.target.value;
        if (type === 'number') {
          const numericValue = rawValue.replace(/,/g, '').replace(/^0+/, ''); // Remove leading zeros
          field.onChange(numericValue);
        } else {
          field.onChange(rawValue);
        }
      }}
      error={!!error}
      helperText={error ? error?.message : helperText}
      {...other}
    />
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        if (type === 'date') {
          return renderDatePicker(field, error);
        }
        if (type === 'mobile') {
          return renderMobileInput(field, error);
        }
        return renderNumberOrOtherInput(field, error);
      }}
    />
  );
}

RHFTextField.propTypes = {
  helperText: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string, // Add placeholder to propTypes
};
