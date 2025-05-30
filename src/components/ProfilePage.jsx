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
    <div class="profile">
    <div class="profile-inner">
      <div class="extinguisher-parent">
        <img class="extinguisher-icon" alt="" src="Extinguisher.svg" />
        <div class="iresource">ireSource</div>
      </div>
    </div>
 
 
    <div class="fire-extinguisher"></div>
    <div class="fireman-coat"></div>
    <div class="profile-child"></div>
 
 
 
 
    <img class="vector-icon" alt="" src="Vector.svg" />
    <img class="vector-icon1" alt="" src="Vector.svg" />
    <img class="vector-icon2" alt="" src="Vector.svg" />
    <img class="vector-icon3" alt="" src="Vector.svg" />
    <img class="vector-icon4" alt="" src="Vector.svg" />
    <img class="vector-icon5" alt="" src="Vector.svg" />
    <img class="vector-icon6" alt="" src="Vector.svg" />
    <img class="vector-icon7" alt="" src="Vector.svg" />
    <img class="vector-icon8" alt="" src="Vector.svg" />
    <img class="vector-icon9" alt="" src="Vector.svg" />
    <img class="vector-icon10" alt="" src="Vector.svg" />
 
 
    <img class="tempimagei4iayb-1-icon" alt="" src="tempImagei4Iayb 1.png" />
 
 
   
    <div class="statusbar">
      <div class="left-side">
        <div class="statusbar-time">
          <div class="time">9:41</div>
        </div>
      </div>
 
 
      <div class="dynamic-island">
        <div class="statusbar-dynamicisland">
          <div class="truedepth-camera"></div>
          <div class="facetime-camera"></div>
        </div>
      </div>
 
 
      <div class="right-side">
        <div class="signal-wifi-battery">
          <img class="icon-mobile-signal" alt="" src="Icon / Mobile Signal.svg" />
          <img class="wifi-icon" alt="" src="Wifi.svg" />
          <div class="statusbar-battery">
            <img class="outline-icon" alt="" src="Outline.svg" />
            <img class="battery-end-icon" alt="" src="Battery End.svg" />
            <img class="fill-icon" alt="" src="Fill.svg" />
          </div>
        </div>
      </div>
    </div>
 
 
 
 
    <div class="headline">
      <div class="settings">Settings</div>
    </div>
 
 
     <div class="frame-parent">
      <div class="frame-group">
        <div class="avatar-parent">
          <div class="avatar">
            <img class="avatar-child" alt="" src="Ellipse 9.png" />
          </div>
          <div class="charlie-becket-parent">
            <div class="charlie-becket">Charlie Becket</div>
            <div class="show-profile">Show profile</div>
          </div>
        </div>
        <img class="chevron-right-icon" alt="" src="chevron-right.svg" />
      </div>
      <div class="frame-child"></div>
    </div>
 
 
     <div class="frame-container">
  
      <div class="frame-div">
        <div class="frame-parent1">
          <div class="iconoutlineuser-parent">
            <img class="iconoutlineuser" alt="" src="Icon/Outline/User.svg" />
            <div class="personal-information">Personal information</div>
          </div>
          <img class="chevron-right-icon" alt="" src="chevron-right.svg" />
        </div>
        <div class="frame-child"></div>
      </div>
 
 
      <div class="frame-div">
        <div class="frame-parent1">
          <div class="iconoutlineuser-parent">
            <img class="chevron-right-icon" alt="" src="Icon/Outline/Lock.svg" />
            <div class="personal-information">Login & security</div>
          </div>
          <img class="chevron-right-icon" alt="" src="chevron-right.svg" />
        </div>
        <div class="frame-child"></div>
      </div>
 
 
      <div class="frame-div">
        <div class="frame-parent1">
          <div class="iconoutlineuser-parent">
            <img class="iconoutlineuser" alt="" src="Icon/Outline/Bell.svg" />
            <div class="personal-information">Notifications</div>
          </div>
          <img class="chevron-right-icon" alt="" src="chevron-right.svg" />
        </div>
        <div class="frame-child"></div>
      </div>
 
 
      <div class="frame-div">
        <div class="frame-parent1">
          <div class="iconoutlineuser-parent">
            <img class="chevron-right-icon" alt="" src="Icon/Outline/Location.svg" />
            <div class="personal-information">Privacy & sharing</div>
          </div>
          <img class="chevron-right-icon" alt="" src="chevron-right.svg" />
        </div>
        <div class="frame-child"></div>
      </div>
 
 
      <div class="frame-div">
        <div class="frame-parent1">
          <div class="iconoutlineuser-parent">
            <img class="iconoutlineuser" alt="" src="Icon/Outline/Door.svg" />
            <div class="personal-information">Log out</div>
          </div>
          <img class="chevron-right-icon" alt="" src="chevron-right.svg" />
        </div>
        <div class="frame-child"></div>
      </div>
    </div>
  </div>
  );
 };
 
 
 export default Profile;
 