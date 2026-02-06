import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import InputMask from "react-input-mask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import BottomMenu from "../../components/MobileMenu";
import BubbleBackground from "../../components/ui/BubbleBackground";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Xəta",
        text: "Şifrələr eyni deyil!",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reqister`,
        {
          username,
          email,
          password,
          phone: `+994${phone}`,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Uğurla qeydiyyat tamamlandı!",
        text: "İndi daxil ola bilərsiniz",
        confirmButtonColor: "#3085d6",
      });

      navigate("/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text: err.response?.data?.message || "Server xətası",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <>
    <BubbleBackground>
    <div className="min-h-screen mt-12  flex flex-col w-full items-center justify-center px-4">
      <form
        onSubmit={handleRegister}
        className="w-full flex flex-col max-w-md min-h-[600px] bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 space-y-6 animate-fade-in"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 tracking-wide">
          Qeydiyyat
        </h2>
        <p className="text-center text-gray-600 text-sm">
          Yeni hesab yaradın və davam edin
        </p>

        {/* Username */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium text-gray-700">
            İstifadəçi Ad
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="İstifadəçi adınızı daxil edin"
            required
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 shadow-sm hover:shadow-md"
          />
        </div>

        {/* Telefon */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium text-gray-700">Mobil Nömrə</label>
          <InputMask
            mask="99 999 99 99"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="555 55 55 55"
          >
            {(inputProps) => (
              <div className="flex">
                <span className="px-3 py-2 bg-gray-200 rounded-l border border-r-0 border-gray-300">
                  +994
                </span>
                <input
                  {...inputProps}
                  className="border border-gray-300 rounded-r px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 shadow-sm hover:shadow-md"
                  required
                />
              </div>
            )}
          </InputMask>
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="border border-gray-300 rounded-xl px-4 py-3 pr-10 h-12 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 shadow-sm hover:shadow-md"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col relative">
          <label className="mb-2 font-medium text-gray-700">Şifrə</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifrə"
            required
            className="border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 shadow-sm hover:shadow-md"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/8 text-gray-600 hover:text-gray-900"
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </button>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col relative">
          <label className="mb-2 font-medium text-gray-700">
            Şifrəni təkrar yazın
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Təkrar şifrəni yazın"
            required
            className="border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 shadow-sm hover:shadow-md"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/8 text-gray-600 hover:text-gray-900"
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition duration-300 shadow-lg hover:shadow-xl text-lg"
        >
          Qeydiyyatdan keç
        </button>

        {/* Login link */}
        <p className="text-center text-sm text-gray-700">
          Hesabınız var?{" "}
          <Link
            to="/login"
            className="text-purple-700 font-bold hover:underline"
          >
            Daxil olun
          </Link>
        </p>
      </form>
    </div>
    </BubbleBackground>
    </>
  );
}
