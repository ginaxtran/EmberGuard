import {
  BellIcon,
  ChevronRightIcon,
  LockIcon,
  LogOutIcon,
  MapIcon,
  MapPinIcon,
  UserIcon,
 } from "lucide-react";
 import React from "react";
 
 
 
 
 // Navigation items data
 const navigationItems = [
  {
    id: 1,
    label: "Alerts",
    icon: <BellIcon className="w-6 h-6" />,
    isActive: true,
  },
  {
    id: 2,
    label: "Prepare",
    icon: (
      <img
        className="w-[19px] h-[19px]"
        alt="Prepare icon"
        src="https://c.animaapp.com/mb9wldk1n5qqZL/img/group.png"
      />
    ),
    isActive: false,
  },
  {
    id: 3,
    label: "Map",
    icon: <MapIcon className="w-6 h-6" />,
    isActive: false,
  },
  {
    id: 4,
    label: "Profile",
    icon: <UserIcon className="w-6 h-6" />,
    isActive: false,
  }
 ];
 
 
 // Settings items data
 const settingsItems = [
  {
    id: 1,
    label: "Personal information",
    icon: <UserIcon className="w-6 h-6" />,
  },
  { id: 2, label: "Login & security", icon: <LockIcon className="w-6 h-6" /> },
  { id: 3, label: "Notifications", icon: <BellIcon className="w-6 h-6" /> },
  {
    id: 4,
    label: "Privacy & sharing",
    icon: <MapPinIcon className="w-6 h-6" />,
  },
  { id: 5, label: "Log out", icon: <LogOutIcon className="w-6 h-6" /> },
 ];
 
 
 export const Profile = () => {
  return (
    <div className="profile-page">
  <div className="profile-header">
    <img src="/avatar-placeholder.png" alt="Profile" className="profile-avatar" />
    <div className="profile-info">
      <div className="name">Charlie Becket</div>
      <div className="view-profile">View profile</div>
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

    <div className="profile-item">
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
</div>

  );
 };
 
 
 export default Profile;
 