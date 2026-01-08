import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('user_email') || "");

  // --- FETCH DATA ---
  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // Replace with your actual Django API Endpoint
      // const response = await axios.get('http://127.0.0.1:8000/api/leaderboard/');
      // setLeaders(response.data);
      
      // --- MOCK DATA (Remove this when backend is ready) ---
      setTimeout(() => {
        setLeaders([
            { rank: 1, username: "Ash_Ketchum", xp: 12500, avatar: "🧢" },
            { rank: 2, username: "Misty_Water", xp: 11200, avatar: "💧" },
            { rank: 3, username: "Brock_Rock", xp: 10500, avatar: "🪨" },
            { rank: 4, username: "Gary_Oak", xp: 9800, avatar: "🛡️" },
            { rank: 5, username: "Team_Rocket", xp: 500, avatar: "🚀" },
            // Add current user for demo
            { rank: 42, username: currentUser || "You", xp: 100, avatar: "👤" }
        ]);
        setLoading(false);
      }, 800);

    } catch (error) {
      console.error("Leaderboard fetch failed", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      
      {/* HEADER */}
      <div className="leaderboard-header">
        <h1 className="pixel-title">GLOBAL RANKINGS</h1>
        <button className="refresh-btn" onClick={fetchLeaderboard} disabled={loading}>
          {loading ? "SYNCING..." : "↻ REFRESH"}
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="leaderboard-card">
        
        {/* Table Head */}
        <div className="row header-row">
          <span className="col-rank">#</span>
          <span className="col-user">TRAINER</span>
          <span className="col-xp">XP</span>
        </div>

        {/* Loading State */}
        {loading && <div className="loading-text">DOWNLOADING DATA...</div>}

        {/* List of Users */}
        {!loading && leaders.map((user) => (
          <div 
            key={user.rank} 
            className={`row user-row ${user.username === currentUser ? 'highlight-me' : ''}`}
          >
            {/* RANK COLUMN */}
            <div className="col-rank">
              {user.rank === 1 ? <span className="medal gold">🥇</span> :
               user.rank === 2 ? <span className="medal silver">🥈</span> :
               user.rank === 3 ? <span className="medal bronze">🥉</span> :
               <span className="rank-num">{user.rank}</span>}
            </div>

            {/* USER COLUMN */}
            <div className="col-user">
              <span className="avatar">{user.avatar}</span>
              <span className="name">{user.username}</span>
              {user.rank <= 3 && <span className="crown-icon">👑</span>}
            </div>

            {/* XP COLUMN */}
            <div className="col-xp">
              {user.xp.toLocaleString()} <span className="xp-label">XP</span>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {!loading && leaders.length === 0 && (
           <div className="empty-state">NO DATA FOUND IN SECTOR 7</div>
        )}

      </div>
    </div>
  );
};

export default Leaderboard;