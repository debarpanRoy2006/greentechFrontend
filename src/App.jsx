import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Pages/Home/Home";
import LoadingScreen from "./Components/LoadingScreen/LoadingScreen";

// --- 1. Import Sounds ---
// Make sure these files exist in your folder!
import bgMusicFile from "./assets/sounds/bg.mp3"; 
import startSoundFile from "./assets/sounds/click.mp3"; 

const App = () => {
  // --- 2. Global Audio State ---
  const [isMuted, setIsMuted] = useState(false);
  
  // Use Refs so audio objects persist across route changes
  const bgMusicRef = useRef(new Audio(bgMusicFile));
  const startSoundRef = useRef(new Audio(startSoundFile));

  // --- 3. Audio Configuration ---
  useEffect(() => {
    // Background Music Settings
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.3; // 30% volume
    
    // Start Sound Settings
    startSoundRef.current.volume = 0.6;
  }, []);

  // --- 4. Helper Functions ---
  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    bgMusicRef.current.muted = newState;
    startSoundRef.current.muted = newState;
  };

  const playEntrySounds = () => {
    // This is called when user clicks "Press Start"
    startSoundRef.current.play().catch(e => console.log("SFX Blocked:", e));
    bgMusicRef.current.play().catch(e => console.log("BGM Blocked:", e));
  };

  return (
    <main className="max-w-screen overflow-hidden">
      
      {/* --- Global Mute Button (Visible on ALL pages) --- */}
      <button 
        onClick={toggleMute} 
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: 'rgba(0,0,0,0.6)',
          color: '#00ff00',
          border: '1px solid #00ff00',
          borderRadius: '20px',
          padding: '8px 16px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontFamily: 'monospace'
        }}
      >
        {isMuted ? "🔇 OFF" : "🔊 ON"}
      </button>

      <Routes>
        {/* Pass the audio trigger down to the loader */}
        <Route 
          path="/" 
          element={<GameLoader onStartAudio={playEntrySounds} />} 
        />
        <Route path="/home" element={<Home />} />
      </Routes>
    </main>
  );
};

// 🎮 The Game Loader Logic
const GameLoader = ({ onStartAudio }) => {
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleStart = () => {
    // 1. Trigger the Global Audio (passed from App)
    if (onStartAudio) onStartAudio();
    
    // 2. Start the animation state
    setStarted(true);
  };

  useEffect(() => {
    if (!started) return;

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          // Wait 0.5s at 100% then go to Home
          setTimeout(() => navigate("/home"), 500);
          return 100;
        }
        const diff = Math.random() * 15; 
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    return () => clearInterval(timer);
  }, [started, navigate]);

  return (
    <LoadingScreen 
      progress={progress} 
      hasStarted={started} 
      onStart={handleStart} 
    />
  );
};

export default App;