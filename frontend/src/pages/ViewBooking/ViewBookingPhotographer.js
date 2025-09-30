import React, { useState, useEffect } from 'react'
import './ViewBooking.css'
import { changeBookingStatus, getBookingInformationPhotographer } from '../../services/BookingService';
import { useParams } from 'react-router-dom';
import { FaCalendar, FaClock, FaLocationArrow, FaMessage, FaPeopleGroup } from 'react-icons/fa6';
import { IoCall, IoCheckmark } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { toast } from 'sonner';

const ViewBookingPhotographer = () => {
    const [booking, setBooking] = useState();
    const { bookingId } = useParams();

    useEffect(() => {
        const loadBookingInformation = async () => {
            try {
                const bookingInformation = await getBookingInformationPhotographer(bookingId);

                setBooking(bookingInformation)
            } catch (error) {
                console.error("Load Booking Error: ", error)
            }
        };
        loadBookingInformation();
    }, [bookingId]);

    const handleStatus = async (status) => {
        try {
            await changeBookingStatus(bookingId, status)
            if (status === 'accepted') { toast.success('Booking Confirmed') }
            else if (status === 'declined') { toast.success('Booking Declined') }
            else if (status === 'cancelled') { toast.success('Booking Cancelled') }

        } catch (err) {
            console.error("Status change Error", err)
        } finally {
            const bookingInformation = await getBookingInformationPhotographer(bookingId);
            setBooking(bookingInformation)
        }
    }



    return (
        <>
            {!booking ? (
                <p>Loading booking information...</p>
            ) : (
                <main className='main booking-page'>
                    <section className='photographer-information-container booking-page'>
                        <div className='photographer-information booking-page'>
                            <div className='photographer-profile-information'>
                                <div className='profile-picture-container '>
                                    <img src={booking?.user.picture} alt="Profile" />
                                </div>
                                <div className='profile-information booking-page' >
                                    <div className='service-price-container booking-page'>
                                        <h1 className='service-name booking-page'>
                                            {booking?.service.title} <span className={`booking-status ${booking.bookingStatus.status}`} >{booking.bookingStatus.status}</span>
                                        </h1>

                                    </div>
                                    <div className='rating-contact-container'>
                                        <div className='rating-stats booking-page'>
                                            <p className='full-name booking-page'>with {booking?.firstName} {booking?.lastName} </p>
                                        </div>
                                        <div className='contact-button-container'>
                                            {booking?.bookingStatus.status !== 'pending' && booking?.bookingStatus.status !== 'cancelled' &&
                                                <button type="button" className='booking-button'><FaMessage className='message-icon' />Send Message</button>

                                            }
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </section>
                    <section className='booking-details-container'>
                        <div className='booking-forms-container'>
                            <div className='container booking-page'>
                                <h2 className='container-heading'>Session Details</h2>
                                <div className='session-details-line'>
                                    <div className='session-details-container'>
                                        <FaCalendar className='session-details-icon' />
                                        <div className='session-details'>
                                            <label>Start Date</label>
                                            <p>{new Date(booking.sessionStartDate).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric"
                                            })}</p>
                                        </div>
                                    </div>
                                    <div className='session-details-container'>
                                        <FaCalendar className='session-details-icon' />
                                        <div className='session-details'>
                                            <label>End Date</label>
                                            <p>{new Date(booking.sessionEndDate).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric"
                                            })}</p>
                                        </div>
                                    </div>

                                </div>
                                <div className='session-details-line'>
                                    <div className='session-details-container'>
                                        <FaClock className='session-details-icon' />
                                        <div className='session-details'>
                                            <label>Start Time</label>
                                            <p> {new Date(booking.sessionStartDate).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}</p>
                                        </div>
                                    </div>
                                    <div className='session-details-container'>
                                        <FaLocationArrow className='session-details-icon' />
                                        <div className='session-details'>
                                            <label>Location</label>
                                            <p>{booking.venueName} </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='session-details-line'>
                                    <div className='session-details-container'>
                                        <FaPeopleGroup className='session-details-icon' />
                                        <div className='session-details'>
                                            <label>Guests</label>
                                            <p>{booking.guestNumber} people</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className='container booking-page features'>
                                <h2 className='container-heading'>Package Includes</h2>
                                {booking.service.features.map((feature, index) => (
                                    <p key={index} ><IoCheckmark className='included-icon' /> {feature}</p>
                                ))}
                            </div>

                            <div className='container booking-page special-request'>
                                <h2 className='container-heading'>Special Requests</h2>
                                <p>{booking.eventDescription}</p>
                                <p>{booking.specialRequest}</p>
                            </div>
                        </div>
                        <div className='booking-finalization'>
                            <div className='container booking-page summary'>
                                <h2 className='container-heading summary'>Booking Status</h2>
                                <p>Status <span className={`booking-status summary ${booking.bookingStatus.status}`} >{booking.bookingStatus.status}</span></p>

                                <p>Created <span>{new Date(booking.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric"
                                })}</span></p>
                            </div>
                            <div className='container booking-page summary'>
                                <h2 className='container-heading summary'>Pricing Summary</h2>
                                <p>Standard Fee <span>${booking.totalCharge.standardCharge}</span></p>
                                <p>Package Fee <span>${booking.totalCharge.packageCharge * booking.totalCharge.duration}</span></p>
                                <p className='total-fee'>Total <span>${booking.totalCharge.standardCharge + (booking.totalCharge.duration * booking.totalCharge.packageCharge)}</span></p>

                            </div>
                            {booking?.bookingStatus.status !== 'pending' && booking?.bookingStatus.status !== 'cancelled' &&
                                <>
                                    <div className='container booking-page summary'>
                                        <h2 className='container-heading summary'>Payment Status</h2>
                                        <p>Payment <span className={`payment-status summary ${booking.bookingStatus.status}`} >{booking.payment.status}</span></p>
                                        {booking?.payment.status === 'partial' &&
                                            <p>Paid <span>${booking.payment.paid}</span></p>
                                        }
                                        <p className='total-fee'>Remaining <span >${booking.payment.remaining}</span></p>


                                    </div>
                                </>
                            }
                            {booking?.bookingStatus.status !== 'pending' && booking?.bookingStatus.status !== 'cancelled' &&
                                <>
                                    <div className='container booking-page summary'>
                                        <h2 className='container-heading summary contact'>Contact Client</h2>

                                        <button type="button" className='booking-button'><FaMessage className='message-icon' />Send Message</button>
                                        <button type="button" className='booking-message' onClick={() => window.open(`tel:${booking?.phoneNumber}`, "_self")}><IoCall />Call</button>

                                    </div>
                                </>
                            }
                            {(booking?.bookingStatus.status === 'declined' || booking?.bookingStatus.status === 'cancelled') ? (<></>) : (
                                <div className='container booking-page summary'>
                                    <h2 className='container-heading summary contact'>Respond to Booking</h2>
                                    {booking?.bookingStatus.status === 'pending' &&
                                        <>
                                            <button type="button" className='booking-button accept' onClick={() => handleStatus('accepted')}><IoCheckmark className='message-icon' />Accept Booking</button>
                                            <button type="button" className='booking-button decline' onClick={() => handleStatus('declined')}><RxCross2 />Decline Booking</button>
                                        </>
                                    }
                                    {booking?.bookingStatus.status === 'accepted' &&
                                        <button type="button" className='booking-button decline' onClick={() => handleStatus('cancelled')}><RxCross2 />Cancel Booking</button>
                                    }
                                </div>)

                            }
                        </div>
                    </section>
                </main >
            )}
        </>
    )
}

export default ViewBookingPhotographer