import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import menuItems from '../SideBarMenu/data'; 

const BottomMenu = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // Aşağı scroll → gizlət
        setShowNavbar(false);
      } else {
        // Yuxarı scroll → göstər
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`md:hidden h-[30px] rounded-t-[10px] bg-white fixed bottom-0 left-0 w-full  text-gray-500 flex justify-around items-center  z-50 opacity-100   transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {menuItems.slice(0, 5).map((item) => (
        <Link
          key={item.id}
          to={item.url}
          className="flex flex-col items-center text-xs hover:text-[#1c04f7] transition-colors"
        >
          <div className="text-[15px] ">{item.icon}</div>
         
        </Link>
      ))}
    </div>
  );
};

export default BottomMenu;

