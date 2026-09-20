import React, { createContext, useContext, useState, useEffect } from "react";

import "./ThemeContext.css";

// Context
const ThemeContext = createContext();

// Provider
export const ThemeProvider = ({ children }) => {
  // LocalStorage-dan başlanğıc temanı birbaşa oxu
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Dark mode dəyişəndə həm localStorage,
  // həm də HTML elementini yenilə
  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));

    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Browser rəng sxemini də uyğunlaşdır
    root.style.colorScheme = darkMode ? "dark" : "light";
  }, [darkMode]);

  // Theme dəyiş
  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Theme Hook
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme yalnız ThemeProvider daxilində istifadə olunmalıdır.",
    );
  }

  return context;
};
