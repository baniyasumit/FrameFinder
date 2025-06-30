import React, { useEffect, useRef, useState } from 'react';
import './AuthOverlay.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../assets/contexts/AuthContext';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

function RegisterOverlay() {
  const modalRef = useRef();
  const { setShowLogin, setShowRegister } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowRegister(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowRegister]);

  return (
    <div className="overlay">
      <div className="modal" ref={modalRef}>
        <button className="close-icon" onClick={() => setShowRegister(false)}>×</button>
        <div className='auth-header'>
          <img src='/title512.png' alt='title'></img>
          <h1 className='company-name'>Frame Finder</h1>
        </div>
        <span className='auth-message'>Welcome! Please register a new account.</span>
        <div className='name-container'>
          <input className='auth-inputs' type="text" placeholder="First Name" />
          <input className='auth-inputs' type="text" placeholder="Last Name" />
        </div>
        <input className='auth-inputs' type="text" placeholder="Email" />
        <input className='auth-inputs' type="text" placeholder="Phone Number" />

        <div className="auth-password-container">
          <input className="auth-inputs" type={visible ? " text" : "password"} placeholder="Password" />
          <input className="auth-inputs" type={visible ? " text" : "password"} placeholder="Confirm Password" />
          <Link onClick={() => setVisible(!visible)} className="visibility-container">
            {visible ? <FaRegEye className="auth-password-visibility" /> : <FaRegEyeSlash className="auth-password-visibility" />}
          </Link>
        </div>

        <button className="submit-btn">Register</button>
        <div className='auth-redirect-option'>
          <span>Already have an account? </span>
          <Link className='auth-redirect-link' onClick={() => { setShowLogin(true); setShowRegister(false) }} >Sign In</Link>
        </div>
      </div>

    </div>
  );
}

export default RegisterOverlay;
