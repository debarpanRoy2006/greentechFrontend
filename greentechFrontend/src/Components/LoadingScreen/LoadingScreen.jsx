import React from "react";
import "./Loading.css";
import togopie from "../../assets/images/togopie.gif";

const LoadingScreen = ({ progress, hasStarted, onStart }) => {
  return (
    // If started, add a 'game-active' class for CSS transitions
    <div className={`loading-container ${hasStarted ? "game-active" : ""}`}>
      
      <div className="logo-section">
        {/* The logo gets a 'pop' animation when started */}
        <h1 className={`loading-logo ${hasStarted ? "pop-anim" : ""}`}>
          Ecodex
        </h1>
        <p className="loading-subtitle">
          {hasStarted ? "Loading your eco experience..." : "Catch 'em green!"}
        </p>
      </div>

      <div className="interaction-area">
        {!hasStarted ? (
          /* --- STATE 1: PRESS START --- */
          <button className="press-start-btn" onClick={onStart}>
            <span>▶ PRESS START</span>
          </button>
        ) : (
          /* --- STATE 2: LOADING BAR --- */
          <div className="progress-section fade-in">
             <div 
                className="runner-container" 
                style={{ width: `${progress}%` }}
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