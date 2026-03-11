import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // KapitalBank redirect sonrası backend webhook vasitəsilə elan artıq VIP/Premium olacaq
    setTimeout(() => navigate("/"), 3000); // 3s sonra ana səhifəyə
  }, []);

  return <h1>Ödəniş uğurla tamamlandı! Elan aktiv edildi.</h1>;
};

export default PaymentSuccess;