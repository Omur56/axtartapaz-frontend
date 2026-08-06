



import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ForgotPassword() {
  // const [email, setEmail] = useState("");

  const [email, setEmail] = useState("");
const [showModal, setShowModal] = useState(false);
const [code, setCode] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return Swal.fire("Xəta", "Email daxil edin!", "warning");

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
      await Swal.fire({
  icon: "success",
  title: "Uğurlu",
  text: res.data.message,
  timer: 1500,
  showConfirmButton: false,
});

setShowModal(true);
    } catch (err) {
      Swal.fire("Xəta", err.response?.data?.message || err.message, "error");
    }
    console.log(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`);
  };

  console.log("API URL:", process.env.REACT_APP_API_URL);
  console.log("API:", process.env.REACT_APP_API_URL);



  const handleReset = async () => {
  if (!code) {
    return Swal.fire("Xəta", "Kodu daxil edin", "warning");
  }

  if (!newPassword) {
    return Swal.fire("Xəta", "Yeni şifrəni daxil edin", "warning");
  }

  if (newPassword !== confirmPassword) {
    return Swal.fire("Xəta", "Şifrələr uyğun gəlmir", "error");
  }

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/reset-password`,
      {
        email,
        code,
        newPassword,
      }
    );

    Swal.fire("Uğur", res.data.message, "success");

    setShowModal(false);
    setEmail("");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");

  } catch (err) {
    Swal.fire(
      "Xəta",
      err.response?.data?.message || err.message,
      "error"
    );
  }
};

  return (



    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">


      {showModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md">

      <h2 className="text-2xl font-bold text-center mb-6">
        Şifrəni Yenilə
      </h2>

      <input
        type="text"
        maxLength={6}
        placeholder="6 rəqəmli kod"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full border rounded-lg px-4 py-3 mb-4"
      />

<div className="relative mb-4">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Yeni şifrə"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    className="w-full border rounded-lg px-4 py-3 pr-12 mt-4"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-xl"
  >
    {showPassword ? "🙈" : "👁️"}
  </button>
</div>

<div className="relative mb-6">
  <input
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Şifrəni təsdiqlə"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className="w-full border rounded-lg px-4 py-3 pr-12"
  />

  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-xl"
  >
    {showConfirmPassword ? "🙈" : "👁️"}
  </button>
</div>



      <div className="flex gap-3">

        <button
          onClick={() => setShowModal(false)}
          className="flex-1 border rounded-lg py-3"
        >
          Ləğv et
        </button>

        <button
          onClick={handleReset}
          className="flex-1 bg-green-600 text-white rounded-lg py-3 hover:bg-green-700"
        >
          Şifrəni Yenilə
        </button>

      </div>

    </div>
  </div>
)}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Şifrəni Unutdunuz?</h2>
        <p className="text-center text-gray-600 text-sm mb-6">Emailinizi daxil edin və şifrə sıfırlama kodunu alın</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Emailinizi daxil edin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 shadow-sm hover:shadow-md"
          />
          <button 
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition duration-300 shadow-lg hover:shadow-xl text-lg"
          >
            Kod Göndər
          </button>
        </form>
        <p className="text-center text-sm text-gray-700 mt-4">
          Hesabınız var?{" "}
          <span className="text-purple-700 font-bold hover:underline cursor-pointer" onClick={() => window.location.href="/login"}>
            Daxil olun
          </span>
        </p>
      </div>
    </div>
  );
}
