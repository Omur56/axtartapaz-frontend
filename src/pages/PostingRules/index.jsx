import React from "react";
import { Helmet } from "react-helmet-async";
import {
  CheckCircle2,
  Image,
  CircleDollarSign,
  CopyX,
  ShieldCheck,
  ArrowRight,
  FileCheck2,
} from "lucide-react";

import { useTheme } from "../../components/Main/ThemeContext";
import BubbleBackground from "../../components/ui/BubbleBackground";
import BottomMenu from "../../components/MobileMenu";

const rules = [
  {
    title: "1. Məlumatların düzgünlüyü",
    icon: CheckCircle2,
    color: "blue",
    content:
      "Elan başlığı və təsviri real və doğru olmalıdır. Yanıltıcı məlumatlara icazə verilmir.",
  },
  {
    title: "2. Şəkillər",
    icon: Image,
    color: "green",
    content: "Yüklənən şəkillər məhsula aid olmalı və keyfiyyətli olmalıdır.",
  },
  {
    title: "3. Qiymət",
    icon: CircleDollarSign,
    color: "yellow",
    content: "Qiymət real və satışa uyğun göstərilməlidir.",
  },
  {
    title: "4. Təkrar elanlar",
    icon: CopyX,
    color: "red",
    content:
      "Eyni məhsul üçün təkrar və spam xarakterli elan yerləşdirmək qadağandır.",
  },
  {
    title: "5. Məsuliyyət",
    icon: ShieldCheck,
    color: "purple",
    content:
      "Elan yerləşdirən istifadəçi elan məzmununa görə tam məsuliyyət daşıyır.",
  },
];

export default function PostingRules() {
  const { darkMode } = useTheme();

  const colors = {
    blue: {
      icon: darkMode
        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
        : "bg-blue-50 text-blue-500 border-blue-100",
      number: darkMode
        ? "bg-blue-500/10 text-blue-400"
        : "bg-blue-50 text-blue-600",
      line: "bg-blue-500",
    },

    green: {
      icon: darkMode
        ? "bg-green-500/10 text-green-400 border-green-500/20"
        : "bg-green-50 text-green-500 border-green-100",
      number: darkMode
        ? "bg-green-500/10 text-green-400"
        : "bg-green-50 text-green-600",
      line: "bg-green-500",
    },

    yellow: {
      icon: darkMode
        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
        : "bg-yellow-50 text-yellow-500 border-yellow-100",
      number: darkMode
        ? "bg-yellow-500/10 text-yellow-400"
        : "bg-yellow-50 text-yellow-600",
      line: "bg-yellow-500",
    },

    red: {
      icon: darkMode
        ? "bg-red-500/10 text-red-400 border-red-500/20"
        : "bg-red-50 text-red-500 border-red-100",
      number: darkMode
        ? "bg-red-500/10 text-red-400"
        : "bg-red-50 text-red-600",
      line: "bg-red-500",
    },

    purple: {
      icon: darkMode
        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
        : "bg-purple-50 text-purple-500 border-purple-100",
      number: darkMode
        ? "bg-purple-500/10 text-purple-400"
        : "bg-purple-50 text-purple-600",
      line: "bg-purple-500",
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
        <title>Elan Yerləşdirmə Qaydaları - ProElan.az</title>

        <meta
          name="description"
          content="ProElan.az platformasında elan yerləşdirmə qaydaları."
        />

        <link rel="canonical" href="https://proelan.az/posting-rules" />
      </Helmet>

      {/* Arxa fon */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <BubbleBackground />

        <div
          className={`absolute -top-40 -right-40 w-[430px] h-[430px] rounded-full blur-3xl ${
            darkMode ? "bg-blue-600/10" : "bg-blue-400/10"
          }`}
        />

        <div
          className={`absolute -bottom-40 -left-40 w-[430px] h-[430px] rounded-full blur-3xl ${
            darkMode ? "bg-purple-600/10" : "bg-purple-400/10"
          }`}
        />
      </div>

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
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "bg-blue-50 text-blue-600 border-blue-100"
              }
            `}
          >
            <FileCheck2 size={17} />
            Elan yerləşdirmə
          </div>

          <h1
            className="
              text-3xl sm:text-4xl md:text-5xl
              font-black tracking-tight
              text-transparent bg-clip-text
              bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600
            "
          >
            Elan Yerləşdirmə Qaydaları
          </h1>

          <p
            className={`
              max-w-2xl mx-auto mt-4
              text-sm sm:text-base
              leading-7
              ${darkMode ? "text-slate-400" : "text-slate-600"}
            `}
          >
            Elanınızı yerləşdirərkən aşağıdakı qaydalara əməl etməyiniz
            elanınızın daha düzgün və etibarlı şəkildə təqdim olunmasına kömək
            edəcək.
          </p>
        </div>

        {/* Qaydalar */}
        <div className="space-y-4">
          {rules.map((rule, idx) => {
            const Icon = rule.icon;
            const color = colors[rule.color];

            return (
              <article
                key={idx}
                className={`
                  group relative overflow-hidden
                  rounded-3xl
                  border
                  p-5 sm:p-6
                  transition-all duration-300
                  hover:-translate-y-1
                  ${
                    darkMode
                      ? "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:shadow-2xl hover:shadow-black/20"
                      : "bg-white/90 border-slate-200 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60"
                  }
                `}
              >
                {/* Hover xətti */}
                <div
                  className={`
                    absolute top-0 left-0 right-0 h-[2px]
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300
                    ${color.line}
                  `}
                />

                <div className="flex items-start gap-4">
                  {/* Nömrə */}
                  <div
                    className={`
                      hidden sm:flex
                      shrink-0
                      w-11 h-11
                      rounded-xl
                      items-center justify-center
                      text-xs font-black
                      ${color.number}
                    `}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  {/* İkon */}
                  <div
                    className={`
                      shrink-0
                      w-12 h-12
                      rounded-2xl
                      border
                      flex items-center justify-center
                      ${color.icon}
                    `}
                  >
                    <Icon size={23} strokeWidth={2} />
                  </div>

                  {/* Məzmun */}
                  <div className="flex-1 min-w-0">
                    <h2
                      className={`
                        text-base sm:text-lg
                        font-bold
                        leading-6
                        ${darkMode ? "text-white" : "text-slate-800"}
                      `}
                    >
                      {rule.title}
                    </h2>

                    <p
                      className={`
                        mt-2
                        text-sm sm:text-base
                        leading-7
                        ${darkMode ? "text-slate-400" : "text-slate-600"}
                      `}
                    >
                      {rule.content}
                    </p>
                  </div>

                  {/* Ox */}
                  <ArrowRight
                    size={19}
                    className={`
                      hidden sm:block
                      shrink-0 mt-2
                      transition-all duration-300
                      group-hover:translate-x-1
                      ${
                        darkMode
                          ? "text-slate-700 group-hover:text-slate-400"
                          : "text-slate-300 group-hover:text-slate-500"
                      }
                    `}
                  />
                </div>
              </article>
            );
          })}
        </div>

        {/* Aşağı məlumat kartı */}
        <div
          className={`
            mt-8
            rounded-3xl
            border
            p-6 sm:p-7
            ${
              darkMode
                ? "bg-slate-900/80 border-slate-800"
                : "bg-white/90 border-slate-200"
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
                    ? "bg-[#670fff]/10 text-purple-400"
                    : "bg-purple-50 text-[#670fff]"
                }
              `}
            >
              <CheckCircle2 size={22} />
            </div>

            <div>
              <h3
                className={`font-bold text-base sm:text-lg ${
                  darkMode ? "text-white" : "text-slate-800"
                }`}
              >
                Keyfiyyətli elan yerləşdirin
              </h3>

              <p
                className={`mt-1 text-sm leading-6 ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Dəqiq məlumat, uyğun şəkillər və real qiymət elanınızın
                istifadəçilər üçün daha aydın görünməsinə kömək edir.
              </p>
            </div>
          </div>
        </div>

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
