import React, { useState } from 'react';
import axios from 'axios';
import '../Login/Login.css'; // Ensure this path is correct for your folder structure

// 1. UPDATED PROPS: Changed 'onRegisterSuccess' to 'onLogin' to match App.jsx
const Register = ({ isOpen, onClose, onLogin, switchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Send Data (Backend returns 201 Created)
      const response = await axios.post('http://127.0.0.1:8000/api/register/', {
        username: username,
        email: email,
        password: password
      });
      
      // 2. SUCCESS!
      console.log("Registration Response:", response.data);
      
      alert("Registration Successful! Welcome to the Corps.");
      
      // 3. CALL THE CORRECT FUNCTION
      // We check if onLogin exists before calling it to prevent crashes
      if (onLogin) {
          onLogin(username);
      }
      
      onClose();
      
    } catch (err) {
      console.error("Registration Error:", err);
      
      // 3. HANDLE ERRORS
      if(err.response && err.response.data) {
         // This handles backend errors (like "Username taken")
         const errorMsg = typeof err.response.data === 'object' 
            ? Object.values(err.response.data).flat().join(', ')
            : JSON.stringify(err.response.data);
            
         setError(errorMsg || "Registration Failed.");
      } else {
         // This handles Network errors OR code crashes (like the prop mismatch)
         setError("Registration Failed. Check connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="game-cartridge-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✖</button>

        <div className="modal-header">
           <div className="pixel-sprite bouncing">🆕</div>
           <h2 className="pixel-title">NEW RECRUIT</h2>
        </div>

        <form onSubmit={handleRegister} className="modal-form">
           <div className="pixel-input-group">
              <label>CODENAME (USER)</label>
              <input 
                type="text" 
                placeholder="EcoWarrior99"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
           </div>

           <div className="pixel-input-group">
              <label>EMAIL ID</label>
              <input 
                type="email" 
                placeholder="HERO@EARTH.COM"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
           </div>

           <div className="pixel-input-group">
              <label>PASSCODE</label>
              <input 
                type="password" 
                placeholder="******"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
           </div>

           {error && <p style={{color: '#ff5f5f', fontSize: '0.6rem', marginBottom: '10px'}}>{error}</p>}

           <button type="submit" className="start-btn" disabled={isLoading}>
              {isLoading ? "ENLISTING..." : "REGISTER ►"}
           </button>
        </form>

        <div className="cheat-code" onClick={switchToLogin} style={{marginTop: '15px'}}>
           ALREADY ENLISTED? [ LOGIN HERE ]
        </div>
      </div>
    </div>
  );
};

export default Register;