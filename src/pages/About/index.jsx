import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Info,
  UserRound,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { useTheme } from "../../components/Main/ThemeContext";
import BubbleBackground from "../../components/ui/BubbleBackground";
import BottomMenu from "../../components/MobileMenu";

const About = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`
        relative min-h-screen overflow-hidden
        transition-colors duration-300
        ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}
      `}
    >
      <Helmet>
        <title>Layihə haqqında - ProElan.az</title>

        <meta
          name="description"
          content="ProElan.az layihəsi haqqında məlumat və əlaqə məlumatları."
        />

        <link rel="canonical" href="https://proelan.az/about" />
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
          className={`absolute top-1/2 -left-40 w-[420px] h-[420px] rounded-full blur-3xl ${
            darkMode ? "bg-purple-600/10" : "bg-purple-400/10"
          }`}
        />

        <div
          className={`absolute -bottom-40 right-10 w-[380px] h-[380px] rounded-full blur-3xl ${
            darkMode ? "bg-pink-600/10" : "bg-pink-400/10"
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
            <Info size={17} />
            ProElan.az haqqında
          </div>

          <h1
            className="
              text-3xl sm:text-4xl md:text-5xl
              font-black tracking-tight
              text-transparent bg-clip-text
              bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
            "
          >
            Layihə haqqında
          </h1>

          <p
            className={`
              max-w-2xl mx-auto mt-4
              text-sm sm:text-base
              leading-7
              ${darkMode ? "text-slate-400" : "text-slate-600"}
            `}
          >
            Azərbaycanda elan yerləşdirmək və məhsul alıb-satmaq üçün yaradılmış
            müasir platforma.
          </p>
        </div>

        {/* Əsas məlumat */}
        <section
          className={`
            relative overflow-hidden
            rounded-3xl
            border
            p-6 sm:p-8 md:p-10
            shadow-xl
            ${
              darkMode
                ? "bg-slate-900/80 border-slate-800 shadow-black/20"
                : "bg-white/90 border-slate-200 shadow-slate-200/60"
            }
          `}
        >
          {/* Üst gradient xətti */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          <div className="flex items-center gap-3 mb-6">
            <div
              className={`
                w-11 h-11
                rounded-xl
                flex items-center justify-center
                ${
                  darkMode
                    ? "bg-purple-500/10 text-purple-400"
                    : "bg-purple-50 text-purple-600"
                }
              `}
            >
              <Sparkles size={22} />
            </div>

            <h2
              className={`text-xl sm:text-2xl font-bold ${
                darkMode ? "text-white" : "text-slate-800"
              }`}
            >
              ProElan.az nədir?
            </h2>
          </div>

          <p
            className={`
              text-sm sm:text-base
              leading-8
              ${darkMode ? "text-slate-300" : "text-slate-600"}
            `}
          >
            ProElan.az layihəsi Azərbaycanda özəl elanlar üçün universal
            meydança təşkil etmək məqsədi ilə yaradılıb. Hər bir kəs saytdan
            istifadə etməklə geyim və mebeldən tutmuş elektronika və
            avtomobillərə qədər hər şey ala və sata bilər. ProElan.az-a əsasən
            ayrıca fərdlər elan yerləşdirir, lakin sayt şirkət və fərdi
            sahibkarlar üçün də maraq kəsb edir. Burada təkcə işlənmiş deyil,
            eləcə də yeni məhsullar da əldə etmək olar.
          </p>

          {/* Üstünlüklər */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
            <div
              className={`
                rounded-2xl p-4 border
                ${
                  darkMode
                    ? "bg-slate-800/60 border-slate-700"
                    : "bg-slate-50 border-slate-200"
                }
              `}
            >
              <Sparkles
                size={20}
                className={darkMode ? "text-purple-400" : "text-purple-600"}
              />

              <p
                className={`mt-2 text-sm font-semibold ${
                  darkMode ? "text-slate-200" : "text-slate-700"
                }`}
              >
                Müasir platforma
              </p>
            </div>

            <div
              className={`
                rounded-2xl p-4 border
                ${
                  darkMode
                    ? "bg-slate-800/60 border-slate-700"
                    : "bg-slate-50 border-slate-200"
                }
              `}
            >
              <ShieldCheck
                size={20}
                className={darkMode ? "text-green-400" : "text-green-600"}
              />

              <p
                className={`mt-2 text-sm font-semibold ${
                  darkMode ? "text-slate-200" : "text-slate-700"
                }`}
              >
                Rahat istifadə
              </p>
            </div>

            <div
              className={`
                rounded-2xl p-4 border
                ${
                  darkMode
                    ? "bg-slate-800/60 border-slate-700"
                    : "bg-slate-50 border-slate-200"
                }
              `}
            >
              <ArrowRight
                size={20}
                className={darkMode ? "text-blue-400" : "text-blue-600"}
              />

              <p
                className={`mt-2 text-sm font-semibold ${
                  darkMode ? "text-slate-200" : "text-slate-700"
                }`}
              >
                Sadə elan yerləşdirmə
              </p>
            </div>
          </div>
        </section>

        {/* Əlaqə məlumatları */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {/* Rəhbər */}
          <div
            className={`
              group relative overflow-hidden
              rounded-3xl
              border
              p-6
              transition-all duration-300
              hover:-translate-y-1
              ${
                darkMode
                  ? "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                  : "bg-white/90 border-slate-200 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50"
              }
            `}
          >
            <div
              className="
                absolute top-0 left-0 right-0 h-[2px]
                bg-gradient-to-r from-blue-500 to-purple-500
              "
            />

            <div className="flex items-center gap-4">
              <div
                className={`
                  w-12 h-12
                  shrink-0
                  rounded-2xl
                  flex items-center justify-center
                  ${
                    darkMode
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-blue-50 text-blue-600"
                  }
                `}
              >
                <UserRound size={23} />
              </div>

              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Rəhbər
                </p>

                <h3
                  className={`mt-1 text-lg font-bold ${
                    darkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  Ömürxan Abdullayev
                </h3>
              </div>
            </div>
          </div>

          {/* Əlaqə */}
          <div
            className={`
              group relative overflow-hidden
              rounded-3xl
              border
              p-6
              transition-all duration-300
              hover:-translate-y-1
              ${
                darkMode
                  ? "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                  : "bg-white/90 border-slate-200 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50"
              }
            `}
          >
            <div
              className="
                absolute top-0 left-0 right-0 h-[2px]
                bg-gradient-to-r from-green-500 to-blue-500
              "
            />

            <div className="flex items-center gap-4">
              <div
                className={`
                  w-12 h-12
                  shrink-0
                  rounded-2xl
                  flex items-center justify-center
                  ${
                    darkMode
                      ? "bg-green-500/10 text-green-400"
                      : "bg-green-50 text-green-600"
                  }
                `}
              >
                <Phone size={23} />
              </div>

              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Əlaqə
                </p>

                <a
                  href="tel:+994559138099"
                  className={`mt-1 block text-lg font-bold no-underline transition-colors ${
                    darkMode
                      ? "text-white hover:text-green-400"
                      : "text-slate-800 hover:text-green-600"
                  }`}
                >
                  +994 55 913 80 99
                </a>
              </div>
            </div>
          </div>
        </section>

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
};

export default About;
