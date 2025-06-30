import React,{useState} from 'react';
import './Header.css';
import { Link, NavLink } from 'react-router-dom';
import LoginOverlay from './../AuthOverlay/LoginOverlay';

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <header className="header">
        <section className='headercomponents'>
        <Link to="/" className="logo">
            <h1>Frame Finder</h1>
        </Link>
        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Home</NavLink>
          <NavLink to="/browse" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Browse</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"} >Contact</NavLink>
        </nav>
        <div>
            <button className='header-login' onClick={() => setShowLogin(true)} disabled={ showLogin}>Sign In</button>
          </div>
          </section>
        </header>
        {showLogin && <LoginOverlay onClose={() => setShowLogin(false)} />}
      </>
  );
};

export default Header;
