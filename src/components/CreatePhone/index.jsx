import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import {
  X,
  Search,
  ArrowLeft,
  Plus,
  Smartphone,
  Tag,
  MapPin,
  User,
  Mail,
  Phone,
  ImagePlus,
  Upload,
  Trash2,
  Edit3,
  Heart,
  Star,
  HardDrive,
  Palette,
  Cpu,
  CreditCard,
  FileText,
  Package,
  RefreshCcw,
  Save,
} from "lucide-react";

export default function CreatePhone() {
  const API_URL = process.env.REACT_APP_API_URL;
  const PHONE_URL = `${API_URL}/api/phone`;

  // =====================================================
  // INITIAL DATA
  // =====================================================

  const createInitialPhone = () => ({
    id: Date.now(),
    title: "",
    brand: "",
    model: "",
    price: "",
    color: "",
    storage: "",
    ram: "",
    sim_card: "",
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
    data: new Date(),
  });

  // =====================================================
  // STATES
  // =====================================================

  const [isOpen, setIsOpen] = useState(false);
  const [phonePost, setPhonePost] = useState(createInitialPhone);
  const [phoneItems, setPhoneItems] = useState([]);

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const [existingImages, setExistingImages] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);

  const getToken = () => localStorage.getItem("token");

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";

    if (typeof image === "string") {
      return image;
    }

    return image?.url || image?.secure_url || image?.path || "/placeholder.png";
  };

  const getFirstImage = (item) => {
    if (!item) return "/placeholder.png";

    const image = item?.images?.[0] || item?.imageUrls?.[0] || item?.mainImage;

    return getImageUrl(image);
  };

  // =====================================================
  // IMAGE SELECTION
  // =====================================================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setPreview((prev) => [...prev, ...newPreviews]);

    e.target.value = "";
  };

  const removeNewImage = (index) => {
    setPreview((prev) => {
      const url = prev[index];

      if (url) {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      }

      return prev.filter((_, i) => i !== index);
    });

    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // =====================================================
  // DELETE EXISTING IMAGE
  // =====================================================

  const handleImageDelete = async (image) => {
    if (!editingId) return;

    const confirm = await Swal.fire({
      title: "Şəkil silinsin?",
      text: "Bu şəkil elandan silinəcək.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Ləğv et",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${PHONE_URL}/images/${encodeURIComponent(image)}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setExistingImages((prev) => prev.filter((img) => img !== image));

      Swal.fire({
        icon: "success",
        title: "Şəkil silindi",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Şəkil silinmə xətası:", err);

      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text: err.response?.data?.message || "Şəkil silinə bilmədi.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("contact.")) {
      const field = name.split(".")[1];

      setPhonePost((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [field]: value,
        },
      }));

      return;
    }

    if (name === "data") {
      setPhonePost((prev) => ({
        ...prev,
        data: new Date(value),
      }));

      return;
    }

    setPhonePost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // FETCH ITEMS
  // =====================================================

  const fetchItems = async () => {
    setIsLoading(true);

    try {
      const res = await axios.get(PHONE_URL);

      const data = Array.isArray(res.data) ? res.data : res.data?.ads || [];

      setPhoneItems(data);
    } catch (err) {
      console.error("Telefon elanları yüklənmədi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    preview.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    });

    setPhonePost(createInitialPhone());
    setImages([]);
    setPreview([]);
    setExistingImages([]);
    setEditingId(null);
  };

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const closeForm = () => {
    if (submitting) return;

    resetForm();
    setIsOpen(false);
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Elan paylaşmaq üçün hesabınıza daxil olun.",
        confirmButtonColor: "#2563eb",
      });

      return;
    }

    if (!editingId && images.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Şəkil əlavə edin",
        text: "Elan yerləşdirmək üçün ən azı bir şəkil seçin.",
        confirmButtonColor: "#2563eb",
      });

      return;
    }

    setSubmitting(true);

    const formData = new FormData();

    Object.entries(phonePost).forEach(([key, value]) => {
      if (key === "data") {
        const date = value instanceof Date ? value : new Date(value);

        formData.append("data", date.toISOString());
      } else if (key === "contact") {
        Object.entries(value || {}).forEach(([contactKey, contactValue]) => {
          formData.append(`contact.${contactKey}`, contactValue || "");
        });
      } else if (key !== "images") {
        formData.append(key, value ?? "");
      }
    });

    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      if (editingId) {
        await axios.put(`${PHONE_URL}/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        await Swal.fire({
          icon: "success",
          title: "Elan yeniləndi!",
          text: "Telefon elanınız uğurla yeniləndi.",
          confirmButtonColor: "#2563eb",
        });
      } else {
        await axios.post(PHONE_URL, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        await Swal.fire({
          icon: "success",
          title: "Elan yerləşdirildi!",
          text: "Telefon elanınız uğurla əlavə edildi.",
          confirmButtonColor: "#2563eb",
        });
      }

      resetForm();
      setIsOpen(false);

      await fetchItems();
    } catch (err) {
      console.error("Elan göndərmə xətası:", err);

      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text:
          err.response?.data?.message ||
          "Elan göndərilərkən server xətası baş verdi.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

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

    try {
      await axios.delete(`${PHONE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      await fetchItems();

      Swal.fire({
        icon: "success",
        title: "Elan silindi",
        timer: 1200,
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

  // =====================================================
  // FAVORITE
  // =====================================================

  const handleFavorite = async (id) => {
    const token = getToken();

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Elanı favoritlərə əlavə etmək üçün hesabınıza daxil olun.",
        confirmButtonColor: "#2563eb",
      });

      return;
    }

    try {
      await axios.patch(
        `${PHONE_URL}/${id}/favorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchItems();
    } catch (err) {
      console.error("Favorite error:", err);
    }
  };

  // =====================================================
  // LIKE
  // =====================================================

  const handleLike = async (id) => {
    const token = getToken();

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Elanı bəyənmək üçün hesabınıza daxil olun.",
        confirmButtonColor: "#2563eb",
      });

      return;
    }

    try {
      await axios.patch(
        `${PHONE_URL}/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchItems();
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (item) => {
    setPhonePost({
      ...createInitialPhone(),
      ...item,

      title: item?.title || "",
      brand: item?.phone?.brand || item?.brand || "",
      model: item?.phone?.model || item?.model || "",
      price: item?.price ?? "",
      color: item?.phone?.color || item?.color || "",
      storage: item?.phone?.storage || item?.storage || "",
      ram: item?.phone?.ram || item?.ram || "",
      sim_card: item?.phone?.sim_card || item?.sim_card || "",
      location: item?.location || "",
      description: item?.description || "",

      contact: {
        name: item?.contact?.name || "",
        email: item?.contact?.email || "",
        phone: item?.contact?.phone || "",
      },

      liked: Boolean(item?.liked),
      favorite: Boolean(item?.favorite),

      data: item?.data ? new Date(item.data) : new Date(),
    });

    setEditingId(item?._id || item?.id);

    const serverImages = Array.isArray(item?.images)
      ? item.images
          .map((img) => {
            if (typeof img === "string") {
              return img;
            }

            return img?.url || img?.secure_url || img?.path || "";
          })
          .filter(Boolean)
      : item?.mainImage
        ? [item.mainImage]
        : [];

    setExistingImages(serverImages.map(getImageUrl));

    setImages([]);
    setPreview([]);
    setIsOpen(true);
  };

  // =====================================================
  // DATE
  // =====================================================

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

  // =====================================================
  // SEARCH
  // =====================================================

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
      const response = await axios.get(PHONE_URL);

      const allData = Array.isArray(response.data)
        ? response.data
        : response.data?.ads || [];

      const filtered = allData.filter((item) => {
        const values = [
          item?.title,
          item?.brand,
          item?.category,
          item?.model,
          item?.location,
          item?.city,
          item?.color,
          item?.storage,
          item?.ram,
          item?.sim_card,
          item?.price,
          item?.description,

          item?.phone?.brand,
          item?.phone?.model,
          item?.phone?.ram,
          item?.phone?.storage,
          item?.phone?.color,
        ];

        return values.some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(searchText),
        );
      });

      setResults(filtered);
    } catch (error) {
      console.error("API axtarış xətası:", error);

      Swal.fire({
        icon: "error",
        title: "Axtarış xətası",
        text: "Elanlar axtarılarkən problem yarandı.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
  };

  // =====================================================
  // OPEN FORM
  // =====================================================

  const handleOpenForm = () => {
    if (!getToken()) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Elan paylaşmaq üçün hesabınıza daxil olun.",
        confirmButtonColor: "#2563eb",
      });

      return;
    }

    resetForm();
    setIsOpen(true);
  };

  // =====================================================
  // CARD
  // =====================================================

  const renderCard = (item, isSearchCard = false) => {
    const itemId = item?._id || item?.id;

    const image = getFirstImage(item);

    const brand = item?.phone?.brand || item?.brand || "";

    const model = item?.phone?.model || item?.model || "";

    const ram = item?.phone?.ram || item?.ram || "";

    const storage = item?.phone?.storage || item?.storage || "";

    const title = item?.title || `${brand} ${model}`.trim() || "Telefon";

    return (
      <div key={itemId} className="group relative">
        {/* =================================================
            CARD
        ================================================= */}

        <Link
          to={`/PostDetailPhone/${itemId}`}
          target="_top"
          rel="noopener noreferrer"
          className="block"
        >
          <article
            className="
              overflow-hidden
              rounded-2xl
              bg-white dark:bg-slate-900
              border border-slate-200 dark:border-slate-800
              shadow-sm
              hover:shadow-xl
              hover:-translate-y-1
              transition-all duration-300
            "
          >
            {/* IMAGE */}

            <div
              className={`
                relative
                ${isSearchCard ? "h-40" : "h-[125px] sm:h-[135px]"}
                bg-slate-100
                dark:bg-slate-800
                overflow-hidden
              `}
            >
              <img
                src={image}
                alt={title}
                loading="lazy"
                className="
                  w-full h-full
                  object-cover
                  group-hover:scale-105
                  transition duration-500
                "
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
              />

              {/* FAVORITE */}

              {item.favorite && (
                <div
                  className="
                    absolute
                    top-2 right-2
                    w-8 h-8
                    rounded-full
                    bg-white/95
                    flex items-center justify-center
                    text-amber-500
                    shadow
                  "
                >
                  <Star size={15} fill="currentColor" />
                </div>
              )}
            </div>

            {/* CONTENT */}

            <div className="p-3">
              <div className="flex items-center justify-between gap-2">
                <p
                  className="
                    text-lg
                    font-black
                    text-slate-900
                    dark:text-white
                    truncate
                  "
                >
                  {item.price || "0"} AZN
                </p>

                {item.liked && (
                  <Heart
                    size={15}
                    className="text-red-500 shrink-0"
                    fill="currentColor"
                  />
                )}
              </div>

              <h3
                className="
                  text-sm
                  font-bold
                  text-slate-800
                  dark:text-slate-200
                  truncate
                  mt-1
                "
              >
                {title}
              </h3>

              <p
                className="
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                  truncate
                  mt-1
                "
              >
                {brand} {model}
              </p>

              {(ram || storage) && (
                <p
                  className="
                    text-[11px]
                    text-slate-400
                    truncate
                    mt-1
                  "
                >
                  {ram ? `${ram} GB RAM` : ""}

                  {ram && storage ? " • " : ""}

                  {storage ? `${storage} yaddaş` : ""}
                </p>
              )}

              <div
                className="
                  flex items-center
                  justify-between
                  gap-2
                  mt-3
                "
              >
                <div
                  className="
                    flex items-center
                    gap-1
                    min-w-0
                    text-[10px]
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  <MapPin
                    size={12}
                    className="
                      text-emerald-500
                      shrink-0
                    "
                  />

                  <span className="truncate">
                    {item.location || "Azərbaycan"}
                  </span>
                </div>

                <span
                  className="
                    text-[10px]
                    text-slate-400
                    whitespace-nowrap
                  "
                >
                  {formatDate(item.data)}
                </span>
              </div>

              <div
                className="
                  text-[10px]
                  text-slate-400
                  text-right
                  mt-1
                "
              >
                {getCurrentTime(item.data)}
              </div>
            </div>
          </article>
        </Link>

        {/* =================================================
            ACTION BUTTONS
            MOBİLDƏ HƏMİŞƏ GÖRÜNÜR
            DESKTOPDA HOVER ZAMANI
        ================================================= */}

        <div
          className="
            absolute
            top-2
            left-2
            right-2
            z-30
            flex
            items-center
            justify-between
            gap-2
            opacity-100
            sm:opacity-0
            sm:group-hover:opacity-100
            transition-opacity
            pointer-events-none
          "
        >
          {/* LEFT ACTIONS */}

          <div className="flex gap-1.5 pointer-events-auto">
            {/* EDIT */}

            <button
              type="button"
              title="Redaktə et"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleEdit(item);
              }}
              className="
                w-8 h-8
                rounded-xl
                bg-white/95
                dark:bg-slate-900/95
                text-blue-600
                shadow-lg
                flex items-center justify-center
                hover:bg-blue-600
                hover:text-white
                transition
              "
            >
              <Edit3 size={15} />
            </button>

            {/* DELETE */}

            <button
              type="button"
              title="Sil"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete(itemId);
              }}
              className="
                w-8 h-8
                rounded-xl
                bg-white/95
                dark:bg-slate-900/95
                text-red-500
                shadow-lg
                flex items-center justify-center
                hover:bg-red-500
                hover:text-white
                transition
              "
            >
              <Trash2 size={15} />
            </button>
          </div>

          {/* RIGHT ACTIONS */}

          <div className="flex gap-1.5 pointer-events-auto">
            {/* LIKE */}

            <button
              type="button"
              title="Bəyən"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLike(itemId);
              }}
              className={`
                w-8 h-8
                rounded-xl
                bg-white/95
                dark:bg-slate-900/95
                shadow-lg
                flex items-center justify-center
                transition
                ${
                  item.liked
                    ? "text-red-500"
                    : "text-slate-500 hover:text-red-500"
                }
              `}
            >
              <Heart size={15} fill={item.liked ? "currentColor" : "none"} />
            </button>

            {/* FAVORITE */}

            <button
              type="button"
              title="Favorit"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFavorite(itemId);
              }}
              className={`
                w-8 h-8
                rounded-xl
                bg-white/95
                dark:bg-slate-900/95
                shadow-lg
                flex items-center justify-center
                transition
                ${
                  item.favorite
                    ? "text-amber-500"
                    : "text-slate-500 hover:text-amber-500"
                }
              `}
            >
              <Star size={15} fill={item.favorite ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        dark:bg-slate-950
        text-slate-900
        dark:text-white
        transition-colors duration-300
      "
    >
      <div
        className="
          w-full
          max-w-7xl
          mx-auto
          px-3 sm:px-5 lg:px-8
          py-5 sm:py-8
        "
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col gap-6 mb-8">
          <div
            className="
              flex flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-4
            "
          >
            <div>
              <Link
                to="/"
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-medium
                  text-slate-500
                  hover:text-blue-600
                  dark:text-slate-400
                  dark:hover:text-blue-400
                  transition
                  mb-3
                "
              >
                <ArrowLeft size={18} />
                Əsas səhifəyə qayıt
              </Link>

              <div className="flex items-center gap-3">
                <div
                  className="
                    w-12 h-12
                    rounded-2xl
                    bg-gradient-to-br
                    from-blue-600
                    to-indigo-600
                    text-white
                    flex items-center justify-center
                    shadow-lg
                    shadow-blue-500/20
                  "
                >
                  <Smartphone size={25} />
                </div>

                <div>
                  <h1
                    className="
                      text-2xl sm:text-3xl
                      font-black
                      text-slate-900
                      dark:text-white
                    "
                  >
                    Telefon elanları
                  </h1>

                  <p
                    className="
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                      mt-1
                    "
                  >
                    Telefonunuzu asanlıqla satışa çıxarın
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenForm}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-5 py-3
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                text-white
                font-bold
                shadow-lg
                shadow-blue-500/20
                hover:shadow-xl
                hover:-translate-y-0.5
                active:translate-y-0
                transition-all
              "
            >
              <Plus size={20} />
              Yeni elan yerləşdir
            </button>
          </div>

          {/* SEARCH */}

          <div
            className="
              relative
              w-full
              max-w-3xl
              mx-auto
            "
          >
            <div
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            >
              <Search size={20} />
            </div>

            <input
              type="text"
              placeholder="
                Telefon, marka, model, şəhər və ya
                qiymət axtar...
              "
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="
                w-full
                h-14
                pl-12
                pr-32
                rounded-2xl
                border
                border-slate-200
                bg-white
                dark:bg-slate-900
                dark:border-slate-800
                text-slate-900
                dark:text-white
                placeholder:text-slate-400
                shadow-sm
                focus:outline-none
                focus:ring-4
                focus:ring-blue-500/10
                focus:border-blue-500
                transition
              "
            />

            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="
                  absolute
                  right-24
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  hover:text-red-500
                  transition
                "
              >
                <X size={18} />
              </button>
            )}

            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="
                absolute
                right-2
                top-2
                bottom-2
                px-4
                rounded-xl
                bg-slate-900
                dark:bg-blue-600
                text-white
                font-semibold
                hover:bg-blue-600
                dark:hover:bg-blue-700
                transition
                disabled:opacity-60
              "
            >
              {loading ? "Axtarılır..." : "Axtar"}
            </button>
          </div>
        </div>

        {/* =====================================================
            SEARCH RESULTS
        ====================================================== */}

        {hasSearched && (
          <section className="mb-10">
            <div
              className="
                flex
                items-center
                justify-between
                mb-4
              "
            >
              <div>
                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Axtarış nəticələri
                </h2>

                <p
                  className="
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {results.length} elan tapıldı
                </p>
              </div>

              <button
                type="button"
                onClick={clearSearch}
                className="
                  text-sm
                  font-semibold
                  text-blue-600
                  hover:text-blue-700
                "
              >
                Təmizlə
              </button>
            </div>

            {results.length === 0 ? (
              <div
                className="
                  rounded-3xl
                  border
                  border-slate-200
                  dark:border-slate-800
                  bg-white
                  dark:bg-slate-900
                  py-12
                  text-center
                "
              >
                <Search
                  size={38}
                  className="
                    mx-auto
                    text-slate-300
                    dark:text-slate-600
                    mb-3
                  "
                />

                <h3 className="font-bold">Nəticə tapılmadı</h3>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-1
                  "
                >
                  Başqa açar sözlə yenidən axtarın.
                </p>
              </div>
            ) : (
              <div
                className="
                  grid
                  grid-cols-2
                  sm:grid-cols-3
                  lg:grid-cols-4
                  xl:grid-cols-5
                  gap-4
                "
              >
                {results.map((item) => renderCard(item, true))}
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            MODAL
        ====================================================== */}

        {isOpen && (
          <div
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              bg-slate-950/70
              backdrop-blur-md
              p-3 sm:p-6
            "
          >
            <div
              className="
                relative
                w-full
                max-w-5xl
                max-h-[94vh]
                overflow-hidden
                rounded-[28px]
                bg-white
                dark:bg-slate-900
                shadow-2xl
              "
            >
              {/* MODAL HEADER */}

              <div
                className="
                  sticky
                  top-0
                  z-20
                  flex
                  items-center
                  justify-between
                  gap-4
                  px-5 sm:px-7
                  py-4
                  border-b
                  border-slate-200
                  dark:border-slate-800
                  bg-white/95
                  dark:bg-slate-900/95
                  backdrop-blur-xl
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-11 h-11
                      rounded-2xl
                      bg-blue-100
                      dark:bg-blue-500/10
                      text-blue-600
                      dark:text-blue-400
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Smartphone size={22} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2
                        className="
                          font-black
                          text-lg sm:text-xl
                          text-slate-900
                          dark:text-white
                        "
                      >
                        {editingId
                          ? "Telefon elanını redaktə et"
                          : "Yeni telefon elanı"}
                      </h2>

                      {editingId && (
                        <span
                          className="
                            hidden sm:inline-flex
                            px-2.5 py-1
                            rounded-full
                            bg-amber-100
                            text-amber-700
                            text-xs
                            font-bold
                          "
                        >
                          REDAKTƏ
                        </span>
                      )}
                    </div>

                    <p
                      className="
                        text-xs sm:text-sm
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Məlumatları doldurun və elanınızı paylaşın
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={submitting}
                  className="
                    w-10 h-10
                    flex items-center
                    justify-center
                    rounded-xl
                    bg-slate-100
                    dark:bg-slate-800
                    text-slate-500
                    hover:bg-red-50
                    hover:text-red-500
                    dark:hover:bg-red-500/10
                    transition
                    disabled:opacity-50
                  "
                >
                  <X size={21} />
                </button>
              </div>

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="
                  max-h-[calc(94vh-78px)]
                  overflow-y-auto
                "
              >
                <div
                  className="
                    p-4 sm:p-7
                    space-y-6
                  "
                >
                  {/* =================================================
                      ELAN MƏLUMATLARI
                  ================================================== */}

                  <section
                    className="
                      rounded-3xl
                      border
                      border-slate-200
                      dark:border-slate-800
                      overflow-hidden
                    "
                  >
                    <div
                      className="
                        px-5 py-4
                        bg-slate-50
                        dark:bg-slate-800/50
                        border-b
                        border-slate-200
                        dark:border-slate-800
                      "
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            w-9 h-9
                            rounded-xl
                            bg-blue-100
                            dark:bg-blue-500/10
                            text-blue-600
                            flex items-center
                            justify-center
                          "
                        >
                          <Tag size={18} />
                        </div>

                        <div>
                          <h3
                            className="
                              font-bold
                              text-slate-900
                              dark:text-white
                            "
                          >
                            Elan məlumatları
                          </h3>

                          <p
                            className="
                              text-xs
                              text-slate-500
                            "
                          >
                            Telefon haqqında əsas məlumatlar
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="
                        p-5
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-5
                      "
                    >
                      {/* TITLE */}

                      <div className="md:col-span-2">
                        <label className="form-label">Elan başlığı</label>

                        <input
                          type="text"
                          name="title"
                          value={phonePost.title}
                          onChange={handleChange}
                          placeholder="
                            Məsələn: iPhone 15 Pro 256GB
                          "
                          required
                          className="modern-input"
                        />
                      </div>

                      {/* BRAND */}

                      <div>
                        <label className="form-label">Marka</label>

                        <div className=" items-center relative gap-3">
                          <Smartphone size={18} className="input-icon " />

                          <input
                            type="text"
                            name="brand"
                            value={phonePost.brand}
                            onChange={handleChange}
                            placeholder="
                              Apple, Samsung...
                            "
                            required
                            className="
                              modern-input
                              pl-11
                            gap-3
                            "
                          />
                        </div>
                      </div>

                      {/* MODEL */}

                      <div>
                        <label className="form-label">Model</label>

                        <div className="relative">
                          <Package size={18} className="input-icon" />

                          <input
                            type="text"
                            name="model"
                            value={phonePost.model}
                            onChange={handleChange}
                            placeholder="
                              iPhone 15 Pro
                            "
                            required
                            className="
                              modern-input
                              pl-11
                            "
                          />
                        </div>
                      </div>

                      {/* PRICE */}

                      <div>
                        <label className="form-label">Qiymət</label>

                        <div className="relative">
                          <input
                            type="number"
                            name="price"
                            value={phonePost.price}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                            required
                            className="
                              modern-input
                              pr-16
                            "
                          />

                          <span
                            className="
                              absolute
                              right-4
                              top-1/2
                              -translate-y-1/2
                              text-sm
                              font-bold
                              text-slate-400
                            "
                          >
                            AZN
                          </span>
                        </div>
                      </div>

                      {/* COLOR */}

                      <div>
                        <label className="form-label">Rəng</label>

                        <div className="relative">
                          <Palette size={18} className="input-icon" />

                          <input
                            type="text"
                            name="color"
                            value={phonePost.color}
                            onChange={handleChange}
                            placeholder="
                              Qara, ağ, mavi...
                            "
                            required
                            className="
                              modern-input
                              pl-11
                            "
                          />
                        </div>
                      </div>

                      {/* STORAGE */}

                      <div>
                        <label className="form-label">Yaddaş</label>

                        <div className="relative">
                          <HardDrive size={18} className="input-icon" />

                          <input
                            type="text"
                            name="storage"
                            value={phonePost.storage}
                            onChange={handleChange}
                            placeholder="
                              128 GB, 256 GB...
                            "
                            required
                            className="
                              modern-input
                              pl-11
                            "
                          />
                        </div>
                      </div>

                      {/* RAM */}

                      <div>
                        <label className="form-label">RAM</label>

                        <div className="relative">
                          <Cpu size={18} className="input-icon" />

                          <input
                            type="text"
                            name="ram"
                            value={phonePost.ram}
                            onChange={handleChange}
                            placeholder="
                              8 GB, 12 GB...
                            "
                            required
                            className="
                              modern-input
                              pl-11
                            "
                          />
                        </div>
                      </div>

                      {/* SIM */}

                      <div>
                        <label className="form-label">SIM kart</label>

                        <div className="relative">
                          <CreditCard size={18} className="input-icon" />

                          <input
                            type="text"
                            name="sim_card"
                            value={phonePost.sim_card}
                            onChange={handleChange}
                            placeholder="
                              1 SIM, 2 SIM, eSIM...
                            "
                            required
                            className="
                              modern-input
                              pl-11
                            "
                          />
                        </div>
                      </div>

                      {/* LOCATION */}

                      <div>
                        <label className="form-label">Yer</label>

                        <div className="relative">
                          <MapPin size={18} className="input-icon" />

                          <input
                            type="text"
                            name="location"
                            value={phonePost.location}
                            onChange={handleChange}
                            placeholder="
                              Bakı, Gəncə...
                            "
                            required
                            className="
                              modern-input
                              pl-11
                            "
                          />
                        </div>
                      </div>

                      {/* DESCRIPTION */}

                      <div className="md:col-span-2">
                        <label className="form-label">Elanın təsviri</label>

                        <div className="relative">
                          <FileText
                            size={18}
                            className="
                              absolute
                              left-4
                              top-4
                              text-slate-400
                            "
                          />

                          <textarea
                            name="description"
                            value={phonePost.description}
                            onChange={handleChange}
                            placeholder="
                              Telefonun vəziyyəti,
                              istifadə müddəti,
                              komplektasiyası və
                              digər məlumatları yazın...
                            "
                            required
                            rows={5}
                            className="
                              modern-input
                              pl-11
                              resize-none
                            "
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* =================================================
                      CONTACT
                  ================================================== */}

                  <section
                    className="
                      rounded-3xl
                      border
                      border-slate-200
                      dark:border-slate-800
                      overflow-hidden
                    "
                  >
                    <div
                      className="
                        px-5 py-4
                        bg-slate-50
                        dark:bg-slate-800/50
                        border-b
                        border-slate-200
                        dark:border-slate-800
                      "
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            w-9 h-9
                            rounded-xl
                            bg-emerald-100
                            dark:bg-emerald-500/10
                            text-emerald-600
                            flex items-center
                            justify-center
                          "
                        >
                          <User size={18} />
                        </div>

                        <div>
                          <h3
                            className="
                              font-bold
                              text-slate-900
                              dark:text-white
                            "
                          >
                            Əlaqə məlumatları
                          </h3>

                          <p
                            className="
                              text-xs
                              text-slate-500
                            "
                          >
                            Alıcıların sizinlə əlaqə saxlaması üçün
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="
                        p-5
                        grid
                        grid-cols-1
                        md:grid-cols-3
                        gap-5
                      "
                    >
                      {/* NAME */}

                      <div>
                        <label className="form-label">Ad</label>

                        <div className="relative">
                          <User size={18} className="input-icon" />

                          <input
                            type="text"
                            name="contact.name"
                            value={phonePost?.contact?.name || ""}
                            onChange={handleChange}
                            placeholder="Adınız"
                            required
                            className="
                              modern-input
                              pl-11
                            "
                          />
                        </div>
                      </div>

                      {/* EMAIL */}

                      <div>
                        <label className="form-label">E-mail</label>

                        <div className="relative">
                          <Mail size={18} className="input-icon" />

                          <input
                            type="email"
                            name="contact.email"
                            value={phonePost?.contact?.email || ""}
                            onChange={handleChange}
                            placeholder="example@mail.com"
                            required
                            className="
                              modern-input
                              pl-11
                            "
                          />
                        </div>
                      </div>

                      {/* PHONE */}

                      <div>
                        <label className="form-label">Telefon</label>

                        <div className="relative">
                          <Phone size={18} className="input-icon" />

                          <input
                            type="tel"
                            name="contact.phone"
                            value={phonePost?.contact?.phone || ""}
                            onChange={handleChange}
                            placeholder="
                              +994 XX XXX XX XX
                            "
                            required
                            className="
                              modern-input
                              pl-11
                            "
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* =================================================
                      IMAGES
                  ================================================== */}

                  <section
                    className="
                      rounded-3xl
                      border
                      border-slate-200
                      dark:border-slate-800
                      overflow-hidden
                    "
                  >
                    <div
                      className="
                        px-5 py-4
                        bg-slate-50
                        dark:bg-slate-800/50
                        border-b
                        border-slate-200
                        dark:border-slate-800
                      "
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            w-9 h-9
                            rounded-xl
                            bg-purple-100
                            dark:bg-purple-500/10
                            text-purple-600
                            flex items-center
                            justify-center
                          "
                        >
                          <ImagePlus size={18} />
                        </div>

                        <div>
                          <h3
                            className="
                              font-bold
                              text-slate-900
                              dark:text-white
                            "
                          >
                            Telefon şəkilləri
                          </h3>

                          <p
                            className="
                              text-xs
                              text-slate-500
                            "
                          >
                            Keyfiyyətli şəkillər elanınızı daha cəlbedici
                            göstərir
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      {/* UPLOAD */}

                      <label
                        className="
                          group
                          relative
                          flex
                          flex-col
                          items-center
                          justify-center
                          min-h-[170px]
                          rounded-2xl
                          border-2
                          border-dashed
                          border-slate-300
                          dark:border-slate-700
                          bg-slate-50/70
                          dark:bg-slate-800/30
                          hover:border-blue-500
                          hover:bg-blue-50/50
                          dark:hover:bg-blue-500/5
                          cursor-pointer
                          transition
                        "
                      >
                        <div
                          className="
                            w-14 h-14
                            rounded-2xl
                            bg-blue-100
                            dark:bg-blue-500/10
                            text-blue-600
                            flex
                            items-center
                            justify-center
                            mb-3
                            group-hover:scale-110
                            transition
                          "
                        >
                          <Upload size={25} />
                        </div>

                        <p
                          className="
                            font-bold
                            text-slate-700
                            dark:text-slate-200
                          "
                        >
                          Şəkilləri seçin
                        </p>

                        <p
                          className="
                            text-sm
                            text-slate-400
                            mt-1
                          "
                        >
                          JPG, PNG və digər şəkil formatları
                        </p>

                        <input
                          type="file"
                          name="images"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          required={!editingId && images.length === 0}
                          className="hidden"
                        />
                      </label>

                      {/* EXISTING */}

                      {existingImages.length > 0 && (
                        <div className="mt-5">
                          <div
                            className="
                              flex items-center
                              gap-2 mb-3
                            "
                          >
                            <span
                              className="
                                text-sm
                                font-bold
                                text-slate-700
                                dark:text-slate-200
                              "
                            >
                              Mövcud şəkillər
                            </span>

                            <span
                              className="
                                px-2 py-0.5
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
                              grid-cols-2
                              sm:grid-cols-4
                              md:grid-cols-5
                              gap-3
                            "
                          >
                            {existingImages.map((src, index) => (
                              <div
                                key={`${src}-${index}`}
                                className="
                                    relative
                                    aspect-square
                                    rounded-2xl
                                    overflow-hidden
                                    border
                                    border-slate-200
                                    dark:border-slate-700
                                    group
                                  "
                              >
                                <img
                                  src={src}
                                  alt={`Telefon ${index + 1}`}
                                  className="
                                      w-full
                                      h-full
                                      object-cover
                                    "
                                />

                                <button
                                  type="button"
                                  onClick={() => handleImageDelete(src)}
                                  className="
                                      absolute
                                      top-2
                                      right-2
                                      w-8 h-8
                                      rounded-xl
                                      bg-black/60
                                      text-white
                                      flex
                                      items-center
                                      justify-center
                                      opacity-100
                                      sm:opacity-0
                                      sm:group-hover:opacity-100
                                      transition
                                      hover:bg-red-500
                                    "
                                >
                                  <Trash2 size={15} />
                                </button>

                                {index === 0 && (
                                  <span
                                    className="
                                        absolute
                                        bottom-2
                                        left-2
                                        px-2 py-1
                                        rounded-lg
                                        bg-blue-600
                                        text-white
                                        text-[10px]
                                        font-bold
                                      "
                                  >
                                    ƏSAS
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* NEW */}

                      {preview.length > 0 && (
                        <div className="mt-5">
                          <div
                            className="
                              flex items-center
                              gap-2 mb-3
                            "
                          >
                            <span
                              className="
                                text-sm
                                font-bold
                                text-slate-700
                                dark:text-slate-200
                              "
                            >
                              Yeni seçilən şəkillər
                            </span>

                            <span
                              className="
                                px-2 py-0.5
                                rounded-full
                                bg-blue-100
                                text-blue-600
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
                              grid-cols-2
                              sm:grid-cols-4
                              md:grid-cols-5
                              gap-3
                            "
                          >
                            {preview.map((src, index) => (
                              <div
                                key={`${src}-${index}`}
                                className="
                                    relative
                                    aspect-square
                                    rounded-2xl
                                    overflow-hidden
                                    border
                                    border-blue-200
                                    dark:border-blue-500/30
                                    group
                                  "
                              >
                                <img
                                  src={src}
                                  alt={`Yeni şəkil ${index + 1}`}
                                  className="
                                      w-full
                                      h-full
                                      object-cover
                                    "
                                />

                                <button
                                  type="button"
                                  onClick={() => removeNewImage(index)}
                                  className="
                                      absolute
                                      top-2
                                      right-2
                                      w-8 h-8
                                      rounded-xl
                                      bg-black/60
                                      text-white
                                      flex
                                      items-center
                                      justify-center
                                      opacity-100
                                      sm:opacity-0
                                      sm:group-hover:opacity-100
                                      transition
                                      hover:bg-red-500
                                    "
                                >
                                  <X size={16} />
                                </button>

                                <span
                                  className="
                                      absolute
                                      bottom-2
                                      left-2
                                      px-2 py-1
                                      rounded-lg
                                      bg-emerald-600
                                      text-white
                                      text-[10px]
                                      font-bold
                                    "
                                >
                                  YENİ
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                {/* FOOTER */}

                <div
                  className="
                    sticky
                    bottom-0
                    z-20
                    flex
                    flex-col-reverse
                    sm:flex-row
                    sm:justify-end
                    gap-3
                    px-5 sm:px-7
                    py-4
                    border-t
                    border-slate-200
                    dark:border-slate-800
                    bg-white/95
                    dark:bg-slate-900/95
                    backdrop-blur-xl
                  "
                >
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={submitting}
                    className="
                      w-full
                      sm:w-auto
                      px-6 py-3
                      rounded-xl
                      border
                      border-slate-200
                      dark:border-slate-700
                      text-slate-700
                      dark:text-slate-200
                      font-semibold
                      hover:bg-slate-100
                      dark:hover:bg-slate-800
                      transition
                      disabled:opacity-50
                    "
                  >
                    Ləğv et
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="
                      w-full
                      sm:w-auto
                      min-w-[190px]
                      px-6 py-3
                      rounded-xl
                      bg-gradient-to-r
                      from-blue-600
                      to-indigo-600
                      text-white
                      font-bold
                      shadow-lg
                      shadow-blue-500/20
                      hover:shadow-xl
                      transition
                      disabled:opacity-60
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    {submitting ? (
                      <>
                        <RefreshCcw size={18} className="animate-spin" />
                        Göndərilir...
                      </>
                    ) : editingId ? (
                      <>
                        <Save size={18} />
                        Dəyişiklikləri yadda saxla
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        Elanı yerləşdir
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SEARCH LOADING */}

        {loading && (
          <div className="flex justify-center py-8">
            <div
              className="
                w-9 h-9
                border-4
                border-blue-200
                border-t-blue-600
                rounded-full
                animate-spin
              "
            />
          </div>
        )}

        {/* =====================================================
            MAIN LIST
        ====================================================== */}

        <section className="mt-8">
          <div
            className="
              flex
              items-end
              justify-between
              mb-5
            "
          >
            <div>
              <h2
                className="
                  text-xl sm:text-2xl
                  font-black
                  text-slate-900
                  dark:text-white
                "
              >
                Əlavə olunan elanlar
              </h2>

              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                  mt-1
                "
              >
                Telefon kateqoriyasındakı son elanlar
              </p>
            </div>

            <span
              className="
                px-3 py-1.5
                rounded-full
                bg-blue-100
                dark:bg-blue-500/10
                text-blue-600
                dark:text-blue-400
                text-xs
                font-bold
              "
            >
              {phoneItems.length} elan
            </span>
          </div>

          {/* SKELETON */}

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
              {Array.from({
                length: 12,
              }).map((_, i) => (
                <div
                  key={i}
                  className="
                    rounded-2xl
                    overflow-hidden
                    bg-white
                    dark:bg-slate-900
                    border
                    border-slate-200
                    dark:border-slate-800
                  "
                >
                  <div
                    className="
                      h-[125px]
                      bg-slate-200
                      dark:bg-slate-800
                      animate-pulse
                    "
                  />

                  <div className="p-3 space-y-3">
                    <div
                      className="
                        h-5
                        w-2/3
                        rounded
                        bg-slate-200
                        dark:bg-slate-800
                        animate-pulse
                      "
                    />

                    <div
                      className="
                        h-4
                        w-full
                        rounded
                        bg-slate-200
                        dark:bg-slate-800
                        animate-pulse
                      "
                    />

                    <div
                      className="
                        h-3
                        w-1/2
                        rounded
                        bg-slate-200
                        dark:bg-slate-800
                        animate-pulse
                      "
                    />

                    <div
                      className="
                        h-3
                        w-3/4
                        rounded
                        bg-slate-200
                        dark:bg-slate-800
                        animate-pulse
                      "
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : phoneItems.length === 0 ? (
            /* EMPTY */

            <div
              className="
                py-20
                flex
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <div
                className="
                  w-20 h-20
                  rounded-3xl
                  bg-slate-100
                  dark:bg-slate-900
                  flex
                  items-center
                  justify-center
                  text-slate-400
                  mb-4
                "
              >
                <Smartphone size={34} />
              </div>

              <h3
                className="
                  text-lg
                  font-bold
                  text-slate-800
                  dark:text-white
                "
              >
                Hələ elan yoxdur
              </h3>

              <p
                className="
                  text-sm
                  text-slate-500
                  mt-1
                "
              >
                İlk telefon elanını siz yerləşdirin.
              </p>

              <button
                type="button"
                onClick={handleOpenForm}
                className="
                  mt-5
                  px-5 py-3
                  rounded-xl
                  bg-blue-600
                  text-white
                  font-bold
                  hover:bg-blue-700
                  transition
                "
              >
                İlk elanı yerləşdir
              </button>
            </div>
          ) : (
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
              {[...phoneItems].reverse().map((item) => renderCard(item))}
            </div>
          )}
        </section>
      </div>

      {/* =====================================================
          FORM STYLES
      ====================================================== */}

      <style>{`
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #334155;
        }

        .dark .form-label {
          color: #e2e8f0;
        }

        .modern-input {
          width: 100%;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #0f172a;
          border-radius: 14px;
          padding: 13px 15px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
        }

        .modern-input::placeholder {
          color: #94a3b8;
        }

        .modern-input:hover {
          border-color: #cbd5e1;
        }

        .modern-input:focus {
          border-color: #3b82f6;
          background: #ffffff;
          box-shadow:
            0 0 0 4px rgba(59, 130, 246, 0.10);
        }

        .dark .modern-input {
          border-color: #334155;
          background: #0f172a;
          color: #f8fafc;
        }

        .dark .modern-input:hover {
          border-color: #475569;
        }

        .dark .modern-input:focus {
          border-color: #3b82f6;
          background: #111827;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        textarea.modern-input {
          line-height: 1.6;
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
