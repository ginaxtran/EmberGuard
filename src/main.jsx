import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './style.css';

import App from './components/App.jsx';
import HousingDashboard from './components/HousingDashboard.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<HousingDashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
