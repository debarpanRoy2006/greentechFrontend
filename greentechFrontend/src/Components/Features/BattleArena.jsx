import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './BattleArena.css';

// --- ASSETS ---
import battleMusicFile from '../../assets/sounds/battle-theme.mp3'; 
import gengarGif from '../../assets/images/gengar.gif';
import victoryImg from '../../assets/images/gengar-defeat.png'; 

// --- 🧠 BATTLE QUIZ DATA ---
const BATTLE_QUESTIONS = [
  {
    id: 1,
    text: "Which plastic is easiest to recycle?",
    options: ["Polystyrene (6)", "PVC (3)", "PET (1)", "Other (7)"],
    correctIndex: 2 // PET (1)
  },
  {
    id: 2,
    text: "You have eaten chips. What should you do?",
    options: ["Use Dustbins", "Throw Trash on Road", "Do nothing", "Throw in River"],
    correctIndex: 0 // Use Dustbins
  },
  {
    id: 3,
    text: "Which energy source is NOT renewable?",
    options: ["Solar", "Natural Gas", "Wind", "Geothermal"],
    correctIndex: 1 // Natural Gas
  },
  {
    id: 4,
    text: "A leaking tap wastes how much water/year?",
    options: ["100 Liters", "500 Liters", "None", "> 10,000 Liters"],
    correctIndex: 3 // > 10,000
  }
];

// ✅ USER LEVEL PROP RECEIVED
const BattleArena = ({ onWin, userLevel = 1 }) => {
  
  // --- CALCULATE PLAYER MAX HP ---
  // Formula: Base 100 + (Level * 20).
  const MAX_HP = 100 + (userLevel * 20);

  // --- STATE ---
  const [gameState, setGameState] = useState('loading'); // loading, battle, victory, gameover
  const [loadProgress, setLoadProgress] = useState(0);
  
  // Stats
  const [playerHealth, setPlayerHealth] = useState(MAX_HP); // Initial HP based on Level
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [currentRound, setCurrentRound] = useState(0); // Tracks which question (0-3)
  
  // Visuals
  const [battleLog, setBattleLog] = useState("A wild POLLUTION MONSTER appeared!");
  const [isFainting, setIsFainting] = useState(false);
  const [isShake, setIsShake] = useState(false); 

  // Refs
  const topRef = useRef(null);
  const botRef = useRef(null);
  const battleAudioRef = useRef(new Audio(battleMusicFile));

  // --- 1. INTRO SEQUENCE ---
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setGameState('battle'), 500); 
          return 100;
        }
        return prev + 5; 
      });
    }, 40);
  }, []);

  // --- 2. GSAP SHUTTERS & MUSIC ---
  useEffect(() => {
    if (gameState === 'battle') {
      const tl = gsap.timeline();
      tl.set([topRef.current, botRef.current], { y: 0 })
        .to(topRef.current, { y: '-100%', duration: 1.5, ease: 'power3.inOut', delay: 0.2 })
        .to(botRef.current, { y: '100%', duration: 1.5, ease: 'power3.inOut' }, "<");

      const audio = battleAudioRef.current;
      audio.currentTime = 0; 
      audio.volume = 0.3;    
      audio.loop = true;     
      audio.play().catch(e => console.log("Audio autoplay blocked"));
    } else {
      battleAudioRef.current.pause();
    }
    return () => battleAudioRef.current.pause();
  }, [gameState]);

  // --- 3. HANDLE ANSWER SELECTION ---
  const handleAnswer = (selectedIndex) => {
    if (gameState !== 'battle' || isFainting) return;

    const currentQ = BATTLE_QUESTIONS[currentRound];
    const isCorrect = selectedIndex === currentQ.correctIndex;

    if (isCorrect) {
      // --- CORRECT ANSWER ---
      // 4 Rounds to kill Gengar (100 HP / 4 = 25 Damage)
      const damage = 25; 
      setEnemyHealth(prev => Math.max(0, prev - damage));
      setBattleLog("Correct! Used KNOWLEDGE BEAM! It's Super Effective!");

      // Check if this was the last round
      if (currentRound >= BATTLE_QUESTIONS.length - 1) {
         handleWin();
      } else {
         // Move to next round after delay
         setTimeout(() => {
             setCurrentRound(prev => prev + 1);
             setBattleLog(`Next Question: ${BATTLE_QUESTIONS[currentRound + 1].text}`);
         }, 1500);
      }

    } else {
      // --- WRONG ANSWER ---
      const damage = 30; // Player takes damage
      setPlayerHealth(prev => Math.max(0, prev - damage));
      setBattleLog("Wrong! Gengar used TOXIC SLUDGE!");
      
      // Shake Effect
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);

      // Check Game Over
      if (playerHealth - damage <= 0) {
         setBattleLog("💀 You fainted! Study harder next time.");
         setGameState('gameover');
      }
    }
  };

  const handleWin = () => {
    setTimeout(() => {
      setIsFainting(true); 
      setBattleLog("Gengar fainted! The pollution is clearing!");
      
      setTimeout(() => {
         setGameState('victory');
         if(onWin) onWin(); 
      }, 2500);
    }, 1000);
  };

  // --- RENDER LOADING ---
  if (gameState === 'loading') {
    return (
      <div className="battle-loading">
        <h1>LOADING ENCOUNTER...</h1>
        <div className="loader-bar">
           <div className="loader-fill" style={{ width: `${loadProgress}%` }}></div>
        </div>
      </div>
    );
  }

  // --- RENDER BATTLE ---
  return (
    <div className={`battle-arena ${isShake ? 'shake-screen' : ''}`}>
      <div className="shutter top" ref={topRef}></div>
      <div className="shutter bottom" ref={botRef}></div>

      {/* ENEMY HUD */}
      <div className="battle-hud enemy-hud">
         <div className="hud-info">
            <span className="hud-name">GENGAR</span>
            <span className="hud-lvl">Lv.50</span>
         </div>
         <div className="hp-bar-container">
            <div className="hp-label">HP</div>
            <div className="hp-track">
                <div 
                  className={`hp-fill ${enemyHealth < 30 ? 'critical' : ''}`} 
                  style={{ width: `${enemyHealth}%` }}
                ></div>
            </div>
         </div>
      </div>

      {/* MONSTER STAGE */}
      <div className="monster-stage">
        {gameState !== 'victory' && (
           <img 
             src={gengarGif} 
             alt="Gengar" 
             className={`villain-img ${isFainting ? 'fainting-anim' : ''}`} 
           />
        )}
      </div>

      {/* PLAYER HUD */}
      <div className="battle-hud player-hud" style={{top: 'auto', bottom: '200px', left: 'auto', right: '40px'}}>
         <div className="hud-info">
            <span className="hud-name">PLAYER</span>
            {/* Show Real User Level */}
            <span className="hud-lvl">Lv.{userLevel}</span>
         </div>
         <div className="hp-bar-container">
            <div className="hp-label">HP</div>
            <div className="hp-track">
                <div 
                  className={`hp-fill ${playerHealth < (MAX_HP * 0.3) ? 'critical' : ''}`} 
                  // Calculate Width based on Max HP
                  style={{ width: `${(playerHealth / MAX_HP) * 100}%`, background: '#3b82f6' }}
                ></div>
            </div>
         </div>
         {/* Show Real Stats */}
         <div style={{textAlign:'right', fontSize:'0.5rem', marginTop:'5px'}}>
            {playerHealth}/{MAX_HP}
         </div>
      </div>

      {/* BATTLE UI */}
      <div className="battle-ui">
        {gameState === 'victory' ? (
          // --- VICTORY SCREEN ---
          <div className="victory-container" style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
             <img 
               src={victoryImg} 
               alt="Defeated" 
               style={{ height:'140px', border:'4px solid #fff', borderRadius:'10px' }} 
             />
             <div style={{marginLeft:'20px', textAlign:'left'}}>
                <h3 style={{color:'#4caf50', marginBottom:'10px'}}>VICTORY!</h3>
                <p style={{fontSize:'0.6rem'}}>Knowledge saves the planet.</p>
                <p style={{fontSize:'0.6rem', color:'#ffcb05'}}>+100 XP Gained.</p>
             </div>
          </div>
        ) : gameState === 'gameover' ? (
           // --- GAME OVER SCREEN ---
           <div style={{width:'100%', textAlign:'center', color:'red'}}>
              <h2>GAME OVER</h2>
              <p>Try refreshing to fight again.</p>
           </div>
        ) : (
          // --- QUIZ UI ---
          <>
            <div className="dialog-box">
              <p className="typing-effect">
                 {/* Show Question or Log */}
                 {battleLog.includes("wild") || battleLog.includes("Correct") || battleLog.includes("Wrong") 
                   ? battleLog 
                   : `Q${currentRound + 1}: ${BATTLE_QUESTIONS[currentRound].text}`}
              </p>
            </div>
            
            <div className="action-box">
              {/* MAP 4 OPTIONS BUTTONS */}
              {BATTLE_QUESTIONS[currentRound].options.map((option, index) => (
                <button 
                  key={index}
                  className="battle-btn" 
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BattleArena;