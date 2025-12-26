import React, { useState, useEffect } from 'react';
import './BattleArena.css';

// Only importing Gengar now
import gengarSprite from '../../assets/images/gengar.gif';
// import pikachuSprite from '../../assets/images/pikachu.gif'; // REMOVED

const BattleArena = ({ onWin }) => {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [gameLog, setGameLog] = useState(["⚠️ A wild POLLUTION MONSTER appeared!"]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [battleOver, setBattleOver] = useState(false);

  // Simple AI turn
  useEffect(() => {
    if (!isPlayerTurn && !battleOver && enemyHealth > 0) {
      setTimeout(() => {
        const damage = Math.floor(Math.random() * 20) + 5;
        setPlayerHealth(prev => Math.max(0, prev - damage));
        addLog(`🔻 Enemy used TOXIC SLUDGE! You took ${damage} DMG.`);
        setIsPlayerTurn(true);
      }, 1500);
    }
  }, [isPlayerTurn, battleOver, enemyHealth]);

  // Check win/loss condition
  useEffect(() => {
    if (enemyHealth <= 0 && !battleOver) {
       setBattleOver(true);
       addLog("🏆 Enemy defeated! The air is clearing...");
       setTimeout(() => {
          if (onWin) onWin();
       }, 2000);
    } else if (playerHealth <= 0 && !battleOver) {
       setBattleOver(true);
       addLog("💀 You were overwhelmed by pollution...");
    }
  }, [enemyHealth, playerHealth, battleOver, onWin]);

  const addLog = (msg) => {
    setGameLog(prev => [msg, ...prev].slice(0, 5));
  };

  const handleAttack = (type) => {
    if (!isPlayerTurn || battleOver) return;

    let damage = 0;
    let moveName = "";

    switch(type) {
      case 'quick':
        damage = Math.floor(Math.random() * 15) + 10;
        moveName = "RECYCLE RUSH";
        break;
      case 'heavy':
        damage = Math.floor(Math.random() * 30) + 5;
        moveName = "SOLAR BEAM";
        break;
      case 'heal':
        const healAmount = 30;
        setPlayerHealth(prev => Math.min(100, prev + healAmount));
        addLog(`💚 Used PURIFY! Healed +${healAmount} HP.`);
        setIsPlayerTurn(false);
        return;
      default: break;
    }

    setEnemyHealth(prev => Math.max(0, prev - damage));
    addLog(`⚔️ Used ${moveName}! Dealt ${damage} DMG.`);
    setIsPlayerTurn(false);
  };

  return (
    <div className="battle-container">
      
      {/* --- THE BATTLE STAGE --- */}
      {/* Added justifyContent: 'center' to center Gengar */}
      <div className="battle-stage" style={{ justifyContent: 'center' }}>
        
        {/* PLAYER SPRITE REMOVED FROM HERE */}
        
        {/* ENEMY SIDE (Centered) */}
        <div className="enemy-spot animate-float">
           {/* Health Bar */}
           <div className="health-bar-container">
             <div className="health-label">POLLUTION MONSTER (GENGAR)</div>
             <div className="health-bar-bg">
                <div 
                  className="health-bar-fill enemy"
                  style={{width: `${enemyHealth}%`}}
                ></div>
             </div>
           </div>
           {/* Sprite */}
           <img src={gengarSprite} alt="Enemy" className="sprite enemy-sprite filter-corruption" />
        </div>

      </div>

      {/* --- UI & CONTROLS --- */}
      <div className="battle-ui">
         
         {/* Player Health Status (Kept UI, just removed sprite) */}
         <div className="player-status-box">
            <div className="health-label">PLAYER STATUS</div>
            <div className="health-bar-bg">
               <div 
                 className="health-bar-fill player"
                 style={{width: `${playerHealth}%`}}
               ></div>
            </div>
            <div className="health-text">{playerHealth} / 100 HP</div>
         </div>

         {/* Game Log */}
         <div className="game-log terminal-text">
           {gameLog.map((log, index) => (
             <p key={index}>{log}</p>
           ))}
         </div>

         {/* Action Menu */}
         <div className="battle-menu">
           <button 
             className="battle-btn attack" 
             onClick={() => handleAttack('quick')}
             disabled={!isPlayerTurn || battleOver}
           >
             RECYCLE RUSH (Quick)
           </button>
           <button 
             className="battle-btn heavy" 
             onClick={() => handleAttack('heavy')}
             disabled={!isPlayerTurn || battleOver}
           >
             SOLAR BEAM (Heavy)
           </button>
           <button 
             className="battle-btn heal" 
             onClick={() => handleAttack('heal')}
             disabled={!isPlayerTurn || battleOver}
           >
             PURIFY (+Heal)
           </button>
         </div>
      </div>
    </div>
  );
};

export default BattleArena;