import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import "./ScheduleForm.css";
import { MyContext } from "../../MyContext";

export default function CalendarInput() {
  const [selectedDate, setSelectedDate] = useState(null);
  const { dateTimeObj, setDateTimeObj } = useContext(MyContext);

  const handleChange = (date) => {
    setSelectedDate(date);

    const obj = {
      date: format(date, "dd/MM/yyyy"), // only date
      time: format(date, "HH:mm"), // only time (24-hour)
    };

    setDateTimeObj(obj);
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
        timeFormat="HH:mm"
        timeIntervals={30}
        dateFormat="dd/MM/yyyy HH:mm"
        placeholderText="DD/MM/YYYY HH:mm"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // stop form submit
          }
        }}
      />
    </div>
  );
}
