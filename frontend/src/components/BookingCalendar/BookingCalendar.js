import React, { useState, useEffect } from 'react'

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./BookingCalendar.css";
import { getBookingDates } from '../../services/BookingService';
import { useParams } from 'react-router-dom';


const BookingCalendar = () => {
    const [currentMonth, setCurrentMonth] = useState("");
    const [currentYear, setCurrentYear] = useState("");

    const [bookings, setBookings] = useState("");
    const { portfolioId } = useParams();

    useEffect(() => {
        const loadBookingDates = async () => {
            try {
                const result = await getBookingDates(currentMonth, currentYear, portfolioId);
                setBookings(result.bookings)
            } catch (error) {
                console.error("Error getting the booking dates: ", error)

            }
        };
        loadBookingDates();
    }, [currentMonth, currentYear, portfolioId]);


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

    const handleMonthChange = ({ activeStartDate }) => {
        const month = activeStartDate.getMonth() + 1;
        const year = activeStartDate.getFullYear();
        setCurrentMonth(month);
        setCurrentYear(year);
        console.log(`📅 Showing: ${month} ${year}`);
    };
    return (
        <div className="calendar-container">

            <Calendar
                tileClassName={tileClassName}
                selectRange={false}
                showNeighboringMonth={false}
                onClickDay={() => { }}
                onActiveStartDateChange={handleMonthChange}
            />
            <div className="calendar-legend">
                <span className="legend-item today">Current</span>
                <span className="legend-item accepted">Booked</span>
                <span className="legend-item pending">Pending</span>
                <span className="legend-item available">Available</span>
            </div>

        </div>

    )
}

export default BookingCalendar