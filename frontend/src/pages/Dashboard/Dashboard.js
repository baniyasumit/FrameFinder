import React from 'react';
import { IoSearchCircleSharp } from "react-icons/io5";
import { BsCamera2 } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { FaStar, FaClock } from "react-icons/fa6";
import landingImage from '../../assets/images/landing-image.jpg';
import StackedAvatars from '../../components/StackedAvatars/StackedAvatars';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';

const avatarUrls = [
    'https://i.pravatar.cc/40?img=1',
    'https://i.pravatar.cc/40?img=2',
    'https://i.pravatar.cc/40?img=3'
];
const Dashboard = () => {
    return (
        <>
            <main className="home-container">
                <section className='landing'>
                    <div className='landing-container'>
                        <div className='landing-links'>
                            <p className='slogan-container'>
                                <span className='slogan first'>Your Story, </span>
                                <span className='slogan second'> Our Frame</span>
                            </p>
                            <h2 className='browse-label'>Find your Photographer</h2>

                            <Link to="/browse" className='browse-button'>
                                <IoSearchCircleSharp className='search-icon' />
                                <span>Find Photographers</span>
                            </Link>

                            <p className="signup-photographer">
                                Are you a photographer? <a href="/signup">Join our network</a>
                            </p>
                        </div>
                        <div className='landing-picture' style={{
                            backgroundImage: `url(${landingImage})`,
                        }}>
                            <div className='stat photographers'>
                                <div className='card photographers-number-container'>
                                    <div className='card-icon'><BsCamera2 /></div>
                                    <div className='card-body'>
                                        <h1 className='card-heading'>
                                            500+ Photographers
                                        </h1>
                                        <h2 className='card-text'>
                                            Available in your area
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <div className='stat rating'>
                                <div className='card rating-container'>
                                    <div className='card-icon avatars'><StackedAvatars avatars={avatarUrls} /></div>
                                    <div className='card-body'>
                                        <h1 className='card-heading'>
                                            4.9/5
                                        </h1>
                                        <h2 className='card-text'>
                                            Average Rating
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='home-section browse'>
                    <div className='section-content browse'>
                        <h1 className='section-heading browse'>Ready to capture your moments?</h1>
                        <p className='section-description browse'>
                            <span>Join thousands of satisfied clients who found their perfect photographer through Frame Finder.</span>
                        </p>
                        <div className='section-browse-button-container'>
                            <Link href="/browse" className='section-browse-button'>Get Started Today</Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Dashboard;
