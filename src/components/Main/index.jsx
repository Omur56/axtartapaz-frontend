import {Outlet,  useNavigate } from "react-router";
import React, { useState, useEffect } from "react";
import {axios} from "react"
import Footer from "../Footer";
import BottomMenu from "../MobileMenu";
import Header from "../Header";



const RootLayout = () => {
  const navigate = useNavigate();
 
  
  return (
   <div className=" bg-[#f5f5f5]">
       <Header />
  
      <Outlet />
       <Footer/>
      <BottomMenu />
   </div>
  );
};

export default RootLayout;
