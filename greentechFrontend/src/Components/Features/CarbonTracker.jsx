import React, { useState } from 'react';
import axios from 'axios';
import './FeatureStyles.css';

const CarbonTracker = () => {
  const [mode, setMode] = useState('walking');
  const [distance, setDistance] = useState(5); // Default 5km
  const [result, setResult] = useState(null);

  const calculateFootprint = async () => {
    try {
      // Send data to Django
      const response = await axios.post('http://127.0.0.1:8000/api/log-transport/', {
        mode: mode,
        distance: distance
      });

      // Django responds with { saved_amount, message }
      const amount = parseFloat(response.data.saved_amount);
      
      setResult({
        type: amount > 0 ? 'SAVED' : 'EMITTED',
        amount: `${Math.abs(amount)} kg`,
        message: response.data.message
      });

    } catch (error) {
      console.error("Error logging transport", error);
    }
  };

  return (
    <div className="feature-card carbon-card">
      <h3 className="feature-title">CARBON TRACKER</h3>
      
      <div className="input-group">
        <label>Transport Mode:</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)} className="retro-input">
          <option value="walking">🏃 Walking</option>
          <option value="cycling">🚲 Cycling</option>
          <option value="bus">🚌 Public Bus</option>
          <option value="car">🚗 Private Car</option>
        </select>
        
        {/* Added Distance Input */}
        <label style={{marginTop: '10px', display:'block'}}>Distance (km):</label>
        <input 
          type="number" 
          value={distance} 
          onChange={(e) => setDistance(e.target.value)}
          className="retro-input"
        />
      </div>

      <button className="action-btn secondary" onClick={calculateFootprint}>
        CALCULATE IMPACT
      </button>

      {result && (
        <div className={`result-box ${result.type === 'EMITTED' ? 'wasted' : 'saved'}`}>
          <span className="result-big">{result.type}: {result.amount} CO2</span>
          <p className="result-msg">{result.message}</p>
        </div>
      )}
    </div>
  );
};

export default CarbonTracker;