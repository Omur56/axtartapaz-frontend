import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import {
  ArrowLeft,
  BadgeCheck,
  Clock3,
  Edit3,
  Heart,
  Loader2,
  MapPin,
  Palette,
  Plus,
  Ruler,
  Search,
  Shirt,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { useTheme } from "../../components/Main/ThemeContext";
import BubbleBackground from "../../components/ui/BubbleBackground";
import BottomMenu from "../../components/MobileMenu";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

const API_URL = `${BASE_URL}/api/Clothing`;

const INITIAL_FORM = {
  title: "",
  type: "",
  description: "",
  price: "",
  category: "",
  condition: "",
  size: "",
  color: "",
  brand: "",
  location: "",
  contact: {
    name: "",
    email: "",
    phone: "",
  },
  liked: false,
  favorite: false,
  data: new Date(),
};

const getId = (item) => item?._id || item?.id;

const getImageUrl = (image) => {
  if (!image) return "/placeholder.png";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${BASE_URL}${image}`;
  }

  return image;
};

const formatPrice = (price) => {
  if (price === undefined || price === null || price === "") {
    return "Qiymət yoxdur";
  }

  const number = Number(String(price).replace(",", "."));

  if (Number.isNaN(number)) {
    return `${price} AZN`;
  }

  return `${number.toLocaleString("az-AZ")} AZN`;
};

const formatDate = (dateString) => {
  if (!dateString) return "Tarix yoxdur";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Tarix yoxdur";
  }

  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const postDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffDays = Math.floor((today - postDay) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Bu gün";
  if (diffDays === 1) return "Dünən";

  return date.toLocaleDateString("az-AZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("az-AZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeText = (value) =>
  String(value ?? "")
    .toLocaleLowerCase("az-AZ")
    .trim();

export default function CreateClothing() {
  const { darkMode } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [clothingPost, setClothingPost] = useState(INITIAL_FORM);

  const [clothingItems, setClothingItems] = useState([]);

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [searchPerformed, setSearchPerformed] = useState(false);

  const token = localStorage.getItem("token");

  // =========================================================
  // ELANLARI GƏTİR
  // =========================================================

  const fetchItems = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(API_URL);

      const data = Array.isArray(response.data) ? response.data : [];

      setClothingItems(data);
    } catch (error) {
      console.error("Geyim elanları yüklənmədi:", error);

      setClothingItems([]);

      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text:
          error.response?.data?.error ||
          "Geyim elanlarını yükləmək mümkün olmadı.",
        confirmButtonColor: "#670fff",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // =========================================================
  // INPUT DƏYİŞİKLİYİ
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("contact.")) {
      const field = name.split(".")[1];

      setClothingPost((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [field]: value,
        },
      }));

      return;
    }

    setClothingPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // ŞƏKİL SEÇ
  // =========================================================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (!imageFiles.length) {
      Swal.fire({
        icon: "warning",
        title: "Şəkil seçilmədi",
        text: "Zəhmət olmasa şəkil faylı seçin.",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    setImages((prev) => [...prev, ...imageFiles]);

    const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));

    setPreview((prev) => [...prev, ...newPreviews]);

    e.target.value = "";
  };

  // =========================================================
  // ŞƏKİL SİL
  // =========================================================

  const handleRemoveImage = (index) => {
    setImages((prev) => {
      const next = [...prev];

      if (next[index]) {
        URL.revokeObjectURL(URL.createObjectURL(next[index]));
      }

      next.splice(index, 1);

      return next;
    });

    setPreview((prev) => {
      const next = [...prev];

      if (next[index]?.startsWith("blob:")) {
        URL.revokeObjectURL(next[index]);
      }

      next.splice(index, 1);

      return next;
    });
  };

  // =========================================================
  // FORMU AÇ
  // =========================================================

  const handleOpenForm = () => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Elan paylaşmaq üçün hesabınıza daxil olun.",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    setIsOpen(true);
  };

  // =========================================================
  // FORMU BAĞLA
  // =========================================================

  const handleCloseForm = () => {
    if (submitting) return;

    setIsOpen(false);
    resetForm();
  };

  // =========================================================
  // FORM RESET
  // =========================================================

  const resetForm = () => {
    preview.forEach((src) => {
      if (src?.startsWith("blob:")) {
        URL.revokeObjectURL(src);
      }
    });

    setClothingPost({
      ...INITIAL_FORM,
      data: new Date(),
      contact: {
        ...INITIAL_FORM.contact,
      },
    });

    setImages([]);
    setPreview([]);
    setEditingId(null);
  };

  // =========================================================
  // ELAN ƏLAVƏ ET / YENİLƏ
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Elan yerləşdirmək üçün hesabınıza daxil olun.",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    if (!clothingPost.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Başlıq boşdur",
        text: "Elanın başlığını daxil edin.",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    if (!clothingPost.price) {
      Swal.fire({
        icon: "warning",
        title: "Qiymət daxil edilməyib",
        text: "Elanın qiymətini daxil edin.",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    if (!editingId && images.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Şəkil əlavə edin",
        text: "Elan üçün ən azı bir şəkil seçin.",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      // Yeni seçilən şəkillər
      images.forEach((file) => {
        formData.append("images", file);
      });

      // Əsas məlumatlar
      formData.append("title", clothingPost.title);
      formData.append("type", clothingPost.type);
      formData.append("description", clothingPost.description);
      formData.append("price", clothingPost.price);
      formData.append("category", clothingPost.category);
      formData.append("condition", clothingPost.condition);
      formData.append("size", clothingPost.size);
      formData.append("color", clothingPost.color);
      formData.append("brand", clothingPost.brand);
      formData.append("location", clothingPost.location);

      // Tarix
      const dateValue =
        clothingPost.data instanceof Date
          ? clothingPost.data.toISOString()
          : new Date().toISOString();

      formData.append("data", dateValue);
      formData.append("date", dateValue);

      // Kontakt
      formData.append("contact.name", clothingPost.contact?.name || "");

      formData.append("contact.email", clothingPost.contact?.email || "");

      formData.append("contact.phone", clothingPost.contact?.phone || "");

      // User
      const userId = localStorage.getItem("userId");

      if (userId) {
        formData.append("userId", userId);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData, config);

        await Swal.fire({
          icon: "success",
          title: "Elan yeniləndi",
          text: "Elan məlumatları uğurla yeniləndi.",
          confirmButtonColor: "#670fff",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await axios.post(API_URL, formData, config);

        await Swal.fire({
          icon: "success",
          title: "Elan uğurla yerləşdirildi!",
          text: "Geyim elanınız artıq saytda yayımlandı.",
          confirmButtonColor: "#670fff",
        });
      }

      setIsOpen(false);
      resetForm();
      await fetchItems();
    } catch (error) {
      console.error("Elan göndərmə xətası:", error);

      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Elanı göndərmək mümkün olmadı.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // SİL
  // =========================================================

  const handleDelete = async (id) => {
    if (!token) return;

    const result = await Swal.fire({
      icon: "warning",
      title: "Elanı silmək istəyirsiniz?",
      text: "Bu əməliyyatı geri qaytarmaq mümkün olmayacaq.",
      showCancelButton: true,
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Ləğv et",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchItems();

      Swal.fire({
        icon: "success",
        title: "Elan silindi",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Delete error:", error);

      Swal.fire({
        icon: "error",
        title: "Xəta",
        text: error.response?.data?.error || "Elanı silmək mümkün olmadı.",
        confirmButtonColor: "#d33",
      });
    }
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (item) => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Elanı redaktə etmək üçün hesabınıza daxil olun.",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    setEditingId(getId(item));

    setClothingPost({
      title: item.title || "",
      type: item.type || "",
      description: item.description || "",
      price: item.price ?? "",
      category: item.category || "",
      condition: item.condition || "",
      size: item.size || "",
      color: item.color || "",
      brand: item.brand || "",
      location: item.location || "",
      contact: {
        name: item.contact?.name || "",
        email: item.contact?.email || "",
        phone: item.contact?.phone || "",
      },
      liked: item.liked || false,
      favorite: item.favorite || false,
      data: item.data ? new Date(item.data) : new Date(),
    });

    setImages([]);
    setPreview(Array.isArray(item.images) ? item.images.map(getImageUrl) : []);

    setIsOpen(true);
  };

  // =========================================================
  // FAVORİ
  // =========================================================

  const handleFavorite = async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}/favorite`, null, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      await fetchItems();
    } catch (error) {
      console.error("Favorite error:", error);
    }
  };

  // =========================================================
  // LIKE
  // =========================================================

  const handleLike = async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}/like`, null, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      await fetchItems();
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  // =========================================================
  // AXTARIŞ
  // =========================================================

  const handleSearch = () => {
    const search = normalizeText(query);

    if (!search) {
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }

    setLoading(true);
    setSearchPerformed(true);

    try {
      const filtered = clothingItems.filter((item) => {
        const searchableText = [
          item.title,
          item.brand,
          item.model,
          item.category,
          item.type,
          item.type_of_goods,
          item.type_of_gods,
          item.location,
          item.city,
          item.condition,
          item.size,
          item.color,
          item.price,
          item.description,
        ]
          .map(normalizeText)
          .join(" ");

        return searchableText.includes(search);
      });

      setSearchResults(filtered);
    } catch (error) {
      console.error("Axtarış xətası:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SEARCH ENTER
  // =========================================================

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // =========================================================
  // AXTARIŞI TƏMİZLƏ
  // =========================================================

  const clearSearch = () => {
    setQuery("");
    setSearchResults([]);
    setSearchPerformed(false);
  };

  // =========================================================
  // GÖSTƏRİLƏCƏK ELANLAR
  // =========================================================

  const visibleSearchResults = useMemo(() => {
    return [...searchResults].reverse();
  }, [searchResults]);

  const sortedClothing = useMemo(() => {
    return [...clothingItems].reverse();
  }, [clothingItems]);

  // =========================================================
  // INPUT STYLE
  // =========================================================

  const inputClass = `
    w-full
    h-12
    px-4
    rounded-xl
    border
    outline-none
    transition-all
    duration-200
    text-sm
    ${
      darkMode
        ? "bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
        : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
    }
  `;

  return (
    <div
      className={`min-h-screen relative overflow-hidden pb-24 ${
        darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      <BubbleBackground />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <div
            className={`
              relative overflow-hidden
              rounded-3xl
              border
              shadow-xl
              ${
                darkMode
                  ? "bg-slate-900/75 border-slate-800"
                  : "bg-white/85 border-white"
              }
              backdrop-blur-xl
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/5 to-emerald-500/10 pointer-events-none" />

            <div className="relative p-5 sm:p-7">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div>
                  <Link
                    to="/Katalog"
                    className={`
                      inline-flex items-center gap-2 mb-4
                      text-sm font-medium
                      transition
                      ${
                        darkMode
                          ? "text-slate-400 hover:text-white"
                          : "text-slate-500 hover:text-violet-600"
                      }
                    `}
                  >
                    <ArrowLeft size={17} />
                    Kataloqa qayıt
                  </Link>

                  <div className="flex items-center gap-3">
                    <div
                      className="
                        w-12 h-12
                        rounded-2xl
                        bg-gradient-to-br
                        from-teal-500
                        to-emerald-500
                        text-white
                        flex items-center justify-center
                        shadow-lg shadow-emerald-500/20
                      "
                    >
                      <Shirt size={25} />
                    </div>

                    <div>
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                        Geyimlər
                      </h1>

                      <p
                        className={`text-sm mt-1 ${
                          darkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        Geyim elanlarını kəşf edin və öz elanınızı yerləşdirin
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenForm}
                  className="
                    group
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    h-12
                    px-6
                    rounded-2xl
                    bg-gradient-to-r
                    from-violet-600
                    to-fuchsia-600
                    text-white
                    font-bold
                    shadow-lg
                    shadow-violet-500/20
                    hover:-translate-y-0.5
                    hover:shadow-xl
                    transition-all
                  "
                >
                  <Plus
                    size={19}
                    className="group-hover:rotate-90 transition-transform"
                  />
                  Elan yerləşdir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5">
          <div
            className={`
              rounded-2xl
              border
              p-2
              shadow-lg
              backdrop-blur-xl
              ${
                darkMode
                  ? "bg-slate-900/75 border-slate-800"
                  : "bg-white/90 border-slate-200"
              }
            `}
          >
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className={`
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    ${darkMode ? "text-slate-500" : "text-slate-400"}
                  `}
                />

                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Geyim, marka, rəng, ölçü, şəhər və s. axtar..."
                  className={`
                    w-full
                    h-12
                    pl-12
                    pr-12
                    rounded-xl
                    outline-none
                    text-sm
                    ${
                      darkMode
                        ? "bg-slate-800 text-white placeholder:text-slate-500"
                        : "bg-slate-50 text-slate-800 placeholder:text-slate-400"
                    }
                  `}
                />

                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className={`
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      w-8
                      h-8
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      ${
                        darkMode
                          ? "text-slate-400 hover:bg-slate-700 hover:text-white"
                          : "text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                      }
                    `}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleSearch}
                disabled={loading}
                className="
                  h-12
                  px-5
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  to-fuchsia-600
                  text-white
                  font-bold
                  flex
                  items-center
                  gap-2
                  hover:opacity-90
                  transition
                  disabled:opacity-50
                "
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Search size={18} />
                )}

                <span className="hidden sm:inline">Axtar</span>
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            SEARCH RESULTS
        ===================================================== */}

        {searchPerformed && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
            <div
              className={`
                flex items-center justify-between
                mb-4
              `}
            >
              <div>
                <h2 className="text-lg sm:text-xl font-bold">
                  Axtarış nəticələri
                </h2>

                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  {visibleSearchResults.length} elan tapıldı
                </p>
              </div>

              <button
                type="button"
                onClick={clearSearch}
                className="
                  text-sm
                  font-semibold
                  text-violet-600
                  hover:text-violet-500
                "
              >
                Təmizlə
              </button>
            </div>

            {visibleSearchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
                {visibleSearchResults.map((item) => (
                  <ClothingCard
                    key={getId(item)}
                    item={item}
                    darkMode={darkMode}
                    onFavorite={handleFavorite}
                    onLike={handleLike}
                  />
                ))}
              </div>
            ) : (
              <div
                className={`
                  rounded-3xl
                  border
                  p-10
                  text-center
                  ${
                    darkMode
                      ? "bg-slate-900/70 border-slate-800"
                      : "bg-white border-slate-200"
                  }
                `}
              >
                <Search size={38} className="mx-auto text-slate-400 mb-3" />

                <h3 className="font-bold text-lg">Nəticə tapılmadı</h3>

                <p className="text-sm text-slate-500 mt-1">
                  Başqa açar sözlə yenidən axtarın.
                </p>
              </div>
            )}
          </div>
        )}

        {/* =====================================================
            ALL ADS
        ===================================================== */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-emerald-500" />

                <h2 className="text-xl sm:text-2xl font-black">
                  Son əlavə olunan elanlar
                </h2>
              </div>

              <p
                className={`text-sm mt-1 ${
                  darkMode ? "text-slate-500" : "text-slate-500"
                }`}
              >
                Ən son geyim elanları
              </p>
            </div>

            <div
              className={`
                hidden sm:flex
                items-center gap-2
                px-3 py-2
                rounded-xl
                text-xs font-semibold
                ${
                  darkMode
                    ? "bg-slate-900 text-slate-400"
                    : "bg-white text-slate-500"
                }
              `}
            >
              <BadgeCheck size={15} className="text-emerald-500" />
              {clothingItems.length} elan
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <ClothingSkeleton key={index} darkMode={darkMode} />
              ))}
            </div>
          ) : sortedClothing.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
              {sortedClothing.map((item) => (
                <div key={getId(item)} className="relative group">
                  <ClothingCard
                    item={item}
                    darkMode={darkMode}
                    onFavorite={handleFavorite}
                    onLike={handleLike}
                  />

                  {/* Edit/Delete */}
                  {token &&
                    item.userId &&
                    String(item.userId) ===
                      String(localStorage.getItem("userId")) && (
                      <div
                        className="
                          absolute
                          top-2
                          left-2
                          flex
                          gap-1
                          opacity-0
                          group-hover:opacity-100
                          transition
                          z-20
                        "
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEdit(item);
                          }}
                          className="
                            w-8
                            h-8
                            rounded-lg
                            bg-white/95
                            text-slate-700
                            shadow-lg
                            flex
                            items-center
                            justify-center
                            hover:bg-violet-600
                            hover:text-white
                            transition
                          "
                          title="Redaktə et"
                        >
                          <Edit3 size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(getId(item));
                          }}
                          className="
                            w-8
                            h-8
                            rounded-lg
                            bg-white/95
                            text-red-500
                            shadow-lg
                            flex
                            items-center
                            justify-center
                            hover:bg-red-500
                            hover:text-white
                            transition
                          "
                          title="Sil"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`
                rounded-3xl
                border
                py-16
                px-6
                text-center
                ${
                  darkMode
                    ? "bg-slate-900/70 border-slate-800"
                    : "bg-white border-slate-200"
                }
              `}
            >
              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  mx-auto
                  mb-4
                  flex
                  items-center
                  justify-center
                  bg-gradient-to-br
                  from-teal-500/15
                  to-emerald-500/15
                  text-emerald-500
                "
              >
                <Shirt size={30} />
              </div>

              <h3 className="text-lg font-bold">Hələlik geyim elanı yoxdur</h3>

              <p className="text-sm text-slate-500 mt-2">
                İlk elanı siz yerləşdirə bilərsiniz.
              </p>

              <button
                type="button"
                onClick={handleOpenForm}
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  px-5
                  h-11
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  to-fuchsia-600
                  text-white
                  font-bold
                "
              >
                <Plus size={18} />
                İlk elanı yerləşdir
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            bg-black/70
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-3
            sm:p-6
          "
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseForm();
            }
          }}
        >
          <div
            className={`
              relative
              w-full
              max-w-4xl
              max-h-[94vh]
              overflow-hidden
              rounded-3xl
              shadow-2xl
              border
              ${
                darkMode
                  ? "bg-slate-950 border-slate-800"
                  : "bg-white border-slate-200"
              }
            `}
          >
            {/* Modal header */}
            <div
              className={`
                sticky
                top-0
                z-20
                px-5
                sm:px-7
                py-4
                border-b
                flex
                items-center
                justify-between
                backdrop-blur-xl
                ${
                  darkMode
                    ? "bg-slate-950/90 border-slate-800"
                    : "bg-white/90 border-slate-200"
                }
              `}
            >
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-gradient-to-br
                      from-teal-500
                      to-emerald-500
                      text-white
                      flex
                      items-center
                      justify-center
                    "
                  >
                    {editingId ? <Edit3 size={19} /> : <Plus size={20} />}
                  </div>

                  <div>
                    <h2 className="font-black text-lg sm:text-xl">
                      {editingId ? "Elanı redaktə et" : "Yeni geyim elanı"}
                    </h2>

                    <p className="text-xs text-slate-500">
                      Məlumatları düzgün doldurun
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                disabled={submitting}
                className={`
                  w-10
                  h-10
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  transition
                  ${
                    darkMode
                      ? "bg-slate-800 text-slate-400 hover:bg-red-500/15 hover:text-red-400"
                      : "bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500"
                  }
                `}
              >
                <X size={21} />
              </button>
            </div>

            {/* Form body */}
            <div className="overflow-y-auto max-h-[calc(94vh-82px)]">
              <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-7">
                {/* Basic */}
                <FormSection
                  title="Əsas məlumatlar"
                  icon={<Tag size={18} />}
                  darkMode={darkMode}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Başlıq" required darkMode={darkMode}>
                      <input
                        type="text"
                        name="title"
                        value={clothingPost.title}
                        onChange={handleChange}
                        placeholder="Məsələn: Qadın yay paltarı"
                        className={inputClass}
                        required
                      />
                    </FormField>

                    <FormField label="Malın tipi" required darkMode={darkMode}>
                      <input
                        type="text"
                        name="type"
                        value={clothingPost.type}
                        onChange={handleChange}
                        placeholder="Məsələn: Paltar"
                        className={inputClass}
                        required
                      />
                    </FormField>

                    <FormField label="Marka" darkMode={darkMode}>
                      <input
                        type="text"
                        name="brand"
                        value={clothingPost.brand}
                        onChange={handleChange}
                        placeholder="Məsələn: Zara"
                        className={inputClass}
                      />
                    </FormField>

                    <FormField label="Kateqoriya" darkMode={darkMode}>
                      <input
                        type="text"
                        name="category"
                        value={clothingPost.category}
                        onChange={handleChange}
                        placeholder="Məsələn: Qadın geyimi"
                        className={inputClass}
                      />
                    </FormField>

                    <FormField label="Vəziyyəti" required darkMode={darkMode}>
                      <input
                        type="text"
                        name="condition"
                        value={clothingPost.condition}
                        onChange={handleChange}
                        placeholder="Yeni / İstifadə olunmuş"
                        className={inputClass}
                        required
                      />
                    </FormField>

                    <FormField label="Qiymət" required darkMode={darkMode}>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          name="price"
                          value={clothingPost.price}
                          onChange={handleChange}
                          placeholder="0.00"
                          className={`${inputClass} pr-16`}
                          required
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          AZN
                        </span>
                      </div>
                    </FormField>
                  </div>
                </FormSection>

                {/* Clothing details */}
                <FormSection
                  title="Geyim detalları"
                  icon={<Shirt size={18} />}
                  darkMode={darkMode}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField label="Ölçü" darkMode={darkMode}>
                      <div className="relative">
                        <Ruler
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="text"
                          name="size"
                          value={clothingPost.size}
                          onChange={handleChange}
                          placeholder="M, L, XL..."
                          className={`${inputClass} pl-11`}
                        />
                      </div>
                    </FormField>

                    <FormField label="Rəng" darkMode={darkMode}>
                      <div className="relative">
                        <Palette
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="text"
                          name="color"
                          value={clothingPost.color}
                          onChange={handleChange}
                          placeholder="Qara, ağ..."
                          className={`${inputClass} pl-11`}
                        />
                      </div>
                    </FormField>

                    <FormField label="Yer" required darkMode={darkMode}>
                      <div className="relative">
                        <MapPin
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="text"
                          name="location"
                          value={clothingPost.location}
                          onChange={handleChange}
                          placeholder="Bakı"
                          className={`${inputClass} pl-11`}
                          required
                        />
                      </div>
                    </FormField>
                  </div>

                  <FormField label="Təsvir" required darkMode={darkMode}>
                    <textarea
                      name="description"
                      value={clothingPost.description}
                      onChange={handleChange}
                      placeholder="Məhsul haqqında ətraflı məlumat yazın..."
                      rows={5}
                      className={`${inputClass} h-auto py-3 resize-none`}
                      required
                    />
                  </FormField>
                </FormSection>

                {/* Contact */}
                <FormSection
                  title="Əlaqə məlumatları"
                  icon={<BadgeCheck size={18} />}
                  darkMode={darkMode}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField label="Ad" required darkMode={darkMode}>
                      <input
                        type="text"
                        name="contact.name"
                        value={clothingPost.contact.name}
                        onChange={handleChange}
                        placeholder="Adınız"
                        className={inputClass}
                        required
                      />
                    </FormField>

                    <FormField label="Email" required darkMode={darkMode}>
                      <input
                        type="email"
                        name="contact.email"
                        value={clothingPost.contact.email}
                        onChange={handleChange}
                        placeholder="example@mail.com"
                        className={inputClass}
                        required
                      />
                    </FormField>

                    <FormField label="Telefon" required darkMode={darkMode}>
                      <input
                        type="tel"
                        name="contact.phone"
                        value={clothingPost.contact.phone}
                        onChange={handleChange}
                        placeholder="+994 XX XXX XX XX"
                        className={inputClass}
                        required
                      />
                    </FormField>
                  </div>
                </FormSection>

                {/* Images */}
                <FormSection
                  title="Şəkillər"
                  icon={<Upload size={18} />}
                  darkMode={darkMode}
                >
                  <label
                    className={`
                      block
                      cursor-pointer
                      rounded-2xl
                      border-2
                      border-dashed
                      p-7
                      text-center
                      transition
                      ${
                        darkMode
                          ? "border-slate-700 hover:border-violet-500 bg-slate-900/50"
                          : "border-slate-300 hover:border-violet-500 bg-slate-50"
                      }
                    `}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    <div
                      className="
                        mx-auto
                        w-12
                        h-12
                        rounded-2xl
                        bg-violet-500/10
                        text-violet-600
                        flex
                        items-center
                        justify-center
                        mb-3
                      "
                    >
                      <Upload size={23} />
                    </div>

                    <p className="font-bold">Şəkilləri seçin</p>

                    <p className="text-xs text-slate-500 mt-1">
                      JPG, PNG və digər şəkil formatları
                    </p>
                  </label>

                  {preview.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                      {preview.map((src, index) => (
                        <div
                          key={`${src}-${index}`}
                          className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group"
                        >
                          <img
                            src={getImageUrl(src)}
                            alt={`preview-${index}`}
                            className="w-full h-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="
                              absolute
                              top-2
                              right-2
                              w-8
                              h-8
                              rounded-lg
                              bg-black/60
                              text-white
                              flex
                              items-center
                              justify-center
                              opacity-0
                              group-hover:opacity-100
                              transition
                              hover:bg-red-500
                            "
                          >
                            <X size={16} />
                          </button>

                          {index === 0 && (
                            <span
                              className="
                                absolute
                                bottom-2
                                left-2
                                px-2
                                py-1
                                rounded-lg
                                bg-black/60
                                text-white
                                text-[10px]
                                font-bold
                              "
                            >
                              Əsas şəkil
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </FormSection>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    disabled={submitting}
                    className={`
                      flex-1
                      h-12
                      rounded-xl
                      font-bold
                      ${
                        darkMode
                          ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }
                    `}
                  >
                    Ləğv et
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="
                      flex-1
                      h-12
                      rounded-xl
                      bg-gradient-to-r
                      from-violet-600
                      to-fuchsia-600
                      text-white
                      font-bold
                      flex
                      items-center
                      justify-center
                      gap-2
                      shadow-lg
                      shadow-violet-500/20
                      disabled:opacity-60
                    "
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={19} className="animate-spin" />
                        Göndərilir...
                      </>
                    ) : editingId ? (
                      <>
                        <Edit3 size={18} />
                        Elanı yenilə
                      </>
                    ) : (
                      <>
                        <Plus size={19} />
                        Elanı yerləşdir
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <BottomMenu />
    </div>
  );
}

// =========================================================
// FORM SECTION
// =========================================================

function FormSection({ title, icon, darkMode, children }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div
          className="
            w-9
            h-9
            rounded-xl
            bg-violet-500/10
            text-violet-600
            flex
            items-center
            justify-center
          "
        >
          {icon}
        </div>

        <h3 className="font-black text-base">{title}</h3>
      </div>

      <div
        className={`
          rounded-2xl
          border
          p-4 sm:p-5
          space-y-4
          ${
            darkMode
              ? "border-slate-800 bg-slate-900/40"
              : "border-slate-200 bg-slate-50/70"
          }
        `}
      >
        {children}
      </div>
    </section>
  );
}

// =========================================================
// FORM FIELD
// =========================================================

function FormField({ label, required, children }) {
  return (
    <label className="block">
      <div className="flex items-center gap-1 mb-2">
        <span className="text-sm font-bold">{label}</span>

        {required && <span className="text-red-500">*</span>}
      </div>

      {children}
    </label>
  );
}

// =========================================================
// CLOTHING CARD
// =========================================================

function ClothingCard({ item, darkMode, onFavorite, onLike }) {
  const id = getId(item);

  const image =
    Array.isArray(item.images) && item.images.length > 0
      ? getImageUrl(item.images[0])
      : getImageUrl(item.image);

  const date = item.data || item.createdAt;

  return (
    <Link to={`/PostDetailClothing/${id}`} className="block h-full">
      <article
        className={`
          relative
          h-full
          overflow-hidden
          rounded-2xl
          border
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
          group
          ${
            darkMode
              ? "bg-slate-900 border-slate-800 hover:border-violet-500/40"
              : "bg-white border-slate-200 hover:border-violet-200"
          }
        `}
      >
        {/* Image */}
        <div className="relative aspect-[1.15/1] overflow-hidden">
          <img
            src={image}
            alt={item.title || "Geyim"}
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

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

          {/* Favorite */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFavorite(id);
            }}
            className="
              absolute
              top-2
              right-2
              w-8
              h-8
              rounded-xl
              bg-black/40
              backdrop-blur-md
              text-white
              flex
              items-center
              justify-center
              hover:bg-red-500
              transition
              z-10
            "
          >
            <Heart size={15} fill={item.favorite ? "currentColor" : "none"} />
          </button>

          {/* Condition */}
          {item.condition && (
            <span
              className="
                absolute
                left-2
                bottom-2
                px-2
                py-1
                rounded-lg
                bg-black/50
                backdrop-blur-md
                text-white
                text-[10px]
                font-bold
              "
            >
              {item.condition}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="font-black text-base sm:text-lg truncate">
              {formatPrice(item.price)}
            </p>

            {item.liked && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onLike(id);
                }}
                className="text-red-500"
              >
                <Heart size={15} fill="currentColor" />
              </button>
            )}
          </div>

          <h3 className="font-bold text-sm mt-1 truncate">
            {item.title || "Geyim elanı"}
          </h3>

          <p
            className={`text-xs mt-1 truncate ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {[item.brand, item.type].filter(Boolean).join(" • ") || "Geyim"}
          </p>

          <div
            className={`
              flex
              items-center
              justify-between
              gap-2
              mt-3
              pt-2
              border-t
              ${darkMode ? "border-slate-800" : "border-slate-100"}
            `}
          >
            <div className="flex items-center gap-1 min-w-0">
              <MapPin size={12} className="text-emerald-500 shrink-0" />

              <span className="text-[10px] truncate text-slate-500">
                {item.location || "Bakı"}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Clock3 size={11} className="text-violet-500" />

              <span className="text-[10px] text-slate-500">
                {formatDate(date)}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// =========================================================
// SKELETON
// =========================================================

function ClothingSkeleton({ darkMode }) {
  return (
    <div
      className={`
        overflow-hidden
        rounded-2xl
        border
        animate-pulse
        ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }
      `}
    >
      <div
        className={`
          aspect-[1.15/1]
          ${darkMode ? "bg-slate-800" : "bg-slate-200"}
        `}
      />

      <div className="p-3 space-y-3">
        <div
          className={`h-5 w-2/3 rounded ${
            darkMode ? "bg-slate-800" : "bg-slate-200"
          }`}
        />

        <div
          className={`h-4 w-full rounded ${
            darkMode ? "bg-slate-800" : "bg-slate-200"
          }`}
        />

        <div
          className={`h-3 w-1/2 rounded ${
            darkMode ? "bg-slate-800" : "bg-slate-200"
          }`}
        />

        <div
          className={`h-3 w-3/4 rounded ${
            darkMode ? "bg-slate-800" : "bg-slate-200"
          }`}
        />
      </div>
    </div>
  );
}
