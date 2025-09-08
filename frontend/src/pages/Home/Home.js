import React from 'react';
import './Home.css';
import { IoSearchCircleSharp } from "react-icons/io5";
import { BsCamera2 } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { FaStar, FaClock } from "react-icons/fa6";
import landingImage from '../../assets/images/landing-image.jpg';
import StackedAvatars from '../../components/StackedAvatars/StackedAvatars';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { motion } from "framer-motion";

const avatarUrls = [
  'https://i.pravatar.cc/40?img=1',
  'https://i.pravatar.cc/40?img=2',
  'https://i.pravatar.cc/40?img=3'
];

const Home = () => {
  return (
    <>
      <main className="home-container">
        {/* Landing Section */}
        <section className='landing'>
          <motion.div
            className='landing-container'
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className='landing-links'
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <p className='slogan-container'>
                <span className='slogan first'>Your Story, </span>
                <span className='slogan second'> Our Frame</span>
              </p>
              <h2 className='browse-label'>Find your Photographer</h2>

              <div>
                <Link to="/browse" className='browse-button'>
                  <IoSearchCircleSharp className='search-icon' />
                  <span>Find Photographers</span>
                </Link>
              </div>

              <p className="signup-photographer">
                Are you a photographer? <a href='/register-photographer'>Join our network</a>
              </p>
            </motion.div>

            {/* Landing Picture */}
            <motion.div
              className='landing-picture'
              style={{ backgroundImage: `url(${landingImage})` }}
              initial={{ x: 500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              <div className='stat photographers'>
                <div className='card photographers-number-container'>
                  <div className='card-icon'><BsCamera2 /></div>
                  <div className='card-body'>
                    <h1 className='card-heading'>500+ Photographers</h1>
                    <h2 className='card-text'>Available in your area</h2>
                  </div>
                </div>
              </div>

              <div className='stat rating'>
                <div className='card rating-container'>
                  <div className='card-icon avatars'><StackedAvatars avatars={avatarUrls} /></div>
                  <div className='card-body'>
                    <h1 className='card-heading'>4.9/5</h1>
                    <h2 className='card-text'>Average Rating</h2>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Reasons Section */}
        <section className='home-section reasons'>
          <div className='section-content reasons'>
            <motion.h1
              className='section-heading reasons'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Why Choose Frame Finder?
            </motion.h1>

            <motion.p
              className='section-description reasons'
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <span>Connect with professional photographers who understand your vision and bring your moments to life.</span>
            </motion.p>

            <motion.div
              className='reasons-container'
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.3 }
                }
              }}
            >
              {[
                { icon: <IoIosPeople className='reason-icon' />, title: "Verified Professionals", text: "All photographers are thoroughly vetted and verified for quality and professionalism." },
                { icon: <FaStar className='reason-icon' />, title: "Top Rated", text: "Browse through highly rated photographers with authentic reviews from real clients." },
                { icon: <FaClock className='reason-icon' />, title: "Quick Booking", text: "Book your perfect photographer in minutes with our streamlined booking process." }
              ].map((reason, i) => (
                <motion.div
                  key={i}
                  className={`reason-card ${i === 0 ? 'people' : i === 1 ? 'rating' : 'time'}`}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <div className={`reason-icon-container ${i === 0 ? 'people' : i === 1 ? 'rating' : 'time'}`}>
                    {reason.icon}
                  </div>
                  <div className='reason-title'>{reason.title}</div>
                  <span className='reason-text'>{reason.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Browse Section */}
        <section className='home-section browse'>
          <motion.div
            className='section-content browse'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 4 }}
          >
            <h1 className='section-heading browse'>Ready to capture your moments?</h1>
            <p className='section-description browse'>
              <span>Join thousands of satisfied clients who found their perfect photographer through Frame Finder.</span>
            </p>
            <motion.div
              className='section-browse-button-container'
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/browse" className='section-browse-button'>Get Started Today</Link>
            </motion.div>
          </motion.div>
        </section>
      </main >
      <Footer />
    </>
  );
};

export default Home;
