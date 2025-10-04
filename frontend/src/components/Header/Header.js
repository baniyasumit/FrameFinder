import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CiMenuFries } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import useAuthStore from '../../stateManagement/useAuthStore';
import { toast } from 'sonner';
import redirection from "../../assets/images/photographerRedirect.png";

const Header = () => {
  const headerRef = useRef(null);
  const profileNavRef = useRef(null);
  const { isAuthenticated, user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {

      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (profileNavRef.current && !profileNavRef.current.contains(e.target)) {
        setProfileMenuOpen(false)
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setMenuOpen]);


  const handleLogout = async () => {
    try {
      const response = await logout();
      toast.success(response)
      navigate('/', { replace: true })

    }
    catch (error) {

    }


  }
  return (
    <header className="header" ref={headerRef}>
      <section className='header-components'>
        <Link to="/" className="logo">
          <h1>Frame Finder</h1>
        </Link>
        <nav className={`nav ${menuOpen ? "show" : ""}`} >
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Home</NavLink>
          <NavLink to="/browse" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Browse</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"} >Contact</NavLink>
        </nav>
        <div className='nav-menu-container'>
          <Link className={`nav-menu ${menuOpen ? "rotated" : ""}`} onClick={() => setMenuOpen(!menuOpen)}><CiMenuFries /></Link>
          {!isAuthenticated ?
            <Link className='header-login' to="/login" disabled={isAuthenticated}>
              Sign In
            </Link> :
            <div className='photographer-link-container'>
              {user?.role === 'photographer' && (
                <Link to="/dashboard" className='photographer-link'>
                  <img className='redirect-image' src={redirection} alt="Redirect to Client" />
                </Link>
              )}
              <div className='nav-user-avatar-container' ref={profileNavRef}>
                <div className='nav-user-avatar' onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
                  {user.picture ? (
                    <img className='user-avatar' src={user.picture} alt="User" />
                  ) : (
                    <CgProfile className='user-avatar' />
                  )}
                </div>

                {profileMenuOpen && (
                  <div className='profile-dropdown' >
                    <Link className='view-profile-navigate' to="/profile">View Profile</Link>
                    <Link className='view-profile-navigate' to="/bookings">View Bookings</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </div>
          }
        </div>

      </section>
    </header >
  );
};

export default Header;
