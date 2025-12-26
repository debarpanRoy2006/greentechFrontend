import React from "react";
import "./Loading.css";
import togopie from "../../assets/images/togopie.gif";

const LoadingScreen = ({ progress, hasStarted, onStart }) => {
  return (
    <div className={`loading-container ${hasStarted ? "game-active" : ""}`}>
      
      <div className="logo-section">
        <h1 className={`loading-logo ${hasStarted ? "pop-anim" : ""}`}>
          Ecodex
        </h1>
        <p className="loading-subtitle">
          {hasStarted ? "Loading your eco experience..." : "Catch 'em green!"}
        </p>
      </div>

      <div className="interaction-area">
        {!hasStarted ? (
          <button className="press-start-btn" onClick={onStart}>
            <span>▶ PRESS START</span>
          </button>
        ) : (
          <div className="progress-section fade-in">
             {/* UPDATED LOGIC: 
                1. Use 'left' to track the tip of the bar.
                2. Removed width style here, handled in CSS.
             */}
             <div 
                className="runner-container" 
                style={{ left: `${progress}%` }}
            >
                 <img src={togopie} alt="Togopie" className="togopie-runner" />
            </div>

            <div className="progress-bar">
              <div 
                className="progress-fill shiny" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;