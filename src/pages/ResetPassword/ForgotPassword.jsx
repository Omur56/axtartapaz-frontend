// // import { useState } from "react";
// // import axios from "axios";
// // import Swal from "sweetalert2";

// // export default function ForgotPassword() {
// //   const [email, setEmail] = useState("");

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!email) return Swal.fire("Xəta", "Email daxil edin!", "warning");

// //     try {
// //       const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
// //       Swal.fire("Uğur!", res.data.message, "success");
// //     } catch (err) {
// //       console.error("Forgot password error:", err.response?.data || err.message);
// //       Swal.fire("Xəta", err.response?.data?.message || err.message, "error");
// //     }
// //   };

// //   return (
// //     <div className="max-w-md mx-auto mt-12 bg-white shadow-lg rounded-xl p-8">
// //       <h2 className="text-2xl font-bold text-center mb-5">Şifrəni Bərpa Et</h2>
// //       <form onSubmit={handleSubmit} className="space-y-5">
// //         <input
// //           type="email"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           placeholder="Email"
// //           required
// //           className="border px-4 py-2 rounded-lg w-full"
// //         />
// //         <button type="submit" className="bg-blue-600 text-white py-2 w-full rounded-lg">Kod Göndər</button>
// //       </form>
// //     </div>
// //   );
// // }








// import { useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email) return Swal.fire("Xəta", "Email daxil edin!", "warning");

//     try {
//       const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
//       Swal.fire("Uğur!", res.data.message, "success");
//       setEmail("");
//     } catch (err) {
//       console.error("Forgot password error:", err.response?.data || err.message);
//       Swal.fire("Xəta", err.response?.data?.message || err.message, "error");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-12 bg-white p-8 shadow-lg rounded-xl">
//       <h2 className="text-2xl font-bold text-center mb-4">Şifrəni unutdum</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="border p-2 w-full mb-4 rounded"
//         />
//         <button type="submit" className="bg-green-600 text-white py-2 rounded w-full">
//           Kod Göndər
//         </button>
//       </form>
//     </div>
//   );
// }







import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return Swal.fire("Xəta", "Email daxil edin!", "warning");

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
      Swal.fire("Uğur!", res.data.message, "success");
      setEmail("");
    } catch (err) {
      Swal.fire("Xəta", err.response?.data?.message || err.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
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
