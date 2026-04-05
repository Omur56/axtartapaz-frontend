import React, { createContext, useContext, useState, useEffect } from "react";
import './ThemeContext.css'

// Context yaradılır
const ThemeContext = createContext();

// Provider komponent
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // LocalStorage-dan mövcud temayı oxumaq
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
  }, []);

  // Toggle funksiyası
  const toggleTheme = () => {
    setDarkMode(prev => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  return (
    <ThemeContext.Provider  value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook yaradılır: istifadə etmək üçün
export const useTheme = () => useContext(ThemeContext);