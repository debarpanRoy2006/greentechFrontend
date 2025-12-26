import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './Dashboard.css';

// --- COMPONENT IMPORTS ---
import TrainerCard from '../Gamification/TrainerCard';
import BadgeCase from '../Gamification/BadgeCase'; 
import DailySpin from '../Features/DailySpin'; 
import AqiWidget from '../Features/AqiWidget';
import CarbonTracker from '../Features/CarbonTracker';
import EnergyCalc from '../Features/EnergyCalc';
import BattleArena from '../Features/BattleArena'; 
import ImpactLogger from '../Features/ImpactLogger';

const Dashboard = () => {
  // --- STATE ---
  const [userStats, setUserStats] = useState({
    username: "LOADING...",
    level: 1,
    currentXP: 0,
    nextLevelXP: 500,
    badges: [] 
  });

  const [notification, setNotification] = useState("");
  const [selectedBadge, setSelectedBadge] = useState(null); 
  const [activeModal, setActiveModal] = useState(null); 
  const [threatLevel, setThreatLevel] = useState("SAFE");

  // --- FETCH PROFILE FROM BACKEND ---
  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/profile/');
      setUserStats(response.data);
    } catch (error) {
      console.error("Failed to load profile", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // --- REFRESH HANDLER ---
  const handleStatsUpdate = () => {
    fetchProfile(); 
    setNotification("✨ LEADERBOARD UPDATED!");
  };

  // --- THREAT TIMER ---
  useEffect(() => {
    if (threatLevel === "SAFE") {
      const timer = setTimeout(() => {
        setThreatLevel("DETECTED");
        setNotification("⚠️ WARNING: HIGH POLLUTION LEVELS DETECTED!");
      }, 8000); 
      return () => clearTimeout(timer);
    }
  }, [threatLevel]);

  // --- HANDLERS ---
  const handleBattleWin = async () => {
    try {
      // 1. Tell Backend to save the win
      await axios.post('http://127.0.0.1:8000/api/log-impact/', {
        action: 'battle_win'
      });

      // 2. Refresh data from server (So it persists)
      fetchProfile();

      // 3. UI Feedback
      setNotification("🏆 THREAT NEUTRALIZED! +100 XP SAVED");
      setActiveModal(null); 
      setThreatLevel("SAFE");
      
    } catch (error) {
      console.error("Failed to save battle win", error);
      setNotification("⚠️ NETWORK ERROR: XP NOT SAVED");
    }
  };

  const handleScan = () => setNotification("scanning sector... clear.");
  const handleDailyReward = (item) => setNotification(`RECEIVED: ${item}`);

  // --- RENDER MODALS ---
  
  // 1. FULL SCREEN BATTLE
  if (activeModal === 'BATTLE') {
    return (
      <div className="full-screen-battle-container animate-battle-enter">
        <div className="battle-screen-header">
           <div className="warning-tape"> // CRITICAL THREAT // COMBAT PROTOCOL ACTIVE // </div>
           <button className="emergency-exit-btn" onClick={() => setActiveModal(null)}>
             RETREAT (ESC)
           </button>
        </div>
        <div className="battle-screen-content">
           <BattleArena onWin={handleBattleWin} />
        </div>
      </div>
    );
  }

  // 2. STANDARD POP-UPS
  const renderPopup = () => {
    if (!activeModal || activeModal === 'BATTLE') return null;
    
    let content = null;
    let title = "";

    if (activeModal === 'MISSION') {
        title = "MISSION CONTROL";
        content = (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="hud-panel">
                  <h4 className="hud-subtitle">INPUT_STREAM</h4>
                  <ImpactLogger onSuccess={handleStatsUpdate} />
              </div>
              <div className="hud-panel"><h4 className="hud-subtitle">DIAGNOSTICS</h4>
                <div className="text-cyan-400 font-mono text-sm leading-loose">
                   SYSTEM CHECK... OK<br/>
                   SENSORS... ONLINE<br/>
                   DATA UPLINK... STABLE
                </div>
              </div>
            </div>
        );
    } else if (activeModal === 'CARBON') {
        title = "CARBON TRACKER";
        content = <CarbonTracker />;
    } else if (activeModal === 'ENERGY') {
        title = "ENERGY CALCULATOR";
        content = <EnergyCalc />;
    }

    return (
        <div className="hud-modal-overlay">
            <div className="hud-window cyan-theme animate-hud-open">
                <ModalDecorations />
                <div className="hud-header">
                    <span className="hud-title"> {title} // ONLINE</span>
                    <button className="hud-close" onClick={() => setActiveModal(null)}>✖</button>
                </div>
                <div className="hud-content">{content}</div>
            </div>
        </div>
    );
  };

  return (
    <div className={`dashboard-container modern-bg ${threatLevel === "DETECTED" ? "alert-mode" : ""}`}>
      
      {/* HEADER HUD */}
      <div className="dashboard-header">
        <TrainerCard {...userStats} />
      </div>

      {/* Main Terminal Button */}
      <div className="relative flex justify-center mb-8">
        <button className="cyber-btn" onClick={() => setActiveModal('MISSION')}>
          <div className="cyber-btn-content"><span>🔷 ACCESS TERMINAL</span></div>
          <div className="cyber-btn-glitch"></div>
        </button>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Panel */}
        <div className="panel features-panel">
          <h3 className="panel-title">FIELD_OPS</h3>
          <DailySpin onReward={handleDailyReward} />
          <div className="h-4"></div>
          <button className="dash-btn primary full-width" onClick={handleScan}><span className="btn-icon">📡</span> QUICK SCAN</button>
          <div className="h-4"></div>
          
          <div className="grid grid-cols-2 gap-2">
            <button className="dash-btn secondary" onClick={() => setActiveModal('CARBON')}>👣 CARBON</button>
            <button className="dash-btn secondary" onClick={() => setActiveModal('ENERGY')}>⚡ ENERGY</button>
          </div>
          
          <div className="h-4"></div>
          <AqiWidget />
        </div>

        {/* Right Panel */}
        <div className="right-col-stack">
            <div className="panel badge-panel">
               <BadgeCase badges={userStats.badges} onBadgeClick={setSelectedBadge} />
            </div>
            
            <div className="mt-6">
               {threatLevel === "SAFE" ? (
                 <div className="scanner-container">
                    <div className="scanner-line"></div>
                    <div className="scanner-text">SCANNING SECTOR 07...</div>
                 </div>
               ) : (
                 <button className="battle-start-modern active-threat" onClick={() => setActiveModal('BATTLE')}>
                    <div className="sword-icon-modern">☠️</div>
                    <div className="battle-text">
                      <div className="text-xs text-red-950 font-bold bg-red-500 px-1 inline-block">CRITICAL ALERT</div>
                      <div className="text-lg blink">ENEMY DETECTED</div>
                      <div className="text-xs text-red-300">CLICK TO ENGAGE</div>
                    </div>
                 </button>
               )}
            </div>
        </div>
      </div>

      {/* RENDER MODALS */}
      {renderPopup()}
      {notification && <div className="xp-popup animate-pop">{notification}</div>}
      
      {/* BADGE DETAILS */}
      {selectedBadge && (
         <div className="hud-modal-overlay" onClick={() => setSelectedBadge(null)}>
            <div className="hud-window cyan-theme" style={{maxWidth:'450px'}}>
              <ModalDecorations />
              <div className="hud-header">
                 <span className="hud-title">  DATABANK_ENTRY: #{selectedBadge.id} </span>
                 <button className="hud-close" onClick={() => setSelectedBadge(null)}>✖</button>
              </div>
              <div className="hud-content flex flex-col items-center text-center">
                 <div className={`badge-big-icon ${selectedBadge.unlocked ? 'glow' : 'dim'}`}>
                    {selectedBadge.unlocked ? selectedBadge.icon : '🔒'}
                 </div>
                 <h2 className="text-xl text-cyan-400 font-bold mb-2 font-press-start">
                    {selectedBadge.name}
                 </h2>
                 <div className="w-full border-t border-dashed border-gray-600 my-4"></div>
                 <div className="text-left w-full text-sm font-mono text-gray-300 space-y-2">
                    <p><span className="text-cyan-600">STATUS:</span> {selectedBadge.unlocked ? "UNLOCKED" : "ENCRYPTED"}</p>
                    <p><span className="text-cyan-600">DATE:</span> {selectedBadge.date}</p>
                    <p><span className="text-cyan-600">DATA:</span> {selectedBadge.desc}</p>
                 </div>
              </div>
            </div>
         </div>
      )}
    </div>
  );
};

// Helper for decorative corners
const ModalDecorations = () => (
  <>
    <div className="corner-accent tl"></div>
    <div className="corner-accent tr"></div>
    <div className="corner-accent bl"></div>
    <div className="corner-accent br"></div>
  </>
);

export default Dashboard;