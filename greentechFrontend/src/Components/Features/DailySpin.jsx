import React, { useState } from 'react';
import { gsap } from 'gsap';
import './FeatureStyles.css'; // Re-using your existing styles

const DailySpin = ({ onReward }) => {
  const [spinning, setSpinning] = useState(false);
  const [claimed, setClaimed] = useState(false);
  
  // Ref for the icon to animate
  const iconRef = React.useRef(null);

  const handleSpin = () => {
    if (claimed || spinning) return;
    
    setSpinning(true);

    // 1. GSAP Spin Animation
    gsap.to(iconRef.current, {
      rotation: 360 * 5, // Spin 5 times
      duration: 2,
      ease: "power2.inOut",
      onComplete: () => {
        // 2. Give Reward
        const rewards = ["Rare Candy 🍬", "Solar Cell ☀️", "Blue Bin ♻️"];
        const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
        
        setSpinning(false);
        setClaimed(true);
        if (onReward) onReward(randomReward);
      }
    });
  };

  return (
    <div className={`feature-card spin-card ${claimed ? 'claimed' : ''}`}>
      <h3 className="feature-title">DAILY SUPPLY DROP</h3>
      
      <div className="spin-container">
        <div className="spin-circle-outer">
            <div 
              ref={iconRef} 
              className="spin-icon"
              onClick={handleSpin}
              style={{ cursor: claimed ? 'default' : 'pointer' }}
            >
              {claimed ? "🎁" : "💠"} 
            </div>
        </div>
      </div>

      <p className="spin-text">
        {spinning ? "Spinning..." : claimed ? "Come back tomorrow!" : "Click the Cube for supplies!"}
      </p>
    </div>
  );
};

export default DailySpin;