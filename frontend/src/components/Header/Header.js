import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../assets/contexts/AuthContext';
import { CiMenuFries } from "react-icons/ci";

const Header = () => {
  const headerRef = useRef(null);
  const { showLogin, setShowLogin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {

      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setMenuOpen]);

  return (
    <header className="header" ref={headerRef}>
      <section className='headercomponents'>
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
          <Link className='header-login' onClick={() => setShowLogin(true)} disabled={showLogin}>Sign In</Link>
        </div>

      </section>
    </header >
  );
};

export default Header;
