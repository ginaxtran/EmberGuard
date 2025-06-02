import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Onboarding from './components/Onboarding';
import './style.css';

import App from './components/App.jsx';
import Dashboard from './components/Dashboard.jsx';
import HousingDashboard from './components/HousingDashboard.jsx';

const CLIENT_ID = "412789806996-a98k10rkgae4005vr0hq7i6l2mgforhh.apps.googleusercontent.com"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/housing" element={<HousingDashboard />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);