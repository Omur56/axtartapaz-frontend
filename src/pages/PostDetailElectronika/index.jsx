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
  Smartphone,
  Package,
  CalendarDays,
  Clock3,
  Loader2,
  Store,
  ExternalLink,
} from "lucide-react";

import { useTheme } from "../../components/Main/ThemeContext";
import BubbleBackground from "../../components/ui/BubbleBackground";
import BottomMenu from "../../components/MobileMenu";

export default function PostDetailelectronics() {
  const { id } = useParams();
  const { darkMode } = useTheme();

  const [post, setPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(null);
  const [upgrading, setUpgrading] = useState(null);
  const [businessLoading, setBusinessLoading] = useState(false);

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

  const contact = post?.contact ?? {};

  // =====================================================
  // BÜTÜN ELEKTRONİKA ELANLARI
  // =====================================================

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/electronics`)
      .then((res) => {
        setPosts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Elektronika elanları yüklənmədi:", err);
      });
  }, [BASE_URL]);

  // =====================================================
  // SEÇİLMİŞ ELAN
  // =====================================================

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    axios
      .get(`${BASE_URL}/api/electronics/${id}`)
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Elektronika elanı yüklənmədi:", err);
        setNotFound(true);
        setLoading(false);
      });
  }, [id, BASE_URL]);

  // =====================================================
  // BİZNES / MAĞAZA MƏLUMATLARI
  // =====================================================

  useEffect(() => {
    if (!post) {
      setBusiness(null);
      setBusinessLoading(false);
      return;
    }

    /*
      Biznes ID bir neçə formada gələ bilər:

      1. post.businessId
      2. post.electronikaPost.businessId
      3. post.businessId._id
      4. post.electronikaPost.businessId._id
    */

    const rawBusinessId =
      post?.businessId || post?.electronikaPost?.businessId || null;

    const businessId =
      typeof rawBusinessId === "object"
        ? rawBusinessId?._id || rawBusinessId?.id
        : rawBusinessId;

    // Əgər backend artıq business obyektini göndəribsə
    if (typeof rawBusinessId === "object" && rawBusinessId?.slug) {
      setBusiness(rawBusinessId);
      setBusinessLoading(false);
      return;
    }

    // Biznes ID yoxdursa, adi istifadəçi elanıdır
    if (!businessId) {
      setBusiness(null);
      setBusinessLoading(false);
      return;
    }

    let cancelled = false;

    const loadBusiness = async () => {
      try {
        setBusinessLoading(true);

        const res = await axios.get(
          `${BASE_URL}/api/business/by-id/${businessId}`,
        );

        if (!cancelled) {
          setBusiness(res.data || null);
        }
      } catch (err) {
        console.error(
          "Biznes məlumatları yüklənmədi:",
          err.response?.data || err.message,
        );

        if (!cancelled) {
          setBusiness(null);
        }
      } finally {
        if (!cancelled) {
          setBusinessLoading(false);
        }
      }
    };

    loadBusiness();

    return () => {
      cancelled = true;
    };
  }, [post, BASE_URL]);

  // =====================================================
  // ŞƏKİLLƏR
  // =====================================================

  const imageArray = Array.isArray(post?.images)
    ? post.images
    : post?.images
      ? [post.images]
      : [];

  const getImageUrl = (img) => {
    if (!img) return "/no-image.jpg";

    if (
      typeof img === "string" &&
      (img.startsWith("http://") || img.startsWith("https://"))
    ) {
      return img;
    }

    return `${BASE_URL}/uploads/${img}`;
  };

  // =====================================================
  // TARİX
  // =====================================================

  const formatDate = (dateString) => {
    if (!dateString) return "Tarix yoxdur";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Tarix yoxdur";
    }

    return date.toLocaleDateString("az-AZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // =====================================================
  // SAAT
  // =====================================================

  const getCurrentTime = (iso) => {
    if (!iso) return "";

    const date = new Date(iso);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString("az-AZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // ZOOM
  // =====================================================

  const openZoom = (index) => {
    setZoomIndex(index);
  };

  const closeZoom = () => {
    setZoomIndex(null);
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

  // =====================================================
  // KLAVİATURA ZOOM
  // =====================================================

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

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [zoomIndex]);

  // =====================================================
  // VIP / PREMIUM
  // =====================================================

  // =====================================================
  // VIP / PREMIUM - KAPİTAL BANK
  // =====================================================
  const handleUpgrade = async (listingId, type) => {
    try {
      setUpgrading(type);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Bu əməliyyat üçün əvvəlcə hesabınıza daxil olun.");
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

      // Kapital Bank HPP səhifəsinə keç
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      console.error("Kapital Bank paymentUrl qaytarmadı:", data);

      alert(data?.message || "Ödəniş səhifəsi yaradıla bilmədi.");

      setUpgrading(null);
    } catch (err) {
      console.error("Upgrade error:", err.response?.data || err.message);

      alert(err.response?.data?.message || "Ödəniş zamanı xəta baş verdi.");

      setUpgrading(null);
    }
  };

  
  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div
        className={`relative min-h-screen overflow-hidden ${
          darkMode ? "bg-[#09090f] text-white" : "bg-slate-50 text-slate-900"
        }`}
      >
        <BubbleBackground />

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div
            className={`flex flex-col items-center gap-4 px-8 py-8 rounded-[30px] border shadow-2xl backdrop-blur-xl ${
              darkMode
                ? "bg-white/[0.04] border-white/10"
                : "bg-white/90 border-slate-200"
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Loader2 size={30} className="text-white animate-spin" />
            </div>

            <div className="text-center">
              <p className="font-black text-lg">Elan yüklənir...</p>

              <p
                className={`text-sm mt-1 ${
                  darkMode ? "text-white/50" : "text-slate-500"
                }`}
              >
                Zəhmət olmasa gözləyin
              </p>
            </div>
          </div>
        </div>

        <BottomMenu />
      </div>
    );
  }

  // =====================================================
  // 404
  // =====================================================

  if (notFound || !post) {
    return (
      <div
        className={`relative min-h-screen overflow-hidden ${
          darkMode ? "bg-[#09090f] text-white" : "bg-slate-50 text-slate-900"
        }`}
      >
        <BubbleBackground />

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div
            className={`w-full max-w-lg text-center p-8 sm:p-10 rounded-[30px] border shadow-2xl backdrop-blur-xl ${
              darkMode
                ? "bg-white/[0.04] border-white/10"
                : "bg-white/90 border-slate-200"
            }`}
          >
            <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl">
              <Smartphone size={38} className="text-white" />
            </div>

            <div className="text-7xl sm:text-8xl font-black bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              404
            </div>

            <h1 className="text-2xl font-black mt-4">Elan tapılmadı</h1>

            <p
              className={`mt-2 text-sm ${
                darkMode ? "text-white/55" : "text-slate-500"
              }`}
            >
              Axtardığınız elektronika elanı silinmiş və ya artıq mövcud deyil.
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-7 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#670fff] to-violet-600 text-white font-bold shadow-lg hover:-translate-y-0.5 transition"
            >
              <ArrowLeft size={18} />
              Əsas səhifəyə qayıt
            </Link>
          </div>
        </div>

        <BottomMenu />
      </div>
    );
  }

  // =====================================================
  // BƏNZƏR ELANLAR
  // =====================================================

  const similarPosts = posts
    .filter((item) => String(item?._id || item?.id) !== String(id))
    .slice(0, 8);

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-[#09090f] text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      <BubbleBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28">
        {/* ================================================= */}
        {/* GERİ */}
        {/* ================================================= */}

        <Link
          to="/Katalog/Elektronika"
          className={`inline-flex items-center gap-2 mb-5 px-4 py-2.5 rounded-2xl border backdrop-blur-xl transition-all hover:-translate-x-0.5 ${
            darkMode
              ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <ArrowLeft size={18} />
          <span className="font-semibold">Geri</span>
        </Link>

        {/* ================================================= */}
        {/* ƏSAS KART */}
        {/* ================================================= */}

        <div
          className={`rounded-[30px] border shadow-2xl overflow-hidden backdrop-blur-xl ${
            darkMode
              ? "bg-white/[0.035] border-white/10"
              : "bg-white/90 border-slate-200"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* ================================================= */}
            {/* SOL */}
            {/* ================================================= */}

            <div className="lg:col-span-2 p-4 sm:p-6 lg:p-8">
              {/* BADGES */}

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md">
                  <Smartphone size={14} />
                  Elektronika
                </span>

                {post?.priorityType === "premium" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md">
                    <Crown size={14} />
                    PREMIUM
                  </span>
                )}

                {post?.priorityType === "vip" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md">
                    <Sparkles size={14} />
                    VIP
                  </span>
                )}
              </div>

              {/* BAŞLIQ */}

              <h1 className="text-2xl sm:text-3xl font-black leading-tight mb-5">
                {post?.brand || ""}
                {post?.brand && post?.model ? " " : ""}
                {post?.model || post?.title || "Elektronika"}
              </h1>

              {/* GALEREYA */}

              <div
                className={`rounded-3xl overflow-hidden border ${
                  darkMode
                    ? "border-white/10 bg-black/20"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                {imageArray.length > 0 ? (
                  <Carousel
                    showThumbs={true}
                    showStatus={false}
                    showIndicators={true}
                    autoPlay
                    infiniteLoop
                    interval={4500}
                    swipeable
                    emulateTouch
                  >
                    {imageArray.map((img, index) => (
                      <div
                        key={index}
                        className="h-[300px] sm:h-[420px] lg:h-[500px] cursor-zoom-in"
                        onClick={() => openZoom(index)}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`Şəkil ${index + 1}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "/no-image.jpg";
                          }}
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <div className="h-[300px] sm:h-[420px] flex items-center justify-center">
                    <div className="text-center">
                      <Smartphone size={60} className="mx-auto opacity-30" />
                      <p className="mt-3 opacity-50">Şəkil yoxdur</p>
                    </div>
                  </div>
                )}
              </div>

              {/* QİYMƏT */}

              <div className="mt-6">
                <div className="inline-flex items-center px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg">
                  <span className="text-3xl sm:text-4xl font-black">
                    {post?.price ?? "0"}
                  </span>

                  <span className="text-lg font-bold ml-2">AZN</span>
                </div>
              </div>

              {/* DETALLAR */}

              <div className="mt-7">
                <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                  <Package size={21} className="text-cyan-500" />
                  Məhsul haqqında
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* MARKA */}

                  <div
                    className={`p-4 rounded-2xl border ${
                      darkMode
                        ? "bg-white/[0.03] border-white/10"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <p className="text-xs opacity-50 mb-1">Marka</p>

                    <p className="font-bold flex items-center gap-2">
                      <Tag size={16} className="text-cyan-500" />
                      {post?.brand || "—"}
                    </p>
                  </div>

                  {/* MODEL */}

                  <div
                    className={`p-4 rounded-2xl border ${
                      darkMode
                        ? "bg-white/[0.03] border-white/10"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <p className="text-xs opacity-50 mb-1">Model</p>

                    <p className="font-bold">{post?.model || "—"}</p>
                  </div>

                  {/* KATEQORİYA */}

                  <div
                    className={`p-4 rounded-2xl border ${
                      darkMode
                        ? "bg-white/[0.03] border-white/10"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <p className="text-xs opacity-50 mb-1">Kateqoriya</p>

                    <p className="font-bold">{post?.category || "—"}</p>
                  </div>

                  {/* ŞƏHƏR */}

                  <div
                    className={`p-4 rounded-2xl border ${
                      darkMode
                        ? "bg-white/[0.03] border-white/10"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <p className="text-xs opacity-50 mb-1">Şəhər</p>

                    <p className="font-bold flex items-center gap-2">
                      <MapPin size={16} className="text-red-500" />
                      {post?.location || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* QEYD */}

              {post?.description && (
                <div
                  className={`mt-5 p-5 rounded-2xl border ${
                    darkMode
                      ? "bg-white/[0.03] border-white/10"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <h3 className="font-black mb-2">Qeyd</h3>

                  <p
                    className={`leading-7 ${
                      darkMode ? "text-white/65" : "text-slate-600"
                    }`}
                  >
                    {post.description}
                  </p>
                </div>
              )}

              {/* ELAN MƏLUMATLARI */}

              <div
                className={`grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t ${
                  darkMode ? "border-white/10" : "border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <Tag size={18} className="text-violet-500" />
                  </div>

                  <div>
                    <p className="text-xs opacity-50">Elanın nömrəsi</p>

                    <p className="font-bold text-sm break-all">
                      {post?.id || post?._id || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <CalendarDays size={18} className="text-blue-500" />
                  </div>

                  <div>
                    <p className="text-xs opacity-50">Tarix</p>

                    <p className="font-bold text-sm">
                      {formatDate(post?.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Clock3 size={18} className="text-emerald-500" />
                  </div>

                  <div>
                    <p className="text-xs opacity-50">Saat</p>

                    <p className="font-bold text-sm">
                      {getCurrentTime(post?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* SAĞ - ƏLAQƏ */}
            {/* ================================================= */}

            <div
              className={`p-4 sm:p-6 lg:p-8 border-t lg:border-t-0 lg:border-l ${
                darkMode ? "border-white/10" : "border-slate-200"
              }`}
            >
              <div
                className={`sticky top-24 rounded-3xl border p-5 ${
                  darkMode
                    ? "bg-white/[0.035] border-white/10"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <User size={23} className="text-white" />
                  </div>

                  <div>
                    <p className="text-xs opacity-50">Elan sahibi</p>

                    <h2 className="font-black text-lg">Əlaqə məlumatı</h2>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* AD */}

                  <div
                    className={`flex items-start gap-3 p-3 rounded-2xl ${
                      darkMode ? "bg-white/[0.04]" : "bg-white"
                    }`}
                  >
                    <User size={18} className="mt-0.5 text-violet-500" />

                    <div className="min-w-0">
                      <p className="text-xs opacity-50">Ad</p>

                      <p className="font-bold break-words">
                        {contact?.name || "—"}
                      </p>
                    </div>
                  </div>

                  {/* TELEFON */}

                  <div
                    className={`flex items-start gap-3 p-3 rounded-2xl ${
                      darkMode ? "bg-white/[0.04]" : "bg-white"
                    }`}
                  >
                    <Phone size={18} className="mt-0.5 text-emerald-500" />

                    <div className="min-w-0">
                      <p className="text-xs opacity-50">Telefon</p>

                      {contact?.phone ? (
                        <a
                          href={`tel:${contact.phone}`}
                          className="font-bold text-emerald-500 hover:underline break-all"
                        >
                          {contact.phone}
                        </a>
                      ) : (
                        <p className="font-bold">—</p>
                      )}
                    </div>
                  </div>

                  {/* EMAIL */}

                  <div
                    className={`flex items-start gap-3 p-3 rounded-2xl ${
                      darkMode ? "bg-white/[0.04]" : "bg-white"
                    }`}
                  >
                    <Mail size={18} className="mt-0.5 text-blue-500" />

                    <div className="min-w-0">
                      <p className="text-xs opacity-50">Email</p>

                      <p className="font-bold break-all">
                        {contact?.email || "—"}
                      </p>
                    </div>
                  </div>

                  {/* ŞƏHƏR */}

                  <div
                    className={`flex items-start gap-3 p-3 rounded-2xl ${
                      darkMode ? "bg-white/[0.04]" : "bg-white"
                    }`}
                  >
                    <MapPin size={18} className="mt-0.5 text-red-500" />

                    <div>
                      <p className="text-xs opacity-50">Şəhər</p>

                      <p className="font-bold">{post?.location || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* ================================================= */}
                {/* MAĞAZAYA KEÇİD */}
                {/* ================================================= */}

                {business?.slug && (
                  <div className="mt-5">
                    <Link
                      to={`/biznes/${business.slug}`}
                      className="group flex items-center justify-between gap-3 w-full p-4 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 hover:from-violet-500/20 hover:via-purple-500/20 hover:to-fuchsia-500/20 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-[#670fff] to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                          <Store size={22} className="text-white" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs opacity-50 mb-0.5">
                            Biznes mağazası
                          </p>

                          <p className="font-black truncate">
                            {business?.businessName || "Mağazaya bax"}
                          </p>
                        </div>
                      </div>

                      <ExternalLink
                        size={18}
                        className="shrink-0 text-violet-500 group-hover:translate-x-0.5 transition-transform"
                      />
                    </Link>
                  </div>
                )}

                {/* BİZNES YÜKLƏNİR */}

                {businessLoading && (
                  <div
                    className={`mt-5 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm ${
                      darkMode
                        ? "bg-white/[0.04] text-white/50"
                        : "bg-white text-slate-400"
                    }`}
                  >
                    <Loader2 size={16} className="animate-spin" />
                    Mağaza məlumatları yüklənir...
                  </div>
                )}

                {/* ZƏNG */}

                {contact?.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center justify-center gap-2 w-full mt-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition"
                  >
                    <Phone size={19} />
                    Zəng et
                  </a>
                )}

                {/* VIP / PREMIUM */}

                <div className="mt-5 pt-5 border-t border-slate-200/10">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={18} className="text-violet-500" />

                    <p className="font-black">Elanı önə çıxar</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* VIP */}

                    <button
                      type="button"
                      onClick={() => handleUpgrade(post?._id, "vip")}
                      disabled={upgrading !== null}
                      className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-sm shadow-md hover:-translate-y-0.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {upgrading === "vip" ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Sparkles size={16} />
                      )}
                      VIP et
                    </button>

                    {/* PREMIUM */}

                    <button
                      type="button"
                      onClick={() => handleUpgrade(post?._id, "premium")}
                      disabled={upgrading !== null}
                      className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-sm shadow-md hover:-translate-y-0.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {upgrading === "premium" ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Crown size={16} />
                      )}
                      Premium
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* BƏNZƏR ELANLAR */}
        {/* ================================================= */}

        {similarPosts.length > 0 && (
          <section className="mt-12">
            <div className="mb-5">
              <div className="inline-flex items-center gap-2 text-sm font-bold text-cyan-500 mb-1">
                <Sparkles size={16} />
                Oxşar məhsullar
              </div>

              <h2 className="text-2xl sm:text-3xl font-black">
                Bənzər elanlar
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {similarPosts.map((item) => {
                const itemId = item?._id || item?.id;

                return (
                  <Link
                    key={itemId}
                    to={`/PostDetailelectronics/${itemId}`}
                    className="group"
                  >
                    <div
                      className={`h-full rounded-3xl overflow-hidden border shadow-lg transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl ${
                        darkMode
                          ? "bg-white/[0.035] border-white/10"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      {/* ŞƏKİL */}

                      <div className="relative h-[210px] overflow-hidden">
                        <img
                          src={getImageUrl(item?.images?.[0])}
                          alt={item?.title || "Elektronika"}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = "/no-image.jpg";
                          }}
                        />

                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

                        {item?.priorityType === "premium" && (
                          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[11px] font-black shadow-lg">
                            <Crown size={12} />
                            PREMIUM
                          </span>
                        )}

                        {item?.priorityType === "vip" && (
                          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-black shadow-lg">
                            <Sparkles size={12} />
                            VIP
                          </span>
                        )}
                      </div>

                      {/* MƏLUMAT */}

                      <div className="p-4">
                        <p className="text-xl font-black">
                          {item?.price ?? "0"} ₼
                        </p>

                        <h3 className="font-bold mt-1 truncate">
                          {item?.title ||
                            `${item?.brand || ""} ${item?.model || ""}`}
                        </h3>

                        <div className="flex items-center gap-1.5 mt-2 text-sm text-cyan-500 font-semibold">
                          <Tag size={14} />

                          <span className="truncate">
                            {item?.brand || "Marka yoxdur"}
                          </span>
                        </div>

                        <div
                          className={`flex items-center justify-between gap-2 mt-3 pt-3 border-t text-xs ${
                            darkMode
                              ? "border-white/10 text-white/45"
                              : "border-slate-100 text-slate-400"
                          }`}
                        >
                          <span className="flex items-center gap-1 truncate">
                            <MapPin size={13} />
                            {item?.location || "—"}
                          </span>

                          <span className="flex items-center gap-1 whitespace-nowrap">
                            <Clock3 size={13} />
                            {getCurrentTime(item?.createdAt)}
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

      {/* ================================================= */}
      {/* FULLSCREEN ZOOM */}
      {/* ================================================= */}

      {zoomIndex !== null && imageArray.length > 0 && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={closeZoom}
        >
          {/* BAĞLA */}

          <button
            type="button"
            onClick={closeZoom}
            className="absolute top-5 right-5 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-red-500/80 text-white flex items-center justify-center transition"
            aria-label="Bağla"
          >
            <X size={25} />
          </button>

          {/* SAYĞAC */}

          <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-bold backdrop-blur-md">
            {zoomIndex + 1} / {imageArray.length}
          </div>

          {/* SOL */}

          {imageArray.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-3 sm:left-7 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              aria-label="Əvvəlki şəkil"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* ŞƏKİL */}

          <img
            src={getImageUrl(imageArray[zoomIndex])}
            alt="Böyük görünüş"
            className="max-w-[92vw] max-h-[88vh] object-contain rounded-xl select-none"
            onClick={(e) => e.stopPropagation()}
          />

          {/* SAĞ */}

          {imageArray.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-3 sm:right-7 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              aria-label="Növbəti şəkil"
            >
              <ChevronRight size={32} />
            </button>
          )}

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white/60 text-xs backdrop-blur-md hidden sm:block">
            ← → ilə dəyişdir · ESC ilə bağla
          </div>
        </div>
      )}

      <BottomMenu />
    </div>
  );
}
