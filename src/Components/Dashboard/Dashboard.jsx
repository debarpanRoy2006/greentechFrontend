import React, { useState } from 'react';
import './Dashboard.css';

// ⬇️ Import the Gamification Component we designed
// If you haven't made this file yet, comment this line out!
import TrainerCard from '../../Components/Gamification/TrainerCard'; 

// Assets (Optional: Use your own images or placeholders)
import scanIcon from '../../assets/images/totodile-pokemon.gif'; // Reusing totodile for now

const Dashboard = () => {
  // --- 1. GAME STATE (Gamification Logic) ---
  // In a real app, this comes from a database.
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

  // --- 2. ACTION: "SCAN ENVIRONMENT" (The Game Loop) ---
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
      nextXP = Math.floor(nextXP * 1.5); // Harder to get next level
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

    // Clear notification after 2 seconds
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <div className="dashboard-container">
      
      {/* --- TOP SECTION: TRAINER STATS --- */}
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

      {/* --- MAIN CONTENT GRID --- */}
      <div className="dashboard-grid">
        
        {/* LEFT COLUMN: ACTIONS */}
        <div className="panel action-panel">
          <h3 className="panel-title">ACTIONS</h3>
          <div className="action-buttons">
            <button className="dash-btn primary" onClick={handleScan}>
              <span className="btn-icon">📡</span> SCAN AREA
            </button>
            <button className="dash-btn secondary">
              <span className="btn-icon">📝</span> LOG WASTE
            </button>
            <button className="dash-btn warning">
              <span className="btn-icon">⚠️</span> REPORT LEAK
            </button>
          </div>
          
          <div className="totodile-helper">
             <p className="helper-text">"Totodile says: Keep scanning to earn badges!"</p>
             <img src={scanIcon} alt="Helper" className="helper-img" />
          </div>
        </div>

        {/* RIGHT COLUMN: ECODEX BADGES */}
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