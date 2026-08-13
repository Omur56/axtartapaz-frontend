import { Outlet, useNavigate, useLocation } from "react-router";
import React, { useEffect } from "react";
import Footer from "../Footer";
import BubbleBackground from "../ui/BubbleBackground";
import Header from "../Header";
import { useTheme } from "../Main/ThemeContext";

const RootLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { darkMode, toggleTheme } = useTheme();

  // 🔹 Hər yeni səhifəyə keçəndə səhifəni yuxarı qaytarır
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">

      <Header />

      {/* 🔹 Breadcrumb burada */}

      <div className={darkMode ? "page dark" : "page light"}>

        <button
          className="fixed button_toggle"
          onClick={toggleTheme}
        >
          {darkMode ? "🌙" : "🌞"}
        </button>

        <main className="flex-grow min-h-screen w-full mx-auto max-w-[1000px]">

          <Outlet />

        </main>

        <Footer />

      </div>

    </div>
  );
};

export default RootLayout;