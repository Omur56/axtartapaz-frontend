import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import {
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  User,
  Smartphone,
  HardDrive,
  Cpu,
  Palette,
  CalendarDays,
  Clock3,
  Hash,
  Sparkles,
  Crown,
  ShieldCheck,
  ZoomIn,
  Zap,
  Package,
} from "lucide-react";

import { useTheme } from "../../components/Main/ThemeContext";

export default function PostDetailPhone() {
  const { id } = useParams();
  const { darkMode } = useTheme();

  const [post, setPost] = useState(null);
  const [phoneAds, setPhoneAds] = useState([]);
  const [business, setBusiness] = useState(null);
  const [zoomIndex, setZoomIndex] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

  /* =========================================================
     TELEFON ELANLARI
  ========================================================= */
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/Phone/`)
      .then((res) => {
        setPhoneAds(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Telefon elanları yüklənmədi:", err);
        setPhoneAds([]);
      });
  }, [BASE_URL]);

  /* =========================================================
     CARİ ELAN + BİZNES
  ========================================================= */
  useEffect(() => {
    setPost(null);
    setBusiness(null);
    setNotFound(false);

    axios
      .get(`${BASE_URL}/api/Phone/${id}`)
      .then(async (res) => {
        if (!res.data) {
          setNotFound(true);
          return;
        }

        setPost(res.data);

        /*
         * businessId iki formada gələ bilər:
         *
         * 1. Populate olunmuş obyekt:
         * {
         *   _id: "...",
         *   businessName: "...",
         *   slug: "..."
         * }
         *
         * 2. Sadəcə ObjectId:
         * "68xxxxxxxx..."
         */

        const businessData = res.data?.businessId;

        if (
          businessData &&
          typeof businessData === "object" &&
          businessData.slug
        ) {
          setBusiness(businessData);
          return;
        }

        if (businessData) {
          try {
            const businessRes = await axios.get(
              `${BASE_URL}/api/business/by-id/${businessData}`,
            );

            if (businessRes.data) {
              setBusiness(businessRes.data);
            } else {
              setBusiness(null);
            }
          } catch (businessError) {
            console.error(
              "Biznes məlumatı yüklənmədi:",
              businessError.response?.data || businessError.message,
            );

            setBusiness(null);
          }
        } else {
          setBusiness(null);
        }
      })
      .catch((err) => {
        console.error("Elan yüklənmədi:", err);
        setNotFound(true);
        setBusiness(null);
      });
  }, [id, BASE_URL]);

  /* =========================================================
     PHONE DATA
  ========================================================= */
  const phoneData = post?.phone || {};

  const imageArray = Array.isArray(post?.images)
    ? post.images.filter(Boolean)
    : post?.images
      ? [post.images]
      : [];

  /* =========================================================
     IMAGE URL
  ========================================================= */
  const getImageUrl = (img) => {
    if (!img) {
      return "/no-image.jpg";
    }

    if (
      typeof img === "string" &&
      (img.startsWith("http://") || img.startsWith("https://"))
    ) {
      return img;
    }

    return `${BASE_URL}/uploads/${img}`;
  };

  /* =========================================================
     DATE
  ========================================================= */
  const formatDate = (dateString) => {
    if (!dateString) {
      return "Tarix yoxdur";
    }

    const postDate = new Date(dateString);

    if (Number.isNaN(postDate.getTime())) {
      return "Tarix yoxdur";
    }

    const now = new Date();

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const postDay = new Date(postDate);
    postDay.setHours(0, 0, 0, 0);

    const diffTime = today - postDay;
    const oneDay = 24 * 60 * 60 * 1000;

    if (diffTime === 0) {
      return "bugün";
    }

    if (diffTime === oneDay) {
      return "dünən";
    }

    return postDate.toLocaleDateString("az-AZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  /* =========================================================
     TIME
  ========================================================= */
  const getCurrentTime = (isoString) => {
    if (!isoString) {
      return "";
    }

    const date = new Date(isoString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString("az-AZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* =========================================================
     ZOOM
  ========================================================= */
  const openZoom = (index) => {
    setZoomIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeZoom = () => {
    setZoomIndex(null);
    document.body.style.overflow = "";
  };

  const prevImage = () => {
    setZoomIndex((prev) => {
      if (prev === null || imageArray.length === 0) {
        return prev;
      }

      return prev === 0 ? imageArray.length - 1 : prev - 1;
    });
  };

  const nextImage = () => {
    setZoomIndex((prev) => {
      if (prev === null || imageArray.length === 0) {
        return prev;
      }

      return prev === imageArray.length - 1 ? 0 : prev + 1;
    });
  };

  /* =========================================================
     KEYBOARD
  ========================================================= */
  useEffect(() => {
    if (zoomIndex === null) {
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        nextImage();
      }

      if (e.key === "ArrowLeft") {
        prevImage();
      }

      if (e.key === "Escape") {
        closeZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [zoomIndex, imageArray.length]);

  /* =========================================================
     CLEANUP
  ========================================================= */
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* =========================================================
     VIP / PREMIUM
  ========================================================= */
  // =========================================================
  // VIP / PREMIUM - KAPİTAL BANK
  // =========================================================
  const handleUpgrade = async (listingId, type) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Bu əməliyyat üçün əvvəlcə hesabınıza daxil olun.");
        return;
      }

      const { data } = await axios.post(
        `${BASE_URL}/api/payments/create-checkout/${listingId}`,
        { type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Kapital Bank ödəniş cavabı:", data);

      // Kapital Bank HPP ödəniş səhifəsinə keç
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      console.error("Kapital Bank paymentUrl qaytarmadı:", data);

      alert(data?.message || "Ödəniş səhifəsi yaradıla bilmədi.");
    } catch (err) {
      console.error("Ödəniş xətası:", err.response?.data || err.message);

      alert(err.response?.data?.message || "Ödəniş zamanı xəta baş verdi.");
    }
  };
  /* =========================================================
     LOADING
  ========================================================= */
  if (!post && !notFound) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center px-4 ${
          darkMode ? "bg-[#09090f] text-white" : "bg-slate-50 text-gray-900"
        }`}
      >
        <div
          className={`w-full max-w-md rounded-3xl border p-8 text-center shadow-2xl ${
            darkMode
              ? "border-white/10 bg-white/[0.05]"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
            <Smartphone size={30} className="text-white" />
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 to-blue-500" />
          </div>

          <p
            className={`mt-4 text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Elan məlumatları yüklənir...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     404
  ========================================================= */
  if (notFound || !post) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center px-4 ${
          darkMode
            ? "bg-[#09090f]"
            : "bg-gradient-to-br from-indigo-50 via-white to-blue-50"
        }`}
      >
        <div className="text-center">
          <div className="mb-5 bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-8xl font-black text-transparent">
            404
          </div>

          <div
            className={`mx-auto max-w-md rounded-3xl border p-8 shadow-2xl ${
              darkMode
                ? "border-white/10 bg-white/[0.05]"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
              <Smartphone size={30} className="text-red-500" />
            </div>

            <h2 className="text-xl font-bold">Elan tapılmadı</h2>

            <p
              className={`mt-2 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Axtardığınız telefon elanı silinmiş və ya mövcud deyil.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg"
            >
              <ArrowLeft size={18} />
              Əsas səhifəyə qayıt
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     TELEFON MƏLUMATLARI
  ========================================================= */
  const title =
    post?.title ||
    `${phoneData?.brand || post?.brand || ""} ${
      phoneData?.model || post?.model || ""
    } ${phoneData?.type || post?.type || ""}`.trim();

  const brand = phoneData?.brand || post?.brand || "";
  const model = phoneData?.model || post?.model || "";
  const storage = phoneData?.storage || post?.storage || "";
  const ram = phoneData?.ram || post?.ram || "";
  const color = phoneData?.color || post?.color || "";

  const simCard =
    phoneData?.sim_card ||
    phoneData?.simCard ||
    post?.sim_card ||
    post?.simCard ||
    "";

  const postDate = post?.data || post?.createdAt;
  const contact = post?.contact || {};
  const location = post?.location || post?.city || "Yer göstərilməyib";

  return (
    <div
      className={`relative min-h-screen overflow-hidden ${
        darkMode ? "bg-[#09090f] text-white" : "bg-slate-50 text-gray-900"
      }`}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-28 pt-24 sm:px-6 lg:px-8">
        {/* =================================================
            BACK
        ================================================= */}
        <Link
          to="/Katalog/Telefonlar"
          className={`mb-5 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-sm transition ${
            darkMode
              ? "border-white/10 bg-white/[0.05] text-gray-200 hover:bg-white/10"
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <ArrowLeft size={18} />
          Telefonlar
        </Link>

        {/* =================================================
            MAIN CARD
        ================================================= */}
        <div
          className={`overflow-hidden rounded-[28px] border shadow-2xl ${
            darkMode
              ? "border-white/10 bg-white/[0.045]"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_370px]">
            {/* =================================================
                LEFT
            ================================================= */}
            <div className="min-w-0 p-4 sm:p-6 lg:p-8">
              {/* TITLE */}
              <div className="mb-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1.5 text-xs font-bold text-indigo-500">
                    <Smartphone size={14} />
                    Telefon
                  </span>

                  {post?.priorityType === "vip" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-500">
                      <Crown size={14} />
                      VIP
                    </span>
                  )}

                  {post?.priorityType === "premium" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-500">
                      <Sparkles size={14} />
                      PREMIUM
                    </span>
                  )}
                </div>

                <h1
                  className={`text-2xl font-black leading-tight sm:text-3xl lg:text-4xl ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {title || "Telefon elanı"}
                </h1>
              </div>

              {/* =================================================
                  GALLERY
              ================================================= */}
              <div
                className={`overflow-hidden rounded-3xl border ${
                  darkMode
                    ? "border-white/10 bg-black/20"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                {imageArray.length > 0 ? (
                  <Carousel
                    showThumbs={imageArray.length > 1}
                    showStatus={false}
                    showIndicators={imageArray.length > 1}
                    infiniteLoop
                    swipeable
                    emulateTouch
                    autoPlay={false}
                    dynamicHeight={false}
                    renderArrowPrev={(onClickHandler, hasPrev) =>
                      hasPrev && (
                        <button
                          type="button"
                          onClick={onClickHandler}
                          className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                        >
                          <ChevronLeft size={24} />
                        </button>
                      )
                    }
                    renderArrowNext={(onClickHandler, hasNext) =>
                      hasNext && (
                        <button
                          type="button"
                          onClick={onClickHandler}
                          className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                        >
                          <ChevronRight size={24} />
                        </button>
                      )
                    }
                  >
                    {imageArray.map((img, index) => (
                      <div
                        key={index}
                        className="group relative flex h-[300px] cursor-zoom-in items-center justify-center sm:h-[430px] lg:h-[500px]"
                        onClick={() => openZoom(index)}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`${title} - şəkil ${index + 1}`}
                          className="h-full w-full object-contain"
                        />

                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/10">
                          <div className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:scale-100 group-hover:opacity-100">
                            <ZoomIn size={22} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <div className="flex h-[350px] items-center justify-center">
                    <div className="text-center">
                      <Smartphone
                        size={50}
                        className="mx-auto mb-3 opacity-30"
                      />
                      <p className="text-sm opacity-50">Şəkil yoxdur</p>
                    </div>
                  </div>
                )}
              </div>

              {/* =================================================
                  PRICE
              ================================================= */}
              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p
                    className={`mb-1 text-sm ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Elan qiyməti
                  </p>

                  <div className="flex items-baseline gap-2">
                    <span className="bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-4xl font-black text-transparent sm:text-5xl">
                      {post.price}
                    </span>

                    <span
                      className={`text-lg font-bold ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      AZN
                    </span>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-2 text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <ShieldCheck size={18} className="text-green-500" />
                  Təhlükəsiz elan
                </div>
              </div>

              {/* =================================================
                  DETAILS
              ================================================= */}
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold">Telefon haqqında</h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* BRAND */}
                  {brand && (
                    <div
                      className={`flex items-center gap-3 rounded-2xl border p-4 ${
                        darkMode
                          ? "border-white/10 bg-white/[0.035]"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                        <Smartphone size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs opacity-50">Marka</p>
                        <p className="truncate text-sm font-bold">{brand}</p>
                      </div>
                    </div>
                  )}

                  {/* MODEL */}
                  {model && (
                    <div
                      className={`flex items-center gap-3 rounded-2xl border p-4 ${
                        darkMode
                          ? "border-white/10 bg-white/[0.035]"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                        <Smartphone size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs opacity-50">Model</p>
                        <p className="truncate text-sm font-bold">{model}</p>
                      </div>
                    </div>
                  )}

                  {/* STORAGE */}
                  {storage && (
                    <div
                      className={`flex items-center gap-3 rounded-2xl border p-4 ${
                        darkMode
                          ? "border-white/10 bg-white/[0.035]"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                        <HardDrive size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs opacity-50">Yaddaş</p>
                        <p className="truncate text-sm font-bold">{storage}</p>
                      </div>
                    </div>
                  )}

                  {/* RAM */}
                  {ram && (
                    <div
                      className={`flex items-center gap-3 rounded-2xl border p-4 ${
                        darkMode
                          ? "border-white/10 bg-white/[0.035]"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                        <Cpu size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs opacity-50">RAM</p>
                        <p className="truncate text-sm font-bold">{ram}</p>
                      </div>
                    </div>
                  )}

                  {/* COLOR */}
                  {color && (
                    <div
                      className={`flex items-center gap-3 rounded-2xl border p-4 ${
                        darkMode
                          ? "border-white/10 bg-white/[0.035]"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                        <Palette size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs opacity-50">Rəng</p>
                        <p className="truncate text-sm font-bold">{color}</p>
                      </div>
                    </div>
                  )}

                  {/* SIM CARD */}
                  {simCard && (
                    <div
                      className={`flex items-center gap-3 rounded-2xl border p-4 ${
                        darkMode
                          ? "border-white/10 bg-white/[0.035]"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                        <Smartphone size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs opacity-50">SIM kart</p>
                        <p className="truncate text-sm font-bold">{simCard}</p>
                      </div>
                    </div>
                  )}

                  {/* LOCATION */}
                  {location && (
                    <div
                      className={`flex items-center gap-3 rounded-2xl border p-4 ${
                        darkMode
                          ? "border-white/10 bg-white/[0.035]"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                        <MapPin size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs opacity-50">Yerləşmə</p>

                        <p className="truncate text-sm font-bold">{location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}
              {post?.description && (
                <div className="mt-8">
                  <h2 className="mb-4 text-xl font-bold">Elan haqqında</h2>

                  <div
                    className={`rounded-2xl border p-5 leading-7 ${
                      darkMode
                        ? "border-white/10 bg-white/[0.035] text-gray-300"
                        : "border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                  >
                    {post.description}
                  </div>
                </div>
              )}

              {/* =================================================
                  META
              ================================================= */}
              <div
                className={`mt-8 grid grid-cols-1 gap-3 border-t pt-6 sm:grid-cols-3 ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Hash size={18} className="text-indigo-500" />

                  <div>
                    <p className="text-xs opacity-50">Elanın nömrəsi</p>

                    <p className="text-sm font-semibold">
                      {post.id || post._id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays size={18} className="text-indigo-500" />

                  <div>
                    <p className="text-xs opacity-50">Tarix</p>

                    <p className="text-sm font-semibold">
                      {formatDate(postDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock3 size={18} className="text-indigo-500" />

                  <div>
                    <p className="text-xs opacity-50">Saat</p>

                    <p className="text-sm font-semibold">
                      {getCurrentTime(postDate) || "--:--"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT CONTACT
            ================================================= */}
            <aside
              className={`border-t p-5 sm:p-6 lg:border-l lg:border-t-0 ${
                darkMode
                  ? "border-white/10 bg-black/10"
                  : "border-gray-200 bg-gray-50/70"
              }`}
            >
              <div className="sticky top-24">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg">
                    <User size={23} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">Əlaqə məlumatı</h2>

                    <p className="text-xs opacity-50">Elan sahibi ilə əlaqə</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* NAME */}
                  {contact?.name && (
                    <div
                      className={`rounded-2xl border p-4 ${
                        darkMode
                          ? "border-white/10 bg-white/[0.035]"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <User size={18} className="text-indigo-500" />

                        <div>
                          <p className="text-xs opacity-50">Ad</p>
                          <p className="font-semibold">{contact.name}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PHONE */}
                  {contact?.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className={`block rounded-2xl border p-4 transition hover:-translate-y-0.5 ${
                        darkMode
                          ? "border-white/10 bg-white/[0.035] hover:bg-white/[0.07]"
                          : "border-gray-200 bg-white hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Phone size={18} className="text-green-500" />

                        <div>
                          <p className="text-xs opacity-50">Telefon</p>

                          <p className="font-bold text-green-500">
                            {contact.phone}
                          </p>
                        </div>
                      </div>
                    </a>
                  )}

                  {/* EMAIL */}
                  {contact?.email && (
                    <div
                      className={`rounded-2xl border p-4 ${
                        darkMode
                          ? "border-white/10 bg-white/[0.035]"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Mail size={18} className="text-indigo-500" />

                        <div className="min-w-0">
                          <p className="text-xs opacity-50">Email</p>

                          <p className="truncate text-sm font-semibold">
                            {contact.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LOCATION */}
                  <div
                    className={`rounded-2xl border p-4 ${
                      darkMode
                        ? "border-white/10 bg-white/[0.035]"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-red-500" />

                      <div>
                        <p className="text-xs opacity-50">Şəhər / Yerləşmə</p>

                        <p className="font-semibold">{location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    MAĞAZAYA KEÇİD
                ================================================= */}
                {business?.slug && (
                  <Link
                    to={`/biznes/${business.slug}`}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 font-black transition-all hover:-translate-y-0.5 ${
                      darkMode
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/10"
                    }`}
                  >
                    <Package size={19} />
                    Mağazaya keçid et
                  </Link>
                )}

                {/* CALL */}
                {contact?.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 py-3.5 font-bold text-white shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5"
                  >
                    <Phone size={19} />
                    Zəng et
                  </a>
                )}

                {/* =================================================
                    UPGRADE
                ================================================= */}
                <div
                  className={`mt-5 rounded-2xl border p-4 ${
                    darkMode
                      ? "border-white/10 bg-white/[0.035]"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Zap size={17} className="text-amber-500" />

                    <p className="text-sm font-bold">Elanı önə çıxar</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpgrade(post._id, "vip")}
                      className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                        darkMode
                          ? "border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                          : "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
                      }`}
                    >
                      <Crown size={16} className="mx-auto mb-1" />
                      VIP et
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpgrade(post._id, "premium")}
                      className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                        darkMode
                          ? "border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                          : "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                      }`}
                    >
                      <Sparkles size={16} className="mx-auto mb-1" />
                      Premium
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* =================================================
            SIMILAR ADS
        ================================================= */}
        {phoneAds.length > 0 && (
          <section className="mt-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-1 w-8 rounded-full bg-indigo-500" />

                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                    Tövsiyələr
                  </span>
                </div>

                <h2 className="text-2xl font-black sm:text-3xl">
                  Bənzər elanlar
                </h2>
              </div>

              <Link
                to="/Katalog/Telefonlar"
                className={`hidden rounded-xl border px-4 py-2 text-sm font-semibold sm:block ${
                  darkMode
                    ? "border-white/10 bg-white/[0.05] hover:bg-white/10"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                Hamısına bax
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {phoneAds
                .filter((item) => String(item?._id) !== String(post?._id))
                .slice(0, 8)
                .map((item) => {
                  const itemId = item?.id || item?._id;

                  const itemImage =
                    Array.isArray(item?.images) && item.images.length > 0
                      ? item.images[0]
                      : null;

                  const itemBrand = item?.phone?.brand || item?.brand || "";

                  const itemModel = item?.phone?.model || item?.model || "";

                  const itemStorage =
                    item?.phone?.storage || item?.storage || "";

                  return (
                    <Link
                      key={itemId}
                      to={`/PostDetailPhone/${itemId}`}
                      className={`group overflow-hidden rounded-2xl border transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        darkMode
                          ? "border-white/10 bg-white/[0.045]"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={getImageUrl(itemImage)}
                          alt={item?.title || `${itemBrand} ${itemModel}`}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                        {item?.priorityType === "vip" && (
                          <span className="absolute left-3 top-3 rounded-full bg-blue-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">
                            VIP
                          </span>
                        )}

                        {item?.priorityType === "premium" && (
                          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">
                            PREMIUM
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <p className="text-xl font-black text-indigo-500">
                          {item?.price ?? "—"} AZN
                        </p>

                        <h3
                          className={`mt-1 truncate font-bold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item?.title || `${itemBrand} ${itemModel}`}
                        </h3>

                        <p
                          className={`mt-1 truncate text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {itemBrand} {itemModel}
                          {itemStorage ? ` • ${itemStorage}` : ""}
                        </p>

                        <div
                          className={`mt-3 flex items-center justify-between text-xs ${
                            darkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-1 truncate">
                            <MapPin size={13} />
                            {item?.location || item?.city || "—"}
                          </span>

                          <span className="shrink-0">
                            {formatDate(item?.data || item?.createdAt)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </section>
        )}
      </div>

      {/* =================================================
          FULLSCREEN ZOOM
      ================================================= */}
      {zoomIndex !== null && imageArray.length > 0 && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4"
          onClick={closeZoom}
        >
          <button
            type="button"
            onClick={closeZoom}
            className="absolute right-4 top-4 z-[10001] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-red-500"
            aria-label="Bağla"
          >
            <X size={24} />
          </button>

          {imageArray.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-3 z-[10001] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft size={30} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-3 z-[10001] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
              >
                <ChevronRight size={30} />
              </button>
            </>
          )}

          <div
            className="relative flex max-h-[92vh] max-w-[92vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageUrl(imageArray[zoomIndex])}
              alt="Böyük şəkil"
              className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm font-semibold text-white">
              {zoomIndex + 1} / {imageArray.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
