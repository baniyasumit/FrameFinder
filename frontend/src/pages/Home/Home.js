import React from 'react';
import './Home.css';
import { IoSearchCircleSharp } from "react-icons/io5";
import { BsCamera2 } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { FaStar,FaClock  } from "react-icons/fa6";
import landingImage from '../../assets/images/landing-image.jpg'; 
import StackedAvatars from '../../components/StackedAvatars/StackedAvatars';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';

const avatarUrls = [
  'https://i.pravatar.cc/40?img=1',
  'https://i.pravatar.cc/40?img=2',
  'https://i.pravatar.cc/40?img=3'
];
const Home = () => {
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
            <button className='browse-button'>
              <IoSearchCircleSharp className='search-icon' />
              <span>Find Photographers</span>
            </button>
            <p className="signup-photographer">
              Are you a photographer? <a href="/signup">Join our network</a>
            </p>
          </div>
          <div className='landing-picture'  style={{
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
                <div className='card-icon avatars'><StackedAvatars avatars={avatarUrls}/></div>
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
      <section className='home-section reasons'>
        <div className='section-content reasons'>
          <h1 className='section-heading reasons'>Why Choose Frame Finder?</h1>
          <p className='section-description reasons'>
            <span>Connect with professional photographers who understand your vision and bring your moments to life.</span>
          </p>
          <div className='reasons-container'>
            <div className='reason-card people'>
              <div className='reason-icon-container people'><IoIosPeople className='reason-icon' /></div>
              <div className='reason-title'>Verified Professionals</div>
              <span className='reason-text'>All photographers are thoroughly vetted and verified for quality and professionalism.</span>
            </div>
            <div className='reason-card rating'>
              <div className='reason-icon-container rating'><FaStar className='reason-icon'/></div>
              <div className='reason-title'>Top Rated</div>
              <span className='reason-text'>Browse through highly rated photographers with authentic reviews from real clients.</span>
            </div>
            <div className='reason-card time'>
              <div className='reason-icon-container time'><FaClock className='reason-icon'/></div>
              <div className='reason-title'>Quick Booking</div>
              <span className='reason-text'>Book your perfect photographer in minutes with our streamlined booking process.</span>
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
    <Footer/>
    </>
  );
};

export default Home;
