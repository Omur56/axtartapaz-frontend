import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  X,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import BubbleBackground from "../../components/ui/BubbleBackground";
import BottomMenu from "../../components/MobileMenu";
import { useTheme } from "../../components/Main/ThemeContext";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Modal açıq olduqda arxa səhifənin scroll-u dayanır
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Email tələb olunur",
        text: "Email ünvanınızı daxil edin.",
        confirmButtonColor: "#670fff",
      });
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/forgot-password`,
        {
          email: email.trim(),
        },
      );

      await Swal.fire({
        icon: "success",
        title: "Kod göndərildi",
        text: res.data.message,
        timer: 1600,
        showConfirmButton: false,
        background: darkMode ? "#0f172a" : "#ffffff",
        color: darkMode ? "#ffffff" : "#111827",
      });

      setShowModal(true);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Xəta",
        text:
          err.response?.data?.message || "Kod göndərilərkən xəta baş verdi.",
        confirmButtonColor: "#670fff",
        background: darkMode ? "#0f172a" : "#ffffff",
        color: darkMode ? "#ffffff" : "#111827",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!code.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Kod tələb olunur",
        text: "Emailinizə göndərilən 6 rəqəmli kodu daxil edin.",
        confirmButtonColor: "#670fff",
      });
    }

    if (code.length !== 6) {
      return Swal.fire({
        icon: "warning",
        title: "Kod düzgün deyil",
        text: "Kod 6 rəqəmdən ibarət olmalıdır.",
        confirmButtonColor: "#670fff",
      });
    }

    if (!newPassword) {
      return Swal.fire({
        icon: "warning",
        title: "Şifrə tələb olunur",
        text: "Yeni şifrənizi daxil edin.",
        confirmButtonColor: "#670fff",
      });
    }

    if (newPassword.length < 6) {
      return Swal.fire({
        icon: "warning",
        title: "Şifrə çox qısadır",
        text: "Şifrə ən azı 6 simvoldan ibarət olmalıdır.",
        confirmButtonColor: "#670fff",
      });
    }

    if (!confirmPassword) {
      return Swal.fire({
        icon: "warning",
        title: "Şifrəni təsdiqləyin",
        text: "Yeni şifrənizi ikinci xanaya da daxil edin.",
        confirmButtonColor: "#670fff",
      });
    }

    if (newPassword !== confirmPassword) {
      return Swal.fire({
        icon: "error",
        title: "Şifrələr uyğun gəlmir",
        text: "Hər iki şifrə eyni olmalıdır.",
        confirmButtonColor: "#670fff",
      });
    }

    try {
      setResetLoading(true);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/reset-password`,
        {
          email,
          code,
          newPassword,
        },
      );

      await Swal.fire({
        icon: "success",
        title: "Şifrə yeniləndi",
        text: res.data.message,
        timer: 1800,
        showConfirmButton: false,
        background: darkMode ? "#0f172a" : "#ffffff",
        color: darkMode ? "#ffffff" : "#111827",
      });

      setShowModal(false);
      setEmail("");
      setCode("");
      setNewPassword("");
      setConfirmPassword("");

      navigate("/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Xəta",
        text:
          err.response?.data?.message || "Şifrə yenilənərkən xəta baş verdi.",
        confirmButtonColor: "#670fff",
        background: darkMode ? "#0f172a" : "#ffffff",
        color: darkMode ? "#ffffff" : "#111827",
      });
    } finally {
      setResetLoading(false);
    }
  };

  const closeModal = () => {
    if (resetLoading) return;

    setShowModal(false);
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div
      className="
        relative min-h-screen overflow-hidden
        bg-slate-50 dark:bg-slate-950
        text-slate-900 dark:text-white
        transition-colors duration-300
      "
    >
      <BubbleBackground />

      {/* Arxa dekorativ gradientlər */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute -top-32 -left-32
            w-72 h-72
            rounded-full
            bg-purple-500/10
            dark:bg-purple-500/15
            blur-3xl
          "
        />

        <div
          className="
            absolute -bottom-32 -right-32
            w-80 h-80
            rounded-full
            bg-green-400/10
            dark:bg-green-400/10
            blur-3xl
          "
        />
      </div>

      {/* Əsas hissə */}
      <main
        className="
          relative z-10
          min-h-screen
          flex items-center justify-center
          px-4
          pt-20
          pb-24
        "
      >
        <div className="w-full max-w-md">
          {/* Geri qayıt */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="
              mb-5
              flex items-center gap-2
              text-sm font-medium
              text-slate-500 dark:text-slate-400
              hover:text-purple-600 dark:hover:text-purple-400
              transition-colors
            "
          >
            <ArrowLeft size={18} />
            Giriş səhifəsinə qayıt
          </button>

          {/* Kart */}
          <div
            className="
              relative overflow-hidden
              rounded-[28px]
              border border-slate-200/70 dark:border-white/10
              bg-white/85 dark:bg-slate-900/80
              backdrop-blur-2xl
              shadow-[0_25px_80px_rgba(15,23,42,0.12)]
              dark:shadow-[0_25px_80px_rgba(0,0,0,0.35)]
              p-6 sm:p-8
            "
          >
            {/* Üst gradient xətt */}
            <div
              className="
                absolute top-0 left-0 right-0 h-1
                bg-gradient-to-r
                from-purple-600 via-violet-500 to-green-400
              "
            />

            {/* İkon */}
            <div className="flex justify-center mb-5">
              <div
                className="
                  flex items-center justify-center
                  w-16 h-16
                  rounded-2xl
                  bg-gradient-to-br
                  from-purple-600 to-violet-500
                  shadow-lg shadow-purple-500/25
                "
              >
                <KeyRound size={30} strokeWidth={2} className="text-white" />
              </div>
            </div>

            {/* Başlıq */}
            <div className="text-center mb-7">
              <h1
                className="
                  text-2xl sm:text-3xl
                  font-extrabold
                  tracking-tight
                  text-slate-900 dark:text-white
                "
              >
                Şifrəni unutdunuz?
              </h1>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-slate-500 dark:text-slate-400
                "
              >
                Email ünvanınızı daxil edin və şifrə sıfırlama kodunu alın.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  className="
                    block mb-2
                    text-sm font-semibold
                    text-slate-700 dark:text-slate-300
                  "
                >
                  Email ünvanı
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="
                      w-full
                      h-[2.75rem]
                      rounded-2xl
                      border border-slate-200 dark:border-slate-700
                      bg-slate-50 dark:bg-slate-950/60
                      text-slate-900 dark:text-white
                      placeholder:text-slate-400
                      pl-12 pr-4
                      outline-none
                      transition-all duration-200
                      focus:border-purple-500
                      focus:ring-4 focus:ring-purple-500/10
                    "
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  w-full
                  h-[2.75rem]
                  flex items-center justify-center gap-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-purple-600 to-violet-500
                  text-white
                  font-bold
                  shadow-lg shadow-purple-500/20
                  hover:shadow-xl hover:shadow-purple-500/25
                  hover:-translate-y-0.5
                  active:translate-y-0
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  transition-all duration-200
                "
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Göndərilir...
                  </>
                ) : (
                  <>
                    <Mail size={19} />
                    Kod Göndər
                  </>
                )}
              </button>
            </form>

            {/* Alt məlumat */}
            <div
              className="
                mt-6
                flex items-start gap-3
                rounded-2xl
                border border-green-500/10
                bg-green-500/5
                p-4
              "
            >
              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-green-500"
              />

              <p
                className="
                  text-xs leading-5
                  text-slate-500 dark:text-slate-400
                "
              >
                Təhlükəsizlik məqsədilə sizə email vasitəsilə birdəfəlik
                sıfırlama kodu göndəriləcək.
              </p>
            </div>

            {/* Login */}
            <p
              className="
                mt-6
                text-center
                text-sm
                text-slate-500 dark:text-slate-400
              "
            >
              Hesabınız var?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="
                  font-bold
                  text-purple-600 dark:text-purple-400
                  hover:underline
                "
              >
                Daxil olun
              </button>
            </p>
          </div>
        </div>
      </main>

      <BottomMenu />

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          className="
            fixed inset-0
            z-[9999]
            flex items-center justify-center
            p-4
            bg-slate-950/70
            backdrop-blur-md
          "
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className="
              relative
              w-full max-w-md
              max-h-[90vh]
              overflow-y-auto
              rounded-[28px]
              border border-slate-200/70 dark:border-white/10
              bg-white dark:bg-slate-900
              shadow-2xl
              p-6 sm:p-8
              animate-fade-in
            "
          >
            {/* Gradient xətt */}
            <div
              className="
                absolute top-0 left-0 right-0 h-1
                bg-gradient-to-r
                from-purple-600 via-violet-500 to-green-400
              "
            />

            {/* Bağla */}
            <button
              type="button"
              onClick={closeModal}
              disabled={resetLoading}
              aria-label="Bağla"
              className="
                absolute top-4 right-4
                flex items-center justify-center
                w-9 h-9
                rounded-xl
                text-slate-400
                hover:text-slate-700
                dark:hover:text-white
                hover:bg-slate-100
                dark:hover:bg-slate-800
                disabled:opacity-40
                transition-all
              "
            >
              <X size={19} />
            </button>

            {/* Modal ikon */}
            <div className="flex justify-center mt-2 mb-5">
              <div
                className="
                  flex items-center justify-center
                  w-14 h-14
                  rounded-2xl
                  bg-purple-500/10
                  text-purple-600
                  dark:text-purple-400
                "
              >
                <LockKeyhole size={27} />
              </div>
            </div>

            <div className="text-center mb-7">
              <h2
                className="
                  text-2xl font-extrabold
                  text-slate-900 dark:text-white
                "
              >
                Şifrəni yenilə
              </h2>

              <p
                className="
                  mt-2
                  text-sm leading-5
                  text-slate-500 dark:text-slate-400
                "
              >
                Emailinizə göndərilən 6 rəqəmli kodu daxil edin.
              </p>
            </div>

            <div className="space-y-4">
              {/* Kod */}
              <div>
                <label
                  className="
                    block mb-2
                    text-sm font-semibold
                    text-slate-700 dark:text-slate-300
                  "
                >
                  Təsdiq kodu
                </label>

                <div className="relative">
                  <ShieldCheck
                    size={19}
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={code}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);

                      setCode(value);
                    }}
                    className="
                      w-full
                      h-[2.75rem]
                      rounded-2xl
                      border border-slate-200 dark:border-slate-700
                      bg-slate-50 dark:bg-slate-950/60
                      text-slate-900 dark:text-white
                      text-center
                      text-xl
                      font-bold
                      tracking-[0.45em]
                      pl-12 pr-4
                      outline-none
                      focus:border-purple-500
                      focus:ring-4 focus:ring-purple-500/10
                      transition-all
                    "
                  />
                </div>
              </div>

              {/* Yeni şifrə */}
              <div>
                <label
                  className="
                    block mb-2
                    text-sm font-semibold
                    text-slate-700 dark:text-slate-300
                  "
                >
                  Yeni şifrə
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Yeni şifrəniz"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    className="
                      w-full
                      h-[2.75rem]
                      rounded-2xl
                      border border-slate-200 dark:border-slate-700
                      bg-slate-50 dark:bg-slate-950/60
                      text-slate-900 dark:text-white
                      placeholder:text-slate-400
                      pl-12 pr-12
                      outline-none
                      focus:border-purple-500
                      focus:ring-4 focus:ring-purple-500/10
                      transition-all
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="
                      absolute right-3 top-1/2
                      -translate-y-1/2
                      flex items-center justify-center
                      w-9 h-9
                      rounded-xl
                      text-slate-400
                      hover:text-purple-600
                      dark:hover:text-purple-400
                      hover:bg-slate-100
                      dark:hover:bg-slate-800
                      transition-all
                    "
                    aria-label={
                      showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"
                    }
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Şifrə təsdiqi */}
              <div>
                <label
                  className="
                    block mb-2
                    text-sm font-semibold
                    text-slate-700 dark:text-slate-300
                  "
                >
                  Şifrəni təsdiqlə
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Şifrəni yenidən yazın"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className={`
                      w-full
                      h-[2.75rem]
                      rounded-2xl
                      border
                      bg-slate-50 dark:bg-slate-950/60
                      text-slate-900 dark:text-white
                      placeholder:text-slate-400
                      pl-12 pr-12
                      outline-none
                      transition-all
                      focus:ring-4
                      ${
                        confirmPassword
                          ? newPassword === confirmPassword
                            ? "border-green-500 focus:border-green-500 focus:ring-green-500/10"
                            : "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                          : "border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/10"
                      }
                    `}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="
                      absolute right-3 top-1/2
                      -translate-y-1/2
                      flex items-center justify-center
                      w-9 h-9
                      rounded-xl
                      text-slate-400
                      hover:text-purple-600
                      dark:hover:text-purple-400
                      hover:bg-slate-100
                      dark:hover:bg-slate-800
                      transition-all
                    "
                    aria-label={
                      showConfirmPassword ? "Şifrəni gizlət" : "Şifrəni göstər"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                {/* Şifrə uyğunluq göstəricisi */}
                {confirmPassword && (
                  <div
                    className={`
                      mt-2
                      flex items-center gap-1.5
                      text-xs font-medium
                      ${
                        newPassword === confirmPassword
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    `}
                  >
                    <CheckCircle2 size={14} />
                    {newPassword === confirmPassword
                      ? "Şifrələr uyğun gəlir"
                      : "Şifrələr uyğun gəlmir"}
                  </div>
                )}
              </div>

              {/* Düymələr */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={resetLoading}
                  className="
                    flex-1
                    h-[2.75rem]
                    rounded-2xl
                    border border-slate-200
                    dark:border-slate-700
                    bg-white
                    dark:bg-slate-800
                    text-slate-700
                    dark:text-slate-200
                    font-semibold
                    hover:bg-slate-50
                    dark:hover:bg-slate-700
                    disabled:opacity-50
                    transition-all
                  "
                >
                  Ləğv et
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={resetLoading}
                  className="
                    flex-1
                    h-12
                    flex items-center justify-center gap-2
                    rounded-2xl
                    bg-gradient-to-r
                    from-green-500 to-emerald-500
                    text-white
                    font-bold
                    shadow-lg shadow-green-500/20
                    hover:-translate-y-0.5
                    hover:shadow-xl
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    transition-all
                  "
                >
                  {resetLoading ? (
                    <>
                      <Loader2 size={19} className="animate-spin" />
                      Yenilənir...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={19} />
                      Şifrəni Yenilə
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
