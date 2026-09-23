import React, { useEffect, useState, useCallback, useMemo } from "react";

import { useParams, Link, useSearchParams } from "react-router-dom";
import axios from "axios";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import {
  X,
  MapPin,
  Phone,
  MessageCircleMore,
  Percent,
  RefreshCcw,
  CarFront,
  Gauge,
  CalendarDays,
  Palette,
  Fuel,
  Settings2,
  Tag,
  Hash,
  Clock3,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Crown,
  Sparkles,
  ShieldCheck,
  User,
  Mail,
  MapPinned,
  ArrowLeft,
  Store,
} from "lucide-react";

import { Avatar } from "@mui/material";

import {
  getBrand,
  getModel,
  getTitle,
  getLocation,
} from "../../utils/postHelpers";

import { useTheme } from "../../components/Main/ThemeContext";
import BubbleBackground from "../../components/ui/BubbleBackground";
import BottomMenu from "../../components/MobileMenu";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

const getImageUrl = (image) => {
  if (!image) return "";

  if (typeof image !== "string") return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${BASE_URL}/uploads/${image.replace(/^\/+/, "")}`;
};

const formatPrice = (price) => {
  if (price === undefined || price === null || price === "") {
    return "0";
  }

  const number = Number(price);

  if (Number.isNaN(number)) {
    return String(price);
  }

  return new Intl.NumberFormat("az-AZ").format(number);
};

const formatDate = (dateString) => {
  if (!dateString) return "";

  const postDate = new Date(dateString);

  if (Number.isNaN(postDate.getTime())) return "";

  const now = new Date();

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const postDay = new Date(postDate);
  postDay.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - postDay.getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  if (diffTime === 0) return "bugün";
  if (diffTime === oneDay) return "dünən";

  return postDate.toLocaleDateString("az-AZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getCurrentTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("az-AZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DetailItem = ({ icon: Icon, label, value, darkMode }) => {
  if (value === undefined || value === null || String(value).trim() === "") {
    return null;
  }

  return (
    <div
      className={`group rounded-2xl border p-3 transition-all duration-300 hover:-translate-y-0.5 ${
        darkMode
          ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
          : "border-gray-100 bg-white shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            darkMode
              ? "bg-violet-500/15 text-violet-300"
              : "bg-violet-50 text-violet-600"
          }`}
        >
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p
            className={`text-[11px] font-medium uppercase tracking-wide ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {label}
          </p>

          <p
            className={`truncate text-sm font-semibold ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {String(value)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function PostDetailCar() {
  const { id } = useParams();
  const { darkMode } = useTheme();

  const [searchParams] = useSearchParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [cars, setCars] = useState([]);

  const [zoomIndex, setZoomIndex] = useState(null);
  const [showPhone, setShowPhone] = useState(false);

  const brand = post?.car?.brand || getBrand(post);
  const model = post?.car?.model || getModel(post);

  const title =
    getTitle(post) ||
    `${brand || ""} ${model || ""}`.trim() ||
    "Avtomobil elanı";

  const location = getLocation(post);

  const phone =
    post?.contact?.phone || post?.car?.contact?.phone || post?.phone || "";

  const contactName =
    post?.contact?.name ||
    post?.car?.contact?.name ||
    post?.user?.username ||
    "İstifadəçi";

  const contactEmail =
    post?.contact?.email ||
    post?.car?.contact?.email ||
    post?.user?.email ||
    "";

  const imageArray = useMemo(() => {
    if (Array.isArray(post?.images)) {
      return post.images.filter(Boolean);
    }

    if (post?.images) {
      return [post.images];
    }

    if (post?.mainImage) {
      return [post.mainImage];
    }

    return [];
  }, [post]);

  /*
   * URL-də brand/model varsa, onları da nəzərə alırıq.
   * Məsələn:
   * /Katalog/Nəqliyyat?brand=BMW&model=520
   */
  const queryBrand = searchParams.get("brand");
  const queryModel = searchParams.get("model");

  const similarBrand = queryBrand || brand;
  const similarModel = queryModel || model;

  // Bütün oxşar avtomobilləri yüklə
  useEffect(() => {
    let mounted = true;

    const loadCars = async () => {
      try {
        const params = {};

        if (similarBrand) {
          params.brand = similarBrand;
        }

        if (similarModel) {
          params.model = similarModel;
        }

        const res = await axios.get(`${BASE_URL}/api/car`, {
          params,
        });

        if (!mounted) return;

        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.cars)
            ? res.data.cars
            : [];

        setCars(data);
      } catch (error) {
        console.error("Oxşar avtomobillər yüklənmədi:", error);

        if (mounted) {
          setCars([]);
        }
      }
    };

    loadCars();

    return () => {
      mounted = false;
    };
  }, [similarBrand, similarModel]);

  // Elanı ID ilə yüklə
  useEffect(() => {
    let mounted = true;

    const loadPost = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const res = await axios.get(`${BASE_URL}/api/car/${id}`);

        if (!mounted) return;

        setPost(res.data);
      } catch (error) {
        console.error("Elan yüklənmədi:", error);

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
      loadPost();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  // Zoom üçün əvvəlki şəkil
  const prevImage = useCallback(() => {
    if (!imageArray.length) return;

    setZoomIndex((prev) => {
      if (prev === null) return 0;

      return prev === 0 ? imageArray.length - 1 : prev - 1;
    });
  }, [imageArray.length]);

  // Zoom üçün növbəti şəkil
  const nextImage = useCallback(() => {
    if (!imageArray.length) return;

    setZoomIndex((prev) => {
      if (prev === null) return 0;

      return prev === imageArray.length - 1 ? 0 : prev + 1;
    });
  }, [imageArray.length]);

  // Klaviatura ilə şəkil dəyişmək
  useEffect(() => {
    if (zoomIndex === null) return;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        nextImage();
      }

      if (event.key === "ArrowLeft") {
        prevImage();
      }

      if (event.key === "Escape") {
        setZoomIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [zoomIndex, nextImage, prevImage]);

  // Zoom açıq olanda səhifənin scroll-u bağlanır
  useEffect(() => {
    if (zoomIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [zoomIndex]);

  const openZoom = (index) => {
    setZoomIndex(index);
  };

  // VIP / Premium
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

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Ödəniş səhvi:", error.response?.data || error.message);
    }
  };

  const showPhoneNumber = () => {
    if (!phone) return;

    setShowPhone(true);

    setTimeout(() => {
      setShowPhone(false);
    }, 10000);
  };

  const whatsappPhone = phone ? String(phone).replace(/[^\d]/g, "") : "";

  const whatsappUrl = whatsappPhone ? `https://wa.me/${whatsappPhone}` : "#";

  // Loading
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-[#080812]" : "bg-gray-50"
        }`}
      >
        <div className="w-full max-w-md px-6">
          <div
            className={`mb-4 h-2 overflow-hidden rounded-full ${
              darkMode ? "bg-white/10" : "bg-gray-200"
            }`}
          >
            <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-emerald-400" />
          </div>

          <div
            className={`text-center text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Elan yüklənir...
          </div>
        </div>
      </div>
    );
  }

  // 404
  if (notFound || !post) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center px-6 ${
          darkMode
            ? "bg-[#080812] text-white"
            : "bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 text-gray-900"
        }`}
      >
        <div className="relative text-center">
          <div className="absolute -inset-10 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">
              ProElan
            </p>

            <h1 className="text-8xl font-black tracking-tight sm:text-9xl">
              404
            </h1>

            <p
              className={`mt-3 text-lg ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Elan tapılmadı
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5"
            >
              <ArrowLeft size={18} />
              Əsas səhifəyə qayıt
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const car = post?.car || {};

  return (
    <div
      className={`relative min-h-screen pb-24 ${
        darkMode ? "bg-[#080812] text-gray-100" : "bg-[#f7f7fb] text-gray-900"
      }`}
    >
      <BubbleBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-5 lg:px-6">
        {/* Geri düyməsi */}
        <div className="pt-20 sm:pt-24">
          <Link
            to="/Katalog/Nəqliyyat"
            className={`group inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
              darkMode
                ? "border-white/10 bg-white/[0.05] text-gray-200 hover:bg-white/[0.09]"
                : "border-gray-200 bg-white text-gray-700 shadow-sm hover:border-violet-200 hover:text-violet-600"
            }`}
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Geri
          </Link>
        </div>

        {/* Breadcrumb */}
        <div className="mt-4 mb-5 overflow-x-auto">
          <div
            className={`flex min-w-max items-center gap-2 text-sm ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            <Link to="/" className="transition hover:text-violet-500">
              Ana səhifə
            </Link>

            <span>/</span>

            <Link
              to="/Katalog/Nəqliyyat"
              className="transition hover:text-violet-500"
            >
              Nəqliyyat
            </Link>

            {brand && (
              <>
                <span>/</span>

                <Link
                  to={`/Katalog/Nəqliyyat?brand=${encodeURIComponent(brand)}`}
                  className="transition hover:text-violet-500"
                >
                  {brand}
                </Link>
              </>
            )}

            {model && (
              <>
                <span>/</span>

                <Link
                  to={`/Katalog/Nəqliyyat?brand=${encodeURIComponent(
                    brand || "",
                  )}&model=${encodeURIComponent(model)}`}
                  className="transition hover:text-violet-500"
                >
                  {model}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Başlıq */}
        <div className="mb-5">
          <div className="flex flex-wrap items-center gap-2">
            {post.priorityType === "premium" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-violet-500/20">
                <Crown size={13} />
                PREMIUM
              </span>
            )}

            {post.priorityType === "vip" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-orange-500/20">
                <Sparkles size={13} />
                VIP
              </span>
            )}

            {car.category && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  darkMode
                    ? "bg-white/10 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {car.category}
              </span>
            )}
          </div>

          <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
            {title}
          </h1>

          <div
            className={`mt-3 flex flex-wrap items-center gap-4 text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={16} />
                {location}
              </span>
            )}

            {post.createdAt && (
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={16} />
                {formatDate(post.createdAt)} {getCurrentTime(post.createdAt)}
              </span>
            )}
          </div>
        </div>

        {/* Əsas grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* SOL TƏRƏF */}
          <div className="space-y-5">
            {/* Gallery */}
            <div
              className={`overflow-hidden rounded-3xl border ${
                darkMode
                  ? "border-white/10 bg-white/[0.035]"
                  : "border-gray-200 bg-white shadow-sm"
              }`}
            >
              {imageArray.length > 0 ? (
                <Carousel
                  showThumbs={false}
                  showStatus={false}
                  showIndicators={imageArray.length > 1}
                  infiniteLoop={imageArray.length > 1}
                  autoPlay={imageArray.length > 1}
                  interval={5000}
                  swipeable
                  emulateTouch
                  className="car-detail-carousel"
                >
                  {imageArray.map((img, index) => {
                    const imageSrc = getImageUrl(img);

                    return (
                      <div
                        key={`${img}-${index}`}
                        className="relative h-[300px] cursor-zoom-in overflow-hidden sm:h-[430px] lg:h-[500px]"
                        onClick={() => openZoom(index)}
                      >
                        {/* Blur background */}
                        <div
                          className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl"
                          style={{
                            backgroundImage: `url("${imageSrc}")`,
                          }}
                        />

                        <div className="absolute inset-0 bg-black/25" />

                        <img
                          src={imageSrc}
                          alt={`${brand || "Avtomobil"} ${index + 1}`}
                          className="relative z-10 h-full w-full object-contain"
                        />

                        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 text-xs font-medium text-white backdrop-blur">
                          <ZoomIn size={14} />
                          Böyüt
                        </div>
                      </div>
                    );
                  })}
                </Carousel>
              ) : (
                <div
                  className={`flex h-[300px] items-center justify-center sm:h-[500px] ${
                    darkMode ? "bg-white/[0.03]" : "bg-gray-100"
                  }`}
                >
                  <div className="text-center">
                    <CarFront size={52} className="mx-auto mb-3 opacity-30" />

                    <p className="text-sm opacity-50">Şəkil yoxdur</p>
                  </div>
                </div>
              )}
            </div>

            {/* Qiymət + əsas məlumat */}
            <div
              className={`rounded-3xl border p-4 sm:p-6 ${
                darkMode
                  ? "border-white/10 bg-white/[0.035]"
                  : "border-gray-200 bg-white shadow-sm"
              }`}
            >
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p
                    className={`mb-1 text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Satış qiyməti
                  </p>

                  <div className="text-3xl font-black tracking-tight sm:text-4xl">
                    {formatPrice(post.price)}
                    <span className="ml-2 text-lg font-bold text-violet-500">
                      AZN
                    </span>
                  </div>
                </div>

                {post.id && (
                  <div
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs ${
                      darkMode
                        ? "bg-white/5 text-gray-400"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    <Hash size={14} />
                    {post.id}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                <DetailItem
                  icon={Tag}
                  label="Marka"
                  value={brand}
                  darkMode={darkMode}
                />

                <DetailItem
                  icon={CarFront}
                  label="Model"
                  value={model}
                  darkMode={darkMode}
                />

                <DetailItem
                  icon={CalendarDays}
                  label="İl"
                  value={car.year}
                  darkMode={darkMode}
                />

                <DetailItem
                  icon={Gauge}
                  label="Yürüş"
                  value={car.km ? `${car.km} km` : ""}
                  darkMode={darkMode}
                />

                <DetailItem
                  icon={CarFront}
                  label="Ban tipi"
                  value={car.ban_type}
                  darkMode={darkMode}
                />

                <DetailItem
                  icon={Gauge}
                  label="Mühərrik"
                  value={car.motor}
                  darkMode={darkMode}
                />

                <DetailItem
                  icon={Settings2}
                  label="Sürətlər qutusu"
                  value={car.transmission}
                  darkMode={darkMode}
                />

                <DetailItem
                  icon={Fuel}
                  label="Yanacaq"
                  value={car.engine}
                  darkMode={darkMode}
                />

                <DetailItem
                  icon={Palette}
                  label="Rəng"
                  value={car.color}
                  darkMode={darkMode}
                />

                <DetailItem
                  icon={Sparkles}
                  label="Nəsil"
                  value={car.generation}
                  darkMode={darkMode}
                />

                <DetailItem
                  icon={Settings2}
                  label="Modifikasiya"
                  value={car.modification}
                  darkMode={darkMode}
                />

                <DetailItem
                  icon={MapPinned}
                  label="Şəhər"
                  value={location}
                  darkMode={darkMode}
                />
              </div>
            </div>

            {/* Təsvir */}
            <div
              className={`rounded-3xl border p-5 sm:p-6 ${
                darkMode
                  ? "border-white/10 bg-white/[0.035]"
                  : "border-gray-200 bg-white shadow-sm"
              }`}
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    darkMode
                      ? "bg-violet-500/15 text-violet-300"
                      : "bg-violet-50 text-violet-600"
                  }`}
                >
                  <CarFront size={20} />
                </div>

                <div>
                  <h2 className="font-bold">Elan haqqında</h2>

                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Satıcı tərəfindən əlavə olunan məlumat
                  </p>
                </div>
              </div>

              <div
                className={`border-t pt-4 text-sm leading-7 ${
                  darkMode
                    ? "border-white/10 text-gray-300"
                    : "border-gray-100 text-gray-600"
                }`}
              >
                {post.description ? (
                  <p className="whitespace-pre-line">{post.description}</p>
                ) : (
                  <p className="text-gray-400">
                    Bu elan üçün əlavə qeyd yoxdur.
                  </p>
                )}
              </div>
            </div>

            {/* Barter / Kredit */}
            {(car.credit || car.barter) && (
              <div
                className={`rounded-3xl border p-5 ${
                  darkMode
                    ? "border-white/10 bg-white/[0.035]"
                    : "border-gray-200 bg-white shadow-sm"
                }`}
              >
                <h3 className="mb-4 font-bold">Əlavə imkanlar</h3>

                <div className="flex flex-wrap gap-3">
                  {car.credit && (
                    <div
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                        darkMode
                          ? "border-orange-400/20 bg-orange-400/10"
                          : "border-orange-100 bg-orange-50"
                      }`}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white">
                        <Percent size={17} />
                      </span>

                      <div>
                        <p className="text-xs text-gray-400">Ödəniş</p>

                        <p className="font-bold">Kredit</p>
                      </div>
                    </div>
                  )}

                  {car.barter && (
                    <div
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                        darkMode
                          ? "border-emerald-400/20 bg-emerald-400/10"
                          : "border-emerald-100 bg-emerald-50"
                      }`}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <RefreshCcw size={17} />
                      </span>

                      <div>
                        <p className="text-xs text-gray-400">Mübadilə</p>

                        <p className="font-bold">Barter</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SAĞ TƏRƏF */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div
              className={`overflow-hidden rounded-3xl border ${
                darkMode
                  ? "border-white/10 bg-[#11111d]/95"
                  : "border-gray-200 bg-white shadow-lg shadow-gray-200/50"
              }`}
            >
              {/* Qiymət header */}
              <div className="border-b border-black/5 p-5 dark:border-white/10">
                <p
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Elanın qiyməti
                </p>

                <div className="mt-1 text-3xl font-black">
                  {formatPrice(post.price)}
                  <span className="ml-2 text-base text-violet-500">AZN</span>
                </div>
              </div>

              {/* Satıcı */}
              <div className="p-5">
                <h2 className="mb-4 text-lg font-bold">Əlaqə məlumatı</h2>

                <div className="mb-5 flex items-center gap-3">
                  <Avatar
                    alt={contactName}
                    src={post?.contact?.avatar || post?.user?.avatar || ""}
                    sx={{
                      width: 52,
                      height: 52,
                    }}
                    className="border-2 border-violet-500/30"
                  >
                    {contactName?.charAt(0)?.toUpperCase()}
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate font-bold">{contactName}</p>

                    <p
                      className={`flex items-center gap-1 text-xs ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      <MapPin size={12} />
                      {location || "Azərbaycan"}
                    </p>
                  </div>
                </div>

                {/* Telefon */}
                <button
                  type="button"
                  onClick={showPhoneNumber}
                  className="mb-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-emerald-500/30"
                >
                  <Phone size={18} />

                  {showPhone ? phone || "Nömrə yoxdur" : "Nömrəni göstər"}
                </button>

                {/* WhatsApp */}
                <a
                  href={whatsappPhone ? whatsappUrl : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl border font-bold transition ${
                    whatsappPhone
                      ? darkMode
                        ? "border-blue-400/20 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                        : "border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100"
                      : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                  }`}
                  onClick={(event) => {
                    if (!whatsappPhone) {
                      event.preventDefault();
                    }
                  }}
                >
                  <MessageCircleMore size={19} />
                  Mesaj göndər
                </a>

                {contactEmail && (
                  <div
                    className={`mt-4 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm ${
                      darkMode
                        ? "bg-white/5 text-gray-400"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    <Mail size={16} />
                    <span className="truncate">{contactEmail}</span>
                  </div>
                )}
{/* ---magaza buttonu */}
                {post.businessId?.slug && (
                  <Link
                    to={`/biznes/${post.businessId.slug}`}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 font-black transition-all hover:-translate-y-0.5 ${
                      darkMode
                        ? "border-[#670fff]/30 bg-[#670fff]/10 text-white hover:bg-[#670fff]/20"
                        : "border-[#670fff]/20 bg-[#670fff]/5 text-[#670fff] hover:bg-[#670fff]/10"
                    }`}
                  >
                    <Store size={19} />
                    Mağazaya keçid et
                  </Link>
                )}
              </div>

              {/* Elan məlumatları */}
              <div
                className={`border-t p-5 ${
                  darkMode ? "border-white/10" : "border-gray-100"
                }`}
              >
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <span
                      className={darkMode ? "text-gray-500" : "text-gray-400"}
                    >
                      Elanın nömrəsi
                    </span>

                    <span className="truncate font-semibold">
                      {post.id || post._id || "—"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span
                      className={darkMode ? "text-gray-500" : "text-gray-400"}
                    >
                      Tarix
                    </span>

                    <span className="font-semibold">
                      {formatDate(post.createdAt || post.data)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span
                      className={darkMode ? "text-gray-500" : "text-gray-400"}
                    >
                      Saat
                    </span>

                    <span className="font-semibold">
                      {getCurrentTime(post.createdAt || post.data)}
                    </span>
                  </div>
                </div>
              </div>

              {/* VIP / Premium */}
              <div
                className={`border-t p-5 ${
                  darkMode ? "border-white/10" : "border-gray-100"
                }`}
              >
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-violet-500" />

                  <h3 className="font-bold">Elanı önə çıxar</h3>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpgrade(post._id || post.id, "vip")}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition ${
                      darkMode
                        ? "border-blue-400/20 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                        : "border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    VIP et
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleUpgrade(post._id || post.id, "premium")
                    }
                    className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition ${
                      darkMode
                        ? "border-violet-400/20 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20"
                        : "border-violet-100 bg-violet-50 text-violet-600 hover:bg-violet-100"
                    }`}
                  >
                    Premium et
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Bənzər elanlar */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-violet-500">
                Sizə uyğun
              </p>

              <h2 className="text-2xl font-black sm:text-3xl">
                Bənzər elanlar
              </h2>
            </div>

            <Link
              to="/Katalog/Nəqliyyat"
              className={`hidden text-sm font-semibold sm:block ${
                darkMode ? "text-violet-300" : "text-violet-600"
              }`}
            >
              Hamısına bax →
            </Link>
          </div>

          {cars.filter(
            (car) => String(car._id || car.id) !== String(post._id || post.id),
          ).length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {cars
                .filter(
                  (car) =>
                    String(car._id || car.id) !== String(post._id || post.id),
                )
                .slice(0, 8)
                .map((car) => {
                  const carId = car._id || car.id;

                  const carData = car.car || {};

                  const carImage =
                    car.mainImage || car.images?.[0] || carData.mainImage || "";

                  const carBrand = carData.brand || car.brand || "";

                  const carModel = carData.model || car.model || "";

                  const carYear = carData.year || car.year || "";

                  const carKm = carData.km || car.km || "";

                  return (
                    <Link
                      key={carId}
                      to={`/PostDetailCar/${carId}`}
                      className="group block"
                    >
                      <article
                        className={`overflow-hidden rounded-2xl border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl ${
                          darkMode
                            ? "border-white/10 bg-white/[0.04] hover:border-violet-500/30"
                            : "border-gray-200 bg-white shadow-sm hover:border-violet-200"
                        }`}
                      >
                        <div className="relative h-[125px] overflow-hidden sm:h-[155px]">
                          {carImage ? (
                            <img
                              src={getImageUrl(carImage)}
                              alt={`${carBrand} ${carModel}`}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div
                              className={`flex h-full items-center justify-center ${
                                darkMode ? "bg-white/5" : "bg-gray-100"
                              }`}
                            >
                              <CarFront size={38} className="opacity-30" />
                            </div>
                          )}

                          {car.priorityType === "premium" && (
                            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-violet-600 px-2 py-1 text-[9px] font-bold text-white">
                              <Crown size={10} />
                              PREMIUM
                            </span>
                          )}

                          {car.priorityType === "vip" && (
                            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-orange-500 px-2 py-1 text-[9px] font-bold text-white">
                              <Sparkles size={10} />
                              VIP
                            </span>
                          )}
                        </div>

                        <div className="p-3">
                          <p className="truncate text-base font-black sm:text-lg">
                            {formatPrice(car.price)}{" "}
                            <span className="text-xs font-bold text-violet-500">
                              AZN
                            </span>
                          </p>

                          <h3
                            className={`mt-1 truncate text-sm font-bold ${
                              darkMode ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {carBrand} {carModel}
                          </h3>

                          <p
                            className={`mt-1 truncate text-xs ${
                              darkMode ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            {carYear ? `${carYear} il` : ""}
                            {carKm ? ` • ${carKm} km` : ""}
                          </p>

                          <div
                            className={`mt-3 flex items-center justify-between gap-2 text-[10px] ${
                              darkMode ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            <span className="flex min-w-0 items-center gap-1 truncate">
                              <MapPin
                                size={12}
                                className="shrink-0 text-emerald-500"
                              />
                              {car.location || "Azərbaycan"}
                            </span>

                            <span className="shrink-0">
                              {formatDate(car.createdAt || car.data)}
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
            </div>
          ) : (
            <div
              className={`rounded-3xl border py-12 text-center ${
                darkMode
                  ? "border-white/10 bg-white/[0.03] text-gray-500"
                  : "border-gray-200 bg-white text-gray-400"
              }`}
            >
              <CarFront size={42} className="mx-auto mb-3 opacity-30" />

              <p>Hazırda oxşar elan tapılmadı.</p>
            </div>
          )}
        </section>
      </div>

      {/* Mobil əlaqə paneli */}
      <div className="fixed bottom-0 left-0 right-0 z-[90] border-t border-black/10 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0c0c16]/95 lg:hidden">
        <div className="mx-auto flex max-w-lg gap-2">
          <button
            type="button"
            onClick={() => {
              if (!showPhone) {
                showPhoneNumber();
              } else if (phone) {
                window.location.href = `tel:${phone}`;
              }
            }}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-sm font-bold text-white"
          >
            <Phone size={17} />

            {showPhone ? phone || "Nömrə yoxdur" : "Nömrəni göstər"}
          </button>

          <a
            href={whatsappPhone ? whatsappUrl : undefined}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              if (!whatsappPhone) {
                event.preventDefault();
              }
            }}
            className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold ${
              whatsappPhone
                ? "bg-blue-500 text-white"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            <MessageCircleMore size={17} />
            WhatsApp
          </a>
        </div>
      </div>

      {/* Zoom modal */}
      {zoomIndex !== null && imageArray[zoomIndex] && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-3 backdrop-blur-sm"
          onClick={() => setZoomIndex(null)}
        >
          {/* Header */}
          <div
            className="absolute left-0 right-0 top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-black/30 px-3 backdrop-blur-md sm:px-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="min-w-0">
              <p className="max-w-[230px] truncate text-sm font-bold text-white sm:max-w-md">
                {brand} {model}
              </p>

              <p className="text-xs text-gray-400">
                {zoomIndex + 1} / {imageArray.length}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="hidden h-10 items-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-bold text-white md:flex"
                >
                  <Phone size={16} />
                  Zəng et
                </a>
              )}

              <button
                type="button"
                onClick={() => setZoomIndex(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition hover:bg-white/10"
              >
                <X size={23} />
              </button>
            </div>
          </div>

          {/* Previous */}
          {imageArray.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:left-5"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Image */}
          <img
            src={getImageUrl(imageArray[zoomIndex])}
            alt={`${brand} ${model}`}
            className="max-h-[78vh] max-w-[92vw] select-none object-contain rounded-xl sm:max-h-[82vh] sm:max-w-[85vw]"
            onClick={(event) => event.stopPropagation()}
          />

          {/* Next */}
          {imageArray.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-5"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-24 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
            {zoomIndex + 1} / {imageArray.length}
          </div>

          {/* Thumbnails */}
          {imageArray.length > 1 && (
            <div
              className="absolute bottom-3 left-0 right-0 z-30 flex justify-center gap-2 overflow-x-auto px-3 pb-1"
              onClick={(event) => event.stopPropagation()}
            >
              {imageArray.map((img, index) => (
                <button
                  type="button"
                  key={`${img}-${index}`}
                  onClick={() => setZoomIndex(index)}
                  className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-16 sm:w-16 ${
                    zoomIndex === index
                      ? "border-violet-500"
                      : "border-white/20 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`Şəkil ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <BottomMenu />
    </div>
  );
}
