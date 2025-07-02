import React, { useEffect, useRef, useState } from "react";
import "./AuthOverlay.css";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import useAuthStore from "../../stateManagement/useAuthStore";
import { loginUser, refreshUser } from "../../services/AuthServices";
import { toast } from "sonner";

function LoginOverlay() {
  const navigate = useNavigate();
  const modalRef = useRef();
  const { setShowLogin, setShowRegister, setUser, setLoginOverlayClosed } = useAuthStore();
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

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
        setLoginOverlayClosed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowLogin, setLoginOverlayClosed]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      console.log("Login success:", response);
      const userData = await refreshUser();
      if (userData.userRole === 'photographer') {
        navigate('/dashboard')
      }
      setUser(userData);
      setShowLogin(false);
      toast.success('Logged in successfully');
    } catch (err) {
      console.error("Login error:", err);
      // show user-friendly error message
    }
  };

  return (
    <div className="overlay">
      <form className="modal" ref={modalRef} onSubmit={handleSubmit}>
        <button type="button" className="close-icon" onClick={() => { setShowLogin(false); setLoginOverlayClosed(true); }}>
          ×
        </button>
        <div className="auth-header">
          <img src="/title512.png" alt="title"></img>
          <h1 className="company-name">Frame Finder</h1>
        </div>
        <span className="auth-message">
          Welcome! Please log in to your account.
        </span>
        <input className="auth-inputs" type="text"
          placeholder="Email" name="email"
          value={formData.email}
          onChange={handleChange} />
        <div className="auth-password-container">
          <input className="auth-inputs"
            type={visible ? " text" : "password"}
            placeholder="Password" name="password"
            value={formData.password}
            onChange={handleChange} />
          <button type="button" onClick={() => setVisible(!visible)} className="visibility-container">
            {visible ? <FaRegEye className="auth-password-visibility" /> : <FaRegEyeSlash className="auth-password-visibility" />}
          </button>
        </div>
        <div className="auth-options">
          {/* <div className='remember-me-container'>
                  <input type='checkbox' id='remember-checkbox' value="checkbox" ></input>   
                  <label className='remember-me-label' htmlFor="remember-checkbox">Remember me</label>
                </div> */}
          <Link className="forget-password-button">Forget password?</Link>
        </div>

        <button type="submit" className="submit-btn">Login</button>
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
      </form>
    </div >
  );
}

export default LoginOverlay;
