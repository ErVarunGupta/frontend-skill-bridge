import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, setHours, setMinutes, isToday } from "date-fns";
import "./ScheduleForm.css";
import { MyContext } from "../../MyContext";

export default function CalendarInput() {
  const [selectedDate, setSelectedDate] = useState(null);
  const { dateTimeObj, setDateTimeObj } = useContext(MyContext);

  const now = new Date();

  const handleChange = (date) => {
    setSelectedDate(date);

    const obj = {
      date: format(date, "dd/MM/yyyy"), 
      time: format(date, "hh:mm aa"),   
    };

    setDateTimeObj(obj);
  };

  const getMinTime = () => {
    if (!selectedDate) return setHours(setMinutes(new Date(), 0), 0);
    if (isToday(selectedDate)) return now; 
    // For future dates, allow 12:00 AM
    const d = new Date(selectedDate);
    return setHours(setMinutes(d, 0), 0);
  };

  const getMaxTime = () => {
    if (!selectedDate) return setHours(setMinutes(new Date(), 59), 23);
    const d = new Date(selectedDate);
    return setHours(setMinutes(d, 59), 23);
  };

  return (
    <div>
      {dateTimeObj && (
        <p>
          <strong>Date:</strong> {dateTimeObj.date} <br />
          <strong>Time:</strong> {dateTimeObj.time}
        </p>
      )}

      <label>Select Date & Time:</label>
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        showTimeSelect
        timeFormat="hh:mm aa"                   
        timeIntervals={30}                      
        dateFormat="dd/MM/yyyy hh:mm aa"       
        placeholderText="DD/MM/YYYY hh:mm AM/PM"
        minDate={now}                          
        minTime={getMinTime()}                  
        maxTime={getMaxTime()}                  
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      />
    </div>
  );
}
