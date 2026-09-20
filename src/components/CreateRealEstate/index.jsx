import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  X,
  Search,
  Plus,
  ArrowLeft,
  ImagePlus,
  MapPin,
  Heart,
  Edit3,
  Trash2,
  User,
  Mail,
  Phone,
  Home,
  Building2,
  Ruler,
  Layers3,
  Save,
  Loader2,
  MapPinned,
  BedDouble,
} from "lucide-react";

export default function CreateRealEstate() {
  const API_URL = process.env.REACT_APP_API_URL;

  const createInitialForm = () => ({
    id: Date.now(),
    title: "",
    title_type: "",
    type_building: "",
    field: "",
    number_of_rooms: "",
    area: "",
    floor: "",
    number_of_floors: "",
    location: "",
    city: "",
    price: "",
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

  const [isOpen, setIsOpen] = useState(false);
  const [realEstatePost, setRealEstatePost] = useState(createInitialForm());

  const [realEstateList, setRealEstateList] = useState([]);

  // Yeni seçilən şəkillər
  const [images, setImages] = useState([]);

  // Yeni şəkillərin preview-ları
  const [preview, setPreview] = useState([]);

  // Serverdə artıq olan şəkillər
  const [existingImages, setExistingImages] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";

    if (typeof image === "string") {
      if (
        image.startsWith("http://") ||
        image.startsWith("https://") ||
        image.startsWith("data:")
      ) {
        return image;
      }

      return `${API_URL}/uploads/${image}`;
    }

    return (
      image.url ||
      image.secure_url ||
      image.path ||
      image.src ||
      "/placeholder.png"
    );
  };

  // =========================================================
  // FETCH
  // =========================================================

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/realEstate`);

      const data = Array.isArray(res.data) ? res.data : res.data?.ads || [];

      setRealEstateList(data);
    } catch (err) {
      console.error("Real estate fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // =========================================================
  // FORM INPUT
  // =========================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("contact.")) {
      const field = name.split(".")[1];

      setRealEstatePost((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [field]: value,
        },
      }));

      return;
    }

    setRealEstatePost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // IMAGE SELECT
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
  // REMOVE NEW IMAGE
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
  // REMOVE EXISTING IMAGE FROM PREVIEW
  // =========================================================

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================================================
  // RESET
  // =========================================================

  const resetForm = () => {
    preview.forEach((url) => {
      if (url?.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });

    setRealEstatePost(createInitialForm());
    setImages([]);
    setPreview([]);
    setExistingImages([]);
    setEditingId(null);
  };

  // =========================================================
  // OPEN CREATE FORM
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

    resetForm();
    setIsOpen(true);
  };

  // =========================================================
  // CLOSE FORM
  // =========================================================

  const handleCloseForm = () => {
    setIsOpen(false);
    resetForm();
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
        text: "Elan paylaşmaq üçün hesabınıza daxil olun.",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    if (!realEstatePost.price || Number.isNaN(Number(realEstatePost.price))) {
      Swal.fire({
        icon: "error",
        title: "Qiymət düzgün deyil",
        text: "Zəhmət olmasa düzgün qiymət daxil edin.",
        confirmButtonColor: "#ef4444",
      });

      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();

    Object.entries(realEstatePost).forEach(([key, value]) => {
      if (key === "images") return;

      if (key === "contact") {
        Object.entries(value || {}).forEach(([contactKey, contactValue]) => {
          formData.append(`contact.${contactKey}`, contactValue || "");
        });

        return;
      }

      if (key === "data") {
        formData.append(
          "data",
          value instanceof Date
            ? value.toISOString()
            : new Date(value).toISOString(),
        );

        return;
      }

      if (key === "price") {
        formData.append("price", Number(value));
        return;
      }

      if (typeof value === "boolean" || typeof value === "number") {
        formData.append(key, String(value));
        return;
      }

      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/realEstate/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.fire({
          icon: "success",
          title: "Elan yeniləndi",
          text: "Elan məlumatları uğurla dəyişdirildi.",
          timer: 1400,
          showConfirmButton: false,
        });
      } else {
        await axios.post(`${API_URL}/api/realEstate`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.fire({
          icon: "success",
          title: "Elanınız yerləşdirildi!",
          text: "Daşınmaz əmlak elanı uğurla əlavə edildi.",
          timer: 1600,
          showConfirmButton: false,
        });
      }

      setIsOpen(false);
      resetForm();

      await fetchItems();
    } catch (err) {
      console.error("Real estate submit error:", err);

      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text:
          err.response?.data?.message ||
          "Elan yadda saxlanılarkən server xətası baş verdi.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Elan silinsin?",
      text: "Bu əməliyyatı geri qaytarmaq mümkün olmayacaq.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Ləğv et",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/api/realEstate/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (item) => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Bu əməliyyat üçün hesabınıza daxil olun.",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    const serverImages = Array.isArray(item.images)
      ? item.images
          .map((img) => {
            if (typeof img === "string") return img;

            return img?.url || img?.secure_url || img?.path || "";
          })
          .filter(Boolean)
      : [];

    setRealEstatePost({
      ...createInitialForm(),
      ...item,

      title: item.title || "",
      title_type: item.title_type || "",
      type_building: item.type_building || "",
      field: item.field || "",
      number_of_rooms: item.number_of_rooms || "",
      area: item.area || "",
      floor: item.floor || "",
      number_of_floors: item.number_of_floors || "",
      location: item.location || "",
      city: item.city || "",
      price: item.price || "",
      description: item.description || "",

      contact: {
        name: item.contact?.name || "",
        email: item.contact?.email || "",
        phone: item.contact?.phone || "",
      },

      data: item.data ? new Date(item.data) : new Date(),
    });

    setEditingId(item._id || item.id);
    setExistingImages(serverImages);
    setImages([]);
    setPreview([]);
    setIsOpen(true);
  };

  // =========================================================
  // FAVORITE
  // =========================================================

  const handleFavorite = async (id) => {
    try {
      await axios.patch(`${API_URL}/api/realEstate/${id}/favorite`);

      fetchItems();
    } catch (err) {
      console.error("Favorite error:", err);
    }
  };

  // =========================================================
  // LIKE
  // =========================================================

  const handleLike = async (id) => {
    try {
      await axios.patch(`${API_URL}/api/realEstate/${id}/like`);

      fetchItems();
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = async () => {
    const searchText = query.trim().toLowerCase();

    if (!searchText) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}/api/realEstate`);

      const allData = Array.isArray(response.data)
        ? response.data
        : response.data?.ads || [];

      const filtered = allData.filter((item) => {
        const searchableFields = [
          item.title,
          item.title_type,
          item.type_building,
          item.category,
          item.field,
          item.location,
          item.city,
          item.engine,
          item.year,
          item.motor,
          item.transmission,
          item.ban_type,
          item.price,
          item.description,
          item.number_of_rooms,
          item.area,
        ];

        return searchableFields.some((field) =>
          String(field || "")
            .toLowerCase()
            .includes(searchText),
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
  // DATE
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
  // CARD IMAGE
  // =========================================================

  const getFirstImage = (item) => {
    const image = item?.images?.[0] || item?.imageUrls?.[0] || item?.mainImage;

    return getImageUrl(image);
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b14] text-slate-900 dark:text-white transition-colors duration-300">
      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-5">
        {/* SEARCH HEADER */}
        <div className="mb-5">
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-slate-400" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Daşınmaz əmlak axtar..."
              className="
                w-full
                h-14
                pl-12
                pr-28
                rounded-2xl
                bg-white
                dark:bg-[#111625]
                border
                border-slate-200
                dark:border-white/10
                text-slate-900
                dark:text-white
                placeholder:text-slate-400
                shadow-sm
                focus:outline-none
                focus:ring-4
                focus:ring-[#670fff]/10
                focus:border-[#670fff]
                transition
              "
            />

            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="
                absolute
                right-2
                top-2
                h-10
                px-4
                rounded-xl
                bg-[#670fff]
                hover:bg-[#5600dc]
                text-white
                font-semibold
                flex
                items-center
                gap-2
                transition
                disabled:opacity-60
              "
            >
              {loading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Search size={17} />
              )}

              <span className="hidden sm:inline">Axtar</span>
            </button>
          </div>
        </div>

        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              bg-white
              dark:bg-[#111625]
              border
              border-slate-200
              dark:border-white/10
              text-slate-700
              dark:text-slate-200
              hover:border-[#670fff]
              hover:text-[#670fff]
              transition
              shadow-sm
            "
          >
            <ArrowLeft size={18} />
            Geri
          </Link>

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
              rounded-xl
              bg-gradient-to-r
              from-[#670fff]
              to-[#8b5cf6]
              text-white
              font-bold
              shadow-lg
              shadow-[#670fff]/20
              hover:-translate-y-0.5
              transition
            "
          >
            <Plus size={20} />
            Elan yerləşdir
          </button>
        </div>

        {/* TITLE */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-8 rounded-full bg-[#670fff]" />

            <h1 className="text-2xl sm:text-3xl font-black">
              Ən Son Daşınmaz Əmlak Elanları
            </h1>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Mənzil, ev, torpaq və digər daşınmaz əmlak elanlarına baxın.
          </p>
        </div>

        {/* SEARCH RESULTS */}
        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 size={32} className="animate-spin text-[#670fff]" />
          </div>
        )}

        {!loading && results.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Axtarış nəticələri</h2>

              <span className="text-sm text-slate-500">
                {results.length} elan
              </span>
            </div>

            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
                gap-3
              "
            >
              {results.map((item) => {
                const itemId = item._id || item.id;

                return (
                  <Link
                    key={itemId}
                    to={`/PostRealEstate/${itemId}`}
                    className="group"
                  >
                    <div
                      className="
                        overflow-hidden
                        rounded-2xl
                        bg-white
                        dark:bg-[#111625]
                        border
                        border-slate-200
                        dark:border-white/10
                        shadow-sm
                        hover:shadow-xl
                        hover:-translate-y-1
                        transition-all
                      "
                    >
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={getFirstImage(item)}
                          alt={item.title_type || "Daşınmaz əmlak"}
                          className="
                            w-full
                            h-full
                            object-cover
                            group-hover:scale-105
                            transition-transform
                            duration-500
                          "
                        />

                        <div
                          className="
                            absolute
                            top-2
                            right-2
                            px-2
                            py-1
                            rounded-lg
                            bg-black/60
                            backdrop-blur
                            text-white
                            text-xs
                            font-bold
                          "
                        >
                          {item.price} AZN
                        </div>
                      </div>

                      <div className="p-3">
                        <h3 className="font-bold truncate">
                          {item.title_type ||
                            item.type_building ||
                            "Daşınmaz əmlak"}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {item.type_building}
                        </p>

                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                          <MapPin size={13} />

                          <span className="truncate">
                            {item.location || item.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ALL ADS */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                Əlavə olunan elanlar
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Ən son əlavə edilən daşınmaz əmlaklar
              </p>
            </div>

            <div
              className="
                px-3
                py-1.5
                rounded-full
                bg-[#670fff]/10
                text-[#670fff]
                text-xs
                font-bold
              "
            >
              {realEstateList.length} elan
            </div>
          </div>

          {/* LOADING */}
          {isLoading ? (
            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
                gap-4
              "
            >
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="
                    h-[250px]
                    rounded-2xl
                    bg-white
                    dark:bg-[#111625]
                    border
                    border-slate-200
                    dark:border-white/10
                    overflow-hidden
                    animate-pulse
                  "
                >
                  <div className="h-32 bg-slate-200 dark:bg-slate-800" />

                  <div className="p-3 space-y-3">
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : realEstateList.length === 0 ? (
            <div
              className="
                py-20
                text-center
                rounded-3xl
                bg-white
                dark:bg-[#111625]
                border
                border-dashed
                border-slate-300
                dark:border-white/10
              "
            >
              <Home size={50} className="mx-auto text-slate-400 mb-4" />

              <h3 className="text-lg font-bold">Hələ elan yoxdur</h3>

              <p className="text-sm text-slate-500 mt-1">
                İlk daşınmaz əmlak elanını siz yerləşdirin.
              </p>

              <button
                type="button"
                onClick={handleOpenForm}
                className="
                  mt-5
                  px-5
                  py-2.5
                  rounded-xl
                  bg-[#670fff]
                  text-white
                  font-semibold
                  hover:bg-[#5600dc]
                  transition
                "
              >
                Elan yerləşdir
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
                gap-3
                sm:gap-4
              "
            >
              {[...realEstateList].reverse().map((item) => {
                const itemId = item._id || item.id;

                return (
                  <div key={itemId} className="relative group">
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      to={`/PostRealEstate/${itemId}`}
                    >
                      <div
                        className="
                            relative
                            overflow-hidden
                            rounded-2xl
                            bg-white
                            dark:bg-[#111625]
                            border
                            border-slate-200
                            dark:border-white/10
                            shadow-sm
                            hover:shadow-2xl
                            hover:-translate-y-1
                            transition-all
                            duration-300
                          "
                      >
                        {/* IMAGE */}
                        <div className="relative h-[115px] sm:h-[130px] overflow-hidden">
                          <img
                            src={getFirstImage(item)}
                            alt={item.title_type || "Daşınmaz əmlak"}
                            className="
                                w-full
                                h-full
                                object-cover
                                group-hover:scale-105
                                transition-transform
                                duration-500
                              "
                          />

                          {/* FAVORITE */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              handleFavorite(itemId);
                            }}
                            className="
                                absolute
                                top-2
                                right-2
                                w-8
                                h-8
                                rounded-full
                                bg-black/40
                                backdrop-blur-md
                                flex
                                items-center
                                justify-center
                                text-white
                                hover:bg-white
                                hover:text-red-500
                                transition
                              "
                          >
                            <Heart
                              size={16}
                              fill={item.favorite ? "currentColor" : "none"}
                            />
                          </button>

                          {/* PRICE */}
                          <div
                            className="
                                absolute
                                left-2
                                bottom-2
                                px-2.5
                                py-1
                                rounded-lg
                                bg-black/65
                                backdrop-blur
                                text-white
                                text-sm
                                font-black
                              "
                          >
                            {item.price} AZN
                          </div>
                        </div>

                        {/* CONTENT */}
                        <div className="p-2.5">
                          <h3
                            className="
                                font-bold
                                text-sm
                                truncate
                              "
                          >
                            {item.title_type ||
                              item.type_building ||
                              "Daşınmaz əmlak"}
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
                            {item.type_building}
                          </p>

                          <div
                            className="
                                flex
                                items-center
                                gap-1
                                mt-2
                                text-[11px]
                                text-slate-500
                                dark:text-slate-400
                              "
                          >
                            <BedDouble size={12} />

                            <span>{item.number_of_rooms || "-"} otaq</span>

                            <span className="mx-1">•</span>

                            <Ruler size={12} />

                            <span>{item.area || "-"} m²</span>
                          </div>

                          <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-2
                                mt-2
                              "
                          >
                            <div
                              className="
                                  flex
                                  items-center
                                  gap-1
                                  min-w-0
                                  text-[10px]
                                  text-slate-500
                                "
                            >
                              <MapPin
                                size={12}
                                className="text-[#670fff] shrink-0"
                              />

                              <span className="truncate">
                                {item.location || item.city || "Ünvan yoxdur"}
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
                        </div>
                      </div>
                    </Link>

                    {/* EDIT / DELETE */}
                    <div
                      className="
                          absolute
                          top-2
                          left-2
                          right-12
                          flex
                          gap-1.5
                          opacity-100
                          sm:opacity-0
                          sm:group-hover:opacity-100
                          transition-opacity
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
                            flex
                            items-center
                            gap-1
                            px-2
                            py-1.5
                            rounded-lg
                            bg-white/90
                            backdrop-blur
                            text-slate-700
                            text-[11px]
                            font-bold
                            shadow
                            hover:bg-[#670fff]
                            hover:text-white
                            transition
                          "
                      >
                        <Edit3 size={13} />

                        <span className="hidden sm:inline">Redaktə</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          handleDelete(itemId);
                        }}
                        className="
                            flex
                            items-center
                            gap-1
                            px-2
                            py-1.5
                            rounded-lg
                            bg-white/90
                            backdrop-blur
                            text-red-500
                            text-[11px]
                            font-bold
                            shadow
                            hover:bg-red-500
                            hover:text-white
                            transition
                          "
                      >
                        <Trash2 size={13} />

                        <span className="hidden sm:inline">Sil</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            bg-black/65
            backdrop-blur-md
            flex
            items-center
            justify-center
            p-0
            sm:p-4
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
              sm:max-w-4xl
              h-full
              sm:h-auto
              sm:max-h-[94vh]
              overflow-hidden
              bg-white
              dark:bg-[#0d111d]
              sm:rounded-3xl
              shadow-2xl
              flex
              flex-col
            "
          >
            {/* MODAL HEADER */}
            <div
              className="
                shrink-0
                px-5
                sm:px-7
                py-4
                border-b
                border-slate-200
                dark:border-white/10
                flex
                items-center
                justify-between
                bg-white
                dark:bg-[#0d111d]
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-11
                    h-11
                    rounded-2xl
                    bg-[#670fff]/10
                    flex
                    items-center
                    justify-center
                    text-[#670fff]
                  "
                >
                  <Building2 size={22} />
                </div>

                <div>
                  <h2
                    className="
                      text-lg
                      sm:text-xl
                      font-black
                    "
                  >
                    {editingId
                      ? "Elanı redaktə et"
                      : "Yeni daşınmaz əmlak elanı"}
                  </h2>

                  <p
                    className="
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Elan məlumatlarını doldurun
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
                  bg-slate-100
                  dark:bg-white/5
                  flex
                  items-center
                  justify-center
                  text-slate-500
                  hover:bg-red-50
                  hover:text-red-500
                  transition
                "
              >
                <X size={21} />
              </button>
            </div>

            {/* FORM BODY */}
            <form
              onSubmit={handleSubmit}
              className="
                flex-1
                overflow-y-auto
                px-4
                sm:px-7
                py-5
              "
            >
              {/* ELAN MƏLUMATLARI */}
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="
                      w-8
                      h-8
                      rounded-xl
                      bg-[#670fff]/10
                      flex
                      items-center
                      justify-center
                      text-[#670fff]
                    "
                  >
                    <Home size={17} />
                  </div>

                  <div>
                    <h3 className="font-bold">Elan məlumatları</h3>

                    <p className="text-xs text-slate-500">
                      Əmlak haqqında əsas məlumatlar
                    </p>
                  </div>
                </div>

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-4
                  "
                >
                  <ModernInput
                    label="Elanın adı"
                    name="title_type"
                    value={realEstatePost.title_type}
                    onChange={handleInputChange}
                    placeholder="Məsələn: 3 otaqlı mənzil"
                    icon={<Home size={17} />}
                    required
                  />

                  <ModernInput
                    label="Əmlakın tipi"
                    name="type_building"
                    value={realEstatePost.type_building}
                    onChange={handleInputChange}
                    placeholder="Mənzil, həyət evi, torpaq..."
                    icon={<Building2 size={17} />}
                    required
                  />

                  <ModernInput
                    label="Elanın bölməsi"
                    name="field"
                    value={realEstatePost.field}
                    onChange={handleInputChange}
                    placeholder="Satılır, kirayə və s."
                    icon={<Layers3 size={17} />}
                    required
                  />

                  <ModernInput
                    label="Otaq sayı"
                    name="number_of_rooms"
                    type="number"
                    value={realEstatePost.number_of_rooms}
                    onChange={handleInputChange}
                    placeholder="Məsələn: 3"
                    icon={<BedDouble size={17} />}
                    required
                  />

                  <ModernInput
                    label="Sahə"
                    name="area"
                    type="number"
                    value={realEstatePost.area}
                    onChange={handleInputChange}
                    placeholder="m²"
                    icon={<Ruler size={17} />}
                    required
                  />

                  <ModernInput
                    label="Mərtəbə"
                    name="floor"
                    type="number"
                    value={realEstatePost.floor}
                    onChange={handleInputChange}
                    placeholder="Məsələn: 5"
                    icon={<Layers3 size={17} />}
                  />

                  <ModernInput
                    label="Mərtəbə sayı"
                    name="number_of_floors"
                    type="number"
                    value={realEstatePost.number_of_floors}
                    onChange={handleInputChange}
                    placeholder="Məsələn: 12"
                    icon={<Building2 size={17} />}
                  />

                  <ModernInput
                    label="Qiymət"
                    name="price"
                    type="number"
                    value={realEstatePost.price}
                    onChange={handleInputChange}
                    placeholder="Məsələn: 125000"
                    icon={<span className="font-bold text-sm">₼</span>}
                    required
                  />
                </div>
              </div>

              {/* LOCATION */}
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="
                      w-8
                      h-8
                      rounded-xl
                      bg-emerald-500/10
                      flex
                      items-center
                      justify-center
                      text-emerald-500
                    "
                  >
                    <MapPinned size={17} />
                  </div>

                  <div>
                    <h3 className="font-bold">Ünvan məlumatları</h3>

                    <p className="text-xs text-slate-500">
                      Əmlakın yerləşdiyi ərazi
                    </p>
                  </div>
                </div>

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-4
                  "
                >
                  <ModernInput
                    label="Şəhər"
                    name="city"
                    value={realEstatePost.city}
                    onChange={handleInputChange}
                    placeholder="Bakı"
                    icon={<MapPin size={17} />}
                    required
                  />

                  <ModernInput
                    label="Ünvan"
                    name="location"
                    value={realEstatePost.location}
                    onChange={handleInputChange}
                    placeholder="Məsələn: Yasamal r."
                    icon={<MapPinned size={17} />}
                    required
                  />
                </div>
              </div>

              {/* IMAGES */}
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="
                      w-8
                      h-8
                      rounded-xl
                      bg-pink-500/10
                      flex
                      items-center
                      justify-center
                      text-pink-500
                    "
                  >
                    <ImagePlus size={17} />
                  </div>

                  <div>
                    <h3 className="font-bold">Əmlak şəkilləri</h3>

                    <p className="text-xs text-slate-500">
                      Daha çox şəkil əlavə edərək elanı daha ətraflı göstərin
                    </p>
                  </div>
                </div>

                <label
                  className="
                    block
                    cursor-pointer
                    border-2
                    border-dashed
                    border-slate-300
                    dark:border-white/10
                    hover:border-[#670fff]
                    rounded-2xl
                    p-6
                    text-center
                    transition
                    bg-slate-50
                    dark:bg-white/[0.02]
                  "
                >
                  <div
                    className="
                      w-12
                      h-12
                      mx-auto
                      rounded-2xl
                      bg-[#670fff]/10
                      text-[#670fff]
                      flex
                      items-center
                      justify-center
                      mb-3
                    "
                  >
                    <ImagePlus size={23} />
                  </div>

                  <p className="font-bold text-sm">Şəkilləri seçin</p>

                  <p
                    className="
                      text-xs
                      text-slate-500
                      mt-1
                    "
                  >
                    JPG, PNG və digər şəkil formatları
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
                  <div className="mt-4">
                    <p
                      className="
                        text-xs
                        font-bold
                        text-slate-500
                        mb-2
                      "
                    >
                      Mövcud şəkillər
                    </p>

                    <div
                      className="
                        grid
                        grid-cols-3
                        sm:grid-cols-5
                        gap-3
                      "
                    >
                      {existingImages.map((img, index) => (
                        <div
                          key={`existing-${index}`}
                          className="
                            relative
                            aspect-square
                            rounded-xl
                            overflow-hidden
                            bg-slate-100
                            dark:bg-white/5
                            group
                          "
                        >
                          <img
                            src={getImageUrl(img)}
                            alt={`existing-${index}`}
                            className="
                              w-full
                              h-full
                              object-cover
                            "
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(index)}
                            className="
                              absolute
                              top-1.5
                              right-1.5
                              w-7
                              h-7
                              rounded-lg
                              bg-black/60
                              text-white
                              flex
                              items-center
                              justify-center
                              hover:bg-red-500
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

                {/* NEW PREVIEWS */}
                {preview.length > 0 && (
                  <div className="mt-4">
                    <p
                      className="
                        text-xs
                        font-bold
                        text-slate-500
                        mb-2
                      "
                    >
                      Yeni seçilən şəkillər
                    </p>

                    <div
                      className="
                        grid
                        grid-cols-3
                        sm:grid-cols-5
                        gap-3
                      "
                    >
                      {preview.map((url, index) => (
                        <div
                          key={`preview-${index}`}
                          className="
                            relative
                            aspect-square
                            rounded-xl
                            overflow-hidden
                            bg-slate-100
                            dark:bg-white/5
                          "
                        >
                          <img
                            src={url}
                            alt={`preview-${index}`}
                            className="
                              w-full
                              h-full
                              object-cover
                            "
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="
                              absolute
                              top-1.5
                              right-1.5
                              w-7
                              h-7
                              rounded-lg
                              bg-black/60
                              text-white
                              flex
                              items-center
                              justify-center
                              hover:bg-red-500
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
              </div>

              {/* CONTACT */}
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="
                      w-8
                      h-8
                      rounded-xl
                      bg-blue-500/10
                      flex
                      items-center
                      justify-center
                      text-blue-500
                    "
                  >
                    <User size={17} />
                  </div>

                  <div>
                    <h3 className="font-bold">Əlaqə məlumatları</h3>

                    <p className="text-xs text-slate-500">
                      Alıcıların sizinlə əlaqə saxlaması üçün
                    </p>
                  </div>
                </div>

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-4
                  "
                >
                  <ModernInput
                    label="Ad və soyad"
                    name="contact.name"
                    value={realEstatePost.contact.name}
                    onChange={handleInputChange}
                    placeholder="Adınızı daxil edin"
                    icon={<User size={17} />}
                    required
                  />

                  <ModernInput
                    label="Telefon"
                    name="contact.phone"
                    type="tel"
                    value={realEstatePost.contact.phone}
                    onChange={handleInputChange}
                    placeholder="+994 XX XXX XX XX"
                    icon={<Phone size={17} />}
                    required
                  />

                  <div className="sm:col-span-2">
                    <ModernInput
                      label="E-mail"
                      name="contact.email"
                      type="email"
                      value={realEstatePost.contact.email}
                      onChange={handleInputChange}
                      placeholder="example@mail.com"
                      icon={<Mail size={17} />}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="mb-4">
                <label
                  className="
                    block
                    text-sm
                    font-bold
                    mb-2
                  "
                >
                  Elanın təsviri
                </label>

                <textarea
                  name="description"
                  value={realEstatePost.description}
                  onChange={handleInputChange}
                  placeholder="Əmlak haqqında ətraflı məlumat yazın..."
                  rows={5}
                  required
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-2xl
                    bg-slate-50
                    dark:bg-[#111625]
                    border
                    border-slate-200
                    dark:border-white/10
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

              {/* SUBMIT */}
              <div
                className="
                  sticky
                  bottom-0
                  pt-4
                  pb-1
                  bg-white
                  dark:bg-[#0d111d]
                "
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    bg-gradient-to-r
                    from-[#670fff]
                    to-[#8b5cf6]
                    text-white
                    font-black
                    flex
                    items-center
                    justify-center
                    gap-2
                    shadow-xl
                    shadow-[#670fff]/20
                    hover:-translate-y-0.5
                    transition
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                  "
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Yadda saxlanılır...
                    </>
                  ) : editingId ? (
                    <>
                      <Save size={20} />
                      Elanı yenilə
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Elanı yerləşdir
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================
// MODERN INPUT COMPONENT
// =============================================================

function ModernInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  required = false,
}) {
  return (
    <div>
      <label
        className="
          block
          text-sm
          font-bold
          text-slate-700
          dark:text-slate-200
          mb-2
        "
      >
        {label}

        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <div
          className="
            absolute
            left-3.5
            top-1/2
            -translate-y-1/2
            text-slate-400
            pointer-events-none
          "
        >
          {icon}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="
            w-full
            h-12
            pl-11
            pr-4
            rounded-xl
            bg-slate-50
            dark:bg-[#111625]
            border
            border-slate-200
            dark:border-white/10
            text-slate-900
            dark:text-white
            placeholder:text-slate-400
            outline-none
            focus:border-[#670fff]
            focus:ring-4
            focus:ring-[#670fff]/10
            transition-all
          "
        />
      </div>
    </div>
  );
}
