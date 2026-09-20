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
      icon: ShieldAlert,
      text: "Qanunsuz silah və partlayıcı maddələr",
      color: "red",
    },
    {
      icon: Ban,
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
      icon: darkMode
        ? "bg-red-500/10 text-red-400 border-red-500/20"
        : "bg-red-50 text-red-500 border-red-100",
      bullet: "bg-red-500",
    },
    purple: {
      icon: darkMode
        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
        : "bg-purple-50 text-purple-500 border-purple-100",
      bullet: "bg-purple-500",
    },
    yellow: {
      icon: darkMode
        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
        : "bg-yellow-50 text-yellow-500 border-yellow-100",
      bullet: "bg-yellow-500",
    },
    blue: {
      icon: darkMode
        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
        : "bg-blue-50 text-blue-500 border-blue-100",
      bullet: "bg-blue-500",
    },
    pink: {
      icon: darkMode
        ? "bg-pink-500/10 text-pink-400 border-pink-500/20"
        : "bg-pink-50 text-pink-500 border-pink-100",
      bullet: "bg-pink-500",
    },
    orange: {
      icon: darkMode
        ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
        : "bg-orange-50 text-orange-500 border-orange-100",
      bullet: "bg-orange-500",
    },
    green: {
      icon: darkMode
        ? "bg-green-500/10 text-green-400 border-green-500/20"
        : "bg-green-50 text-green-500 border-green-100",
      bullet: "bg-green-500",
    },
  };

  return (
    <div
      className={`
        relative min-h-screen overflow-hidden
        transition-colors duration-300
        ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}
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

      {/* Arxa fon */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <BubbleBackground />

        <div
          className={`absolute -top-40 -right-40 w-[420px] h-[420px] rounded-full blur-3xl ${
            darkMode ? "bg-red-600/10" : "bg-red-400/10"
          }`}
        />

        <div
          className={`absolute -bottom-40 -left-40 w-[420px] h-[420px] rounded-full blur-3xl ${
            darkMode ? "bg-purple-600/10" : "bg-purple-400/10"
          }`}
        />
      </div>

      {/* Əsas hissə */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-28">
        {/* Başlıq */}
        <div className="text-center mb-10">
          <div
            className={`
              inline-flex items-center gap-2
              px-4 py-2 rounded-full
              text-sm font-semibold
              border mb-5
              ${
                darkMode
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-red-50 text-red-600 border-red-100"
              }
            `}
          >
            <ShieldAlert size={17} />
            Elan yerləşdirmə qaydaları
          </div>

          <h1
            className="
              text-3xl sm:text-4xl md:text-5xl
              font-black tracking-tight
              text-transparent bg-clip-text
              bg-gradient-to-r from-red-500 via-pink-500 to-purple-600
            "
          >
            Qadağan Olunmuş Elanlar
          </h1>

          <p
            className={`
              mt-4 max-w-2xl mx-auto
              text-sm sm:text-base leading-7
              ${darkMode ? "text-slate-400" : "text-slate-600"}
            `}
          >
            Platformada aşağıdakı elanların yerləşdirilməsi qəti qadağandır.
          </p>
        </div>

        {/* Xəbərdarlıq */}
        <div
          className={`
            flex items-start gap-4
            p-5 sm:p-6 mb-7
            rounded-2xl border
            ${
              darkMode
                ? "bg-red-500/5 border-red-500/20"
                : "bg-red-50/80 border-red-100"
            }
          `}
        >
          <div
            className={`
              shrink-0 w-11 h-11
              rounded-xl flex items-center justify-center
              ${
                darkMode
                  ? "bg-red-500/10 text-red-400"
                  : "bg-white text-red-500"
              }
            `}
          >
            <AlertTriangle size={23} />
          </div>

          <div>
            <h2
              className={`font-bold text-base sm:text-lg ${
                darkMode ? "text-red-300" : "text-red-700"
              }`}
            >
              Vacib məlumat
            </h2>

            <p
              className={`mt-1 text-sm leading-6 ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Elan yerləşdirərkən platformanın qaydalarına riayət etməyiniz
              xahiş olunur.
            </p>
          </div>
        </div>

        {/* Qadağan olunan elanlar */}
        <div className="space-y-3">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const color = colors[item.color];

            return (
              <div
                key={idx}
                className={`
                  group relative
                  flex items-center gap-4
                  p-4 sm:p-5
                  rounded-2xl
                  border
                  transition-all duration-300
                  hover:-translate-y-1
                  ${
                    darkMode
                      ? "bg-slate-900/75 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50"
                  }
                `}
              >
                {/* Nömrə */}
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
                        ? "bg-slate-800 text-slate-400"
                        : "bg-slate-100 text-slate-500"
                    }
                  `}
                >
                  {String(idx + 1).padStart(2, "0")}
                </div>

                {/* İkon */}
                <div
                  className={`
                    shrink-0
                    w-12 h-12
                    rounded-xl
                    border
                    flex items-center justify-center
                    ${color.icon}
                  `}
                >
                  <Icon size={23} strokeWidth={2} />
                </div>

                {/* Mətn */}
                <div className="flex-1 min-w-0">
                  <span
                    className={`
                      block
                      text-sm sm:text-base
                      font-semibold
                      leading-6
                      ${darkMode ? "text-slate-200" : "text-slate-800"}
                    `}
                  >
                    {item.text}
                  </span>
                </div>

                {/* Sağ ox */}
                <ArrowRight
                  size={19}
                  className={`
                    shrink-0
                    transition-all duration-300
                    group-hover:translate-x-1
                    ${
                      darkMode
                        ? "text-slate-600 group-hover:text-slate-400"
                        : "text-slate-300 group-hover:text-slate-500"
                    }
                  `}
                />
              </div>
            );
          })}
        </div>

        {/* Aşağıdakı xəbərdarlıq */}
        <div
          className={`
            mt-8
            p-5 sm:p-6
            rounded-2xl
            border
            ${
              darkMode
                ? "bg-slate-900/80 border-slate-800"
                : "bg-white border-slate-200"
            }
          `}
        >
          <div className="flex items-start gap-4">
            <div
              className={`
                shrink-0
                w-11 h-11
                rounded-xl
                flex items-center justify-center
                ${
                  darkMode
                    ? "bg-orange-500/10 text-orange-400"
                    : "bg-orange-50 text-orange-500"
                }
              `}
            >
              <Ban size={22} />
            </div>

            <div>
              <h3
                className={`font-bold text-base sm:text-lg ${
                  darkMode ? "text-white" : "text-slate-800"
                }`}
              >
                Qaydalara riayət edin
              </h3>

              <p
                className={`mt-1 text-sm leading-6 ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Qadağan olunmuş elan yerləşdirən istifadəçilərin hesabları
                dərhal bloklanacaq.
              </p>
            </div>
          </div>
        </div>

        {/* Footer mətn */}
        <p
          className={`text-center text-xs mt-8 ${
            darkMode ? "text-slate-600" : "text-slate-400"
          }`}
        >
          ProElan.az — Azərbaycanda Pulsuz Elanlar Platforması
        </p>
      </main>

      <BottomMenu />
    </div>
  );
}
