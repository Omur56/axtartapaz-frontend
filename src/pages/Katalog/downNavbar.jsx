import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, X, ArrowRight } from "lucide-react";
import { FaThLarge } from "react-icons/fa";

import Car1 from "../../../src/icon_nav/cat_1.png";
import EvBag from "../../../src/icon_nav/ev_ve_bag.png";
import Elektronika from "../../../src/icon_nav/elektronika.png";
import Ehtiyyat from "../../../src/icon_nav/ehtiyyat.png";
import Dasinmaz from "../../../src/icon_nav/dasinmaz.png";
import Meiset from "../../../src/icon_nav/meiset.png";
import Telefon from "../../../src/icon_nav/telefon.png";
import Geyim from "../../../src/icon_nav/geyim.png";
import List from "../../../src/icon_nav/fi-rr-grid.svg";

import { useTheme } from "../../components/Main/ThemeContext";

const DownNavbar = () => {
  const [open, setOpen] = useState(false);
  const { darkMode } = useTheme();

  const categories = [
    {
      id: 0,
      icon: List,
      bg: "bg-red-500",
      name: "Bütün kataloq",
      path: "/Katalog",
    },
    {
      id: 1,
      icon: Car1,
      bg: "bg-green-500",
      name: "Nəqliyyat",
      path: "/Katalog/Nəqliyyat",
    },
    {
      id: 2,
      icon: EvBag,
      bg: "bg-yellow-500",
      name: "Ev və Bağ üçün",
      path: "/Katalog/Ev_veBag",
    },
    {
      id: 3,
      icon: Elektronika,
      bg: "bg-blue-600",
      name: "Elektronika",
      path: "/Katalog/Elektronika",
    },
    {
      id: 4,
      icon: Ehtiyyat,
      bg: "bg-red-400",
      name: "Ehtiyat hissələri",
      path: "/Katalog/Ehtiyyat_hissələri_ve_aksesuarlar",
    },
    {
      id: 5,
      icon: Dasinmaz,
      bg: "bg-slate-600",
      name: "Daşınmaz əmlak",
      path: "/Katalog/Daşınmaz_əmlak",
    },
    {
      id: 6,
      icon: Meiset,
      bg: "bg-orange-500",
      name: "Məişət Texnikası",
      path: "/Katalog/Məişət_Texnikası",
    },
    {
      id: 7,
      icon: Telefon,
      bg: "bg-indigo-600",
      name: "Telefonlar",
      path: "/Katalog/Telefonlar",
    },
    {
      id: 8,
      icon: Geyim,
      bg: "bg-pink-600",
      name: "Geyimlər",
      path: "/Katalog/Geyimlər",
    },
  ];

  // Menyu açıq olanda arxa səhifənin scroll olmasının qarşısını alır
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => {
    setOpen(false);
  };

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      {/* =================================
          KATALOQ BUTTON
      ================================= */}

      <nav className="relative z-[10000]">
        <button
          type="button"
          onClick={handleOpen}
          aria-label={open ? "Kataloqu bağla" : "Kataloqu aç"}
          aria-expanded={open}
          className={`
            group
            relative
            flex
            items-center
            justify-center
            gap-2
            h-10
            min-w-[105px]
            sm:min-w-[115px]
            px-3
            rounded-xl
            border
            overflow-hidden
            transition-all
            duration-300
            active:scale-95

            ${
              open
                ? darkMode
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-purple-50 border-purple-200 text-[#670fff]"
                : "bg-[#670fff] border-[#670fff] text-white hover:bg-[#5b0de0]"
            }
          `}
        >
          <span
            className="
              absolute
              inset-0
              bg-white/10
              opacity-0
              group-hover:opacity-100
              transition-opacity
              duration-300
            "
          />

          <span className="relative z-10 flex items-center gap-2">
            <FaThLarge
              size={16}
              className={`
                transition-transform
                duration-300
                ${open ? "rotate-90" : "rotate-0"}
              `}
            />

            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
              Kataloq
            </span>

            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>
      </nav>

      {/* =================================
          OVERLAY
      ================================= */}

      <div
        className={`
          fixed
          inset-0
          z-[9999]
          transition-all
          duration-300

          ${
            open
              ? "visible pointer-events-auto"
              : "invisible pointer-events-none"
          }
        `}
      >
        {/* Arxa fon */}

        <div
          onClick={close}
          className={`
            absolute
            inset-0
            bg-black/50
            backdrop-blur-[2px]
            transition-opacity
            duration-300

            ${open ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* =================================
            SIDE PANEL
        ================================= */}

        <aside
          className={`
            absolute
            left-0
            top-0
            bottom-0

            w-[calc(100%-12px)]
            max-w-[430px]

            sm:w-[420px]
            md:w-[440px]

            flex
            flex-col

            border-r

            shadow-2xl

            rounded-r-3xl

            transition-transform
            duration-300
            ease-out

            ${
              darkMode
                ? "bg-slate-950 border-white/10"
                : "bg-white border-slate-200"
            }

            ${open ? "translate-x-0" : "-translate-x-full"}
          `}
          style={{
            height: "100dvh",
          }}
        >
          {/* =================================
              HEADER
          ================================= */}

          <div
            className={`
              shrink-0
              h-[76px]

              flex
              items-center
              justify-between

              px-4
              sm:px-5

              border-b

              ${
                darkMode
                  ? "bg-slate-950 border-white/10"
                  : "bg-white border-slate-200"
              }
            `}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* ICON */}

              <div
                className="
                  shrink-0
                  flex
                  items-center
                  justify-center

                  w-10
                  h-10

                  rounded-xl

                  bg-[#670fff]
                  text-white

                  shadow-lg
                  shadow-[#670fff]/20
                "
              >
                <FaThLarge size={17} />
              </div>

              {/* TITLE */}

              <div className="min-w-0">
                <h2
                  className={`
                    text-base
                    sm:text-lg
                    font-bold
                    truncate

                    ${darkMode ? "text-white" : "text-slate-900"}
                  `}
                >
                  Bütün kateqoriyalar
                </h2>

                <p
                  className={`
                    text-[10px]
                    sm:text-xs
                    mt-0.5
                    truncate

                    ${darkMode ? "text-slate-400" : "text-slate-500"}
                  `}
                >
                  Elan kateqoriyasını seçin
                </p>
              </div>
            </div>

            {/* CLOSE */}

            <button
              type="button"
              onClick={close}
              aria-label="Kataloqu bağla"
              className={`
                shrink-0

                flex
                items-center
                justify-center

                w-10
                h-10

                ml-3

                rounded-xl

                transition-all
                duration-200

                active:scale-90

                ${
                  darkMode
                    ? "text-slate-300 hover:bg-white/10 hover:text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }
              `}
            >
              <X size={21} />
            </button>
          </div>

          {/* =================================
              CATEGORY LIST
          ================================= */}

          <div
            className="
              flex-1
              min-h-0

              overflow-y-auto
              overscroll-contain

              px-3
              sm:px-4

              py-4

              scrollbar-thin
            "
          >
            <div className="space-y-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={cat.path}
                  onClick={() => {
                    close();
                    scrollTop();
                  }}
                  className={`
                    group

                    flex
                    items-center

                    w-full
                    min-h-[62px]

                    p-2

                    rounded-2xl
                    border

                    transition-all
                    duration-200

                    ${
                      darkMode
                        ? "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.08]"
                        : "bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-md"
                    }
                  `}
                >
                  {/* ICON */}

                  <div
                    className={`
                      shrink-0

                      flex
                      items-center
                      justify-center

                      w-11
                      h-11

                      sm:w-12
                      sm:h-12

                      rounded-xl

                      ${cat.bg}

                      transition-transform
                      duration-300

                      group-hover:scale-105
                    `}
                  >
                    <img
                      src={cat.icon}
                      alt={cat.name}
                      className="
                        w-7
                        h-7

                        sm:w-8
                        sm:h-8

                        object-contain
                      "
                    />
                  </div>

                  {/* TEXT */}

                  <div className="flex-1 min-w-0 ml-3">
                    <span
                      className={`
                        block

                        text-sm
                        sm:text-[15px]

                        font-semibold

                        truncate

                        ${
                          darkMode
                            ? "text-slate-200 group-hover:text-white"
                            : "text-slate-700 group-hover:text-[#670fff]"
                        }
                      `}
                    >
                      {cat.name}
                    </span>

                    <span
                      className={`
                        block

                        text-[10px]
                        sm:text-[11px]

                        mt-0.5

                        ${darkMode ? "text-slate-500" : "text-slate-400"}
                      `}
                    >
                      Kateqoriyaya bax
                    </span>
                  </div>

                  {/* ARROW */}

                  <div
                    className={`
                      shrink-0

                      flex
                      items-center
                      justify-center

                      w-8
                      h-8

                      rounded-lg

                      transition-all
                      duration-300

                      ${
                        darkMode
                          ? "text-slate-500 group-hover:bg-white/10 group-hover:text-white"
                          : "text-slate-400 group-hover:bg-purple-50 group-hover:text-[#670fff]"
                      }

                      group-hover:translate-x-1
                    `}
                  >
                    <ArrowRight size={17} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* =================================
              BOTTOM
          ================================= */}

          <div
            className={`
              shrink-0

              px-4
              py-3

              border-t

              text-center

              ${
                darkMode
                  ? "border-white/10 text-slate-500"
                  : "border-slate-100 text-slate-400"
              }
            `}
          >
            <span className="text-[10px] sm:text-xs">ProElan.az</span>
          </div>
        </aside>
      </div>
    </>
  );
};

export default DownNavbar;
