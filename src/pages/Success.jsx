import React from "react";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, Home, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useTheme } from "../components/Main/ThemeContext";
import BubbleBackground from "../components/ui/BubbleBackground";
import BottomMenu from "../components/MobileMenu";

export default function Success() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <div
      className={`
        relative min-h-screen overflow-hidden
        flex items-center justify-center
        transition-colors duration-300
        ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-800"}
      `}
    >
      <Helmet>
        <title>Ödəniş uğurlu oldu - ProElan.az</title>

        <meta
          name="description"
          content="ProElan.az ödəniş əməliyyatı uğurla tamamlandı."
        />

        <link rel="canonical" href="https://proelan.az/success" />
      </Helmet>

      {/* Arxa fon */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <BubbleBackground />

        <div
          className={`
            absolute -top-40 -right-40
            w-[430px] h-[430px]
            rounded-full blur-3xl
            ${darkMode ? "bg-green-500/10" : "bg-green-400/10"}
          `}
        />

        <div
          className={`
            absolute -bottom-40 -left-40
            w-[430px] h-[430px]
            rounded-full blur-3xl
            ${darkMode ? "bg-purple-600/10" : "bg-purple-400/10"}
          `}
        />
      </div>

      <main className="relative z-10 w-full max-w-xl px-4 sm:px-6 pt-20 pb-24">
        <div
          className={`
            relative overflow-hidden
            rounded-3xl border
            p-7 sm:p-10
            text-center
            shadow-2xl
            ${
              darkMode
                ? "bg-slate-900/85 border-slate-800 shadow-black/30"
                : "bg-white/95 border-slate-200 shadow-slate-200/70"
            }
          `}
        >
          {/* Üst gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-[#670fff]" />

          {/* Success icon */}
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-6">
            <div
              className={`
                absolute inset-0 rounded-full
                animate-ping opacity-20
                ${darkMode ? "bg-green-400" : "bg-green-500"}
              `}
            />

            <div
              className={`
                relative w-full h-full
                rounded-full
                flex items-center justify-center
                border-8
                ${
                  darkMode
                    ? "bg-green-500/10 border-green-500/10 text-green-400"
                    : "bg-green-50 border-green-100 text-green-600"
                }
              `}
            >
              <CheckCircle2 size={56} strokeWidth={1.8} />
            </div>
          </div>

          {/* Kiçik status */}
          <div
            className={`
              inline-flex items-center gap-2
              px-4 py-2
              rounded-full
              text-sm font-bold
              mb-5
              ${
                darkMode
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-green-50 text-green-600 border border-green-100"
              }
            `}
          >
            <Sparkles size={16} />
            Ödəniş təsdiqləndi
          </div>

          {/* Başlıq */}
          <h1
            className={`
              text-2xl sm:text-3xl
              font-black
              mb-3
              ${darkMode ? "text-white" : "text-slate-900"}
            `}
          >
            Ödəniş uğurla tamamlandı
          </h1>

          {/* Açıqlama */}
          <p
            className={`
              max-w-md mx-auto
              text-sm sm:text-base
              leading-7
              ${darkMode ? "text-slate-400" : "text-slate-500"}
            `}
          >
            Sizin əməliyyatınız uğurla həyata keçirildi. Təşəkkür edirik!
            Elanınız seçdiyiniz xidmətə uyğun olaraq aktivləşdiriləcək.
          </p>

          {/* Təhlükəsizlik məlumatı */}
          <div
            className={`
              mt-6
              flex items-center justify-center gap-2
              text-xs
              ${darkMode ? "text-slate-500" : "text-slate-400"}
            `}
          >
            <ShieldCheck size={16} />
            Ödəniş əməliyyatı təhlükəsiz şəkildə tamamlandı
          </div>

          {/* Ana səhifə düyməsi */}
          <div className="mt-7">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="
                w-full
                inline-flex
                items-center
                justify-center
                gap-2
                px-6
                py-3.5
                rounded-2xl
                bg-gradient-to-r
                from-green-500
                to-emerald-600
                text-white
                font-bold
                shadow-lg
                shadow-green-500/20
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
                hover:shadow-green-500/25
                active:scale-[0.98]
              "
            >
              <Home size={19} />
              Ana səhifəyə qayıt
            </button>
          </div>
        </div>

        {/* Footer text */}
        <p
          className={`
            text-center
            text-xs
            mt-5
            ${darkMode ? "text-slate-600" : "text-slate-400"}
          `}
        >
          ProElan.az — Azərbaycanda Pulsuz Elanlar Platforması
        </p>
      </main>

      <BottomMenu />
    </div>
  );
}
