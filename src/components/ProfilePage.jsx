import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  LockIcon,
  LogOutIcon,
  LogInIcon,
  UserIcon,
} from "lucide-react";
import AuthService from "../utils/auth";

const Profile = () => {
  const [subpage, setSubpage] = useState("main");
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [user, setUser] = useState(null);
  const [userMode, setUserMode] = useState('guest');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("locationEnabled");
    setLocationEnabled(saved !== "false");

    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuth = AuthService.isAuthenticated();
      const storedUser = AuthService.getStoredUser();
      const mode = AuthService.getUserMode();
      
      console.log('🔍 Profile: Checking auth status...');
      console.log('🔍 Is authenticated:', isAuth);
      console.log('🔍 User mode:', mode);
      
      if (isAuth && storedUser) {
        setUser(storedUser);
        setUserMode('authenticated');
        
        try {
          const currentUser = await AuthService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        } catch (error) {
        }
      } else {
        setUser(null);
        setUserMode('guest');
      }
    } catch (error) {
      setUser(null);
      setUserMode('guest');
    }
  };

  const toggleLocation = () => {
    const newValue = !locationEnabled;
    setLocationEnabled(newValue);
    localStorage.setItem("locationEnabled", newValue);
  };

  const handleAuthAction = async () => {
    if (userMode === 'guest') {
      navigate('/');
    } else {
      setIsLoading(true);
      try {
        console.log('🔄 Logging out...');
        await AuthService.logout();
        
        setUser(null);
        setUserMode('guest');
        
        navigate('/');
        
      } catch (error) {
        console.error('Logout error:', error);
        setUser(null);
        setUserMode('guest');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const displayName = user ? (user.fullName || `${user.firstName} ${user.lastName}`) : 'Guest User';
  const displayEmail = user ? user.email : null;

  return (
    <div className="profile-page">
      {subpage === "main" && (
        <>
          <div className="profile-header">
            <img
              src={user?.profilePicture || "/profilepic.png"}
              alt="Profile"
              className="profile-avatar"
            />
            <div className="profile-info">
              <div className="name">{displayName}</div>
              {displayEmail && (
                <div className="text-muted small mt-1">{displayEmail}</div>
              )}
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-item" onClick={() => setSubpage("password")}>
              <div className="label">
                <LockIcon />
                <span>Password & Privacy</span>
              </div>
              <ChevronRightIcon />
            </div>

            <div 
              className="profile-item" 
              onClick={handleAuthAction}
              style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
              <div className="label">
                {userMode === 'guest' ? <LogInIcon /> : <LogOutIcon />}
                <span>
                  {isLoading ? (
                    userMode === 'guest' ? 'Redirecting...' : 'Logging out...'
                  ) : (
                    userMode === 'guest' ? 'Sign In' : 'Log Out'
                  )}
                </span>
              </div>
              {isLoading && (
                <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div>
              )}
            </div>
          </div>
        </>
      )}

      {subpage === "password" && (
        <div className="px-4">
          <div className="mb-10 flex items-center gap-2">
            <ChevronLeftIcon
              className="w-6 h-6 text-brand cursor-pointer"
              onClick={() => setSubpage("main")}
            />
            <h2 className="text-xl font-semibold text-brand ml-1 mt-4">
              Password & Privacy
            </h2>
          </div>

          <div className="profile-item">
            <div className="label">
              <span>Allow Location Access</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-auto">
              <input
                type="checkbox"
                checked={locationEnabled}
                onChange={toggleLocation}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          {userMode === 'authenticated' && (
            <div className="mt-4 p-3 bg-light rounded">
              <h6>Account Security</h6>
              <p className="small text-muted mb-2">
                Your account is secured with email/password authentication.
              </p>
              <button className="btn btn-sm btn-outline-primary">
                Change Password (Currently Not Working)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;