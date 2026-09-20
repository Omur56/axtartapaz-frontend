import React from "react";    
import { Helmet } from "react-helmet-async";
import {
  MessageCircle,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "../../components/Main/ThemeContext";
import BubbleBackground from "../../components/ui/BubbleBackground";
import BottomMenu from "../../components/MobileMenu";

const Contact = () => {
  const { darkMode } = useTheme();

  const contactItems = [
    {
      icon: MessageCircle,
      title: "WhatsApp ilə əlaqə",
      value: "+994 55 913 80 99",
      href: "https://wa.me/+994559138099",
      color: "green",
      description: "Bizə WhatsApp üzərindən yazın",
    },
    {
      icon: Phone,
      title: "Mobil nömrə",
      value: "+994 55 913 80 99",
      href: "tel:+994559138099",
      color: "blue",
      description: "Birbaşa bizimlə əlaqə saxlayın",
    },
    {
      icon: Mail,
      title: "Elektron poçt",
      value: "omur199624@gmail.com",
      href: "mailto:omur199624@gmail.com",
      color: "pink",
      description: "Bizə elektron poçt göndərin",
    },
  ];

  const colorClasses = {
    green: {
      icon: "text-green-500",
      bg: darkMode ? "bg-green-500/10" : "bg-green-50",
      border: "border-green-500/20",
      hover: "group-hover:bg-green-500",
      text: "text-green-600 dark:text-green-400",
    },
    blue: {
      icon: "text-blue-500",
      bg: darkMode ? "bg-blue-500/10" : "bg-blue-50",
      border: "border-blue-500/20",
      hover: "group-hover:bg-blue-500",
      text: "text-blue-600 dark:text-blue-400",
    },
    pink: {
      icon: "text-pink-500",
      bg: darkMode ? "bg-pink-500/10" : "bg-pink-50",
      border: "border-pink-500/20",
      hover: "group-hover:bg-pink-500",
      text: "text-pink-600 dark:text-pink-400",
    },
  };

  return (
    <>
      <Helmet>
        <title>Bizimlə əlaqə | ProElan.az</title>
        <meta
          name="description"
          content="ProElan.az komandası ilə əlaqə saxlayın. WhatsApp, telefon və elektron poçt vasitəsilə bizə yaza bilərsiniz."
        />
        <link rel="canonical" href="https://proelan.az/contact" />
      </Helmet>

      <div
        className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
          darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
        }`}
      >
        <BubbleBackground />

        <main className="relative z-10 px-4 sm:px-6 lg:px-8 pt-[105px] pb-24 sm:pb-16">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10 sm:mb-14">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-5 ${
                  darkMode
                    ? "bg-white/5 border-white/10 text-slate-300"
                    : "bg-white border-slate-200 text-slate-600 shadow-sm"
                }`}
              >
                <Sparkles size={16} className="text-[#670fff]" />
                <span className="text-sm font-semibold">ProElan.az</span>
              </div>

              <h1
                className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Bizimlə{" "}
                <span className="bg-gradient-to-r from-[#670fff] via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  əlaqə saxlayın
                </span>
              </h1>

              <p
                className={`max-w-2xl mx-auto text-base sm:text-lg leading-7 ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Sualınız, təklifiniz və ya hər hansı probleminiz varsa,
                ProElan.az komandası ilə əlaqə saxlaya bilərsiniz. Sizə kömək
                etməkdən məmnun olarıq.
              </p>
            </div>

            {/* Main Card */}
            <div
              className={`relative overflow-hidden rounded-[28px] border shadow-2xl ${
                darkMode
                  ? "bg-slate-900/80 border-white/10 shadow-black/30"
                  : "bg-white/90 border-slate-200 shadow-slate-200/70"
              } backdrop-blur-xl`}
            >
              {/* Gradient top */}
              <div className="h-1.5 bg-gradient-to-r from-green-400 via-[#670fff] to-pink-500" />

              <div className="p-5 sm:p-8 lg:p-10">
                {/* Intro */}
                <div className="text-center mb-8">
                  <div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
                      darkMode ? "bg-[#670fff]/15" : "bg-[#670fff]/10"
                    }`}
                  >
                    <MessageCircle size={28} className="text-[#670fff]" />
                  </div>

                  <h2
                    className={`text-2xl sm:text-3xl font-bold mb-2 ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Sizdən eşitmək xoşdur
                  </h2>

                  <p
                    className={`text-sm sm:text-base ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Aşağıdakı üsullardan sizin üçün uyğun olanı seçin.
                  </p>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                  {contactItems.map((item) => {
                    const Icon = item.icon;
                    const colors = colorClasses[item.color];

                    return (
                      <a
                        key={item.title}
                        href={item.href}
                        target={item.color === "green" ? "_blank" : undefined}
                        rel={
                          item.color === "green"
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                          darkMode
                            ? "bg-slate-800/60 border-white/10 hover:bg-slate-800"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${colors.bg} transition-all duration-300 ${colors.hover}`}
                        >
                          <Icon
                            size={27}
                            className={`${colors.icon} transition-colors duration-300 group-hover:text-white`}
                          />
                        </div>

                        <h3
                          className={`text-base sm:text-lg font-bold mb-2 ${
                            darkMode ? "text-white" : "text-slate-800"
                          }`}
                        >
                          {item.title}
                        </h3>

                        <p
                          className={`text-xs sm:text-sm mb-3 ${
                            darkMode ? "text-slate-500" : "text-slate-500"
                          }`}
                        >
                          {item.description}
                        </p>

                        <span
                          className={`inline-flex items-center gap-1.5 text-sm font-semibold break-all ${colors.text}`}
                        >
                          {item.value}
                          <ArrowRight
                            size={14}
                            className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </span>
                      </a>
                    );
                  })}
                </div>

                {/* Bottom info */}
                <div
                  className={`mt-8 rounded-2xl border p-5 sm:p-6 ${
                    darkMode
                      ? "bg-gradient-to-r from-[#670fff]/10 to-green-500/5 border-white/10"
                      : "bg-gradient-to-r from-purple-50 to-green-50 border-purple-100"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        darkMode ? "bg-white/10" : "bg-white shadow-sm"
                      }`}
                    >
                      <ShieldCheck size={23} className="text-[#670fff]" />
                    </div>

                    <div className="flex-1">
                      <h3
                        className={`font-bold mb-1 ${
                          darkMode ? "text-white" : "text-slate-800"
                        }`}
                      >
                        ProElan.az komandası
                      </h3>

                      <p
                        className={`text-sm leading-6 ${
                          darkMode ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        Sual və müraciətlərinizi bizə göndərin. Mümkün qədər tez
                        cavab verməyə çalışacağıq.
                      </p>
                    </div>

                    <a
                      href="mailto:omur199624@gmail.com"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#670fff] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#670fff]/20 transition-all duration-300 hover:bg-[#5700e6] hover:-translate-y-0.5"
                    >
                      <Mail size={17} />
                      Bizə yazın
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer text */}
            <p
              className={`text-center text-xs sm:text-sm mt-6 ${
                darkMode ? "text-slate-600" : "text-slate-400"
              }`}
            >
              ProElan.az — Azərbaycanda pulsuz elanlar platforması
            </p>
          </div>
        </main>

        <BottomMenu />
      </div>
    </>
  );
};

export default Contact;
