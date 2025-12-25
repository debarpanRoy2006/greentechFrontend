import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './BattleArena.css';

// --- IMPORTS ---
import battleMusicFile from '../../assets/sounds/battle-theme.mp3'; 
import gengarGif from '../../assets/images/gengar.gif';
import thunderGif from '../../assets/images/thundershock.gif';
import tailGif from '../../assets/images/tailattack.gif';

const BattleArena = ({ onWin }) => {
  // Game States
  const [gameState, setGameState] = useState('idle'); // idle, loading, battle, victory
  const [loadProgress, setLoadProgress] = useState(0);
  const [monsterHp, setMonsterHp] = useState(100);
  const [battleLog, setBattleLog] = useState("A wild GENGAR appeared!");
  const [attackAnim, setAttackAnim] = useState('none'); // 'none', 'thunder', 'tail'

  // Refs
  const topRef = useRef(null);
  const botRef = useRef(null);
  const battleAudioRef = useRef(new Audio(battleMusicFile));

  // --- 1. START LOADING SEQUENCE ---
  const startEncounter = () => {
    setGameState('loading');
    setLoadProgress(0);
    // Simulate loading bar
    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setGameState('battle'), 500); 
          return 100;
        }
        return prev + 2; 
      });
    }, 50);
  };

  // --- 2. HANDLE ANIMATIONS & MUSIC ---
  useEffect(() => {
    // A. Shutter Animation
    if (gameState === 'battle') {
      const tl = gsap.timeline();
      tl.set([topRef.current, botRef.current], { y: 0 })
        .to(topRef.current, { y: '-100%', duration: 1.5, ease: 'power3.inOut', delay: 0.2 })
        .to(botRef.current, { y: '100%', duration: 1.5, ease: 'power3.inOut' }, "<");
    }

    // B. Music Control
    const audio = battleAudioRef.current;
    if (gameState === 'battle') {
      audio.currentTime = 0; 
      audio.volume = 0.5;    
      audio.loop = true;     
      audio.play().catch(e => console.log("Audio play failed:", e));
    } else if (gameState === 'victory' || gameState === 'idle') {
      audio.pause();         
      audio.currentTime = 0; 
    }
    return () => { audio.pause(); };
  }, [gameState]);

  // --- 3. BATTLE LOGIC ---
  const handleAttack = (isCorrect) => {
    if (isCorrect) {
      // WINNING MOVE: THUNDERSHOCK
      setAttackAnim('thunder');
      setBattleLog("Ash used THUNDERSHOCK! It's super effective!");

      // Delay victory so animation plays
      setTimeout(() => {
          setMonsterHp(0);
          setBattleLog("Gengar fainted! The pollution is clearing!");
          setAttackAnim('none'); 
          setTimeout(() => setGameState('victory'), 2000); 
      }, 1500); 

    } else {
      // WEAK MOVE: TAIL WHIP
      setAttackAnim('tail');
      setBattleLog("Ash used TAIL WHIP... It's not very effective.");
      setTimeout(() => setAttackAnim('none'), 1000);
    }
  };

  // --- RENDER: IDLE CARD (Dashboard View) ---
  if (gameState === 'idle') {
    return (
      <div className="battle-trigger-card" onClick={startEncounter}>
        <div className="trigger-icon">⚠️</div>
        <div className="trigger-text">
          <h3>BOSS BATTLE DETECTED</h3>
          <p>CLICK TO ENGAGE</p>
        </div>
      </div>
    );
  }

  // --- RENDER: FULL SCREEN ARENA ---
  return (
    <div className="battle-overlay">
      
      {/* Loading Screen */}
      {gameState === 'loading' && (
        <div className="battle-loading">
          <h1>LOADING ENCOUNTER...</h1>
          <div className="loader-bar">
            <div className="loader-fill" style={{ width: `${loadProgress}%` }}></div>
          </div>
        </div>
      )}

      {/* Main Battle */}
      {(gameState === 'battle' || gameState === 'victory') && (
        <div className="battle-arena">
          <div className="shutter top" ref={topRef}></div>
          <div className="shutter bottom" ref={botRef}></div>

          {/* Monster & Attacks */}
          <div className="monster-stage">
            <div className="monster-sprite">
              {gameState === 'victory' ? (
                <span style={{fontSize: '5rem'}}>✨🌞✨</span> 
              ) : (
                <img src={gengarGif} alt="Gengar" className="villain-img" />
              )}
            </div>

            {/* Attack VFX Layers */}
            {attackAnim === 'thunder' && <img src={thunderGif} alt="Thunder" className="attack-vfx thunder" />}
            {attackAnim === 'tail' && <img src={tailGif} alt="Tail" className="attack-vfx tail" />}

            {/* HP Bar */}
            {gameState !== 'victory' && (
              <div className="hp-container">
                <div className="hp-fill" style={{ width: `${monsterHp}%` }}></div>
              </div>
            )}
          </div>

          {/* Battle UI / Dialog */}
          <div className="battle-ui">
            <div className="dialog-box">
              <p>{battleLog}</p>
            </div>
            
            <div className="action-box">
              {gameState === 'battle' ? (
                <>
                  <button className="battle-btn" onClick={() => handleAttack(false)}>TAIL WHIP (Throw Trash)</button>
                  <button className="battle-btn primary-atk" onClick={() => handleAttack(true)}>THUNDERSHOCK (Recycle)</button>
                </>
              ) : (
                <button className="battle-btn" onClick={() => { 
                  if(onWin) onWin(); 
                  setGameState('idle'); 
                }}>
                  COLLECT REWARD
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleArena;