// Layout.js
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";

export default function Layout() {
  const location = useLocation();
  
  // Header-i gizlətmək istədiyin yollar
  const hideHeaderOn = ["/cars/"]; // /cars/:id səhifələrində gizlədiləcək
  const shouldHideHeader = hideHeaderOn.some(path => location.pathname.includes(path));

  return (
    <>
      {!shouldHideHeader && <Header />}
      <Outlet />
    </>
  );
}