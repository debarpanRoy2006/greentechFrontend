import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; 

const Login = ({ isOpen, onClose, onLogin, switchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
        const response = await axios.post('http://127.0.0.1:8000/api/trainer-auth/', {
            username: username,
            password: password
        });

        if (response.data.status === 'success') {
            onLogin(response.data.username);
            onClose();
        }
    } catch (err) {
        console.error("Login Failed", err);
        setError("Invalid Username or Password");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="game-cartridge-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✖</button>

        <div className="modal-header">
           <div className="pixel-sprite bouncing">👾</div>
           <h2 className="pixel-title">IDENTIFY YOURSELF</h2>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
           <div className="pixel-input-group">
              <label>TRAINER ID (USERNAME)</label>
              <input 
                type="text" 
                placeholder="AshKetchum"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
              />
           </div>

           <div className="pixel-input-group">
              <label>PASSCODE</label>
              <input 
                type="password" 
                placeholder="******"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
           </div>

           {error && <p style={{color: '#ff5f5f', fontSize: '0.6rem', marginBottom: '10px'}}>{error}</p>}

           <button type="submit" className="start-btn" disabled={isLoading}>
              {isLoading ? "CONNECTING..." : "PRESS START ►"}
           </button>
        </form>

        <div className="cheat-code" onClick={switchToRegister} style={{marginTop: '20px', color: '#fbbf24', textShadow: '0 0 5px #fbbf24'}}>
           NEW RECRUIT? [ REGISTER HERE ]
        </div>
      </div>
    </div>
  );
};

export default Login;