import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {
  X,
  Search,
  ArrowLeft,
  Plus,
  RefreshCcw,
  MapPin,
  Edit3,
  Trash2,
  Heart,
  ImagePlus,
  User,
  Mail,
  Phone,
  Tag,
  Package,
} from "lucide-react";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";

export default function CreateHousehold({
  businessId = null,
  businessName = "",
  businessCategory = null,
}) {
  const { id } = useParams();
  const API_URL = process.env.REACT_APP_API_URL || "";

  const [isOpen, setIsOpen] = useState(false);

  const [household, setHousehold] = useState({
    id: Date.now(),
    category: "",
    title: "",
    description: "",
    type_of_goods: "",
    brand: "",
    model: "",
    location: "",
    price: "",
    liked: false,
    favorite: false,
    data: new Date(),
    image: "",
    contact: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const [householdItems, setHouseholdItems] = useState([]);
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");

  // =========================================================
  // BUSINESS DEBUG
  // =========================================================

  useEffect(() => {
    console.log("🏪 CreateHousehold business context:", {
      businessId,
      businessName,
      businessCategory,
    });
  }, [businessId, businessName, businessCategory]);

  // =========================================================
  // IMAGE CHANGE
  // =========================================================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setPreview((prev) => [...prev, ...newPreviews]);

    e.target.value = "";
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("contact.")) {
      const field = name.split(".")[1];

      setHousehold((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [field]: value,
        },
      }));
    } else if (name === "data") {
      setHousehold((prev) => ({
        ...prev,
        data: new Date(value),
      }));
    } else {
      setHousehold((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // =========================================================
  // FETCH ITEMS
  // =========================================================

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/household`);

      setHouseholdItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Household elanları yüklənmədi:", error);
    }
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Elan yerləşdirmək üçün hesabınıza daxil olun.",
        confirmButtonColor: "#2563eb",
      });

      return;
    }

    // Yeni elan zamanı ən azı 1 şəkil tələb olunur
    if (!editingId && images.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Şəkil əlavə edin",
        text: "Elan yerləşdirmək üçün ən azı 1 şəkil seçməlisiniz.",
        confirmButtonColor: "#2563eb",
      });

      return;
    }

    const formData = new FormData();

    // =======================================================
    // BUSINESS ID
    // =======================================================

    if (businessId) {
      formData.append("businessId", businessId);

      console.log("🏪 Elan biznesdən yerləşdirilir:", businessId);
    } else {
      console.log("👤 Elan şəxsi profil üçün yerləşdirilir.");
    }

    // =======================================================
    // IMAGES
    // =======================================================

    images.forEach((file) => {
      formData.append("images", file);
    });

    // =======================================================
    // FORM DATA
    // =======================================================

    Object.entries(household).forEach(([key, value]) => {
      if (key === "data") return;

      if (key === "contact") {
        Object.entries(value).forEach(([contactKey, contactValue]) => {
          formData.append(`contact.${contactKey}`, contactValue);
        });
      } else if (key === "images") {
        if (Array.isArray(household.images)) {
          household.images.forEach((file) => {
            formData.append("images", file);
          });
        }
      } else {
        formData.append(key, value);
      }
    });

    formData.append(
      "data",
      household.data instanceof Date
        ? household.data.toISOString()
        : new Date().toISOString(),
    );

    // =======================================================
    // DEBUG FORMDATA
    // =======================================================

    console.log("📦 Göndərilən FormData:");

    for (const [key, value] of formData.entries()) {
      if (key === "images") {
        console.log("images:", value?.name || value);
      } else {
        console.log(`${key}:`, value);
      }
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${currentToken}`,
      },
    };

    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/api/household/${editingId}`,
          formData,
          config,
        );

        Swal.fire({
          icon: "success",
          title: "Elan yeniləndi!",
          text: "Elan məlumatları uğurla yeniləndi.",
          confirmButtonColor: "#2563eb",
        });
      } else {
        const response = await axios.post(
          `${API_URL}/api/household`,
          formData,
          config,
        );

        console.log("✅ Household elan cavabı:", response.data);

        Swal.fire({
          icon: "success",
          title: "Elanınız uğurla yerləşdirildi!",
          text: "Elanınız artıq sistemdə görünür.",
          confirmButtonColor: "#2563eb",
        });
      }

      resetForm();
      setIsOpen(false);

      await fetchItems();
    } catch (err) {
      console.error("Submit error:", err);

      console.error("❌ API RESPONSE:", err.response?.data);

      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text: err.response?.data?.message || "Server xətası baş verdi.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setHousehold({
      id: Date.now(),
      category: "",
      title: "",
      description: "",
      type_of_goods: "",
      brand: "",
      model: "",
      location: "",
      price: "",
      liked: false,
      favorite: false,
      data: new Date(),
      image: "",
      contact: {
        name: "",
        email: "",
        phone: "",
      },
    });

    setImages([]);
    setPreview([]);
    setEditingId(null);
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (itemId) => {
    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Bu əməliyyatı etmək üçün hesabınıza daxil olun.",
        confirmButtonColor: "#2563eb",
      });

      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "Elanı silmək istəyirsiniz?",
      text: "Bu əməliyyat geri qaytarıla bilməz.",
      showCancelButton: true,
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Ləğv et",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/api/household/${itemId}`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      await fetchItems();

      Swal.fire({
        icon: "success",
        title: "Elan silindi",
        text: "Elan uğurla silindi.",
        confirmButtonColor: "#2563eb",
      });
    } catch (error) {
      console.error("Delete error:", error);

      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text: error.response?.data?.message || "Elanı silmək mümkün olmadı.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  // =========================================================
  // FAVORITE
  // =========================================================

  const handleFavorite = async (itemId) => {
    try {
      await axios.patch(`${API_URL}/api/household/${itemId}/favorite`);

      await fetchItems();
    } catch (err) {
      console.error("Favorite error:", err);
    }
  };

  // =========================================================
  // LIKE
  // =========================================================

  const handleLike = async (itemId) => {
    try {
      await axios.patch(`${API_URL}/api/household/${itemId}/like`);

      await fetchItems();
    } catch (err) {
      console.error("Like error:", err);
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
        confirmButtonColor: "#2563eb",
      });

      return;
    }

    const itemId = item?._id || item?.id;

    if (!itemId) {
      Swal.fire({
        icon: "error",
        title: "Xəta",
        text: "Elanın ID-si tapılmadı.",
        confirmButtonColor: "#2563eb",
      });

      return;
    }

    setHousehold({
      ...item,

      category: item.category || item.household?.category || "",

      title: item.title || item.household?.title || "",

      description: item.description || item.household?.description || "",

      type_of_goods: item.type_of_goods || item.household?.type_of_goods || "",

      brand: item.brand || item.household?.brand || "",

      model: item.model || item.household?.model || "",

      location: item.location || item.household?.location || "",

      price: item.price ?? "",

      contact: {
        name: item.contact?.name || item.household?.contact?.name || "",

        email: item.contact?.email || item.household?.contact?.email || "",

        phone: item.contact?.phone || item.household?.contact?.phone || "",
      },

      data: item.data ? new Date(item.data) : new Date(),
    });

    setEditingId(itemId);

    const existingImages = Array.isArray(item.images)
      ? item.images
          .map((img) => {
            if (typeof img === "string") {
              return img;
            }

            return img?.url || img?.secure_url || img?.path || "";
          })
          .filter(Boolean)
      : item.mainImage
        ? [item.mainImage]
        : [];

    setPreview(existingImages);
    setImages([]);
    setIsOpen(true);
  };

  // =========================================================
  // IMAGE DELETE
  // =========================================================

  const handleImageDelete = async (image) => {
    try {
      await axios.delete(
        `${API_URL}/api/household/images/${encodeURIComponent(image)}`,
      );

      await fetchItems();
    } catch (error) {
      console.error("Image delete error:", error);
    }
  };

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const postDate = new Date(dateString);
    const now = new Date();

    const today = new Date(now);
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

  const getCurrentTime = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);

    return date.toTimeString().split(" ")[0].slice(0, 5);
  };

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchItems();
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  const apiUrls = [`${API_URL}/api/household`];

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const requests = apiUrls.map((url) => axios.get(url));

      const responses = await Promise.all(requests);

      let allData = [];

      responses.forEach((res) => {
        if (Array.isArray(res.data)) {
          allData = allData.concat(res.data);
        }
      });

      const searchText = query.toLowerCase().trim();

      const filtered = allData.filter((item) => {
        const title = String(
          item.title || item.household?.title || "",
        ).toLowerCase();

        const brand = String(
          item.brand || item.household?.brand || "",
        ).toLowerCase();

        const category = String(
          item.category || item.household?.category || "",
        ).toLowerCase();

        const model = String(
          item.model || item.household?.model || "",
        ).toLowerCase();

        const typeOfGoods = String(
          item.type_of_goods || item.household?.type_of_goods || "",
        ).toLowerCase();

        const location = String(
          item.location || item.household?.location || "",
        ).toLowerCase();

        const city = String(item.city || "").toLowerCase();

        const price = String(item.price ?? "").toLowerCase();

        const description = String(
          item.description || item.household?.description || "",
        ).toLowerCase();

        return (
          title.includes(searchText) ||
          brand.includes(searchText) ||
          category.includes(searchText) ||
          model.includes(searchText) ||
          typeOfGoods.includes(searchText) ||
          location.includes(searchText) ||
          city.includes(searchText) ||
          price.includes(searchText) ||
          description.includes(searchText)
        );
      });

      setResults(filtered);
    } catch (error) {
      console.error("API axtarış xətası:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(`${API_URL}/api/household`);

        setHouseholdItems(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("API xətası:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  // =========================================================
  // OPEN FORM
  // =========================================================

  const handleOpenForm = () => {
    if (!token) {
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

  // =========================================================
  // CARD DATA HELPERS
  // =========================================================

  const getItemId = (item) => {
    return item?._id || item?.id;
  };

  const getCardTitle = (item) => {
    return item?.title || item?.household?.title || "Məişət texnikası";
  };

  const getCardCategory = (item) => {
    return item?.category || item?.household?.category || "";
  };

  const getCardType = (item) => {
    return item?.type_of_goods || item?.household?.type_of_goods || "";
  };

  const getCardModel = (item) => {
    return item?.model || item?.household?.model || "";
  };

  const getCardImage = (item) => {
    if (Array.isArray(item?.images) && item.images.length > 0) {
      const firstImage = item.images[0];

      if (typeof firstImage === "string") {
        return firstImage;
      }

      return firstImage?.url || firstImage?.secure_url || "/placeholder.png";
    }

    if (item?.mainImage) {
      return item.mainImage;
    }

    if (Array.isArray(item?.imageUrls) && item.imageUrls.length > 0) {
      return item.imageUrls[0];
    }

    return "/placeholder.png";
  };

  // =========================================================
  // OWNER CHECK
  // =========================================================

  const currentUserId = localStorage.getItem("userId");

  const isOwner = (item) => {
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
  // OWNER BUTTONS
  // =========================================================

  const OwnerButtons = ({ item }) => {
    const itemId = getItemId(item);

    if (!isOwner(item)) {
      return null;
    }

    return (
      <div
        className="absolute right-2 top-2 z-40 flex gap-1"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleEdit(item);
          }}
          title="Elanı redaktə et"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-blue-700 active:scale-95"
        >
          <Edit3 size={15} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDelete(itemId);
          }}
          title="Elanı sil"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-red-700 active:scale-95"
        >
          <Trash2 size={15} />
        </button>
      </div>
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        {/* SEARCH */}

        <div className="mx-auto max-w-[700px]">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-28 text-sm text-slate-700 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              placeholder="Məişət texnikası axtar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            <button
              type="button"
              onClick={handleSearch}
              className="absolute right-1.5 top-1.5 flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95"
            >
              <Search size={16} />
              Axtar
            </button>
          </div>
        </div>

        {/* TOP */}

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowLeft size={18} />
              Geri
            </button>
          </Link>

          <div className="text-center sm:text-right">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Məişət Texnikası
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Məişət texnikası elanlarını kəşf edin
            </p>
          </div>
        </div>

        {/* BUSINESS INFO */}

        {businessId && (
          <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 dark:border-blue-900/40 dark:bg-blue-950/30">
            <p className="text-xs font-medium text-blue-500">Biznes profili</p>

            <p className="mt-1 font-bold text-blue-700 dark:text-blue-300">
              {businessName || "Biznes"}
            </p>
          </div>
        )}

        {/* ADD BUTTON */}

        <div className="mt-5">
          <button
            type="button"
            onClick={handleOpenForm}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl active:scale-[0.98] sm:w-auto"
          >
            <Plus size={19} />
            Elan yerləşdir
          </button>
        </div>

        {/* MODAL */}

        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-md">
            <div className="relative flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl dark:bg-slate-900">
              {/* HEADER */}

              <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                    {editingId ? <RefreshCcw size={20} /> : <Plus size={21} />}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                      {editingId ? "Elanı redaktə et" : "Yeni elan yerləşdir"}
                    </h2>

                    <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                      {editingId
                        ? "Elan məlumatlarını yeniləyin"
                        : "Məişət texnikanızı sürətli şəkildə elan edin"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsOpen(false);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-red-50 hover:text-red-500 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-red-500/10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="max-h-[calc(94vh-80px)] overflow-y-auto px-4 py-5 sm:px-7 sm:py-7"
              >
                {/* BASIC INFO */}

                <div className="mb-7">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <Package size={18} />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        Əsas məlumatlar
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Məhsul haqqında əsas məlumatları daxil edin
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* CATEGORY */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Kateqoriya
                      </label>

                      <div className="relative">
                        <Tag
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                        />

                        <input
                          type="text"
                          name="category"
                          placeholder="Məsələn: Soyuducu"
                          value={household.category}
                          onChange={handleChange}
                          required
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* TITLE */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Elanın başlığı
                      </label>

                      <input
                        type="text"
                        name="title"
                        placeholder="Məsələn: Samsung soyuducu"
                        value={household.title}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>

                    {/* TYPE */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Məhsul növü
                      </label>

                      <input
                        type="text"
                        name="type_of_goods"
                        placeholder="Məsələn: Böyük məişət texnikası"
                        value={household.type_of_goods}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>

                    {/* BRAND */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Marka
                      </label>

                      <input
                        type="text"
                        name="brand"
                        placeholder="Məsələn: Samsung"
                        value={household.brand}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>

                    {/* MODEL */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Model
                      </label>

                      <input
                        type="text"
                        name="model"
                        placeholder="Məsələn: RB34T600"
                        value={household.model}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>

                    {/* PRICE */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Qiymət
                      </label>

                      <div className="relative">
                        <input
                          type="number"
                          name="price"
                          placeholder="0"
                          min="0"
                          value={household.price}
                          onChange={handleChange}
                          required
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-14 text-sm font-semibold outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                          AZN
                        </span>
                      </div>
                    </div>

                    {/* LOCATION */}

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Məkan
                      </label>

                      <div className="relative">
                        <MapPin
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                        />

                        <input
                          type="text"
                          name="location"
                          placeholder="Məsələn: Bakı"
                          value={household.location}
                          onChange={handleChange}
                          required
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION */}

                <div className="mb-7 border-t border-slate-100 pt-6 dark:border-slate-800">
                  <div className="mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      Elan haqqında
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Məhsulun vəziyyətini və xüsusiyyətlərini ətraflı yazın
                    </p>
                  </div>

                  <textarea
                    name="description"
                    value={household.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Məsələn: Məhsul yaxşı vəziyyətdədir, problemsiz işləyir..."
                    required
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                {/* CONTACT */}

                <div className="mb-7 border-t border-slate-100 pt-6 dark:border-slate-800">
                  <div className="mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      Əlaqə məlumatları
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Alıcıların sizinlə əlaqə saxlaması üçün
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* NAME */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Ad
                      </label>

                      <div className="relative">
                        <User
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="text"
                          name="contact.name"
                          placeholder="Adınız"
                          value={household.contact.name}
                          onChange={handleChange}
                          required
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* EMAIL */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        E-mail
                      </label>

                      <div className="relative">
                        <Mail
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="email"
                          name="contact.email"
                          placeholder="example@mail.com"
                          value={household.contact.email}
                          onChange={handleChange}
                          required
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* PHONE */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Telefon
                      </label>

                      <div className="relative">
                        <Phone
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="tel"
                          name="contact.phone"
                          placeholder="+994 XX XXX XX XX"
                          value={household.contact.phone}
                          onChange={handleChange}
                          required
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* IMAGES */}

                <div className="mb-7 border-t border-slate-100 pt-6 dark:border-slate-800">
                  <div className="mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      Məhsul şəkilləri
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Elanınızın daha cəlbedici görünməsi üçün şəkillər əlavə
                      edin
                    </p>
                  </div>

                  <label className="group flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-500 dark:hover:bg-blue-500/5">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-500/10 dark:text-blue-400">
                      <ImagePlus size={26} />
                    </div>

                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      Şəkilləri seçin
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      JPG, PNG və JPEG • Bir neçə şəkil seçə bilərsiniz
                    </p>

                    <input
                      type="file"
                      name="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {/* PREVIEW */}

                  {preview.length > 0 && (
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {preview.map((src, idx) => (
                        <div
                          key={`${src}-${idx}`}
                          className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
                        >
                          <img
                            src={src}
                            alt={`preview-${idx}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              setPreview((prev) =>
                                prev.filter((_, i) => i !== idx),
                              );

                              if (idx < images.length) {
                                setImages((prev) =>
                                  prev.filter((_, i) => i !== idx),
                                );
                              }
                            }}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>

                          {idx === 0 && (
                            <div className="absolute bottom-2 left-2 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                              Əsas şəkil
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ACTIONS */}

                <div className="sticky bottom-0 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:-mx-7 sm:px-7">
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setIsOpen(false);
                      }}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      Ləğv et
                    </button>

                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl active:scale-[0.98] sm:w-auto"
                    >
                      {editingId ? (
                        <>
                          <RefreshCcw size={18} />
                          Elanı yenilə
                        </>
                      ) : (
                        <>
                          <Plus size={18} />
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

        {/* SEARCH RESULTS */}

        <div className="mt-6">
          {loading && (
            <div className="flex justify-center py-8">
              <CircularProgress />
            </div>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Search size={25} />
              </div>

              <h3 className="font-bold text-slate-800 dark:text-white">
                Nəticə tapılmadı
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                "{query}" üçün uyğun elan yoxdur.
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Axtarış nəticələri
                </h3>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  {results.length} elan
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {results.map((item) => {
                  const itemId = getItemId(item);

                  return (
                    <Link
                      key={itemId}
                      target="_top"
                      rel="noopener noreferrer"
                      to={`/PostDetailHousehold/${itemId}`}
                    >
                      <div className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:ring-slate-800">
                        <OwnerButtons item={item} />

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFavorite(itemId);
                          }}
                          className="absolute left-2 top-2 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:text-red-500 dark:bg-slate-900/90"
                        >
                          <Heart
                            size={15}
                            fill={item.favorite ? "currentColor" : "none"}
                          />
                        </button>

                        <img
                          src={getCardImage(item)}
                          alt={getCardTitle(item)}
                          className="h-[150px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="p-3">
                          <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                            {item.price} AZN
                          </p>

                          <h3 className="mt-1 truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {getCardTitle(item)}
                          </h3>

                          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                            {getCardCategory(item)} {getCardType(item)}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                            {getCardModel(item)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* SEPARATOR */}

        <div className="my-8 h-px w-full bg-slate-200 dark:bg-slate-800" />

        {/* ALL LISTINGS */}

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Əlavə olunan elanlar
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Son əlavə olunan məişət texnikası elanları
            </p>
          </div>

          <div className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            {householdItems.length} elan
          </div>
        </div>

        {/* LISTINGS */}

        <div className="grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-[245px] w-full max-w-[230px] animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900"
              >
                <div className="h-[125px] bg-slate-200 dark:bg-slate-800" />

                <div className="space-y-3 p-3">
                  <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))
          ) : householdItems.length === 0 ? (
            <div className="col-span-full flex w-full flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Package size={30} />
              </div>

              <h3 className="font-bold text-slate-800 dark:text-white">
                Hələ elan yoxdur
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                İlk elanı siz yerləşdirə bilərsiniz.
              </p>

              <button
                type="button"
                onClick={handleOpenForm}
                className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700"
              >
                <Plus size={18} />
                İlk elanı yerləşdir
              </button>
            </div>
          ) : (
            [...householdItems].reverse().map((item) => {
              const itemId = getItemId(item);

              return (
                <Link
                  target="_top"
                  rel="noopener noreferrer"
                  key={itemId}
                  to={`/PostDetailHousehold/${itemId}`}
                  className="w-full max-w-[230px]"
                >
                  <div className="group relative w-full overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-slate-900 dark:ring-slate-800">
                    <OwnerButtons item={item} />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFavorite(itemId);
                      }}
                      className="absolute left-2 top-2 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:text-red-500 dark:bg-slate-900/90"
                      title="Seçilmişlərə əlavə et"
                    >
                      <Heart
                        size={15}
                        fill={item.favorite ? "currentColor" : "none"}
                      />
                    </button>

                    <div className="relative h-[125px] overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={getCardImage(item)}
                        alt={getCardTitle(item)}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate text-lg font-extrabold text-slate-900 dark:text-white">
                          {item.price} AZN
                        </h3>

                        {item.liked && (
                          <Heart
                            size={14}
                            className="mt-1 shrink-0 text-red-500"
                            fill="currentColor"
                          />
                        )}
                      </div>

                      <p className="mt-1 truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {getCardCategory(item)} {getCardTitle(item)}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                        {getCardModel(item)}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <p className="flex min-w-0 items-center gap-1 truncate text-[10px] text-slate-500 dark:text-slate-400">
                          <MapPin
                            size={12}
                            className="shrink-0 text-emerald-500"
                          />

                          <span className="truncate">
                            {item.location || "Bakı"}
                          </span>
                        </p>

                        <p className="shrink-0 text-[10px] text-slate-400">
                          {formatDate(item.data)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
