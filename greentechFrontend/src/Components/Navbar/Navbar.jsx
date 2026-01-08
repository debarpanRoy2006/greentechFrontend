import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isMuted, toggleMute, user, onOpenLogin, onOpenRegister, onLogout }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active-link' : '';

  return (
    <nav className="pokedex-navbar">
      
      {/* Branding */}
      <div className="nav-brand">
        <div className="led-blue-big"></div>
        <div className="led-traffic">
          <div className="led-small red"></div>
          <div className="led-small yellow"></div>
          <div className="led-small green"></div>
        </div>
        <Link to="/home" className="brand-text">ECODEX</Link>
      </div>

      {/* Links & Buttons */}
      <div className="nav-links">
        <Link to="/home" className={`nav-item ${isActive('/home')}`}>HOME</Link>
        <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>DASHBOARD</Link>
        <Link to="/about" className={`nav-item ${isActive('/about')}`}>ABOUT</Link>
        <Link to="/leaderboard" className={`nav-item ${isActive('/leaderboard')}`}>LEADERBOARD</Link>
        {/* Auth Buttons */}
        {user ? (
          <button 
            className="nav-item logout-btn" 
            onClick={onLogout}
            style={{ color: '#ff5f5f', cursor: 'pointer' }}
          >
            LOGOUT
          </button>
        ) : (
          <>
            <button 
                className="nav-item login-btn" 
                onClick={onOpenLogin}
                style={{ color: '#4ade80', cursor: 'pointer' }}
            >
                LOGIN
            </button>
            <button 
                className="nav-item" 
                onClick={onOpenRegister}
                style={{ color: '#22d3ee', cursor: 'pointer' }}
            >
                JOIN
            </button>
          </>
        )}

        {/* Audio Toggle */}
        <button className="nav-mute-btn" onClick={toggleMute}>
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>
      
    </nav>
  );
};

export default Navbar;