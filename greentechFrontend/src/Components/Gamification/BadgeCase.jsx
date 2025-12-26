import React, { useState } from 'react';
import './BadgeCase.css';

const BadgeCase = ({ badges, onBadgeClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Create 8 slots (filling with known badges, rest are empty)
  const slots = Array(12).fill(null).map((_, index) => badges[index] || null);

  return (
    <div className="badge-case-container" onClick={() => !isOpen && setIsOpen(true)}>
      
      {/* --- THE LID (Covers the box) --- */}
      <div className={`case-lid ${isOpen ? 'open' : ''}`}>
        <div className="lid-content">
          <div className="pokeball-logo"></div>
          <h2 className="lid-title">ECODEX BADGES</h2>
          <p className="lid-subtitle">CLICK TO OPEN</p>
        </div>
      </div>

      {/* --- THE INTERIOR (Velvet Box) --- */}
      {/* Header with LED (Always visible inside) */}
      <div className="case-header">
        <span className="case-title">COLLECTION STATUS</span>
        <div className={`case-led ${isOpen ? 'on' : ''}`}></div>
      </div>

      <div className="velvet-box">
        {slots.map((badge, index) => (
          <div 
            key={index} 
            className={`badge-slot ${badge ? 'filled' : 'empty'}`}
            onClick={(e) => {
              if (isOpen && badge) {
                e.stopPropagation(); // Prevent re-triggering box click
                onBadgeClick(badge);
              }
            }}
          >
            {badge ? (
              <div className={`gym-badge ${badge.unlocked ? 'shiny' : 'silhouetted'}`}>
                {badge.unlocked ? badge.icon : "🔒"}
                {badge.unlocked && <div className="shine-effect"></div>}
              </div>
            ) : (
              <div className="empty-socket"></div>
            )}
            
            {badge && <span className="badge-label">{badge.name}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeCase;