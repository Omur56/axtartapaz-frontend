// import { useState, useRef } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

// export default function Login({ onLogin }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [auth, setAuth] = useState(null);
//   const [showPassword, setShowPassword] = useState(false); // 🔑 yeni state
//   const navigate = useNavigate();
//   const passwordRef = useRef(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/login`,
//         {
//           email,
//           password,
//         }

        
//       );

//       // Token və user məlumatlarını localStorage-a yaz
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("userId", res.data.userId);
//       localStorage.setItem("username", res.data.username);

//       console.log("Login uğurlu:", res.data);
//       navigate("/profile"); // login sonrası səhifəyə yönləndir
//     } catch (err) {
//       console.error("Login xətası:", err.response?.data || err.message);
//     }
//   };

//   return (
//     <div className="min-h-[80.4vh] p-10 justify-items-center mt-[80px] mb-[50px]">
//       <form
//         onSubmit={handleSubmit}
//         className="max-w-md mx-auto mt-16 mb-10 bg-gradient-to-r from-sky-600 to-fuchsia-500 shadow-lg rounded-xl p-8 space-y-5"
//       >
//         <h2 className="text-2xl font-bold text-center text-gray-800">Daxil Ol</h2>

//         {/* Email */}
//         <div className="flex flex-col">
//           <label className="mb-1 font-medium text-gray-700">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             required
//             className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//           />
//         </div>

//         {/* Şifrə + göz icon */}
//         <div className="flex flex-col relative">
//           <label className="mb-1 font-medium text-gray-700">Şifrə</label>
//           <input
//             ref={passwordRef}
//             type={showPassword ? "text" : "password"} // 👁 toggle
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             required
//             className="border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-9 text-gray-600 hover:text-gray-900"
//           >
//             {showPassword ? (
//               // 👁 Açıq göz (şifrə görünür)
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="22"
//                 height="22"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="1.8"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 viewBox="0 0 24 24"
//               >
//                 <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"></path>
//                 <circle cx="12" cy="12" r="3"></circle>
//               </svg>
//             ) : (
//               // 👁 Bağlı göz (şifrə gizli)
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="22"
//                 height="22"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="1.8"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 viewBox="0 0 24 24"
//               >
//                 <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.4 21.4 0 0 1 5.3-5.94"></path>
//                 <path d="M1 1l22 22"></path>
//                 <path d="M9.88 9.88A3 3 0 0 0 14.12 14.12"></path>
//                 <path d="M15 5.3A10.94 10.94 0 0 1 21 12s-3.35 5.81-8 7.7"></path>
//               </svg>
//             )}
//           </button>
//         </div>

//         {/* Giriş düyməsi */}
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
//         >
//           Giriş
//         </button>
// <p className="text-sm text-right">
//   <Link to="/forgot-password" className="text-white hover:underline font-bold">
//     Şifrəni unutdum?
//   </Link>
// </p>
//         <p>
//           Qeydiyyatınız yoxdur? elə isə{" "}
//           <Link
//             to={`/reqister`}
//             className="text-white hover:underline font-bold cursor: pointer"
//           >
//             Qeydiyyatdan keçin
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }


import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("username", res.data.username);
      navigate("/profile");
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 401) {
        Swal.fire("Email və ya şifrə səhvdir. Zəhmət olmasa düzgün daxil edin.");
      } else {
        Swal.fire("Xəta baş verdi. Zəhmət olmasa bir azdan yenidən cəhd edin.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 space-y-6 animate-fade-in"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 tracking-wide">Xoş Gəlmisiniz</h2>
        <p className="text-center text-gray-600 text-sm">Hesabınıza daxil olun və davam edin</p>

        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 shadow-sm hover:shadow-md"
          />
        </div>

        {/* Şifrə */}
         <div className="flex flex-col relative">
  <label className="mb-1 font-medium text-gray-700">Şifrə</label>
  <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Şifrə"
    className="border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 transform -translate-y-1/8 text-gray-600 hover:text-gray-900"
  >
    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
  </button>
</div>

        {/* Giriş düyməsi */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition duration-300 shadow-lg hover:shadow-xl text-lg"
        >
          Daxil Ol
        </button>

        {/* Qeydiyyat və şifrə */}
        <div className="flex justify-between text-sm text-gray-700">
          <Link to="/forgot-password" className="hover:underline hover:text-purple-800">Şifrəni unutdum?</Link>
          <Link to="/reqister" className="hover:underline hover:text-purple-800">Qeydiyyatdan keçin</Link>
        </div>
      </form>
    </div>
  );
}
