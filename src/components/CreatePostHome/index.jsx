import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import confetti from "canvas-confetti";

import {
  X,
  Search,
  Plus,
  ArrowLeft,
  MapPin,
  Heart,
  Star,
  Edit3,
  Trash2,
  ImagePlus,
  User,
  Mail,
  Phone,
  Tag,
  Package,
  Save,
  Loader2,
  CalendarDays,
  MapPinned,
} from "lucide-react";

export default function CreatePostForHomeAndGarden() {
  const API_URL = process.env.REACT_APP_API_URL;
  const HOME_GARDEN_URL = `${API_URL}/api/homeGarden`;

  // =========================================================
  // INITIAL FORM
  // =========================================================

  const createInitialHomeGarden = () => ({
    category: "",
    title: "",
    description: "",
    brand: "",
    model: "",
    price: "",
    location: "",
    contact: {
      name: "",
      email: "",
      phone: "",
    },
    liked: false,
    favorite: false,
    data: new Date(),
  });

  // =========================================================
  // STATES
  // =========================================================

  const [isOpen, setIsOpen] = useState(false);

  const [homeGardenForm, setHomeGardenForm] = useState(createInitialHomeGarden);

  const [homeGardenItems, setHomeGardenItems] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [images, setImages] = useState([]);

  // Yeni seçilən şəkillərin preview-ləri
  const [preview, setPreview] = useState([]);

  // Serverdə artıq mövcud olan şəkillər
  const [existingImages, setExistingImages] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [query, setQuery] = useState("");

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);

  // =========================================================
  // TOKEN
  // =========================================================

  const getToken = () => localStorage.getItem("token");

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";

    if (typeof image === "string") {
      return image;
    }

    return (
      image.url ||
      image.secure_url ||
      image.path ||
      image.src ||
      "/placeholder.png"
    );
  };

  const getFirstImage = (item) => {
    if (item?.mainImage) {
      return getImageUrl(item.mainImage);
    }

    if (Array.isArray(item?.images) && item.images.length > 0) {
      return getImageUrl(item.images[0]);
    }

    if (Array.isArray(item?.imageUrls) && item.imageUrls.length > 0) {
      return getImageUrl(item.imageUrls[0]);
    }

    return "/placeholder.png";
  };

  // =========================================================
  // FETCH ITEMS
  // =========================================================

  const fetchItems = async () => {
    setIsLoading(true);

    try {
      const res = await axios.get(HOME_GARDEN_URL);

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.ads)
          ? res.data.ads
          : [];

      setHomeGardenItems(data);
    } catch (err) {
      console.error("HomeGarden API xətası:", err);

      setHomeGardenItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // =========================================================
  // IMAGE CHANGE
  // =========================================================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setPreview((prev) => [...prev, ...newPreviews]);

    // Eyni faylı yenidən seçməyə imkan verir
    e.target.value = "";
  };

  // =========================================================
  // REMOVE NEW IMAGE
  // =========================================================

  const handleRemovePreview = (index) => {
    setPreview((prev) => prev.filter((_, i) => i !== index));

    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("contact.")) {
      const field = name.split(".")[1];

      setHomeGardenForm((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [field]: value,
        },
      }));
    } else {
      setHomeGardenForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // =========================================================
  // OPEN CREATE FORM
  // =========================================================

  const handleOpenForm = () => {
    const token = getToken();

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Elan paylaşmaq üçün hesabınıza daxil olun.",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    setEditingId(null);
    setHomeGardenForm(createInitialHomeGarden());
    setImages([]);
    setPreview([]);
    setExistingImages([]);
    setIsOpen(true);
  };

  // =========================================================
  // CLOSE FORM
  // =========================================================

  const handleCloseForm = () => {
    setIsOpen(false);
    setEditingId(null);
    setHomeGardenForm(createInitialHomeGarden());
    setImages([]);
    setPreview([]);
    setExistingImages([]);
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Bu əməliyyatı etmək üçün hesabınıza daxil olun.",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    const formData = new FormData();

    Object.entries(homeGardenForm).forEach(([key, value]) => {
      if (key === "data") {
        formData.append("data", new Date(value).toISOString());
      } else if (key === "contact") {
        Object.entries(value || {}).forEach(([k, v]) => {
          formData.append(`contact.${k}`, v ?? "");
        });
      } else {
        formData.append(key, value ?? "");
      }
    });

    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      if (editingId) {
        await axios.put(`${HOME_GARDEN_URL}/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        Swal.fire({
          icon: "success",
          title: "Elan yeniləndi!",
          text: "Elan məlumatları uğurla yeniləndi.",
          timer: 1600,
          showConfirmButton: false,
        });
      } else {
        await axios.post(HOME_GARDEN_URL, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });

        Swal.fire({
          icon: "success",
          title: "Elanınız uğurla yerləşdirildi!",
          timer: 1700,
          showConfirmButton: false,
        });
      }

      handleCloseForm();

      await fetchItems();
    } catch (err) {
      console.error("HomeGarden submit error:", err);

      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text:
          err.response?.data?.message ||
          "Elan yadda saxlanılmadı. Yenidən cəhd edin.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Elan silinsin?",
      text: "Bu əməliyyatı geri qaytarmaq mümkün olmayacaq.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Ləğv et",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
    });

    if (!confirm.isConfirmed) return;

    const token = getToken();

    try {
      await axios.delete(`${HOME_GARDEN_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchItems();

      Swal.fire({
        icon: "success",
        title: "Elan silindi",
        timer: 1300,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Delete error:", err);

      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text: err.response?.data?.message || "Elan silinə bilmədi.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (item) => {
    const contact = item?.contact || {};

    setHomeGardenForm({
      category: item?.category || "",
      title: item?.title || "",
      description: item?.description || "",
      brand: item?.brand || "",
      model: item?.model || "",
      price: item?.price ?? "",
      location: item?.location || "",
      contact: {
        name: contact?.name || "",
        email: contact?.email || "",
        phone: contact?.phone || "",
      },
      liked: Boolean(item?.liked),
      favorite: Boolean(item?.favorite),
      data: item?.data ? new Date(item.data) : new Date(),
    });

    setEditingId(item?._id || item?.id);

    const serverImages = Array.isArray(item?.images)
      ? item.images.map((image) => getImageUrl(image)).filter(Boolean)
      : item?.mainImage
        ? [getImageUrl(item.mainImage)]
        : [];

    setExistingImages(serverImages);

    setImages([]);
    setPreview([]);

    setIsOpen(true);
  };

  // =========================================================
  // LIKE
  // =========================================================

  const handleLike = async (id) => {
    try {
      await axios.patch(`${HOME_GARDEN_URL}/${id}/like`);

      await fetchItems();
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // =========================================================
  // FAVORITE
  // =========================================================

  const handleFavorite = async (id) => {
    try {
      await axios.patch(`${HOME_GARDEN_URL}/${id}/favorite`);

      await fetchItems();
    } catch (err) {
      console.error("Favorite error:", err);
    }
  };

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const postDate = new Date(dateString);

    if (Number.isNaN(postDate.getTime())) {
      return "";
    }

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

    setLoading(true);
    setHasSearched(true);

    try {
      const res = await axios.get(HOME_GARDEN_URL);

      const allData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.ads)
          ? res.data.ads
          : [];

      const filtered = allData.filter((item) => {
        const searchableFields = [
          item?.title,
          item?.brand,
          item?.category,
          item?.model,
          item?.location,
          item?.city,
          item?.engine,
          item?.year,
          item?.motor,
          item?.transmission,
          item?.ban_type,
          item?.price,
          item?.description,
        ];

        return searchableFields.some((field) =>
          String(field ?? "")
            .toLowerCase()
            .includes(searchText),
        );
      });

      setResults(filtered);
    } catch (error) {
      console.error("API axtarış xətası:", error);

      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CARD
  // =========================================================

  const renderCard = (item, isSearchResult = false) => {
    const itemId = item?._id || item?.id;

    if (!itemId) return null;

    const image = getFirstImage(item);

    return (
      <div key={itemId} className="group relative w-full">
        <Link
          target="_top"
          rel="noopener noreferrer"
          to={`/PostDetailHome/${itemId}`}
          className="block"
        >
          <article
            className={`
              relative overflow-hidden
              rounded-2xl
              border
              border-slate-200
              dark:border-slate-800
              bg-white
              dark:bg-slate-900
              shadow-sm
              hover:shadow-xl
              hover:-translate-y-1
              transition-all
              duration-300
              ${isSearchResult ? "min-h-[310px]" : "min-h-[250px]"}
            `}
          >
            {/* IMAGE */}

            <div
              className={`
                relative overflow-hidden
                bg-slate-100
                dark:bg-slate-800
                ${isSearchResult ? "h-48" : "h-[125px] sm:h-[135px]"}
              `}
            >
              <img
                src={image}
                alt={item?.title || "Elan şəkli"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
              />

              {/* Gradient */}

              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Priority */}

              {item?.priorityType && item.priorityType !== "free" && (
                <span
                  className={`
                      absolute top-2 left-2
                      px-2.5 py-1
                      rounded-full
                      text-[10px]
                      font-bold
                      text-white
                      backdrop-blur-md
                      ${
                        item.priorityType === "premium"
                          ? "bg-purple-600/90"
                          : "bg-amber-500/90"
                      }
                    `}
                >
                  {item.priorityType === "premium" ? "PREMIUM" : "VIP"}
                </span>
              )}

              {/* Like / Favorite */}

              <div
                className="absolute top-2 right-2 flex gap-1.5"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <button
                  type="button"
                  onClick={() => handleFavorite(itemId)}
                  className={`
                    w-8 h-8
                    rounded-full
                    flex items-center justify-center
                    backdrop-blur-md
                    transition-all
                    ${
                      item?.favorite
                        ? "bg-yellow-400 text-white"
                        : "bg-white/90 dark:bg-slate-900/80 text-slate-600 dark:text-slate-200"
                    }
                    hover:scale-110
                  `}
                >
                  <Star
                    size={15}
                    className={item?.favorite ? "fill-current" : ""}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => handleLike(itemId)}
                  className={`
                    w-8 h-8
                    rounded-full
                    flex items-center justify-center
                    backdrop-blur-md
                    transition-all
                    ${
                      item?.liked
                        ? "bg-red-500 text-white"
                        : "bg-white/90 dark:bg-slate-900/80 text-slate-600 dark:text-slate-200"
                    }
                    hover:scale-110
                  `}
                >
                  <Heart
                    size={15}
                    className={item?.liked ? "fill-current" : ""}
                  />
                </button>
              </div>
            </div>

            {/* CONTENT */}

            <div className="p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-lg font-extrabold text-slate-900 dark:text-white truncate">
                  {item?.price ? `${item.price} AZN` : "Qiymət yoxdur"}
                </p>
              </div>

              <h3 className="mt-1 font-semibold text-sm text-slate-800 dark:text-slate-100 line-clamp-2">
                {item?.title || "Adsız elan"}
              </h3>

              <div className="mt-2 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 truncate">
                <Tag size={13} />

                <span className="truncate">
                  {[item?.category, item?.brand, item?.model]
                    .filter(Boolean)
                    .join(" • ") || "Ev və Bağ"}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 min-w-0 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin size={13} className="shrink-0" />

                  <span className="truncate">
                    {item?.location || "Ünvan yoxdur"}
                  </span>
                </div>

                <span className="text-[10px] whitespace-nowrap text-slate-400">
                  {formatDate(item?.data)}
                </span>
              </div>
            </div>
          </article>
        </Link>

        {/* =================================================
            EDIT / DELETE
        ================================================= */}

        <div
          className="
            absolute
            bottom-2
            right-2
            z-20
            flex
            gap-1.5
            opacity-100
            sm:opacity-0
            sm:group-hover:opacity-100
            transition-opacity
            duration-200
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
              w-9 h-9
              rounded-xl
              flex items-center justify-center
              bg-white/95
              dark:bg-slate-800/95
              text-blue-600
              dark:text-blue-400
              shadow-lg
              border
              border-slate-200
              dark:border-slate-700
              hover:bg-blue-600
              hover:text-white
              transition
            "
            title="Redaktə et"
          >
            <Edit3 size={16} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete(itemId);
            }}
            className="
              w-9 h-9
              rounded-xl
              flex items-center justify-center
              bg-white/95
              dark:bg-slate-800/95
              text-red-600
              dark:text-red-400
              shadow-lg
              border
              border-slate-200
              dark:border-slate-700
              hover:bg-red-600
              hover:text-white
              transition
            "
            title="Elanı sil"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  };

  // =========================================================
  // INPUT CLASS
  // =========================================================

  const inputClass = `
    w-full
    h-11
    px-4
    rounded-xl
    border
    border-slate-200
    dark:border-slate-700
    bg-white
    dark:bg-slate-800
    text-slate-900
    dark:text-white
    placeholder:text-slate-400
    outline-none
    transition-all
    focus:border-[#670fff]
    focus:ring-4
    focus:ring-[#670fff]/10
  `;

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#670fff] via-violet-600 to-indigo-700 p-6 sm:p-8 mb-6 shadow-xl">
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center">
                    <Package size={21} />
                  </div>

                  <span className="text-white/80 text-sm font-medium">
                    ProElan
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Ev və Bağ Elanları
                </h1>

                <p className="mt-2 text-sm sm:text-base text-white/75 max-w-xl">
                  Ev, bağ və müxtəlif məhsullarınızı asanlıqla yerləşdirin,
                  idarə edin və yeni elanları kəşf edin.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenForm}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  rounded-2xl
                  bg-white
                  text-[#670fff]
                  font-bold
                  shadow-lg
                  hover:scale-[1.03]
                  active:scale-95
                  transition
                "
              >
                <Plus size={19} />
                Elan yerləşdir
              </button>
            </div>
          </div>
        </div>

        {/* =================================================
            TOP ACTIONS
        ================================================= */}

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Link
            to="/"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-4
              h-11
              rounded-xl
              bg-white
              dark:bg-slate-900
              border
              border-slate-200
              dark:border-slate-800
              text-slate-700
              dark:text-slate-200
              font-medium
              hover:border-[#670fff]
              hover:text-[#670fff]
              transition
            "
          >
            <ArrowLeft size={18} />
            Geri
          </Link>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="relative flex-1">
            <Search
              size={19}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Ev və bağ elanlarında axtar..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);

                if (!e.target.value.trim()) {
                  setResults([]);
                  setHasSearched(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="
                w-full
                h-11
                pl-11
                pr-28
                rounded-xl
                border
                border-slate-200
                dark:border-slate-800
                bg-white
                dark:bg-slate-900
                text-slate-900
                dark:text-white
                placeholder:text-slate-400
                outline-none
                focus:border-[#670fff]
                focus:ring-4
                focus:ring-[#670fff]/10
                transition
              "
            />

            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="
                absolute
                right-1
                top-1
                h-9
                px-4
                rounded-lg
                bg-[#670fff]
                hover:bg-violet-700
                text-white
                text-sm
                font-semibold
                flex
                items-center
                gap-1.5
                disabled:opacity-60
                transition
              "
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              Axtar
            </button>
          </div>
        </div>

        {/* =================================================
            SEARCH RESULTS
        ================================================= */}

        {hasSearched && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Axtarış nəticələri</h2>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  "{query}" üçün nəticələr
                </p>
              </div>

              {results.length > 0 && (
                <span className="px-3 py-1.5 rounded-full bg-[#670fff]/10 text-[#670fff] text-xs font-bold">
                  {results.length} nəticə
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-[#670fff]" />
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {results.map((item) => renderCard(item, true))}
              </div>
            ) : (
              <div
                className="
                py-12
                px-6
                rounded-2xl
                border
                border-dashed
                border-slate-300
                dark:border-slate-700
                bg-white
                dark:bg-slate-900
                text-center
              "
              >
                <Search
                  size={38}
                  className="mx-auto text-slate-300 dark:text-slate-600"
                />

                <h3 className="mt-3 font-bold text-lg">Nəticə tapılmadı</h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Başqa açar sözlə yenidən axtarın.
                </p>
              </div>
            )}
          </section>
        )}

        {/* =================================================
            MAIN LIST HEADER
        ================================================= */}

        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Əlavə olunan elanlar
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Ev və bağ kateqoriyasındakı son elanlar
            </p>
          </div>

          <div
            className="
            hidden
            sm:flex
            items-center
            gap-2
            px-3
            py-2
            rounded-xl
            bg-white
            dark:bg-slate-900
            border
            border-slate-200
            dark:border-slate-800
            text-xs
            text-slate-500
          "
          >
            <Package size={15} />
            {homeGardenItems.length} elan
          </div>
        </div>

        {/* =================================================
            MAIN CARDS
        ================================================= */}

        {isLoading ? (
          <div
            className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            gap-4
          "
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="
                  overflow-hidden
                  rounded-2xl
                  bg-white
                  dark:bg-slate-900
                  border
                  border-slate-200
                  dark:border-slate-800
                  animate-pulse
                "
              >
                <div className="h-[125px] bg-slate-200 dark:bg-slate-800" />

                <div className="p-3 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />

                  <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />

                  <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />

                  <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : Array.isArray(homeGardenItems) && homeGardenItems.length > 0 ? (
          <div
            className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            gap-4
          "
          >
            {homeGardenItems.map((item) => renderCard(item))}
          </div>
        ) : (
          <div
            className="
            py-16
            px-6
            rounded-3xl
            bg-white
            dark:bg-slate-900
            border
            border-slate-200
            dark:border-slate-800
            text-center
          "
          >
            <div
              className="
              mx-auto
              w-16
              h-16
              rounded-2xl
              bg-[#670fff]/10
              flex
              items-center
              justify-center
              text-[#670fff]
            "
            >
              <Package size={30} />
            </div>

            <h3 className="mt-4 text-xl font-bold">Hələ elan yoxdur</h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              İlk Ev və Bağ elanını sən yerləşdir.
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
                py-3
                rounded-xl
                bg-[#670fff]
                text-white
                font-semibold
                hover:bg-violet-700
                transition
              "
            >
              <Plus size={18} />
              İlk elanı yerləşdir
            </button>
          </div>
        )}
      </div>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-[999]
            flex
            items-center
            justify-center
            p-3
            sm:p-5
            bg-black/70
            backdrop-blur-sm
          "
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseForm();
            }
          }}
        >
          <div
            className="
              relative
              w-full
              max-w-4xl
              max-h-[94vh]
              overflow-y-auto
              rounded-3xl
              bg-white
              dark:bg-slate-950
              shadow-2xl
              border
              border-slate-200
              dark:border-slate-800
            "
          >
            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div
              className="
              sticky
              top-0
              z-20
              px-5
              sm:px-7
              py-4
              border-b
              border-slate-200
              dark:border-slate-800
              bg-white/95
              dark:bg-slate-950/95
              backdrop-blur-xl
            "
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="
                    w-11
                    h-11
                    rounded-2xl
                    bg-[#670fff]/10
                    text-[#670fff]
                    flex
                    items-center
                    justify-center
                  "
                  >
                    {editingId ? <Edit3 size={21} /> : <Plus size={22} />}
                  </div>

                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold">
                      {editingId ? "Elanı redaktə et" : "Yeni Ev və Bağ elanı"}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      {editingId
                        ? "Elan məlumatlarını yenilə"
                        : "Elan məlumatlarını daxil et"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="
                    w-10
                    h-10
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    bg-slate-100
                    dark:bg-slate-800
                    text-slate-500
                    hover:bg-red-50
                    hover:text-red-500
                    dark:hover:bg-red-500/10
                    transition
                  "
                >
                  <X size={21} />
                </button>
              </div>
            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-7">
              {/* =================================================
                  ELAN MƏLUMATLARI
              ================================================= */}

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#670fff]/10 text-[#670fff] flex items-center justify-center">
                    <Tag size={16} />
                  </div>

                  <div>
                    <h3 className="font-bold">Elan məlumatları</h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Məhsul haqqında əsas məlumatlar
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* TITLE */}

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold mb-1.5">
                      Elan başlığı
                    </label>

                    <input
                      type="text"
                      name="title"
                      placeholder="Məsələn: Bağ üçün taxta masa"
                      value={homeGardenForm.title}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>

                  {/* CATEGORY */}

                  <div>
                    <label className="block text-sm font-semibold mb-1.5">
                      Kateqoriya
                    </label>

                    <input
                      type="text"
                      name="category"
                      placeholder="Məsələn: Bağ mebeli"
                      value={homeGardenForm.category}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  {/* BRAND */}

                  <div>
                    <label className="block text-sm font-semibold mb-1.5">
                      Brend
                    </label>

                    <input
                      type="text"
                      name="brand"
                      placeholder="Brend"
                      value={homeGardenForm.brand}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  {/* MODEL */}

                  <div>
                    <label className="block text-sm font-semibold mb-1.5">
                      Model
                    </label>

                    <input
                      type="text"
                      name="model"
                      placeholder="Model"
                      value={homeGardenForm.model}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  {/* PRICE */}

                  <div>
                    <label className="block text-sm font-semibold mb-1.5">
                      Qiymət
                    </label>

                    <div className="relative">
                      <input
                        type="number"
                        name="price"
                        placeholder="0"
                        min="0"
                        step="any"
                        value={homeGardenForm.price}
                        onChange={handleChange}
                        required
                        className={`${inputClass} pr-14`}
                      />

                      <span
                        className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-xs
                        font-bold
                        text-slate-400
                      "
                      >
                        AZN
                      </span>
                    </div>
                  </div>

                  {/* LOCATION */}

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold mb-1.5">
                      Ünvan / Şəhər
                    </label>

                    <div className="relative">
                      <MapPinned
                        size={17}
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-slate-400
                        "
                      />

                      <input
                        type="text"
                        name="location"
                        placeholder="Məsələn: Bakı, Binəqədi"
                        value={homeGardenForm.location}
                        onChange={handleChange}
                        required
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </div>

                  {/* DESCRIPTION */}

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold mb-1.5">
                      Təsvir
                    </label>

                    <textarea
                      name="description"
                      placeholder="Məhsul haqqında ətraflı məlumat yazın..."
                      value={homeGardenForm.description}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-slate-200
                        dark:border-slate-700
                        bg-white
                        dark:bg-slate-800
                        text-slate-900
                        dark:text-white
                        placeholder:text-slate-400
                        outline-none
                        resize-none
                        focus:border-[#670fff]
                        focus:ring-4
                        focus:ring-[#670fff]/10
                        transition
                      "
                    />
                  </div>
                </div>
              </section>

              {/* =================================================
                  CONTACT
              ================================================= */}

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <User size={16} />
                  </div>

                  <div>
                    <h3 className="font-bold">Əlaqə məlumatları</h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Elan sahibi ilə əlaqə məlumatları
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* NAME */}

                  <div className="relative">
                    <label className="block text-sm font-semibold mb-1.5">
                      Əlaqəli şəxs
                    </label>

                    <User
                      size={16}
                      className="
                        absolute
                        left-3
                        bottom-3
                        text-slate-400
                      "
                    />

                    <input
                      type="text"
                      name="contact.name"
                      placeholder="Ad Soyad"
                      value={homeGardenForm.contact.name}
                      onChange={handleChange}
                      required
                      className={`${inputClass} pl-10`}
                    />
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label className="block text-sm font-semibold mb-1.5">
                      Email
                    </label>

                    <div className="relative">
                      <Mail
                        size={16}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          text-slate-400
                        "
                      />

                      <input
                        type="email"
                        name="contact.email"
                        placeholder="example@mail.com"
                        value={homeGardenForm.contact.email}
                        onChange={handleChange}
                        required
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  {/* PHONE */}

                  <div>
                    <label className="block text-sm font-semibold mb-1.5">
                      Telefon
                    </label>

                    <div className="relative">
                      <Phone
                        size={16}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          text-slate-400
                        "
                      />

                      <input
                        type="tel"
                        name="contact.phone"
                        placeholder="050 XXX XX XX"
                        value={homeGardenForm.contact.phone}
                        onChange={handleChange}
                        required
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* =================================================
                  IMAGES
              ================================================= */}

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <ImagePlus size={17} />
                  </div>

                  <div>
                    <h3 className="font-bold">Elan şəkilləri</h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Məhsulun şəkillərini əlavə edin
                    </p>
                  </div>
                </div>

                {/* UPLOAD */}

                <label
                  className="
                    relative
                    flex
                    flex-col
                    items-center
                    justify-center
                    min-h-[150px]
                    rounded-2xl
                    border-2
                    border-dashed
                    border-slate-300
                    dark:border-slate-700
                    bg-slate-50
                    dark:bg-slate-900
                    hover:border-[#670fff]
                    hover:bg-[#670fff]/5
                    cursor-pointer
                    transition
                  "
                >
                  <div
                    className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-[#670fff]/10
                    text-[#670fff]
                    flex
                    items-center
                    justify-center
                  "
                  >
                    <ImagePlus size={24} />
                  </div>

                  <p className="mt-3 text-sm font-semibold">Şəkilləri seç</p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Bir neçə şəkil seçə bilərsiniz
                  </p>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* EXISTING IMAGES */}

                {existingImages.length > 0 && (
                  <div className="mt-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-bold">Mövcud şəkillər</span>

                      <span
                        className="
                        px-2
                        py-0.5
                        rounded-full
                        bg-slate-100
                        dark:bg-slate-800
                        text-xs
                        text-slate-500
                      "
                      >
                        {existingImages.length}
                      </span>
                    </div>

                    <div
                      className="
                      grid
                      grid-cols-3
                      sm:grid-cols-5
                      gap-3
                    "
                    >
                      {existingImages.map((src, index) => (
                        <div
                          key={`${src}-${index}`}
                          className="
                            aspect-square
                            overflow-hidden
                            rounded-xl
                            border
                            border-slate-200
                            dark:border-slate-700
                            bg-slate-100
                            dark:bg-slate-800
                          "
                        >
                          <img
                            src={src}
                            alt={`Mövcud şəkil ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.png";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* NEW PREVIEWS */}

                {preview.length > 0 && (
                  <div className="mt-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-bold">Yeni şəkillər</span>

                      <span
                        className="
                        px-2
                        py-0.5
                        rounded-full
                        bg-[#670fff]/10
                        text-[#670fff]
                        text-xs
                        font-bold
                      "
                      >
                        {preview.length}
                      </span>
                    </div>

                    <div
                      className="
                      grid
                      grid-cols-3
                      sm:grid-cols-5
                      gap-3
                    "
                    >
                      {preview.map((src, index) => (
                        <div
                          key={src}
                          className="
                            relative
                            aspect-square
                            overflow-hidden
                            rounded-xl
                            border
                            border-slate-200
                            dark:border-slate-700
                            group/image
                          "
                        >
                          <img
                            src={src}
                            alt={`Yeni şəkil ${index + 1}`}
                            className="w-full h-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemovePreview(index)}
                            className="
                              absolute
                              top-1.5
                              right-1.5
                              w-7
                              h-7
                              rounded-lg
                              bg-red-500
                              text-white
                              flex
                              items-center
                              justify-center
                              shadow-lg
                              hover:bg-red-600
                              transition
                            "
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div
                className="
                sticky
                bottom-0
                -mx-5
                sm:-mx-7
                px-5
                sm:px-7
                py-4
                bg-white/95
                dark:bg-slate-950/95
                backdrop-blur-xl
                border-t
                border-slate-200
                dark:border-slate-800
              "
              >
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="
                      h-12
                      px-6
                      rounded-xl
                      bg-slate-100
                      dark:bg-slate-800
                      text-slate-700
                      dark:text-slate-200
                      font-semibold
                      hover:bg-slate-200
                      dark:hover:bg-slate-700
                      transition
                    "
                  >
                    Ləğv et
                  </button>

                  <button
                    type="submit"
                    className="
                      h-12
                      px-7
                      rounded-xl
                      bg-[#670fff]
                      hover:bg-violet-700
                      text-white
                      font-bold
                      flex
                      items-center
                      justify-center
                      gap-2
                      shadow-lg
                      shadow-[#670fff]/20
                      hover:shadow-xl
                      transition
                    "
                  >
                    {editingId ? (
                      <>
                        <Save size={18} />
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
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
