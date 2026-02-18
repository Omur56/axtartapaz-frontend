import { Outlet, useNavigate } from "react-router";
import React from "react";
import Footer from "../Footer";
import BubbleBackground from "../ui/BubbleBackground";
import Header from "../Header";


// 🔹 Əlavə et

const RootLayout = () => {
  const navigate = useNavigate();

  return (
    <div className=" min-h-screen flex flex-col">
     
      <BubbleBackground interactive={true} />
      <Header />
      

      {/* 🔹 Breadcrumb burada */}
     

      <main className="flex-grow bg-gray-100 min-h-screen w-full mx-auto ">
        
        <Outlet />
         
      </main>

      <Footer />
    
    </div>
  );
};

export default RootLayout;
