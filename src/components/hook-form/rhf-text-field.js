import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const formatNumberWithCommas = (value) => {
  if (!value) return '';
  const stringValue = value.toString().replace(/\D/g, '');
  return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const formatDateToDDMMYYYY = (date) => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const parseDateFromDDMMYYYY = (value) => {
  if (!value) return null;
  const [day, month, year] = value.split('-');
  return new Date(year, month - 1, day); // Month is zero-based in JS Date
};

export default function RHFTextField({ name, helperText, type, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        type === 'date' ? (
          <DatePicker
            selected={field.value ? parseDateFromDDMMYYYY(field.value) : null}
            onChange={(date) => field.onChange(date ? formatDateToDDMMYYYY(date) : '')}
            dateFormat="dd-MM-yyyy"
            customInput={<TextField {...other} fullWidth />}
            placeholderText="dd-mm-yyyy"
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
                const numericValue = rawValue.replace(/,/g, '');
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
};
