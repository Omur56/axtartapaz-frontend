import React from "react";
import { Helmet } from "react-helmet-async";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useTheme } from "../components/Main/ThemeContext";
import BubbleBackground from "../components/ui/BubbleBackground";
import BottomMenu from "../components/MobileMenu";

export default function Cancel() {
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
        <title>Ödəniş ləğv edildi - ProElan.az</title>

        <meta
          name="description"
          content="ProElan.az ödəniş əməliyyatı ləğv edildi."
        />

        <link rel="canonical" href="https://proelan.az/cancel" />
      </Helmet>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <BubbleBackground />

        <div
          className={`
            absolute -top-32 -right-32
            w-96 h-96
            rounded-full
            blur-3xl
            ${darkMode ? "bg-red-600/10" : "bg-red-400/10"}
          `}
        />

        <div
          className={`
            absolute -bottom-40 -left-40
            w-[420px] h-[420px]
            rounded-full
            blur-3xl
            ${darkMode ? "bg-purple-600/10" : "bg-purple-400/10"}
          `}
        />
      </div>

      <main className="relative z-10 w-full max-w-xl px-4 sm:px-6 pt-20 pb-24">
        <div
          className={`
            relative overflow-hidden
            rounded-3xl
            border
            p-7 sm:p-10
            text-center
            shadow-2xl
            ${
              darkMode
                ? "bg-slate-900/80 border-slate-800 shadow-black/30"
                : "bg-white/90 border-slate-200 shadow-slate-200/70"
            }
          `}
        >
          {/* Top gradient */}
          <div
            className="
              absolute top-0 left-0 right-0
              h-1
              bg-gradient-to-r
              from-red-500
              via-orange-500
              to-[#670fff]
            "
          />

          {/* Icon */}
          <div
            className="
              mx-auto
              w-20 h-20 sm:w-24 sm:h-24
              rounded-full
              flex items-center justify-center
              bg-red-500/10
              text-red-500
              mb-6
            "
          >
            <XCircle size={52} strokeWidth={1.8} />
          </div>

          {/* Title */}
          <h1
            className={`
              text-2xl sm:text-3xl
              font-black
              mb-3
              ${darkMode ? "text-white" : "text-slate-800"}
            `}
          >
            Ödəniş ləğv edildi
          </h1>

          {/* Description */}
          <p
            className={`
              text-sm sm:text-base
              leading-7
              max-w-md
              mx-auto
              mb-7
              ${darkMode ? "text-slate-400" : "text-slate-600"}
            `}
          >
            Ödəniş əməliyyatı tamamlanmadı. Narahat olmayın, yenidən cəhd edə
            bilərsiniz.
          </p>

          {/* Status */}
          <div
            className={`
              inline-flex items-center gap-2
              px-4 py-2
              rounded-full
              text-sm font-semibold
              mb-7
              ${
                darkMode
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-red-50 text-red-600 border border-red-100"
              }
            `}
          >
            <CreditCard size={16} />
            Ödəniş tamamlanmadı
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-6
                py-3.5
                rounded-2xl
                bg-gradient-to-r
                from-[#670fff]
                to-[#8b5cf6]
                text-white
                font-bold
                shadow-lg
                shadow-purple-500/20
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-xl
                active:scale-95
              "
            >
              <ArrowLeft size={18} />
              Geri qayıt
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className={`
                inline-flex
                items-center
                justify-center
                px-6
                py-3.5
                rounded-2xl
                font-semibold
                border
                transition-all duration-300
                hover:-translate-y-1
                ${
                  darkMode
                    ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }
              `}
            >
              Ana səhifə
            </button>
          </div>
        </div>

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
