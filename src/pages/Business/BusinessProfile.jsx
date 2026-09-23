import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Store,
  Plus,
  Loader2,
  CarFront,
  Smartphone,
  Monitor,
  Shirt,
  Home,
  Sofa,
  Gem,
  Package,
  BriefcaseBusiness,
  Pencil,
  Trash2,
  ExternalLink,
  X,
  Save,
} from "lucide-react";

const BusinessProfile = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const API = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");

  const [business, setBusiness] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // =====================================================
  // EDIT MODAL
  // =====================================================

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    city: "",
    location: "",
    description: "",
  });

  // =====================================================
  // BİZNES MƏLUMATLARINI GƏTİR
  // =====================================================

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API}/api/business/${slug}`);

        console.log("🏪 FULL BUSINESS RESPONSE:", res.data);
        console.log("🏪 BUSINESS FROM API:", res.data?.business);
        console.log("🏪 CATEGORY FROM API:", res.data?.business?.category);

        const businessData = res.data?.business || null;

        if (businessData) {
          console.log("🏪 BUSINESS ID:", businessData._id);
          console.log("🏪 BUSINESS NAME:", businessData.businessName);
          console.log("🏪 BUSINESS CATEGORY:", businessData.category);
          console.log("👤 BUSINESS OWNER:", businessData.owner);
        }

        setBusiness(businessData);
        setAds(res.data?.ads || []);

        // =================================================
        // BİZNES SAHİBİNİ YOXLA
        // =================================================

        const currentUserId = localStorage.getItem("userId");

        const ownerId =
          typeof businessData?.owner === "object"
            ? businessData.owner?._id
            : businessData?.owner;

        const ownerStatus = Boolean(
          currentUserId && ownerId && String(currentUserId) === String(ownerId),
        );

        console.log("👤 CURRENT USER ID:", currentUserId);
        console.log("👤 BUSINESS OWNER ID:", ownerId);
        console.log("👑 IS OWNER:", ownerStatus);

        setIsOwner(ownerStatus);
      } catch (error) {
        console.error("❌ Business profile error:", error);

        if (error.response) {
          console.error("❌ API STATUS:", error.response.status);
          console.error("❌ API DATA:", error.response.data);
        }

        setBusiness(null);
        setAds([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBusiness();
    }
  }, [slug, API]);

  // =====================================================
  // BİZNES KATEQORİYASI
  // =====================================================

  const getCategoryInfo = (category) => {
    const categoryMap = {
      car: {
        label: "Avtomobil",
        icon: CarFront,
      },
      phone: {
        label: "Telefon",
        icon: Smartphone,
      },
      electronics: {
        label: "Elektronika",
        icon: Monitor,
      },
      clothing: {
        label: "Geyim",
        icon: Shirt,
      },
      realEstate: {
        label: "Daşınmaz əmlak",
        icon: Home,
      },
      homeGarden: {
        label: "Ev və bağ",
        icon: Sofa,
      },
      household: {
        label: "Məişət",
        icon: Package,
      },
      accessory: {
        label: "Aksesuar",
        icon: Gem,
      },
      listing: {
        label: "Digər",
        icon: BriefcaseBusiness,
      },
    };

    return (
      categoryMap[category] || {
        label: "Digər",
        icon: Store,
      }
    );
  };

  const categoryInfo = getCategoryInfo(business?.category);
  const CategoryIcon = categoryInfo.icon;

  // =====================================================
  // ELAN DETAL SƏHİFƏSİ
  // =====================================================

  const getAdDetailPath = (ad) => {
    const adId = ad?._id || ad?.id;
    const category = ad?.category || ad?.__type || business?.category;

    const routes = {
      car: `/PostDetailCar/${adId}`,
      phone: `/PostDetailPhone/${adId}`,
      electronics: `/PostDetailElectronics/${adId}`,
      clothing: `/PostDetailClothing/${adId}`,
      realEstate: `/PostRealEstate/${adId}`,
      homeGarden: `/PostDetailHome/${adId}`,
      household: `/PostDetailHousehold/${adId}`,
      accessory: `/PostDetailAcsesuar/${adId}`,
      listing: `/PostDetail/${adId}`,
    };

    return routes[category] || `/PostDetail/${adId}`;
  };

  // =====================================================
  // ELAN YERLƏŞDİRMƏ
  // =====================================================

  const handleCreateAd = () => {
    if (!isOwner) {
      return;
    }

    if (!business?._id) {
      console.error("❌ Business ID yoxdur");
      return;
    }

    if (!business.category) {
      console.error("❌ Business category yoxdur:", business);

      Swal.fire({
        icon: "warning",
        title: "Kateqoriya yoxdur",
        text: "Bu biznes üçün kateqoriya təyin edilməyib. Zəhmət olmasa biznes kateqoriyasını yoxlayın.",
        confirmButtonText: "Bağla",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    navigate("/CreateCatalogPost", {
      state: {
        businessId: business._id,
        businessName: business.businessName,
        businessCategory: business.category,
      },
    });
  };

  // =====================================================
  // EDIT MODAL AÇ
  // =====================================================

  const handleOpenEditModal = (ad) => {
    if (!isOwner) {
      return;
    }

    const adId = ad?._id || ad?.id;

    if (!adId) {
      Swal.fire({
        icon: "error",
        title: "Xəta",
        text: "Elan məlumatları tapılmadı.",
        confirmButtonText: "Bağla",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    setEditingAd(ad);

    setEditForm({
      title: ad?.title || "",
      price:
        ad?.price !== undefined && ad?.price !== null ? String(ad.price) : "",
      city: ad?.city || "",
      location: ad?.location || "",
      description: ad?.description || "",
    });

    setEditModalOpen(true);
  };

  // =====================================================
  // EDIT MODAL BAĞLA
  // =====================================================

  const handleCloseEditModal = () => {
    if (savingEdit) {
      return;
    }

    setEditModalOpen(false);
    setEditingAd(null);

    setEditForm({
      title: "",
      price: "",
      city: "",
      location: "",
      description: "",
    });
  };

  // =====================================================
  // FORM DƏYİŞİKLİYİ
  // =====================================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // ELANI YENİLƏ
  // =====================================================

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!isOwner) {
      return;
    }

    if (!editingAd) {
      return;
    }

    const adId = editingAd?._id || editingAd?.id;

    const category =
      editingAd?.category || editingAd?.__type || business?.category;

    if (!adId || !category) {
      Swal.fire({
        icon: "error",
        title: "Xəta",
        text: "Elanın kateqoriyası və ID-si tapılmadı.",
        confirmButtonText: "Bağla",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    if (!editForm.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Başlıq boşdur",
        text: "Elanın başlığını daxil edin.",
        confirmButtonText: "Bağla",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    setSavingEdit(true);

    try {
      const token = localStorage.getItem("token");

      const updateData = {
        title: editForm.title.trim(),
        price: editForm.price === "" ? 0 : Number(editForm.price),
        city: editForm.city.trim(),
        location: editForm.location.trim(),
        description: editForm.description.trim(),
      };

      console.log("✏️ EDIT CATEGORY:", category);
      console.log("✏️ EDIT ID:", adId);
      console.log("✏️ EDIT DATA:", updateData);

      const res = await axios.put(
        `${API}/api/${category}/${adId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("✅ ELAN YENİLƏNDİ:", res.data);

      const updatedAd =
        res.data?.ad || res.data?.listing || res.data?.item || res.data;

      setAds((prev) =>
        prev.map((item) => {
          const itemId = item?._id || item?.id;

          if (String(itemId) === String(adId)) {
            return {
              ...item,
              ...updateData,
              ...(updatedAd && typeof updatedAd === "object" ? updatedAd : {}),
            };
          }

          return item;
        }),
      );

      handleCloseEditModal();

      // =================================================
      // UĞURLU YENİLƏMƏ SWEET ALERT
      // =================================================

      await Swal.fire({
        icon: "success",
        title: "Uğurlu!",
        text: "Elan uğurla yeniləndi.",
        confirmButtonText: "Bağla",
        confirmButtonColor: "#670fff",
      });
    } catch (error) {
      console.error("❌ Elan yenilənmədi:", error);
      console.error("❌ SERVER RESPONSE:", error.response?.data);

      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Elan yenilənərkən xəta baş verdi.",
        confirmButtonText: "Bağla",
        confirmButtonColor: "#670fff",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  // =====================================================
  // ELANI SİL
  // =====================================================

  const handleDeleteAd = async (ad) => {
    if (!isOwner) {
      return;
    }

    const adId = ad?._id || ad?.id;

    const category = ad?.category || ad?.__type || business?.category;

    if (!adId || !category) {
      Swal.fire({
        icon: "error",
        title: "Xəta",
        text: "Elan məlumatları tapılmadı.",
        confirmButtonText: "Bağla",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    // =================================================
    // SİLMƏ TƏSDİQİ SWEET ALERT
    // =================================================

    const result = await Swal.fire({
      icon: "warning",
      title: "Elanı silmək istəyirsiniz?",
      text: "Bu əməliyyat geri qaytarıla bilməz.",
      showCancelButton: true,
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Ləğv et",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API}/api/${category}/${adId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAds((prev) =>
        prev.filter((item) => String(item?._id || item?.id) !== String(adId)),
      );

      // =================================================
      // UĞURLU SİLİNMƏ SWEET ALERT
      // =================================================

      await Swal.fire({
        icon: "success",
        title: "Silindi!",
        text: "Elan uğurla silindi.",
        confirmButtonText: "Bağla",
        confirmButtonColor: "#670fff",
      });
    } catch (error) {
      console.error("❌ Elan silinmədi:", error);

      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Elan silinərkən xəta baş verdi.",
        confirmButtonText: "Bağla",
        confirmButtonColor: "#670fff",
      });
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0b0f]">
        <Loader2 size={35} className="animate-spin text-[#670fff]" />
      </div>
    );
  }

  // =====================================================
  // BİZNES TAPILMADI
  // =====================================================

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0b0b0f] px-4">
        <Building2 size={50} className="text-slate-400 mb-4" />

        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Biznes profili tapılmadı
        </h1>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-5 px-5 py-3 rounded-xl bg-[#670fff] text-white font-bold"
        >
          Geri qayıt
        </button>
      </div>
    );
  }

  // =====================================================
  // SƏHİFƏ
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0b0f] rounded-3xl">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-5">
        {/* =====================================================
            GERİ
        ====================================================== */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#670fff] transition"
        >
          <ArrowLeft size={18} />
          Geri qayıt
        </button>

        {/* =====================================================
            BİZNES BAŞLIĞI
        ====================================================== */}

        <div className="bg-white dark:bg-[#15151b] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
          {/* Cover */}

          <div className="h-40 sm:h-56 bg-gradient-to-r from-[#670fff] to-purple-400 relative">
            {business.coverImage && (
              <img
                src={business.coverImage}
                alt={business.businessName}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="px-5 sm:px-8 pb-7">
            {/* Logo + biznes adı */}

            <div className="-mt-14 relative flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Logo */}

              <div className="w-28 h-28 rounded-3xl bg-white dark:bg-[#15151b] border-4 border-white dark:border-[#15151b] shadow-lg overflow-hidden flex items-center justify-center">
                {business.logo ? (
                  <img
                    src={business.logo}
                    alt={business.businessName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store size={42} className="text-[#670fff]" />
                )}
              </div>

              {/* Biznes məlumatı */}

              <div className="flex-1 pt-2 sm:pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {business.businessName}
                  </h1>

                  {business.verified && (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                      ✓ Təsdiqlənmiş
                    </span>
                  )}
                </div>

                {/* Biznes növü */}

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {business.businessType === "magaza"
                    ? "Mağaza"
                    : business.businessType === "avtosalon"
                      ? "Avtosalon"
                      : business.businessType === "sirket"
                        ? "Şirkət"
                        : business.businessType === "xidmet"
                          ? "Xidmət"
                          : "Digər"}
                </p>

                {/* Kateqoriya */}

                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#670fff]/10 text-[#670fff] text-xs font-bold">
                  <CategoryIcon size={15} />
                  {categoryInfo.label}
                </div>
              </div>

              {/* =====================================================
                  ELAN YERLƏŞDİR
                  YALNIZ SAHİB GÖRÜR
              ====================================================== */}

              {isOwner && (
                <button
                  type="button"
                  onClick={handleCreateAd}
                  className="sm:mb-2 w-full sm:w-auto px-5 py-3 rounded-xl bg-[#670fff] hover:bg-[#5700db] text-white font-black flex items-center justify-center gap-2 transition shadow-lg shadow-[#670fff]/20"
                >
                  <Plus size={19} />
                  Elan yerləşdir
                </button>
              )}
            </div>

            {/* =====================================================
                MƏLUMATLAR
            ====================================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-7">
              {/* Şəhər */}

              {business.city && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#101015]">
                  <MapPin size={19} className="text-[#670fff]" />

                  <div>
                    <div className="text-xs text-slate-400">Şəhər</div>

                    <div className="font-bold text-sm text-slate-800 dark:text-white">
                      {business.city}
                    </div>
                  </div>
                </div>
              )}

              {/* Ünvan */}

              {business.address && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#101015]">
                  <MapPin size={19} className="text-[#670fff]" />

                  <div>
                    <div className="text-xs text-slate-400">Ünvan</div>

                    <div className="font-bold text-sm text-slate-800 dark:text-white">
                      {business.address}
                    </div>
                  </div>
                </div>
              )}

              {/* Telefon */}

              {business.phone && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#101015]">
                  <Phone size={19} className="text-[#670fff]" />

                  <div>
                    <div className="text-xs text-slate-400">Telefon</div>

                    <div className="font-bold text-sm text-slate-800 dark:text-white">
                      {business.phone}
                    </div>
                  </div>
                </div>
              )}

              {/* Email */}

              {business.email && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#101015]">
                  <Mail size={19} className="text-[#670fff]" />

                  <div className="min-w-0">
                    <div className="text-xs text-slate-400">E-poçt</div>

                    <div className="font-bold text-sm text-slate-800 dark:text-white truncate">
                      {business.email}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* =====================================================
                BİZNES HAQQINDA
            ====================================================== */}

            {business.description && (
              <div className="mt-7">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Biznes haqqında
                </h2>

                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300 whitespace-pre-line">
                  {business.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            ELANLAR
        ====================================================== */}

        <div className="mt-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {categoryInfo.label} elanları
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {ads.length} elan
              </p>
            </div>

            <CategoryIcon size={27} className="text-[#670fff]" />
          </div>

          {/* =====================================================
              ELAN YOXDUR
          ====================================================== */}

          {ads.length === 0 ? (
            <div className="bg-white dark:bg-[#15151b] border border-slate-200 dark:border-white/10 rounded-3xl p-10 text-center">
              <CategoryIcon
                size={45}
                className="mx-auto text-slate-300 dark:text-slate-600"
              />

              <h3 className="mt-4 font-black text-lg text-slate-900 dark:text-white">
                Hələ elan yoxdur
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                İlk {categoryInfo.label.toLowerCase()} elanınızı yerləşdirin.
              </p>

              {/* Yalnız sahib görür */}

              {isOwner && (
                <button
                  type="button"
                  onClick={handleCreateAd}
                  className="mt-5 px-5 py-3 rounded-xl bg-[#670fff] text-white font-black inline-flex items-center gap-2"
                >
                  <Plus size={18} />
                  İlk elanı yerləşdir
                </button>
              )}
            </div>
          ) : (
            /* =====================================================
               ELANLAR
            ====================================================== */

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {ads.map((ad) => {
                const adId = ad?._id || ad?.id;
                const detailPath = getAdDetailPath(ad);

                return (
                  <div
                    key={adId}
                    className="group bg-white dark:bg-[#15151b] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* =================================================
                        ELAN DETALINA KEÇİD
                    ================================================== */}

                    <Link to={detailPath} className="block">
                      {/* Şəkil */}

                      <div className="relative h-36 sm:h-48 bg-slate-100 dark:bg-[#101015] overflow-hidden">
                        {(ad.mainImage || ad.images?.[0]) && (
                          <img
                            src={ad.mainImage || ad.images?.[0]}
                            alt={ad.title || "Elan"}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}

                        {!ad.mainImage && !ad.images?.[0] && (
                          <div className="w-full h-full flex items-center justify-center">
                            <Store
                              size={35}
                              className="text-slate-300 dark:text-slate-600"
                            />
                          </div>
                        )}

                        {/* DETAL İKONU */}

                        <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur">
                          <ExternalLink size={14} />
                        </div>
                      </div>

                      {/* Məlumat */}

                      <div className="p-3">
                        <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2">
                          {ad.title || "Adsız elan"}
                        </h3>

                        <div className="mt-2 text-lg font-black text-[#670fff]">
                          {ad.price
                            ? `${Number(ad.price).toLocaleString("az-AZ")} ₼`
                            : "Qiymət yoxdur"}
                        </div>

                        {ad.city && (
                          <div className="mt-1 text-xs text-slate-500">
                            {ad.city}
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* =================================================
                        SADECE BİZNES SAHİBİNƏ İDARƏETMƏ
                    ================================================== */}

                    {isOwner && (
                      <div className="flex items-center gap-2 border-t border-slate-100 dark:border-white/10 p-3">
                        {/* DÜZƏLİŞ */}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleOpenEditModal(ad);
                          }}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#670fff]/20 bg-[#670fff]/5 px-3 py-2.5 text-sm font-black text-[#670fff] transition hover:bg-[#670fff]/10"
                        >
                          <Pencil size={16} />
                          Düzəliş
                        </button>

                        {/* SİL */}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteAd(ad);
                          }}
                          className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-black text-red-600 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                        >
                          <Trash2 size={16} />
                          Sil
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          EDIT MODAL
      ========================================================== */}

      {editModalOpen && editingAd && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-3 sm:px-5 py-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !savingEdit) {
              handleCloseEditModal();
            }
          }}
        >
          <div
            className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#15151b] shadow-2xl border border-slate-200 dark:border-white/10"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* =====================================================
                MODAL HEADER
            ====================================================== */}

            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#15151b] px-5 sm:px-6 py-4">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Elanı düzəliş et
                </h2>

                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                  {editingAd.title || "Adsız elan"}
                </p>
              </div>

              <button
                type="button"
                disabled={savingEdit}
                onClick={handleCloseEditModal}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/15 transition disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* =====================================================
                MODAL BODY
            ====================================================== */}

            <form onSubmit={handleSaveEdit} className="p-5 sm:p-6 space-y-5">
              {/* Başlıq */}

              <div>
                <label className="block mb-2 text-sm font-black text-slate-800 dark:text-slate-200">
                  Elanın başlığı
                </label>

                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  placeholder="Elanın başlığını daxil edin"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10"
                />
              </div>

              {/* Qiymət */}

              <div>
                <label className="block mb-2 text-sm font-black text-slate-800 dark:text-slate-200">
                  Qiymət
                </label>

                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                    min="0"
                    step="0.01"
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] px-4 py-3.5 pr-12 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400">
                    ₼
                  </span>
                </div>
              </div>

              {/* Şəhər + Ünvan */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-black text-slate-800 dark:text-slate-200">
                    Şəhər
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={editForm.city}
                    onChange={handleEditChange}
                    placeholder="Məsələn: Bakı"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-black text-slate-800 dark:text-slate-200">
                    Ünvan / Yer
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    placeholder="Məsələn: Nərimanov"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10"
                  />
                </div>
              </div>

              {/* Açıqlama */}

              <div>
                <label className="block mb-2 text-sm font-black text-slate-800 dark:text-slate-200">
                  Açıqlama
                </label>

                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows={6}
                  placeholder="Elan haqqında məlumat..."
                  className="w-full resize-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10"
                />
              </div>

              {/* =================================================
                  BUTTONS
              ================================================== */}

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  disabled={savingEdit}
                  onClick={handleCloseEditModal}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-5 py-3.5 font-black text-slate-700 dark:text-slate-200 transition hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-50"
                >
                  Ləğv et
                </button>

                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 rounded-xl bg-[#670fff] hover:bg-[#5700db] px-5 py-3.5 font-black text-white transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {savingEdit ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Yadda saxlanılır...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Yadda saxla
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
};

export default BusinessProfile;
