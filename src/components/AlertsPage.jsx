import React, { useState, useEffect } from 'react';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

    fetch(`${API_BASE}/api/alerts`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (!data || !Array.isArray(data.alerts)) throw new Error('Bad data format');
        setAlerts(data.alerts);
      })
      .catch(err => {
        console.error('❌ error fetching alerts:', err);
        setError(true);
      });
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = alerts.filter(alert =>
      alert.areaDesc.toLowerCase().includes(query) ||
      alert.headline.toLowerCase().includes(query) ||
      alert.event.toLowerCase().includes(query)
    );
    setFilteredAlerts(filtered);
  }, [searchQuery, alerts]);

  return (
    <div className="h-100 d-flex flex-column bg-white overflow-hidden">
      <div className="alerts-header px-4 pt-5 pb-3">
        <h1 className="alerts-title mb-4 fw-bold text-brand" style={{ fontSize: '2rem' }}>Alerts</h1>

        <div className="d-flex gap-3 align-items-center">
          <div className="search-input-wrapper flex-grow-1 position-relative">
            <svg className="search-icon position-absolute" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, color: '#9ca3af' }}>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
            </svg>
            <input
              type="text"
              placeholder="Search alerts by county, event, or keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control form-control-lg search-input-with-icon custom-focus"
            />
          </div>
        </div>
      </div>

      <div className="flex-grow-1 overflow-auto px-4 pb-5">
        {error ? (
          <div className="text-center text-danger mt-5">
            <p>Failed to load alerts. Please try again later.</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="d-flex justify-content-center mt-5">
            <p className="fs-5 text-muted">No current alerts for that location.</p>
          </div>
        ) : (
          filteredAlerts.map((alert, idx) => (
            <div key={idx} className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h4 className="fw-bold mb-2">{alert.headline}</h4>
                <p className="text-muted mb-2" style={{ fontSize: '0.95rem' }}>
                  Affected areas: {alert.areaDesc}
                </p>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                  {alert.description}
                </p>
                {alert.instruction && (
                  <p className="mt-3" style={{ fontSize: '0.9rem' }}>
                    <strong>Instruction:</strong> {alert.instruction}
                  </p>
                )}
                <p className="text-muted mt-3" style={{ fontSize: '0.85rem' }}>
                  Issued: {new Date(alert.effective).toLocaleString()} | Expires: {new Date(alert.expires).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
