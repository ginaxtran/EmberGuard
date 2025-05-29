import React from 'react';

// Icon: Bell Outline
const IconOutlineBell = ({ className }) => (
  <svg className={className} fill="none" height="24" viewBox="0 0 24 24" width="24">
    <path
      d="M12 3.5C13.5913 3.5 15.1174 4.13214 16.2426 5.25736C17.3679 6.38258 18 7.9087 18 9.5C18 16.5 21 18.5 21 18.5H3C3 18.5 6 16.5 6 9.5C6 7.9087 6.63214 6.38258 7.75736 5.25736C8.88258 4.13214 10.4087 3.5 12 3.5ZM12 3.5V2.5"
      stroke="#717171" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
    />
    <path
      d="M14.5 19C14.3242 19.3031 14.1453 20.5686 12.9978 21.2295C12.6941 21.4044 12.3499 21.4965 11.9995 21.4965C11.6492 21.4965 11.3049 21.4044 11.0013 21.2295C10.1847 20.7592 9.67581 19.3031 9.5 19"
      stroke="#717171" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
    />
  </svg>
);

// Icon: Filled Map
const IconFilledMaps3 = ({ className }) => (
  <svg className={className} fill="none" height="24" viewBox="0 0 24 24" width="24">
    <path
      d="M21.9738 4.30635C21.9313 4.12123 21.851 3.94603 21.7377 3.79082C21.6243 3.63561 21.4802 3.50346 21.3135 3.40195C21.1468 3.29872 20.9603 3.22835 20.765 3.19493C20.5697 3.16151 20.3695 3.1657 20.1759 3.20726L15.2723 4.25611L8.73424 3L3.17688 4.18702C2.84302 4.25727 2.54423 4.43513 2.33015 4.69105C2.11607 4.94697 1.99957 5.26555 2.00003 5.59386V19.3796C1.99849 19.6225 2.0613 19.8618 2.18253 20.0749C2.30377 20.2881 2.47946 20.4681 2.69306 20.598C2.85981 20.7013 3.04624 20.7716 3.24153 20.8051C3.43683 20.8385 3.63709 20.8343 3.83069 20.7927L8.73424 19.7439L15.2723 21L20.8231 19.813C21.157 19.7427 21.4558 19.5649 21.6699 19.3089C21.884 19.053 22.0005 18.7345 22 18.4061V4.62038C21.9989 4.51464 21.9858 4.40933 21.9608 4.30635H21.9738ZM9.71496 18.268L8.72771 18.0796L7.75353 18.2805V4.87788L8.74078 4.67062L9.71496 4.85904V18.2617V18.268ZM16.253 19.1221L15.2658 19.3294L14.2916 19.141V5.73203L15.2789 5.92045L16.253 5.71947H16.2596V19.1221H16.253Z"
      fill="#0A0A0A"
    />
  </svg>
);

// TabBar component
const TabBar = ({ selection }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-around py-2 bg-white shadow-inner">
        {/* Alerts */}
        <div className="flex flex-col items-center">
          <IconOutlineBell className="w-6 h-6" />
          <span className={`text-xs mt-1 ${selection === "alerts" ? "font-bold text-[#222]" : "text-[#717171]"}`}>Alerts</span>
        </div>

        {/* Prepare */}
        <div className="flex flex-col items-center">
          <img src="https://c.animaapp.com/mb9y7f13hTU61E/img/group-2.png" className="w-[19px] h-[19px]" />
          <span className={`text-xs mt-1 ${selection === "prepare" ? "font-bold text-[#222]" : "text-[#717171]"}`}>Prepare</span>
        </div>

        {/* Map */}
        <div className="flex flex-col items-center">
          <IconFilledMaps3 className="w-6 h-6" />
          <span className={`text-xs mt-1 ${selection === "map" ? "font-bold text-[#222]" : "text-[#717171]"}`}>Map</span>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center">
          <img
            src={
              selection === "profile"
                ? "https://c.animaapp.com/mb9y7f13hTU61E/img/profile-outline-4.svg"
                : "https://c.animaapp.com/mb9y7f13hTU61E/img/profile-outline.svg"
            }
            className="w-6 h-6"
          />
          <span className={`text-xs mt-1 ${selection === "profile" ? "font-bold text-[#222]" : "text-[#717171]"}`}>Profile</span>
        </div>
      </div>

      <div className="w-[134px] h-[5px] rounded-full bg-[#222] mx-auto mt-2" />
    </div>
  );
};

// Profile Page (single file)
const ProfilePage = () => {
  return (
    <div className="flex flex-col min-h-screen items-center bg-light-backgrounds-white">
      {/* Header */}
      <div className="w-full flex justify-between items-center px-6 py-4 shadow-md bg-white">
        <h1 className="text-xl font-semibold text-[#222]">Profile</h1>
        <IconOutlineBell className="w-6 h-6" />
      </div>

      {/* Profile Avatar */}
      <div className="mt-6">
        <img
          src="https://c.animaapp.com/mb9y7f13hTU61E/img/profile-outline-4.svg"
          alt="Avatar"
          className="w-24 h-24 rounded-full border-2 border-[#222]"
        />
      </div>

      {/* Profile Info */}
      <div className="mt-4 text-center">
        <h2 className="text-lg font-medium text-[#222]">John Doe</h2>
        <p className="text-sm text-[#717171]">john.doe@example.com</p>
      </div>

      {/* Buttons */}
      <div className="mt-6 w-11/12">
        <button className="w-full py-3 bg-[#222] text-white rounded-lg mb-3">Edit Profile</button>
        <button className="w-full py-3 bg-gray-200 text-[#222] rounded-lg">Settings</button>
      </div>

      {/* Spacer */}
      <div className="flex-grow" />

      {/* TabBar */}
      <TabBar selection="profile" />
    </div>
  );
};

export default ProfilePage;
