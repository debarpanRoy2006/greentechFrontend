import React, { useState, useEffect } from 'react';
import './FeatureStyles.css'; // We will create one CSS file for all features

const AqiWidget = () => {
  // Mock data for now (Replace with your Django fetch later!)
  const [aqiData, setAqiData] = useState({ city: "Guwahati", aqi: 145, status: "Moderate" });

  // Helper to pick color based on AQI
  const getStatusColor = (aqi) => {
    if (aqi <= 50) return "good";     // Green
    if (aqi <= 100) return "moderate"; // Yellow
    if (aqi <= 200) return "unhealthy"; // Orange
    return "hazardous";               // Red
  };

  return (
    <div className={`feature-card aqi-card ${getStatusColor(aqiData.aqi)}`}>
      <h3 className="feature-title">AIR QUALITY SCANNER</h3>
      
      <div className="aqi-display">
        <div className="aqi-circle">
          <span className="aqi-number">{aqiData.aqi}</span>
        </div>
        <div className="aqi-info">
          <span className="aqi-city">{aqiData.city}</span>
          <span className="aqi-status">{aqiData.status.toUpperCase()}</span>
        </div>
      </div>
      
      <p className="aqi-tip">
        {aqiData.aqi > 100 ? "⚠️ Wear a mask outside!" : "✅ Air is clean."}
      </p>
    </div>
  );
};

export default AqiWidget;