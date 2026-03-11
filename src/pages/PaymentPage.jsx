import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const PaymentPage = () => {
  const { listingId } = useParams(); // URL-dən elan ID alırıq
  const [type, setType] = useState("premium"); // ödəniş növü: premium / vip
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      if (!API_URL) throw new Error("API URL undefined!");

      const res = await axios.post(`${API_URL}/api/payment/create`, {
        listingId,
        type,
      });

      if (res.data?.url) {
        // Ödəniş portalına yönləndir
        window.location.href = res.data.url;
      } else {
        alert("Ödəniş URL-i tapılmadı");
      }
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      alert("Ödənişdə xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">Ödəniş Səhifəsi</h1>

      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <p className="mb-4 font-semibold">
          Elan ID: <span className="text-blue-600">{listingId}</span>
        </p>

        <div className="mb-4">
          <label className="mr-2 font-semibold">Ödəniş növü:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded p-1"
          >
            <option value="premium">Premium</option>
            <option value="vip">VIP</option>
          </select>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Yüklənir..." : "Ödəniş Et"}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full mt-3 bg-gray-300 text-black py-2 rounded hover:bg-gray-400 transition"
        >
          Geri
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;