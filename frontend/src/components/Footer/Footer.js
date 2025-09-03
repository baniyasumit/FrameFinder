import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className='footer-content'>
        <div className='footer-grid-container'>
          <div className='footer-grid main'>
            <h1 className='footer-headings main'>Frame Finder</h1>
            <p>Connecting you with the perfect photographer for every moment.</p>
          </div>
          <div className='footer-grid'>
            <h1 className='footer-headings'>For Clients</h1>
            <div className='links-container-footer'>
              <Link className='footer-link'>Find Photographers</Link>
              <Link className='footer-link'>Browse Portfolios</Link>
              <Link className='footer-link'>Book Sessions</Link>
            </div>
          </div>
          <div className='footer-grid'>
            <h1 className='footer-headings'>For Photographers</h1>
            <div className='links-container-footer'>
              <Link className='footer-link'>Join Network</Link>
              <Link className='footer-link'>Create Profile</Link>
              <Link className='footer-link'>Get Bookings</Link>
            </div>
          </div>
          <div className='footer-grid'>
            <h1 className='footer-headings'>Support</h1>
            <div className='links-container-footer'>
              <Link className='footer-link'>Help Center</Link>
              <Link className='footer-link'>Contact Us</Link>
              <Link className='footer-link'>Privacy Policy</Link>
            </div>
          </div>
        </div>
        <hr />

        <span className='copyright'>&copy; 2025 Frame Finder. All rights reserved.</span>


      </div>
    </footer >
  );
};

export default Footer;
