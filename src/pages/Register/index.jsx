import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import InputMask from "react-input-mask";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faUser,
  faEnvelope,
  faPhone,
  faLock,
  faUserPlus,
  faShieldHalved,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import BottomMenu from "../../components/MobileMenu";
import BubbleBackground from "../../components/ui/BubbleBackground";
import { useTheme } from "../../components/Main/ThemeContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Xəta",
        text: "Şifrələr eyni deyil!",
        confirmButtonColor: "#670fff",
        background: darkMode ? "#0f172a" : "#ffffff",
        color: darkMode ? "#ffffff" : "#111827",
      });

      return;
    }

    setLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, {
        username,
        email,
        password,
        phone: `+994${phone}`,
      });

      await Swal.fire({
        icon: "success",
        title: "Qeydiyyat tamamlandı!",
        text: "Hesabınız uğurla yaradıldı. İndi daxil ola bilərsiniz.",
        confirmButtonText: "Daxil ol",
        confirmButtonColor: "#670fff",
        background: darkMode ? "#0f172a" : "#ffffff",
        color: darkMode ? "#ffffff" : "#111827",
      });

      navigate("/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text:
          err.response?.data?.message ||
          "Server xətası. Zəhmət olmasa yenidən cəhd edin.",
        confirmButtonText: "Bağla",
        confirmButtonColor: "#670fff",
        background: darkMode ? "#0f172a" : "#ffffff",
        color: darkMode ? "#ffffff" : "#111827",
      });
    } finally {
      setLoading(false);
    }
  };

  /*
   * Ümumi input dizaynı
   */
  const inputClass = `
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
  `;

  const labelClass = `
    block
    text-sm
    font-semibold
    mb-2

    ${darkMode ? "text-slate-200" : "text-slate-700"}
  `;

  const iconClass = `
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

    ${darkMode ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-400"}
  `;

  return (
    <div
      className={`
        relative
        min-h-screen
        w-full

        overflow-hidden

        transition-colors
        duration-300

        ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}
      `}
    >
      {/* Background */}
      <BubbleBackground />

      {/* Dekorativ gradientlər */}
      <div
        className="
          pointer-events-none
          absolute
          -top-32
          -right-32

          w-80
          h-80

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

          w-80
          h-80

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
          onSubmit={handleRegister}
          className={`
            relative

            w-full
            max-w-[470px]

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
          {/* Üst dekorativ xətt */}
          <div
            className="
              absolute
              top-0
              left-1/2
              -translate-x-1/2

              w-36
              h-1

              rounded-b-full

              bg-gradient-to-r
              from-[#670fff]
              via-[#8b5cf6]
              to-[#43D262]
            "
          />

          {/* Logo / Icon */}
          <div className="flex justify-center mb-5">
            <div
              className="
                relative

                w-16
                h-16

                rounded-2xl

                bg-gradient-to-br
                from-[#670fff]
                via-[#7c3aed]
                to-[#8b5cf6]

                flex
                items-center
                justify-center

                shadow-xl
                shadow-purple-500/25

                ring-4
                ring-purple-500/10
              "
            >
              <FontAwesomeIcon
                icon={faUserPlus}
                className="text-white text-2xl"
              />
            </div>
          </div>

          {/* Başlıq */}
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
              Hesab yaradın
            </h1>

            <p
              className={`
                mt-2
                text-sm

                ${darkMode ? "text-slate-400" : "text-slate-500"}
              `}
            >
              ProElan-a qoşulun və elanlarınızı paylaşın
            </p>
          </div>

          {/* Username */}
          <div className="mb-5">
            <label htmlFor="register-username" className={labelClass}>
              İstifadəçi adı
            </label>

            <div className="relative group">
              <div className={iconClass}>
                <FontAwesomeIcon icon={faUser} size="sm" />
              </div>

              <input
                id="register-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="İstifadəçi adınızı daxil edin"
                autoComplete="username"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Telefon */}
          <div className="mb-5">
            <label htmlFor="register-phone" className={labelClass}>
              Mobil nömrə
            </label>

            <InputMask
              mask="99 999 99 99"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            >
              {(inputProps) => (
                <div className="relative flex">
                  {/* +994 */}
                  <div
                    className={`
                      absolute
                      left-0
                      top-0
                      bottom-0

                      w-[58px]

                      rounded-l-2xl

                      flex
                      items-center
                      justify-center

                      text-xs
                      font-bold

                      border
                      border-r-0

                      z-10

                      ${
                        darkMode
                          ? `
                            bg-white/10
                            border-white/10
                            text-slate-200
                          `
                          : `
                            bg-slate-100
                            border-slate-200
                            text-slate-700
                          `
                      }
                    `}
                  >
                    +994
                  </div>

                  <input
                    {...inputProps}
                    id="register-phone"
                    type="tel"
                    placeholder="55 555 55 55"
                    autoComplete="tel"
                    className={`
                      ${inputClass}

                      !pl-[75px]
                    `}
                    required
                  />
                </div>
              )}
            </InputMask>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label htmlFor="register-email" className={labelClass}>
              Email
            </label>

            <div className="relative group">
              <div className={iconClass}>
                <FontAwesomeIcon icon={faEnvelope} size="sm" />
              </div>

              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                autoComplete="email"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Şifrə */}
          <div className="mb-5">
            <label htmlFor="register-password" className={labelClass}>
              Şifrə
            </label>

            <div className="relative group">
              <div className={iconClass}>
                <FontAwesomeIcon icon={faLock} size="sm" />
              </div>

              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrənizi daxil edin"
                autoComplete="new-password"
                className={`
                  ${inputClass}
                  !pr-[55px]
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

          {/* Təkrar şifrə */}
          <div className="mb-6">
            <label htmlFor="register-confirm-password" className={labelClass}>
              Şifrəni təkrar yazın
            </label>

            <div className="relative group">
              <div className={iconClass}>
                <FontAwesomeIcon icon={faLock} size="sm" />
              </div>

              <input
                id="register-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifrənizi yenidən yazın"
                autoComplete="new-password"
                className={`
                  ${inputClass}
                  !pr-[55px]

                  ${
                    confirmPassword && password !== confirmPassword
                      ? "!border-red-400 focus:!border-red-500 focus:!ring-red-500/10"
                      : ""
                  }

                  ${
                    confirmPassword && password === confirmPassword
                      ? "!border-green-400"
                      : ""
                  }
                `}
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword
                    ? "Təkrar şifrəni gizlət"
                    : "Təkrar şifrəni göstər"
                }
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
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEye : faEyeSlash}
                />
              </button>
            </div>

            {/* Şifrə uyğunluğu */}
            {confirmPassword && (
              <p
                className={`
                  text-[11px]
                  mt-2
                  font-semibold

                  ${
                    password === confirmPassword
                      ? "text-green-500"
                      : "text-red-500"
                  }
                `}
              >
                {password === confirmPassword
                  ? "✓ Şifrələr uyğun gəlir"
                  : "✕ Şifrələr uyğun deyil"}
              </p>
            )}
          </div>

          {/* Submit */}
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
                  Qeydiyyat edilir...
                </>
              ) : (
                <>
                  Qeydiyyatdan keç
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

          {/* Təhlükəsizlik */}
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
            Məlumatlarınız təhlükəsiz şəkildə qorunur
          </div>

          {/* Login */}
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
            <span>Artıq hesabınız var?</span>

            <Link
              to="/login"
              className="
                font-bold
                text-[#670fff]

                no-underline
                hover:underline
              "
            >
              Daxil olun
            </Link>
          </div>
        </form>
      </div>

      {/* Mobile navigation */}
      <BottomMenu />
    </div>
  );
}
