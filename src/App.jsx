import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Pages/Home/Home";
import LoadingScreen from "./Components/LoadingScreen/LoadingScreen";

// Optional: Import a sound effect (put a .mp3 in your assets folder)
// import startSound from "./assets/sounds/game-start.mp3"; 

const App = () => {
  return (
    <main className="max-w-screen overflow-hidden">
      <Routes>
        <Route path="/" element={<GameLoader />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </main>
  );
};

// 🎮 The Game Loader Logic
const GameLoader = () => {
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  
  // Ref for audio (optional)
  // const audioRef = useRef(new Audio(startSound));

  const handleStart = () => {
    // 1. Play Sound (Uncomment if you have a sound file)
    // audioRef.current.play().catch(e => console.log("Audio needed user interaction"));
    
    // 2. Set Started State
    setStarted(true);
  };

  useEffect(() => {
    // Only run the progress bar IF the game has started
    if (!started) return;

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => navigate("/home"), 500);
          return 100;
        }
        // Random speed for realism
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