import React, { useEffect, useRef, useState } from 'react';
import './AuthOverlay.css';
import { Link } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import useAuthStore from '../../stateManagement/useAuthStore';
import { registerUser } from '../../services/AuthServices'; // use this when you add service

function RegisterOverlay() {
  const modalRef = useRef();
  const { setShowLogin, setShowRegister } = useAuthStore();
  const [visible, setVisible] = useState(false);

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    try {

      const response = await registerUser(formData);
      console.log("Registration Successful:", response);
      setShowRegister(false);
    } catch (err) {
      console.error("Register error:", err);
    }
  };

  return (
    <div className="overlay">
      <form className="modal" ref={modalRef} onSubmit={handleSubmit}>
        <button type="button" className="close-icon" onClick={() => setShowRegister(false)}>×</button>
        <div className='auth-header'>
          <img src='/title512.png' alt='title' />
          <h1 className='company-name'>Frame Finder</h1>
        </div>
        <span className='auth-message'>Welcome! Please register a new account.</span>
        <div className='name-container'>
          <input
            className='auth-inputs'
            type="text"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
          />
          <input
            className='auth-inputs'
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleChange}
          />
        </div>
        <input
          className='auth-inputs'
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          className='auth-inputs'
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
        />

        <div className="auth-password-container">
          <input
            className="auth-inputs"
            type={visible ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            className="auth-inputs"
            type={visible ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="visibility-container"
          >
            {visible ? <FaRegEye className="auth-password-visibility" /> : <FaRegEyeSlash className="auth-password-visibility" />}
          </button>
        </div>

        <button type="submit" className="submit-btn">Register</button>

        <div className='auth-redirect-option'>
          <span>Already have an account? </span>
          <Link
            className='auth-redirect-link'
            onClick={() => {
              setShowLogin(true);
              setShowRegister(false);
            }}
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterOverlay;
