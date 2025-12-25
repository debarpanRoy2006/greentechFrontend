import React, { useState } from 'react';
import './FeatureStyles.css';

const CarbonTracker = () => {
  const [mode, setMode] = useState('walking');
  const [result, setResult] = useState(null);

  // Connect this to your Django Backend!
  const calculateFootprint = () => {
    // Mock Logic (Replace with API Call)
    if (mode === 'walking' || mode === 'cycling') {
      setResult({ type: 'SAVED', amount: '2.5 kg', message: "Great job, Hero!" });
    } else {
      setResult({ type: 'WASTED', amount: '12 kg', message: "Try carpooling next time." });
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
      </div>

      <button className="action-btn secondary" onClick={calculateFootprint}>
        CALCULATE IMPACT
      </button>

      {result && (
        <div className={`result-box ${result.type.toLowerCase()}`}>
          <span className="result-big">{result.type}: {result.amount} CO2</span>
          <p className="result-msg">{result.message}</p>
        </div>
      )}
    </div>
  );
};

export default CarbonTracker;