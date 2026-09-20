import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  ShieldCheck,
  LogOut,
  Megaphone,
  Users,
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
  BarChart3,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "../../components/Main/ThemeContext";

export default function AdminPanel() {
  const [ads, setAds] = useState([]);
  const [newAd, setNewAd] = useState({
    title: "",
    link: "",
    image: null,
  });

  const [stats, setStats] = useState({
    posts: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);
  const [addingAd, setAddingAd] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const token = localStorage.getItem("adminToken");
  const API = process.env.REACT_APP_API_URL;

  /* =========================
     AUTH
  ========================== */

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    }
  }, [token, navigate]);

  /* =========================
     AXIOS
  ========================== */

  const axiosInstance = axios.create({
    baseURL: `${API}/api`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  /* =========================
     FETCH DATA
  ========================== */

  const fetchData = async () => {
    if (!token) return;

    setLoading(true);

    try {
      const [statsRes, adsRes] = await Promise.all([
        axiosInstance.get("/stats"),
        axiosInstance.get("/ads"),
      ]);

      setStats(
        statsRes.data || {
          posts: 0,
          users: 0,
        },
      );

      setAds(Array.isArray(adsRes.data) ? adsRes.data : []);
    } catch (err) {
      console.log(err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  /* =========================
     IMAGE SELECT
  ========================== */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setNewAd((prev) => ({
        ...prev,
        image: null,
      }));

      setImagePreview("");
      return;
    }

    setNewAd((prev) => ({
      ...prev,
      image: file,
    }));

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  /* =========================
     ADD AD
  ========================== */

  const handleAddAd = async (e) => {
    e.preventDefault();

    if (!newAd.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Başlıq daxil edin",
        text: "Reklam üçün başlıq yazılmalıdır.",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    if (!newAd.image) {
      Swal.fire({
        icon: "warning",
        title: "Şəkil seçilməyib",
        text: "Reklam üçün şəkil seçin.",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    setAddingAd(true);

    try {
      const formData = new FormData();

      formData.append("title", newAd.title);
      formData.append("link", newAd.link);

      if (newAd.image) {
        formData.append("image", newAd.image);
      }

      const res = await axiosInstance.post("/ads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAds((prev) => [res.data, ...prev]);

      setNewAd({
        title: "",
        link: "",
        image: null,
      });

      setImagePreview("");

      Swal.fire({
        icon: "success",
        title: "Reklam əlavə edildi",
        text: "Yeni reklam uğurla əlavə olundu.",
        confirmButtonColor: "#670fff",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text:
          err.response?.data?.message ||
          "Reklam əlavə edilərkən xəta baş verdi.",
        confirmButtonColor: "#670fff",
      });
    } finally {
      setAddingAd(false);
    }
  };

  /* =========================
     DELETE AD
  ========================== */

  const handleDeleteAd = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Reklam silinsin?",
      text: "Bu əməliyyatı geri qaytarmaq mümkün olmayacaq.",
      showCancelButton: true,
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Ləğv et",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    setDeletingId(id);

    try {
      await axiosInstance.delete(`/ads/${id}`);

      setAds((prev) => prev.filter((ad) => ad._id !== id));

      Swal.fire({
        icon: "success",
        title: "Silindi",
        text: "Reklam uğurla silindi.",
        confirmButtonColor: "#670fff",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text:
          err.response?.data?.message || "Reklam silinərkən xəta baş verdi.",
        confirmButtonColor: "#670fff",
      });
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================
     LOGOUT
  ========================== */

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  /* =========================
     IMAGE URL
  ========================== */

  const getImageUrl = (ad) => {
    if (!ad?.image) return "";

    if (ad.image.startsWith("http://") || ad.image.startsWith("https://")) {
      return ad.image;
    }

    return `${API}/uploads/${ad.image}`;
  };

  return (
    <div
      className={`
        min-h-screen
        transition-colors duration-300
        ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}
      `}
    >
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`
            absolute -top-40 -right-40
            h-96 w-96 rounded-full
            blur-3xl
            ${darkMode ? "bg-[#670fff]/10" : "bg-[#670fff]/5"}
          `}
        />

        <div
          className={`
            absolute -bottom-40 -left-40
            h-96 w-96 rounded-full
            blur-3xl
            ${darkMode ? "bg-green-500/5" : "bg-green-500/5"}
          `}
        />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* =========================
            HEADER
        ========================== */}

        <header
          className={`
            mb-7 overflow-hidden rounded-3xl
            border backdrop-blur-xl
            ${
              darkMode
                ? "border-white/10 bg-slate-900/80"
                : "border-slate-200 bg-white/90"
            }
          `}
        >
          <div className="h-1 bg-gradient-to-r from-green-400 via-[#670fff] to-pink-500" />

          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-4">
              <div
                className="
                  flex h-12 w-12 shrink-0
                  items-center justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-[#670fff] to-purple-500
                  text-white shadow-lg
                  shadow-[#670fff]/20
                "
              >
                <ShieldCheck size={25} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1
                    className={`
                      text-xl sm:text-2xl
                      font-extrabold tracking-tight
                      ${darkMode ? "text-white" : "text-slate-900"}
                    `}
                  >
                    Admin Panel
                  </h1>

                  <span
                    className="
                      rounded-full
                      bg-green-500/10
                      px-2.5 py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-green-500
                    "
                  >
                    Admin
                  </span>
                </div>

                <p
                  className={`
                    mt-1 text-xs sm:text-sm
                    ${darkMode ? "text-slate-400" : "text-slate-500"}
                  `}
                >
                  ProElan idarəetmə paneli
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchData}
                disabled={loading}
                className={`
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  px-4 py-2.5
                  text-sm
                  font-semibold
                  transition-all
                  ${
                    darkMode
                      ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }
                `}
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Yenilə
              </button>

              <button
                onClick={handleLogout}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-500
                  px-4 py-2.5
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-red-500/20
                  transition-all
                  hover:bg-red-600
                  hover:-translate-y-0.5
                "
              >
                <LogOut size={16} />
                Çıxış
              </button>
            </div>
          </div>
        </header>

        {/* =========================
            STATS
        ========================== */}

        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Posts */}
          <div
            className={`
              group relative overflow-hidden
              rounded-2xl border p-5
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-xl
              ${
                darkMode
                  ? "border-white/10 bg-slate-900/80"
                  : "border-slate-200 bg-white"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`
                    text-sm font-semibold
                    ${darkMode ? "text-slate-400" : "text-slate-500"}
                  `}
                >
                  Elanlar
                </p>

                <p
                  className={`
                    mt-2 text-3xl font-extrabold
                    ${darkMode ? "text-white" : "text-slate-900"}
                  `}
                >
                  {stats.posts}
                </p>

                <p
                  className="
                    mt-1 text-xs
                    text-blue-500
                  "
                >
                  Platformadakı elan sayı
                </p>
              </div>

              <div
                className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-2xl
                  bg-blue-500/10
                "
              >
                <FileText size={24} className="text-blue-500" />
              </div>
            </div>

            <div
              className="
                absolute -right-8 -bottom-8
                h-24 w-24 rounded-full
                bg-blue-500/5
              "
            />
          </div>

          {/* Users */}
          <div
            className={`
              group relative overflow-hidden
              rounded-2xl border p-5
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-xl
              ${
                darkMode
                  ? "border-white/10 bg-slate-900/80"
                  : "border-slate-200 bg-white"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`
                    text-sm font-semibold
                    ${darkMode ? "text-slate-400" : "text-slate-500"}
                  `}
                >
                  İstifadəçilər
                </p>

                <p
                  className={`
                    mt-2 text-3xl font-extrabold
                    ${darkMode ? "text-white" : "text-slate-900"}
                  `}
                >
                  {stats.users}
                </p>

                <p
                  className="
                    mt-1 text-xs
                    text-green-500
                  "
                >
                  Qeydiyyatdan keçən istifadəçilər
                </p>
              </div>

              <div
                className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-2xl
                  bg-green-500/10
                "
              >
                <Users size={24} className="text-green-500" />
              </div>
            </div>

            <div
              className="
                absolute -right-8 -bottom-8
                h-24 w-24 rounded-full
                bg-green-500/5
              "
            />
          </div>
        </section>

        {/* =========================
            ADD AD
        ========================== */}

        <section
          className={`
            mb-8 overflow-hidden
            rounded-3xl border
            ${
              darkMode
                ? "border-white/10 bg-slate-900/80"
                : "border-slate-200 bg-white"
            }
          `}
        >
          <div
            className="
              flex items-center gap-3
              border-b p-5 sm:p-6
            "
            style={{
              borderColor: darkMode
                ? "rgba(255,255,255,.08)"
                : "rgba(226,232,240,1)",
            }}
          >
            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-[#670fff]/10
              "
            >
              <Megaphone size={20} className="text-[#670fff]" />
            </div>

            <div>
              <h2
                className={`
                  text-lg font-bold
                  ${darkMode ? "text-white" : "text-slate-900"}
                `}
              >
                Yeni reklam
              </h2>

              <p
                className={`
                  text-xs
                  ${darkMode ? "text-slate-500" : "text-slate-500"}
                `}
              >
                Platforma yeni reklam əlavə edin
              </p>
            </div>
          </div>

          <form onSubmit={handleAddAd} className="p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Inputs */}
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label
                    className={`
                      mb-2 block
                      text-sm font-semibold
                      ${darkMode ? "text-slate-300" : "text-slate-700"}
                    `}
                  >
                    Reklam başlığı
                  </label>

                  <div className="relative">
                    <Megaphone
                      size={17}
                      className="
                        absolute
                        left-3.5 top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      type="text"
                      placeholder="Məsələn: Yeni kampaniya"
                      value={newAd.title}
                      onChange={(e) =>
                        setNewAd({
                          ...newAd,
                          title: e.target.value,
                        })
                      }
                      className={`
                        w-full rounded-xl
                        border py-3 pl-10 pr-4
                        outline-none
                        transition-all
                        focus:border-[#670fff]
                        focus:ring-4
                        focus:ring-[#670fff]/10
                        ${
                          darkMode
                            ? "border-white/10 bg-slate-800 text-white placeholder:text-slate-500"
                            : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                        }
                      `}
                    />
                  </div>
                </div>

                {/* Link */}
                <div>
                  <label
                    className={`
                      mb-2 block
                      text-sm font-semibold
                      ${darkMode ? "text-slate-300" : "text-slate-700"}
                    `}
                  >
                    Reklam linki
                  </label>

                  <div className="relative">
                    <LinkIcon
                      size={17}
                      className="
                        absolute
                        left-3.5 top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      type="text"
                      placeholder="https://example.com"
                      value={newAd.link}
                      onChange={(e) =>
                        setNewAd({
                          ...newAd,
                          link: e.target.value,
                        })
                      }
                      className={`
                        w-full rounded-xl
                        border py-3 pl-10 pr-4
                        outline-none
                        transition-all
                        focus:border-[#670fff]
                        focus:ring-4
                        focus:ring-[#670fff]/10
                        ${
                          darkMode
                            ? "border-white/10 bg-slate-800 text-white placeholder:text-slate-500"
                            : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                        }
                      `}
                    />
                  </div>
                </div>

                {/* File */}
                <div>
                  <label
                    className={`
                      mb-2 block
                      text-sm font-semibold
                      ${darkMode ? "text-slate-300" : "text-slate-700"}
                    `}
                  >
                    Reklam şəkli
                  </label>

                  <label
                    className={`
                      flex cursor-pointer
                      items-center gap-3
                      rounded-xl border
                      border-dashed
                      p-4
                      transition-all
                      hover:border-[#670fff]
                      ${
                        darkMode
                          ? "border-white/15 bg-slate-800 hover:bg-slate-800/80"
                          : "border-slate-300 bg-slate-50 hover:bg-purple-50"
                      }
                    `}
                  >
                    <div
                      className="
                        flex h-10 w-10
                        shrink-0 items-center justify-center
                        rounded-xl
                        bg-[#670fff]/10
                      "
                    >
                      <Upload size={19} className="text-[#670fff]" />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`
                          text-sm font-semibold
                          ${darkMode ? "text-slate-200" : "text-slate-700"}
                        `}
                      >
                        Şəkil seçin
                      </p>

                      <p
                        className={`
                          truncate text-xs
                          ${darkMode ? "text-slate-500" : "text-slate-400"}
                        `}
                      >
                        {newAd.image
                          ? newAd.image.name
                          : "PNG, JPG və digər şəkillər"}
                      </p>
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={addingAd}
                  className="
                    inline-flex w-full
                    items-center justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-[#670fff]
                    to-purple-500
                    px-5 py-3
                    text-sm font-bold
                    text-white
                    shadow-lg
                    shadow-[#670fff]/20
                    transition-all
                    hover:-translate-y-0.5
                    hover:shadow-xl
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {addingAd ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Əlavə olunur...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Reklamı əlavə et
                    </>
                  )}
                </button>
              </div>

              {/* Preview */}
              <div
                className={`
                  min-h-[280px]
                  overflow-hidden
                  rounded-2xl
                  border
                  ${
                    darkMode
                      ? "border-white/10 bg-slate-800/60"
                      : "border-slate-200 bg-slate-50"
                  }
                `}
              >
                {imagePreview ? (
                  <div className="relative h-full min-h-[280px]">
                    <img
                      src={imagePreview}
                      alt="Reklam önizləməsi"
                      className="
                        h-full w-full
                        object-cover
                      "
                    />

                    <div
                      className="
                        absolute inset-x-0
                        bottom-0
                        bg-gradient-to-t
                        from-black/80
                        to-transparent
                        p-5 pt-16
                      "
                    >
                      <p className="text-xs font-semibold text-white/70">
                        ÖNİZLƏMƏ
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-white">
                        {newAd.title || "Reklam başlığı"}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div
                    className="
                      flex h-full min-h-[280px]
                      flex-col items-center
                      justify-center
                      text-center
                      p-6
                    "
                  >
                    <div
                      className="
                        mb-4 flex h-16 w-16
                        items-center justify-center
                        rounded-2xl
                        bg-[#670fff]/10
                      "
                    >
                      <ImageIcon size={30} className="text-[#670fff]" />
                    </div>

                    <h3
                      className={`
                        font-bold
                        ${darkMode ? "text-white" : "text-slate-700"}
                      `}
                    >
                      Şəkil önizləməsi
                    </h3>

                    <p
                      className={`
                        mt-1 max-w-xs text-xs
                        ${darkMode ? "text-slate-500" : "text-slate-400"}
                      `}
                    >
                      Reklam şəkli seçdikdən sonra burada önizləməsini görə
                      bilərsiniz.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </section>

        {/* =========================
            ADS HEADER
        ========================== */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 size={21} className="text-[#670fff]" />

              <h2
                className={`
                  text-xl font-extrabold
                  ${darkMode ? "text-white" : "text-slate-900"}
                `}
              >
                Reklamlar
              </h2>
            </div>

            <p
              className={`
                mt-1 text-sm
                ${darkMode ? "text-slate-500" : "text-slate-500"}
              `}
            >
              Sistemdə olan reklamların idarə edilməsi
            </p>
          </div>

          <div
            className={`
              inline-flex
              w-fit
              items-center gap-2
              rounded-full
              px-3 py-1.5
              text-xs font-bold
              ${
                darkMode
                  ? "bg-white/5 text-slate-300"
                  : "bg-white text-slate-600 shadow-sm"
              }
            `}
          >
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {ads.length} reklam
          </div>
        </div>

        {/* =========================
            ADS GRID
        ========================== */}

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`
                  h-[390px]
                  animate-pulse
                  rounded-2xl
                  ${darkMode ? "bg-slate-900" : "bg-slate-200"}
                `}
              />
            ))}
          </div>
        ) : ads.length === 0 ? (
          <div
            className={`
              rounded-3xl
              border
              p-12
              text-center
              ${
                darkMode
                  ? "border-white/10 bg-slate-900/70"
                  : "border-slate-200 bg-white"
              }
            `}
          >
            <div
              className="
                mx-auto mb-4
                flex h-16 w-16
                items-center justify-center
                rounded-2xl
                bg-[#670fff]/10
              "
            >
              <Megaphone size={30} className="text-[#670fff]" />
            </div>

            <h3
              className={`
                text-lg font-bold
                ${darkMode ? "text-white" : "text-slate-800"}
              `}
            >
              Hələ reklam yoxdur
            </h3>

            <p
              className={`
                mx-auto mt-2
                max-w-md text-sm
                ${darkMode ? "text-slate-500" : "text-slate-500"}
              `}
            >
              Yuxarıdakı formadan istifadə edərək ilk reklamınızı əlavə edə
              bilərsiniz.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ads.map((ad) => (
              <div
                key={ad._id}
                className={`
                  group overflow-hidden
                  rounded-2xl border
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-2xl
                  ${
                    darkMode
                      ? "border-white/10 bg-slate-900"
                      : "border-slate-200 bg-white"
                  }
                `}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(ad)}
                    alt={ad.title || "Reklam"}
                    className="
                      h-full w-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  <div
                    className="
                      absolute
                      left-3 top-3
                      rounded-full
                      bg-black/60
                      px-2.5 py-1
                      text-[10px]
                      font-bold
                      text-white
                      backdrop-blur-md
                    "
                  >
                    REKLAM
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3
                    className={`
                      mb-2
                      line-clamp-1
                      font-bold
                      ${darkMode ? "text-white" : "text-slate-800"}
                    `}
                  >
                    {ad.title || "Başlıqsız reklam"}
                  </h3>

                  {ad.link ? (
                    <a
                      href={ad.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-xs
                        text-blue-500
                        hover:text-blue-600
                        hover:underline
                      "
                    >
                      <ExternalLink size={13} />

                      <span className="truncate">{ad.link}</span>
                    </a>
                  ) : (
                    <p
                      className={`
                        text-xs
                        ${darkMode ? "text-slate-600" : "text-slate-400"}
                      `}
                    >
                      Link əlavə edilməyib
                    </p>
                  )}

                  <button
                    onClick={() => handleDeleteAd(ad._id)}
                    disabled={deletingId === ad._id}
                    className="
                      mt-4
                      inline-flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-red-500/10
                      px-4 py-2.5
                      text-sm
                      font-bold
                      text-red-500
                      transition-all
                      hover:bg-red-500
                      hover:text-white
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {deletingId === ad._id ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Silinir...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Reklamı sil
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom */}
        <div
          className={`
            mt-8
            flex
            items-center
            justify-center
            gap-2
            text-center
            text-xs
            ${darkMode ? "text-slate-600" : "text-slate-400"}
          `}
        >
          <ShieldCheck size={14} />
          ProElan Admin Panel
        </div>
      </main>
    </div>
  );
}
