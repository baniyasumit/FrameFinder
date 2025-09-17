import React, { useEffect, useState } from 'react'
import './CreateBooking.css'
import { Rating } from 'react-simple-star-rating';
import { GoStar, GoStarFill } from 'react-icons/go';
import { getPhotographerPortfolio } from '../../services/PortfolioServices';
import { useParams } from 'react-router-dom';
import { TiTick } from "react-icons/ti";
import { FaCalendarCheck, FaMessage } from 'react-icons/fa6';
import { createBooking, PLATFORMCHARGE } from '../../services/BookingService';
import { toast } from 'sonner';


const CreateBooking = () => {

    const { portfolioId } = useParams();
    const [photographerPortfolio, setPhotographerPortfolio] = useState();
    const [bookingData, setBookingData] = useState({
        'sessionType': '',
        'sessionStartTime': '',
        'sessionStartDate': '',
        'sessionEndDate': '',
        'venueName': '',
        'firstName': '',
        'lastName': '',
        'email': '',
        'phoneNumber': '',
        'guestNumber': '',
        'eventDescription': '',
        'specialRequest': '',
    });


    const [selectedService, setSelectedService] = useState();

    const [totalCharge, setTotalCharge] = useState({
        standardCharge: 0,
        packageCharge: 0,
        platformCharge: PLATFORMCHARGE || 0
    });

    useEffect(() => {
        const loadPortfolio = async () => {
            try {
                const portfolio = await getPhotographerPortfolio(portfolioId);
                setPhotographerPortfolio(portfolio);
                setSelectedService(portfolio.services[0])
                setBookingData((prev) => ({
                    ...prev,
                    'sessionType': portfolio.services[0]._id,
                }))
                setTotalCharge((prev) => ({
                    ...prev,
                    standardCharge: portfolio.standardCharge,
                    packageCharge: portfolio.services[0].price,
                }))
            } catch (error) {
                console.error("Load Photohrapher Portfolio Error: ", error)

            }
        };
        loadPortfolio();
    }, [setPhotographerPortfolio, portfolioId]);

    const handleChange = (e) => {
        const { name, value } = e.target
        setBookingData((prev) => ({ ...prev, [name]: value }))
    }

    const handleServiceChange = (e) => {
        const selectedId = e.target.value;
        const service = photographerPortfolio.services.find(
            (s) => s._id === selectedId
        );
        if (service) {
            setSelectedService(service);
            setBookingData((prev) => ({ ...prev, 'sessionType': selectedId }))
            setTotalCharge((prev) => ({
                ...prev,
                packageCharge: service.price
            }))
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        const finalBookingData = {
            ...bookingData,
            totalCharge
        }
        try {
            const response = await createBooking(finalBookingData, portfolioId);
            console.log(response.message);
            toast.success(response.message);

        } catch (err) {
            console.error("Save error:", err);
            toast.error(err, {
                position: 'top-center',
            });
        }


    }

    return (
        <>
            {!photographerPortfolio ? (
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
                                    <h1 className='full-name booking-page'>
                                        {photographerPortfolio?.user.firstname} {photographerPortfolio?.user.lastname}
                                    </h1>
                                    <div className='rating-stats'>
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
                                    <p className='specialization booking-page'><span>Specializes in:</span> <strong>{photographerPortfolio.specialization} Photography</strong> </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className='booking-details-container'>
                        <div className='booking-forms-container'>
                            <div className='container booking-page'>
                                <h2 className='container-heading'>Session Details</h2>
                                <div className='booking-input-line'>
                                    <div className='booking-input-container'>
                                        <label className='browse-input-label'>
                                            Session Type
                                        </label>
                                        <select name='sessionType' className='input-field' type='dropdown' onChange={handleServiceChange} >

                                            {photographerPortfolio.services.map((service, index) =>
                                                <option value={service._id} key={index}>{service.title}</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className='booking-input-container'>
                                        <label className='browse-input-label' >
                                            Start Time
                                        </label>
                                        <input name='sessionStartTime' className='input-field' type='time' value={bookingData.sessionStartTime} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className='booking-input-line'>
                                    <div className='booking-input-container'>
                                        <label className='browse-input-label'>
                                            Start Date
                                        </label>
                                        <input name='sessionStartDate' className='input-field' type='date'
                                            min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                                            value={bookingData.sessionStartDate} onChange={handleChange} />
                                    </div>
                                    <div className='booking-input-container'>
                                        <label className='browse-input-label' >
                                            End Date
                                        </label>
                                        <input name='sessionEndDate' className='input-field' type='date'
                                            min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                                            value={bookingData.sessionEndDate} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className='container booking-page'>
                                <h2 className='container-heading'>Location Details</h2>
                                <div className='booking-input-line'>
                                    <div className='booking-input-container'>
                                        <label className='browse-input-label' >
                                            Venue Name(if any)
                                        </label>
                                        <input name='venueName' className='input-field'
                                            placeholder='Enter Venue name or precise address'
                                            value={bookingData.venueName}
                                            onChange={handleChange} />
                                    </div>
                                </div>

                                <div className='booking-input-line'>
                                    <div className='booking-input-container'>
                                        <label className='browse-input-label'>
                                            City
                                        </label>
                                        <input name='venueCity' className='input-field' placeholder='City' />
                                    </div>
                                    <div className='booking-input-container'>
                                        <label className='browse-input-label'>
                                            State/Province
                                        </label>
                                        <input name='venueProvince' className='input-field' placeholder='State/Province' />
                                    </div>
                                </div>
                            </div>
                            <div className='container booking-page'>
                                <h2 className='container-heading'>Contact Information</h2>
                                <div className='booking-input-line'>
                                    <div className='booking-input-container'>
                                        <label className='browse-input-label' >
                                            First Name
                                        </label>
                                        <input name='firstName' className='input-field' placeholder='First Name'
                                            value={bookingData.firstName}
                                            onChange={handleChange} />
                                    </div>
                                    <div className='booking-input-container'>
                                        <label className='browse-input-label' >
                                            Last Name
                                        </label>
                                        <input name='lastName' className='input-field' placeholder='Last Name'
                                            value={bookingData.lastName}
                                            onChange={handleChange} />
                                    </div>
                                </div>

                                <div className='booking-input-line'>
                                    <div className='booking-input-container'>
                                        <label className='browse-input-label'>
                                            Email
                                        </label>
                                        <input name='email' className='input-field' placeholder='Email'
                                            value={bookingData.email}
                                            onChange={handleChange} />

                                    </div>
                                    <div className='booking-input-container'>
                                        <label className='browse-input-label' >
                                            Phone
                                        </label>
                                        <input name='phoneNumber' className='input-field' placeholder='Phone Number'
                                            value={bookingData.phoneNumber}
                                            onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className='container booking-page'>
                                <h2 className='container-heading'>Special Requests & Description (Optional)</h2>
                                <div className='booking-input-line'>
                                    <div className='booking-input-container'>
                                        <label className='browse-input-label' >
                                            Number of Guests/People
                                        </label>
                                        <input name='guestNumber' className='input-field' placeholder='eg., 150' type='number'
                                            value={bookingData.guestNumber}
                                            onChange={handleChange} />
                                    </div>
                                </div>

                                <div className='booking-input-line'>
                                    <div className='booking-input-container'>
                                        <label className='browse-input-label' >
                                            Event Description
                                        </label>
                                        <textarea name='eventDescription' className='input-field'
                                            placeholder='Tell us about your event, special moments you want captured, style preference, etc'
                                            value={bookingData.eventDescription}
                                            onChange={handleChange} />
                                    </div>
                                </div>
                                <div className='booking-input-line'>
                                    <div className='booking-input-container'>
                                        <label className='browse-input-label' >
                                            Special Request
                                        </label>
                                        <textarea name='specialRequest' className='input-field'
                                            placeholder='Any specific shots, locations, or requirements you would like to mention'
                                            value={bookingData.specialRequest}
                                            onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='booking-finalization'>
                            <div className='container booking-page summary'>
                                <h2 className='container-heading summary'>Booking Summary</h2>
                                <p>Session Type <span>{selectedService?.title}</span></p>
                                <p>Standard Fee <span>${photographerPortfolio.standardCharge}</span></p>
                                <p>Package Fee <span>${selectedService?.price}</span></p>
                                <p>Platform Fee <span>{PLATFORMCHARGE}</span></p>
                                <p className='total-fee'>Total <span>${photographerPortfolio.standardCharge + selectedService?.price + 100}</span></p>
                            </div>
                            <div className='container booking-page summary included'>
                                <h2 className='container-heading summary'>What's Included</h2>
                                <p><TiTick className='included-icon' /> Professional photography</p>
                                <p><TiTick className='included-icon' />High-resolution images</p>
                                <p><TiTick className='included-icon' />Online gallery</p>
                                <p><TiTick className='included-icon' />Basic editing included</p>
                                <p><TiTick className='included-icon' />48-hour preview</p>
                            </div>
                            <button type="button" className='booking-button' onClick={handleBooking}><FaCalendarCheck />Book Now</button>
                            <button type="button" className='booking-message'><FaMessage className='message-icon' />Send Message</button>
                            <p>You won't be charged until the photographer accepts your booking</p>
                        </div>
                    </section>
                </main >
            )}
        </>
    )
}

export default CreateBooking;