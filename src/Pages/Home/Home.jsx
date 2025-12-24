import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import "./landing.css";

// ⬇️ Assets
import runTotodile from "../../assets/images/totodile-pokemon.gif";
import bikingGirl from "../../assets/images/bikingGirl.gif";
import cloudMov from "../../assets/images/cloudMov.png";
import grass from "../../assets/images/grass.png";

const Home = () => {
  const navigate = useNavigate();
  const groundRef = useRef(null);
  const cloudRef = useRef(null);
  const girlRef = useRef(null);
  const totoRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // 1. Endless Ground Loop
    const groundAnim = gsap.to(groundRef.current, {
      backgroundPositionX: "-2000px",
      duration: 12,
      ease: "none",
      repeat: -1,
    });

    // 2. Slow Cloud Float
    const cloudAnim = gsap.to(cloudRef.current, {
      backgroundPositionX: "-2000px",
      duration: 80, // Slower for depth
      ease: "none",
      repeat: -1,
    });

    // 3. Floating Title Animation
    gsap.fromTo(titleRef.current, 
      { y: 0 }, 
      { y: -10, duration: 2.5, yoyo: true, repeat: -1, ease: "sine.inOut" }
    );

    groundRef.current.anim = groundAnim;
    cloudRef.current.anim = cloudAnim;
  }, []);

  const handleStart = () => {
    // Warp Speed Effect
    gsap.to([groundRef.current.anim, cloudRef.current.anim], { 
      timeScale: 10, 
      duration: 1.5,
      ease: "power2.in"
    });

    // Characters Zoom Off
    gsap.to(girlRef.current, { x: "120vw", duration: 1.2, ease: "power1.in" });
    gsap.to(totoRef.current, { x: "120vw", duration: 1.2, delay: 0.1, ease: "power1.in" });

    // Fade Out UI
    gsap.to(".ui-layer", { opacity: 0, y: -50, duration: 0.5 });

    setTimeout(() => {
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div className="home-container">
      {/* 🌅 SKY GRADIENT IS IN CSS */}
      
      {/* ☁️ CLOUDS */}
      <div 
        ref={cloudRef}
        className="background-layer clouds-bg"
        style={{ backgroundImage: `url(${cloudMov})` }}
      />

      {/* ⛰️ MOUNTAIN SILHOUETTE (CSS Generated) */}
      <div className="mountain-layer"></div>

      {/* 🛣️ GROUND */}
      <div 
        ref={groundRef}
        className="background-layer ground"
        style={{ backgroundImage: `url(${grass})` }}
      />

      {/* 🏃 CHARACTERS */}
      <div className="character-stage">
        <img
          ref={totoRef}
          className="char-totodile"
          src={runTotodile}
          alt="Totodile"
        />
        <img
          ref={girlRef}
          className="char-bike"
          src={bikingGirl}
          alt="Bike Girl"
        />
      </div>

      {/* 🎮 UI OVERLAY */}
      <div className="ui-layer" ref={titleRef}>
        <div className="title-wrapper">
          <h1 className="game-title">ECODEX</h1>
          <div className="title-shadow">ECODEX</div> {/* Duplicate for heavy 3D shadow */}
        </div>
        
        <div className="subtitle-badge">
          THE JOURNEY TO SUSTAINABILITY
        </div>
        
        <button className="start-btn" onClick={handleStart}>
          START ADVENTURE ▶
        </button>
      </div>

      {/* 📺 SCREEN EFFECTS */}
      <div className="vignette"></div>
      <div className="scanlines"></div>
    </div>
  );
};

export default Home;