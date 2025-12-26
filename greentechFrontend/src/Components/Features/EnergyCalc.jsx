import React, { useState } from 'react';
import axios from 'axios';
import './FeatureStyles.css';

const EnergyCalc = () => {
  // Input State
  const [name, setName] = useState('');
  const [watts, setWatts] = useState('');
  const [hours, setHours] = useState('');
  
  // List State
  const [appliances, setAppliances] = useState([]);
  const [result, setResult] = useState(null);

  const addAppliance = () => {
    if (!name || !watts || !hours) return;
    const newItem = { name, watts: parseFloat(watts), hours: parseFloat(hours) };
    setAppliances([...appliances, newItem]);
    
    // Reset inputs
    setName('');
    setWatts('');
    setHours('');
  };

  const handleCalculateTotal = async () => {
    if (appliances.length === 0) return;

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/calc-energy/', {
        appliances: appliances
      });
      setResult(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="feature-card energy-card">
      <h3 className="feature-title">HOME ENERGY AUDIT</h3>
      
      {/* Input Section */}
      <div className="calc-inputs">
        <input 
          placeholder="Device Name (e.g., Fan)" 
          value={name} onChange={(e) => setName(e.target.value)} 
          className="retro-input"
        />
        <div className="flex gap-2">
          <input 
            type="number" placeholder="Watts" 
            value={watts} onChange={(e) => setWatts(e.target.value)} 
            className="retro-input"
          />
          <input 
            type="number" placeholder="Hours" 
            value={hours} onChange={(e) => setHours(e.target.value)} 
            className="retro-input"
          />
        </div>
        <button className="action-btn secondary" onClick={addAppliance} style={{marginBottom:'10px'}}>
          + ADD DEVICE
        </button>
      </div>

      {/* List Section */}
      {appliances.length > 0 && (
        <div className="appliance-list">
          {appliances.map((item, index) => (
            <div key={index} className="list-item">
              <span>{item.name}</span>
              <span className="mono">{item.watts}W x {item.hours}h</span>
            </div>
          ))}
        </div>
      )}

      <button className="action-btn warning" onClick={handleCalculateTotal}>
        CALCULATE TOTAL BILL
      </button>

      {result && (
        <div className="optimization-result">
          <div className="cost-display">TOTAL: {result.total_cost}</div>
          <p className="opt-tip">💡 {result.tip}</p>
          <div className="text-xs mt-2 text-left">
             {result.breakdown.map((line, i) => <div key={i}>{line}</div>)}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergyCalc;