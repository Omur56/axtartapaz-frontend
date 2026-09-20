import { Outlet, useLocation } from "react-router";
import React, { useEffect } from "react";

import Footer from "../Footer";
import Header from "../Header";
import BubbleBackground from "../ui/BubbleBackground";

import { useTheme } from "../Main/ThemeContext";

const RootLayout = () => {
  const location = useLocation();

  const { darkMode, toggleTheme } = useTheme();

  // Hər yeni səhifəyə keçəndə səhifəni yuxarı qaytar
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  return (
    <div
      className={`
        min-h-screen
        flex
        flex-col
        transition-colors
        duration-300
        ${darkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}
      `}
    >
      {/* HEADER */}
      <Header />

      {/* ƏSAS SƏHİFƏ */}
      <div
        className={`
          relative
          flex
          flex-col
          flex-1
          min-h-screen
          overflow-x-hidden
          transition-colors
          duration-300
          ${darkMode ? "bg-gray-950" : "bg-gray-50"}
        `}
      >
        {/* Dekorativ Bubble Background */}
        <div
          className="
            absolute
            inset-0
            pointer-events-none
            overflow-hidden
            opacity-40
            dark:opacity-20
          "
        >
          <BubbleBackground />
        </div>

        {/* THEME TOGGLE */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={darkMode ? "Açıq rejimə keç" : "Qaranlıq rejimə keç"}
          className={`
            fixed
            right-4
            sm:right-6
            top-[76px]
            z-[90]
            w-10
            h-10
            sm:w-11
            sm:h-11
            rounded-xl
            flex
            items-center
            justify-center
            text-lg
            border
            shadow-lg
            backdrop-blur-xl
            transition-all
            duration-300
            hover:scale-105
            active:scale-90
            ${
              darkMode
                ? "bg-gray-900/90 border-gray-700 text-yellow-300 shadow-black/30"
                : "bg-white/90 border-gray-200 text-orange-500 shadow-gray-300/40"
            }
          `}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* MAIN */}
        <main
          className="
            relative
            z-10
            flex-grow
            w-full
            max-w-[1240px]
            mx-auto
            px-3
            sm:px-5
            lg:px-6
            pt-[78px]
            pb-20
            sm:pb-10
          "
        >
          <Outlet />
        </main>

        {/* FOOTER */}
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
