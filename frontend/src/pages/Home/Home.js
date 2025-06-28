import React from 'react';
import './Home.css';
import { IoSearchCircleSharp } from "react-icons/io5";
import { BsCamera2 } from "react-icons/bs";
import landingImage from '../../assets/images/landing-image.jpg'; 
import StackedAvatars from '../../components/StackedAvatars/StackedAvatars';

const avatarUrls = [
  'https://i.pravatar.cc/40?img=1',
  'https://i.pravatar.cc/40?img=2',
  'https://i.pravatar.cc/40?img=3'
];
const Home = () => {
  return (
    <main
      className="home-container"
    >
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
    </main>
  );
};

export default Home;
