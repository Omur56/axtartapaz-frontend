import React from "react";

function PaymentButton() {
  const handlePayment = async () => {
    try {
      // backend URL olaraq .env-dən istifadə etmək yaxşıdır
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/payment/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount: 5
          })
        }
      );

      

      const data = await response.json();

      if (data.paymentUrl) {
        // user-i Birbank test payment səhifəsinə yönləndir
        window.location.href = data.paymentUrl;
      } else {
        alert("Payment URL alınmadı. Backend-i yoxla.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment yaratmaq mümkün olmadı.");
    }
  };

  return (
    <button onClick={handlePayment}>
      5 AZN ödə
    </button>
  );
}

export default PaymentButton;