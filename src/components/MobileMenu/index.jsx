// import React, { useState, useEffect, useRef } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import menuItems from "../SideBarMenu/data"; // menuItems içində yalnız component saxla

// const BottomMenu = () => {
//   const [showNavbar, setShowNavbar] = useState(true);
//   const lastScrollY = useRef(0); // state əvəzinə ref
//   const location = useLocation();

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;

//       if (currentScrollY > lastScrollY.current + 10) {
//         setShowNavbar(false); // aşağı scroll → gizlət
//       } else if (currentScrollY < lastScrollY.current - 10) {
//         setShowNavbar(true); // yuxarı scroll → göstər
//       }

//       lastScrollY.current = currentScrollY;
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []); // dependency array boş → listener yalnız mount/unmount

//   return (
//   <div
//     className={`md:hidden fixed bottom-0 left-0 right-0 w-full
//     bg-white/70 backdrop-blur-md shadow-md shadow-blue-400/30
//     flex justify-around items-center z-50
//     pb-[env(safe-area-inset-bottom)]
//     transition-transform duration-300
//     ${showNavbar ? "translate-y-0" : "translate-y-full"}`}
//   >
//     {menuItems.slice(0, 5).map((item) => {
//       const Icon = item.icon;
//       const isActive = location.pathname === item.url;

//       return (
//         <NavLink
//           key={item.id}
//           to={item.url}
//           className="flex flex-col items-center justify-center flex-1 py-2"
//         >
//           {/* TOUCH AREA (standart 44-48px) */}
//           <div
//             className={`w-[46px] h-[46px] rounded-[8px] flex items-center justify-center transition-all duration-200
//             ${isActive ? "bg-green-500 shadow-md" : "hover:bg-gray-100"}`}
//           >
//             <Icon
//               size={22}
//               strokeWidth={1.8}
//               aria-hidden="true"
//               className={`transition-all duration-200
//               ${isActive ? "text-white" : "text-blue-100"}`}
//             />
//           </div>

//           {/* optional text */}
//           <span className={`text-[11px] mt-1 text-gray-500 ${isActive ? "text-green-500 font-semibold" : ""}`}>
//             {item.text}
//           </span>
//         </NavLink>
//       );
//     })}
//   </div>
// );
// };

// export default BottomMenu;

import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import menuItems from "../SideBarMenu/data";

const BottomMenu = () => {
  const [showNavbar, setShowNavbar] = useState(true);

  const lastScrollY = useRef(0);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Yuxarı qalxanda göstər
      if (currentScrollY < lastScrollY.current - 8) {
        setShowNavbar(true);
      }

      // Aşağı düşəndə gizlət
      else if (currentScrollY > lastScrollY.current + 8) {
        setShowNavbar(false);
      }

      // Səhifənin ən yuxarısında həmişə göstər
      if (currentScrollY <= 10) {
        setShowNavbar(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`
        md:hidden
        fixed
        bottom-0
        left-0
        right-0
        z-[100]
        px-2
        pb-[env(safe-area-inset-bottom)]
        transition-transform
        duration-300
        ease-out
        ${showNavbar ? "translate-y-0" : "translate-y-full"}
      `}
    >
      {/* NAVBAR */}
      <div
        className="
          relative
          w-full
          h-[64px]
          rounded-t-2xl
          bg-white/95
          dark:bg-gray-950/95
          backdrop-blur-xl
          border
          border-gray-200
          dark:border-gray-800
          shadow-[0_-8px_30px_rgba(0,0,0,0.08)]
          dark:shadow-[0_-8px_30px_rgba(0,0,0,0.35)]
          overflow-hidden
        "
      >
        <div className="flex h-full">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon;

            const isActive =
              location.pathname === item.url ||
              location.pathname.startsWith(`${item.url}/`);

            return (
              <NavLink
                key={item.id}
                to={item.url}
                className="
                  relative
                  flex-1
                  h-full
                  flex
                  flex-col
                  items-center
                  justify-center
                  select-none
                  group
                "
              >
                {/* Aktiv fon */}
                {isActive && (
                  <div
                    className="
                      absolute
                      top-0
                      left-3
                      right-3
                      h-[3px]
                      rounded-b-full
                      bg-[#670fff]
                      shadow-[0_2px_10px_rgba(103,15,255,0.45)]
                    "
                  />
                )}

                {/* Aktiv ikon fonu */}
                <div
                  className={`
                    relative
                    flex
                    items-center
                    justify-center
                    w-9
                    h-9
                    rounded-xl
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? "bg-[#670fff]/10 dark:bg-[#670fff]/20"
                        : "bg-transparent"
                    }
                  `}
                >
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={`
                      transition-all
                      duration-200
                      ${
                        isActive
                          ? "text-[#670fff] scale-110"
                          : "text-gray-500 dark:text-gray-400 group-hover:text-[#670fff] group-hover:scale-105"
                      }
                    `}
                  />
                </div>

                {/* Mətn */}
                <span
                  className={`
                    text-[10px]
                    leading-none
                    mt-0.5
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? "text-[#670fff] font-bold"
                        : "text-gray-500 dark:text-gray-400 font-medium"
                    }
                  `}
                >
                  {item.text}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomMenu;