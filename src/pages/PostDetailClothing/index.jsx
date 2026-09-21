import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Crown,
  ExternalLink,
  Heart,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  ShieldCheck,
  Sparkles,
  Tag,
  User,
  X,
} from "lucide-react";
import { useTheme } from "../../components/Main/ThemeContext";

export default function PostDetailClothing() {
  const { id } = useParams();
  const { darkMode } = useTheme();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [clothing, setClothing] = useState([]);

  const [zoomIndex, setZoomIndex] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const [isUpgrading, setIsUpgrading] = useState(false);

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

  /* =========================================================
     ELANI GƏTİR
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const res = await axios.get(`${BASE_URL}/api/Clothing/${id}`);

        if (!mounted) return;

        setPost(res.data);
      } catch (err) {
        console.error("Clothing detail error:", err);

        if (mounted) {
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

  /* =========================================================
     BƏNZƏR ELANLAR
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchClothing = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/Clothing/`);

        if (!mounted) return;

        const data = Array.isArray(res.data) ? res.data : res.data?.ads || [];

        setClothing(data);
      } catch (err) {
        console.error("Bənzər elanlar yüklənmədi:", err);
      }
    };

    fetchClothing();

    return () => {
      mounted = false;
    };
  }, [BASE_URL]);

  /* =========================================================
     ŞƏKİLLƏR
  ========================================================= */

  const getImageUrl = (image) => {
    if (!image) return "/no-image.jpg";

    if (typeof image === "object") {
      image =
        image.url || image.secure_url || image.path || image.filename || "";
    }

    if (!image) return "/no-image.jpg";

    if (String(image).startsWith("http")) {
      return image;
    }

    if (String(image).startsWith("/")) {
      return `${BASE_URL}${image}`;
    }

    return `${BASE_URL}/uploads/${image}`;
  };

  const imageArray = useMemo(() => {
    if (!post?.images) return [];

    const images = Array.isArray(post.images) ? post.images : [post.images];

    return images.map((image) => getImageUrl(image)).filter(Boolean);
  }, [post]);

  /* =========================================================
     ZOOM
  ========================================================= */

  const openZoom = (index) => {
    setSelectedImage(index);
    setZoomIndex(index);
  };

  const closeZoom = () => {
    setZoomIndex(null);
  };

  const prevImage = () => {
    setZoomIndex((prev) => {
      if (prev === null) return 0;

      return prev === 0 ? imageArray.length - 1 : prev - 1;
    });
  };

  const nextImage = () => {
    setZoomIndex((prev) => {
      if (prev === null) return 0;

      return prev === imageArray.length - 1 ? 0 : prev + 1;
    });
  };

  useEffect(() => {
    if (zoomIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeZoom();
      }

      if (e.key === "ArrowLeft") {
        prevImage();
      }

      if (e.key === "ArrowRight") {
        nextImage();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [zoomIndex, imageArray.length]);

  /* =========================================================
     TARİX
  ========================================================= */

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

  const getCurrentTime = (isoString) => {
    if (!isoString) return "";

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
     VIP / PREMIUM
  ========================================================= */

  const handleUpgrade = async (listingId, type) => {
    try {
      setIsUpgrading(true);

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

      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("Ödəniş səhifəsi yaradıla bilmədi.");
      }
    } catch (err) {
      console.error("Upgrade error:", err.response?.data || err.message);

      alert(err.response?.data?.message || "Ödəniş zamanı xəta baş verdi.");
    } finally {
      setIsUpgrading(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center px-4 ${
          darkMode
            ? "bg-[#080b14]"
            : "bg-gradient-to-br from-slate-50 via-white to-violet-50"
        }`}
      >
        <div className="w-full max-w-md text-center">
          <div
            className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ${
              darkMode
                ? "bg-[#111827] text-violet-400"
                : "bg-white text-[#670fff]"
            }`}
          >
            <Sparkles size={30} className="animate-pulse" />
          </div>

          <h2
            className={`text-xl font-black ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Elan yüklənir...
          </h2>

          <p
            className={`mt-2 text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Məlumatlar hazırlanır
          </p>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-[#670fff] to-violet-400" />
          </div>
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
        className={`min-h-screen flex items-center justify-center px-4 ${
          darkMode
            ? "bg-[#080b14]"
            : "bg-gradient-to-br from-violet-50 via-white to-fuchsia-50"
        }`}
      >
        <div className="text-center">
          <div className="text-[110px] sm:text-[150px] font-black leading-none bg-gradient-to-r from-[#670fff] to-fuchsia-500 bg-clip-text text-transparent">
            404
          </div>

          <div
            className={`mx-auto max-w-md text-lg font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Elan yüklənmədi
          </div>

          <p
            className={`mt-2 text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Elan silinmiş və ya mövcud olmaya bilər.
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#670fff] to-violet-500 px-6 py-3 font-bold text-white shadow-lg shadow-[#670fff]/20 transition hover:-translate-y-0.5"
          >
            <ArrowLeft size={18} />
            Əsas səhifəyə qayıt
          </Link>
        </div>
      </div>
    );
  }

  /* =========================================================
     DATA
  ========================================================= */

  const clothingData = post?.clothing || {};

  const title =
    [
      clothingData.category,
      clothingData.brand,
      clothingData.model,
      clothingData.type,
    ]
      .filter(Boolean)
      .join(" ") ||
    post.title ||
    "Geyim elanı";

  const phone = post.contact?.phone || "";
  const email = post.contact?.email || "";
  const contactName = post.contact?.name || "N/A";

  const similarClothing = [...clothing]
    .filter((item) => {
      const itemId = item?._id || item?.id;
      return String(itemId) !== String(post?._id || post?.id);
    })
    .reverse()
    .slice(0, 8);

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div
      className={`min-h-screen transition-colors duration-300 rounded-2xl ${
        darkMode ? "bg-[#080b14] text-white" : "bg-[#f7f8fc] text-gray-900"
      }`}
    >
      <div className="mx-auto max-w-7xl px-3 pb-12 pt-20 sm:px-5 lg:px-6">
        {/* =====================================================
            GERİ
        ===================================================== */}

        <div className="mb-5">
          <Link
            to="/Katalog/Geyimlər"
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
              darkMode
                ? "border-gray-800 bg-[#111827] text-gray-200 hover:bg-[#182033]"
                : "border-gray-200 bg-white text-gray-700 shadow-sm hover:border-[#670fff]/30 hover:text-[#670fff]"
            }`}
          >
            <ArrowLeft size={18} />
            Geri
          </Link>
        </div>

        {/* =====================================================
            ƏSAS KART
        ===================================================== */}

        <div
          className={`overflow-hidden rounded-3xl border shadow-xl ${
            darkMode
              ? "border-gray-800 bg-[#0d111d] shadow-black/20"
              : "border-gray-100 bg-white shadow-gray-200/60"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* =================================================
                SOL
            ================================================= */}

            <div className="min-w-0 p-4 sm:p-6 lg:p-8">
              {/* TITLE */}

              <div className="mb-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#670fff]/10 px-3 py-1 text-xs font-black text-[#670fff]">
                    <Tag size={13} />
                    Geyim
                  </span>

                  {clothingData.condition && (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                        darkMode
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      <CheckCircle2 size={13} />
                      {clothingData.condition}
                    </span>
                  )}
                </div>

                <h1
                  className={`text-2xl font-black leading-tight sm:text-3xl lg:text-4xl ${
                    darkMode ? "text-white" : "text-gray-950"
                  }`}
                >
                  {title}
                </h1>

                <div
                  className={`mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} />
                    {post.location || "Məlum deyil"}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={15} />
                    {formatDate(post.data)}
                  </span>

                  {post.data && (
                    <span className="flex items-center gap-1.5">
                      <Clock3 size={15} />
                      {getCurrentTime(post.data)}
                    </span>
                  )}
                </div>
              </div>

              {/* =================================================
                  GALEREYA
              ================================================= */}

              <div
                className={`overflow-hidden rounded-3xl border ${
                  darkMode
                    ? "border-gray-800 bg-[#080b14]"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <div className="relative">
                  {imageArray.length > 0 ? (
                    <div
                      className="group relative flex h-[320px] cursor-zoom-in items-center justify-center sm:h-[450px] lg:h-[500px]"
                      onClick={() => openZoom(selectedImage)}
                    >
                      <img
                        src={imageArray[selectedImage]}
                        alt={title}
                        className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-[1.015]"
                        onError={(e) => {
                          e.currentTarget.src = "/no-image.jpg";
                        }}
                      />

                      <div className="absolute right-4 top-4 flex items-center gap-2">
                        <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                          {selectedImage + 1} / {imageArray.length}
                        </span>

                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur">
                          <Maximize2 size={18} />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-[320px] items-center justify-center sm:h-[450px]">
                      <div className="text-center">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-200 dark:bg-gray-800">
                          <Tag size={25} />
                        </div>

                        <p
                          className={`font-bold ${
                            darkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Şəkil yoxdur
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* THUMBNAILS */}

                {imageArray.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto p-3">
                    {imageArray.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-20 sm:w-24 ${
                          selectedImage === index
                            ? "border-[#670fff] shadow-md"
                            : darkMode
                              ? "border-gray-800"
                              : "border-gray-200"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Şəkil ${index + 1}`}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/no-image.jpg";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* PRICE */}

              <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p
                    className={`mb-1 text-sm font-semibold ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Elanın qiyməti
                  </p>

                  <div className="text-3xl font-black text-[#670fff] sm:text-4xl">
                    {post.price ?? "0"} ₼
                  </div>
                </div>

                <div
                  className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold ${
                    darkMode
                      ? "bg-pink-500/10 text-pink-400"
                      : "bg-pink-50 text-pink-500"
                  }`}
                >
                  <Heart size={17} />
                  Elanı yadda saxla
                </div>
              </div>

              {/* =================================================
                  ELAN DETALLARI
              ================================================= */}

              <div className="mt-8">
                <h2 className="mb-4 text-xl font-black">Elan haqqında</h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <DetailItem
                    label="Məhsul"
                    value={post.title}
                    darkMode={darkMode}
                  />

                  <DetailItem
                    label="Məhsul tipi"
                    value={clothingData.type}
                    darkMode={darkMode}
                  />

                  <DetailItem
                    label="Kateqoriya"
                    value={post.category}
                    darkMode={darkMode}
                  />

                  <DetailItem
                    label="Marka"
                    value={clothingData.brand}
                    darkMode={darkMode}
                  />

                  <DetailItem
                    label="Model"
                    value={clothingData.model}
                    darkMode={darkMode}
                  />

                  <DetailItem
                    label="Rəng"
                    value={clothingData.color}
                    darkMode={darkMode}
                  />

                  <DetailItem
                    label="Ölçü"
                    value={clothingData.size}
                    darkMode={darkMode}
                  />

                  <DetailItem
                    label="Vəziyyəti"
                    value={clothingData.condition}
                    darkMode={darkMode}
                  />
                </div>
              </div>

              {/* DESCRIPTION */}

              {clothingData.description && (
                <div className="mt-8">
                  <h2 className="mb-3 text-xl font-black">Qeyd</h2>

                  <div
                    className={`rounded-2xl border p-5 leading-7 ${
                      darkMode
                        ? "border-gray-800 bg-[#111827] text-gray-300"
                        : "border-gray-100 bg-gray-50 text-gray-700"
                    }`}
                  >
                    {clothingData.description}
                  </div>
                </div>
              )}

              {/* AD META */}

              <div
                className={`mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t pt-5 text-sm ${
                  darkMode
                    ? "border-gray-800 text-gray-400"
                    : "border-gray-100 text-gray-500"
                }`}
              >
                <span>
                  Elanın nömrəsi:{" "}
                  <strong
                    className={darkMode ? "text-gray-200" : "text-gray-800"}
                  >
                    {post.id || post._id}
                  </strong>
                </span>

                <span className="flex items-center gap-1.5">
                  <MapPin size={15} />
                  {post.location || "Məlum deyil"}
                </span>
              </div>
            </div>

            {/* =================================================
                SAĞ ƏLAQƏ
            ================================================= */}

            <div
              className={`border-t p-4 sm:p-6 lg:border-l lg:border-t-0 lg:p-7 ${
                darkMode
                  ? "border-gray-800 bg-[#0a0e18]"
                  : "border-gray-100 bg-gray-50/70"
              }`}
            >
              <div
                className={`rounded-3xl border p-5 shadow-sm ${
                  darkMode
                    ? "border-gray-800 bg-[#111827]"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#670fff] to-violet-400 text-white shadow-lg shadow-[#670fff]/20">
                    <User size={23} />
                  </div>

                  <div>
                    <h2 className="font-black">Əlaqə məlumatı</h2>

                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Elan sahibi
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <ContactRow
                    icon={<User size={17} />}
                    label="Ad"
                    value={contactName}
                    darkMode={darkMode}
                  />

                  <ContactRow
                    icon={<MapPin size={17} />}
                    label="Şəhər"
                    value={post.location || "N/A"}
                    darkMode={darkMode}
                  />

                  <ContactRow
                    icon={<Phone size={17} />}
                    label="Telefon"
                    value={phone || "N/A"}
                    darkMode={darkMode}
                  />

                  <ContactRow
                    icon={<Mail size={17} />}
                    label="Email"
                    value={email || "N/A"}
                    darkMode={darkMode}
                  />
                </div>

                {/* ZƏNG */}

                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 py-3.5 font-black text-white shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5"
                  >
                    <Phone size={19} />
                    Zəng et
                  </a>
                )}

                {/* EMAIL */}

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border py-3.5 font-bold transition ${
                      darkMode
                        ? "border-gray-700 text-gray-200 hover:bg-gray-800"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Mail size={18} />
                    Email göndər
                  </a>
                )}
              </div>

              {/* TRUST */}

              <div
                className={`mt-4 flex gap-3 rounded-2xl border p-4 ${
                  darkMode
                    ? "border-gray-800 bg-[#111827]"
                    : "border-gray-100 bg-white"
                }`}
              >
                <ShieldCheck className="shrink-0 text-emerald-500" size={22} />

                <div>
                  <p className="text-sm font-black">Təhlükəsiz alış-veriş</p>

                  <p
                    className={`mt-1 text-xs leading-5 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Satıcı ilə əlaqə saxlamazdan əvvəl elan məlumatlarını
                    diqqətlə yoxlayın.
                  </p>
                </div>
              </div>

              {/* VIP / PREMIUM */}

              <div
                className={`mt-4 rounded-3xl border p-5 ${
                  darkMode
                    ? "border-gray-800 bg-[#111827]"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="mb-4">
                  <h3 className="font-black">Elanı önə çıxar</h3>

                  <p
                    className={`mt-1 text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Elanınızı daha görünən etmək üçün seçimlərdən istifadə edin.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={isUpgrading}
                    onClick={() => handleUpgrade(post._id, "vip")}
                    className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-blue-200 bg-blue-50 px-3 py-3 text-blue-600 transition hover:-translate-y-0.5 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
                  >
                    <Crown size={20} />
                    <span className="text-sm font-black">VIP et</span>
                  </button>

                  <button
                    type="button"
                    disabled={isUpgrading}
                    onClick={() => handleUpgrade(post._id, "premium")}
                    className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-violet-200 bg-violet-50 px-3 py-3 text-violet-600 transition hover:-translate-y-0.5 hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-400"
                  >
                    <Sparkles size={20} />
                    <span className="text-sm font-black">Premium</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            BƏNZƏR ELANLAR
        ===================================================== */}

        {similarClothing.length > 0 && (
          <section className="mt-12">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <p className="mb-1 text-sm font-bold text-[#670fff]">
                  Sizə uyğun
                </p>

                <h2 className="text-2xl font-black">Bənzər elanlar</h2>
              </div>

              <Link
                to="/Katalog/Geyimlər"
                className={`hidden items-center gap-1 text-sm font-bold sm:flex ${
                  darkMode ? "text-violet-400" : "text-[#670fff]"
                }`}
              >
                Hamısına bax
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
              {similarClothing.map((item) => {
                const itemId = item?._id || item?.id;

                const itemImage =
                  Array.isArray(item.images) && item.images.length > 0
                    ? getImageUrl(item.images[0])
                    : "/no-image.jpg";

                return (
                  <Link
                    key={itemId}
                    to={`/PostDetailClothing/${itemId}`}
                    className="group min-w-0"
                  >
                    <div
                      className={`overflow-hidden rounded-2xl border transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        darkMode
                          ? "border-gray-800 bg-[#0d111d] hover:border-gray-700"
                          : "border-gray-100 bg-white hover:border-violet-100"
                      }`}
                    >
                      <div className="relative h-40 overflow-hidden sm:h-48">
                        <img
                          src={itemImage}
                          alt={item.title || "Geyim elanı"}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = "/no-image.jpg";
                          }}
                        />

                        <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur">
                          <ExternalLink size={14} />
                        </div>
                      </div>

                      <div className="p-3 sm:p-4">
                        <div className="mb-1 text-lg font-black text-[#670fff]">
                          {item.price ?? "0"} ₼
                        </div>

                        <h3
                          className={`truncate text-sm font-black ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.title ||
                            [item?.clothing?.brand, item?.clothing?.model]
                              .filter(Boolean)
                              .join(" ") ||
                            "Geyim"}
                        </h3>

                        {item?.clothing?.brand && (
                          <p
                            className={`mt-1 truncate text-xs font-semibold ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {item.clothing.brand}
                          </p>
                        )}

                        <div
                          className={`mt-2 flex items-center gap-1 truncate text-xs ${
                            darkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          <MapPin size={12} />
                          {item.location || "Məlum deyil"}
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

      {/* =======================================================
          FULLSCREEN ZOOM
      ======================================================= */}

      {zoomIndex !== null && imageArray.length > 0 && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-3 backdrop-blur-sm sm:p-6"
          onClick={closeZoom}
        >
          {/* CLOSE */}

          <button
            type="button"
            onClick={closeZoom}
            className="absolute right-3 top-3 z-[100001] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-red-500 sm:right-6 sm:top-6"
            aria-label="Bağla"
          >
            <X size={24} />
          </button>

          {/* COUNTER */}

          <div className="absolute left-1/2 top-4 z-[100001] -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur sm:top-6">
            {zoomIndex + 1} / {imageArray.length}
          </div>

          {/* PREVIOUS */}

          {imageArray.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 z-[100001] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft size={30} />
            </button>
          )}

          {/* IMAGE */}

          <img
            src={imageArray[zoomIndex]}
            alt={`${title} ${zoomIndex + 1}`}
            className="max-h-[88vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              e.currentTarget.src = "/no-image.jpg";
            }}
          />

          {/* NEXT */}

          {imageArray.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 z-[100001] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-6"
            >
              <ChevronRight size={30} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ===========================================================
   DETAIL ITEM
=========================================================== */

function DetailItem({ label, value, darkMode }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        darkMode ? "border-gray-800 bg-[#111827]" : "border-gray-100 bg-gray-50"
      }`}
    >
      <div
        className={`mb-1 text-xs font-bold uppercase tracking-wide ${
          darkMode ? "text-gray-500" : "text-gray-400"
        }`}
      >
        {label}
      </div>

      <div
        className={`break-words text-sm font-bold ${
          darkMode ? "text-gray-200" : "text-gray-800"
        }`}
      >
        {value || "N/A"}
      </div>
    </div>
  );
}

/* ===========================================================
   CONTACT ROW
=========================================================== */

function ContactRow({ icon, label, value, darkMode }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl p-3 ${
        darkMode ? "bg-[#0d111d]" : "bg-gray-50"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          darkMode
            ? "bg-violet-500/10 text-violet-400"
            : "bg-violet-50 text-[#670fff]"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <div
          className={`text-[11px] font-bold uppercase ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {label}
        </div>

        <div
          className={`truncate text-sm font-bold ${
            darkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
