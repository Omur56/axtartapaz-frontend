import React from "react";
import { Helmet } from "react-helmet-async";
import {
  CircleHelp,
  MessageCircle,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { useTheme } from "../../components/Main/ThemeContext";
import BubbleBackground from "../../components/ui/BubbleBackground";
import BottomMenu from "../../components/MobileMenu";

const supportItems = [
  {
    title: "Tez-tez verilən suallar",
    description:
      "Elan yerləşdirmə, kateqoriya seçimi və digər proseslər haqqında suallarınızı buradan öyrənin.",
    icon: CircleHelp,
    color: "yellow",
    number: "01",
  },
  {
    title: "Canlı Dəstək",
    description:
      "WhatsApp və ya email vasitəsilə canlı olaraq suallarınıza cavab ala bilərsiniz.",
    icon: MessageCircle,
    color: "green",
    number: "02",
  },
  {
    title: "Təlimatlar",
    description:
      "Saytın funksionallığını daha yaxşı anlamaq və elan yerləşdirmək üçün addım-addım təlimatlarımızdan istifadə edin.",
    icon: BookOpen,
    color: "purple",
    number: "03",
  },
];

const colorStyles = {
  yellow: {
    icon: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "group-hover:border-yellow-500/30",
    glow: "bg-yellow-500/10",
  },
  green: {
    icon: "text-green-500",
    bg: "bg-green-500/10",
    border: "group-hover:border-green-500/30",
    glow: "bg-green-500/10",
  },
  purple: {
    icon: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "group-hover:border-purple-500/30",
    glow: "bg-purple-500/10",
  },
};

const Yardim = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`
        relative min-h-screen overflow-hidden
        transition-colors duration-300
        ${
          darkMode
            ? "bg-slate-950 text-slate-100"
            : "bg-slate-50 text-slate-800"
        }
      `}
    >
      <Helmet>
        <title>Yardım və Dəstək - ProElan.az</title>

        <meta
          name="description"
          content="ProElan.az yardım və dəstək bölməsi. Elan yerləşdirmə, hesab idarəsi və digər suallarınız üçün dəstək alın."
        />

        <link rel="canonical" href="https://proelan.az/yardim" />
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
            ${darkMode ? "bg-purple-600/10" : "bg-purple-400/10"}
          `}
        />

        <div
          className={`
            absolute top-[45%] -left-40
            w-[420px] h-[420px]
            rounded-full
            blur-3xl
            ${darkMode ? "bg-blue-600/10" : "bg-blue-400/10"}
          `}
        />

        <div
          className={`
            absolute bottom-0 right-[15%]
            w-80 h-80
            rounded-full
            blur-3xl
            ${darkMode ? "bg-green-500/5" : "bg-green-400/5"}
          `}
        />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24">
        {/* Hero */}
        <section className="text-center mb-12 sm:mb-16">
          <div
            className={`
              inline-flex items-center gap-2
              px-4 py-2
              rounded-full
              border
              text-sm font-semibold
              mb-5
              ${
                darkMode
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-300"
                  : "bg-blue-50 border-blue-100 text-blue-600"
              }
            `}
          >
            <Sparkles size={16} />
            ProElan.az dəstək mərkəzi
          </div>

          <h1
            className="
              text-4xl sm:text-5xl md:text-6xl
              font-black
              tracking-tight
              mb-5
              bg-gradient-to-r
              from-[#670fff]
              via-[#8b5cf6]
              to-[#43D262]
              bg-clip-text
              text-transparent
            "
          >
            Yardım və Dəstək
          </h1>

          <p
            className={`
              max-w-3xl
              mx-auto
              text-base sm:text-lg
              leading-7
              ${darkMode ? "text-slate-400" : "text-slate-600"}
            `}
          >
            Sizə kömək etmək üçün buradayıq! ProElan.az-da elan yerləşdirmə,
            hesab idarəsi və digər suallarınız üçün aşağıdakı üsullardan
            istifadə edə bilərsiniz.
          </p>
        </section>

        {/* Support cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7">
          {supportItems.map((item) => {
            const Icon = item.icon;
            const colors = colorStyles[item.color];

            return (
              <article
                key={item.title}
                className={`
                  group relative overflow-hidden
                  rounded-3xl
                  border
                  p-6 sm:p-7
                  min-h-[330px]
                  transition-all duration-300
                  hover:-translate-y-2
                  ${
                    darkMode
                      ? `
                        bg-slate-900/75
                        border-slate-800
                        hover:shadow-2xl
                        hover:shadow-purple-950/20
                      `
                      : `
                        bg-white/90
                        border-slate-200
                        hover:shadow-2xl
                        hover:shadow-purple-100
                      `
                  }
                  ${colors.border}
                `}
              >
                {/* Glow */}
                <div
                  className={`
                    absolute -right-16 -top-16
                    w-40 h-40
                    rounded-full
                    blur-3xl
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity duration-500
                    ${colors.glow}
                  `}
                />

                {/* Number */}
                <div
                  className={`
                    absolute
                    top-5 right-6
                    text-xs
                    font-bold
                    tracking-widest
                    ${darkMode ? "text-slate-700" : "text-slate-300"}
                  `}
                >
                  {item.number}
                </div>

                {/* Icon */}
                <div
                  className={`
                    relative
                    w-16 h-16
                    rounded-2xl
                    flex items-center justify-center
                    mb-7
                    ${colors.bg}
                    ${colors.icon}
                    transition-all duration-300
                    group-hover:scale-110
                    group-hover:rotate-2
                  `}
                >
                  <Icon size={30} strokeWidth={2} />
                </div>

                {/* Title */}
                <h2
                  className={`
                    relative
                    text-xl
                    font-bold
                    mb-3
                    ${darkMode ? "text-white" : "text-slate-800"}
                  `}
                >
                  {item.title}
                </h2>

                {/* Description */}
                <p
                  className={`
                    relative
                    text-sm sm:text-base
                    leading-7
                    ${darkMode ? "text-slate-400" : "text-slate-600"}
                  `}
                >
                  {item.description}
                </p>

                {/* Bottom line */}
                <div
                  className="
                    absolute
                    bottom-0 left-6 right-6
                    h-1
                    rounded-t-full
                    bg-gradient-to-r
                    from-[#670fff]
                    via-[#8b5cf6]
                    to-[#43D262]
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity duration-300
                  "
                />
              </article>
            );
          })}
        </section>

        {/* Quick help */}
        <section
          className={`
            mt-8
            rounded-3xl
            border
            p-6 sm:p-8
            ${
              darkMode
                ? "bg-slate-900/70 border-slate-800"
                : "bg-white/80 border-slate-200"
            }
          `}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              "Elan yerləşdirmə ilə bağlı yardım",
              "Hesab və profil dəstəyi",
              "Texniki problemlər üzrə dəstək",
            ].map((item) => (
              <div
                key={item}
                className={`
                  flex items-center gap-3
                  text-sm sm:text-base
                  font-medium
                  ${darkMode ? "text-slate-300" : "text-slate-700"}
                `}
              >
                <CheckCircle2 size={20} className="text-green-500 shrink-0" />

                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section
          className="
            relative overflow-hidden
            mt-8
            rounded-3xl
            p-7 sm:p-10
            text-center
            bg-gradient-to-br
            from-[#670fff]
            via-[#7c3aed]
            to-[#43D262]
            shadow-2xl
            shadow-purple-500/20
          "
        >
          <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-white/10 blur-2xl" />

          <div className="absolute -bottom-20 -right-20 w-52 h-52 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            <div
              className="
                mx-auto mb-4
                w-14 h-14
                rounded-2xl
                bg-white/15
                flex items-center justify-center
                text-white
              "
            >
              <MessageCircle size={28} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Hələ də sualınız var?
            </h2>

            <p className="max-w-xl mx-auto text-sm sm:text-base text-white/80 leading-7 mb-7">
              Probleminizi həll etmək üçün bizimlə birbaşa əlaqə saxlaya
              bilərsiniz. Sizə mümkün qədər tez cavab verməyə çalışacağıq.
            </p>

            <a
              href="https://wa.me/994559138099"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center justify-center gap-2
                px-7 sm:px-8
                py-3.5
                rounded-2xl
                bg-white
                text-purple-700
                font-bold
                shadow-xl
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-2xl
                active:scale-95
              "
            >
              Bizə Yazın
              <ArrowRight size={18} />
            </a>
          </div>
        </section>
      </main>

      <BottomMenu />
    </div>
  );
};

export default Yardim;
