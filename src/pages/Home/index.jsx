// ----------------------- Home.jsx ---------------------------

import React, { useEffect, useState, lazy, Suspense, useMemo } from "react";

import axios from "axios";
import { Link } from "react-router-dom";

import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import {
  Heart,
  RefreshCcw,
  Percent,
  MapPin,
  Gem,
  Crown,
  Search,
  SlidersHorizontal,
  RotateCcw,
  X,
  ChevronDown,
  Sparkles,
  Clock3,
} from "lucide-react";

import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";

import { getCardData } from "../../utils/postHelpers";

import "../../styles/home_style.css";

const Katalog = lazy(() => import("../Katalog"));

const BottomMenu = lazy(() => import("../../components/MobileMenu"));

const API =
  process.env.REACT_APP_API_URL || "https://my-backend-wj5g.onrender.com";

const ITEMS_PER_LOAD = 8;

const CATEGORIES = {
  car: "/api/car",
  homeGarden: "/api/homeGarden",
  electronics: "/api/electronics",
  accessory: "/api/accessory",
  realEstate: "/api/realEstate",
  household: "/api/Household",
  phone: "/api/phone",
  clothing: "/api/Clothing",
};

const TYPE_LABELS = {
  magaza: "Salon",
  sifarisle: "Sifarişlə",
  resmi: "Rəsmi",
};

const CATEGORY_LABELS = {
  all: "Bütün kateqoriyalar",
  car: "Avtomobil",
  electronics: "Elektronika",
  phone: "Telefon",
  realEstate: "Əmlak",
  clothing: "Geyim",
  accessory: "Aksesuar",
  household: "Məişət",
  homeGarden: "Ev və bağ",
};

const Home = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  const [favorites, setFavorites] = useState([]);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const [loadingSearch, setLoadingSearch] = useState(false);

  const [stickyAds, setStickyAds] = useState([]);

  const [counts, setCounts] = useState({});

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [motors, setMotors] = useState([]);

  const [showFilters, setShowFilters] = useState(false);

  const [searchParams] = useSearchParams();

  const [filters1, setFilters1] = useState({
    category: "all",
    priceMin: "",
    priceMax: "",
    city: "",
    type: "all",

    brand: "",
    model: "",
    yearMin: "",
    yearMax: "",
    color: "",
    fuel: "",
    motor: "",
    credit: false,
    barter: false,
  });

  /*
   * -------------------------------------------------------
   * FETCH ALL DATA
   * -------------------------------------------------------
   */

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);

      try {
        const requests = Object.entries(CATEGORIES).map(async ([key, url]) => {
          const res = await axios.get(`${API}${url}`);

          const safeData = Array.isArray(res.data) ? res.data : [];

          return [key, safeData];
        });

        const responses = await Promise.all(requests);

        setData(Object.fromEntries(responses));
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  /*
   * -------------------------------------------------------
   * FILTER BRANDS
   * -------------------------------------------------------
   */

  useEffect(() => {
    axios
      .get(`${API}/api/filter/brands`)
      .then((res) => {
        setBrands(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Brand filter error:", err);
        setBrands([]);
      });
  }, []);

  /*
   * -------------------------------------------------------
   * MODELS
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (!filters1.brand) {
      setModels([]);
      return;
    }

    axios
      .get(`${API}/api/filter/models`, {
        params: {
          brand: filters1.brand,
        },
      })
      .then((res) => {
        setModels(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Model filter error:", err);
        setModels([]);
      });
  }, [filters1.brand]);

  /*
   * -------------------------------------------------------
   * MOTORS
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (!filters1.brand || !filters1.model) {
      setMotors([]);
      return;
    }

    axios
      .get(`${API}/api/filter/motors`, {
        params: {
          brand: filters1.brand,
          model: filters1.model,
        },
      })
      .then((res) => {
        setMotors(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Motor filter error:", err);
        setMotors([]);
      });
  }, [filters1.brand, filters1.model]);

  /*
   * -------------------------------------------------------
   * ALL ADS + FILTER
   * -------------------------------------------------------
   */

  const allAds = useMemo(() => {
    return Object.entries(data)
      .flatMap(([type, items]) =>
        (Array.isArray(items) ? items : []).map((item) => ({
          ...item,
          __type: type,
        })),
      )
      .filter((item) => {
        const price = Number(item.price || 0);

        /*
         * CATEGORY
         */

        if (filters1.category !== "all" && item.__type !== filters1.category) {
          return false;
        }

        /*
         * PRICE
         */

        if (filters1.priceMin && price < Number(filters1.priceMin)) {
          return false;
        }

        if (filters1.priceMax && price > Number(filters1.priceMax)) {
          return false;
        }

        /*
         * CITY
         */

        if (
          filters1.city &&
          !(item.location || item.city || item?.realEstate?.city)
            .toLowerCase()
            .includes(filters1.city.toLowerCase())
        ) {
          return false;
        }

        /*
         * PRIORITY
         */

        if (filters1.type !== "all") {
          const type = (item.priorityType || "free").toLowerCase();

          if (type !== filters1.type) {
            return false;
          }
        }

        /*
         * CAR FILTERS
         */

        if (item.__type === "car") {
          if (filters1.brand && item?.car?.brand !== filters1.brand) {
            return false;
          }

          if (filters1.model && item?.car?.model !== filters1.model) {
            return false;
          }

          if (filters1.motor && item?.car?.motor !== filters1.motor) {
            return false;
          }

          if (
            filters1.yearMin &&
            Number(item?.car?.year) < Number(filters1.yearMin)
          ) {
            return false;
          }

          if (
            filters1.yearMax &&
            Number(item?.car?.year) > Number(filters1.yearMax)
          ) {
            return false;
          }

          if (filters1.color && item?.car?.color !== filters1.color) {
            return false;
          }

          if (filters1.fuel && item?.car?.fuel !== filters1.fuel) {
            return false;
          }

          if (filters1.credit && !item?.car?.credit) {
            return false;
          }

          if (filters1.barter && !item?.car?.barter) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const priorityOrder = {
          premium: 3,
          vip: 2,
          free: 1,
        };

        const aPriority =
          priorityOrder[(a.priorityType || "free").toLowerCase()] || 1;

        const bPriority =
          priorityOrder[(b.priorityType || "free").toLowerCase()] || 1;

        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }

        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [data, filters1]);

  /*
   * -------------------------------------------------------
   * SEARCH
   * -------------------------------------------------------
   */

  const handleSearch = () => {
    const q = query.trim().toLowerCase();

    if (!q) {
      setResults([]);
      return;
    }

    setLoadingSearch(true);

    const filtered = allAds.filter((item) => {
      const values = [
        item.title,
        item.brand,
        item.model,
        item.category,
        item.city,
        item.location,
        item.description,

        item?.car?.brand,
        item?.car?.model,
        item?.car?.generation,

        item?.phone?.brand,
        item?.phone?.model,

        item?.electronics?.title,
        item?.electronics?.brand,
        item?.electronics?.model,

        item?.realEstate?.city,

        item?.clothing?.brand,
        item?.clothing?.model,

        item?.homeGarden?.title,
        item?.homeGarden?.brand,
        item?.homeGarden?.model,

        item?.household?.title,
        item?.household?.brand,
        item?.household?.model,

        item?.accessory?.title,
        item?.accessory?.brand,
        item?.accessory?.model,
      ];

      return values
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });

    setResults(filtered);
    setLoadingSearch(false);
  };

  /*
   * SEARCH ENTER
   */

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /*
   * -------------------------------------------------------
   * VISIBLE ADS
   * -------------------------------------------------------
   */

  const visibleAds = allAds.slice(0, visibleCount);

  const displayedAds = query.trim().length > 0 ? results : visibleAds;

  /*
   * -------------------------------------------------------
   * STICKY ADS
   * -------------------------------------------------------
   */

  useEffect(() => {
    const timer = setTimeout(() => {
      axios
        .get(`${API}/api/ads/sticky`)
        .then((res) => {
          setStickyAds(Array.isArray(res.data) ? res.data : []);
        })
        .catch(() => {
          setStickyAds([]);
        });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  /*
   * -------------------------------------------------------
   * COUNTS
   * -------------------------------------------------------
   */

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const cached = sessionStorage.getItem("counts");

        if (cached) {
          setCounts(JSON.parse(cached));
          return;
        }

        const res = await axios.get(`${API}/api/countSay/counts`);

        setCounts(res.data || {});

        sessionStorage.setItem("counts", JSON.stringify(res.data || {}));
      } catch (err) {
        console.log("Counts error:", err);
      }
    };

    fetchCounts();
  }, []);

  /*
   * -------------------------------------------------------
   * INFINITE SCROLL
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (query.trim()) return;

    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 350
      ) {
        setVisibleCount((prev) =>
          prev >= allAds.length ? prev : prev + ITEMS_PER_LOAD,
        );
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [allAds.length, query]);

  /*
   * -------------------------------------------------------
   * FAVORITES
   * -------------------------------------------------------
   */

  useEffect(() => {
    try {
      const stored = localStorage.getItem("favorites");

      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      setFavorites([]);
    }
  }, []);

  const toggleFavorite = (item) => {
    const exists = favorites.some((f) => f._id === item._id);

    const updated = exists
      ? favorites.filter((f) => f._id !== item._id)
      : [...favorites, item];

    setFavorites(updated);

    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  /*
   * -------------------------------------------------------
   * DATE HELPERS
   * -------------------------------------------------------
   */

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const postDate = new Date(dateString);

    if (Number.isNaN(postDate.getTime())) {
      return "";
    }

    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const postDay = new Date(
      postDate.getFullYear(),
      postDate.getMonth(),
      postDate.getDate(),
    );

    const diffTime = today.getTime() - postDay.getTime();

    const oneDay = 24 * 60 * 60 * 1000;

    if (diffTime === 0) {
      return "bugün";
    }

    if (diffTime === oneDay) {
      return "dünən";
    }

    return postDate.toLocaleDateString("az-AZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getCurrentTime = (date) => {
    if (!date) return "";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "";
    }

    return d.toLocaleTimeString("az-AZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /*
   * -------------------------------------------------------
   * IMAGE OPTIMIZATION
   * -------------------------------------------------------
   */

  const optimizeImage = (url) => {
    if (!url) {
      return "/no-image.jpg";
    }

    if (!url.includes("cloudinary")) {
      return url;
    }

    if (url.includes("/upload/f_auto")) {
      return url;
    }

    return url.replace("/upload/", "/upload/f_auto,q_auto,w_500,h_350,c_fill/");
  };

  /*
   * -------------------------------------------------------
   * RESET FILTERS
   * -------------------------------------------------------
   */

  const resetFilters = () => {
    setQuery("");
    setResults([]);

    setFilters1({
      category: "all",
      priceMin: "",
      priceMax: "",
      city: "",
      type: "all",
      brand: "",
      model: "",
      yearMin: "",
      yearMax: "",
      color: "",
      fuel: "",
      motor: "",
      credit: false,
      barter: false,
    });

    setVisibleCount(ITEMS_PER_LOAD);
  };

  /*
   * -------------------------------------------------------
   * CARD INFO
   * -------------------------------------------------------
   */

  const getCardInfo = (item) => {
    const type = item.__type || item.category;

    switch (type) {
      case "car":
        return (
          <>
            <div className="font-bold text-[13px] sm:text-[15px] text-gray-900 dark:text-white truncate">
              {[item?.car?.brand, item?.car?.model, item?.car?.generation]
                .filter(Boolean)
                .join(" ")}
            </div>

            <div className="text-[11px] sm:text-[13px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {[
                item?.car?.year,
                item?.car?.motor && `${item.car.motor} L`,
                item?.car?.km && `${item.car.km} km`,
              ]
                .filter(Boolean)
                .join(" • ")}
            </div>
          </>
        );

      case "phone":
        return (
          <>
            <div className="font-bold text-[13px] sm:text-[15px] text-gray-900 dark:text-white truncate">
              {[item?.phone?.brand, item?.phone?.model]
                .filter(Boolean)
                .join(" ")}
            </div>

            <div className="text-[11px] sm:text-[13px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {[
                item?.phone?.ram && `${item.phone.ram} GB RAM`,
                item?.phone?.storage && `${item.phone.storage} GB`,
              ]
                .filter(Boolean)
                .join(" • ")}
            </div>
          </>
        );

      case "electronics":
        return (
          <>
            <div className="font-bold text-[13px] sm:text-[15px] text-gray-900 dark:text-white truncate">
              {[
                item?.electronics?.title,
                item?.electronics?.brand,
                item?.electronics?.model,
              ]
                .filter(Boolean)
                .join(" ")}
            </div>

            <div className="text-[11px] sm:text-[13px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {item?.electronics?.type || ""}
            </div>
          </>
        );

      case "realEstate":
        return (
          <>
            <div className="font-bold text-[13px] sm:text-[15px] text-gray-900 dark:text-white truncate">
              {item?.realEstate?.city || item?.city || "Əmlak"}
            </div>

            <div className="text-[11px] sm:text-[13px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {[
                item?.realEstate?.rooms && `${item.realEstate.rooms} otaq`,
                item?.realEstate?.area && `${item.realEstate.area} m²`,
              ]
                .filter(Boolean)
                .join(" • ")}
            </div>
          </>
        );

      case "clothing":
        return (
          <>
            <div className="font-bold text-[13px] sm:text-[15px] text-gray-900 dark:text-white truncate">
              {[item?.clothing?.brand, item?.clothing?.model]
                .filter(Boolean)
                .join(" ")}
            </div>

            <div className="text-[11px] sm:text-[13px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {[item?.clothing?.color, item?.clothing?.size]
                .filter(Boolean)
                .join(" • ")}
            </div>
          </>
        );

      case "homeGarden":
        return (
          <>
            <div className="font-bold text-[13px] sm:text-[15px] text-gray-900 dark:text-white truncate">
              {[
                item?.homeGarden?.title,
                item?.homeGarden?.brand,
                item?.homeGarden?.model,
              ]
                .filter(Boolean)
                .join(" ")}
            </div>

            <div className="text-[11px] sm:text-[13px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {item?.homeGarden?.type || ""}
            </div>
          </>
        );

      case "household":
        return (
          <>
            <div className="font-bold text-[13px] sm:text-[15px] text-gray-900 dark:text-white truncate">
              {[item?.household?.title, item?.household?.brand]
                .filter(Boolean)
                .join(" ")}
            </div>

            <div className="text-[11px] sm:text-[13px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {[item?.household?.model].filter(Boolean).join(" ")}
            </div>
          </>
        );

      case "accessory":
        return (
          <>
            <div className="font-bold text-[13px] sm:text-[15px] text-gray-900 dark:text-white truncate">
              {[
                item?.accessory?.title,
                item?.accessory?.brand,
                item?.accessory?.model,
              ]
                .filter(Boolean)
                .join(" ")}
            </div>

            <div className="text-[11px] sm:text-[13px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {item?.accessory?.type || ""}
            </div>
          </>
        );

      default:
        return (
          <>
            <div className="font-bold text-[13px] sm:text-[15px] text-gray-900 dark:text-white truncate">
              {item?.title || item?.brand || item?.model || "Elan"}
            </div>

            <div className="text-[11px] sm:text-[13px] text-gray-500 dark:text-gray-400 truncate">
              {item?.category || ""}
            </div>
          </>
        );
    }
  };

  /*
   * -------------------------------------------------------
   * SKELETON
   * -------------------------------------------------------
   */

  const SkeletonCard = () => (
    <div className="w-full max-w-[270px] overflow-hidden rounded-[22px] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm">
      <div className="h-[145px] sm:h-[175px] bg-gray-200 dark:bg-zinc-800 animate-pulse" />

      <div className="p-3 space-y-3">
        <div className="h-5 w-24 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />

        <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />

        <div className="h-3 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />

        <div className="flex justify-between pt-2">
          <div className="h-3 w-20 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
          <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );

  /*
   * -------------------------------------------------------
   * CARD
   * -------------------------------------------------------
   */

  const AdCard = ({ item, index }) => {
    const slug = item.title?.trim().replace(/\s+/g, "-");

    const priority = item.priorityType?.toLowerCase() || "free";

    const isPremium = priority === "premium";

    const isVip = priority === "vip";

    const isFavorite = favorites.some((f) => f._id === item._id);

    const image = item.images?.[item.images.length - 1] || "/no-image.jpg";

    return (
      <div className="relative w-full max-w-[270px] group">
        <Link
          to={`/${item.__type}/${item._id}/${encodeURIComponent(slug || "")}`}
          className="block"
        >
          <article
            className={`
              relative
              overflow-hidden
              rounded-[22px]
              bg-white
              dark:bg-zinc-900
              border
              ${
                isPremium
                  ? "border-red-200 dark:border-red-900/50"
                  : isVip
                    ? "border-blue-200 dark:border-blue-900/50"
                    : "border-gray-100 dark:border-zinc-800"
              }
              shadow-[0_4px_18px_rgba(0,0,0,0.06)]
              hover:shadow-[0_14px_35px_rgba(0,0,0,0.13)]
              hover:-translate-y-1
              transition-all
              duration-300
              ease-out
            `}
          >
            {/* IMAGE */}
            <div className="relative w-full h-[145px] sm:h-[175px] overflow-hidden bg-gray-100 dark:bg-zinc-800">
              <img
                src={optimizeImage(image)}
                loading={index < 4 ? "eager" : "lazy"}
                fetchPriority={index < 3 ? "high" : "auto"}
                decoding="async"
                className="
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-500
                  ease-out
                  group-hover:scale-110
                "
                alt={
                  item.title ||
                  item.brand ||
                  item.model ||
                  item.category ||
                  "Elan"
                }
              />

              {/* IMAGE GRADIENT */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />

              {/* PRIORITY */}
              {(isVip || isPremium) && (
                <div
                  className={`
                    absolute
                    top-2
                    left-2
                    z-20
                    flex
                    items-center
                    gap-1
                    px-2.5
                    py-1
                    rounded-full
                    text-[10px]
                    sm:text-[11px]
                    font-bold
                    backdrop-blur-md
                    shadow-lg
                    ${
                      isPremium
                        ? "bg-red-500 text-white"
                        : "bg-blue-600 text-white"
                    }
                  `}
                >
                  {isPremium ? (
                    <Crown size={13} strokeWidth={2.5} />
                  ) : (
                    <Gem size={13} strokeWidth={2.5} />
                  )}

                  {isPremium ? "PREMIUM" : "VIP"}
                </div>
              )}

              {/* FAVORITE */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(item);
                }}
                className="
                  absolute
                  top-2
                  right-2
                  z-30
                  w-9
                  h-9
                  rounded-full
                  flex
                  items-center
                  justify-center
                  bg-black/25
                  backdrop-blur-md
                  hover:bg-white
                  transition-all
                  duration-200
                  group/favorite
                "
                aria-label="Favoritə əlavə et"
              >
                <Heart
                  size={19}
                  strokeWidth={2}
                  className={`
                    transition-all
                    duration-200
                    ${
                      isFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-white group-hover/favorite:text-red-500"
                    }
                  `}
                />
              </button>

              {/* BARTER / CREDIT */}
              {(item?.car?.barter || item?.car?.credit) && (
                <div className="absolute bottom-2 left-2 z-20 flex gap-1.5">
                  {item?.car?.barter && (
                    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                      <RefreshCcw size={14} strokeWidth={2.2} />
                    </div>
                  )}

                  {item?.car?.credit && (
                    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-500 text-white shadow-lg">
                      <Percent size={14} strokeWidth={2.2} />
                    </div>
                  )}
                </div>
              )}

              {/* MAGAZINE */}
              {item?.car?.type_magasine && (
                <div className="absolute bottom-2 right-2 z-20 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-gray-800 text-[10px] sm:text-[11px] font-semibold shadow">
                  {TYPE_LABELS[item.car.type_magasine] ||
                    item.car.type_magasine}
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-3">
              {/* PRICE */}
              <div className="flex items-center justify-between gap-2">
                <div
                  className={`
                    font-extrabold
                    text-[17px]
                    sm:text-[20px]
                    tracking-tight
                    truncate
                    ${
                      isPremium
                        ? "text-red-500"
                        : isVip
                          ? "text-blue-600"
                          : "text-gray-900 dark:text-white"
                    }
                  `}
                >
                  {item.price ? `${item.price} AZN` : "Qiymət yoxdur"}
                </div>

                {isPremium && (
                  <Sparkles size={17} className="text-red-400 shrink-0" />
                )}

                {isVip && <Gem size={17} className="text-blue-500 shrink-0" />}
              </div>

              {/* INFO */}
              <div className="mt-1.5 min-h-[38px]">{getCardInfo(item)}</div>

              {/* DIVIDER */}
              <div className="my-2 border-t border-gray-100 dark:border-zinc-800" />

              {/* LOCATION + DATE */}
              <div className="flex items-center justify-between gap-2 text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin size={13} className="text-[#670fff] shrink-0" />

                  <span className="truncate">
                    {item.location || item.city || "Azərbaycan"}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Clock3 size={12} />

                  <span>{formatDate(item.createdAt)}</span>
                </div>
              </div>
            </div>
          </article>
        </Link>
      </div>
    );
  };

  /*
   * -------------------------------------------------------
   * RENDER
   * -------------------------------------------------------
   */

  return (
    <div className="min-h-screen ">
      <Helmet>
        <title>ProElan.az - Azərbaycanda Pulsuz Elanlar</title>

        <meta
          name="description"
          content="ProElan.az - Avtomobil, əmlak, telefon, elektronika və digər pulsuz elanlar platforması."
        />

        <link rel="canonical" href="https://proelan.az/" />
      </Helmet>

      {/* ---------------------------------------------------
          STICKY LEFT ADS
      --------------------------------------------------- */}

      <div className="hidden xl:flex fixed left-2 top-1/2 -translate-y-1/2 w-[105px] 2xl:w-[120px] flex-col gap-3 z-40">
        {Array.isArray(stickyAds) &&
          stickyAds
            .filter((a) => a.position === "left")
            .map((ad) => (
              <a
                href={ad.link}
                key={ad._id}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition-transform"
              >
                <img
                  src={`${API}/uploads/${ad.image}`}
                  className="w-full object-cover"
                  alt="Reklam"
                  loading="lazy"
                />
              </a>
            ))}
      </div>

      {/* ---------------------------------------------------
          MAIN
      --------------------------------------------------- */}

      <main className="max-w-[1240px] mx-auto px-3 sm:px-5 lg:px-6 pt-[82px] pb-24">
        {/* -------------------------------------------------
            HERO / SEARCH
        ------------------------------------------------- */}

        <section className="relative overflow-hidden rounded-[28px] mb-5 bg-gradient-to-br from-[#670fff] via-[#7b35ff] to-[#4c00d9] shadow-[0_18px_50px_rgba(103,15,255,0.25)]">
          {/* decorative circles */}
          <div className="absolute -right-20 -top-24 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-20 -bottom-28 w-72 h-72 rounded-full bg-purple-300/10 blur-3xl" />

          <div className="relative z-10 p-5 sm:p-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center">
                <Sparkles size={19} className="text-white" />
              </div>

              <span className="text-white/80 text-xs sm:text-sm font-semibold">
                Azərbaycanda elan axtar
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Axtardığını asanlıqla tap
            </h1>

            <p className="mt-2 text-white/75 text-sm sm:text-base">
              Avtomobil, telefon, əmlak və daha çox elan
            </p>

            {/* SEARCH */}
            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);

                    if (!e.target.value.trim()) {
                      setResults([]);
                    }
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Məsələn: Mercedes, iPhone, Bakı..."
                  className="
                    w-full
                    h-12
                    pl-11
                    pr-4
                    rounded-2xl
                    bg-white
                    text-gray-800
                    outline-none
                    border-0
                    shadow-lg
                    placeholder:text-gray-400
                    focus:ring-4
                    focus:ring-white/20
                  "
                />
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="
                  h-12
                  px-6
                  rounded-2xl
                  bg-gray-900
                  hover:bg-black
                  text-white
                  font-bold
                  flex
                  items-center
                  justify-center
                  gap-2
                  shadow-lg
                  transition-all
                  active:scale-95
                "
              >
                <Search size={18} />
                Axtar
              </button>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------
            FILTER HEADER
        ------------------------------------------------- */}

        <section className="rounded-[24px] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm mb-6 overflow-hidden">
          <div className="p-3 sm:p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#670fff]/10 flex items-center justify-center">
                <SlidersHorizontal size={19} className="text-[#670fff]" />
              </div>

              <div>
                <h2 className="font-bold text-sm sm:text-base">
                  Elanları filtrlə
                </h2>

                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                  Daha dəqiq nəticə üçün seçim et
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="
                flex
                items-center
                gap-1.5
                px-3
                py-2
                rounded-xl
                bg-gray-100
                dark:bg-zinc-800
                hover:bg-gray-200
                dark:hover:bg-zinc-700
                text-xs
                sm:text-sm
                font-semibold
                transition
              "
            >
              {showFilters ? "Bağla" : "Filtrlər"}

              {showFilters ? <X size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {showFilters && (
            <div className="border-t border-gray-100 dark:border-zinc-800 p-3 sm:p-4">
              {/* MAIN FILTERS */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                {/* CATEGORY */}
                <div className="relative">
                  <select
                    value={filters1.category}
                    onChange={(e) =>
                      setFilters1({
                        ...filters1,
                        category: e.target.value,
                      })
                    }
                    className="
                      filter-modern
                      appearance-none
                      w-full
                      h-11
                      px-3
                      pr-9
                      rounded-xl
                      border
                      border-gray-200
                      dark:border-zinc-700
                      bg-gray-50
                      dark:bg-zinc-800
                      outline-none
                      text-sm
                      focus:border-[#670fff]
                      focus:ring-2
                      focus:ring-[#670fff]/10
                    "
                  >
                    <option value="all">Bütün kateqoriyalar</option>

                    <option value="car">Avtomobil</option>

                    <option value="electronics">Elektronika</option>

                    <option value="phone">Telefon</option>

                    <option value="realEstate">Əmlak</option>

                    <option value="clothing">Geyim</option>

                    <option value="accessory">
                      Aksesuar və ehtiyat hissələri
                    </option>

                    <option value="household">Məişət texnikası</option>

                    <option value="homeGarden">Ev və bağ məhsulları</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                  />
                </div>

                {/* MIN PRICE */}
                <input
                  type="number"
                  placeholder="Min qiymət"
                  value={filters1.priceMin}
                  onChange={(e) =>
                    setFilters1({
                      ...filters1,
                      priceMin: e.target.value,
                    })
                  }
                  className="
                    h-11
                    px-3
                    rounded-xl
                    border
                    border-gray-200
                    dark:border-zinc-700
                    bg-gray-50
                    dark:bg-zinc-800
                    outline-none
                    text-sm
                    focus:border-[#670fff]
                    focus:ring-2
                    focus:ring-[#670fff]/10
                  "
                />

                {/* MAX PRICE */}
                <input
                  type="number"
                  placeholder="Max qiymət"
                  value={filters1.priceMax}
                  onChange={(e) =>
                    setFilters1({
                      ...filters1,
                      priceMax: e.target.value,
                    })
                  }
                  className="
                    h-11
                    px-3
                    rounded-xl
                    border
                    border-gray-200
                    dark:border-zinc-700
                    bg-gray-50
                    dark:bg-zinc-800
                    outline-none
                    text-sm
                    focus:border-[#670fff]
                    focus:ring-2
                    focus:ring-[#670fff]/10
                  "
                />

                {/* CITY */}
                <input
                  placeholder="Şəhər"
                  value={filters1.city}
                  onChange={(e) =>
                    setFilters1({
                      ...filters1,
                      city: e.target.value,
                    })
                  }
                  className="
                    h-11
                    px-3
                    rounded-xl
                    border
                    border-gray-200
                    dark:border-zinc-700
                    bg-gray-50
                    dark:bg-zinc-800
                    outline-none
                    text-sm
                    focus:border-[#670fff]
                    focus:ring-2
                    focus:ring-[#670fff]/10
                  "
                />

                {/* TYPE */}
                <div className="relative">
                  <select
                    value={filters1.type}
                    onChange={(e) =>
                      setFilters1({
                        ...filters1,
                        type: e.target.value,
                      })
                    }
                    className="
                      appearance-none
                      w-full
                      h-11
                      px-3
                      pr-9
                      rounded-xl
                      border
                      border-gray-200
                      dark:border-zinc-700
                      bg-gray-50
                      dark:bg-zinc-800
                      outline-none
                      text-sm
                      focus:border-[#670fff]
                    "
                  >
                    <option value="all">Bütün elanlar</option>

                    <option value="vip">VIP elanlar</option>

                    <option value="premium">Premium elanlar</option>

                    <option value="free">Adi elanlar</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                  />
                </div>
              </div>

              {/* CAR FILTERS */}
              <div className="mt-3 flex flex-wrap gap-2.5">
                {/* BRAND */}
                <select
                  value={filters1.brand}
                  onChange={(e) =>
                    setFilters1({
                      ...filters1,
                      brand: e.target.value,
                      model: "",
                      motor: "",
                      color: "",
                    })
                  }
                  className="
                    h-10
                    px-3
                    rounded-xl
                    border
                    border-gray-200
                    dark:border-zinc-700
                    bg-white
                    dark:bg-zinc-800
                    text-sm
                    outline-none
                    focus:border-[#670fff]
                  "
                >
                  <option value="">Marka</option>

                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>

                {/* MODEL */}
                {filters1.brand && (
                  <select
                    value={filters1.model}
                    onChange={(e) =>
                      setFilters1({
                        ...filters1,
                        model: e.target.value,
                        motor: "",
                      })
                    }
                    className="
                      h-10
                      px-3
                      rounded-xl
                      border
                      border-gray-200
                      dark:border-zinc-700
                      bg-white
                      dark:bg-zinc-800
                      text-sm
                      outline-none
                      focus:border-[#670fff]
                    "
                  >
                    <option value="">Model</option>

                    {models.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                )}

                {/* MOTOR */}
                {filters1.model && (
                  <select
                    value={filters1.motor}
                    onChange={(e) =>
                      setFilters1({
                        ...filters1,
                        motor: e.target.value,
                      })
                    }
                    className="
                      h-10
                      px-3
                      rounded-xl
                      border
                      border-gray-200
                      dark:border-zinc-700
                      bg-white
                      dark:bg-zinc-800
                      text-sm
                      outline-none
                      focus:border-[#670fff]
                    "
                  >
                    <option value="">Motor</option>

                    {motors.map((motor) => (
                      <option key={motor} value={motor}>
                        {motor}
                      </option>
                    ))}
                  </select>
                )}

                {/* RESET */}
                <button
                  type="button"
                  onClick={resetFilters}
                  className="
                    h-10
                    px-4
                    rounded-xl
                    bg-red-50
                    dark:bg-red-950/30
                    text-red-500
                    hover:bg-red-100
                    dark:hover:bg-red-950/50
                    font-semibold
                    text-sm
                    flex
                    items-center
                    gap-1.5
                    transition
                  "
                >
                  <RotateCcw size={15} />
                  Sıfırla
                </button>
              </div>

              {/* RESULT INFO */}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{allAds.length} elan tapıldı</span>

                {filters1.category !== "all" && (
                  <span className="px-2.5 py-1 rounded-full bg-[#670fff]/10 text-[#670fff] font-semibold">
                    {CATEGORY_LABELS[filters1.category]}
                  </span>
                )}
              </div>
            </div>
          )}
        </section>

        {/* -------------------------------------------------
            SEARCH LOADING
        ------------------------------------------------- */}

        {loadingSearch && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-3 text-gray-500">
              <CircularProgress size={24} />
              <span>Axtarılır...</span>
            </div>
          </div>
        )}

        {/* -------------------------------------------------
            SEARCH RESULTS HEADER
        ------------------------------------------------- */}

        {!loadingSearch && query.trim() && (
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg sm:text-xl">
                Axtarış nəticələri
              </h2>

              <p className="text-xs sm:text-sm text-gray-500">
                "{query}" üçün {results.length} nəticə
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs font-semibold"
            >
              <X size={15} />
              Təmizlə
            </button>
          </div>
        )}

        {/* -------------------------------------------------
            KATALOG
        ------------------------------------------------- */}

        {!query.trim() && (
          <Suspense fallback={null}>
            <div className="w-full mb-5">
              <Katalog />
            </div>
          </Suspense>
        )}

        {/* -------------------------------------------------
            ADS SECTION HEADER
        ------------------------------------------------- */}

        {!query.trim() && (
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-7 rounded-full bg-[#670fff]" />

                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Son elanlar
                </h2>
              </div>

              <p className="ml-3.5 mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Ən yeni elanları kəşf et
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-full px-3 py-2">
              <Sparkles size={13} className="text-[#670fff]" />
              {allAds.length} elan
            </div>
          </div>
        )}

        {/* -------------------------------------------------
            CARDS
        ------------------------------------------------- */}

        <section
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-4
            gap-3
            sm:gap-4
            justify-items-center
          "
        >
          {isLoading ? (
            Array.from({
              length: 12,
            }).map((_, i) => <SkeletonCard key={i} />)
          ) : displayedAds.length > 0 ? (
            displayedAds.map((item, index) => (
              <AdCard
                key={`${item.__type}-${item._id}`}
                item={item}
                index={index}
              />
            ))
          ) : (
            <div className="col-span-full w-full py-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
                <Search size={28} className="text-gray-400" />
              </div>

              <h3 className="font-bold text-lg">Elan tapılmadı</h3>

              <p className="text-sm text-gray-500 mt-1 max-w-sm">
                Axtarış sözünü və ya filtrləri dəyişərək yenidən yoxla.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#670fff] text-white text-sm font-bold hover:bg-[#5800e8] transition"
              >
                Filtrləri sıfırla
              </button>
            </div>
          )}
        </section>

        {/* -------------------------------------------------
            LOAD MORE INDICATOR
        ------------------------------------------------- */}

        {!query.trim() && !isLoading && visibleCount < allAds.length && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CircularProgress size={18} />
              Daha çox elan yüklənir...
            </div>
          </div>
        )}

        {/* -------------------------------------------------
            BOTTOM INFO
        ------------------------------------------------- */}

        {!isLoading && !query.trim() && allAds.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-xs text-gray-500 shadow-sm">
              <Sparkles size={13} className="text-[#670fff]" />
              Bütün elanlar arasında axtarış edə bilərsən
            </div>
          </div>
        )}
      </main>

      {/* ---------------------------------------------------
          STICKY RIGHT ADS
      --------------------------------------------------- */}

      <div className="hidden xl:flex fixed right-2 top-1/2 -translate-y-1/2 w-[105px] 2xl:w-[120px] flex-col gap-3 z-40">
        {Array.isArray(stickyAds) &&
          stickyAds
            .filter((a) => a.position === "right")
            .map((ad) => (
              <a
                href={ad.link}
                key={ad._id}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition-transform"
              >
                <img
                  src={`${API}/uploads/${ad.image}`}
                  className="w-full object-cover"
                  alt="Reklam"
                  loading="lazy"
                />
              </a>
            ))}
      </div>

      {/* ---------------------------------------------------
          MOBILE MENU
      --------------------------------------------------- */}

      <Suspense fallback={null}>
        <BottomMenu />
      </Suspense>
    </div>
  );
};

export default Home;
