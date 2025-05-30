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
// import { Card, CardContent } from "../../components/ui/card";
// import { Separator } from "../../components/ui/separator";

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
  },
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
    <div className="relative w-full max-w-[393px] h-[852px] bg-white mx-auto">
      {/* Status Bar */}
      <div className="flex w-full h-[59px] items-end justify-center backdrop-blur-sm backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(4px)_brightness(100%)]">
        <div className="flex flex-col items-center justify-center gap-2 pl-2.5 pr-0 pt-0 pb-[3px] relative flex-1 self-stretch">
          <div className="relative w-[54px] h-[21px] rounded-3xl">
            <div className="absolute w-[54px] top-px left-0 font-callout-bold font-[number:var(--callout-bold-font-weight)] text-label-colorlightprimary text-[length:var(--callout-bold-font-size)] text-center tracking-[var(--callout-bold-letter-spacing)] leading-[var(--callout-bold-line-height)] whitespace-nowrap [font-style:var(--callout-bold-font-style)]">
              9:41
            </div>
          </div>
        </div>

        <div className="inline-flex flex-col items-center justify-center relative self-stretch flex-[0_0_auto]">
          <div className="relative w-[125px] h-[37px] bg-system-backgrounddark-baseprimary rounded-[100px]">
            <div className="absolute w-20 h-[37px] top-0 left-0 bg-system-backgrounddark-baseprimary rounded-[100px]" />
            <div className="absolute w-[37px] h-[37px] top-0 left-[88px] bg-system-backgrounddark-baseprimary rounded-[100px]" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pl-0 pr-[11px] py-0 relative flex-1 self-stretch">
          <div className="inline-flex items-start gap-2 relative flex-[0_0_auto]">
            <img
              className="relative w-[18px] h-3"
              alt="Icon mobile signal"
              src="https://c.animaapp.com/mb9wldk1n5qqZL/img/icon---mobile-signal.svg"
            />
            <img
              className="relative w-[17px] h-[11.83px]"
              alt="Wifi"
              src="https://c.animaapp.com/mb9wldk1n5qqZL/img/wifi.svg"
            />
            <img
              className="relative w-[27.4px] h-[13px]"
              alt="Statusbar battery"
              src="https://c.animaapp.com/mb9wldk1n5qqZL/img/-statusbar-battery.svg"
            />
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <Card className="w-[344px] mx-6 mt-[132px] border-none shadow-none">
        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-[61px] h-[60.16px] bg-[url(https://c.animaapp.com/mb9wldk1n5qqZL/img/ellipse-9.png)] bg-cover bg-[50%_50%]" />
              <div className="flex flex-col w-[165px] h-[60px] justify-center gap-2.5">
                <div className="h-4 [font-family:'Airbnb_Cereal_App-Book',Helvetica] font-normal text-black text-xl tracking-[0] leading-[26px] whitespace-nowrap">
                  Charlie Becket
                </div>
                <div className="h-[18px] [font-family:'Airbnb_Cereal_App-Book',Helvetica] font-normal text-[#9d9999] text-sm tracking-[0] leading-[18.2px] whitespace-nowrap">
                  Show profile
                </div>
              </div>
            </div>
            <ChevronRightIcon className="w-6 h-6" />
          </div>
        </CardContent>
      </Card>
      <Separator className="w-[344px] mx-6 mt-2" />

      {/* Settings Header */}
      <div className="flex flex-col w-[134px] items-start justify-center gap-8 mt-[284px] ml-6 absolute">
        <div className="self-stretch mt-[-1.00px] [font-family:'Airbnb_Cereal_App-Medium',Helvetica] font-medium text-[#003049] text-2xl tracking-[-0.48px] leading-[31.2px]">
          Settings
        </div>
      </div>

      {/* Settings List */}
      <div className="flex flex-col w-[344px] items-start gap-[29px] absolute top-[347px] left-6">
        {settingsItems.map((item, index) => (
          <div
            key={item.id}
            className="flex flex-col items-end gap-[7px] w-full"
          >
            <div className="flex items-center justify-between w-full">
              <div className="inline-flex h-[25px] items-center gap-2.5">
                {item.icon}
                <div className="[font-family:'Airbnb_Cereal_App-Book',Helvetica] font-normal text-black text-base tracking-[-0.32px] leading-[20.8px] whitespace-nowrap">
                  {item.label}
                </div>
              </div>
              <ChevronRightIcon className="w-6 h-6" />
            </div>
            <Separator className="w-full" />
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="flex flex-col w-full items-start absolute bottom-0 left-0">
        <div className="flex w-full items-center py-2 bg-light-backgrounds-white shadow-divider">
          {navigationItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center gap-px flex-1"
            >
              {item.icon}
              <div
                className={`w-fit font-body-3-${item.isActive ? "header" : "regular"} font-[number:var(--body-3-${item.isActive ? "header" : "regular"}-font-weight)] text-${item.isActive ? "[#222222]" : "dark-texts-low"} text-[length:var(--body-3-${item.isActive ? "header" : "regular"}-font-size)] text-center tracking-[var(--body-3-${item.isActive ? "header" : "regular"}-letter-spacing)] leading-[var(--body-3-${item.isActive ? "header" : "regular"}-line-height)] [font-style:var(--body-3-${item.isActive ? "header" : "regular"}-font-style)]`}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
        <div className="relative self-stretch w-full h-7 bg-light-backgrounds-white">
          <div className="relative w-[134px] h-[5px] top-[15px] left-[130px] bg-[#222222] rounded-[100px]" />
        </div>
      </div>
    </div>
  );
};

export default Profile;