import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import BottomMenu from "../../components/MobileMenu";
import BubbleBackground from "../../components/ui/BubbleBackground";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/login`,
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("username", res.data.username);
      navigate("/profile");
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      if (err.response?.status === 400 || err.response?.status === 401) {
        Swal.fire("Email və ya şifrə səhvdir!");
      } else {
        Swal.fire("Xəta baş verdi. Zəhmət olmasa bir azdan yenidən cəhd edin.");
      }
    }
  };

  return (
    <div className="w-full h-screen">
      <BubbleBackground>
        <div className="flex items-center justify-center min-h-screen px-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 space-y-6"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Xoş Gəlmisiniz
            </h2>
            <p className="text-center text-gray-600 text-sm mb-4">
              Hesabınıza daxil olun
            </p>

            <div className="flex flex-col">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded px-3 py-2 mt-1"
                required
              />
            </div>

            <div className="flex flex-col relative">
              <label>Şifrə</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded px-3 py-2 mt-1"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded mt-4 hover:bg-purple-700"
            >
              Daxil Ol
            </button>

            <div className="flex justify-between text-sm mt-2">
              <Link to="/forgot-password" className="hover:underline">
                Şifrəni unutdum?
              </Link>
              <Link to="/reqister" className="hover:underline">
                Qeydiyyatdan keçin
              </Link>
            </div>
          </form>
        </div>
      </BubbleBackground>
      <BottomMenu />
    </div>
  );
}