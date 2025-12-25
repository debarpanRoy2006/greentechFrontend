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
  
  // Existing Refs
  const groundRef = useRef(null);
  const cloudRef = useRef(null);
  const girlRef = useRef(null);
  const totoRef = useRef(null);
  const titleRef = useRef(null);

  // 🆕 NEW Refs for Pokeball Animation
  const pokeTopRef = useRef(null);
  const pokeBottomRef = useRef(null);
  const pokeBtnRef = useRef(null);

  useEffect(() => {
    // --- 1. EXISTING LOOP ANIMATIONS (Keep these running) ---
    const groundAnim = gsap.to(groundRef.current, {
      backgroundPositionX: "-2000px",
      duration: 12,
      ease: "none",
      repeat: -1,
    });

    const cloudAnim = gsap.to(cloudRef.current, {
      backgroundPositionX: "-2000px",
      duration: 80,
      ease: "none",
      repeat: -1,
    });

    // Save anims for warp speed later
    groundRef.current.anim = groundAnim;
    cloudRef.current.anim = cloudAnim;

    // --- 2. 🆕 POKEBALL OPENING SEQUENCE ---
    const tl = gsap.timeline();

    // Step A: Blink the button
    tl.to(pokeBtnRef.current, {
      boxShadow: "0 0 40px 10px rgba(255, 255, 255, 0.9)",
      duration: 0.4,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    })
    // Step B: Open the Shutters (Top goes Up, Bottom goes Down)
    .to(pokeTopRef.current, { y: "-100%", duration: 1.2, ease: "power3.inOut" }, "+=0.1")
    .to(pokeBottomRef.current, { y: "100%", duration: 1.2, ease: "power3.inOut" }, "<")
    .to(pokeBtnRef.current, { opacity: 0, duration: 0.5 }, "<")
    
    // Step C: Reveal UI Elements (Title Drops In)
    .fromTo(titleRef.current, 
      { y: -100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "bounce.out" }, 
      "-=0.5"
    );

    // --- 3. FLOATING TITLE LOOP (Starts after entrance) ---
    gsap.to(titleRef.current, {
      y: -10,
      duration: 2.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 2 // Wait for bounce to finish
    });

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

    // Optional: Close Pokeball before leaving? 
    // If you want that, uncomment this block:
    /*
    gsap.to(pokeTopRef.current, { y: "0%", duration: 0.8, delay: 0.5 });
    gsap.to(pokeBottomRef.current, { y: "0%", duration: 0.8, delay: 0.5 });
    */

    setTimeout(() => {
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div className="home-container">
      
      {/* 🔴⚪ 🆕 POKEBALL OVERLAY LAYERS */}
      <div className="poke-shutter top" ref={pokeTopRef}></div>
      <div className="poke-shutter bottom" ref={pokeBottomRef}></div>
      <div className="poke-button" ref={pokeBtnRef}>
        <div className="poke-button-inner"></div>
      </div>


      {/* 🌅 SKY & BACKGROUNDS */}
      <div 
        ref={cloudRef}
        className="background-layer clouds-bg"
        style={{ backgroundImage: `url(${cloudMov})` }}
      />
      <div className="mountain-layer"></div>
      <div 
        ref={groundRef}
        className="background-layer ground"
        style={{ backgroundImage: `url(${grass})` }}
      />

      {/* 🏃 CHARACTERS */}
      <div className="character-stage">
        <img ref={totoRef} className="char-totodile" src={runTotodile} alt="Totodile" />
        <img ref={girlRef} className="char-bike" src={bikingGirl} alt="Bike Girl" />
      </div>

      {/* 🎮 UI OVERLAY */}
      <div className="ui-layer" ref={titleRef}>
        <div className="title-wrapper">
          <h1 className="game-title">ECODEX</h1>
          <div className="title-shadow">ECODEX</div> 
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