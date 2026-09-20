import React, { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import {
  X,
  ArrowLeft,
  MapPin,
  CalendarDays,
  Clock3,
  Trash2,
  Phone,
  Mail,
  User,
  Tag,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  ShieldCheck,
  Sparkles,
  Hash,
  CarFront,
  Fuel,
  Gauge,
  Settings2,
  FileText,
  AlertCircle,
} from "lucide-react";

import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

import { useTheme } from "../../components/Main/ThemeContext";
import BubbleBackground from "../../components/ui/BubbleBackground";
import BottomMenu from "../../components/MobileMenu";

export default function AdDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [allAds, setAllAds] = useState([]);
  const [zoomIndex, setZoomIndex] = useState(null);

  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);

  const progressRef = useRef(null);

  const currentUserId = localStorage.getItem("userId");
  const API_URL = process.env.REACT_APP_API_URL;

  // =========================================================
  // Progress bar
  // =========================================================
  useEffect(() => {
    progressRef.current = () => {
      setProgress((prev) => {
        if (prev >= 100) {
          setBuffer(10);
          return 0;
        }

        return prev + 1;
      });

      setBuffer((prev) =>
        prev < 100 ? Math.min(100, prev + 1 + Math.random() * 10) : 100,
      );
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current?.();
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // =========================================================
  // Frontend category → Backend model
  // =========================================================
  const modelMap = {
    Avtomobil: "cars",
    Telefon: "phone",
    Geyim: "clothing",
    "Ev və Mebel": "household",
    Elektronika: "electronika",
    Aksesuar: "accessories",
    "Home & Garden": "homeGarden",
    "Köhnə daşınmaz əmlak": "realEstate",
  };

  // =========================================================
  // Image helper
  // =========================================================
  const getImageUrl = (img) => {
    if (!img) return "";

    if (
      typeof img === "string" &&
      (img.startsWith("http://") || img.startsWith("https://"))
    ) {
      return img;
    }

    return `${API_URL}/uploads/${img}`;
  };

  // =========================================================
  // Date helpers
  // =========================================================
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const postDate = new Date(dateString);
    const now = new Date();

    const postDay = new Date(postDate);
    const currentDay = new Date(now);

    postDay.setHours(0, 0, 0, 0);
    currentDay.setHours(0, 0, 0, 0);

    const diffTime = currentDay - postDay;
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

    return new Date(isoString).toLocaleTimeString("az-AZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // Fetch all ads
  // =========================================================
  useEffect(() => {
    const fetchAllAds = async () => {
      try {
        const token = localStorage.getItem("token");

        const models = [
          "cars",
          "phone",
          "clothing",
          "household",
          "electronika",
          "accessories",
          "homeGarden",
          "realEstate",
        ];

        const requests = models.map((model) =>
          axios
            .get(`${API_URL}/api/${model}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => (Array.isArray(res.data) ? res.data : []))
            .catch(() => []),
        );

        const results = await Promise.all(requests);

        let allAdsData = results.flat();

        allAdsData = allAdsData.filter(
          (a) => a.userId === currentUserId && a._id !== id,
        );

        setAllAds(allAdsData);
      } catch (err) {
        console.error("Bənzər elanlar yüklənmədi:", err);
      }
    };

    fetchAllAds();
  }, [id, API_URL, currentUserId]);

  // =========================================================
  // Fetch single ad
  // =========================================================
  useEffect(() => {
    const fetchAd = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const token = localStorage.getItem("token");

        // Əvvəl bütün modelləri yoxlayırıq.
        const models = [
          "cars",
          "phone",
          "clothing",
          "household",
          "electronika",
          "accessories",
          "homeGarden",
          "realEstate",
        ];

        let selectedAd = null;

        for (const model of models) {
          try {
            const res = await axios.get(`${API_URL}/api/${model}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (Array.isArray(res.data)) {
              const found = res.data.find((item) => item._id === id);

              if (found) {
                selectedAd = found;
                break;
              }
            }
          } catch {
            // Model mövcud deyilsə digər model yoxlanılır.
          }
        }

        if (!selectedAd) {
          setNotFound(true);
        } else {
          setAd(selectedAd);
        }
      } catch (err) {
        console.error("Elan yüklənmədi:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id, API_URL]);

  // =========================================================
  // Delete
  // =========================================================
  const handleDelete = async (adItem) => {
    if (!window.confirm("Bu elanı silmək istədiyinizdən əminsiniz?")) {
      return;
    }

    const token = localStorage.getItem("token");
    const modelName = modelMap[adItem.category];

    if (!modelName) {
      alert(
        `Model müəyyən edilmədi (${adItem.category}), silmək mümkün deyil.`,
      );
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/${modelName}/${adItem._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Elan uğurla silindi!");

      navigate("/profile");
    } catch (err) {
      console.error("Elan silinmədi:", err.response?.data || err);

      alert("Elan silinərkən xəta baş verdi!");
    }
  };

  // =========================================================
  // Loading
  // =========================================================
  if (loading) {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}
      >
        <Box
          sx={{
            width: "100%",
            position: "fixed",
            top: 64,
            left: 0,
            zIndex: 9999,
          }}
        >
          <LinearProgress
            variant="buffer"
            value={progress}
            valueBuffer={buffer}
          />
        </Box>

        <div className="min-h-screen flex flex-col items-center justify-center px-5">
          <div
            className={`w-full max-w-md rounded-3xl border p-8 text-center shadow-xl ${
              darkMode
                ? "bg-slate-900/80 border-slate-800"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#670fff] to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="text-white" size={28} />
            </div>

            <h2
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Elan yüklənir...
            </h2>

            <p
              className={`mt-2 text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Elanın məlumatları hazırlanır.
            </p>

            <div className="mt-6 h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-[#670fff] to-violet-400 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <BottomMenu />
      </div>
    );
  }

  // =========================================================
  // 404
  // =========================================================
  if (notFound || !ad) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center px-5 ${
          darkMode
            ? "bg-slate-950 text-white"
            : "bg-gradient-to-br from-violet-50 via-white to-purple-100"
        }`}
      >
        <BubbleBackground />

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-[#670fff] to-violet-500 flex items-center justify-center shadow-xl shadow-purple-500/20">
            <AlertCircle className="text-white" size={38} />
          </div>

          <h1
            className={`text-7xl sm:text-9xl font-black tracking-tight ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            404
          </h1>

          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold shadow-lg">
            <AlertCircle size={16} />
            Elan tapılmadı
          </div>

          <p
            className={`max-w-md mx-auto mt-5 text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Axtardığınız elan silinmiş və ya artıq mövcud deyil.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-7 px-6 py-3 rounded-xl bg-[#670fff] hover:bg-[#5700e8] text-white font-semibold shadow-lg shadow-purple-500/20 transition-all hover:-translate-y-0.5"
          >
            <ArrowLeft size={18} />
            Əsas səhifəyə qayıt
          </Link>
        </div>

        <BottomMenu />
      </div>
    );
  }

  // =========================================================
  // Images
  // =========================================================
  const imageArray = Array.isArray(ad.images)
    ? ad.images
    : ad.images
      ? [ad.images]
      : [];

  const openZoom = (index) => setZoomIndex(index);
  const closeZoom = () => setZoomIndex(null);

  const prevImage = () => {
    setZoomIndex((prev) => (prev === 0 ? imageArray.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setZoomIndex((prev) => (prev === imageArray.length - 1 ? 0 : prev + 1));
  };

  const titleParts = [ad.category, ad.brand, ad.model].filter(Boolean);

  const adTitle = ad.title || titleParts.join(" ") || "Elan";

  // =========================================================
  // Info item
  // =========================================================
  const InfoItem = ({ icon, label, value }) => {
    if (!value && value !== 0) return null;

    return (
      <div
        className={`flex items-center gap-3 p-3 rounded-xl border ${
          darkMode
            ? "bg-slate-800/60 border-slate-700"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            darkMode
              ? "bg-[#670fff]/20 text-violet-300"
              : "bg-violet-100 text-[#670fff]"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p
            className={`text-xs ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {label}
          </p>

          <p
            className={`text-sm font-semibold truncate ${
              darkMode ? "text-slate-100" : "text-slate-800"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden ${
        darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      <BubbleBackground />

      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 pt-24 pb-28 sm:pb-12">
        {/* =====================================================
            Back button
        ===================================================== */}
        <div className="mb-5">
          <Link
            to="/profile"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all hover:-translate-y-0.5 ${
              darkMode
                ? "bg-slate-900/80 border-slate-700 text-slate-200 hover:bg-slate-800"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm"
            }`}
          >
            <ArrowLeft size={18} />
            Geri
          </Link>
        </div>

        {/* =====================================================
            Main card
        ===================================================== */}
        <div
          className={`rounded-3xl border overflow-hidden shadow-xl ${
            darkMode
              ? "bg-slate-900/80 border-slate-800"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* =================================================
                LEFT / IMAGES
            ================================================= */}
            <div className="lg:col-span-2 p-4 sm:p-6">
              {/* Title */}
              <div className="mb-5">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {ad.category && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#670fff]/10 text-[#670fff] text-xs font-bold">
                      <Tag size={14} />
                      {ad.category}
                    </span>
                  )}

                  {ad.priorityType && ad.priorityType !== "free" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold shadow-sm">
                      <Sparkles size={14} />
                      {ad.priorityType === "premium" ? "PREMIUM" : "VIP"}
                    </span>
                  )}
                </div>

                <h1
                  className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight break-words ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {adTitle}
                </h1>

                {ad.location && (
                  <div
                    className={`flex items-center gap-1.5 mt-3 text-sm ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    <MapPin size={16} className="text-[#670fff]" />
                    {ad.location}
                  </div>
                )}
              </div>

              {/* Carousel */}
              <div
                className={`rounded-2xl overflow-hidden border ${
                  darkMode
                    ? "border-slate-700 bg-slate-950"
                    : "border-slate-200 bg-slate-100"
                }`}
              >
                {imageArray.length > 0 ? (
                  <Carousel
                    showThumbs={imageArray.length > 1}
                    showStatus={false}
                    showIndicators={imageArray.length > 1}
                    autoPlay={imageArray.length > 1}
                    infiniteLoop={imageArray.length > 1}
                    swipeable
                    emulateTouch
                    interval={4500}
                  >
                    {imageArray.map((img, index) => (
                      <div
                        key={index}
                        className="h-[280px] sm:h-[420px] lg:h-[500px] cursor-zoom-in bg-slate-100 dark:bg-slate-950"
                        onClick={() => openZoom(index)}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`${adTitle} - şəkil ${index + 1}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <div className="h-[280px] sm:h-[420px] flex flex-col items-center justify-center text-slate-400">
                    <ImageOff size={50} strokeWidth={1.5} />
                    <p className="mt-3 text-sm">Şəkil yoxdur</p>
                  </div>
                )}
              </div>

              {/* Price */}
              <div
                className={`mt-5 p-5 rounded-2xl border ${
                  darkMode
                    ? "bg-slate-800/70 border-slate-700"
                    : "bg-gradient-to-r from-violet-50 to-purple-50 border-violet-100"
                }`}
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Elanın qiyməti
                </p>

                <div className="flex items-end gap-2 mt-1">
                  <span
                    className={`text-3xl sm:text-4xl font-black ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {ad.price}
                  </span>

                  <span className="text-lg font-bold text-[#670fff] mb-1">
                    AZN
                  </span>
                </div>
              </div>

              {/* =================================================
                  Details
              ================================================= */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-[#670fff]/10 text-[#670fff] flex items-center justify-center">
                    <CarFront size={19} />
                  </div>

                  <h2
                    className={`text-xl font-bold ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Elan məlumatları
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoItem
                    icon={<CarFront size={17} />}
                    label="Ban"
                    value={ad.ban_type}
                  />

                  <InfoItem
                    icon={<CalendarDays size={17} />}
                    label="İl"
                    value={ad.year}
                  />

                  <InfoItem
                    icon={<Gauge size={17} />}
                    label="Yürüş"
                    value={ad.km ? `${ad.km} km` : null}
                  />

                  <InfoItem
                    icon={<Settings2 size={17} />}
                    label="Motor"
                    value={ad.motor}
                  />

                  <InfoItem
                    icon={<Fuel size={17} />}
                    label="Mühərrik növü"
                    value={ad.engine}
                  />

                  <InfoItem
                    icon={<Settings2 size={17} />}
                    label="Transmissiya"
                    value={ad.transmission}
                  />

                  <InfoItem
                    icon={<MapPin size={17} />}
                    label="Yerləşmə"
                    value={ad.location}
                  />

                  <InfoItem
                    icon={<Hash size={17} />}
                    label="Elan nömrəsi"
                    value={ad._id}
                  />
                </div>
              </div>

              {/* Description */}
              {ad.description && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#670fff]/10 text-[#670fff] flex items-center justify-center">
                      <FileText size={19} />
                    </div>

                    <h2
                      className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Elan haqqında
                    </h2>
                  </div>

                  <div
                    className={`p-5 rounded-2xl border text-sm leading-7 whitespace-pre-line ${
                      darkMode
                        ? "bg-slate-800/60 border-slate-700 text-slate-300"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    {ad.description}
                  </div>
                </div>
              )}

              {/* Delete */}
              {ad.userId === currentUserId && (
                <button
                  onClick={() => handleDelete(ad)}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5"
                >
                  <Trash2 size={19} />
                  Elanı sil
                </button>
              )}

              {/* Date */}
              <div
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-6 pt-5 border-t text-xs ${
                  darkMode
                    ? "border-slate-800 text-slate-500"
                    : "border-slate-200 text-slate-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CalendarDays size={15} />
                  {formatDate(ad.createdAt)}
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 size={15} />
                  {getCurrentTime(ad.createdAt)}
                </div>

                <div className="flex items-center gap-2">
                  <Hash size={15} />
                  {ad._id}
                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT / CONTACT
            ================================================= */}
            <div
              className={`border-t lg:border-t-0 lg:border-l p-4 sm:p-6 ${
                darkMode
                  ? "border-slate-800 bg-slate-900/60"
                  : "border-slate-200 bg-slate-50/70"
              }`}
            >
              <div className="lg:sticky lg:top-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#670fff] to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <User size={22} className="text-white" />
                  </div>

                  <div>
                    <h2
                      className={`text-xl font-bold ${
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
                  {ad.contact?.name && (
                    <div
                      className={`p-4 rounded-xl border ${
                        darkMode
                          ? "bg-slate-800/70 border-slate-700"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <User size={18} className="text-[#670fff]" />

                        <div>
                          <p className="text-xs text-slate-400">Ad</p>

                          <p
                            className={`font-semibold ${
                              darkMode ? "text-white" : "text-slate-800"
                            }`}
                          >
                            {ad.contact.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {ad.contact?.phone && (
                    <a
                      href={`tel:${ad.contact.phone}`}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all hover:-translate-y-0.5 ${
                        darkMode
                          ? "bg-slate-800/70 border-slate-700 hover:bg-slate-800"
                          : "bg-white border-slate-200 hover:shadow-md"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <Phone size={18} />
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Telefon</p>

                        <p
                          className={`font-semibold ${
                            darkMode ? "text-white" : "text-slate-800"
                          }`}
                        >
                          {ad.contact.phone}
                        </p>
                      </div>
                    </a>
                  )}

                  {ad.contact?.email && (
                    <a
                      href={`mailto:${ad.contact.email}`}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all hover:-translate-y-0.5 ${
                        darkMode
                          ? "bg-slate-800/70 border-slate-700 hover:bg-slate-800"
                          : "bg-white border-slate-200 hover:shadow-md"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Mail size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-slate-400">Email</p>

                        <p
                          className={`font-semibold truncate ${
                            darkMode ? "text-white" : "text-slate-800"
                          }`}
                        >
                          {ad.contact.email}
                        </p>
                      </div>
                    </a>
                  )}

                  {ad.location && (
                    <div
                      className={`flex items-center gap-3 p-4 rounded-xl border ${
                        darkMode
                          ? "bg-slate-800/70 border-slate-700"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#670fff]/10 text-[#670fff] flex items-center justify-center">
                        <MapPin size={18} />
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Şəhər / rayon</p>

                        <p
                          className={`font-semibold ${
                            darkMode ? "text-white" : "text-slate-800"
                          }`}
                        >
                          {ad.location}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Security info */}
                <div
                  className={`mt-5 p-4 rounded-2xl border ${
                    darkMode
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-emerald-50 border-emerald-100"
                  }`}
                >
                  <div className="flex gap-3">
                    <ShieldCheck
                      size={21}
                      className="text-emerald-500 shrink-0"
                    />

                    <div>
                      <p
                        className={`font-semibold text-sm ${
                          darkMode ? "text-emerald-300" : "text-emerald-700"
                        }`}
                      >
                        Təhlükəsiz alış
                      </p>

                      <p
                        className={`text-xs leading-5 mt-1 ${
                          darkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        Ödəniş və məhsulun vəziyyətini qarşı tərəflə əvvəlcədən
                        dəqiqləşdirin.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            Similar ads
        ===================================================== */}
        {allAds.length > 0 && (
          <section className="mt-10">
            <div className="flex items-end justify-between gap-3 mb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#670fff]">
                  Sizə uyğun
                </p>

                <h2
                  className={`text-2xl sm:text-3xl font-black mt-1 ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Bənzər elanlar
                </h2>
              </div>

              <span
                className={`hidden sm:block text-sm ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {allAds.length} elan
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {allAds.map((item) => {
                const itemTitle =
                  item.title ||
                  [item.category, item.brand, item.model]
                    .filter(Boolean)
                    .join(" ") ||
                  "Elan";

                return (
                  <Link
                    key={item._id}
                    to={`/ads/${item._id}`}
                    className="group min-w-0"
                  >
                    <article
                      className={`h-full rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        darkMode
                          ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                          : "bg-white border-slate-200 hover:border-violet-200"
                      }`}
                    >
                      <div className="relative h-[150px] sm:h-[180px] overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {item.images?.[0] ? (
                          <img
                            src={getImageUrl(item.images[0])}
                            alt={itemTitle}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                            <ImageOff size={35} />
                          </div>
                        )}

                        <div className="absolute top-2 left-2">
                          {item.priorityType &&
                            item.priorityType !== "free" && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/65 backdrop-blur-md text-white text-[10px] font-bold">
                                <Sparkles size={11} />
                                {item.priorityType === "premium"
                                  ? "PREMIUM"
                                  : "VIP"}
                              </span>
                            )}
                        </div>

                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                      </div>

                      <div className="p-3">
                        <p
                          className={`text-lg sm:text-xl font-black truncate ${
                            darkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {item.price}{" "}
                          <span className="text-sm text-[#670fff]">AZN</span>
                        </p>

                        <h3
                          className={`mt-1 text-sm font-semibold truncate ${
                            darkMode ? "text-slate-200" : "text-slate-700"
                          }`}
                        >
                          {itemTitle}
                        </h3>

                        <div
                          className={`flex items-center gap-1 mt-2 text-xs truncate ${
                            darkMode ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          <MapPin size={13} />
                          <span className="truncate">
                            {item.location || "Yerləşmə yoxdur"}
                          </span>
                        </div>

                        <div
                          className={`flex items-center gap-1 mt-1 text-xs ${
                            darkMode ? "text-slate-600" : "text-slate-400"
                          }`}
                        >
                          <Clock3 size={12} />
                          {formatDate(item.createdAt)}{" "}
                          {getCurrentTime(item.createdAt)}
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* =======================================================
          FULLSCREEN IMAGE ZOOM
      ======================================================= */}
      {zoomIndex !== null && imageArray.length > 0 && (
        <div
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex items-center justify-center"
          onClick={closeZoom}
        >
          {/* Close */}
          <button
            type="button"
            onClick={closeZoom}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-red-500 text-white flex items-center justify-center transition-all"
            aria-label="Bağla"
          >
            <X size={24} />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-semibold">
            {zoomIndex + 1} / {imageArray.length}
          </div>

          {/* Previous */}
          {imageArray.length > 1 && (
            <button
              type="button"
              className="absolute left-3 sm:left-6 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Əvvəlki şəkil"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Image */}
          <img
            src={getImageUrl(imageArray[zoomIndex])}
            alt="Böyük şəkil"
            className="max-w-[92vw] max-h-[88vh] object-contain rounded-xl select-none"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {imageArray.length > 1 && (
            <button
              type="button"
              className="absolute right-3 sm:right-6 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Növbəti şəkil"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      )}

      <BottomMenu />
    </div>
  );
}
