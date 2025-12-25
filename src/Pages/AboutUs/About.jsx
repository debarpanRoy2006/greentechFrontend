import React from 'react';
import './About.css';
// Go up two levels (../../) to find assets
import scanIcon from '../../assets/images/run-pikachu.gif'; 

const About = () => {
  return (
    <div className="about-container">
      
      {/* --- HERO SECTION --- */}
      <div className="about-hero">
        <div className="hero-content">
          <h1 className="glitch-text" data-text="PROJECT: ECODEX">PROJECT: ECODEX</h1>
          <p className="mission-statement">
            "Gamifying the fight against climate change, one pixel at a time."
          </p>
        </div>
      </div>

      {/* --- WHAT IS IT? --- */}
      <div className="about-section dark-bg">
        <div className="section-grid">
          <div className="text-box">
            <h2>SYSTEM OVERVIEW</h2>
            <p>
              The <strong>Ecodex</strong> is a next-generation sustainability tool designed to make 
              eco-friendly habits addictive. By combining real-world environmental tracking 
              with retro-gaming mechanics, we turn carbon reduction into a quest.
            </p>
            <ul className="feature-list">
              <li>📡 <strong>Monitor</strong> AQI & Carbon Footprint in real-time.</li>
              <li>⚔️ <strong>Battle</strong> pollution monsters by solving eco-quizzes.</li>
              <li>🏆 <strong>Collect</strong> badges by completing real-world tasks.</li>
            </ul>
          </div>
          <div className="image-box">
             <div className="holo-card">
               <img src={scanIcon} alt="Mascot" className="mascot-float" />
               <div className="holo-scanline"></div>
             </div>
          </div>
        </div>
      </div>

      {/* --- THE TEAM --- */}
      <div className="about-section team-section">
        <h2>DEVELOPER LOG</h2>
        <div className="team-grid">
          
          {/* TEAM MEMBER 1 */}
          <div className="team-card">
            <div className="member-avatar">👨‍💻</div>
            <h3>Debarpan Roy</h3>
            <span className="role">Developer</span>
            <p>Frontend Engineer</p>
          </div>

          {/* TEAM MEMBER 2 */}
          <div className="team-card">
            <div className="member-avatar">👨‍💻</div>
            <h3>Shaurya Verma </h3>
            <span className="role">Developer</span>
            <p>Backend Engineer</p>
          </div>
           <div className="team-card">
            <div className="member-avatar">👨</div>
            <h3>Bishal Dutta  </h3>
            <span className="role">Designer</span>
            <p>UI/UX Designer</p>
          </div>

        </div>
      </div>

      {/* --- FOOTER CTA --- */}
      <div className="about-footer">
        <p>INITIATIVE STATUS: <span style={{color: '#0f0'}}>ACTIVE</span></p>
        <button className="retro-btn" onClick={() => window.location.href='/dashboard'}>
          LAUNCH DASHBOARD
        </button>
      </div>

    </div>
  );
};

export default About;