import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import menuItems from "../SideBarMenu/data"; // menuItems içində yalnız component saxla

const BottomMenu = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY + 10) {
        setShowNavbar(false); // aşağı scroll → gizlət
      } else {
        setShowNavbar(true);  // yuxarı scroll → göstər
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 w-full h-[63px] bg-white shadow-t-xl flex justify-around items-center z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {menuItems.slice(0, 5).map((item) => {
        const Icon = item.icon; // component-i al
        const isActive = location.pathname === item.url;

        return (
          <NavLink
            key={item.id}
            to={item.url}
            className="flex flex-col items-center justify-center text-xs mt-1 transition-all duration-200"
          >
            {/* Icon bubble */}
            <div
              className={`w-[40px] h-[40px] rounded-[8px] flex items-center justify-center mb-1 transition-all duration-300 ${
                isActive ? "bg-red-500" : "bg-gray-200 hover:bg-blue-100"
              }`}
            >
              <Icon
                size={24}
                strokeWidth={1.5}
                className={`transition-colors duration-300 ${
                  isActive ? "text-white" : "text-gray-500"
                }`}
              />
            </div>

            {/* Text */}
            <span
              className={`text-[12px] font-semibold transition-colors duration-300 ${
                isActive ? "text-red-500" : "text-gray-500 hover:text-blue-500"
              }`}
            >
              {item.text}
            </span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default BottomMenu;
