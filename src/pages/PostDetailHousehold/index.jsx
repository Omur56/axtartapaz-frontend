import React, { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import axios from "axios";

import { Carousel } from "react-responsive-carousel";

import "react-responsive-carousel/lib/styles/carousel.min.css";

import {
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  User,
  Tag,
  Crown,
  Sparkles,
  ShieldCheck,
  Refrigerator,
  Package,
  CalendarDays,
  Clock3,
  Loader2,
} from "lucide-react";

import { useTheme } from "../../components/Main/ThemeContext";

import BubbleBackground from "../../components/ui/BubbleBackground";

import BottomMenu from "../../components/MobileMenu";

export default function PostDetailHousehold() {
  const { id } = useParams();

  const { darkMode } = useTheme();

  const [post, setPost] = useState(null);
  const [business, setBusiness] = useState(null);
  const [household, setHousehold] = useState([]);
  const [zoomIndex, setZoomIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [upgrading, setUpgrading] = useState(null);

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

  // ---------------------------------------------------------
  // Bütün məişət texnikası elanlarını gətir
  // ---------------------------------------------------------

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/Household`)
      .then((res) => {
        setHousehold(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Məişət texnikası elanları yüklənmədi:", err);

        setHousehold([]);
      });
  }, [BASE_URL]);

  // ---------------------------------------------------------
  // Cari elan
  // ---------------------------------------------------------

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setBusiness(null);

    axios
      .get(`${BASE_URL}/api/Household/${id}`)
      .then(async (res) => {
        if (!res.data) {
          setNotFound(true);
          return;
        }

        setPost(res.data);

        // ---------------------------------------------------
        // BİZNES MƏLUMATI
        // ---------------------------------------------------

        const businessData = res.data?.businessId;

        // Əgər backend businessId-ni populate edib obyekt kimi göndəribsə
        if (
          businessData &&
          typeof businessData === "object" &&
          businessData.slug
        ) {
          setBusiness(businessData);
          return;
        }

        // Əgər businessId sadəcə ID kimi gəlirsə
        if (businessData) {
          try {
            const businessRes = await axios.get(
              `${BASE_URL}/api/business/by-id/${businessData}`,
            );

            if (businessRes.data) {
              setBusiness(businessRes.data);
            }
          } catch (businessError) {
            console.error("Biznes məlumatı alınmadı:", businessError);

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
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, BASE_URL]);

  // ---------------------------------------------------------
  // Şəkillər
  // ---------------------------------------------------------

  const imageArray = Array.isArray(post?.images)
    ? post.images
    : post?.images
      ? [post.images]
      : [];

  const getImageUrl = (img) => {
    if (!img) return "/no-image.jpg";

    if (typeof img === "string" && img.startsWith("http")) {
      return img;
    }

    return `${BASE_URL}/uploads/${img}`;
  };

  // ---------------------------------------------------------
  // Tarix
  // ---------------------------------------------------------

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const postDate = new Date(dateString);

    if (Number.isNaN(postDate.getTime())) return "";

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const postDay = new Date(postDate);

    postDay.setHours(0, 0, 0, 0);

    const diffTime = today - postDay;

    const oneDay = 24 * 60 * 60 * 1000;

    if (diffTime === 0) return "bugün";

    if (diffTime === oneDay) return "dünən";

    return postDate.toLocaleDateString("az-AZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ---------------------------------------------------------
  // Saat
  // ---------------------------------------------------------

  const getCurrentTime = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString("az-AZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ---------------------------------------------------------
  // Zoom
  // ---------------------------------------------------------

  const openZoom = (index) => {
    setZoomIndex(index);
  };

  const closeZoom = () => {
    setZoomIndex(null);
  };

  const prevImage = () => {
    setZoomIndex((prev) => (prev === 0 ? imageArray.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setZoomIndex((prev) => (prev === imageArray.length - 1 ? 0 : prev + 1));
  };

  // ---------------------------------------------------------
  // Klaviatura ilə şəkil dəyişmə
  // ---------------------------------------------------------

  useEffect(() => {
    if (zoomIndex === null) return;

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

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = "";
    };
  }, [zoomIndex, imageArray.length]);

  // ---------------------------------------------------------
  // VIP / Premium
  // ---------------------------------------------------------

  // ---------------------------------------------------------
  // VIP / PREMIUM - KAPİTAL BANK
  // ---------------------------------------------------------
  const handleUpgrade = async (listingId, type) => {
    try {
      setUpgrading(type);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Bu əməliyyat üçün əvvəlcə hesabınıza daxil olun.");
        setUpgrading(null);
        return;
      }

      if (!listingId) {
        alert("Elanın ID-si tapılmadı.");
        setUpgrading(null);
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

      setUpgrading(null);
    } catch (err) {
      console.error("Ödəniş xətası:", err.response?.data || err.message);

      alert(err.response?.data?.message || "Ödəniş zamanı xəta baş verdi.");

      setUpgrading(null);
    }
  };

  
  // ---------------------------------------------------------
  // Loading
  // ---------------------------------------------------------

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center relative overflow-hidden ${
          darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
        }`}
      >
        <BubbleBackground />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-xl shadow-rose-500/20">
            <Loader2 className="w-7 h-7 text-white animate-spin" />
          </div>

          <p className="font-semibold">Elan yüklənir...</p>
        </div>

        <BottomMenu />
      </div>
    );
  }

  // ---------------------------------------------------------
  // 404
  // ---------------------------------------------------------

  if (notFound || !post) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden ${
          darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
        }`}
      >
        <BubbleBackground />

        <div className="relative z-10 text-center">
          <div className="text-[100px] sm:text-[150px] font-black leading-none bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
            404
          </div>

          <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
            <ShieldCheck size={18} />
            Elan yüklənmədi
          </div>

          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold shadow-lg shadow-rose-500/20 hover:scale-[1.02] transition"
            >
              <ArrowLeft size={18} />
              Əsas səhifə
            </Link>
          </div>
        </div>

        <BottomMenu />
      </div>
    );
  }

  const contact = post?.contact || {};

  const currentId = post?.id || post?._id;

  const postDate = post?.data || post?.createdAt;

  // ---------------------------------------------------------
  // Bənzər elanlar
  // ---------------------------------------------------------

  const similarPosts = [...household]
    .filter((item) => {
      const itemId = item?.id || item?._id;

      return String(itemId) !== String(currentId);
    })
    .reverse()
    .slice(0, 8);

  // ---------------------------------------------------------
  // Məlumatlar
  // ---------------------------------------------------------

  const category = post?.category || "";

  const title = post?.title || "Məişət texnikası";

  const typeOfGoods = post?.type_of_goods || "";

  const brand = post?.brand || "";

  const model = post?.model || "";

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <BubbleBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 pt-24 pb-28">
        {/* ------------------------------------------------ */}
        {/* GERİ */}
        {/* ------------------------------------------------ */}

        <Link
          to="/Katalog/Məişət_Texnikası"
          className={`inline-flex items-center gap-2 mb-5 px-4 py-2.5 rounded-xl border backdrop-blur-md transition-all duration-200 ${
            darkMode
              ? "bg-slate-900/70 border-slate-700 text-slate-200 hover:bg-slate-800"
              : "bg-white/80 border-slate-200 text-slate-700 hover:bg-white shadow-sm"
          }`}
        >
          <ArrowLeft size={18} />
          Geri
        </Link>

        {/* ------------------------------------------------ */}
        {/* ƏSAS KONTENT */}
        {/* ------------------------------------------------ */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SOL TƏRƏF */}

          <div
            className={`lg:col-span-2 rounded-3xl border overflow-hidden backdrop-blur-xl shadow-xl ${
              darkMode
                ? "bg-slate-900/80 border-slate-800"
                : "bg-white/90 border-slate-200"
            }`}
          >
            {/* Başlıq */}

            <div className="p-5 sm:p-6 pb-3">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold">
                  <Refrigerator size={14} />
                  Məişət Texnikası
                </span>

                {post?.priorityType === "premium" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold">
                    <Crown size={14} />
                    PREMIUM
                  </span>
                )}

                {post?.priorityType === "vip" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-500 border border-violet-500/20 text-xs font-bold">
                    <Sparkles size={14} />
                    VIP
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black leading-tight capitalize">
                {title}
                {brand && ` ${brand}`}
                {model && ` ${model}`}
              </h1>

              {(brand || model || typeOfGoods) && (
                <p
                  className={`mt-2 text-sm ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {[brand, model, typeOfGoods].filter(Boolean).join(" • ")}
                </p>
              )}
            </div>

            {/* QALEREYA */}

            <div className="px-3 sm:px-6">
              <div
                className={`rounded-2xl overflow-hidden border ${
                  darkMode
                    ? "border-slate-800 bg-slate-950"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                {imageArray.length > 0 ? (
                  <Carousel
                    showThumbs={imageArray.length > 1}
                    showStatus={false}
                    autoPlay
                    infiniteLoop
                    swipeable
                    emulateTouch
                    interval={4500}
                    showIndicators={imageArray.length > 1}
                  >
                    {imageArray.map((img, index) => (
                      <div
                        key={index}
                        className="w-full h-[300px] sm:h-[400px] lg:h-[460px] cursor-zoom-in"
                        onClick={() => openZoom(index)}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`Şəkil ${index + 1}`}
                          className="w-full h-full object-contain rounded-xl"
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <div className="h-[300px] flex flex-col items-center justify-center text-slate-400">
                    <Refrigerator size={44} />

                    <span className="mt-2">Şəkil yoxdur</span>
                  </div>
                )}
              </div>
            </div>

            {/* QİYMƏT */}

            <div className="px-5 sm:px-6 pt-6">
              <div className="inline-flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                  {post.price}
                </span>

                <span className="text-xl font-bold text-rose-500">AZN</span>
              </div>
            </div>

            {/* DETALLAR */}

            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {title && (
                  <div
                    className={`rounded-2xl p-4 border ${
                      darkMode
                        ? "bg-slate-800/70 border-slate-700"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-rose-500 mb-1">
                      <Package size={17} />

                      <span className="text-xs font-bold uppercase">
                        Məhsul
                      </span>
                    </div>

                    <p className="font-bold">{title}</p>
                  </div>
                )}

                {category && (
                  <div
                    className={`rounded-2xl p-4 border ${
                      darkMode
                        ? "bg-slate-800/70 border-slate-700"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-rose-500 mb-1">
                      <Tag size={17} />

                      <span className="text-xs font-bold uppercase">
                        Kateqoriya
                      </span>
                    </div>

                    <p className="font-bold">{category}</p>
                  </div>
                )}

                {typeOfGoods && (
                  <div
                    className={`rounded-2xl p-4 border ${
                      darkMode
                        ? "bg-slate-800/70 border-slate-700"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-rose-500 mb-1">
                      <Package size={17} />

                      <span className="text-xs font-bold uppercase">
                        Məhsul tipi
                      </span>
                    </div>

                    <p className="font-bold">{typeOfGoods}</p>
                  </div>
                )}

                {brand && (
                  <div
                    className={`rounded-2xl p-4 border ${
                      darkMode
                        ? "bg-slate-800/70 border-slate-700"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-rose-500 mb-1">
                      <Tag size={17} />

                      <span className="text-xs font-bold uppercase">Brend</span>
                    </div>

                    <p className="font-bold">{brand}</p>
                  </div>
                )}

                {model && (
                  <div
                    className={`rounded-2xl p-4 border ${
                      darkMode
                        ? "bg-slate-800/70 border-slate-700"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-rose-500 mb-1">
                      <Tag size={17} />

                      <span className="text-xs font-bold uppercase">Model</span>
                    </div>

                    <p className="font-bold">{model}</p>
                  </div>
                )}

                {post.location && (
                  <div
                    className={`rounded-2xl p-4 border ${
                      darkMode
                        ? "bg-slate-800/70 border-slate-700"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-rose-500 mb-1">
                      <MapPin size={17} />

                      <span className="text-xs font-bold uppercase">
                        Yerləşmə
                      </span>
                    </div>

                    <p className="font-bold">{post.location}</p>
                  </div>
                )}
              </div>

              {/* TƏSVİR */}

              {post.description && (
                <div className="mt-6">
                  <h2 className="text-lg font-black mb-2">Məhsul haqqında</h2>

                  <div
                    className={`rounded-2xl p-5 border leading-7 ${
                      darkMode
                        ? "bg-slate-800/60 border-slate-700 text-slate-300"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    {post.description}
                  </div>
                </div>
              )}

              {/* ELAN MƏLUMATLARI */}

              <div
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6 pt-5 border-t text-sm ${
                  darkMode
                    ? "border-slate-800 text-slate-400"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} />

                  <span>
                    Elanın nömrəsi: <strong>{post.id || post._id}</strong>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={15} />

                    {formatDate(postDate)}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={15} />

                    {getCurrentTime(postDate)}
                  </span>

                  {post.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={15} />

                      {post.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------ */}
          {/* SAĞ ƏLAQƏ PANELİ */}
          {/* ------------------------------------------------ */}

          <aside className="lg:col-span-1">
            <div
              className={`lg:sticky lg:top-24 rounded-3xl border p-5 shadow-xl backdrop-blur-xl ${
                darkMode
                  ? "bg-slate-900/85 border-slate-800"
                  : "bg-white/90 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <User className="text-white" size={23} />
                </div>

                <div>
                  <h2 className="font-black text-lg">Əlaqə məlumatı</h2>

                  <p
                    className={`text-xs ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Elan sahibi
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {contact?.name && (
                  <div
                    className={`flex gap-3 p-3 rounded-xl ${
                      darkMode ? "bg-slate-800" : "bg-slate-50"
                    }`}
                  >
                    <User size={18} className="text-rose-500 mt-0.5" />

                    <div>
                      <p className="text-xs text-slate-400">Ad</p>

                      <p className="font-bold">{contact.name}</p>
                    </div>
                  </div>
                )}

                {contact?.phone && (
                  <div
                    className={`flex gap-3 p-3 rounded-xl ${
                      darkMode ? "bg-slate-800" : "bg-slate-50"
                    }`}
                  >
                    <Phone size={18} className="text-rose-500 mt-0.5" />

                    <div>
                      <p className="text-xs text-slate-400">Telefon</p>

                      <a
                        href={`tel:${contact.phone}`}
                        className="font-bold text-rose-500 hover:underline"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contact?.email && (
                  <div
                    className={`flex gap-3 p-3 rounded-xl ${
                      darkMode ? "bg-slate-800" : "bg-slate-50"
                    }`}
                  >
                    <Mail size={18} className="text-rose-500 mt-0.5" />

                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">Email</p>

                      <p className="font-semibold break-all">{contact.email}</p>
                    </div>
                  </div>
                )}

                {post.location && (
                  <div
                    className={`flex gap-3 p-3 rounded-xl ${
                      darkMode ? "bg-slate-800" : "bg-slate-50"
                    }`}
                  >
                    <MapPin size={18} className="text-rose-500 mt-0.5" />

                    <div>
                      <p className="text-xs text-slate-400">Şəhər</p>

                      <p className="font-bold">{post.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* ------------------------------------------------ */}
              {/* MAĞAZAYA KEÇİD */}
              {/* ------------------------------------------------ */}

              {business?.slug && (
                <Link
                  to={`/biznes/${business.slug}`}
                  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 font-black transition-all hover:-translate-y-0.5 ${
                    darkMode
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      : "border-rose-500/20 bg-rose-500/5 text-rose-600 hover:bg-rose-500/10"
                  }`}
                >
                  <Package size={19} />
                  Mağazaya keçid et
                </Link>
              )}

              {/* ------------------------------------------------ */}
              {/* ZƏNG ET */}
              {/* ------------------------------------------------ */}

              {contact?.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="mt-5 flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black shadow-lg shadow-rose-500/20 hover:scale-[1.01] transition"
                >
                  <Phone size={19} />
                  Zəng et
                </a>
              )}

              {/* ------------------------------------------------ */}
              {/* VIP / PREMIUM */}
              {/* ------------------------------------------------ */}

              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => handleUpgrade(post._id || post.id, "vip")}
                  disabled={upgrading !== null}
                  className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-500 font-bold hover:bg-violet-500/20 transition disabled:opacity-50"
                >
                  {upgrading === "vip" ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Sparkles size={17} />
                  )}
                  VIP et
                </button>

                <button
                  onClick={() => handleUpgrade(post._id || post.id, "premium")}
                  disabled={upgrading !== null}
                  className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500 font-bold hover:bg-amber-500/20 transition disabled:opacity-50"
                >
                  {upgrading === "premium" ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Crown size={17} />
                  )}
                  Premium
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* ------------------------------------------------ */}
        {/* BƏNZƏR ELANLAR */}
        {/* ------------------------------------------------ */}

        {similarPosts.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-black">Bənzər elanlar</h2>

                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Digər məişət texnikası elanlarına baxın
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-rose-500">
                <Sparkles size={18} />

                <span className="text-sm font-bold">ProElan</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {similarPosts.map((item) => {
                const itemId = item?.id || item?._id;

                const itemDate = item?.data || item?.createdAt;

                return (
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    key={itemId}
                    to={`/PostDetailHousehold/${itemId}`}
                    className="group"
                  >
                    <div
                      className={`h-full rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                        darkMode
                          ? "bg-slate-900 border-slate-800"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="relative h-[190px] overflow-hidden">
                        <img
                          src={getImageUrl(item?.images?.[0])}
                          alt={item?.title || "Məişət texnikası"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                          Məişət Texnikası
                        </div>

                        {item?.priorityType === "premium" && (
                          <div className="absolute top-3 right-3 p-1.5 rounded-full bg-amber-500 text-white">
                            <Crown size={14} />
                          </div>
                        )}

                        {item?.priorityType === "vip" && (
                          <div className="absolute top-3 right-3 p-1.5 rounded-full bg-violet-500 text-white">
                            <Sparkles size={14} />
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <p className="text-xl font-black text-rose-500">
                          {item?.price} ₼
                        </p>

                        <h3
                          className={`font-bold mt-1 truncate ${
                            darkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {item?.title || "Məişət texnikası"}
                        </h3>

                        {item?.category && (
                          <p
                            className={`text-sm mt-1 truncate ${
                              darkMode ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {item.category}
                          </p>
                        )}

                        <div
                          className={`flex items-center justify-between gap-2 mt-4 pt-3 border-t text-xs ${
                            darkMode
                              ? "border-slate-800 text-slate-500"
                              : "border-slate-100 text-slate-400"
                          }`}
                        >
                          <span className="flex items-center gap-1 truncate">
                            <MapPin size={13} />

                            {item?.location || "—"}
                          </span>

                          <span className="whitespace-nowrap">
                            {formatDate(itemDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* ------------------------------------------------ */}
      {/* FULLSCREEN ZOOM */}
      {/* ------------------------------------------------ */}

      {zoomIndex !== null && imageArray.length > 0 && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeZoom}
        >
          {/* Bağla */}

          <button
            onClick={closeZoom}
            className="absolute top-5 right-5 z-[10001] w-11 h-11 rounded-full bg-white/10 hover:bg-red-500/80 text-white flex items-center justify-center transition"
            aria-label="Bağla"
          >
            <X size={24} />
          </button>

          {/* Sol */}

          {imageArray.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-3 sm:left-6 z-[10001] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              aria-label="Əvvəlki şəkil"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Şəkil */}

          <img
            src={getImageUrl(imageArray[zoomIndex])}
            alt="Zoomed"
            onClick={(e) => e.stopPropagation()}
            className="max-w-[92%] max-h-[88%] object-contain rounded-xl select-none"
          />

          {/* Sağ */}

          {imageArray.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-3 sm:right-6 z-[10001] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              aria-label="Növbəti şəkil"
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Sayğac */}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-bold">
            {zoomIndex + 1} / {imageArray.length}
          </div>
        </div>
      )}

      <BottomMenu />
    </div>
  );
}
