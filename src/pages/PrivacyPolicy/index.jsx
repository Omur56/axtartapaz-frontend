import React from "react";
import { Helmet } from "react-helmet-async";
import {
  ShieldAlert,
  Ban,
  AlertTriangle,
  FileWarning,
  PackageX,
  CircleDollarSign,
  TriangleAlert,
  HeartOff,
  ArrowRight,
} from "lucide-react";

import { useTheme } from "../../components/Main/ThemeContext";
import BubbleBackground from "../../components/ui/BubbleBackground";
import BottomMenu from "../../components/MobileMenu";

export default function Prohibited() {
  const { darkMode } = useTheme();

  const items = [
    {
      icon: Ban,
      text: "Qanunsuz silah və partlayıcı maddələr",
      color: "red",
    },
    {
      icon: PackageX,
      text: "Narkotik vasitələr və psixotrop maddələr",
      color: "purple",
    },
    {
      icon: FileWarning,
      text: "Saxta sənədlər",
      color: "yellow",
    },
    {
      icon: PackageX,
      text: "Oğurluq və ya şübhəli mənşəli məhsullar",
      color: "blue",
    },
    {
      icon: CircleDollarSign,
      text: "Fırıldaqçılıq xarakterli elanlar",
      color: "pink",
    },
    {
      icon: TriangleAlert,
      text: "Təhlükəli və qanunla qadağan edilmiş məhsullar",
      color: "orange",
    },
    {
      icon: HeartOff,
      text: "Nifrət və ayrı-seçkilik yaradan məzmun",
      color: "green",
    },
  ];

  const colors = {
    red: {
      light: "bg-red-50 text-red-600",
      dark: "bg-red-500/10 text-red-400",
      bullet: "bg-red-500",
    },
    purple: {
      light: "bg-purple-50 text-purple-600",
      dark: "bg-purple-500/10 text-purple-400",
      bullet: "bg-purple-500",
    },
    yellow: {
      light: "bg-yellow-50 text-yellow-600",
      dark: "bg-yellow-500/10 text-yellow-400",
      bullet: "bg-yellow-500",
    },
    blue: {
      light: "bg-blue-50 text-blue-600",
      dark: "bg-blue-500/10 text-blue-400",
      bullet: "bg-blue-500",
    },
    pink: {
      light: "bg-pink-50 text-pink-600",
      dark: "bg-pink-500/10 text-pink-400",
      bullet: "bg-pink-500",
    },
    orange: {
      light: "bg-orange-50 text-orange-600",
      dark: "bg-orange-500/10 text-orange-400",
      bullet: "bg-orange-500",
    },
    green: {
      light: "bg-green-50 text-green-600",
      dark: "bg-green-500/10 text-green-400",
      bullet: "bg-green-500",
    },
  };

  return (
    <div
      className={`
        relative min-h-screen overflow-hidden
        transition-colors duration-300
        ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-800"}
      `}
    >
      <Helmet>
        <title>Qadağan Olunmuş Elanlar - ProElan.az</title>

        <meta
          name="description"
          content="ProElan.az platformasında yerləşdirilməsi qadağan olunan elanlar."
        />

        <link rel="canonical" href="https://proelan.az/prohibited" />
      </Helmet>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <BubbleBackground />

        <div
          className={`
            absolute -top-40 -right-40
            w-[430px] h-[430px]
            rounded-full blur-3xl
            ${darkMode ? "bg-red-600/10" : "bg-red-400/10"}
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

      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-28">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className={`
              inline-flex items-center gap-2
              px-4 py-2
              rounded-full
              text-sm font-bold
              mb-5
              ${
                darkMode
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-red-50 text-red-600 border border-red-100"
              }
            `}
          >
            <ShieldAlert size={17} />
            Elan yerləşdirmə qaydaları
          </div>

          <h1
            className="
              text-4xl sm:text-5xl md:text-6xl
              font-black
              tracking-tight
              bg-gradient-to-r
              from-red-500
              via-pink-500
              to-[#670fff]
              bg-clip-text
              text-transparent
            "
          >
            Qadağan Olunmuş Elanlar
          </h1>

          <p
            className={`
              max-w-2xl mx-auto
              mt-5
              text-sm sm:text-base
              leading-7
              ${darkMode ? "text-slate-400" : "text-slate-500"}
            `}
          >
            Platformada aşağıdakı elanların yerləşdirilməsi qəti qadağandır.
          </p>
        </div>

        {/* Warning */}
        <div
          className={`
            mb-6
            rounded-3xl
            border
            p-5 sm:p-6
            flex items-start gap-4
            ${
              darkMode
                ? "bg-red-500/5 border-red-500/20"
                : "bg-red-50 border-red-100"
            }
          `}
        >
          <div
            className={`
              shrink-0
              w-11 h-11
              rounded-xl
              flex items-center justify-center
              ${
                darkMode
                  ? "bg-red-500/10 text-red-400"
                  : "bg-red-100 text-red-600"
              }
            `}
          >
            <AlertTriangle size={23} />
          </div>

          <div>
            <h2
              className={`
                font-extrabold mb-1
                ${darkMode ? "text-red-400" : "text-red-700"}
              `}
            >
              Vacib məlumat
            </h2>

            <p
              className={`
                text-sm leading-6
                ${darkMode ? "text-slate-400" : "text-slate-600"}
              `}
            >
              Elan yerləşdirməzdən əvvəl aşağıdakı məhdudiyyətlərlə tanış olun.
            </p>
          </div>
        </div>

        {/* Prohibited items */}
        <div className="space-y-4">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const color = colors[item.color];

            return (
              <div
                key={idx}
                className={`
                  group relative overflow-hidden
                  flex items-center gap-4
                  p-4 sm:p-5
                  rounded-2xl
                  border
                  transition-all duration-300
                  hover:-translate-y-1
                  ${
                    darkMode
                      ? "bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-lg shadow-black/10"
                      : "bg-white/95 border-slate-200 hover:border-slate-300 shadow-lg shadow-slate-200/50"
                  }
                `}
              >
                {/* Left accent */}
                <div
                  className={`
                    absolute left-0 top-0 bottom-0
                    w-1
                    ${color.bullet}
                  `}
                />

                {/* Number */}
                <div
                  className={`
                    hidden sm:flex
                    shrink-0
                    w-9 h-9
                    rounded-xl
                    items-center justify-center
                    text-xs font-black
                    ${
                      darkMode
                        ? "bg-slate-800 text-slate-500"
                        : "bg-slate-100 text-slate-400"
                    }
                  `}
                >
                  {String(idx + 1).padStart(2, "0")}
                </div>

                {/* Icon */}
                <div
                  className={`
                    shrink-0
                    w-12 h-12
                    rounded-2xl
                    flex items-center justify-center
                    transition-transform duration-300
                    group-hover:scale-110
                    ${darkMode ? color.dark : color.light}
                  `}
                >
                  <Icon size={23} strokeWidth={2} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <span
                    className={`
                      block
                      text-sm sm:text-base
                      font-bold
                      leading-6
                      ${darkMode ? "text-slate-200" : "text-slate-800"}
                    `}
                  >
                    {item.text}
                  </span>
                </div>

                {/* Arrow */}
                <ArrowRight
                  size={18}
                  className={`
                    shrink-0
                    transition-all duration-300
                    group-hover:translate-x-1
                    ${darkMode ? "text-slate-700" : "text-slate-300"}
                  `}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom warning */}
        <div
          className={`
            mt-7
            rounded-3xl
            border
            p-6 sm:p-7
            text-center
            ${
              darkMode
                ? "bg-slate-900/85 border-slate-800"
                : "bg-white/95 border-slate-200"
            }
          `}
        >
          <div
            className={`
              mx-auto
              w-14 h-14
              rounded-2xl
              flex items-center justify-center
              mb-4
              ${
                darkMode
                  ? "bg-red-500/10 text-red-400"
                  : "bg-red-50 text-red-600"
              }
            `}
          >
            <ShieldAlert size={28} />
          </div>

          <p
            className={`
              text-base sm:text-lg
              font-extrabold
              ${darkMode ? "text-red-400" : "text-red-700"}
            `}
          >
            Qadağan olunmuş elan yerləşdirən istifadəçilərin hesabları dərhal
            bloklanacaq.
          </p>

          <p
            className={`
              mt-3
              text-sm
              leading-6
              ${darkMode ? "text-slate-500" : "text-slate-400"}
            `}
          >
            Elan yerləşdirərkən platformanın qaydalarına və qüvvədə olan
            qanunvericiliyə riayət edin.
          </p>
        </div>

        {/* Footer text */}
        <p
          className={`
            text-center
            text-xs
            mt-6
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
