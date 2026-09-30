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
  CalendarDays,
  Clock3,
  Phone,
  Mail,
  User,
  Tag,
  Crown,
  Sparkles,
  ShieldCheck,
  Package,
  Loader2,
  Eye,
} from "lucide-react";

import { useTheme } from "../../components/Main/ThemeContext";
import BubbleBackground from "../../components/ui/BubbleBackground";
import BottomMenu from "../../components/MobileMenu";
import { getVisitorId } from "../../utils/visitorId";

export default function AcsesuarDetail() {
  const { id } = useParams();
  const { darkMode } = useTheme();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [accessories, setAccessories] = useState([]);
  const [zoomIndex, setZoomIndex] = useState(null);
  const [upgrading, setUpgrading] = useState(null);

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

  // =========================================================
  // Accessories
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const fetchAccessories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/accessory`);

        if (!mounted) return;

        setAccessories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(
          "Aksesuar elanları yüklənmədi:",
          err.response?.data || err.message,
        );
      }
    };

    fetchAccessories();

    return () => {
      mounted = false;
    };
  }, [BASE_URL]);

  // =========================================================
  // Current post
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const res = await axios.get(`${BASE_URL}/api/accessory/${id}`);

        if (!mounted) return;

        if (!res.data) {
          setPost(null);
          setNotFound(true);
          return;
        }

        setPost(res.data);

        // =====================================================
        // DATE DEBUG
        // =====================================================

        console.log("Aksesuar tarix məlumatı:", {
          id: res.data?.id,
          mongoId: res.data?._id,
          data: res.data?.data,
          createdAt: res.data?.createdAt,
          updatedAt: res.data?.updatedAt,
        });

        // =====================================================
        // ELAN BAXIŞINI QEYD ET
        // Qonaq + login olan istifadəçi
        // =====================================================

        try {
          const visitorId = getVisitorId();
          const token = localStorage.getItem("token");

          const viewResponse = await axios.post(
            `${BASE_URL}/api/ads/${id}/view`,
            {},
            {
              headers: {
                "x-visitor-id": visitorId,
                ...(token
                  ? {
                      Authorization: `Bearer ${token}`,
                    }
                  : {}),
              },
            },
          );

          if (!mounted) return;

          if (
            viewResponse.data?.success &&
            typeof viewResponse.data.viewCount === "number"
          ) {
            setPost((prev) =>
              prev
                ? {
                    ...prev,
                    viewCount: viewResponse.data.viewCount,
                  }
                : prev,
            );
          }
        } catch (viewError) {
          console.error(
            "Elan baxışı qeyd olunmadı:",
            viewError.response?.data || viewError.message,
          );
        }
      } catch (err) {
        console.error("Elan yüklənmədi:", err.response?.data || err.message);

        if (mounted) {
          setPost(null);
          setNotFound(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchPost();
    }

    return () => {
      mounted = false;
    };
  }, [id, BASE_URL]);

  // =========================================================
  // Keyboard controls for zoom
  // =========================================================

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

  // =========================================================
  // Images
  // =========================================================

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

  // =========================================================
  // DATE / TIME
  // =========================================================

  /*
   * Əsas tarix:
   *
   * Yeni elanlar:
   * createdAt
   *
   * Köhnə elanlarda data varsa:
   * data
   *
   * Son fallback:
   * updatedAt
   */

  const getPostDate = (item) => {
    if (!item) return null;

    return item.createdAt || item.data || item.updatedAt || null;
  };

  // =========================================================
  // Format Date
  // =========================================================

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const postDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    const diffDays = Math.round((today - postDay) / (24 * 60 * 60 * 1000));

    if (diffDays === 0) {
      return "bugün";
    }

    if (diffDays === 1) {
      return "dünən";
    }

    return date.toLocaleDateString("az-AZ", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // =========================================================
  // Format Time
  // =========================================================

  const getCurrentTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString("az-AZ", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // =========================================================
  // Zoom
  // =========================================================

  const openZoom = (index) => {
    setZoomIndex(index);
  };

  const closeZoom = () => {
    setZoomIndex(null);
  };

  const prevImage = () => {
    if (imageArray.length === 0) return;

    setZoomIndex((prev) => (prev === 0 ? imageArray.length - 1 : prev - 1));
  };

  const nextImage = () => {
    if (imageArray.length === 0) return;

    setZoomIndex((prev) => (prev === imageArray.length - 1 ? 0 : prev + 1));
  };

  // =========================================================
  // VIP / Premium - Kapital Bank
  // =========================================================

  const handleUpgrade = async (listingId, type) => {
    try {
      setUpgrading(type);

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token tapılmadı");
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

      console.log("Kapital ödəniş cavabı:", data);

      // Kapital Bank HPP səhifəsinə keçid
      if (data?.success && data?.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      console.error("Kapital Bank paymentUrl qaytarmadı:", data);

      setUpgrading(null);
    } catch (err) {
      console.error("Ödəniş yaradılmadı:", err.response?.data || err.message);

      setUpgrading(null);
    }
  };

  // =========================================================
  // Loading
  // =========================================================

  if (loading) {
    return (
      <div
        className={`relative min-h-screen flex items-center justify-center ${
          darkMode ? "bg-slate-950" : "bg-slate-50"
        }`}
      >
        <BubbleBackground />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#670fff]/10 text-[#670fff]">
            <Loader2 size={30} className="animate-spin" />
          </div>

          <p
            className={`text-sm font-semibold ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Elan yüklənir...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // Not found
  // =========================================================

  if (notFound || !post) {
    return (
      <div
        className={`relative min-h-screen flex items-center justify-center px-4 ${
          darkMode ? "bg-slate-950" : "bg-slate-50"
        }`}
      >
        <BubbleBackground />

        <div className="relative z-10 text-center">
          <div className="text-8xl sm:text-9xl font-black bg-gradient-to-r from-[#670fff] to-fuchsia-500 bg-clip-text text-transparent">
            404
          </div>

          <div
            className={`mt-4 text-lg font-bold ${
              darkMode ? "text-white" : "text-slate-800"
            }`}
          >
            Elan tapılmadı
          </div>

          <p
            className={`mt-2 text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Bu elan silinmiş və ya artıq mövcud deyil.
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#670fff] px-6 py-3 font-bold text-white shadow-lg shadow-[#670fff]/25 transition hover:-translate-y-0.5 hover:bg-[#5a0de0]"
          >
            <ArrowLeft size={18} />
            Əsas səhifəyə qayıt
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================
  // Current post date
  // =========================================================

  const currentPostDate = getPostDate(post);

  // =========================================================
  // Main
  // =========================================================

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      <BubbleBackground />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-28 sm:pb-12">
        {/* =====================================================
            Back
        ===================================================== */}

        <Link
          to="/Katalog/Ehtiyyat_hissələri_ve_aksesuarlar"
          className={`mb-5 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
            darkMode
              ? "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-[#670fff]/40 hover:text-white"
              : "border-slate-200 bg-white text-slate-700 hover:border-[#670fff]/30 hover:text-[#670fff]"
          }`}
        >
          <ArrowLeft size={17} />
          Geri
        </Link>

        {/* =====================================================
            Main Card
        ===================================================== */}

        <div
          className={`grid grid-cols-1 gap-6 rounded-[30px] border p-3 sm:p-5 lg:grid-cols-3 lg:p-6 ${
            darkMode
              ? "border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/20"
              : "border-slate-200 bg-white shadow-xl shadow-slate-300/20"
          }`}
        >
          {/* ===================================================
              Gallery
          =================================================== */}

          <div className="lg:col-span-2 min-w-0">
            <div className="overflow-hidden rounded-2xl">
              {imageArray.length > 0 ? (
                <Carousel
                  showThumbs={imageArray.length > 1}
                  showStatus={false}
                  autoPlay
                  infiniteLoop
                  swipeable
                  emulateTouch
                  showIndicators={imageArray.length > 1}
                >
                  {imageArray.map((img, index) => (
                    <div
                      key={index}
                      className="h-[300px] sm:h-[430px] lg:h-[500px] cursor-zoom-in"
                      onClick={() => openZoom(index)}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`Şəkil ${index + 1}`}
                        className="h-full w-full rounded-2xl object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/no-image.jpg";
                        }}
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <div
                  className={`flex h-[300px] sm:h-[430px] items-center justify-center rounded-2xl ${
                    darkMode ? "bg-slate-800" : "bg-slate-100"
                  }`}
                >
                  <Package
                    size={55}
                    className={darkMode ? "text-slate-600" : "text-slate-300"}
                  />
                </div>
              )}
            </div>

            {/* =================================================
                Title / Price
            ================================================= */}

            <div
              className={`mt-6 border-b pb-5 ${
                darkMode ? "border-slate-800" : "border-slate-200"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {post.category && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#670fff]/10 px-3 py-1 text-xs font-bold text-[#670fff]">
                    <Tag size={13} />
                    {post.category}
                  </span>
                )}

                {post.priorityType === "premium" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                    <Crown size={13} />
                    Premium
                  </span>
                )}

                {post.priorityType === "vip" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                    <Sparkles size={13} />
                    VIP
                  </span>
                )}
              </div>

              <h1
                className={`text-2xl sm:text-3xl font-black leading-tight ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                {post.title ||
                  `${post.category || ""} ${
                    post.brand || ""
                  } ${post.model || ""}`}
              </h1>

              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-3xl sm:text-4xl font-black text-[#670fff]">
                    {post.price} ₼
                  </p>
                </div>

                <div
                  className={`flex items-center gap-1.5 text-sm ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  <MapPin size={16} />
                  {post.location || "Məlum deyil"}
                </div>
              </div>
            </div>

            {/* =================================================
                Description
            ================================================= */}

            <div className="mt-6">
              <h2
                className={`text-lg font-black mb-3 ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Təsvir
              </h2>

              <div
                className={`rounded-2xl border p-4 sm:p-5 ${
                  darkMode
                    ? "border-slate-800 bg-slate-950/60"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <p
                  className={`leading-7 whitespace-pre-line ${
                    darkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {post.description || "Təsvir əlavə edilməyib."}
                </p>
              </div>
            </div>

            {/* =================================================
                Meta
            ================================================= */}

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Elanın nömrəsi */}

              <div
                className={`rounded-2xl border p-4 ${
                  darkMode
                    ? "border-slate-800 bg-slate-900"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-2 text-[#670fff]">
                  <ShieldCheck size={18} />

                  <span className="text-xs font-bold">Elanın nömrəsi</span>
                </div>

                <p
                  className={`mt-2 text-sm font-bold break-all ${
                    darkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  {post.id || post._id}
                </p>
              </div>

              {/* Tarix */}

              <div
                className={`rounded-2xl border p-4 ${
                  darkMode
                    ? "border-slate-800 bg-slate-900"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-2 text-[#670fff]">
                  <CalendarDays size={18} />

                  <span className="text-xs font-bold">Tarix</span>
                </div>

                <p
                  className={`mt-2 text-sm font-bold ${
                    darkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  {formatDate(currentPostDate) || "—"}
                </p>
              </div>

              {/* Saat */}

              <div
                className={`rounded-2xl border p-4 ${
                  darkMode
                    ? "border-slate-800 bg-slate-900"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-2 text-[#670fff]">
                  <Clock3 size={18} />

                  <span className="text-xs font-bold">Saat</span>
                </div>

                <p
                  className={`mt-2 text-sm font-bold ${
                    darkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  {getCurrentTime(currentPostDate) || "—"}
                </p>
              </div>
              <span className="mt-2 flex shrink-0 items-center gap-1 text-xs text-slate-500">
                <Eye size={13} />
                {(post?.viewCount || 0).toLocaleString("az-AZ")} baxış
              </span>
            </div>
          </div>

          {/* ===================================================
              Contact
          =================================================== */}

          <aside className="lg:col-span-1">
            <div
              className={`sticky top-24 rounded-3xl border p-5 ${
                darkMode
                  ? "border-slate-800 bg-slate-950/70"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#670fff]/10 text-[#670fff]">
                  <User size={21} />
                </div>

                <div>
                  <h2
                    className={`font-black ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Əlaqə məlumatı
                  </h2>

                  <p
                    className={`text-xs mt-0.5 ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Elan sahibi
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Ad */}

                <div
                  className={`rounded-2xl border p-4 ${
                    darkMode
                      ? "border-slate-800 bg-slate-900"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <User size={15} />
                    Ad
                  </div>

                  <p
                    className={`mt-1 font-bold ${
                      darkMode ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {post.contact?.name || "N/A"}
                  </p>
                </div>

                {/* Telefon */}

                <div
                  className={`rounded-2xl border p-4 ${
                    darkMode
                      ? "border-slate-800 bg-slate-900"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Phone size={15} />
                    Telefon
                  </div>

                  <a
                    href={`tel:${post.contact?.phone || ""}`}
                    className="mt-1 block font-bold text-[#670fff] hover:underline"
                  >
                    {post.contact?.phone || "N/A"}
                  </a>
                </div>

                {/* Email */}

                <div
                  className={`rounded-2xl border p-4 ${
                    darkMode
                      ? "border-slate-800 bg-slate-900"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Mail size={15} />
                    Email
                  </div>

                  <p
                    className={`mt-1 break-all font-medium ${
                      darkMode ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    {post.contact?.email || "N/A"}
                  </p>
                </div>

                {/* Şəhər */}

                <div
                  className={`rounded-2xl border p-4 ${
                    darkMode
                      ? "border-slate-800 bg-slate-900"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <MapPin size={15} />
                    Şəhər
                  </div>

                  <p
                    className={`mt-1 font-bold ${
                      darkMode ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {post.location || "N/A"}
                  </p>
                </div>

                {/* Mağaza */}

                {post.businessId?.slug && (
                  <Link
                    to={`/biznes/${post.businessId.slug}`}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 font-black transition-all hover:-translate-y-0.5 ${
                      darkMode
                        ? "border-[#670fff]/30 bg-[#670fff]/10 text-white hover:bg-[#670fff]/20"
                        : "border-[#670fff]/20 bg-[#670fff]/5 text-[#670fff] hover:bg-[#670fff]/10"
                    }`}
                  >
                    <Package size={19} />
                    Mağazaya keçid et
                  </Link>
                )}
              </div>

              {/* Call */}

              <a
                href={`tel:${post.contact?.phone || ""}`}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 py-3.5 font-black text-white shadow-lg shadow-green-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Phone size={19} />
                Zəng et
              </a>

              {/* Upgrade */}

              <div className="mt-5">
                <p
                  className={`mb-3 text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Elanı önə çıxar
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {/* VIP */}

                  <button
                    onClick={() => handleUpgrade(post._id || post.id, "vip")}
                    disabled={upgrading !== null}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-bold text-blue-600 transition hover:bg-blue-100 disabled:opacity-60"
                  >
                    {upgrading === "vip" ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Sparkles size={16} />
                    )}
                    VIP
                  </button>

                  {/* Premium */}

                  <button
                    onClick={() =>
                      handleUpgrade(post._id || post.id, "premium")
                    }
                    disabled={upgrading !== null}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-bold text-amber-600 transition hover:bg-amber-100 disabled:opacity-60"
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
          </aside>
        </div>

        {/* =====================================================
            Similar Ads
        ===================================================== */}

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2
                className={`text-xl sm:text-2xl font-black ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Bənzər elanlar
              </h2>

              <p
                className={`mt-1 text-sm ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Digər aksesuar elanlarına baxın
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {[...accessories]
              .reverse()
              .filter((item) => String(item._id || item.id) !== String(id))
              .slice(0, 8)
              .map((item) => {
                const itemDate = getPostDate(item);

                return (
                  <Link
                    key={item._id || item.id}
                    to={`/PostDetailAcsesuar/${item._id || item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      darkMode
                        ? "border-slate-800 bg-slate-900"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    {/* Image */}

                    <div className="relative h-[160px] sm:h-[190px] overflow-hidden">
                      <img
                        src={getImageUrl(item.images?.[0])}
                        alt={item.title || "Aksesuar"}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "/no-image.jpg";
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                      <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                        {item.category || "Aksesuar"}
                      </span>
                    </div>

                    {/* Content */}

                    <div className="p-3.5">
                      <h3
                        className={`text-lg font-black ${
                          darkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {item.price} ₼
                      </h3>

                      <p
                        className={`mt-1 truncate text-sm font-semibold ${
                          darkMode ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        {item.title ||
                          `${item.brand || ""} ${item.model || ""}`}
                      </p>

                      {/* Meta */}

                      <div
                        className={`mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {/* Location */}

                        <span className="flex items-center gap-1.5">
                          <MapPin size={15} />

                          {item.location || "Məlum deyil"}
                        </span>

                        {/* Date */}

                        {itemDate && (
                          <span className="flex items-center gap-1.5">
                            <CalendarDays size={15} />

                            {formatDate(itemDate)}
                          </span>
                        )}

                        {/* Time */}

                        {itemDate && (
                          <span className="flex items-center gap-1.5">
                            <Clock3 size={15} />

                            {getCurrentTime(itemDate)}
                          </span>
                        )}

                        {/* Views */}

                        <span className="flex items-center gap-1.5">
                          <Eye size={15} />
                          {(item.viewCount || 0).toLocaleString("az-AZ")} baxış
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </section>
      </main>

      {/* =======================================================
          Fullscreen Zoom
      ======================================================= */}

      {zoomIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          onClick={closeZoom}
        >
          {/* Close */}

          <button
            onClick={closeZoom}
            className="absolute right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-red-500"
            aria-label="Bağla"
          >
            <X size={24} />
          </button>

          {/* Counter */}

          <div className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-md">
            {zoomIndex + 1} / {imageArray.length}
          </div>

          {/* Previous */}

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-3 sm:left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
            aria-label="Əvvəlki şəkil"
          >
            <ChevronLeft size={30} />
          </button>

          {/* Image */}

          <img
            src={getImageUrl(imageArray[zoomIndex])}
            alt="Böyük şəkil"
            className="max-h-[88vh] max-w-[88vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              e.currentTarget.src = "/no-image.jpg";
            }}
          />

          {/* Next */}

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-3 sm:right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
            aria-label="Növbəti şəkil"
          >
            <ChevronRight size={30} />
          </button>
        </div>
      )}

      <BottomMenu />
    </div>
  );
}
