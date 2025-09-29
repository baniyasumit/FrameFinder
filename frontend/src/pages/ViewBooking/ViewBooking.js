import React, { useState, useEffect } from 'react'
import './ViewBooking.css'
import { getBookingInformation } from '../../services/BookingService';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import { GoStar, GoStarFill } from 'react-icons/go';
import { FaCalendar, FaClock, FaCreditCard, FaLocationArrow, FaMessage, FaPeopleGroup } from 'react-icons/fa6';
import { IoCall, IoCheckmark } from "react-icons/io5";
import { AiOutlineProfile } from "react-icons/ai";
import { toast } from 'sonner';

const ViewBooking = () => {
    const [photographerPortfolio, setPhotographerPortfolio] = useState();
    const [booking, setBooking] = useState();
    const { bookingId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const loadBookingInformation = async () => {
            try {
                const bookingInformation = await getBookingInformation(bookingId);
                setPhotographerPortfolio(bookingInformation?.photographerPortfolio);
                setBooking(bookingInformation?.booking)
            } catch (error) {
                console.error("Load Photohrapher Portfolio Error: ", error)
                toast.error(error)
                navigate('/')
            }
        };
        loadBookingInformation();
    }, [setPhotographerPortfolio, bookingId, navigate]);

    return (
        <>
            {!photographerPortfolio && !booking ? (
                <p>Loading portfolio...</p>
            ) : (
                <main className='main booking-page'>
                    <section className='photographer-information-container booking-page'>
                        <div className='photographer-information booking-page'>
                            <div className='photographer-profile-information'>
                                <div className='profile-picture-container '>
                                    <img src={photographerPortfolio?.user.picture} alt="Profile" />
                                </div>
                                <div className='profile-information booking-page' >
                                    <div className='service-price-container booking-page'>
                                        <h1 className='service-name booking-page'>
                                            {booking?.service.title} <span className={`booking-status ${booking.bookingStatus.status}`} >{booking.bookingStatus.status}</span>
                                        </h1>
                                        <p>${booking.totalCharge.standardCharge + (booking.totalCharge.duration * booking.totalCharge.packageCharge)}</p>
                                    </div>
                                    <div className='rating-contact-container'>
                                        <div className='rating-stats booking-page'>
                                            <p className='full-name booking-page'>with {photographerPortfolio?.user.firstname} {photographerPortfolio?.user.lastname} </p>
                                            <div className='rating-stat-container'>
                                                <Rating
                                                    className='rating-stat'
                                                    initialValue={3}
                                                    size={20}
                                                    allowFraction
                                                    emptyIcon={<GoStar color="rgba(12, 12, 12, 0.5)" size={20} />}
                                                    fillIcon={<GoStarFill color="#FACC15" size={20} />}
                                                    readonly
                                                />
                                                <span>{3} (127 reviews)</span>
                                            </div>
                                        </div>
                                        <div className='contact-button-container'>
                                            {booking?.bookingStatus.status !== 'pending' && booking?.bookingStatus.status !== 'cancelled' &&
                                                <button type="button" className='booking-button'><FaMessage className='message-icon' />Send Message</button>
                                            }

                                            <Link className='booking-message' to={`/view-portfolio/${photographerPortfolio._id}`}><AiOutlineProfile />View Profile</Link>

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
                                <h2 className='container-heading summary'>Payment Status</h2>
                                <p>Payment <span className={`payment-status summary ${booking.bookingStatus.status}`} >{booking.payment.status}</span></p>
                                {booking?.payment.status === 'partial' &&
                                    <p>Paid <span>${booking.payment.paid}</span></p>
                                }
                                <p className='total-fee'>Remaining <span >${booking.payment.remaining}</span></p>


                            </div>
                            <div className='container booking-page summary'>
                                <h2 className='container-heading summary'>Payment Summary</h2>
                                <p>Standard Fee <span>${booking.totalCharge.standardCharge}</span></p>
                                <p>Package Fee <span>${booking.totalCharge.packageCharge * booking.totalCharge.duration}</span></p>
                                <p className='total-fee'>Total <span>${booking.totalCharge.standardCharge + (booking.totalCharge.duration * booking.totalCharge.packageCharge)}</span></p>
                                {booking?.bookingStatus.status !== 'pending' && booking?.bookingStatus.status !== 'cancelled' &&
                                    <button type="button" className='booking-button pay'><FaCreditCard />Pay Now</button>
                                }


                            </div>
                            <div className='container booking-page summary'>
                                <h2 className='container-heading summary contact'>Contact Photographer</h2>
                                {booking?.bookingStatus.status !== 'pending' && booking?.bookingStatus.status !== 'cancelled' && <>
                                    <button type="button" className='booking-button'><FaMessage className='message-icon' />Send Message</button>

                                    <button type="button" className='booking-message'><IoCall />Call</button>
                                </>
                                }
                                <button type="button" className='booking-message'><FaCalendar />Reschedule</button>

                            </div>
                        </div>
                    </section>
                </main >
            )}
        </>
    )
}

export default ViewBooking