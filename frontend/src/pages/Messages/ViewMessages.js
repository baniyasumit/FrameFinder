import React, { useEffect, useState } from 'react'
import './ViewMessages.css'
import { FaMessage } from 'react-icons/fa6';
import { AiOutlineProfile } from 'react-icons/ai';
import { Link, useSearchParams } from 'react-router-dom';

const ViewMessages = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [params, setParams] = useState({
        pageNum: 1,
    })
    const [pagination, setPagination] = useState({
        totalPages: 1,
        firstPage: 1,
        lastPage: 1,
    })

    const [messages, setMessages] = useState();



    useEffect(() => {
        setParams((prev) => ({
            ...prev,
            pageNum: searchParams.get('pageNum') || 1,
        }));
    }, [searchParams])
    /* useEffect(() => {
        const loadTotalMessages = async () => {
            try {
                const result = await getTotalMessages(searchParams.toString());
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
        loadTotalMessages();
    }, [params.pageNum, searchParams])

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const results = await getMessages(searchParams.toString());
                setMessages(results.messages)
            } catch (error) {
                console.error("Load  Error: ", error)

            }
        };
        loadMessages();
    }, [searchParams]);
 */


    const handlePagination = (e) => {
        const pageNum = parseInt(e.target.value);
        const updatedParams = { ...params, pageNum: pageNum };
        setParams(updatedParams);
        setSearchParams({ ...updatedParams });
    }

    return (
        <main className='messages'>
            <div className='messages-content-container'>
                <section className='messages-content header'>
                    <h1>My Messages</h1>
                    <span>View your messages.</span>
                </section>

                <section className='messages-content messages-list'>
                    {/* {messages?.map((message, index) => (
                        <div className='message-card' key={index}>
                            <div className='profile-picture-container '>
                                <img src={message.sender.picture} alt="Profile" />
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
                                        <p className='full-name bookings-page'>with {booking.portfolio.user.firstname} {booking.portfolio.user.lastname}</p>
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

                                        <Link type="button" className='booking-button bookings-page' to={`/view-booking/${booking._id}`}>
                                            <AiOutlineProfile />View Details
                                        </Link>


                                        <button className='booking-button message bookings-page'>
                                            <FaMessage className='message-icon' />Message
                                        </button>

                                    </div>
                                </div>

                            </div>
                        </div>
                    ))} */}
                    <div className='message-card' >
                        <div className='profile-picture-container '>
                            <img src='https://res.cloudinary.com/dcplldqtr/image/upload/v1759996125/h9ypyt8vm0eezusm0sh0.jpg' alt="Profile" />
                        </div>
                        <div className='profile-information messages-page' >
                            <h1 className='full-name messages-page'>
                                Amit Baniya
                            </h1>
                            <div className='details-contact-container'>
                                <div className='message-details messages-page'>
                                    <p className='text-message message-page'>Hello</p>
                                </div>
                                <div className='contact-button-container messages-page'>

                                    <Link type="button" className='booking-button messages-page'>
                                        <AiOutlineProfile />View Details
                                    </Link>

                                    <button className='booking-button message messages-page'>
                                        <FaMessage className='message-icon' />Message
                                    </button>

                                </div>
                            </div>

                        </div>
                    </div>
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

export default ViewMessages