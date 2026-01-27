import React, { useState, useEffect, useRef } from 'react'

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./BookingCalendar.css";
import { getBookingDates } from '../../services/BookingService';
import { useParams } from 'react-router-dom';


const BookingCalendar = ({ isEditable = false, handleChange, name, minDate, setShowCalendar, portfolio }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [currentMonth, setCurrentMonth] = useState(minDate?.getMonth() + 1 || "");
    const [currentYear, setCurrentYear] = useState(minDate?.getFullYear() || "");

    const [bookings, setBookings] = useState([]);
    const { portfolioId } = useParams();

    const calendarRef = useRef(null);
    useEffect(() => {
        if (typeof setShowCalendar !== "function") return;
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false)
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowCalendar]);

    useEffect(() => {
        const loadBookingDates = async () => {
            try {
                const portfolio_id = portfolioId ? portfolioId : portfolio
                const result = await getBookingDates(currentMonth, currentYear, portfolio_id);
                setBookings(result.bookings)
            } catch (error) {
                console.error("Error getting the booking dates: ", error)

            }
        };
        loadBookingDates();
    }, [currentMonth, currentYear, portfolioId, portfolio]);


    const tileClassName = ({ date }) => {
        const today = date.setHours(0, 0, 0, 0);
        for (const booking of bookings) {
            const start_date = new Date(booking.sessionStartDate).setHours(0, 0, 0, 0);
            const end_date = new Date(booking.sessionEndDate).setHours(0, 0, 0, 0);
            if (today > start_date && today < end_date) {
                if (booking.bookingStatus.status === "accepted") return "accepted normal";
                if (booking.bookingStatus.status === "pending") return "pending normal";
            } else if (today === start_date) {
                if (booking.bookingStatus.status === "accepted") return "accepted start-date";
                if (booking.bookingStatus.status === "pending") return "pending start-date";
            } else if (today === end_date) {
                if (booking.bookingStatus.status === "accepted") return "accepted end-date";
                if (booking.bookingStatus.status === "pending") return "pending end-date";
            }
        }
        return "";
    };

    const tileDisabled = ({ date }) => {
        const today = date.setHours(0, 0, 0, 0);

        for (const booking of bookings) {
            const start_date = new Date(booking.sessionStartDate).setHours(0, 0, 0, 0);
            const end_date = new Date(booking.sessionEndDate).setHours(0, 0, 0, 0);
            if (today >= start_date && today <= end_date) {
                if (booking.bookingStatus.status === "accepted" || booking.bookingStatus.status === "pending") {
                    return true;
                }
            }
        }

        return false;
    };

    const handleMonthChange = ({ activeStartDate }) => {
        const month = activeStartDate.getMonth() + 1;
        const year = activeStartDate.getFullYear();
        setCurrentMonth(month);
        setCurrentYear(year);
        console.log(`📅 Showing: ${month} ${year}`);
    };

    const handleDayChange = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0"); // month 0-11
        const day = String(d.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        setSelectedDate(date);
        handleChange({ target: { name: name, value: formattedDate } });
    };
    return (
        <div className="calendar-container" ref={calendarRef}>
            {isEditable ? <Calendar
                value={selectedDate}
                onClickDay={handleDayChange}
                tileClassName={tileClassName}
                selectRange={false}
                showNeighboringMonth={false}
                onActiveStartDateChange={handleMonthChange}
                tileDisabled={tileDisabled}
                minDate={minDate}
            /> :
                <Calendar

                    onClickDay={() => { }}
                    tileClassName={tileClassName}
                    selectRange={false}
                    showNeighboringMonth={false}
                    onActiveStartDateChange={handleMonthChange}
                    className="non-editable"
                />
            }
            <div className="calendar-legend">
                <span className="legend-item today">Today</span>
                <span className="legend-item accepted">Booked</span>
                <span className="legend-item pending">Pending</span>
                <span className="legend-item available">Available</span>
            </div>

        </div>

    )
}

export default BookingCalendar