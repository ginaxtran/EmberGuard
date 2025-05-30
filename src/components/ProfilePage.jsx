import React, { useState, useEffect } from "react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  LockIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";

const Profile = () => {
  const [subpage, setSubpage] = useState("main");
  const [locationEnabled, setLocationEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("locationEnabled");
    setLocationEnabled(saved !== "false");
  }, []);

  const toggleLocation = () => {
    const newValue = !locationEnabled;
    setLocationEnabled(newValue);
    localStorage.setItem("locationEnabled", newValue);
  };

  return (
    <div className="profile-page">
      {subpage === "main" && (
        <>
          <div className="profile-header">
            <img
              src="/profilepic.png"
              alt="Profile"
              className="profile-avatar"
            />
            <div className="profile-info">
              <div className="name">Guest User</div>
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-item">
              <div className="label">
                <UserIcon />
                <span>Personal Information</span>
              </div>
              <ChevronRightIcon />
            </div>

            <div className="profile-item" onClick={() => setSubpage("password")}>
              <div className="label">
                <LockIcon />
                <span>Password & Security</span>
              </div>
              <ChevronRightIcon />
            </div>

            <div className="profile-item">
              <div className="label">
                <LogOutIcon />
                <span>Log Out</span>
              </div>
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
              Password & Security
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
        </div>
      )}
    </div>
  );
};

export default Profile;
