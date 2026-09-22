import React from "react";

import { Link } from "react-router-dom";

import { ArrowRight, Grid3X3, Sparkles } from "lucide-react";

import BottomMenu from "../../../components/MobileMenu";

import { useTheme } from "../../../components/Main/ThemeContext";

import BubbleBackground from "../../../components/ui/BubbleBackground";

// Kateqoriyaların şəkilləri
import Car1 from "../../../icon_nav/cat_1.png";
import EvBag from "../../../icon_nav/ev_ve_bag.png";
import Elektronika from "../../../icon_nav/elektronika.png";
import Ehtiyyat from "../../../icon_nav/ehtiyyat.png";
import Dasinmaz from "../../../icon_nav/dasinmaz.png";
import Meiset from "../../../icon_nav/meiset.png";
import Telefon from "../../../icon_nav/telefon.png";
import Geyim from "../../../icon_nav/geyim.png";

export const categories = [
  {
    id: 1,
    path: "Nəqliyyat",
    label: "Nəqliyyat",

    // Backend BusinessProfile.category
    categoryKey: "car",

    icon: Car1,
    gradient: "from-blue-500 to-cyan-500",
    glow: "group-hover:shadow-blue-500/30",

    // Katalog.jsx-də istifadə olunduğu üçün
    bgColor: "bg-blue-500",
    hover: "hover:bg-blue-600",
  },

  {
    id: 2,
    path: "Ev_veBag",
    label: "Ev və Bağ üçün",

    // Backend BusinessProfile.category
    categoryKey: "homeGarden",

    icon: EvBag,
    gradient: "from-emerald-500 to-green-500",
    glow: "group-hover:shadow-emerald-500/30",

    bgColor: "bg-emerald-500",
    hover: "hover:bg-emerald-600",
  },

  {
    id: 3,
    path: "Elektronika",
    label: "Elektronika",

    // Backend BusinessProfile.category
    categoryKey: "electronics",

    icon: Elektronika,
    gradient: "from-violet-500 to-blue-500",
    glow: "group-hover:shadow-violet-500/30",

    bgColor: "bg-violet-500",
    hover: "hover:bg-violet-600",
  },

  {
    id: 4,
    path: "Ehtiyyat_hissələri_ve_aksesuarlar",
    label: "Ehtiyyat hissələri və aksesuarlar",

    // Backend BusinessProfile.category
    categoryKey: "accessory",

    icon: Ehtiyyat,
    gradient: "from-amber-400 to-orange-500",
    glow: "group-hover:shadow-orange-500/30",

    bgColor: "bg-orange-500",
    hover: "hover:bg-orange-600",
  },

  {
    id: 5,
    path: "Daşınmaz_əmlak",
    label: "Daşınmaz əmlak",

    // Backend BusinessProfile.category
    categoryKey: "realEstate",

    icon: Dasinmaz,
    gradient: "from-purple-500 to-fuchsia-500",
    glow: "group-hover:shadow-purple-500/30",

    bgColor: "bg-purple-500",
    hover: "hover:bg-purple-600",
  },

  {
    id: 6,
    path: "Məişət_Texnikası",
    label: "Məişət Texnikası",

    // Backend BusinessProfile.category
    categoryKey: "household",

    icon: Meiset,
    gradient: "from-pink-500 to-rose-500",
    glow: "group-hover:shadow-pink-500/30",

    bgColor: "bg-pink-500",
    hover: "hover:bg-pink-600",
  },

  {
    id: 7,
    path: "Telefonlar",
    label: "Telefonlar",

    // Backend BusinessProfile.category
    categoryKey: "phone",

    icon: Telefon,
    gradient: "from-indigo-500 to-violet-500",
    glow: "group-hover:shadow-indigo-500/30",

    bgColor: "bg-indigo-500",
    hover: "hover:bg-indigo-600",
  },

  {
    id: 8,
    path: "Geyimlər",
    label: "Geyimlər",

    // Backend BusinessProfile.category
    categoryKey: "clothing",

    icon: Geyim,
    gradient: "from-teal-500 to-cyan-500",
    glow: "group-hover:shadow-teal-500/30",

    bgColor: "bg-teal-500",
    hover: "hover:bg-teal-600",
  },
];

const Katalog = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`
        relative min-h-screen w-full overflow-hidden
        ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}
      `}
    >
      <BubbleBackground />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 sm:pb-12">
        {/* Header */}

        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#670fff]/10 text-[#670fff] text-sm font-bold mb-4">
            <Sparkles size={16} />
            ProElan kataloqu
          </div>

          <h1
            className={`
              text-3xl sm:text-4xl md:text-5xl
              font-black tracking-tight
              ${darkMode ? "text-white" : "text-slate-900"}
            `}
          >
            Kateqoriyanı seç
          </h1>

          <p
            className={`
              mt-3
              text-sm sm:text-base
              max-w-xl mx-auto
              leading-6
              ${darkMode ? "text-slate-400" : "text-slate-500"}
            `}
          >
            Axtardığınız məhsul və xidmətləri daha rahat tapmaq üçün uyğun
            kateqoriyanı seçin.
          </p>
        </div>

        {/* Category grid */}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {categories.map(({ id, path, label, icon, gradient, glow }) => (
            <Link
              key={id}
              to={`/katalog/${path}`}
              className={`
                  group
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  p-[1px]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-2xl
                  ${glow}
                  ${
                    darkMode
                      ? "border-slate-800 bg-slate-900"
                      : "border-slate-200 bg-white shadow-sm"
                  }
                `}
            >
              {/* Gradient top layer */}

              <div
                className={`
                    relative
                    flex
                    min-h-[190px]
                    sm:min-h-[215px]
                    flex-col
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-[23px]
                    bg-gradient-to-br
                    ${gradient}
                    p-5
                  `}
              >
                {/* Decorative circles */}

                <div
                  className="
                      absolute
                      -right-8
                      -top-8
                      w-28
                      h-28
                      rounded-full
                      bg-white/10
                      transition-transform
                      duration-500
                      group-hover:scale-125
                    "
                />

                <div
                  className="
                      absolute
                      -left-10
                      -bottom-10
                      w-32
                      h-32
                      rounded-full
                      bg-black/5
                      transition-transform
                      duration-500
                      group-hover:scale-125
                    "
                />

                {/* Icon container */}

                <div
                  className="
                      relative
                      z-10
                      flex
                      w-20
                      h-20
                      sm:w-24
                      sm:h-24
                      items-center
                      justify-center
                      rounded-3xl
                      bg-white/90
                      shadow-xl
                      backdrop-blur-sm
                      transition-all
                      duration-300
                      group-hover:scale-110
                      group-hover:rotate-2
                    "
                >
                  <img
                    src={icon}
                    alt={label}
                    className="
                        w-14
                        h-14
                        sm:w-17
                        sm:h-17
                        object-contain
                      "
                  />
                </div>

                {/* Label */}

                <div
                  className="
                      relative
                      z-10
                      flex
                      items-center
                      gap-1.5
                      mt-5
                      text-center
                    "
                >
                  <span
                    className="
                        text-sm
                        sm:text-base
                        font-extrabold
                        text-white
                        drop-shadow-sm
                        leading-5
                      "
                  >
                    {label}
                  </span>

                  <ArrowRight
                    size={16}
                    className="
                        text-white
                        opacity-0
                        -translate-x-2
                        transition-all
                        duration-300
                        group-hover:opacity-100
                        group-hover:translate-x-0
                        shrink-0
                      "
                  />
                </div>

                {/* Bottom shine */}

                <div
                  className="
                      absolute
                      inset-x-0
                      bottom-0
                      h-16
                      bg-gradient-to-t
                      from-black/10
                      to-transparent
                      pointer-events-none
                    "
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom info */}

        <div
          className={`
            mt-10
            sm:mt-14
            rounded-3xl
            border
            p-5
            sm:p-6
            ${
              darkMode
                ? "bg-slate-900/80 border-slate-800"
                : "bg-white border-slate-200"
            }
          `}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
            <div
              className="
                w-11
                h-11
                rounded-2xl
                bg-[#670fff]/10
                text-[#670fff]
                flex
                items-center
                justify-center
              "
            >
              <Grid3X3 size={21} />
            </div>

            <div>
              <p
                className={`
                  font-bold
                  ${darkMode ? "text-white" : "text-slate-800"}
                `}
              >
                8 əsas kateqoriya
              </p>

              <p
                className={`
                  text-sm
                  mt-0.5
                  ${darkMode ? "text-slate-500" : "text-slate-400"}
                `}
              >
                Elanınızı düzgün kateqoriyada yerləşdirərək daha rahat satış
                əldə edə bilərsiniz.
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomMenu />
    </div>
  );
};

export default Katalog;
