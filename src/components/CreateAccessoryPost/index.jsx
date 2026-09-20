import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  X,
  Search,
  ArrowLeft,
  Plus,
  Upload,
  ImagePlus,
  Wrench,
  Tag,
  DollarSign,
  MapPin,
  User,
  Mail,
  Phone,
  Package,
  Sparkles,
  Heart,
  Loader2,
  Trash2,
  Edit3,
} from "lucide-react";

import BottomMenu from "../MobileMenu";
import BubbleBackground from "../ui/BubbleBackground";
import { useTheme } from "../Main/ThemeContext";

const API_URL = process.env.REACT_APP_API_URL || "";

const createEmptyAccessory = () => ({
  title: "",
  brand: "",
  model: "",
  price: "",
  location: "",
  images: [],
  description: "",
  contact: {
    name: "",
    email: "",
    phone: "",
  },
  liked: false,
  favorite: false,
  data: {},
});

const CreateAccessoryPost = () => {
  const { darkMode } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [accessory, setAccessory] = useState(createEmptyAccessory());

  const [accessoryItems, setAccessoryItems] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // =========================================================
  // TOKEN
  // =========================================================

  const token = localStorage.getItem("token");

  // =========================================================
  // GET ACCESSORIES
  // =========================================================

  const fetchItems = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/api/accessory`);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.accessories ||
          response.data?.items ||
          response.data?.data ||
          [];

      setAccessoryItems(data);
    } catch (error) {
      console.error("Aksesuar elanları alınmadı:", error);

      Swal.fire({
        icon: "error",
        title: "Xəta",
        text: "Aksesuar elanlarını yükləmək mümkün olmadı.",
        confirmButtonText: "Bağla",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // =========================================================
  // ESC
  // =========================================================

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  // =========================================================
  // BODY SCROLL
  // =========================================================

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // =========================================================
  // CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("contact.")) {
      const field = name.split(".")[1];

      setAccessory((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [field]: value,
        },
      }));

      return;
    }

    setAccessory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // IMAGE SELECT
  // =========================================================

  const handleImageSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) return;

    const newImages = [...images, ...selectedFiles];

    setImages(newImages);

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));

    setPreview((prev) => [...prev, ...newPreviews]);
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));

    setPreview((prev) => {
      const url = prev[index];

      if (url?.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setAccessory(createEmptyAccessory());
    setImages([]);
    setPreview([]);
    setEditingId(null);
  };

  // =========================================================
  // OPEN FORM
  // =========================================================

  const handleOpenForm = () => {
    resetForm();
    setIsOpen(true);
  };

  // =========================================================
  // GET ID
  // =========================================================

  const getId = (item) => {
    return item?._id || item?.id;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Elan yerləşdirmək üçün hesabınıza daxil olun.",
        confirmButtonText: "Bağla",
      });

      return;
    }

    if (!accessory.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Başlıq daxil edin",
        text: "Elanın başlığı boş ola bilməz.",
        confirmButtonText: "Bağla",
      });

      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("title", accessory.title);
      formData.append("brand", accessory.brand);
      formData.append("model", accessory.model);
      formData.append("price", accessory.price);
      formData.append("location", accessory.location);
      formData.append("description", accessory.description);

      formData.append("contact", JSON.stringify(accessory.contact || {}));

      formData.append("data", JSON.stringify(accessory.data || {}));

      images.forEach((image) => {
        formData.append("images", image);
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editingId) {
        await axios.put(
          `${API_URL}/api/accessory/${editingId}`,
          formData,
          config,
        );

        await Swal.fire({
          icon: "success",
          title: "Elan yeniləndi",
          text: "Elan uğurla redaktə edildi.",
          confirmButtonText: "Əla",
        });
      } else {
        await axios.post(`${API_URL}/api/accessory`, formData, config);

        await Swal.fire({
          icon: "success",
          title: "Elan yerləşdirildi",
          text: "Aksesuar elanı uğurla əlavə edildi.",
          confirmButtonText: "Əla",
        });
      }

      resetForm();
      setIsOpen(false);

      await fetchItems();
    } catch (error) {
      console.error("Elan göndərilərkən xəta:", error);

      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text:
          error?.response?.data?.message ||
          "Elanı yadda saxlamaq mümkün olmadı.",
        confirmButtonText: "Bağla",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    if (!id) return;

    const result = await Swal.fire({
      icon: "warning",
      title: "Elanı silmək istəyirsiniz?",
      text: "Bu əməliyyatı geri qaytarmaq mümkün olmayacaq.",
      showCancelButton: true,
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Xeyr",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setIsLoading(true);

      await axios.delete(`${API_URL}/api/accessory/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAccessoryItems((prev) =>
        prev.filter((item) => String(getId(item)) !== String(id)),
      );

      setResults((prev) =>
        prev.filter((item) => String(getId(item)) !== String(id)),
      );

      await Swal.fire({
        icon: "success",
        title: "Elan silindi",
        text: "Elan uğurla silindi.",
        confirmButtonText: "Bağla",
      });
    } catch (error) {
      console.error("Elan silinərkən xəta:", error);

      Swal.fire({
        icon: "error",
        title: "Xəta",
        text: error?.response?.data?.message || "Elanı silmək mümkün olmadı.",
        confirmButtonText: "Bağla",
      });
    } finally {
      setIsLoading(false);
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
        confirmButtonText: "Bağla",
      });

      return;
    }

    const id = getId(item);

    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Xəta",
        text: "Elanın ID-si tapılmadı.",
        confirmButtonText: "Bağla",
      });

      return;
    }

    setEditingId(id);

    setAccessory({
      title: item.title || "",
      brand: item.brand || item.accessory?.brand || "",
      model: item.model || item.accessory?.model || "",
      price: item.price || "",
      location: item.location || item.city || "",
      images: item.images || [],
      description: item.description || "",
      contact: {
        name: item.contact?.name || item.accessory?.contact?.name || "",
        email: item.contact?.email || item.accessory?.contact?.email || "",
        phone: item.contact?.phone || item.accessory?.contact?.phone || "",
      },
      liked: item.liked || false,
      favorite: item.favorite || item.favourite || false,
      data: item.data || {},
    });

    // Mövcud şəkilləri göstər
    const existingImages = Array.isArray(item.images)
      ? item.images
      : item.mainImage
        ? [item.mainImage]
        : [];

    setPreview(existingImages);
    setImages([]);

    setIsOpen(true);
  };

  // =========================================================
  // FAVORITE
  // =========================================================

  const handleFavorite = async (item) => {
    const id = getId(item);

    if (!id) return;

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Elanı favoritlərə əlavə etmək üçün hesabınıza daxil olun.",
        confirmButtonText: "Bağla",
      });

      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/accessory/${id}/favorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedFavorite =
        response?.data?.favorite ?? response?.data?.favourite ?? !item.favorite;

      setAccessoryItems((prev) =>
        prev.map((currentItem) =>
          String(getId(currentItem)) === String(id)
            ? {
                ...currentItem,
                favorite: updatedFavorite,
              }
            : currentItem,
        ),
      );

      setResults((prev) =>
        prev.map((currentItem) =>
          String(getId(currentItem)) === String(id)
            ? {
                ...currentItem,
                favorite: updatedFavorite,
              }
            : currentItem,
        ),
      );
    } catch (error) {
      console.error("Favorite xətası:", error);

      Swal.fire({
        icon: "error",
        title: "Xəta",
        text: "Favorit əməliyyatı alınmadı.",
        confirmButtonText: "Bağla",
      });
    }
  };

  // =========================================================
  // LIKE
  // =========================================================

  const handleLike = async (item) => {
    const id = getId(item);

    if (!id) return;

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Elanı bəyənmək üçün hesabınıza daxil olun.",
        confirmButtonText: "Bağla",
      });

      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/accessory/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedLiked = response?.data?.liked ?? !item.liked;

      setAccessoryItems((prev) =>
        prev.map((currentItem) =>
          String(getId(currentItem)) === String(id)
            ? {
                ...currentItem,
                liked: updatedLiked,
              }
            : currentItem,
        ),
      );

      setResults((prev) =>
        prev.map((currentItem) =>
          String(getId(currentItem)) === String(id)
            ? {
                ...currentItem,
                liked: updatedLiked,
              }
            : currentItem,
        ),
      );
    } catch (error) {
      console.error("Like xətası:", error);

      Swal.fire({
        icon: "error",
        title: "Xəta",
        text: "Bəyənmə əməliyyatı alınmadı.",
        confirmButtonText: "Bağla",
      });
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = async () => {
    const searchText = query.trim().toLowerCase();

    if (!searchText) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/api/accessory`);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.accessories ||
          response.data?.items ||
          response.data?.data ||
          [];

      const filtered = data.filter((item) => {
        const text = [
          item.title,
          item.brand,
          item.model,
          item.location,
          item.city,
          item.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return text.includes(searchText);
      });

      setResults(filtered);
      setHasSearched(true);
    } catch (error) {
      console.error("Axtarış xətası:", error);

      Swal.fire({
        icon: "error",
        title: "Xəta",
        text: "Axtarış zamanı xəta baş verdi.",
        confirmButtonText: "Bağla",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // ENTER SEARCH
  // =========================================================

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleDateString("az-AZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  // =========================================================
  // CURRENT TIME
  // =========================================================

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("az-AZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // MAIN IMAGE
  // =========================================================

  const getMainImage = (item) => {
    if (item?.mainImage) {
      return item.mainImage;
    }

    if (Array.isArray(item?.images) && item.images.length > 0) {
      const firstImage = item.images[0];

      if (typeof firstImage === "string") {
        return firstImage;
      }

      return firstImage?.url || firstImage?.secure_url || "";
    }

    return "";
  };

  // =========================================================
  // FIELD
  // =========================================================

  const Field = ({
    label,
    name,
    value,
    onChange,
    icon: Icon,
    type = "text",
    placeholder = "",
  }) => {
    return (
      <div className="space-y-2">
        <label
          className={`text-sm font-semibold ${
            darkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {label}
        </label>

        <div className="relative">
          {Icon && (
            <Icon
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          )}

          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full rounded-xl border px-10 py-3 outline-none transition
              ${
                darkMode
                  ? "border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-purple-500"
                  : "border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-purple-500"
              }`}
          />
        </div>
      </div>
    );
  };

  // =========================================================
  // OWNER CHECK
  // =========================================================

  const isOwner = (item) => {
    const currentUserId = localStorage.getItem("userId");

    const itemUserId =
      item?.userId?._id ||
      item?.userId?.id ||
      item?.userId ||
      item?.user?._id ||
      item?.user?.id ||
      item?.user;

    return (
      !!token &&
      !!currentUserId &&
      !!itemUserId &&
      String(itemUserId) === String(currentUserId)
    );
  };

  // =========================================================
  // CARD
  // =========================================================

  const renderCard = (item) => {
    const id = getId(item);
    const image = getMainImage(item);

    const owner = isOwner(item);

    const priorityType =
      item?.priorityType || item?.priority?.type || item?.type || "free";

    const isPremium = priorityType === "premium";
    const isVip = priorityType === "vip";

    return (
      <div
        key={id}
        className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
          ${
            darkMode
              ? "border-white/10 bg-[#17171c] hover:border-purple-500/40"
              : "border-gray-200 bg-white hover:border-purple-300"
          }`}
      >
        {/* =====================================================
            ŞƏKİL
        ====================================================== */}

        <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-[#101014]">
          {image ? (
            <img
              src={image}
              alt={item.title || "Aksesuar"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImagePlus size={42} className="text-gray-400" />
            </div>
          )}

          {/* =================================================
              PREMIUM / VIP
          ================================================== */}

          {(isPremium || isVip) && (
            <div className="absolute left-3 top-3 z-20">
              <div
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg
                  ${
                    isPremium
                      ? "bg-gradient-to-r from-amber-500 to-orange-500"
                      : "bg-gradient-to-r from-purple-600 to-fuchsia-600"
                  }`}
              >
                <Sparkles size={13} />

                {isPremium ? "PREMIUM" : "VIP"}
              </div>
            </div>
          )}

          {/* =================================================
              SAHİBİN REDAKTƏ / SİL DÜYMƏLƏRİ
          ================================================== */}

          {owner && (
            <div className="absolute right-3 top-3 z-30 flex items-center gap-2">
              {/* REDAKTƏ */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  handleEdit(item);
                }}
                title="Elanı redaktə et"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/65 text-white shadow-lg backdrop-blur-md transition hover:scale-110 hover:bg-blue-600"
              >
                <Edit3 size={17} />
              </button>

              {/* SİL */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  handleDelete(id);
                }}
                title="Elanı sil"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/65 text-white shadow-lg backdrop-blur-md transition hover:scale-110 hover:bg-red-600"
              >
                <Trash2 size={17} />
              </button>
            </div>
          )}

          {/* =================================================
              FAVORITE
          ================================================== */}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              handleFavorite(item);
            }}
            className="absolute bottom-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-md transition hover:scale-110"
            title="Favoritlərə əlavə et"
          >
            <Heart
              size={19}
              className={
                item.favorite ? "fill-red-500 text-red-500" : "text-white"
              }
            />
          </button>
        </div>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500">
              {formatDate(item.createdAt) ||
                formatDate(item.date) ||
                getCurrentTime()}
            </span>

            {item.liked && (
              <span className="flex items-center gap-1 text-xs text-pink-500">
                <Heart size={13} className="fill-current" />
                Bəyənilib
              </span>
            )}
          </div>

          <h3
            className={`line-clamp-1 text-lg font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {item.title || "Aksesuar elanı"}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-sm">
            <Tag size={15} className="text-purple-500" />

            <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
              {item.brand || "Marka"}
            </span>

            {item.model && (
              <>
                <span className="text-gray-400">•</span>

                <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  {item.model}
                </span>
              </>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div
              className={`text-xl font-extrabold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {item.price
                ? `${Number(item.price).toLocaleString("az-AZ")} ₼`
                : "Qiymət yoxdur"}
            </div>

            <button
              type="button"
              onClick={() => handleLike(item)}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                item.liked
                  ? "bg-pink-500/10 text-pink-500"
                  : darkMode
                    ? "bg-white/5 text-gray-300 hover:bg-white/10"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Heart size={14} className={item.liked ? "fill-current" : ""} />
              Bəyən
            </button>
          </div>

          <div
            className={`mt-3 flex items-center gap-1.5 border-t pt-3 text-sm ${
              darkMode
                ? "border-white/10 text-gray-400"
                : "border-gray-100 text-gray-500"
            }`}
          >
            <MapPin size={15} />

            <span className="line-clamp-1">
              {item.location || item.city || "Ünvan göstərilməyib"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================
  // DATA TO DISPLAY
  // =========================================================

  const displayedItems = hasSearched ? results : accessoryItems;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#0b0b0f] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <BubbleBackground />

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-28 pt-6 md:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              type="button"
              onClick={() => window.history.back()}
              className={`mb-4 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                darkMode
                  ? "bg-white/5 text-gray-300 hover:bg-white/10"
                  : "bg-white text-gray-600 shadow-sm hover:bg-gray-100"
              }`}
            >
              <ArrowLeft size={17} />
              Geri
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-lg">
                <Wrench size={25} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold md:text-3xl">
                  Aksesuar elanları
                </h1>

                <p
                  className={
                    darkMode ? "text-sm text-gray-400" : "text-sm text-gray-500"
                  }
                >
                  Aksesuar al və ya elanını yerləşdir
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenForm}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Plus size={20} />
            Elan yerləşdir
          </button>
        </div>

        {/* =====================================================
            SEARCH
        ====================================================== */}

        <div
          className={`mb-8 flex flex-col gap-2 rounded-2xl border p-2 sm:flex-row ${
            darkMode
              ? "border-white/10 bg-white/5"
              : "border-gray-200 bg-white shadow-sm"
          }`}
        >
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Marka, model, elan adı, şəhər..."
              className={`w-full rounded-xl border-0 bg-transparent py-3.5 pl-11 pr-4 outline-none ${
                darkMode
                  ? "text-white placeholder:text-gray-500"
                  : "text-gray-800 placeholder:text-gray-400"
              }`}
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            <Search size={18} />
            Axtar
          </button>

          {hasSearched && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setHasSearched(false);
              }}
              className={`rounded-xl px-4 py-3 font-semibold transition ${
                darkMode
                  ? "bg-white/5 text-gray-300 hover:bg-white/10"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Təmizlə
            </button>
          )}
        </div>

        {/* =====================================================
            TITLE
        ====================================================== */}

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold">
              {hasSearched ? "Axtarış nəticələri" : "Son aksesuar elanları"}
            </h2>

            <p
              className={
                darkMode
                  ? "mt-1 text-sm text-gray-500"
                  : "mt-1 text-sm text-gray-500"
              }
            >
              {displayedItems.length} elan
            </p>
          </div>
        </div>

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 size={35} className="animate-spin text-purple-500" />
          </div>
        ) : displayedItems.length === 0 ? (
          <div
            className={`flex min-h-[300px] flex-col items-center justify-center rounded-3xl border p-8 text-center ${
              darkMode
                ? "border-white/10 bg-white/5"
                : "border-gray-200 bg-white"
            }`}
          >
            <Package size={50} className="mb-4 text-gray-400" />

            <h3 className="text-lg font-bold">
              {hasSearched ? "Axtarış nəticəsi tapılmadı" : "Hələ elan yoxdur"}
            </h3>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              {hasSearched
                ? "Başqa marka, model və ya açar sözlə axtarmağı yoxlayın."
                : "İlk aksesuar elanını siz yerləşdirə bilərsiniz."}
            </p>

            {!hasSearched && (
              <button
                type="button"
                onClick={handleOpenForm}
                className="mt-5 flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white"
              >
                <Plus size={18} />
                Elan yerləşdir
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedItems.map(renderCard)}
          </div>
        )}
      </div>

      {/* =======================================================
          CREATE / EDIT MODAL
      ======================================================== */}

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div
            className={`relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border shadow-2xl ${
              darkMode
                ? "border-white/10 bg-[#15151a]"
                : "border-gray-200 bg-white"
            }`}
          >
            {/* MODAL HEADER */}

            <div
              className={`sticky top-0 z-20 flex items-center justify-between border-b px-5 py-4 backdrop-blur-xl ${
                darkMode
                  ? "border-white/10 bg-[#15151a]/95"
                  : "border-gray-100 bg-white/95"
              }`}
            >
              <div>
                <h2 className="text-xl font-extrabold">
                  {editingId ? "Elanı redaktə et" : "Yeni aksesuar elanı"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {editingId
                    ? "Elanın məlumatlarını yeniləyin"
                    : "Aksesuar haqqında məlumatları daxil edin"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                  darkMode
                    ? "bg-white/5 text-gray-300 hover:bg-white/10"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="space-y-6 p-5 md:p-7">
              {/* =================================================
                  BASIC INFO
              ================================================== */}

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Elan başlığı"
                  name="title"
                  value={accessory.title}
                  onChange={handleChange}
                  icon={Tag}
                  placeholder="Məsələn: Mercedes aksesuarı"
                />

                <Field
                  label="Marka"
                  name="brand"
                  value={accessory.brand}
                  onChange={handleChange}
                  icon={Wrench}
                  placeholder="Marka"
                />

                <Field
                  label="Model"
                  name="model"
                  value={accessory.model}
                  onChange={handleChange}
                  icon={Package}
                  placeholder="Model"
                />

                <Field
                  label="Qiymət"
                  name="price"
                  type="number"
                  value={accessory.price}
                  onChange={handleChange}
                  icon={DollarSign}
                  placeholder="0"
                />

                <Field
                  label="Şəhər / Rayon"
                  name="location"
                  value={accessory.location}
                  onChange={handleChange}
                  icon={MapPin}
                  placeholder="Bakı"
                />
              </div>

              {/* =================================================
                  CONTACT
              ================================================== */}

              <div>
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
                  <User size={18} className="text-purple-500" />
                  Əlaqə məlumatları
                </h3>

                <div className="grid gap-5 md:grid-cols-3">
                  <Field
                    label="Ad"
                    name="contact.name"
                    value={accessory.contact.name}
                    onChange={handleChange}
                    icon={User}
                    placeholder="Adınız"
                  />

                  <Field
                    label="E-mail"
                    name="contact.email"
                    value={accessory.contact.email}
                    onChange={handleChange}
                    icon={Mail}
                    type="email"
                    placeholder="example@mail.com"
                  />

                  <Field
                    label="Telefon"
                    name="contact.phone"
                    value={accessory.contact.phone}
                    onChange={handleChange}
                    icon={Phone}
                    placeholder="+994..."
                  />
                </div>
              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================== */}

              <div className="space-y-2">
                <label className="text-sm font-semibold">Açıqlama</label>

                <textarea
                  name="description"
                  value={accessory.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Aksesuar haqqında ətraflı məlumat yazın..."
                  className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition ${
                    darkMode
                      ? "border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-purple-500"
                      : "border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-purple-500"
                  }`}
                />
              </div>

              {/* =================================================
                  IMAGES
              ================================================== */}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <ImagePlus size={18} className="text-purple-500" />
                    Şəkillər
                  </label>

                  <span className="text-xs text-gray-500">
                    {preview.length} şəkil
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {preview.map((src, index) => (
                    <div
                      key={`${src}-${index}`}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 dark:border-white/10"
                    >
                      <img
                        src={src}
                        alt={`preview-${index}`}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-lg transition group-hover:opacity-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}

                  <label
                    className={`flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition ${
                      darkMode
                        ? "border-white/10 bg-white/5 hover:border-purple-500 hover:bg-purple-500/5"
                        : "border-gray-200 bg-gray-50 hover:border-purple-400 hover:bg-purple-50"
                    }`}
                  >
                    <Upload size={25} className="mb-2 text-purple-500" />

                    <span className="text-xs font-semibold text-gray-500">
                      Şəkil əlavə et
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* =================================================
                  BUTTONS
              ================================================== */}

              <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end dark:border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsOpen(false);
                  }}
                  className={`rounded-xl px-5 py-3 font-semibold transition ${
                    darkMode
                      ? "bg-white/5 text-gray-300 hover:bg-white/10"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Ləğv et
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-3 font-bold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Gözləyin...
                    </>
                  ) : (
                    <>
                      {editingId ? <Edit3 size={18} /> : <Plus size={18} />}

                      {editingId
                        ? "Dəyişiklikləri yadda saxla"
                        : "Elanı yerləşdir"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomMenu />
    </div>
  );
};

export default CreateAccessoryPost;
