import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email");
  const code = searchParams.get("code");

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword !== confirmPassword) {
      return Swal.fire("Xəta", "Şifrələr eyni olmalıdır!", "warning");
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, {
        email,
        code,
        newPassword,
      });
      Swal.fire("Uğur!", res.data.message, "success");
      navigate("/login");
    } catch (err) {
      console.error("Reset failed:", err.response?.data || err.message);
      Swal.fire("Xəta", err.response?.data?.message || err.message, "error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-5">Şifrəni Yenilə</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="password"
          placeholder="Yeni şifrə"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Yeni şifrə təkrarı"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Yenilə
        </button>
      </form>
    </div>
  );
}
