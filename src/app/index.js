import { RouterProvider } from "react-router";
import router from './routes';
import React from "react";
import { HelmetProvider } from "react-helmet-async";



function App() {
  return (
  
   <HelmetProvider>
    <RouterProvider router={router} />
    </HelmetProvider>

    
    
  );
}

export default App;
