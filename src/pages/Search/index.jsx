import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Search as SearchIcon,
  SlidersHorizontal,
  X,
  MapPin,
  Tag,
  Car,
  RotateCcw,
  ChevronDown,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import BottomMenu from "../../components/MobileMenu";
import BubbleBackground from "../../components/ui/BubbleBackground";
import { useTheme } from "../../components/Main/ThemeContext";

/* =========================================================
   DEBOUNCE
========================================================= */

const useDebounce = (value, delay = 450) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

/* =========================================================
   HELPERS
========================================================= */

// "305 745", "305,745", "305.745" kimi dəyərləri rəqəmə çevirir
const parseNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  const normalized = String(value)
    .replace(/\s/g, "")
    .replace(/,/g, "")
    .replace(/₼/g, "");

  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
};

const getImage = (item) => {
  if (Array.isArray(item.images) && item.images.length > 0) {
    return item.images[0];
  }

  if (Array.isArray(item.imageUrls) && item.imageUrls.length > 0) {
    return item.imageUrls[0];
  }

  if (item.mainImage) {
    return item.mainImage;
  }

  return "/placeholder.png";
};

const getTitle = (item) => {
  const parts = [item.brand, item.model, item.title].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(" ");
  }

  return "Adsız elan";
};

const getLocation = (item) => {
  return item.city || item.location || "Azərbaycan";
};

const getId = (item) => {
  return item._id || item.id;
};

/* =========================================================
   SEARCH
========================================================= */

const Search = () => {
  const { darkMode } = useTheme();

  const [query, setQuery] = useState("");
  const [allData, setAllData] = useState([]);
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    category: "",
    city: "",
    priceMin: "",
    priceMax: "",
    yearMin: "",
    yearMax: "",
    kmMin: "",
    kmMax: "",
  });

  const debouncedQuery = useDebounce(query);

  /* =========================================================
     API URLS
  ========================================================= */

  const apiUrls = useMemo(
    () => [
      `${process.env.REACT_APP_API_URL}/api/car`,
      `${process.env.REACT_APP_API_URL}/api/homeGarden`,
      `${process.env.REACT_APP_API_URL}/api/electronics`,
      `${process.env.REACT_APP_API_URL}/api/accessory`,
      `${process.env.REACT_APP_API_URL}/api/realEstate`,
      `${process.env.REACT_APP_API_URL}/api/Household`,
      `${process.env.REACT_APP_API_URL}/api/phone`,
      `${process.env.REACT_APP_API_URL}/api/Clothing`,
    ],
    [],
  );

  /* =========================================================
     LOAD DATA
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        const responses = await Promise.allSettled(
          apiUrls.map((url) => axios.get(url)),
        );

        if (!mounted) return;

        const merged = [];

        responses.forEach((response, index) => {
          if (
            response.status === "fulfilled" &&
            Array.isArray(response.value.data)
          ) {
            const source = apiUrls[index].split("/api/")[1];

            response.value.data.forEach((item) => {
              merged.push({
                ...item,
                source,
              });
            });
          }
        });

        setAllData(merged);
        setResults(merged);
      } catch (error) {
        console.error("API axtarış xətası:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [apiUrls]);

  /* =========================================================
     FILTER ENGINE
  ========================================================= */

  useEffect(() => {
    const q = debouncedQuery.trim().toLowerCase();

    const filtered = allData.filter((item) => {
      const price = parseNumber(item.price);
      const year = parseNumber(item.year || item.car?.year);

      const km = parseNumber(item.km || item.car?.km);

      const brand = item.brand || item.car?.brand || "";

      const model = item.model || item.car?.model || "";

      const category = item.category || item.car?.category || "";

      const city = item.city || item.location || "";

      const text = [
        item.title,
        brand,
        model,
        category,
        item.description,
        item.location,
        item.city,
        item.price,
        item.engine,
        item.motor,
        item.transmission,
        item.ban_type,
        item.bodyType,
        item.car?.brand,
        item.car?.model,
        item.car?.generation,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = !q || text.includes(q);

      const matchesBrand =
        !filters.brand ||
        brand.toString().toLowerCase().includes(filters.brand.toLowerCase());

      const matchesModel =
        !filters.model ||
        model.toString().toLowerCase().includes(filters.model.toLowerCase());

      const matchesCategory =
        !filters.category ||
        category
          .toString()
          .toLowerCase()
          .includes(filters.category.toLowerCase());

      const matchesCity =
        !filters.city ||
        city.toString().toLowerCase().includes(filters.city.toLowerCase());

      const matchesPriceMin =
        !filters.priceMin || price >= Number(filters.priceMin);

      const matchesPriceMax =
        !filters.priceMax || price <= Number(filters.priceMax);

      const matchesYearMin =
        !filters.yearMin || year >= Number(filters.yearMin);

      const matchesYearMax =
        !filters.yearMax || year <= Number(filters.yearMax);

      const matchesKmMin = !filters.kmMin || km >= Number(filters.kmMin);

      const matchesKmMax = !filters.kmMax || km <= Number(filters.kmMax);

      return (
        matchesQuery &&
        matchesBrand &&
        matchesModel &&
        matchesCategory &&
        matchesCity &&
        matchesPriceMin &&
        matchesPriceMax &&
        matchesYearMin &&
        matchesYearMax &&
        matchesKmMin &&
        matchesKmMax
      );
    });

    setResults(filtered);
  }, [debouncedQuery, filters, allData]);

  /* =========================================================
     FILTER CHANGE
  ========================================================= */

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     RESET FILTERS
  ========================================================= */

  const resetFilters = () => {
    setFilters({
      brand: "",
      model: "",
      category: "",
      city: "",
      priceMin: "",
      priceMax: "",
      yearMin: "",
      yearMax: "",
      kmMin: "",
      kmMax: "",
    });

    setQuery("");
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  /* =========================================================
     INPUT COMPONENT
  ========================================================= */

  const FilterInput = ({ name, label, type = "text", icon: Icon }) => (
    <div className="relative">
      {Icon && (
        <Icon
          size={16}
          className="
            absolute left-3 top-1/2
            -translate-y-1/2
            text-slate-400
            pointer-events-none
          "
        />
      )}

      <input
        name={name}
        type={type}
        value={filters[name]}
        placeholder={label}
        onChange={handleFilterChange}
        className={`
          w-full
          h-11
          rounded-xl
          border
          border-slate-200
          dark:border-slate-700
          bg-slate-50
          dark:bg-slate-950/60
          text-slate-800
          dark:text-white
          placeholder:text-slate-400
          text-sm
          outline-none
          transition-all
          focus:border-purple-500
          focus:ring-4
          focus:ring-purple-500/10
          ${Icon ? "pl-10 pr-3" : "px-3"}
        `}
      />
    </div>
  );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-slate-50
        dark:bg-slate-950
        text-slate-900
        dark:text-white
        transition-colors duration-300
      "
    >
      <BubbleBackground />

      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            -top-40
            -right-40
            w-96
            h-96
            rounded-full
            bg-purple-500/10
            dark:bg-purple-500/15
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -left-40
            w-96
            h-96
            rounded-full
            bg-green-400/10
            blur-3xl
          "
        />
      </div>

      <main
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          pt-[90px]
          pb-24
        "
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-7">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="
                flex items-center justify-center
                w-11 h-11
                rounded-2xl
                bg-gradient-to-br
                from-purple-600
                to-violet-500
                shadow-lg
                shadow-purple-500/20
              "
            >
              <SearchIcon size={21} className="text-white" />
            </div>

            <div>
              <h1
                className="
                  text-2xl
                  sm:text-3xl
                  font-extrabold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                "
              >
                Elan axtar
              </h1>

              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                İstədiyiniz elanı tez və rahat tapın
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            SEARCH BAR
        ===================================================== */}

        <div
          className="
            relative
            rounded-[24px]
            border
            border-slate-200/70
            dark:border-white/10
            bg-white/85
            dark:bg-slate-900/80
            backdrop-blur-xl
            shadow-xl
            shadow-slate-900/5
            dark:shadow-black/20
            p-3
            sm:p-4
            mb-5
          "
        >
          <div className="relative">
            <SearchIcon
              size={21}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              placeholder="Elan, marka, model, şəhər üzrə axtar..."
              className="
                w-full
                h-14
                rounded-2xl
                border
                border-slate-200
                dark:border-slate-700
                bg-slate-50
                dark:bg-slate-950/70
                text-slate-900
                dark:text-white
                placeholder:text-slate-400
                pl-12
                pr-14
                outline-none
                focus:border-purple-500
                focus:ring-4
                focus:ring-purple-500/10
                transition-all
              "
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  rounded-xl
                  text-slate-400
                  hover:text-slate-700
                  dark:hover:text-white
                  hover:bg-slate-200
                  dark:hover:bg-slate-800
                  transition
                "
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* =====================================================
            FILTER HEADER
        ===================================================== */}

        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={19} className="text-purple-500" />

            <h2
              className="
                font-bold
                text-slate-800
                dark:text-slate-100
              "
            >
              Filtrlər
            </h2>

            {activeFilterCount > 0 && (
              <span
                className="
                  min-w-6
                  h-6
                  px-1.5
                  flex
                  items-center
                  justify-center
                  rounded-full
                  bg-purple-600
                  text-white
                  text-xs
                  font-bold
                "
              >
                {activeFilterCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="
                  flex
                  items-center
                  gap-1.5
                  text-xs
                  sm:text-sm
                  font-semibold
                  text-purple-600
                  dark:text-purple-400
                  hover:underline
                "
              >
                <RotateCcw size={15} />
                Sıfırla
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="
                md:hidden
                flex
                items-center
                gap-1
                px-3
                py-2
                rounded-xl
                bg-slate-100
                dark:bg-slate-800
                text-sm
                font-semibold
                text-slate-700
                dark:text-slate-200
              "
            >
              {showFilters ? "Gizlət" : "Göstər"}

              <ChevronDown
                size={16}
                className={`
                  transition-transform
                  ${showFilters ? "rotate-180" : ""}
                `}
              />
            </button>
          </div>
        </div>

        {/* =====================================================
            FILTER PANEL
        ===================================================== */}

        <div
          className={`
            ${showFilters ? "grid" : "hidden md:grid"}
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-5
            gap-3
            rounded-[22px]
            border
            border-slate-200/70
            dark:border-white/10
            bg-white/85
            dark:bg-slate-900/80
            backdrop-blur-xl
            p-4
            mb-7
          `}
        >
          <FilterInput name="brand" label="Marka" icon={Tag} />

          <FilterInput name="model" label="Model" icon={Car} />

          <FilterInput name="category" label="Kateqoriya" icon={Tag} />

          <FilterInput name="city" label="Şəhər" icon={MapPin} />

          <FilterInput name="priceMin" label="Min ₼" type="number" />

          <FilterInput name="priceMax" label="Max ₼" type="number" />

          <FilterInput name="yearMin" label="Min il" type="number" />

          <FilterInput name="yearMax" label="Max il" type="number" />

          <FilterInput name="kmMin" label="Min km" type="number" />

          <FilterInput name="kmMax" label="Max km" type="number" />
        </div>

        {/* =====================================================
            RESULT COUNT
        ===================================================== */}

        {!loading && (
          <div
            className="
              flex
              items-center
              justify-between
              mb-4
              px-1
            "
          >
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              <span
                className="
                  font-bold
                  text-slate-800
                  dark:text-white
                "
              >
                {results.length}
              </span>{" "}
              elan tapıldı
            </p>

            {query && (
              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  text-xs
                  text-purple-600
                  dark:text-purple-400
                "
              >
                <Sparkles size={14} />“{query}” üzrə nəticələr
              </div>
            )}
          </div>
        )}

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 250,
            }}
          >
            <CircularProgress size={42} thickness={4} />
          </Box>
        )}

        {/* =====================================================
            RESULTS
        ===================================================== */}

        {!loading && results.length > 0 && (
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              xl:grid-cols-6
              gap-3
              sm:gap-4
            "
          >
            {results.map((item, index) => {
              const id = getId(item);
              const image = getImage(item);
              const title = getTitle(item);
              const location = getLocation(item);

              const price =
                item.price !== undefined &&
                item.price !== null &&
                item.price !== ""
                  ? item.price
                  : "Qiymət yoxdur";

              return (
                <Link
                  key={`${id || "item"}-${index}`}
                  to={`/${item.source}/${id}`}
                  className="group block min-w-0"
                >
                  <article
                    className="
                      h-full
                      overflow-hidden
                      rounded-[18px]
                      border
                      border-slate-200/80
                      dark:border-slate-800
                      bg-white
                      dark:bg-slate-900
                      shadow-sm
                      hover:shadow-xl
                      hover:-translate-y-1
                      transition-all
                      duration-300
                    "
                  >
                    {/* Image */}
                    <div
                      className="
                        relative
                        h-[150px]
                        sm:h-[165px]
                        overflow-hidden
                        bg-slate-100
                        dark:bg-slate-800
                      "
                    >
                      <img
                        src={image}
                        alt={title}
                        loading="lazy"
                        className="
                          w-full
                          h-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.png";
                        }}
                      />

                      {/* Gradient */}
                      <div
                        className="
                          absolute
                          inset-x-0
                          bottom-0
                          h-20
                          bg-gradient-to-t
                          from-black/40
                          to-transparent
                          pointer-events-none
                        "
                      />

                      {/* Category */}
                      {item.category && (
                        <span
                          className="
                            absolute
                            left-2
                            top-2
                            max-w-[80%]
                            truncate
                            px-2
                            py-1
                            rounded-lg
                            bg-black/55
                            backdrop-blur-md
                            text-white
                            text-[10px]
                            font-semibold
                          "
                        >
                          {item.category}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <div
                        className="
                          text-base
                          sm:text-lg
                          font-extrabold
                          text-slate-900
                          dark:text-white
                          truncate
                        "
                      >
                        {price} ₼
                      </div>

                      <h3
                        className="
                          mt-1
                          text-sm
                          font-semibold
                          leading-5
                          text-slate-700
                          dark:text-slate-200
                          line-clamp-2
                          min-h-[40px]
                        "
                      >
                        {title}
                      </h3>

                      <div
                        className="
                          mt-2
                          flex
                          items-center
                          gap-1
                          text-xs
                          text-slate-400
                          dark:text-slate-500
                          truncate
                        "
                      >
                        <MapPin size={13} className="shrink-0" />

                        <span className="truncate">{location}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}

        {/* =====================================================
            EMPTY RESULT
        ===================================================== */}

        {!loading && results.length === 0 && (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              text-center
              min-h-[320px]
              rounded-[24px]
              border
              border-dashed
              border-slate-300
              dark:border-slate-700
              bg-white/60
              dark:bg-slate-900/50
              px-6
            "
          >
            <div
              className="
                flex
                items-center
                justify-center
                w-16
                h-16
                rounded-2xl
                bg-slate-100
                dark:bg-slate-800
                mb-4
              "
            >
              <AlertCircle
                size={30}
                className="
                  text-slate-400
                  dark:text-slate-500
                "
              />
            </div>

            <h3
              className="
                text-lg
                font-bold
                text-slate-800
                dark:text-white
              "
            >
              Nəticə tapılmadı
            </h3>

            <p
              className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-500
                dark:text-slate-400
              "
            >
              Axtarış sözünü və ya filtrləri dəyişdirərək yenidən cəhd edin.
            </p>

            {(query || activeFilterCount > 0) && (
              <button
                type="button"
                onClick={resetFilters}
                className="
                  mt-5
                  flex
                  items-center
                  gap-2
                  px-5
                  h-11
                  rounded-xl
                  bg-purple-600
                  hover:bg-purple-700
                  text-white
                  font-semibold
                  text-sm
                  shadow-lg
                  shadow-purple-500/20
                  transition
                "
              >
                <RotateCcw size={16} />
                Filtrləri sıfırla
              </button>
            )}
          </div>
        )}
      </main>

      <BottomMenu />
    </div>
  );
};

export default Search;
