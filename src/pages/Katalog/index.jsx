import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { categories } from "./Cateqories";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/scrolbarr.css";
import BottomMenu from "../../components/MobileMenu";
import { useTheme } from "../../components/Main/ThemeContext";

const Katalog = ({
  className,
  width,
  height,
  marginTop,
  businessId,
  businessName,
  businessCategory,
}) => {
  const [activeId, setActiveId] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const { darkMode } = useTheme();

  // =====================================================
  // BİZNES KATEQORİYASINI NORMALİZƏ ET
  // =====================================================

  const normalizedBusinessCategory =
    typeof businessCategory === "string" ? businessCategory.trim() : "";

  // =====================================================
  // BACKEND KATEQORİYASINI CATEQORIES.JS PATH-INA
  // ÇEVİR
  // =====================================================

  const businessCategoryPathMap = {
    car: "Nəqliyyat",
    homeGarden: "Ev_veBag",
    electronics: "Elektronika",
    accessory: "Ehtiyyat_hissələri_ve_aksesuarlar",
    realEstate: "Daşınmaz_əmlak",
    household: "Məişət_Texnikası",
    phone: "Telefonlar",
    clothing: "Geyimlər",
    listing: null,
  };

  const businessCategoryPath =
    businessCategoryPathMap[normalizedBusinessCategory] || null;

  // =====================================================
  // DEBUG - BUSINESS MƏLUMATLARI
  // =====================================================

  useEffect(() => {
    console.log("========================================");
    console.log("🏪 KATALOG BUSINESS INFO");
    console.log("🏪 BUSINESS ID:", businessId);
    console.log("🏪 BUSINESS NAME:", businessName);
    console.log("🏪 BUSINESS CATEGORY:", normalizedBusinessCategory);
    console.log("🏪 BUSINESS CATEGORY PATH:", businessCategoryPath);
    console.log("========================================");
  }, [
    businessId,
    businessName,
    normalizedBusinessCategory,
    businessCategoryPath,
  ]);

  // =====================================================
  // IMPORT EDİLƏN KATEQORİYALARI YOXLAMA
  // =====================================================

  useEffect(() => {
    console.log("========================================");
    console.log("🔥 IMPORT EDİLƏN CATEGORIES");
    console.log("🔥 CATEGORIES:", categories);

    console.log(
      "🔥 CATEGORY INFO:",
      categories.map((category) => ({
        id: category.id,
        label: category.label,
        path: category.path,
      })),
    );

    console.log("🔥 BUSINESS CATEGORY:", normalizedBusinessCategory);

    console.log("🔥 EXPECTED CATEGORY PATH:", businessCategoryPath);

    console.log("========================================");
  }, [normalizedBusinessCategory, businessCategoryPath]);

  // =====================================================
  // BİZNES MƏLUMATLARINI SESSION STORAGE-DA SAXLA
  // =====================================================

  useEffect(() => {
    if (businessId && normalizedBusinessCategory) {
      const businessContext = {
        businessId,
        businessName: businessName || "",
        businessCategory: normalizedBusinessCategory,
      };

      sessionStorage.setItem(
        "businessAdContext",
        JSON.stringify(businessContext),
      );

      console.log("💾 BUSINESS CONTEXT SAVED:", businessContext);
    }
  }, [businessId, businessName, normalizedBusinessCategory]);

  // =====================================================
  // KATEQORİYALARI FİLTRLƏ
  //
  // Adi istifadəçi:
  // bütün kateqoriyalar
  //
  // Biznes:
  // yalnız öz biznes kateqoriyası
  // =====================================================

  const finalVisibleCategories =
    businessId && normalizedBusinessCategory
      ? categories.filter((category) => category.path === businessCategoryPath)
      : categories;

  // =====================================================
  // FINAL CATEGORY DEBUG
  // =====================================================

  useEffect(() => {
    console.log("========================================");
    console.log("🔥 FINAL CATEGORY RESULT");

    console.log("🔥 BUSINESS ID:", businessId);

    console.log("🔥 BUSINESS CATEGORY:", normalizedBusinessCategory);

    console.log("🔥 BUSINESS CATEGORY PATH:", businessCategoryPath);

    console.log("🔥 TOTAL CATEGORIES:", categories.length);

    console.log("🔥 FINAL VISIBLE CATEGORIES:", finalVisibleCategories);

    console.log("🔥 FINAL VISIBLE COUNT:", finalVisibleCategories.length);

    console.log("========================================");
  }, [
    businessId,
    normalizedBusinessCategory,
    businessCategoryPath,
    finalVisibleCategories.length,
  ]);

  // =====================================================
  // ƏGƏR BİZNES KATEQORİYASI TAPILMAYIBSA DEBUG
  // =====================================================

  useEffect(() => {
    if (
      businessId &&
      normalizedBusinessCategory &&
      finalVisibleCategories.length === 0
    ) {
      console.error(
        "❌ BUSINESS CATEGORY KATALOGDA TAPILMADI:",
        normalizedBusinessCategory,
      );

      console.error("❌ AXTARILAN PATH:", businessCategoryPath);

      console.log(
        "📋 MÖVCUD KATEQORİYALAR:",
        categories.map((category) => ({
          id: category.id,
          label: category.label,
          path: category.path,
        })),
      );
    }

    if (
      businessId &&
      normalizedBusinessCategory &&
      finalVisibleCategories.length > 0
    ) {
      console.log(
        "✅ BUSINESS CATEGORY TAPILDI:",
        finalVisibleCategories.map((category) => ({
          id: category.id,
          label: category.label,
          path: category.path,
        })),
      );
    }
  }, [
    businessId,
    normalizedBusinessCategory,
    businessCategoryPath,
    finalVisibleCategories.length,
  ]);

  // =====================================================
  // YADDA SAXLANILMIŞ AKTİV KATEQORİYA
  // =====================================================

  useEffect(() => {
    const savedId = sessionStorage.getItem("selectedCategoryId");

    if (savedId) {
      setActiveId(Number(savedId));
    }
  }, []);

  // =====================================================
  // MOBİL SLIDER VƏZİYYƏTİ
  // =====================================================

  const updateScrollButtons = () => {
    const slider = sliderRef.current;

    if (!slider) return;

    setCanScrollLeft(slider.scrollLeft > 5);

    setCanScrollRight(
      slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 5,
    );
  };

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    updateScrollButtons();

    slider.addEventListener("scroll", updateScrollButtons);

    window.addEventListener("resize", updateScrollButtons);

    return () => {
      slider.removeEventListener("scroll", updateScrollButtons);

      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [finalVisibleCategories.length]);

  // =====================================================
  // DESKTOP KATEQORİYA SEÇİMİ
  // =====================================================

  const handleCategoryClick = (id) => {
    setActiveId(id);

    sessionStorage.setItem("selectedCategoryId", id);
  };

  // =====================================================
  // MOBİL SLIDER SOL
  // =====================================================

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.clientWidth * 0.75,
        behavior: "smooth",
      });
    }
  };

  // =====================================================
  // MOBİL SLIDER SAĞ
  // =====================================================

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.clientWidth * 0.75,
        behavior: "smooth",
      });
    }
  };

  // =====================================================
  // BİZNES STATE
  // =====================================================

  const businessState =
    businessId && normalizedBusinessCategory
      ? {
          businessId,
          businessName: businessName || "",
          businessCategory: normalizedBusinessCategory,
        }
      : {};

  // =====================================================
  // KATEQORİYAYA KEÇİŞ
  // =====================================================

  const handleCategoryNavigation = (category) => {
    const state =
      businessId && normalizedBusinessCategory
        ? {
            businessId,
            businessName: businessName || "",
            businessCategory: normalizedBusinessCategory,
          }
        : {};

    console.log("➡️ KATEQORİYAYA KEÇİD:", {
      ...state,
      categoryId: category.id,
      categoryPath: category.path,
      categoryLabel: category.label,
    });

    // Biznes məlumatını yenidən yadda saxla
    if (businessId && normalizedBusinessCategory) {
      sessionStorage.setItem(
        "businessAdContext",
        JSON.stringify({
          businessId,
          businessName: businessName || "",
          businessCategory: normalizedBusinessCategory,
        }),
      );
    }

    return state;
  };

  return (
    <div
      className={`
        ${className || ""}
        mx-auto w-full
        px-2 sm:px-3 lg:px-4
        py-3 sm:py-4
      `}
      style={{
        width: width || "100%",
        minHeight: height || "100px",
        marginTop: marginTop || "5px",
      }}
    >
      {/* =====================================================
          MOBİL VERSİYA
      ====================================================== */}

      <div className="relative block md:hidden w-full">
        {/* Başlıq */}

        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2
              className={`
                text-lg sm:text-xl
                font-extrabold
                tracking-tight
                ${darkMode ? "text-white" : "text-slate-900"}
              `}
            >
              Kateqoriyalar
            </h2>

            <p
              className={`
                text-[11px] sm:text-xs
                mt-0.5
                ${darkMode ? "text-slate-400" : "text-slate-500"}
              `}
            >
              {businessId
                ? "Biznesiniz üçün uyğun kateqoriyanı seçin"
                : "İstədiyiniz kateqoriyanı seçin"}
            </p>
          </div>

          {/* Slider düymələri */}

          {finalVisibleCategories.length > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                aria-label="Əvvəlki kateqoriyalar"
                className={`
                  flex items-center justify-center
                  w-8 h-8
                  rounded-xl
                  border
                  transition-all duration-200
                  ${
                    darkMode
                      ? "bg-white/5 border-white/10 text-white"
                      : "bg-white border-slate-200 text-slate-700"
                  }
                  ${
                    !canScrollLeft
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:scale-105 active:scale-95"
                  }
                `}
              >
                <FontAwesomeIcon icon={faChevronLeft} size="xs" />
              </button>

              <button
                type="button"
                onClick={scrollRight}
                disabled={!canScrollRight}
                aria-label="Növbəti kateqoriyalar"
                className={`
                  flex items-center justify-center
                  w-8 h-8
                  rounded-xl
                  border
                  transition-all duration-200
                  ${
                    darkMode
                      ? "bg-white/5 border-white/10 text-white"
                      : "bg-white border-slate-200 text-slate-700"
                  }
                  ${
                    !canScrollRight
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:scale-105 active:scale-95"
                  }
                `}
              >
                <FontAwesomeIcon icon={faChevronRight} size="xs" />
              </button>
            </div>
          )}
        </div>

        {/* Biznes kateqoriyası tapılmadı */}

        {businessId &&
          normalizedBusinessCategory &&
          finalVisibleCategories.length === 0 && (
            <div
              className={`
                rounded-2xl
                border
                p-5
                text-center
                ${
                  darkMode
                    ? "bg-slate-900 border-slate-800 text-slate-300"
                    : "bg-white border-slate-200 text-slate-600"
                }
              `}
            >
              <p className="font-bold">Kateqoriya tapılmadı</p>

              <p className="text-xs mt-1 opacity-70">
                Biznes kateqoriyası: {normalizedBusinessCategory}
              </p>

              <p className="text-xs mt-1 opacity-70">
                Axtarılan bölmə: {businessCategoryPath || "tapılmadı"}
              </p>
            </div>
          )}

        {/* Slider */}

        {finalVisibleCategories.length > 0 && (
          <div
            ref={sliderRef}
            className="
              flex
              gap-3
              overflow-x-auto
              scrollbar-hide
              scroll-smooth
              snap-x
              snap-mandatory
              pb-2
              px-1
            "
          >
            {finalVisibleCategories.map(
              ({ id, path, icon, bgColor, hover, label }) => {
                const Icon = icon;

                return (
                  <Link
                    key={id}
                    to={`/katalog/${path}`}
                    state={businessState}
                    onClick={() => {
                      handleCategoryClick(id);

                      handleCategoryNavigation({
                        id,
                        path,
                        label,
                      });
                    }}
                    className={`
                      group
                      relative
                      flex-shrink-0
                      snap-start
                      w-[132px]
                      h-[112px]
                      sm:w-[145px]
                      sm:h-[120px]
                      overflow-hidden
                      rounded-2xl
                      ${bgColor || "bg-slate-500"}
                      ${hover || ""}
                      border
                      border-white/20
                      shadow-md
                      hover:shadow-xl
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      active:scale-[0.97]
                      ${
                        activeId === id
                          ? "ring-2 ring-[#670fff] ring-offset-2"
                          : ""
                      }
                    `}
                  >
                    {/* Gradient overlay */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/65
                        via-black/10
                        to-transparent
                        z-10
                      "
                    />

                    {/* İkon / şəkil */}

                    {typeof icon === "string" ? (
                      <img
                        src={icon}
                        alt={label}
                        loading="lazy"
                        className="
                          absolute
                          inset-0
                          w-full
                          h-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-110
                        "
                      />
                    ) : (
                      <div
                        className="
                          absolute
                          inset-0
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Icon
                          className="
                            w-14
                            h-14
                            text-white
                            drop-shadow-lg
                            transition-transform
                            duration-300
                            group-hover:scale-110
                          "
                        />
                      </div>
                    )}

                    {/* Sağ üst ox */}

                    <div
                      className="
                        absolute
                        top-2
                        right-2
                        z-20
                        w-6
                        h-6
                        rounded-full
                        flex
                        items-center
                        justify-center
                        bg-black/20
                        backdrop-blur-md
                        border
                        border-white/20
                        text-white
                      "
                    >
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="text-[9px]"
                      />
                    </div>

                    {/* Kateqoriya adı */}

                    <div
                      className="
                        absolute
                        left-2
                        right-2
                        bottom-2
                        z-20
                      "
                    >
                      <span
                        className="
                          block
                          text-[11px]
                          sm:text-xs
                          font-extrabold
                          text-white
                          leading-tight
                          drop-shadow-lg
                        "
                      >
                        {label}
                      </span>
                    </div>
                  </Link>
                );
              },
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          DESKTOP VERSİYA
      ====================================================== */}

      <div className="hidden md:block w-full">
        {/* Başlıq */}

        <div className="flex items-end justify-between mb-5 px-1">
          <div>
            <h2
              className={`
                text-xl lg:text-2xl
                font-extrabold
                tracking-tight
                ${darkMode ? "text-white" : "text-slate-900"}
              `}
            >
              Kateqoriyalar
            </h2>

            <p
              className={`
                text-xs lg:text-sm
                mt-1
                ${darkMode ? "text-slate-400" : "text-slate-500"}
              `}
            >
              {businessId
                ? "Biznesiniz üçün uyğun kateqoriyanı seçin"
                : "Elanınızı yerləşdirmək və ya axtarış etmək üçün kateqoriya seçin"}
            </p>
          </div>

          <div
            className={`
              hidden lg:flex
              items-center
              gap-2
              text-xs
              ${darkMode ? "text-slate-400" : "text-slate-500"}
            `}
          >
            <span>{finalVisibleCategories.length} kateqoriya</span>
          </div>
        </div>

        {/* Biznes kateqoriyası tapılmadı */}

        {businessId &&
          normalizedBusinessCategory &&
          finalVisibleCategories.length === 0 && (
            <div
              className={`
                rounded-2xl
                border
                p-6
                text-center
                ${
                  darkMode
                    ? "bg-slate-900 border-slate-800 text-slate-300"
                    : "bg-white border-slate-200 text-slate-600"
                }
              `}
            >
              <p className="font-bold text-lg">Kateqoriya tapılmadı</p>

              <p className="text-sm mt-1 opacity-70">
                Biznes kateqoriyası: {normalizedBusinessCategory}
              </p>

              <p className="text-sm mt-1 opacity-70">
                Axtarılan bölmə: {businessCategoryPath || "tapılmadı"}
              </p>
            </div>
          )}

        {/* Desktop grid */}

        {finalVisibleCategories.length > 0 && (
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              xl:grid-cols-6
              gap-4
              lg:gap-5
              w-full
            "
          >
            {finalVisibleCategories.map((cat) => {
              const Icon = cat.icon;

              return (
                <Link
                  key={cat.id}
                  to={`/katalog/${cat.path}`}
                  state={businessState}
                  onClick={() => {
                    handleCategoryClick(cat.id);
                    handleCategoryNavigation(cat);
                  }}
                  aria-label={cat.label}
                  className={`
                    group
                    relative
                    w-full
                    min-w-0
                    h-[125px]
                    lg:h-[135px]
                    overflow-hidden
                    rounded-2xl
                    ${cat.bgColor || "bg-slate-500"}
                    ${cat.hover || ""}
                    border
                    border-white/20
                    shadow-sm
                    hover:shadow-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    active:scale-[0.98]
                    ${
                      activeId === cat.id
                        ? "ring-2 ring-[#670fff] ring-offset-2"
                        : ""
                    }
                  `}
                >
                  {/* Şəkil */}

                  {typeof cat.icon === "string" ? (
                    <img
                      src={cat.icon}
                      alt={cat.label}
                      loading="lazy"
                      className="
                        absolute
                        inset-0
                        w-full
                        h-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-110
                      "
                    />
                  ) : (
                    <div
                      className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Icon
                        className="
                          w-14
                          h-14
                          lg:w-16
                          lg:h-16
                          text-white
                          drop-shadow-lg
                          transition-transform
                          duration-300
                          group-hover:scale-110
                          group-hover:rotate-3
                        "
                      />
                    </div>
                  )}

                  {/* Tünd gradient */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/70
                      via-black/15
                      to-transparent
                      z-10
                    "
                  />

                  {/* Sağ yuxarı ox */}

                  <div
                    className="
                      absolute
                      top-3
                      right-3
                      z-20
                      flex
                      items-center
                      justify-center
                      w-7
                      h-7
                      rounded-full
                      bg-black/20
                      backdrop-blur-md
                      border
                      border-white/20
                      text-white
                      transition-all
                      duration-300
                      group-hover:bg-[#670fff]
                      group-hover:scale-110
                    "
                  >
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="text-[10px]"
                    />
                  </div>

                  {/* Aktiv indikator */}

                  {activeId === cat.id && (
                    <div
                      className="
                        absolute
                        top-3
                        left-3
                        z-20
                        w-2
                        h-2
                        rounded-full
                        bg-white
                        shadow-[0_0_10px_rgba(255,255,255,0.9)]
                      "
                    />
                  )}

                  {/* Kateqoriya adı */}

                  <div
                    className="
                      absolute
                      left-3
                      right-3
                      bottom-3
                      z-20
                    "
                  >
                    <p
                      className="
                        text-xs
                        lg:text-sm
                        font-extrabold
                        text-white
                        leading-tight
                        drop-shadow-lg
                      "
                    >
                      {cat.label}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobil aşağı menyu */}

      <BottomMenu />
    </div>
  );
};

export default Katalog;
