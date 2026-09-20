import React from "react";
import { Car, Sparkles } from "lucide-react";

import CreatePost from "../../../components/CreatePostNeqliyyat";
import BottomMenu from "../../../components/MobileMenu";
import { useTheme } from "../../../components/Main/ThemeContext";
import BubbleBackground from "../../../components/ui/BubbleBackground";

export default function Neqliyyat() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      <BubbleBackground />

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-24 pb-28 sm:pb-12">
        {/* =====================================================
            Header
        ===================================================== */}

        <div className="mx-auto mb-8 sm:mb-10 max-w-3xl text-center">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${
              darkMode
                ? "border-[#670fff]/20 bg-[#670fff]/15 text-violet-300"
                : "border-[#670fff]/10 bg-[#670fff]/10 text-[#670fff]"
            }`}
          >
            <Sparkles size={16} />
            ProElan
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-blue-500/20">
              <Car size={23} />
            </div>

            <h1
              className={`text-2xl font-black tracking-tight sm:text-4xl ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Nəqliyyat
            </h1>
          </div>

          <p
            className={`mx-auto mt-3 max-w-xl text-sm leading-6 sm:text-base ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Nəqliyyat vasitəniz üçün elan yaradın və avtomobil haqqında
            məlumatları aşağıdakı formada qeyd edin.
          </p>
        </div>

        {/* =====================================================
            Form Card
        ===================================================== */}

        <section
          className={`relative overflow-hidden rounded-[28px] border p-3 sm:p-5 lg:p-7 ${
            darkMode
              ? "border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/20"
              : "border-slate-200 bg-white shadow-xl shadow-slate-300/20"
          }`}
        >
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10">
            <CreatePost />
          </div>
        </section>
      </main>

      <BottomMenu />
    </div>
  );
}
