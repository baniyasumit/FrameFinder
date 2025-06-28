import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <section className='headercomponents'>
      <Link to="/" className="logo">
          <h1>Frame Finder</h1>
      </Link>
      <nav className="nav">
        <Link href="/" className="nav-link">Home</Link>
        <Link href="/browse" className="nav-link">Browse</Link>
        <Link href="/about" className="nav-link">About</Link>
        <Link href="/contact" className="nav-link">Contact</Link>
      </nav>
      <div>
        <button className='header-login'>Sign In</button>
        </div>
        </section>
    </header>
  );
};

export default Header;
