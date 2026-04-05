import React from "react";
import { RouterProvider } from "react-router";
import router from './routes';
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "../components/Main/ThemeContext"; // 1. ThemeContext faylını əlavə et

function App() {
  return (
    <ThemeProvider>
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;