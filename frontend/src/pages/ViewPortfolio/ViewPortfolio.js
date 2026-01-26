import React, { useEffect, useRef, useState } from 'react'
import './ViewPortfolio.css'

import { GoStar, GoStarFill } from "react-icons/go";
import { Rating } from "react-simple-star-rating";
import { getPhotographerPortfolio } from '../../services/PortfolioServices';
import { useNavigate, useParams } from 'react-router-dom';
import PortfolioGallery from '../../components/PortfolioGallery/PortfolioGallery';
import usePortfolioStore from '../../stateManagement/usePortfolioStore';
import ReviewsSlider from '../../components/ReviewsSlider/ReviewsSlider';
import BookingCalendar from '../../components/BookingCalendar/BookingCalendar';
import useAuthStore from './../../stateManagement/useAuthStore';
import { addProfileView, getViewerId } from '../../services/ProfilewViewServices';
import profileImage from '../../assets/images/defaultProfile.jpg';

const ViewPortfolio = () => {
    const { user } = useAuthStore();

    const [rating, setRating] = useState(3.5);

    const [activeTab, setActiveTab] = useState("portfolio");
    const portfolioRef = useRef(null);

    const [photographerPortfolio, setPhotographerPortfolio] = useState();
    const { portfolioId } = useParams();

    const [showGalleryOverlay, setShowGalleryOverlay] = useState(false);
    const [galleryImages, setGalleryImages] = useState([])
    const [hasMore, setHasMore] = useState(true);

    const { setFullImages, setPreviewIndex } = usePortfolioStore();
    const navigate = useNavigate();

    const scrollToSection = (id) => {
        setActiveTab(id);
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    }

    useEffect(() => {
        if (!portfolioId) return;

        const sendProfileView = async () => {
            const viewerId = getViewerId(user);
            const isAnonymous = !user;

            try {
                const response = await addProfileView({ viewerId, portfolioId, isAnonymous });
                console.log("Profile view response:", response);

            } catch (err) {
                console.error("Error sending profile view:", err);
            }
        };

        sendProfileView();
    }, [portfolioId, user]);



    useEffect(() => {
        const handleScroll = () => {
            if (!portfolioRef.current) return;

            const rect = portfolioRef.current.getBoundingClientRect();
            if (rect.top <= 0.02 && rect.bottom >= 0.01) {
                setActiveTab('portfolio')
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    useEffect(() => {
        const loadPortfolio = async () => {
            try {
                const portfolio = await getPhotographerPortfolio(portfolioId);
                setPhotographerPortfolio(portfolio);
                setGalleryImages(portfolio.pictures);
                setFullImages(portfolio.pictures);
                setRating(portfolio.ratingStats.averageRating)
            } catch (error) {
                console.error("Load Photohrapher Portfolio Error: ", error)

            }
        };
        loadPortfolio();
    }, [setPhotographerPortfolio, portfolioId, setFullImages]);

    const handelBooking = async () => {
        navigate(`/create-booking/${portfolioId}`)
    }

    return (
        <>
            {!photographerPortfolio ? (
                <section className="main">
                    <div className="container">
                        <p>Loading portfolio…</p>
                    </div>
                </section>
            ) : (
                <>
                    {showGalleryOverlay &&
                        < PortfolioGallery
                            showGalleryOverlay={showGalleryOverlay}
                            setShowGalleryOverlay={setShowGalleryOverlay}
                            galleryImages={galleryImages}
                            setGalleryImages={setGalleryImages}
                            hasMore={hasMore}
                            setHasMore={setHasMore}
                            portfolioId={portfolioId}
                            isViewer={true}
                        />}
                    <section className='main basic-information-background'>
                        <div className='container basic-information-content'>
                            <div className='photographer-information'>
                                <div className='photographer-profile-information'>
                                    <div className='profile-picture-container'>
                                        <img
                                            src={photographerPortfolio?.user?.picture || profileImage}
                                            alt="Profile"
                                        />

                                    </div>
                                    <div className='profile-information' >
                                        <h1 className='full-name'>
                                            {photographerPortfolio?.user.firstname} {photographerPortfolio?.user.lastname}
                                        </h1>
                                        <div className='rating-stats'>
                                            <Rating
                                                className='rating-stat'
                                                initialValue={rating}
                                                size={20}
                                                allowFraction
                                                emptyIcon={<GoStar color="rgba(255,255,255,0.5)" size={20} />}
                                                fillIcon={<GoStarFill color="#FACC15" size={20} />}
                                                readonly
                                            />
                                            <span>{rating} ({photographerPortfolio.ratingStats.totalReviews} reviews)</span>
                                        </div>
                                        <p className='specialization'><span>Specializes in:</span> <strong>{photographerPortfolio.specialization} Photography</strong> </p>
                                    </div>
                                </div>
                                <p className='photographer-message'>
                                    {photographerPortfolio?.bio}
                                </p>

                                <div className='photographer-stats-container'>
                                    <div className='photographer-stat'>
                                        <span>{photographerPortfolio?.happyClients}</span>
                                        <label>Happy Clients</label>
                                    </div>
                                    <div className='photographer-stat'>
                                        <span>{photographerPortfolio?.experienceYears}+</span>
                                        <label>Years Experience</label>
                                    </div>
                                    <div className='photographer-stat'>
                                        <span>{photographerPortfolio?.photosTaken}+</span>
                                        <label>Photos Taken</label>
                                    </div>
                                </div>
                            </div>
                            <form className='booking-form'>
                                <BookingCalendar />
                                <button type="button" className='booking-button' onClick={handelBooking}>Book Now</button>
                                {/*  <button className='booking-message'><FaMessage className='message-icon' />Send Message</button> */}
                            </form>

                        </div>
                    </section>
                    <section className='main portfolio-navigation-container'>
                        <nav className="container photographer-nav">
                            <button
                                className={`nav-tab ${activeTab === 'portfolio' ? "active" : ""}`}
                                onClick={() => scrollToSection('portfolio')}
                            >
                                Portfolio
                            </button>
                            <button
                                className={`nav-tab ${activeTab === 'about' ? "active" : ""}`}
                                onClick={() => scrollToSection('about')}
                            >
                                About
                            </button>
                            <button
                                className={`nav-tab ${activeTab === 'packages' ? "active" : ""}`}
                                onClick={() => scrollToSection('about')}
                            >
                                Packages
                            </button>
                            <button
                                className={`nav-tab ${activeTab === 'reviews' ? "active" : ""}`}
                                onClick={() => scrollToSection('reviews')}
                            >
                                Reviews
                            </button>

                        </nav>
                    </section>

                    <section id='portfolio' className='main view-portfolio-gallery-section'>
                        <div className='container view-portfolio-gallery'>
                            <div>
                                <h2 ref={portfolioRef} className='view-portfolio-heading'>Portfolio</h2>
                            </div>
                            {galleryImages?.length > 0 ? (
                                <div className="view-portfolio-images-gallery">
                                    {galleryImages.slice(0, 6).map((picture, index) => (
                                        <div
                                            key={picture.url}
                                            className="view-portfolio-gallery-image-container"
                                            onClick={() => {
                                                setFullImages([...galleryImages]);
                                                setPreviewIndex(index);
                                                navigate('/view-full-picture');
                                            }}
                                        >
                                            <img src={picture.url} className='view-portfolio-gallery-image' alt="gallery" />
                                        </div>
                                    ))}
                                    <button
                                        className="view-portfolio-gallery-add-image"
                                        onClick={() => setShowGalleryOverlay(true)}
                                    >
                                        View All
                                    </button>
                                </div>
                            ) : (
                                <p className="empty-section">No portfolio images uploaded yet.</p>
                            )}

                        </div>
                    </section>
                    <section id='about' className='main view-portfolio-about'>
                        <div className='container about'>
                            <div>
                                <h2 className='view-portfolio-heading about'>About {photographerPortfolio.user.firstname}</h2>
                                <p className='photographer-description'>{photographerPortfolio.about}</p>
                                {photographerPortfolio.skills?.length > 0 && (
                                    <>
                                        <h2 className="view-portfolio-heading">Skills & Expertise</h2>
                                        <ul className="skills-container">
                                            {photographerPortfolio.skills.map((skill, i) => (
                                                <li key={i}>{skill}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}

                                {photographerPortfolio.equipments?.length > 0 && (
                                    <>
                                        <h2 className="view-portfolio-heading">Equipments</h2>
                                        <ul className="equipments-container">
                                            {photographerPortfolio.equipments.map((eq, i) => (
                                                <li key={i}>{eq}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}


                            </div>
                            <div>
                                <div className='view-portfolio-packages'>
                                    <h2 className='view-portfolio-heading'>Packages</h2>
                                    {photographerPortfolio.services?.length > 0 ? (
                                        <>
                                            {
                                                photographerPortfolio.services.map((service, index) =>
                                                    <div className='package-container' key={index}>
                                                        <div className='package-header-section'>
                                                            <h3 className='package-heading'>{service.title}</h3>
                                                            <p className='service-price' >¥<span>{service.price}</span> </p>
                                                        </div>
                                                        <p>{service.description}</p>
                                                        <p className='view-portfolio-label '>Includes:</p>
                                                        <ul className='services-label'>
                                                            {service.features?.map((feature, index) => (
                                                                <li key={index}>{feature}</li>
                                                            ))}
                                                        </ul>
                                                    </div>)
                                            }
                                        </>
                                    ) : (
                                        <p className="empty-section">No packages available at the moment.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                    <section id='reviews' className='main view-portfolio-reviews'>
                        <div className='container reviews'>
                            <h2 className='view-portfolio-heading reviews'>Client Reviews</h2>
                            {photographerPortfolio.reviews?.length > 0 ? (
                                <ReviewsSlider reviews={photographerPortfolio.reviews} />
                            ) : (
                                <p className="empty-section">No client reviews yet.</p>
                            )}
                        </div>
                    </section>
                </>
            )
            }
        </>
    )
}

export default ViewPortfolio