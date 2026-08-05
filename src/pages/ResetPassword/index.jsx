// import { useState, useEffect } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";

// export default function ResetPassword() {
//   const [newPassword, setNewPassword] = useState("");
//   const [email, setEmail] = useState("");
//   const [code, setCode] = useState("");
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   useEffect(() => {
//     const emailParam = searchParams.get("email");
//     const codeParam = searchParams.get("code");
//     if (emailParam && codeParam) {
//       setEmail(emailParam);
//       setCode(codeParam);
//     }
//   }, [searchParams]);

//   const handleReset = async (e) => {
//     e.preventDefault();
//     if (!newPassword) return Swal.fire("Xəta", "Yeni şifrə daxil edin!", "warning");

//     try {
//       const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, {
//         email,
//         code,
//         newPassword
//       });
//       Swal.fire("Uğur!", res.data.message, "success");
//       navigate("/login"); // yeni şifrə ilə login səhifəsinə yönləndir
//     } catch (err) {
//       Swal.fire("Xəta", err.response?.data?.message || err.message, "error");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg">
//       <h2 className="text-2xl font-bold text-center mb-4">Şifrəni Yenilə</h2>
//       <form onSubmit={handleReset} className="space-y-4">
//         <input
//           type="password"
//           placeholder="Yeni şifrə"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           className="w-full border px-4 py-2 rounded"
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//         >
//           Şifrəni Yenilə
//         </button>
//       </form>
//     </div>
//   );
// }




// import { useState, useEffect } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";

// export default function ResetPassword() {
//   const [newPassword, setNewPassword] = useState("");
//   const [email, setEmail] = useState("");
//   const [code, setCode] = useState("");
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   // URL-dən email və kodu oxuyuruq
//   useEffect(() => {
//     const emailParam = searchParams.get("email");
//     const codeParam = searchParams.get("code");
//     if (emailParam && codeParam) {
//       setEmail(emailParam);
//       setCode(codeParam);
//     }
//   }, [searchParams]);

//   const handleReset = async (e) => {
//     e.preventDefault();
//     if (!newPassword) return Swal.fire("Xəta", "Yeni şifrə daxil edin!", "warning");

//     try {
//       const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, {
//         email,
//         code,
//         newPassword
//       });
//       Swal.fire("Uğur!", res.data.message, "success");
//       navigate("/login"); // şifrə yeniləndikdən sonra login səhifəsinə yönləndir
//     } catch (err) {
//       Swal.fire("Xəta", err.response?.data?.message || err.message, "error");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg">
//       <h2 className="text-2xl font-bold text-center mb-4">Şifrəni Yenilə</h2>
//       <form onSubmit={handleReset} className="space-y-4">
//         <input
//           type="password"
//           placeholder="Yeni şifrə"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           className="w-full border px-4 py-2 rounded"
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//         >
//           Şifrəni Yenilə
//         </button>
//       </form>
//     </div>
//   );
// }


import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      return Swal.fire("Xəta", "Yeni şifrəni daxil edin", "warning");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/reset-password`,
        {
          email,
          code,
          newPassword,
        }
      );

      Swal.fire("Uğur", res.data.message, "success");

      navigate("/login");
    } catch (err) {
      Swal.fire(
        "Xəta",
        err.response?.data?.message || "Şifrə yenilənmədi",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex justify-center items-center px-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">

        <h1 className="text-3xl font-bold text-center mb-6">
          Yeni Şifrə
        </h1>

        <form onSubmit={handleReset} className="space-y-5">

          <input
            value={email}
            disabled
            className="w-full border rounded-xl p-3 bg-gray-100"
          />

          <input
            value={code}
            disabled
            className="w-full border rounded-xl p-3 bg-gray-100"
          />

          <input
            type="password"
            placeholder="Yeni şifrə"
            value={newPassword}
            onChange={(e)=>setNewPassword(e.target.value)}
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <button
            disabled={loading}
            className="w-full bg-purple-600 text-white rounded-xl p-3 hover:bg-purple-700"
          >
            {loading ? "Yenilənir..." : "Şifrəni Yenilə"}
          </button>

        </form>

      </div>

    </div>
  );
}