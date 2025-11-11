import { Outlet, useNavigate } from "react-router";
import React from "react";
import Footer from "../Footer";
import BottomMenu from "../MobileMenu";
import Header from "../Header";


// 🔹 Əlavə et

const RootLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen flex flex-col">
     
      
      <Header />
      

      {/* 🔹 Breadcrumb burada */}
     

      <main className="flex-grow">
        
        <Outlet />
         
      </main>

      <Footer />
      <BottomMenu />
    </div>
  );
};

export default RootLayout;
