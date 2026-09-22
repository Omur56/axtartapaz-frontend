import React, { useEffect, useState } from "react";

import axios from "axios";

import { Link, useParams } from "react-router-dom";

import {
  X,
  MapPin,
  Edit3,
  Trash2,
  Heart,
  Search,
  ArrowLeft,
  Plus,
} from "lucide-react";

import Swal from "sweetalert2";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CreateelectronicsPost({
  businessId = null,
  businessName = "",
  businessCategory = null,
}) {
  const { id } = useParams();

  const API_URL = process.env.REACT_APP_API_URL || "";

  const [isOpen, setIsOpen] = useState(false);

  const [elektronikaPost, setelectronicsPost] = useState({
    id: Date.now(),
    title: "",
    brand: "",
    model: "",
    price: "",
    location: "",
    images: [],
    description: "",
    businessId: businessId || null,
    contact: {
      name: "",
      email: "",
      phone: "",
    },
    liked: false,
    favorite: false,
    data: new Date(),
  });

  const [elektronikaItems, setelectronicsItems] = useState([]);
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [item, setItem] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  // =========================================================
  // BUSINESS ID
  // =========================================================

  const finalBusinessId = businessId || elektronikaPost?.businessId || null;

  // =========================================================
  // ID
  // =========================================================

  const getId = (item) => {
    return item?._id || item?.id;
  };

  // =========================================================
  // ELANIN SAHİBİ
  // =========================================================

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
  // ŞƏKİL ƏLAVƏ ET
  // =========================================================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setImages((prev) => [...prev, ...files]);

    setPreview((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("contact.")) {
      const field = name.split(".")[1];

      setelectronicsPost((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [field]: value,
        },
      }));
    } else if (name === "data") {
      setelectronicsPost((prev) => ({
        ...prev,
        data: new Date(value),
      }));
    } else {
      setelectronicsPost((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // =========================================================
  // ELANLARI GƏTİR
  // =========================================================

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/electronics`);

      setelectronicsItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Elektronika elanları alınmadı:", err);
    }
  };

  // =========================================================
  // FORM SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Bu əməliyyatı etmək üçün hesabınıza daxil olun.",
        confirmButtonText: "Bağla",
      });

      return;
    }

    const formData = new FormData();

    // =======================================================
    // ŞƏKİLLƏR
    // =======================================================

    images.forEach((file) => {
      formData.append("images", file);
    });

    // =======================================================
    // BİZNES ELANI
    // =======================================================

    const submitBusinessId = businessId || elektronikaPost?.businessId || null;

    if (submitBusinessId) {
      formData.append("businessId", String(submitBusinessId));
    }

    console.log("========================================");

    console.log("💻 ELEKTRONİKA ELAN GÖNDƏRİLİR");

    console.log("🏪 Business ID:", submitBusinessId);

    console.log("🏪 Business Name:", businessName);

    console.log("🏪 Business Category:", businessCategory);

    console.log("🏪 FormData businessId:", formData.get("businessId"));

    console.log("========================================");

    // =======================================================
    // ƏSAS MƏLUMATLAR
    // =======================================================

    formData.append("title", elektronikaPost.title);

    formData.append("brand", elektronikaPost.brand);

    formData.append("model", elektronikaPost.model);

    formData.append("price", elektronikaPost.price);

    formData.append("location", elektronikaPost.location);

    formData.append("description", elektronikaPost.description);

    // =======================================================
    // CONTACT
    // =======================================================

    formData.append("contact", JSON.stringify(elektronikaPost.contact));

    // =======================================================
    // TARİX
    // =======================================================

    formData.append(
      "data",
      elektronikaPost.data instanceof Date
        ? elektronikaPost.data.toISOString()
        : new Date().toISOString(),
    );

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // =====================================================
      // REDAKTƏ
      // =====================================================

      if (editingId) {
        await axios.put(`${API_URL}/api/electronics/${editingId}`, formData, {
          headers,
        });

        await Swal.fire({
          icon: "success",
          title: "Elan yeniləndi!",
          text: "Elan məlumatları uğurla dəyişdirildi.",
          confirmButtonText: "Bağla",
        });
      }

      // =====================================================
      // YENİ ELAN
      // =====================================================
      else {
        await axios.post(`${API_URL}/api/electronics`, formData, {
          headers,
        });

        await Swal.fire({
          icon: "success",
          title: "Elan uğurla yerləşdirildi!",
          confirmButtonText: "Bağla",
        });
      }

      resetForm();

      setIsOpen(false);

      await fetchItems();
    } catch (err) {
      console.error(err.response?.data || err.message);

      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text: err.response?.data?.message || "Server xətası",
        confirmButtonText: "Bağla",
      });
    }
  };

  // =========================================================
  // FORM RESET
  // =========================================================

  const resetForm = () => {
    setelectronicsPost({
      id: Date.now(),
      title: "",
      brand: "",
      model: "",
      price: "",
      location: "",
      images: [],
      description: "",

      // BİZNES ƏLAQƏSİ QORUNUR
      businessId: businessId || null,

      contact: {
        name: "",
        email: "",
        phone: "",
      },

      liked: false,
      favorite: false,
      data: new Date(),
    });

    setImages([]);
    setPreview([]);
    setEditingId(null);
  };

  // =========================================================
  // DETAIL ITEM
  // =========================================================

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${API_URL}/api/electronics/${id}`)
      .then((res) => {
        setItem(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, API_URL]);

  // =========================================================
  // SİLMƏ
  // =========================================================

  const handleDelete = async (deleteId) => {
    if (!deleteId) return;

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Elanı silmək üçün hesabınıza daxil olun.",
        confirmButtonText: "Bağla",
      });

      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "Elanı silmək istəyirsiniz?",
      text: "Bu əməliyyatı geri qaytarmaq mümkün olmayacaq.",
      showCancelButton: true,
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Ləğv et",
      reverseButtons: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/api/electronics/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setelectronicsItems((prev) =>
        prev.filter(
          (currentItem) => String(getId(currentItem)) !== String(deleteId),
        ),
      );

      setResults((prev) =>
        prev.filter(
          (currentItem) => String(getId(currentItem)) !== String(deleteId),
        ),
      );

      await Swal.fire({
        icon: "success",
        title: "Elan silindi",
        text: "Elektronika elanı uğurla silindi.",
        confirmButtonText: "Bağla",
      });

      await fetchItems();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err);

      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text: err.response?.data?.message || "Elanı silmək mümkün olmadı.",
        confirmButtonText: "Bağla",
      });
    }
  };

  // =========================================================
  // FAVORİT
  // =========================================================

  const handleFavorite = async (favoriteId) => {
    try {
      await axios.patch(
        `${API_URL}/api/electronics/${favoriteId}/favorite`,
        {},
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        },
      );

      await fetchItems();
    } catch (err) {
      console.error("Favorite error:", err);

      Swal.fire({
        icon: "error",
        title: "Xəta",
        text: err.response?.data?.message || "Favorit əməliyyatı alınmadı.",
        confirmButtonText: "Bağla",
      });
    }
  };

  // =========================================================
  // LIKE
  // =========================================================

  const handleLike = async (likeId) => {
    try {
      await axios.patch(
        `${API_URL}/api/electronics/${likeId}/like`,
        {},
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        },
      );

      await fetchItems();
    } catch (err) {
      console.error("Like error:", err);

      Swal.fire({
        icon: "error",
        title: "Xəta",
        text: err.response?.data?.message || "Bəyənmə əməliyyatı alınmadı.",
        confirmButtonText: "Bağla",
      });
    }
  };

  // =========================================================
  // REDAKTƏ
  // =========================================================

  const handleEdit = (editItem) => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Elanı redaktə etmək üçün hesabınıza daxil olun.",
        confirmButtonText: "Bağla",
      });

      return;
    }

    if (!isOwner(editItem)) {
      Swal.fire({
        icon: "warning",
        title: "İcazə yoxdur",
        text: "Bu elan sizə məxsus deyil.",
        confirmButtonText: "Bağla",
      });

      return;
    }

    const editId = getId(editItem);

    if (!editId) {
      Swal.fire({
        icon: "error",
        title: "Xəta",
        text: "Elanın ID-si tapılmadı.",
        confirmButtonText: "Bağla",
      });

      return;
    }

    setelectronicsPost({
      ...editItem,

      // MÖVCUD BİZNES ID QORUNUR
      businessId: editItem.businessId || businessId || null,

      contact: {
        name: editItem.contact?.name || "",

        email: editItem.contact?.email || "",

        phone: editItem.contact?.phone || "",
      },

      data: editItem.createdAt
        ? new Date(editItem.createdAt)
        : editItem.data
          ? new Date(editItem.data)
          : new Date(),
    });

    setEditingId(editId);

    setPreview(
      Array.isArray(editItem.images)
        ? editItem.images
        : editItem.mainImage
          ? [editItem.mainImage]
          : [],
    );

    // Mövcud şəkillər yeni fayl kimi göndərilməsin
    setImages([]);

    // Redaktə formasını aç
    setIsOpen(true);
  };

  // =========================================================
  // TARİX
  // =========================================================

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

  // =========================================================
  // SAAT
  // =========================================================

  const getCurrentTime = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

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

  const apiUrls = [`${API_URL}/api/electronics`];

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

      const searchText = query.toLowerCase();

      const filtered = allData.filter((item) => {
        const title = item.title?.toLowerCase() || "";

        const brand = item.brand?.toLowerCase() || "";

        const category = item.category?.toLowerCase() || "";

        const model = item.model?.toLowerCase() || "";

        const type_of_gods = item.type_of_gods?.toLowerCase() || "";

        const location = item.location?.toLowerCase() || "";

        const city = item.city?.toLowerCase() || "";

        const engine = item.engine?.toLowerCase() || "";

        const year = String(item.year || "").toLowerCase();

        const motor = item.motor?.toLowerCase() || "";

        const transmission = item.transmission?.toLowerCase() || "";

        const ban_type = item.ban_type?.toLowerCase() || "";

        const price = String(item.price || "").toLowerCase();

        const description = item.description?.toLowerCase() || "";

        return (
          title.includes(searchText) ||
          brand.includes(searchText) ||
          category.includes(searchText) ||
          location.includes(searchText) ||
          model.includes(searchText) ||
          city.includes(searchText) ||
          engine.includes(searchText) ||
          year.includes(searchText) ||
          motor.includes(searchText) ||
          transmission.includes(searchText) ||
          ban_type.includes(searchText) ||
          price.includes(searchText) ||
          description.includes(searchText) ||
          type_of_gods.includes(searchText)
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
        const [electronicsRes] = await Promise.all([
          axios.get(`${API_URL}/api/electronics`),
        ]);

        setelectronicsItems(
          Array.isArray(electronicsRes.data) ? electronicsRes.data : [],
        );
      } catch (err) {
        console.error("API xətası:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [API_URL]);

  // =========================================================
  // FORM AÇ
  // =========================================================

  const handleOpenForm = () => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Elan paylaşmaq üçün hesabınıza daxil olun.",
        confirmButtonColor: "#3085d6",
      });

      return;
    }

    resetForm();

    setIsOpen(true);
  };

  // =========================================================
  // CARD IMAGE
  // =========================================================

  const getCardImage = (item) => {
    if (Array.isArray(item?.images) && item.images.length > 0) {
      const first = item.images[0];

      if (typeof first === "string") {
        return first;
      }

      return first?.url || first?.secure_url || "/placeholder.png";
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
  // OWNER BUTTONS
  // =========================================================

  const OwnerButtons = ({ item, itemId }) => {
    if (!isOwner(item)) return null;

    return (
      <div
        className="
          absolute
          right-2
          top-2
          z-40
          flex
          gap-1
        "
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* REDAKTƏ */}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            handleEdit(item);
          }}
          title="Elanı redaktə et"
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-blue-600
            text-white
            shadow-lg
            transition-all
            duration-200
            hover:bg-blue-700
            hover:scale-110
            active:scale-95
          "
        >
          <Edit3 size={15} />
        </button>

        {/* SİL */}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            handleDelete(itemId);
          }}
          title="Elanı sil"
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-red-600
            text-white
            shadow-lg
            transition-all
            duration-200
            hover:bg-red-700
            hover:scale-110
            active:scale-95
          "
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
    <div className="min-h-screen">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* SEARCH */}

        <div className="w-full max-w-[700px] mx-auto">
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              bg-white
              border
              border-slate-200
              shadow-sm
              transition-all
              focus-within:ring-2
              focus-within:ring-blue-500/20
            "
          >
            <input
              className="
                w-full
                bg-transparent
                text-slate-700
                placeholder:text-slate-400
                text-sm
                pl-4
                pr-24
                py-3
                outline-none
              "
              placeholder="Elektronika axtar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            <button
              className="
                absolute
                right-1.5
                top-1.5
                bottom-1.5
                px-3
                rounded-xl
                bg-blue-600
                text-white
                flex
                items-center
                gap-1.5
                text-sm
                font-medium
                shadow-sm
                transition-all
                hover:bg-blue-700
                active:scale-95
              "
              type="button"
              onClick={handleSearch}
            >
              <Search size={16} />
              Axtar
            </button>
          </div>
        </div>

        {/* BACK */}

        <Link
          to="/"
          className="
            inline-flex
            mt-5
            mb-5
            items-center
            gap-2
            bg-white
            hover:bg-slate-100
            text-slate-700
            px-4
            py-2.5
            rounded-xl
            border
            border-slate-200
            shadow-sm
            transition
          "
        >
          <ArrowLeft size={18} />
          Geri
        </Link>

        {/* TITLE */}

        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h2
              className="
                text-2xl
                sm:text-3xl
                font-bold
              "
            >
              Elektronika
            </h2>

            <p
              className="
                text-sm
                mt-1
              "
            >
              Elektronika elanlarına baxın
            </p>
          </div>

          <button
            onClick={handleOpenForm}
            className="
              hidden
              sm:flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-medium
              shadow-md
              transition-all
              active:scale-95
            "
          >
            <Plus size={18} />
            Elan yerləşdir
          </button>
        </div>

        {/* MOBILE ADD BUTTON */}

        <button
          onClick={handleOpenForm}
          className="
            sm:hidden
            w-full
            mb-5
            flex
            items-center
            justify-center
            gap-2
            px-4
            py-3
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-medium
            shadow-md
            transition
          "
        >
          <Plus size={18} />
          Elan yerləşdir
        </button>

        {/* MODAL */}

        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-md">
            <div className="relative max-h-[94vh] w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl dark:bg-slate-900">
              {/* HEADER */}

              <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-7">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                      {editingId ? <Edit3 size={20} /> : <Plus size={21} />}
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                        {editingId ? "Elanı redaktə et" : "Yeni elan yerləşdir"}
                      </h2>

                      <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                        {editingId
                          ? "Elan məlumatlarını yenilə"
                          : "Məhsulunuzu sürətli və rahat şəkildə əlavə edin"}
                      </p>
                    </div>
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

              {/* FORM CONTENT */}

              <form
                onSubmit={handleSubmit}
                className="max-h-[calc(94vh-80px)] overflow-y-auto px-4 py-5 sm:px-7 sm:py-7"
              >
                {/* BASIC INFO */}

                <div className="mb-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 dark:bg-blue-500/10">
                      <Search size={18} />
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
                    {/* TITLE */}

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Elanın başlığı
                      </label>

                      <input
                        type="text"
                        name="title"
                        value={elektronikaPost.title}
                        onChange={handleChange}
                        placeholder="Məsələn: iPhone 15 Pro Max"
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                      />
                    </div>

                    {/* BRAND */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Brend
                      </label>

                      <input
                        type="text"
                        name="brand"
                        value={elektronikaPost.brand}
                        onChange={handleChange}
                        placeholder="Məsələn: Apple"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
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
                        value={elektronikaPost.model}
                        onChange={handleChange}
                        placeholder="Məsələn: 15 Pro Max"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
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
                          value={elektronikaPost.price}
                          onChange={handleChange}
                          placeholder="0"
                          min="0"
                          required
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-14 text-sm font-semibold outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                          AZN
                        </span>
                      </div>
                    </div>

                    {/* LOCATION */}

                    <div>
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
                          value={elektronikaPost.location}
                          onChange={handleChange}
                          placeholder="Məsələn: Bakı"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION */}

                <div className="mb-6 border-t border-slate-100 pt-6 dark:border-slate-800">
                  <div className="mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      Elan haqqında
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Məhsul haqqında mümkün qədər ətraflı məlumat yazın
                    </p>
                  </div>

                  <textarea
                    name="description"
                    value={elektronikaPost.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Məhsulun vəziyyəti, xüsusiyyətləri, komplektasiyası və digər məlumatlar..."
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                  />
                </div>

                {/* CONTACT */}

                <div className="mb-6 border-t border-slate-100 pt-6 dark:border-slate-800">
                  <div className="mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      Əlaqə məlumatları
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Alıcıların sizinlə əlaqə saxlaması üçün
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Ad
                      </label>

                      <input
                        type="text"
                        name="contact.name"
                        value={elektronikaPost.contact.name}
                        onChange={handleChange}
                        placeholder="Adınız"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        E-mail
                      </label>

                      <input
                        type="email"
                        name="contact.email"
                        value={elektronikaPost.contact.email}
                        onChange={handleChange}
                        placeholder="example@mail.com"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Telefon
                      </label>

                      <input
                        type="tel"
                        name="contact.phone"
                        value={elektronikaPost.contact.phone}
                        onChange={handleChange}
                        placeholder="+994 XX XXX XX XX"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* IMAGES */}

                <div className="mb-6 border-t border-slate-100 pt-6 dark:border-slate-800">
                  <div className="mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      Şəkillər
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Məhsulunuzu daha yaxşı göstərən şəkillər əlavə edin
                    </p>
                  </div>

                  <label className="group flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition-all hover:border-blue-400 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-500 dark:hover:bg-blue-500/5">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-500/10 dark:text-blue-400">
                      <Plus size={25} />
                    </div>

                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      Şəkilləri seçin
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      PNG, JPG və JPEG • Bir neçə şəkil seçə bilərsiniz
                    </p>

                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!editingId}
                      className="hidden"
                    />
                  </label>

                  {/* PREVIEW */}

                  {preview.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {preview.map((src, index) => (
                        <div
                          key={index}
                          className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
                        >
                          <img
                            src={src}
                            alt={`preview-${index}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              setPreview((prev) =>
                                prev.filter((_, i) => i !== index),
                              );

                              if (index < images.length) {
                                setImages((prev) =>
                                  prev.filter((_, i) => i !== index),
                                );
                              }
                            }}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>

                          {index === 0 && (
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
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 active:scale-[0.98] sm:w-auto"
                    >
                      {editingId ? (
                        <>
                          <Edit3 size={18} />
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 4,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {!loading && results.length > 0 && (
            <>
              <h3
                className="
                    text-xl
                    font-bold
                    text-slate-800
                    mb-4
                  "
              >
                Axtarış nəticələri
              </h3>

              <div
                className="
                    grid
                    grid-cols-2
                    sm:grid-cols-3
                    lg:grid-cols-4
                    gap-4
                  "
              >
                {results.map((searchItem) => {
                  const searchId = getId(searchItem);

                  return (
                    <Link
                      key={searchId}
                      to={`/electronics/${searchId}`}
                      className="block"
                    >
                      <div
                        className="
                              relative
                              overflow-hidden
                              rounded-2xl
                              bg-white
                              border
                              border-slate-100
                              shadow-md
                              hover:shadow-xl
                              hover:-translate-y-1
                              transition-all
                              duration-300
                            "
                      >
                        <OwnerButtons item={searchItem} itemId={searchId} />

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            handleFavorite(searchId);
                          }}
                          className="
                                absolute
                                left-2
                                top-2
                                z-30
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-full
                                bg-black/50
                                text-white
                                backdrop-blur-sm
                                hover:bg-black/70
                              "
                        >
                          <Heart
                            size={15}
                            className={
                              searchItem.favorite
                                ? "fill-red-500 text-red-500"
                                : ""
                            }
                          />
                        </button>

                        <img
                          src={getCardImage(searchItem)}
                          alt={searchItem.title || "Elektronika"}
                          className="
                                w-full
                                h-[150px]
                                sm:h-[165px]
                                object-cover
                              "
                        />

                        <div className="p-3">
                          <p
                            className="
                                  text-lg
                                  font-bold
                                  text-slate-800
                                "
                          >
                            {searchItem.price} AZN
                          </p>

                          <h4
                            className="
                                  text-sm
                                  font-semibold
                                  text-slate-700
                                  truncate
                                  mt-1
                                "
                          >
                            {searchItem.title} {searchItem.brand}
                          </h4>

                          <p
                            className="
                                  text-xs
                                  text-slate-500
                                  truncate
                                  mt-1
                                "
                          >
                            {searchItem.model}
                          </p>

                          <div
                            className="
                                  flex
                                  items-center
                                  justify-between
                                  gap-2
                                  mt-2
                                "
                          >
                            <p
                              className="
                                    text-[10px]
                                    flex
                                    items-center
                                    text-slate-500
                                    truncate
                                  "
                            >
                              <MapPin
                                size={12}
                                className="mr-1 text-green-500"
                              />

                              {searchItem.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <div
              className="
                  py-10
                  text-center
                  text-slate-500
                "
            >
              Axtarış nəticəsi tapılmadı.
            </div>
          )}
        </div>

        <div
          className="
            w-full
            h-px
            bg-slate-200
            my-7
          "
        />

        {/* ELANLAR */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-5
          "
        >
          <div>
            <h3
              className="
                text-xl
                sm:text-2xl
                font-bold
                text-slate-800
              "
            >
              Əlavə olunan elanlar
            </h3>

            <p
              className="
                text-xs
                text-slate-500
                mt-1
              "
            >
              Son yerləşdirilən elektronika elanları
            </p>
          </div>
        </div>

        {/* CARDS */}

        <div
          className="
            mx-auto
            grid
            justify-items-center
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-5
            gap-4
            w-full
          "
        >
          {/* LOADING */}

          {isLoading
            ? Array.from({
                length: 10,
              }).map((_, i) => (
                <div
                  key={i}
                  className="
                    w-[185.7px]
                    h-[222.6px]
                    rounded-2xl
                    shadow-md
                    bg-white
                    overflow-hidden
                    animate-pulse
                  "
                >
                  <div
                    className="
                      w-full
                      h-[100px]
                      bg-slate-200
                    "
                  />

                  <div className="p-2 space-y-2">
                    <div
                      className="
                        h-5
                        bg-slate-200
                        rounded
                        w-3/4
                      "
                    />

                    <div
                      className="
                        h-3
                        bg-slate-200
                        rounded
                        w-full
                      "
                    />

                    <div
                      className="
                        h-3
                        bg-slate-200
                        rounded
                        w-2/3
                      "
                    />

                    <div
                      className="
                        h-3
                        bg-slate-200
                        rounded
                        w-1/2
                        mt-4
                      "
                    />
                  </div>
                </div>
              ))
            : [...elektronikaItems].reverse().map((item) => {
                const itemId = getId(item);

                return (
                  <Link
                    target="_top"
                    rel="noopener noreferrer"
                    key={itemId}
                    to={`/electronics/${itemId}`}
                    className="block"
                  >
                    <div
                      className="
                          relative
                          w-[185.7px]
                          h-[222.6px]
                          bg-white
                          rounded-2xl
                          shadow-lg
                          overflow-hidden
                          border
                          border-slate-100
                          transform
                          hover:-translate-y-2
                          hover:scale-[1.03]
                          hover:shadow-2xl
                          transition-all
                          duration-300
                        "
                    >
                      {/* REDAKTƏ / SİL */}

                      <OwnerButtons item={item} itemId={itemId} />

                      {/* FAVORİT */}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          handleFavorite(itemId);
                        }}
                        className="
                            absolute
                            left-2
                            top-2
                            z-30
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            bg-black/50
                            text-white
                            backdrop-blur-sm
                            hover:bg-black/70
                            transition
                          "
                        title="Favorit"
                      >
                        <Heart
                          size={15}
                          className={
                            item.favorite ? "fill-red-500 text-red-500" : ""
                          }
                        />
                      </button>

                      {/* IMAGE */}

                      <div
                        className="
                            relative
                            w-full
                            h-[100px]
                            overflow-hidden
                          "
                      >
                        <img
                          src={getCardImage(item)}
                          alt={item.title || "Elektronika"}
                          className="
                              w-full
                              h-full
                              object-cover
                              rounded-t-2xl
                              transition-transform
                              duration-500
                              hover:scale-110
                            "
                        />

                        {/* IMAGE OVERLAY */}

                        <div
                          className="
                              absolute
                              inset-0
                              bg-gradient-to-t
                              from-black/20
                              to-transparent
                              pointer-events-none
                            "
                        />
                      </div>

                      {/* CONTENT */}

                      <div className="p-2">
                        <p
                          className="
                              text-lg
                              font-bold
                              text-slate-800
                              leading-tight
                            "
                        >
                          {item.price} AZN
                        </p>

                        <h4
                          className="
                              font-semibold
                              capitalize
                              text-[12px]
                              text-slate-700
                              truncate
                              mt-1
                            "
                        >
                          {item.title} {item.brand}
                        </h4>

                        <p
                          className="
                              capitalize
                              text-[12px]
                              font-medium
                              text-slate-500
                              truncate
                              mt-0.5
                            "
                        >
                          {item.model}
                        </p>

                        <div
                          className="
                              flex
                              justify-between
                              gap-1
                              mt-2
                            "
                        >
                          <p
                            className="
                                text-[10px]
                                rounded
                                flex
                                items-center
                                text-slate-500
                                truncate
                                max-w-[100px]
                              "
                          >
                            <MapPin
                              size={12}
                              className="
                                  text-green-500
                                  flex-shrink-0
                                "
                            />

                            <span className="ml-1 truncate">
                              {item.location}
                            </span>
                          </p>

                          <p
                            className="
                                text-[10px]
                                rounded
                                flex
                                justify-between
                                text-slate-400
                                truncate
                              "
                          >
                            {formatDate(item.data || item.createdAt)}{" "}
                            {getCurrentTime(item.data || item.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
    </div>
  );
}
