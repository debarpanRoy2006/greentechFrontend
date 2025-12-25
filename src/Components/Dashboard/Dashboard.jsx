import React, { useState } from 'react';
import './Dashboard.css';

// --- 1. IMPORT COMPONENTS (FIXED PATHS) ---

// Go UP one folder (../) to find Gamification
import TrainerCard from '../Gamification/TrainerCard'; 

// Go UP one folder (../) to find Features
import AqiWidget from '../Features/AqiWidget';
import CarbonTracker from '../Features/CarbonTracker';
import EnergyCalc from '../Features/EnergyCalc';

// Go UP two folders (../../) to find assets
import scanIcon from '../../assets/images/totodile-pokemon.gif'; 

const Dashboard = () => {
  // --- 2. GAME STATE (XP & Level Logic) ---
  const [userStats, setUserStats] = useState({
    username: "ASH KETCHUM",
    level: 3,
    currentXP: 350,
    nextLevelXP: 500,
    badges: [
      { id: 1, name: "Starter", icon: "🌱", unlocked: true, desc: "Joined the initiative" },
      { id: 2, name: "Recycler", icon: "♻️", unlocked: true, desc: "Recycled 5 items" },
      { id: 3, name: "Solar", icon: "☀️", unlocked: false, desc: "Use solar energy" }, 
      { id: 4, name: "Hydro", icon: "💧", unlocked: false, desc: "Save 100L water" },
    ]
  });

  const [notification, setNotification] = useState("");

  // --- 3. THE XP LOOP (Linked to "Scan Area" button) ---
  const handleScan = () => {
    // A. Give XP
    const xpGain = 50;
    const newXP = userStats.currentXP + xpGain;
    
    // B. Check Level Up
    let newLevel = userStats.level;
    let finalXP = newXP;
    let nextXP = userStats.nextLevelXP;

    if (newXP >= userStats.nextLevelXP) {
      newLevel += 1;
      finalXP = newXP - userStats.nextLevelXP; // Rollover XP
      nextXP = Math.floor(nextXP * 1.5); // Increase difficulty
      setNotification(`🎉 LEVEL UP! YOU ARE NOW LVL ${newLevel}!`);
    } else {
      setNotification(`+${xpGain} XP! Data Collected.`);
    }

    // C. Update State
    setUserStats({
      ...userStats,
      level: newLevel,
      currentXP: finalXP,
      nextLevelXP: nextXP
    });

    // Clear notification after 3 seconds
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <div className="dashboard-container">
      
      {/* --- TOP SECTION: TRAINER CARD --- */}
      <div className="dashboard-header">
        <TrainerCard 
          username={userStats.username} 
          level={userStats.level} 
          currentXP={userStats.currentXP} 
          nextLevelXP={userStats.nextLevelXP} 
        />
      </div>

      {/* --- NOTIFICATION POPUP --- */}
      {notification && (
        <div className="xp-popup animate-pop">
          {notification}
        </div>
      )}

      {/* --- MAIN DASHBOARD GRID --- */}
      <div className="dashboard-grid">
        
        {/* LEFT COLUMN: ECO TOOLS (The Django Features) */}
        <div className="panel features-panel">
          <h3 className="panel-title">FIELD TOOLS</h3>
          
          {/* 1. Quick Action for XP */}
          <button className="dash-btn primary full-width" onClick={handleScan}>
            <span className="btn-icon">📡</span> QUICK SCAN (+50 XP)
          </button>
          
          <div className="spacer" style={{ height: '20px' }}></div>

          {/* 2. The Widgets */}
          <AqiWidget />
          <CarbonTracker />
          <EnergyCalc />
          
          {/* Helper Mascot */}
          <div className="totodile-helper">
             <p className="helper-text">"Totodile says: Check your Carbon Footprint daily!"</p>
             <img src={scanIcon} alt="Helper" className="helper-img" />
          </div>
        </div>

        {/* RIGHT COLUMN: BADGE COLLECTION */}
        <div className="panel badge-panel">
          <h3 className="panel-title">ECODEX COLLECTION</h3>
          <div className="badge-grid">
            {userStats.badges.map((badge) => (
              <div 
                key={badge.id} 
                className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="badge-icon-circle">
                  {badge.unlocked ? badge.icon : "🔒"}
                </div>
                <div className="badge-info">
                  <span className="badge-name">{badge.name}</span>
                  <span className="badge-desc">{badge.unlocked ? badge.desc : "???"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;