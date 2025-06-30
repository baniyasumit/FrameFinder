import React, { useEffect, useRef, useState } from "react";
import "./AuthOverlay.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../assets/contexts/AuthContext";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

function LoginOverlay({ onClose }) {
  const modalRef = useRef();
  const { setShowLogin, setShowRegister } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowLogin(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowLogin]);

  return (
    <div className="overlay">
      <div className="modal" ref={modalRef}>
        <button className="close-icon" onClick={() => setShowLogin(false)}>
          ×
        </button>
        <div className="auth-header">
          <img src="/title512.png" alt="title"></img>
          <h1 className="company-name">Frame Finder</h1>
        </div>
        <span className="auth-message">
          Welcome! Please log in to your account.
        </span>
        <input className="auth-inputs" type="text" placeholder="Email" />
        <div className="auth-password-container">
          <input className="auth-inputs" type={visible ? " text" : "password"} placeholder="Password" />
          <Link onClick={() => setVisible(!visible)} className="visibility-container">
            {visible ? <FaRegEye className="auth-password-visibility" /> : <FaRegEyeSlash className="auth-password-visibility" />}
          </Link>
        </div>
        <div className="auth-options">
          {/* <div className='remember-me-container'>
                  <input type='checkbox' id='remember-checkbox' value="checkbox" ></input>   
                  <label className='remember-me-label' htmlFor="remember-checkbox">Remember me</label>
                </div> */}
          <Link className="forget-password-button">Forget password?</Link>
        </div>

        <button className="submit-btn">Login</button>
        <div className="auth-redirect-option">
          <span>Don't have an account? </span>
          <Link
            className="auth-redirect-link"
            onClick={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginOverlay;
