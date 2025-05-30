import React from 'react';
import './CountySheet.css';

const CountySheet = ({ county, onClose, loading }) => {
if (!county) return null;

  function degToCompass(num) {
    if (num == null || isNaN(num)) return "N/A";
    const dirs = ["N","NE","E","SE","S","SW","W","NW"];
    const ix = Math.round(num / 45) % 8;
    return dirs[ix];
  }

  return (
    <div className="sheet-overlay">
      <div className="sheet">
        <div className="sheet-handle" />
        <button className="sheet-close" onClick={onClose}>×</button>
            <h2>{county.countyName}</h2>
            <p className={`risk-label ${county.riskLevel}`}>{county.riskLevel?.toUpperCase()}</p>
  
            <div className="stat-grid">
              <div className="stat-card">
                <h5>Air Quality</h5>
                <p className="stat-value">{county.aqi?.index} <span className="stat-sub">({county.aqi?.label})</span></p>
              </div>
  
              <div className="stat-card">
                <h5>Humidity</h5>
                <p className="stat-value">{Math.round(county.weather?.humidity)}%</p>
                <p className="stat-sub">Dew point: {Math.round(county.weather?.dewPoint)}°</p>
              </div>
  
              <div className="stat-card">
                <h5>Wind</h5>
                <p className="stat-value">{Math.round(county.weather?.windSpeed)} mph</p>
                <p className="stat-sub">
                  Gusts: {Math.round(county.weather?.windGust)} mph<br />
                  Direction: {degToCompass(county.weather?.windDir)} ({Math.round(county.weather?.windDir)}°)
                </p>
              </div>
            </div>
      </div>
    </div>
  );
};

export default CountySheet;