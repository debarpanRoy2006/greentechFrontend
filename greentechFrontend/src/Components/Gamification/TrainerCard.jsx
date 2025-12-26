import React from 'react';
import './TrainerCard.css';
// import avatarImg from '../../assets/images/trainer-avatar.png'; // Optional

const TrainerCard = ({ username, level, currentXP, nextLevelXP }) => {
  // Calculate percentage for the bar width
  const progressPercent = Math.min((currentXP / nextLevelXP) * 100, 100);

  return (
    <div className="trainer-card">
      <div className="card-header">
        <span className="card-label">TRAINER PASSPORT</span>
        <span className="card-id">ID No. 84920</span>
      </div>

      <div className="card-body">
        <div className="avatar-box">
           {/* Place holder for user avatar */}
           <div className="pixel-avatar">👤</div>
        </div>

        <div className="stats-box">
          <h2 className="username">{username || "ECO HERO"}</h2>
          <div className="level-badge">LVL {level}</div>
          
          <div className="xp-section">
            <div className="xp-text">
              <span>EXP</span>
              <span>{currentXP} / {nextLevelXP}</span>
            </div>
            {/* The Progress Bar */}
            <div className="xp-bar-container">
              <div 
                className="xp-bar-fill" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerCard;