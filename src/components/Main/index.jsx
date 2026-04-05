import { Outlet, useNavigate } from "react-router";
import React from "react";
import Footer from "../Footer";
import BubbleBackground from "../ui/BubbleBackground";
import Header from "../Header";
import { useTheme } from "../Main/ThemeContext";

// 🔹 Əlavə et

const RootLayout = () => {
  const navigate = useNavigate();
const { darkMode, toggleTheme } = useTheme();
  
  return (
    
    <div className=" min-h-screen flex flex-col ">
     
      
      <Header />
      


      {/* 🔹 Breadcrumb burada */}
     
<div className={darkMode ? "page dark" : "page light"}>
  <button className="mt-10 z-50 fixed" onClick={toggleTheme}>
        {darkMode ?  "🌙" : "🌞"}
      </button>
      <main className="flex-grow  min-h-screen w-full mx-auto ">
        
        <Outlet />
         
      </main>

      <Footer />
    
    </div>
    </div>
  );
};

export default RootLayout;
