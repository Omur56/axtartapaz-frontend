import { RouterProvider } from "react-router";
import router from './routes';
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import PaymentButton from "../components/PaymentButton.jsx";


function App() {
  return (
  
   <HelmetProvider>
    <RouterProvider router={router} />
     <PaymentButton />
    </HelmetProvider>

    
    
  );
}

export default App;
