import React, { useState } from 'react';
import './FeatureStyles.css';

const EnergyCalc = () => {
  const [watts, setWatts] = useState('');
  const [hours, setHours] = useState('');
  const [optimization, setOptimization] = useState(null);

  const handleCalculate = () => {
    // Replace with Django Logic
    const cost = (watts * hours * 0.001 * 8).toFixed(2); // Assuming 8rs/unit
    setOptimization({
      cost: `₹${cost}`,
      tip: watts > 1000 ? "High consumption! Try using this appliance during off-peak hours." : "Optimal usage detected."
    });
  };

  return (
    <div className="feature-card energy-card">
      <h3 className="feature-title">ENERGY OPTIMIZER</h3>
      
      <div className="calc-inputs">
        <input 
          type="number" 
          placeholder="Power (Watts)" 
          value={watts}
          onChange={(e) => setWatts(e.target.value)}
          className="retro-input"
        />
        <input 
          type="number" 
          placeholder="Hours Used" 
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="retro-input"
        />
      </div>

      <button className="action-btn warning" onClick={handleCalculate}>
        ANALYZE COST
      </button>

      {optimization && (
        <div className="optimization-result">
          <div className="cost-display">EST. COST: {optimization.cost}</div>
          <p className="opt-tip">💡 {optimization.tip}</p>
        </div>
      )}
    </div>
  );
};

export default EnergyCalc;