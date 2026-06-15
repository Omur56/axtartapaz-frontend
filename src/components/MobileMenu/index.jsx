import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import menuItems from "../SideBarMenu/data"; // menuItems içində yalnız component saxla

const BottomMenu = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0); // state əvəzinə ref
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current + 10) {
        setShowNavbar(false); // aşağı scroll → gizlət
      } else if (currentScrollY < lastScrollY.current - 10) {
        setShowNavbar(true); // yuxarı scroll → göstər
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // dependency array boş → listener yalnız mount/unmount


  return (
  <div
    className={`md:hidden fixed bottom-0 left-0 right-0 w-full
    bg-white/70 backdrop-blur-md shadow-md shadow-blue-400/30
    flex justify-around items-center z-50
    pb-[env(safe-area-inset-bottom)]
    transition-transform duration-300
    ${showNavbar ? "translate-y-0" : "translate-y-full"}`}
  >
    {menuItems.slice(0, 5).map((item) => {
      const Icon = item.icon;
      const isActive = location.pathname === item.url;

      return (
        <NavLink
          key={item.id}
          to={item.url}
          className="flex flex-col items-center justify-center flex-1 py-2"
        >
          {/* TOUCH AREA (standart 44-48px) */}
          <div
            className={`w-[46px] h-[46px] rounded-[8px] flex items-center justify-center transition-all duration-200
            ${isActive ? "bg-green-500 shadow-md" : "hover:bg-gray-100"}`}
          >
            <Icon
              size={22}
              strokeWidth={1.8}
              aria-hidden="true"
              className={`transition-all duration-200
              ${isActive ? "text-white" : "text-blue-600"}`}
            />
          </div>

          {/* optional text */}
          {/* <span className="text-[11px] mt-1 text-gray-500">
            {item.text}
          </span> */}
        </NavLink>
      );
    })}
  </div>
);
};

export default BottomMenu;
