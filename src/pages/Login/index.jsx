import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faEnvelope,
  faLock,
  faArrowRight,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import BottomMenu from "../../components/MobileMenu";
import BubbleBackground from "../../components/ui/BubbleBackground";
import { useTheme } from "../../components/Main/ThemeContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/login`,
        { email, password },
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("username", res.data.username);

      navigate("/profile");
    } catch (err) {
      console.error("Login error:", err.response?.data || err);

      if (err.response?.status === 400 || err.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Giriş mümkün olmadı",
          text: "Email və ya şifrə səhvdir.",
          confirmButtonText: "Bağla",
          confirmButtonColor: "#670fff",
          background: darkMode ? "#0f172a" : "#ffffff",
          color: darkMode ? "#ffffff" : "#111827",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Xəta baş verdi",
          text: "Zəhmət olmasa bir azdan yenidən cəhd edin.",
          confirmButtonText: "Bağla",
          confirmButtonColor: "#670fff",
          background: darkMode ? "#0f172a" : "#ffffff",
          color: darkMode ? "#ffffff" : "#111827",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        relative
        min-h-screen
        w-full
        overflow-hidden

        transition-colors
        duration-300
        rounded-[28px]
       

        ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}
      `}
    >
      {/* Background */}
      <BubbleBackground />

      {/* Decorative gradients */}
      <div
        className="
          pointer-events-none
          absolute
          -top-32
          -right-32

          w-72
          h-72

          rounded-full

          bg-purple-500/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          -left-32

          w-72
          h-72

          rounded-full

          bg-green-500/10
          blur-3xl
        "
      />

      {/* Main */}
      <div
        className="
        relative
        z-10

        flex
        items-center
        justify-center

        min-h-screen

        px-4
        py-24
        pb-28
      "
      >
        <form
          onSubmit={handleSubmit}
          className={`
            relative

            w-full
            max-w-[430px]

            rounded-[28px]

            p-6
            sm:p-8

            border

            shadow-2xl

            backdrop-blur-2xl

            transition-all
            duration-300

            ${
              darkMode
                ? `
                  bg-slate-900/80
                  border-white/10
                  shadow-black/40
                `
                : `
                  bg-white/85
                  border-slate-200/80
                  shadow-slate-200/70
                `
            }
          `}
        >
          {/* Top glow */}
          <div
            className="
              absolute
              top-0
              left-1/2
              -translate-x-1/2

              w-32
              h-1

              rounded-b-full

              bg-gradient-to-r
              from-[#670fff]
              via-[#8b5cf6]
              to-[#43D262]
            "
          />

          {/* Logo */}
          <div className="flex justify-center mb-5">
            <div
              className="
                relative

                w-16
                h-16

                rounded-2xl

                bg-gradient-to-br
                from-green-400
                via-emerald-500
                to-green-600

                flex
                items-center
                justify-center

                shadow-xl
                shadow-green-500/20

                ring-4
                ring-green-500/10
              "
            >
              <div
                className="
                w-7
                h-7

                rounded-full

                bg-white

                shadow-sm
              "
              />

              <div
                className="
                  absolute

                  w-3.5
                  h-3.5

                  rounded-full

                  bg-green-500
                "
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-7">
            <h1
              className={`
                text-2xl
                sm:text-3xl

                font-extrabold

                tracking-tight

                ${darkMode ? "text-white" : "text-slate-900"}
              `}
            >
              Xoş gəlmisiniz
            </h1>

            <p
              className={`
                mt-2
                text-sm

                ${darkMode ? "text-slate-400" : "text-slate-500"}
              `}
            >
              ProElan hesabınıza daxil olun
            </p>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label
              htmlFor="login-email"
              className={`
                block
                text-sm
                font-semibold
                mb-2

                ${darkMode ? "text-slate-200" : "text-slate-700"}
              `}
            >
              Email
            </label>

            <div className="relative group">
              <div
                className={`
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2

                  w-9
                  h-9

                  rounded-lg

                  flex
                  items-center
                  justify-center

                  transition-colors

                  ${
                    darkMode
                      ? "bg-white/5 text-slate-400 group-focus-within:text-purple-400"
                      : "bg-slate-100 text-slate-400 group-focus-within:text-[#670fff]"
                  }
                `}
              >
                <FontAwesomeIcon icon={faEnvelope} size="sm" />
              </div>

              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                autoComplete="email"
                className={`
                  w-full
                  h-[54px]

                  pl-[60px]
                  pr-4

                  rounded-2xl

                  border

                  outline-none

                  text-sm

                  transition-all
                  duration-200

                  ${
                    darkMode
                      ? `
                        bg-white/5
                        border-white/10
                        text-white
                        placeholder:text-slate-500
                        focus:border-[#670fff]/60
                        focus:bg-white/[0.07]
                        focus:ring-4
                        focus:ring-[#670fff]/10
                      `
                      : `
                        bg-slate-50
                        border-slate-200
                        text-slate-900
                        placeholder:text-slate-400
                        focus:border-[#670fff]/50
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#670fff]/10
                      `
                  }
                `}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="login-password"
                className={`
                  text-sm
                  font-semibold

                  ${darkMode ? "text-slate-200" : "text-slate-700"}
                `}
              >
                Şifrə
              </label>
            </div>

            <div className="relative group">
              <div
                className={`
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2

                  w-9
                  h-9

                  rounded-lg

                  flex
                  items-center
                  justify-center

                  ${
                    darkMode
                      ? "bg-white/5 text-slate-400 group-focus-within:text-purple-400"
                      : "bg-slate-100 text-slate-400 group-focus-within:text-[#670fff]"
                  }
                `}
              >
                <FontAwesomeIcon icon={faLock} size="sm" />
              </div>

              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrənizi daxil edin"
                autoComplete="current-password"
                className={`
                  w-full
                  h-[54px]

                  pl-[60px]
                  pr-[55px]

                  rounded-2xl

                  border

                  outline-none

                  text-sm

                  transition-all
                  duration-200

                  ${
                    darkMode
                      ? `
                        bg-white/5
                        border-white/10
                        text-white
                        placeholder:text-slate-500
                        focus:border-[#670fff]/60
                        focus:bg-white/[0.07]
                        focus:ring-4
                        focus:ring-[#670fff]/10
                      `
                      : `
                        bg-slate-50
                        border-slate-200
                        text-slate-900
                        placeholder:text-slate-400
                        focus:border-[#670fff]/50
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#670fff]/10
                      `
                  }
                `}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"}
                className={`
                  absolute
                  right-2
                  top-1/2
                  -translate-y-1/2

                  w-10
                  h-10

                  rounded-xl

                  flex
                  items-center
                  justify-center

                  transition-all

                  ${
                    darkMode
                      ? "text-slate-400 hover:bg-white/10 hover:text-white"
                      : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  }
                `}
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end mb-6">
            <Link
              to="/forgot-password"
              className="
                text-sm
                font-semibold

                text-[#670fff]

                hover:text-[#5200df]

                no-underline
                hover:underline

                transition-colors
              "
            >
              Şifrəni unutdum?
            </Link>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className={`
              group

              relative

              w-full
              h-[54px]

              rounded-2xl

              overflow-hidden

              bg-gradient-to-r
              from-[#670fff]
              via-[#7c3aed]
              to-[#8b5cf6]

              text-white
              font-bold
              text-sm

              shadow-lg
              shadow-purple-500/25

              transition-all
              duration-300

              ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/30 active:scale-[0.98]"
              }
            `}
          >
            {/* Shine */}
            {!loading && (
              <span
                className="
                  absolute
                  inset-0

                  bg-gradient-to-r
                  from-transparent
                  via-white/15
                  to-transparent

                  -translate-x-full
                  group-hover:translate-x-full

                  transition-transform
                  duration-700
                "
              />
            )}

            <span
              className="
              relative
              flex
              items-center
              justify-center
              gap-2
            "
            >
              {loading ? (
                <>
                  <span
                    className="
                      w-4
                      h-4

                      rounded-full

                      border-2
                      border-white/30
                      border-t-white

                      animate-spin
                    "
                  />
                  Giriş edilir...
                </>
              ) : (
                <>
                  Daxil ol
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </>
              )}
            </span>
          </button>

          {/* Security */}
          <div
            className={`
              flex
              items-center
              justify-center
              gap-2

              mt-5

              text-[11px]

              ${darkMode ? "text-slate-500" : "text-slate-400"}
            `}
          >
            <FontAwesomeIcon icon={faShieldHalved} className="text-green-500" />
            Hesabınız təhlükəsiz şəkildə qorunur
          </div>

          {/* Register */}
          <div
            className={`
              flex
              items-center
              justify-center
              gap-2

              mt-6
              pt-5

              border-t

              text-sm

              ${
                darkMode
                  ? "border-white/10 text-slate-400"
                  : "border-slate-200 text-slate-500"
              }
            `}
          >
            <span>Hesabınız yoxdur?</span>

            <Link
              to="/register"
              className="
                font-bold
                text-[#670fff]

                no-underline

                hover:underline
              "
            >
              Qeydiyyatdan keçin
            </Link>
          </div>
        </form>
      </div>

      {/* Mobile navigation */}
      <BottomMenu />
    </div>
  );
}
