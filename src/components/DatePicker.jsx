import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerComponent = ({ selectedDate, onDateChange, datePickerRef }) => {
    return (
        <DatePicker
            selected={selectedDate}
            onChange={(date) => onDateChange(date)}
            placeholderText="Pick a date"
            ref={datePickerRef}
            inline
        />
    );
};

export default DatePickerComponent;
