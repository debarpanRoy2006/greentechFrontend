// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// --- COMPONENTS ---
import Home from "./Pages/Home/Home";
import LoadingScreen from "./Components/LoadingScreen/LoadingScreen";
import Footer from "./Components/footer/footer";
import Navbar from "./Components/Navbar/Navbar";
import Dashboard from "./Components/Dashboard/Dashboard"; // 🆕 1. Import Dashboard
// src/App.jsx
import PageTransition from './Components/UI/PageTransition';
// 🔄 UPDATE THIS LINE:
import About from './Pages/AboutUs/About';


import bgMusicFile from "./assets/sounds/bg.mp3"; 
import startSoundFile from "./assets/sounds/click.mp3"; 

const App = () => {
  const [isMuted, setIsMuted] = useState(false);
  
  // We use this to hide Navbar/Footer on the loading screen
  const location = useLocation(); 

  // --- AUDIO SETUP ---
  const bgMusicRef = useRef(new Audio(bgMusicFile));
  const startSoundRef = useRef(new Audio(startSoundFile));

  useEffect(() => {
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.3;
    startSoundRef.current.volume = 0.6;
  }, []);

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    bgMusicRef.current.muted = newState;
    startSoundRef.current.muted = newState;
  };

  const playEntrySounds = () => {
    startSoundRef.current.play().catch(e => console.log(e));
    bgMusicRef.current.play().catch(e => console.log(e));
  };

  return (
    <main className="max-w-screen min-h-screen overflow-y-auto bg-gray-900">
      
      {/* Show Navbar on every page EXCEPT the Loading Screen ("/") */}
      {location.pathname !== "/" && (
        <Navbar isMuted={isMuted} toggleMute={toggleMute} />
      )}
      <PageTransition />

      <Routes>
        {/* Page 1: The Game Loader */}
        <Route path="/" element={<GameLoader onStartAudio={playEntrySounds} />} />
        
        {/* Page 2: The Home / Landing Page */}
        <Route path="/home" element={<Home />} />

        {/* Page 3: The Dashboard (🆕 ADDED THIS) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
      </Routes>
      
      {/* Show Footer on every page EXCEPT the Loading Screen */}
      {location.pathname !== "/" && <Footer />}
      
    </main>
  );
};

// --- GAME LOADER COMPONENT (Keep this at the bottom or in its own file) ---
import { useNavigate } from "react-router-dom";

const GameLoader = ({ onStartAudio }) => {
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleStart = () => {
    if (onStartAudio) onStartAudio();
    setStarted(true);
  };

  useEffect(() => {
    if (!started) return;
    const timer = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(timer);
          setTimeout(() => navigate("/home"), 500);
          return 100;
        }
        return Math.min(old + Math.random() * 15, 100);
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