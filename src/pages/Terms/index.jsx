import React from "react";
import { Helmet } from "react-helmet-async";
import {
  FileText,
  Target,
  CheckCircle2,
  ShieldAlert,
  Ban,
  Mail,
  ArrowRight,
} from "lucide-react";

import { useTheme } from "../../components/Main/ThemeContext";
import BubbleBackground from "../../components/ui/BubbleBackground";
import BottomMenu from "../../components/MobileMenu";

const sections = [
  {
    title: "1. Ümumi müddəalar",
    icon: FileText,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    content:
      "ProElan.az pulsuz elan və alqı-satqı platformasıdır. Platformadan istifadə etməklə siz bu şərtlərlə razılaşmış olursunuz.",
  },
  {
    title: "2. Platformanın məqsədi",
    icon: Target,
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10",
    content:
      "Platforma istifadəçilərə avtomobil, əmlak, elektronika, telefon, məişət avadanlıqları, bağ ləvazimatları, geyim və digər məhsullar üzrə elan yerləşdirmək və alqı-satqı aparmaq imkanı yaradır.",
  },
  {
    title: "3. İstifadəçi öhdəlikləri",
    icon: CheckCircle2,
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-500/10",
    list: [
      "Dəqiq və doğru məlumat təqdim etmək",
      "Qanunsuz və saxta elan yerləşdirməmək",
      "Digər istifadəçilərin hüquqlarını pozmamaq",
      "Platformadan sui-istifadə etməmək",
    ],
  },
  {
    title: "4. Məsuliyyətin məhdudlaşdırılması",
    icon: ShieldAlert,
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
    content:
      "ProElan.az yalnız elanların yerləşdirilməsi üçün vasitəçi platformadır. Alqı-satqı əməliyyatlarına görə məsuliyyət daşımır.",
  },
  {
    title: "5. Hesabın bloklanması",
    icon: Ban,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
    content:
      "Qayda pozuntusu aşkar edildikdə istifadəçi hesabı xəbərdarlıq edilmədən bloklana bilər.",
  },
];

export default function Terms() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
      }`}
    >
      <Helmet>
        <title>İstifadəçi Müqaviləsi - ProElan.az</title>

        <meta
          name="description"
          content="ProElan.az istifadəçi müqaviləsi və platformadan istifadə qaydaları."
        />

        <link rel="canonical" href="https://proelan.az/terms" />
      </Helmet>

      {/* Arxa fon */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <BubbleBackground />

        <div
          className={`absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl ${
            darkMode ? "bg-purple-600/10" : "bg-purple-400/10"
          }`}
        />

        <div
          className={`absolute top-[45%] -left-40 w-96 h-96 rounded-full blur-3xl ${
            darkMode ? "bg-blue-600/10" : "bg-blue-400/10"
          }`}
        />

        <div
          className={`absolute bottom-0 right-[15%] w-72 h-72 rounded-full blur-3xl ${
            darkMode ? "bg-green-500/5" : "bg-green-400/5"
          }`}
        />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-24">
        {/* Başlıq */}
        <header className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="
                flex items-center justify-center
                w-12 h-12 sm:w-14 sm:h-14
                rounded-2xl
                bg-gradient-to-br from-[#670fff] to-[#8b5cf6]
                text-white
                shadow-lg shadow-purple-500/25
              "
            >
              <FileText size={25} strokeWidth={2} />
            </div>

            <div>
              <span
                className={`text-xs sm:text-sm font-semibold uppercase tracking-wider ${
                  darkMode ? "text-purple-400" : "text-purple-600"
                }`}
              >
                ProElan.az
              </span>

              <div
                className={`text-xs ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Rəsmi sənəd
              </div>
            </div>
          </div>

          <h1
            className="
              text-3xl sm:text-4xl md:text-5xl
              font-black
              tracking-tight
              mb-4
              bg-gradient-to-r from-[#670fff] via-[#7c3aed] to-[#43D262]
              bg-clip-text text-transparent
            "
          >
            İstifadəçi Müqaviləsi
          </h1>

          <div
            className={`
              inline-flex items-center gap-2
              px-4 py-2
              rounded-full
              text-sm
              border
              ${
                darkMode
                  ? "bg-slate-900/70 border-slate-800 text-slate-400"
                  : "bg-white/80 border-slate-200 text-slate-500"
              }
            `}
          >
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <strong className={darkMode ? "text-slate-300" : "text-slate-700"}>
              Son yenilənmə:
            </strong>
            21 Fevral 2026
          </div>
        </header>

        {/* Məlumat kartları */}
        <div className="space-y-4">
          {sections.map((section, idx) => {
            const Icon = section.icon;

            return (
              <section
                key={idx}
                className={`
                  group relative overflow-hidden
                  rounded-2xl sm:rounded-3xl
                  border
                  p-5 sm:p-6 md:p-7
                  transition-all duration-300
                  hover:-translate-y-0.5
                  ${
                    darkMode
                      ? "bg-slate-900/75 border-slate-800/80 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-950/20"
                      : "bg-white/90 border-slate-200/80 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/50"
                  }
                `}
              >
                {/* Dekorativ xətt */}
                <div
                  className="
                    absolute left-0 top-0 bottom-0
                    w-1
                    bg-gradient-to-b
                    from-[#670fff]
                    via-[#8b5cf6]
                    to-[#43D262]
                    opacity-70
                    group-hover:opacity-100
                    transition-opacity
                  "
                />

                <div className="flex items-start gap-4 sm:gap-5">
                  {/* Icon */}
                  <div
                    className={`
                      shrink-0
                      w-11 h-11 sm:w-12 sm:h-12
                      rounded-2xl
                      flex items-center justify-center
                      ${section.iconBg}
                      ${section.iconColor}
                      transition-all duration-300
                      group-hover:scale-105
                    `}
                  >
                    <Icon size={23} strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h2
                        className={`
                          text-lg sm:text-xl md:text-2xl
                          font-bold
                          ${darkMode ? "text-white" : "text-slate-800"}
                        `}
                      >
                        {section.title}
                      </h2>
                    </div>

                    {section.content && (
                      <p
                        className={`
                          text-sm sm:text-base
                          leading-7
                          ${darkMode ? "text-slate-400" : "text-slate-600"}
                        `}
                      >
                        {section.content}
                      </p>
                    )}

                    {section.list && (
                      <ul className="space-y-3 mt-3">
                        {section.list.map((item, i) => (
                          <li
                            key={i}
                            className={`
                              flex items-start gap-3
                              text-sm sm:text-base
                              leading-6
                              ${darkMode ? "text-slate-400" : "text-slate-600"}
                            `}
                          >
                            <span
                              className="
                                mt-2
                                shrink-0
                                w-1.5 h-1.5
                                rounded-full
                                bg-gradient-to-r
                                from-[#670fff]
                                to-[#8b5cf6]
                              "
                            />

                            <span className="transition-colors duration-200 group-hover:text-inherit">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Əlaqə */}
        <section
          className={`
            relative overflow-hidden
            mt-6
            rounded-2xl sm:rounded-3xl
            border
            p-5 sm:p-7
            ${
              darkMode
                ? "bg-slate-900/80 border-slate-800"
                : "bg-white/90 border-slate-200"
            }
          `}
        >
          <div
            className="
              absolute -top-16 -right-16
              w-40 h-40
              rounded-full
              bg-purple-500/10
              blur-2xl
            "
          />

          <div className="relative flex items-start gap-4 sm:gap-5">
            <div
              className="
                shrink-0
                w-11 h-11 sm:w-12 sm:h-12
                rounded-2xl
                flex items-center justify-center
                bg-blue-500/10
                text-blue-500
              "
            >
              <Mail size={23} />
            </div>

            <div className="flex-1">
              <h2
                className={`
                  text-xl sm:text-2xl
                  font-bold mb-4
                  ${darkMode ? "text-white" : "text-slate-800"}
                `}
              >
                6. Əlaqə
              </h2>

              <div className="space-y-2 text-sm sm:text-base">
                <p className={darkMode ? "text-slate-400" : "text-slate-600"}>
                  <strong
                    className={darkMode ? "text-slate-200" : "text-slate-800"}
                  >
                    Sahib:
                  </strong>{" "}
                  Ömürxan Abdullayev
                </p>

                <p className={darkMode ? "text-slate-400" : "text-slate-600"}>
                  <strong
                    className={darkMode ? "text-slate-200" : "text-slate-800"}
                  >
                    Email:
                  </strong>{" "}
                  <a
                    href="mailto:omur199624@gmail.com"
                    className="
                      inline-flex items-center gap-1
                      text-blue-500
                      hover:text-purple-500
                      transition-colors
                    "
                  >
                    omur199624@gmail.com
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Alt məlumat */}
        <div
          className={`
            mt-7
            text-center
            text-xs sm:text-sm
            ${darkMode ? "text-slate-600" : "text-slate-400"}
          `}
        >
          ProElan.az platformasından istifadə etməklə yuxarıda qeyd olunan
          şərtləri qəbul etmiş olursunuz.
        </div>
      </main>

      <BottomMenu />
    </div>
  );
}
