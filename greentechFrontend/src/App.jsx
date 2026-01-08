// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

// --- COMPONENTS ---
import Home from "./Pages/Home/Home";
import LoadingScreen from "./Components/LoadingScreen/LoadingScreen";
import Footer from "./Components/footer/footer";
import Navbar from "./Components/Navbar/Navbar";
import Dashboard from "./Components/Dashboard/Dashboard";
import About from './Pages/AboutUs/About';
import Leaderboard from './Components/Leaderboard/Leaderboard';
import PageTransition from './Components/UI/PageTransition';

// --- AUTH MODALS ---
import Login from "./Components/Login/Login"; 
import Register from "./Components/Login/Register";

// --- ASSETS ---
import bgMusicFile from "./assets/sounds/bg.mp3"; 
import startSoundFile from "./assets/sounds/click.mp3"; 

const App = () => {
  const [isMuted, setIsMuted] = useState(false);
  const location = useLocation(); 

  // --- AUTH STATE ---
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [user, setUser] = useState(localStorage.getItem('user_email') || null);

  // --- AUDIO SETUP ---
  const bgMusicRef = useRef(null);
  const startSoundRef = useRef(null);

  useEffect(() => {
    // Wrap in try-catch to prevent crashes if files are missing
    try {
        bgMusicRef.current = new Audio(bgMusicFile);
        startSoundRef.current = new Audio(startSoundFile);
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.3;
        startSoundRef.current.volume = 0.6;
    } catch (e) { console.warn("Audio files missing"); }
  }, []);

  const toggleMute = () => {
    if (!bgMusicRef.current) return;
    const newState = !isMuted;
    setIsMuted(newState);
    bgMusicRef.current.muted = newState;
    startSoundRef.current.muted = newState;
  };

  const playEntrySounds = () => {
    if (startSoundRef.current && bgMusicRef.current) {
        startSoundRef.current.play().catch(e => console.log(e));
        bgMusicRef.current.play().catch(e => console.log(e));
    }
  };

  // --- AUTH HANDLERS ---
  const handleLoginSuccess = (username) => {
    setUser(username);
    localStorage.setItem('user_email', username);
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    window.location.reload(); 
  };

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <main className="max-w-screen min-h-screen overflow-y-auto bg-gray-900">
      
      {/* Navbar with Auth Props */}
      {location.pathname !== "/" && (
        <Navbar 
            isMuted={isMuted} 
            toggleMute={toggleMute} 
            user={user}
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenRegister={() => setIsRegisterOpen(true)}
            onLogout={handleLogout}
        />
      )}

      <PageTransition />

      <Routes>
        {/* Page 1: The Game Loader */}
        <Route path="/" element={<GameLoader onStartAudio={playEntrySounds} />} />
        
        {/* Main Pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
      
      {location.pathname !== "/" && <Footer />}

      {/* --- MODALS (Outside Routes) --- */}
      <Login 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLogin={handleLoginSuccess}
        switchToRegister={switchToRegister}
      />

      <Register 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        onLogin={handleLoginSuccess}
        switchToLogin={switchToLogin}
      />
      
    </main>
  );
};

// --- GAME LOADER COMPONENT ---
// (Ideally move this to its own file, but keeping here as requested)
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