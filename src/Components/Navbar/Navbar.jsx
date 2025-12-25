import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Use Link for fast navigation
import './Navbar.css';

const Navbar = ({ isMuted, toggleMute }) => {
  const location = useLocation();

  // Helper to check if link is active
  const isActive = (path) => location.pathname === path ? 'active-link' : '';

  return (
    <nav className="pokedex-navbar">
      
      {/* LEFT: Branding & LEDs */}
      <div className="nav-brand">
        <div className="led-blue-big"></div> {/* The big blue light */}
        <div className="led-traffic">
          <div className="led-small red"></div>
          <div className="led-small yellow"></div>
          <div className="led-small green"></div>
        </div>
        <Link to="/home" className="brand-text">ECODEX</Link>
      </div>

      {/* RIGHT: Navigation Links */}
      <div className="nav-links">
        <Link to="/home" className={`nav-item ${isActive('/home')}`}>
          HOME
        </Link>
        <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
          DASHBOARD
        </Link>
        <Link to="/about" className={`nav-item ${isActive('/about')}`}>
          TEAM
        </Link>
        
        {/* The Audio Toggle (Moved inside Navbar) */}
        <button className="nav-mute-btn" onClick={toggleMute}>
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>
      
    </nav>
  );
};

export default Navbar;