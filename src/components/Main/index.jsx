import { Outlet, useNavigate } from "react-router";
import React from "react";
import Footer from "../Footer";
import BottomMenu from "../MobileMenu";
import Header from "../Header";


// 🔹 Əlavə et

const RootLayout = () => {
  const navigate = useNavigate();

  return (
    <div className=" min-h-screen flex flex-col">
     
      
      <Header />
      

      {/* 🔹 Breadcrumb burada */}
     

      <main className="flex-grow bg-gray-50 min-h-screen w-full mx-auto ">
        
        <Outlet />
         
      </main>

      <Footer />
      <BottomMenu />
    </div>
  );
};

export default RootLayout;
