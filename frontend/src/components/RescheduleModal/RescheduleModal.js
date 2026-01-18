import React, { useEffect, useRef, useState } from 'react'
import './RescheduleModal.css'
import BookingCalendar from '../BookingCalendar/BookingCalendar';
import { updateBookingSchedule } from '../../services/BookingService';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const RescheduleModal = ({ booking, setShowRescheduleModal, setBooking }) => {
    const modalRef = useRef();

    const { bookingId } = useParams();
    const [scheduleData, setScheduleData] = useState({
        sessionStartTime: '',
        sessionStartDate: '',
        sessionEndDate: '',
    });

    const [showStartCalendar, setShowStartCalendar] = useState(false);
    const [showEndCalendar, setShowEndCalendar] = useState(false);

    const [errors, setErrors] = useState({
        sessionStartDate: '',
        sessionEndDate: '',
        sessionStartTime: '',
    });



    useEffect(() => {
        if (!booking) return;

        const start = new Date(booking.sessionStartDate);
        const end = new Date(booking.sessionEndDate);

        setScheduleData({
            sessionStartDate: start.toISOString().split('T')[0],
            sessionStartTime: start.toTimeString().slice(0, 5),
            sessionEndDate: end.toISOString().split('T')[0],
        });
    }, [booking]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setScheduleData(prev => ({ ...prev, [name]: value }));
    };

    const validateBookingFields = () => {
        const newErrors = {};

        // Required fields
        if (!scheduleData.sessionStartTime) newErrors.sessionStartTime = "Start time is required";

        if (!scheduleData.sessionStartDate) newErrors.sessionStartDate = "Start date is required";

        if (!scheduleData.sessionEndDate) newErrors.sessionEndDate = "End date is required";

        // Date validation
        if (scheduleData.sessionStartDate && scheduleData.sessionEndDate) {
            const start = new Date(scheduleData.sessionStartDate);
            const end = new Date(scheduleData.sessionEndDate);
            if (end < start) {
                newErrors.sessionEndDate = "End date cannot be before start date";
            }
        }


        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateBookingFields()) return;
        try {
            console.log(bookingId)
            const response = await updateBookingSchedule(bookingId, scheduleData);
            console.log(response)
            setBooking(response.booking)
        } catch (err) {
            console.error("Save error:", err);
            toast.error("An error occurred while saving.");
        } finally {
            setShowRescheduleModal(false);
        }

    };

    return (
        <div className="reschedule-overlay">
            <form className="reschedule-modal" ref={modalRef} onSubmit={handleSubmit}>
                <button
                    type="button"
                    className="close-icon"
                    onClick={() => setShowRescheduleModal(false)}
                >
                    ×
                </button>

                <h2 className="reschedule-title">Reschedule Session</h2>
                <div className="reschedule-input-container">
                    <label>Start Time</label>
                    <input
                        type="time"
                        name="sessionStartTime"
                        className="input-field"
                        value={scheduleData.sessionStartTime}
                        onChange={handleChange}
                        required
                    />
                    {errors.sessionStartTime && <p className="error">{errors.sessionStartTime}</p>}
                </div>

                <div className="reschedule-input-container">
                    <label className="browse-input-label">Start Date</label>
                    <input
                        name="sessionStartDate"
                        className="input-field"
                        type="date"
                        value={scheduleData.sessionStartDate}
                        onClick={() => {
                            setShowStartCalendar(!showStartCalendar);
                            setShowEndCalendar(false);
                        }}
                        readOnly
                    />

                    {errors.sessionStartDate && (
                        <p className="error">{errors.sessionStartDate}</p>
                    )}

                    {showStartCalendar && (
                        <div className="reschedule-calendar-popup">
                            <BookingCalendar
                                isEditable={true}
                                name="sessionStartDate"
                                handleChange={handleChange}
                                minDate={new Date(Date.now() + 86400000)} // tomorrow
                                setShowCalendar={setShowStartCalendar}
                                portfolio={booking?.portfolio}
                            />
                        </div>
                    )}
                </div>


                <div className='booking-input-container'>
                    <label className='browse-input-label' >
                        End Date
                    </label>
                    <input name='sessionEndDate' className='input-field' type='date'
                        value={scheduleData.sessionEndDate} onClick={() => setShowEndCalendar(!showEndCalendar)} readOnly />
                    {errors.sessionEndDate && <p className="error">{errors.sessionEndDate}</p>}

                    {showEndCalendar && (
                        <div className="reschedule-calendar-popup">
                            <BookingCalendar
                                isEditable={true}
                                handleChange={handleChange}
                                name={'sessionEndDate'}
                                minDate={scheduleData.sessionStartDate ? new Date(scheduleData.sessionStartDate) : new Date(Date.now() + 86400000)}
                                setShowCalendar={setShowEndCalendar}
                                portfolio={booking?.portfolio}
                            />
                        </div>
                    )}
                </div>

                <button type="submit" className="reschedule-submit">
                    Confirm Reschedule
                </button>
            </form>
        </div>
    );
};

export default RescheduleModal;
