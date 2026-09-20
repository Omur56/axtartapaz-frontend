import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  KeyRound,
} from "lucide-react";

import BubbleBackground from "../../components/ui/BubbleBackground";
import BottomMenu from "../../components/MobileMenu";
import { useTheme } from "../../components/Main/ThemeContext";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [searchParams] = useSearchParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);

  // URL-dən email və kodu oxuyuruq
  useEffect(() => {
    const emailParam = searchParams.get("email");
    const codeParam = searchParams.get("code");

    if (emailParam) {
      setEmail(emailParam);
    }

    if (codeParam) {
      setCode(codeParam);
    }
  }, [searchParams]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      return Swal.fire({
        icon: "warning",
        title: "Şifrə tələb olunur",
        text: "Yeni şifrənizi daxil edin.",
        confirmButtonColor: "#670fff",
        background: darkMode ? "#0f172a" : "#ffffff",
        color: darkMode ? "#ffffff" : "#111827",
      });
    }

    if (newPassword.length < 6) {
      return Swal.fire({
        icon: "warning",
        title: "Şifrə çox qısadır",
        text: "Şifrə ən azı 6 simvoldan ibarət olmalıdır.",
        confirmButtonColor: "#670fff",
        background: darkMode ? "#0f172a" : "#ffffff",
        color: darkMode ? "#ffffff" : "#111827",
      });
    }

    if (!confirmPassword) {
      return Swal.fire({
        icon: "warning",
        title: "Şifrəni təsdiqləyin",
        text: "Yeni şifrənizi ikinci xanaya da daxil edin.",
        confirmButtonColor: "#670fff",
        background: darkMode ? "#0f172a" : "#ffffff",
        color: darkMode ? "#ffffff" : "#111827",
      });
    }

    if (newPassword !== confirmPassword) {
      return Swal.fire({
        icon: "error",
        title: "Şifrələr uyğun gəlmir",
        text: "Hər iki şifrə eyni olmalıdır.",
        confirmButtonColor: "#670fff",
        background: darkMode ? "#0f172a" : "#ffffff",
        color: darkMode ? "#ffffff" : "#111827",
      });
    }

    if (!email || !code) {
      return Swal.fire({
        icon: "error",
        title: "Link etibarsızdır",
        text: "Email və ya sıfırlama kodu tapılmadı.",
        confirmButtonColor: "#670fff",
        background: darkMode ? "#0f172a" : "#ffffff",
        color: darkMode ? "#ffffff" : "#111827",
      });
    }

    try {
      setLoading(true);

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
        title: "Şifrə yeniləndi!",
        text: res.data.message,
        timer: 1800,
        showConfirmButton: false,
        background: darkMode ? "#0f172a" : "#ffffff",
        color: darkMode ? "#ffffff" : "#111827",
      });

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
      setLoading(false);
    }
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

      {/* Dekorativ fon */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute -top-32 -left-32
            w-80 h-80
            rounded-full
            bg-purple-500/10
            dark:bg-purple-500/15
            blur-3xl
          "
        />

        <div
          className="
            absolute -bottom-32 -right-32
            w-96 h-96
            rounded-full
            bg-green-400/10
            dark:bg-green-400/10
            blur-3xl
          "
        />

        <div
          className="
            absolute top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            w-72 h-72
            rounded-full
            bg-violet-500/5
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
          {/* Geri */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="
              mb-5
              flex items-center gap-2
              text-sm font-medium
              text-slate-500 dark:text-slate-400
              hover:text-purple-600
              dark:hover:text-purple-400
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
              border border-slate-200/70
              dark:border-white/10
              bg-white/85
              dark:bg-slate-900/80
              backdrop-blur-2xl
              shadow-[0_25px_80px_rgba(15,23,42,0.12)]
              dark:shadow-[0_25px_80px_rgba(0,0,0,0.35)]
              p-6 sm:p-8
            "
          >
            {/* Gradient xətt */}
            <div
              className="
                absolute top-0 left-0 right-0 h-1
                bg-gradient-to-r
                from-purple-600
                via-violet-500
                to-green-400
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
                  from-purple-600
                  to-violet-500
                  shadow-lg
                  shadow-purple-500/25
                "
              >
                <KeyRound size={30} className="text-white" />
              </div>
            </div>

            {/* Başlıq */}
            <div className="text-center mb-7">
              <h1
                className="
                  text-2xl sm:text-3xl
                  font-extrabold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                "
              >
                Şifrəni yenilə
              </h1>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Hesabınız üçün yeni şifrə təyin edin.
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-5">
              {/* Yeni şifrə */}
              <div>
                <label
                  className="
                    block mb-2
                    text-sm font-semibold
                    text-slate-700
                    dark:text-slate-300
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
                    placeholder="Yeni şifrənizi daxil edin"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    className="
                      w-full
                      h-13
                      rounded-2xl
                      border
                      border-slate-200
                      dark:border-slate-700
                      bg-slate-50
                      dark:bg-slate-950/60
                      text-slate-900
                      dark:text-white
                      placeholder:text-slate-400
                      pl-12 pr-12
                      outline-none
                      transition-all
                      focus:border-purple-500
                      focus:ring-4
                      focus:ring-purple-500/10
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

                {/* Şifrə qaydası */}
                <p
                  className="
                    mt-2
                    text-xs
                    text-slate-400
                  "
                >
                  Ən azı 6 simvol istifadə edin.
                </p>
              </div>

              {/* Şifrə təsdiqi */}
              <div>
                <label
                  className="
                    block mb-2
                    text-sm font-semibold
                    text-slate-700
                    dark:text-slate-300
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
                    placeholder="Şifrəni yenidən daxil edin"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    className={`
                      w-full
                      h-13
                      rounded-2xl
                      border
                      bg-slate-50
                      dark:bg-slate-950/60
                      text-slate-900
                      dark:text-white
                      placeholder:text-slate-400
                      pl-12 pr-12
                      outline-none
                      transition-all
                      ${
                        confirmPassword
                          ? newPassword === confirmPassword
                            ? "border-green-500 focus:border-green-500 focus:ring-green-500/10"
                            : "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                          : "border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/10"
                      }
                      focus:ring-4
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

                {/* Uyğunluq */}
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

              {/* Yenilə düyməsi */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  h-13
                  flex items-center justify-center gap-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-green-500
                  to-emerald-500
                  text-white
                  font-bold
                  shadow-lg
                  shadow-green-500/20
                  hover:-translate-y-0.5
                  hover:shadow-xl
                  hover:shadow-green-500/25
                  active:translate-y-0
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  transition-all
                "
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Yenilənir...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={19} />
                    Şifrəni Yenilə
                  </>
                )}
              </button>
            </form>

            {/* Təhlükəsizlik məlumatı */}
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
                className="
                  mt-0.5
                  shrink-0
                  text-green-500
                "
              />

              <p
                className="
                  text-xs
                  leading-5
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Şifrənizi yenilədikdən sonra hesabınıza yeni şifrənizlə daxil
                ola bilərsiniz.
              </p>
            </div>

            {/* Login */}
            <p
              className="
                mt-6
                text-center
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Artıq şifrənizi yeniləmisiniz?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="
                  font-bold
                  text-purple-600
                  dark:text-purple-400
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
    </div>
  );
}
