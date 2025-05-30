import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MapPage from './MapPage';
import AlertsPage from './AlertsPage';
import PreparePage from './PreparePage';
import ProfilePage from './ProfilePage';

const Dashboard = ({ userMode = 'guest' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePage, setActivePage] = useState('map');

  // Initialize active page from URL parameters or default to 'map'
  useEffect(() => {
    const pageFromUrl = searchParams.get('page') || 'map';
    setActivePage(pageFromUrl);
  }, [searchParams]);

  // Update URL when page changes
  const handlePageChange = (page) => {
    setActivePage(page);
    setSearchParams({ page });
  };

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'alerts':
        return <AlertsPage />;
      case 'prepare':
        return <PreparePage />;
      case 'map':
        return <MapPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <MapPage />;
    }
  };

  return (
    <div className="dashboard d-flex flex-column">
      <div className="flex-grow-1 overflow-auto">
        {renderCurrentPage()}
      </div>

      <nav className="bottom-navigation d-flex justify-content-around align-items-center">
        <button
          className={`nav-item d-flex flex-column align-items-center gap-1 ${activePage === 'alerts' ? 'active' : ''}`}
          onClick={() => handlePageChange('alerts')}
        >
          <img
            src="/navbell.png"
            alt="Alerts"
            style={{
              width: '24px',
              height: '24px',
              filter: activePage === 'alerts' ? 'brightness(0) saturate(100%) invert(69%) sepia(16%) saturate(1030%) hue-rotate(160deg) brightness(95%) contrast(88%)' : 'brightness(0) saturate(100%) invert(62%) sepia(8%) saturate(872%) hue-rotate(176deg) brightness(95%) contrast(86%)',
              transition: 'all 0.2s ease'
            }}
          />
          <span>Alerts</span>
        </button>

        <button
          className={`nav-item d-flex flex-column align-items-center gap-1 ${activePage === 'prepare' ? 'active' : ''}`}
          onClick={() => handlePageChange('prepare')}
        >
          <img
            src="/navprepare.png"
            alt="Prepare"
            style={{
              width: '24px',
              height: '24px',
              filter: activePage === 'prepare' ? 'brightness(0) saturate(100%) invert(69%) sepia(16%) saturate(1030%) hue-rotate(160deg) brightness(95%) contrast(88%)' : 'brightness(0) saturate(100%) invert(62%) sepia(8%) saturate(872%) hue-rotate(176deg) brightness(95%) contrast(86%)',
              transition: 'all 0.2s ease'
            }}
          />
          <span>Prepare</span>
        </button>

        <button
          className={`nav-item d-flex flex-column align-items-center gap-1 ${activePage === 'map' ? 'active' : ''}`}
          onClick={() => handlePageChange('map')}
        >
          <img
            src="/navmap.png"
            alt="Map"
            style={{
              width: '24px',
              height: '24px',
              filter: activePage === 'map' ? 'brightness(0) saturate(100%) invert(69%) sepia(16%) saturate(1030%) hue-rotate(160deg) brightness(95%) contrast(88%)' : 'brightness(0) saturate(100%) invert(62%) sepia(8%) saturate(872%) hue-rotate(176deg) brightness(95%) contrast(86%)',
              transition: 'all 0.2s ease'
            }}
          />
          <span>Map</span>
        </button>

        <button
          className={`nav-item d-flex flex-column align-items-center gap-1 ${activePage === 'profile' ? 'active' : ''}`}
          onClick={() => handlePageChange('profile')}
        >
          <img
            src="/navprofile.png"
            alt="Profile"
            style={{
              width: '24px',
              height: '24px',
              filter: activePage === 'profile' ? 'brightness(0) saturate(100%) invert(69%) sepia(16%) saturate(1030%) hue-rotate(160deg) brightness(95%) contrast(88%)' : 'brightness(0) saturate(100%) invert(62%) sepia(8%) saturate(872%) hue-rotate(176deg) brightness(95%) contrast(86%)',
              transition: 'all 0.2s ease'
            }}
          />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;