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



import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 🔹 şifrəni göstər/gizlət
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL-dən email və kodu oxuyuruq
  useEffect(() => {
    const emailParam = searchParams.get("email");
    const codeParam = searchParams.get("code");
    if (emailParam && codeParam) {
      setEmail(emailParam);
      setCode(codeParam);
    }
  }, [searchParams]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword) return Swal.fire("Xəta", "Yeni şifrə daxil edin!", "warning");

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, {
        email,
        code,
        newPassword
      });
      Swal.fire("Uğur!", res.data.message, "success");
      navigate("/login"); // şifrə yeniləndikdən sonra login səhifəsinə yönləndir
    } catch (err) {
      Swal.fire("Xəta", err.response?.data?.message || err.message, "error");
    }
  };

  return (
    <div className="min-h-screen mt-[50px] mb-[50px] flex items-center justify-center p-5 bg-gradient-to-r ">
    <div className="max-w-md mx-auto mt-12 p-8 bg-gradient-to-r from-sky-600 to-fuchsia-500 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Şifrəni Yenilə</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"} // 🔹 tip dəyişir
            placeholder="Yeni şifrə"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? "🙈" : "👁️"} {/* göz işarəsi */}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Şifrəni Yenilə
        </button>
      </form>
    </div>
    </div>
  );
}
