import React, { useEffect, useRef } from 'react';
import './AuthOverlay.css';
import { Link } from 'react-router-dom';

function LoginOverlay({ onClose }) {
  const modalRef = useRef();

  useEffect(() => {
    document.body.style.overflow = 'hidden'; 
  
    return () => {
      document.body.style.overflow = 'auto'; 
    };
  }, []);
    
 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="overlay">
        <div className="modal" ref={modalRef}>
          <button className="close-icon" onClick={onClose}>×</button>
            <div className='auth-header'>
                <img src='/title512.png' alt='title'></img>
                <h1 className='company-name'>Frame Finder</h1>
            </div>
          <span className='auth-message'>Welcome! Please log in to your account.</span>
          <input className='auth-inputs' type="text" placeholder="Email or Username" />
          <input className='auth-inputs' type="password" placeholder="Password" />
          <div className='auth-options'>
              {/* <div className='remember-me-container'>
                  <input type='checkbox' id='remember-checkbox' value="checkbox" ></input>   
                  <label className='remember-me-label' htmlFor="remember-checkbox">Remember me</label>
                </div> */}
            <Link className='forget-password-button'>Forget password?</Link>
          </div>
            
        <button className="submit-btn">Login</button>
        <div className='auth-redirect-option'>
          <span>Don't have an account? </span>
          <Link>Create one</Link>
        </div>
      </div>
      
    </div>
  );
}

export default LoginOverlay;
