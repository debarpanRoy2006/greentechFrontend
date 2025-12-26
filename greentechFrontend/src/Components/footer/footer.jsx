import React from 'react';
import './footer.css';
// Optional: Add a sleeping pokemon gif for the corner
// import sleepySnorlax from '../../assets/images/snorlax-sleep.gif'; 
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    };
const Footer = () => {
  return (
    <footer className="retro-footer">
      <div className="footer-content">
        
        {/* Column 1: Branding */}
        <div className="footer-section">
          <h3 className="footer-title">ECODEX</h3>
          <p>Gotta save the planet!</p>
          <p className="copyright">© 2025 ECODEX Edition</p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-section">
          <h4 className="footer-subtitle">REGION MAP</h4>
          <ul className="footer-links">
            <li><a href="/home">Home Base</a></li>
            <li><a href="/dashboard">Pokedex Data</a></li>
            <li><a href="/about">Gym Leaders (Team)</a></li>
          </ul>
        </div>

        {/* Column 3: Connect */}
        <div className="footer-section">
          <h4 className="footer-subtitle">COMMUNICATION</h4>
          <div className="social-icons">
            <a href="#" className="social-btn">GITHUB</a>
            <a href="#" className="social-btn">DISCORD</a>
          </div>
        </div>

      </div>

      {/* The Bottom Bar */}
      <div className="footer-bar">
        <p>MADE WITH ⚡ AND ☕ BY THE ECODEX TEAM</p>
      </div>
      
    


<button className="poke-scroll-btn" onClick={scrollToTop} title="Fly Up!">
  <div className="poke-ball-icon"></div>
  <span>UP</span>
</button>
    </footer>
  );
};

export default Footer;