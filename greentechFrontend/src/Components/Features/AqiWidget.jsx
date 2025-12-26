import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FeatureStyles.css';

const AqiWidget = () => {
  const [aqiData, setAqiData] = useState({ city: "Locating...", aqi: 0, status: "Waiting..." });

  useEffect(() => {
    // 1. Get User Location from Browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchAqi(lat, lon);
        },
        (error) => {
          console.error("Location denied", error);
          fetchAqi(null, null); // Fallback to default
        }
      );
    } else {
      fetchAqi(null, null);
    }
  }, []);

  const fetchAqi = (lat, lon) => {
    let url = 'http://127.0.0.1:8000/api/aqi/';
    if (lat && lon) {
      url += `?lat=${lat}&lon=${lon}`;
    }

    axios.get(url)
      .then(res => setAqiData(res.data))
      .catch(err => setAqiData({ city: "Error", aqi: 0, status: "Offline" }));
  };

  const getStatusColor = (aqi) => {
    if (aqi <= 50) return "good";
    if (aqi <= 100) return "moderate";
    if (aqi <= 200) return "unhealthy";
    return "hazardous";
  };

  return (
    <div className={`feature-card aqi-card ${getStatusColor(aqiData.aqi)}`}>
      <h3 className="feature-title">LIVE AIR SCANNER</h3>
      
      <div className="aqi-display">
        <div className="aqi-circle">
          <span className="aqi-number">{aqiData.aqi}</span>
        </div>
        <div className="aqi-info">
          <span className="aqi-city">{aqiData.city}</span>
          <span className="aqi-status">{aqiData.status}</span>
        </div>
      </div>
    </div>
  );
};

export default AqiWidget;