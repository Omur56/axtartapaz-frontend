import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../../components/Main/ThemeContext";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!username.trim() || !password.trim()) {
      setError("İstifadəçi adı və şifrəni daxil edin.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/login`,
        {
          username,
          password,
        },
      );

      localStorage.setItem("adminToken", res.data.token);

      navigate("/AdminPanel");
    } catch (err) {
      console.log(err);

      setError("Daxil etdiyiniz istifadəçi adı və ya şifrə yanlışdır.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        relative min-h-screen
        flex items-center justify-center
        overflow-hidden
        px-4
        transition-colors duration-300
        ${darkMode ? "bg-slate-950" : "bg-slate-50"}
      `}
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            -left-32
            -top-32
            h-80
            w-80
            rounded-full
            bg-[#670fff]/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-32
            -right-32
            h-80
            w-80
            rounded-full
            bg-green-500/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-72
            w-72
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-purple-500/5
            blur-3xl
          "
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className={`
            overflow-hidden
            rounded-[28px]
            border
            shadow-2xl
            backdrop-blur-xl
            ${
              darkMode
                ? "border-white/10 bg-slate-900/90 shadow-black/40"
                : "border-slate-200 bg-white/95 shadow-slate-300/40"
            }
          `}
        >
          {/* Gradient line */}
          <div
            className="
              h-1.5
              bg-gradient-to-r
              from-green-400
              via-[#670fff]
              to-pink-500
            "
          />

          <div className="p-6 sm:p-8">
            {/* Logo */}
            <div className="mb-7 flex justify-center">
              <div
                className="
                  relative
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-[#670fff]
                  to-purple-500
                  shadow-xl
                  shadow-[#670fff]/25
                "
              >
                <ShieldCheck size={34} className="text-white" />

                <div
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    bg-green-500
                    text-white
                    shadow-md
                  "
                >
                  <Sparkles size={12} />
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-7 text-center">
              <h1
                className={`
                  text-2xl
                  sm:text-3xl
                  font-extrabold
                  tracking-tight
                  ${darkMode ? "text-white" : "text-slate-900"}
                `}
              >
                Admin Giriş
              </h1>

              <p
                className={`
                  mt-2
                  text-sm
                  ${darkMode ? "text-slate-400" : "text-slate-500"}
                `}
              >
                ProElan idarəetmə panelinə daxil olun
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                className="
                  mb-5
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border
                  border-red-500/20
                  bg-red-500/10
                  p-3.5
                "
              >
                <AlertCircle
                  size={19}
                  className="
                    mt-0.5
                    shrink-0
                    text-red-500
                  "
                />

                <p className="text-sm font-medium text-red-500">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username */}
              <div>
                <label
                  className={`
                    mb-2
                    block
                    text-sm
                    font-semibold
                    ${darkMode ? "text-slate-300" : "text-slate-700"}
                  `}
                >
                  İstifadəçi adı
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type="text"
                    placeholder="İstifadəçi adınızı daxil edin"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError("");
                    }}
                    autoComplete="username"
                    className={`
                      w-full
                      rounded-xl
                      border
                      py-3.5
                      pl-11
                      pr-4
                      text-sm
                      outline-none
                      transition-all
                      focus:border-[#670fff]
                      focus:ring-4
                      focus:ring-[#670fff]/10
                      ${
                        darkMode
                          ? "border-white/10 bg-slate-800 text-white placeholder:text-slate-500"
                          : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                      }
                    `}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  className={`
                    mb-2
                    block
                    text-sm
                    font-semibold
                    ${darkMode ? "text-slate-300" : "text-slate-700"}
                  `}
                >
                  Şifrə
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Şifrənizi daxil edin"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    autoComplete="current-password"
                    className={`
                      w-full
                      rounded-xl
                      border
                      py-3.5
                      pl-11
                      pr-12
                      text-sm
                      outline-none
                      transition-all
                      focus:border-[#670fff]
                      focus:ring-4
                      focus:ring-[#670fff]/10
                      ${
                        darkMode
                          ? "border-white/10 bg-slate-800 text-white placeholder:text-slate-500"
                          : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                      }
                    `}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      flex
                      h-8
                      w-8
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-lg
                      text-slate-400
                      transition-colors
                      hover:bg-slate-500/10
                      hover:text-[#670fff]
                    "
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  mt-2
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-[#670fff]
                  to-purple-500
                  px-5
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-[#670fff]/25
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-xl
                  hover:shadow-[#670fff]/30
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Daxil olunur...
                  </>
                ) : (
                  <>
                    Admin panelə daxil ol
                    <ArrowRight
                      size={18}
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </>
                )}
              </button>
            </form>

            {/* Security note */}
            <div
              className={`
                mt-6
                flex
                items-center
                justify-center
                gap-2
                text-center
                text-xs
                ${darkMode ? "text-slate-500" : "text-slate-400"}
              `}
            >
              <ShieldCheck size={14} />
              Təhlükəsiz admin girişi
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <p
          className={`
            mt-5
            text-center
            text-xs
            ${darkMode ? "text-slate-600" : "text-slate-400"}
          `}
        >
          © 2026 ProElan.az — Admin Panel
        </p>
      </div>
    </div>
  );
}
