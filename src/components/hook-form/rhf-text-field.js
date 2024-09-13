import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';

// Function to format number with commas
const formatNumberWithCommas = (value) => {
  if (!value) return '';
  const stringValue = value.toString().replace(/\D/g, '');
  return stringValue.replace(/^0+/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Remove leading zeros and format with commas
};

// Function to format date to DD-MM-YYYY
const formatDateToDDMMYYYY = (date) => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return ` ${year}-${month}-${day}`;
};

// Function to parse date from DD-MM-YYYY
const parseDateFromDDMMYYYY = (value) => {
  if (!value || !/^\d{2}-\d{2}-\d{4}$/.test(value)) return null; // Return null if no value or invalid format
  const [day, month, year] = value.split('-');
  const parsedDate = new Date(`${year}-${month}-${day}`);
  return isNaN(parsedDate.getTime()) ? null : parsedDate; // Check for invalid date
};

export default function RHFTextField({ name, helperText, type, placeholder, ...other }) {
  const { control } = useFormContext();
  const [selectedDate, setSelectedDate] = useState(null); // Initialize state for selected date

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        type === 'date' ? (
          <DatePicker
            selected={selectedDate || parseDateFromDDMMYYYY(field.value) || null} // Safely handle null or invalid dates
            onChange={(date) => {
              const formattedDate = date ? formatDateToDDMMYYYY(date) : '';
              setSelectedDate(date); // Update state with selected date
              field.onChange(formattedDate);
            }}
            dateFormat="dd-MM-yyyy"
            customInput={<TextField {...other} fullWidth />}
            placeholderText={placeholder || 'dd-mm-yyyy'} // Ensure placeholder is shown
            isClearable
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            todayButton="Today" // Optional, if you want to add a button to select today’s date
          />
        ) : type === 'mobile' ? (
          <TextField
            {...field}
            fullWidth
            type="text" // Use text input for mobile numbers
            value={field.value ? field.value.replace(/\D/g, '') : ''} // Ensure only numbers are displayed
            onChange={(event) => {
              const rawValue = event.target.value;
              const numericValue = rawValue.replace(/\D/g, ''); // Remove non-numeric characters
              field.onChange(numericValue);
            }}
            error={!!error}
            helperText={error ? error?.message : helperText}
            placeholder={placeholder}
            {...other}
          />
        ) : (
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
        )
      }
    />
  );
}

RHFTextField.propTypes = {
  helperText: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string, // Add placeholder to propTypes
};
