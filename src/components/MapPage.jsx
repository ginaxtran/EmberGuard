import React, { useState } from 'react';
import Map from './Map';
import CountySheet from './CountySheet';
import RiskLegend from './RiskLegend';


const MapPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [loadingCounty, setLoadingCounty] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  const handleSearch = async (query) => {
    if (!query) return;
  
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const results = await res.json();
      if (results.length > 0) {
        const { lat, lon } = results[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
  
        window.dispatchEvent(new CustomEvent("flyToLocation", {
          detail: { lat: latNum, lng: lonNum }
        }));
      }
    } catch (err) {
      console.error("Search failed", err);
    }
  };
  
  return (
    <div className="map-page d-flex flex-column position-relative">
        {loadingCounty && (
          <div className="loading-overlay">
            <div className="spinner-border text-brand" role="status" />
          </div>
        )}
      <div className="map-header">
        <div className="d-flex gap-3 align-items-center">
          <div className="search-input-wrapper flex-grow-1 position-relative">
            <svg className="search-icon position-absolute" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, color: '#9ca3af'}}>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              placeholder="Search by location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              className="form-control form-control-lg search-input-with-icon custom-focus"
            />
          </div>

        </div>
      </div>
      <div style={{ height: '100vh' }}>
        <Map 
        setSelectedCounty={setSelectedCounty}
        setLoadingCounty={setLoadingCounty}
         />
      </div>

      <CountySheet 
      county={selectedCounty} 
      onClose={() => setSelectedCounty(null)} 
      loading={loadingCounty} />
      {showLegend && <RiskLegend onClose={() => setShowLegend(false)} />}
      <button
        className="goto-float-btn"
        onClick={() => window.dispatchEvent(new Event("flyToUser"))}
        title="Go to My Location"
      >
        <img src="/goto.png" alt="Go to location" style={{ width: '45px', height: '45px' }} />
      </button>

      <button
            className="info-float-btn"
            onClick={() => setShowLegend(true)}
            title="Risk Level Info"
          >
           <img src="/info.png" alt="Info" style={{ width: '30px', height: '30px' }} />
      </button>
    </div>
  );
};

export default MapPage;