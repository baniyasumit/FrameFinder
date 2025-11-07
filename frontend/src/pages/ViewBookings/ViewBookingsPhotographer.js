import React, { useEffect, useState } from 'react'
import './ViewBookings.css'
import { FaCalendar, FaClock, FaLocationArrow, FaMessage } from 'react-icons/fa6';
import { AiOutlineProfile } from 'react-icons/ai';
import { Link, useSearchParams } from 'react-router-dom';
import { getBookingsPhotographer, getTotalBookingsPhotographer } from './../../services/BookingService';

const ViewBookingsPhotographer = () => {
    const [activeTab, setActiveTab] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [params, setParams] = useState({
        pageNum: 1,
        bookingStatus: '',
    })
    const [pagination, setPagination] = useState({
        totalPages: 1,
        firstPage: 1,
        lastPage: 1,
    })

    const [bookings, setBookings] = useState();

    useEffect(() => {
        setParams((prev) => ({
            ...prev,
            pageNum: searchParams.get('pageNum') || 1,
            bookingStatus: searchParams.get('bookingStatus') || '',
        }));
    }, [searchParams])
    useEffect(() => {
        const loadTotalBookings = async () => {
            try {
                const result = await getTotalBookingsPhotographer(searchParams.toString());

                const totalPages = result.totalPages
                setPagination((prev) => ({ ...prev, totalPages: totalPages }))
                const currentPage = parseInt(params.pageNum);
                let start = Math.max(1, currentPage - 1);
                let end = Math.min(totalPages, start + 2);

                // always keep 3 pages if possible
                if (end - start < 2) {
                    start = Math.max(1, end - 2);
                }

                setPagination({
                    totalPages: totalPages,
                    firstPage: start,
                    lastPage: end,
                });
            } catch (error) {
                console.error("Load  Error: ", error)

            }
        };
        loadTotalBookings();
    }, [params.pageNum, searchParams])

    useEffect(() => {
        const loadPortfolios = async () => {
            try {

                const results = await getBookingsPhotographer(searchParams.toString());
                setBookings(results.bookings)
            } catch (error) {
                console.error("Load  Error: ", error)

            }
        };
        loadPortfolios();
    }, [searchParams]);


    const handleStatusChange = (e) => {
        const bookingStatus = e.target.value
        setActiveTab(bookingStatus)
        const updatedParams = { ...params, bookingStatus: bookingStatus };
        setParams(updatedParams);
        setSearchParams({ ...updatedParams });
    }

    const handlePagination = (e) => {
        const pageNum = parseInt(e.target.value);
        const updatedParams = { ...params, pageNum: pageNum };
        setParams(updatedParams);
        setSearchParams({ ...updatedParams });
    }

    return (
        <main className='bookings'>
            <div className='bookings-content-container'>
                <section className='bookings-content header'>
                    <h1>My Bookings</h1>
                    <span>Manage your photography sessions and view booking history</span>
                </section>
                <section className='bookings-content navigation'>
                    <nav className="bookings-nav">
                        <button
                            className={`nav-tab ${activeTab === '' ? "active" : ""}`}
                            value=''
                            onClick={handleStatusChange}
                        >
                            All Bookings
                        </button>
                        <button
                            className={`nav-tab ${activeTab === 'upcoming' ? "active" : ""}`}
                            value='upcoming'
                            onClick={handleStatusChange}
                        >
                            Upcoming
                        </button>
                        <button
                            className={`nav-tab ${activeTab === 'completed' ? "active" : ""}`}
                            value='completed'
                            onClick={handleStatusChange}
                        >
                            Completed
                        </button>
                        <button
                            className={`nav-tab ${activeTab === 'declined' ? "active" : ""}`}
                            value='declined'
                            onClick={handleStatusChange}
                        >
                            Cancelled/Declined
                        </button>

                    </nav>
                </section>
                <section className='bookings-content booking-list'>
                    {bookings?.map((booking, index) => (
                        <div className='booking-card' key={index}>
                            <div className='profile-picture-container bookings-page'>
                                <img src={booking.user.picture} alt="Profile" />
                            </div>
                            <div className='profile-information booking-page' >
                                <div className='service-price-container bookings-page'>
                                    <h1 className='service-name bookings-page'>
                                        {booking?.service.title} <span className={`booking-status ${booking.bookingStatus.status}`} >{booking.bookingStatus.status}</span>
                                    </h1>
                                    <p>${booking.totalCharge.standardCharge + (booking.totalCharge.duration * booking.totalCharge.packageCharge)}</p>
                                </div>
                                <div className='details-contact-container'>
                                    <div className='booking-details bookings-page'>
                                        <p className='full-name bookings-page'>with {booking.firstName} {booking.lastName}</p>
                                        <div className='mini-booking-details'>
                                            <div className='mini-booking-detail'>
                                                <FaCalendar />{new Date(booking.sessionStartDate).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })}
                                            </div>
                                            <div className='mini-booking-detail'>
                                                <FaClock /> {new Date(booking.sessionStartDate).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })}
                                            </div>
                                            <div className='mini-booking-detail'>
                                                <FaLocationArrow /> {booking.venueName}, {booking.city}, {booking.state}
                                            </div>

                                        </div>
                                    </div>
                                    <div className='contact-button-container bookings-page'>

                                        <Link type="button" className='booking-button bookings-page' to={`/photographer/view-booking/${booking._id}`}>
                                            <AiOutlineProfile />View Details
                                        </Link>


                                        <Link className='booking-button message bookings-page' to={`/message/${booking._id}`}>
                                            <FaMessage className='message-icon' />Message
                                        </Link>

                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </section>

                <section className='bookings-content pagination'>
                    <div className='bookings-pagination'>
                        {params.pageNum > 1 &&
                            <button
                                value={parseInt(params.pageNum) - 1}
                                onClick={handlePagination}>Previous</button>
                        }
                        {[...Array(pagination.lastPage - pagination.firstPage + 1)].map((_, i) => (
                            <button
                                key={i}
                                value={pagination.firstPage + i}
                                className={`${parseInt(params.pageNum) === (pagination.firstPage + i) ? "active-page" : ""}`}
                                onClick={handlePagination}
                            >
                                {pagination.firstPage + i}
                            </button>
                        ))}
                        {pagination.lastPage > params.pageNum &&

                            <button
                                value={parseInt(params.pageNum) + 1}
                                onClick={handlePagination}>Next</button>
                        }

                    </div>
                </section>

            </div >
        </main >
    )
}

export default ViewBookingsPhotographer