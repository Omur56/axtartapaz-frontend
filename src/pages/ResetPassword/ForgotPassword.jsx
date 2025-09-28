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
    <div className="min-h-screen mt-[50px] mb-[50px] flex items-center justify-center p-5">
    <div className="max-w-md mx-auto mt-12 p-8  bg-gradient-to-r from-sky-600 to-fuchsia-500 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Şifrəni Unutdunuz?</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Emailinizi daxil edin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Kod Göndər
        </button>
      </form>
    </div>
    </div>
  );
}

