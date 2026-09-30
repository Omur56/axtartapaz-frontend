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
  Clock,
  ImagePlus,
  Upload,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

const DEFAULT_WORKING_HOURS = {
  monday: {
    open: "09:00",
    close: "19:00",
    closed: false,
  },
  tuesday: {
    open: "09:00",
    close: "19:00",
    closed: false,
  },
  wednesday: {
    open: "09:00",
    close: "19:00",
    closed: false,
  },
  thursday: {
    open: "09:00",
    close: "19:00",
    closed: false,
  },
  friday: {
    open: "09:00",
    close: "19:00",
    closed: false,
  },
  saturday: {
    open: "10:00",
    close: "17:00",
    closed: false,
  },
  sunday: {
    open: "10:00",
    close: "17:00",
    closed: true,
  },
};

const WORKING_DAYS = [
  {
    key: "monday",
    label: "Bazar ertəsi",
  },
  {
    key: "tuesday",
    label: "Çərşənbə axşamı",
  },
  {
    key: "wednesday",
    label: "Çərşənbə",
  },
  {
    key: "thursday",
    label: "Cümə axşamı",
  },
  {
    key: "friday",
    label: "Cümə",
  },
  {
    key: "saturday",
    label: "Şənbə",
  },
  {
    key: "sunday",
    label: "Bazar",
  },
];

const BUSINESS_TYPES = [
  {
    value: "magaza",
    label: "Mağaza",
  },
  {
    value: "avtosalon",
    label: "Avtosalon",
  },
  {
    value: "sirket",
    label: "Şirkət",
  },
  {
    value: "xidmet",
    label: "Xidmət",
  },
  {
    value: "digər",
    label: "Digər",
  },
];

// =====================================================
// ANONİM / QONAQ İSTİFADƏÇİ BAXIŞ ID
// =====================================================

const getVisitorId = () => {
  let visitorId = localStorage.getItem("businessVisitorId");

  if (!visitorId) {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      visitorId = crypto.randomUUID();
    } else {
      visitorId = `visitor-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;
    }

    localStorage.setItem("businessVisitorId", visitorId);
  }

  return visitorId;
};

const BusinessProfile = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const API = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");

  // =====================================================
  // BUSINESS
  // =====================================================

  const [business, setBusiness] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // =====================================================
  // AD EDIT MODAL
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
  // BUSINESS EDIT MODAL
  // =====================================================

  const [businessEditModalOpen, setBusinessEditModalOpen] = useState(false);
  const [savingBusiness, setSavingBusiness] = useState(false);

  const [businessEditForm, setBusinessEditForm] = useState({
    businessName: "",
    businessType: "magaza",
    description: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    workingHours: DEFAULT_WORKING_HOURS,
  });

  const [logoFile, setLogoFile] = useState(null);

  const [coverFiles, setCoverFiles] = useState([]);
  const [logoPreview, setLogoPreview] = useState("");

  const [coverPreviews, setCoverPreviews] = useState([]);

  // =====================================================
  // COVER CAROUSEL
  // =====================================================

  const [activeCoverIndex, setActiveCoverIndex] = useState(0);
  const [coverProgress, setCoverProgress] = useState(0);

  const COVER_DURATION = 8000;

  const [businessViews, setBusinessViews] = useState(null);
  const [loadingViews, setLoadingViews] = useState(false);
  const [publicViewCount, setPublicViewCount] = useState(0);

  // =====================================================
  // DİGƏR İSTİFADƏÇİLƏR ÜÇÜN BİZNES BAXIŞ SAYI
  // =====================================================

  const fetchPublicViewCount = async (businessId) => {
    if (!businessId) return;

    try {
      const response = await axios.get(
        `${API}/api/business/${businessId}/public-views`,
      );

      setPublicViewCount(Number(response.data?.totalViews || 0));
    } catch (error) {
      console.error("❌ Public business view count error:", error);
    }
  };

  // =====================================================
  // BİZNES MƏLUMATLARINI GƏTİR
  // =====================================================

  const fetchBusinessViews = async () => {
    if (!business?._id || !isOwner) return;

    try {
      setLoadingViews(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API}/api/business/${business._id}/views`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBusinessViews(response.data);
    } catch (error) {
      console.error("❌ Business views error:", error);
    } finally {
      setLoadingViews(false);
    }
  };

  useEffect(() => {
    if (business?._id && isOwner) {
      fetchBusinessViews();
    }
  }, [business?._id, isOwner]);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API}/api/business/${slug}`);

        console.log("🏪 FULL BUSINESS RESPONSE:", res.data);
        console.log("🏪 BUSINESS FROM API:", res.data?.business);

        const businessData = res.data?.business || null;

        if (businessData) {
          console.log("🏪 BUSINESS ID:", businessData._id);
          console.log("🏪 BUSINESS NAME:", businessData.businessName);
          console.log("🏪 BUSINESS CATEGORY:", businessData.category);
          console.log("👤 BUSINESS OWNER:", businessData.owner);
        }

        setBusiness(businessData);
        setAds(res.data?.ads || []);

        // Digər istifadəçilər üçün ümumi baxış sayını gətir
        if (businessData?._id) {
          fetchPublicViewCount(businessData._id);
        }

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

        // =================================================
        // BİZNES PROFİLİ BAXIŞINI QEYDƏ AL
        // Qeydiyyatlı istifadəçi + Qonaq istifadəçi
        // =================================================

        if (
          businessData?._id &&
          String(currentUserId || "") !== String(ownerId || "")
        ) {
          try {
            const visitorId = getVisitorId();
            const token = localStorage.getItem("token");

            const headers = {
              "x-visitor-id": visitorId,
            };

            // Login olunubsa token də göndərilir.
            // Qonaq istifadəçidə yalnız visitorId göndərilir.
            if (token) {
              headers.Authorization = `Bearer ${token}`;
            }

            const viewResponse = await axios.post(
              `${API}/api/business/${businessData._id}/view`,
              {},
              {
                headers,
              },
            );

            console.log("👁️ BUSINESS VIEW RESPONSE:", viewResponse.data);
            console.log(
              "👤 BUSINESS VIEWER:",
              currentUserId ? "Qeydiyyatlı istifadəçi" : "Qonaq",
            );
            console.log("🆔 VISITOR ID:", visitorId);

            // Yeni baxış qeydə alınıbsa ekrandakı ümumi sayı da yenilə.
            if (viewResponse.data?.counted) {
              await fetchPublicViewCount(businessData._id);
            }
          } catch (viewError) {
            console.error("❌ Business view error:", viewError);
          }
        }

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
  // COVER CAROUSEL - AVTOMATİK KEÇİD
  // =====================================================

  useEffect(() => {
    const images =
      business?.coverImages?.length > 0
        ? business.coverImages
        : business?.coverImage
          ? [business.coverImage]
          : [];

    if (images.length <= 1) {
      setActiveCoverIndex(0);
      setCoverProgress(0);
      return;
    }

    setActiveCoverIndex((current) => (current >= images.length ? 0 : current));

    const startedAt = Date.now();

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startedAt;

      const progress = Math.min(100, (elapsed / COVER_DURATION) * 100);

      setCoverProgress(progress);
    }, 50);

    const slideTimer = setTimeout(() => {
      setActiveCoverIndex((current) =>
        current >= images.length - 1 ? 0 : current + 1,
      );

      setCoverProgress(0);
    }, COVER_DURATION);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(slideTimer);
    };
  }, [business?.coverImages, business?.coverImage, activeCoverIndex]);

  // =====================================================
  // COVER - NÖVBƏTİ ŞƏKİL
  // =====================================================

  const goToNextCover = () => {
    const images =
      business?.coverImages?.length > 0
        ? business.coverImages
        : business?.coverImage
          ? [business.coverImage]
          : [];

    if (images.length <= 1) {
      return;
    }

    setActiveCoverIndex((current) =>
      current >= images.length - 1 ? 0 : current + 1,
    );

    setCoverProgress(0);
  };

  // =====================================================
  // COVER - ƏVVƏLKİ ŞƏKİL
  // =====================================================

  const goToPreviousCover = () => {
    const images =
      business?.coverImages?.length > 0
        ? business.coverImages
        : business?.coverImage
          ? [business.coverImage]
          : [];

    if (images.length <= 1) {
      return;
    }

    setActiveCoverIndex((current) =>
      current <= 0 ? images.length - 1 : current - 1,
    );

    setCoverProgress(0);
  };

  // =====================================================
  // KATEQORİYA MƏLUMATI
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
  // BİZNES REDAKTƏ MODALINI AÇ
  // =====================================================

  const openBusinessEditModal = () => {
    if (!business || !isOwner) {
      return;
    }

    const existingHours = business.workingHours || {};

    const mergedWorkingHours = {};

    WORKING_DAYS.forEach(({ key }) => {
      mergedWorkingHours[key] = {
        ...DEFAULT_WORKING_HOURS[key],
        ...(existingHours[key] || {}),
      };
    });

    setBusinessEditForm({
      businessName: business.businessName || "",
      businessType: business.businessType || "magaza",
      description: business.description || "",
      phone: business.phone || "",
      email: business.email || "",
      address: business.address || "",
      city: business.city || "",
      workingHours: mergedWorkingHours,
    });

    setLogoFile(null);

    setCoverFiles([]);

    setLogoPreview(business.logo || "");

    const existingCoverImages =
      business.coverImages?.length > 0
        ? business.coverImages
        : business.coverImage
          ? [business.coverImage]
          : [];

    setCoverPreviews(existingCoverImages);

    setBusinessEditModalOpen(true);
  };

  // =====================================================
  // BİZNES MODALINI BAĞLA
  // =====================================================

  const closeBusinessEditModal = () => {
    if (savingBusiness) {
      return;
    }

    coverPreviews.forEach((url) => {
      if (url?.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });

    if (logoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    setBusinessEditModalOpen(false);

    setLogoFile(null);
    setCoverFiles([]);

    setLogoPreview("");
    setCoverPreviews([]);
  };

  // =====================================================
  // İŞ SAATLARI DƏYİŞİKLİYİ
  // =====================================================

  const handleWorkingHourChange = (day, field, value) => {
    setBusinessEditForm((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value,
        },
      },
    }));
  };

  // =====================================================
  // GÜNÜ BAĞLA / AÇ
  // =====================================================

  const handleDayClosedChange = (day, checked) => {
    setBusinessEditForm((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          closed: checked,
        },
      },
    }));
  };

  // =====================================================
  // LOGO SEÇ
  // =====================================================

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Yanlış fayl",
        text: "Logo yalnız şəkil formatında olmalıdır.",
        confirmButtonColor: "#670fff",
      });

      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Fayl çox böyükdür",
        text: "Logo maksimum 10 MB ola bilər.",
        confirmButtonColor: "#670fff",
      });

      e.target.value = "";
      return;
    }

    /*
     * Köhnə blob URL varsa təmizlə.
     */
    if (logoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setLogoFile(file);
    setLogoPreview(previewUrl);
  };
  // =====================================================
  // COVER SEÇ
  // =====================================================

  // =====================================================
  // COVER ŞƏKİLLƏRİ SEÇ
  // =====================================================

  const handleCoverChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) {
      return;
    }

    if (files.length > 10) {
      Swal.fire({
        icon: "warning",
        title: "Çox şəkil seçildi",
        text: "Maksimum 10 cover şəkli seçə bilərsiniz.",
        confirmButtonColor: "#670fff",
      });

      e.target.value = "";
      return;
    }

    const invalidFile = files.find((file) => !file.type.startsWith("image/"));

    if (invalidFile) {
      Swal.fire({
        icon: "error",
        title: "Yanlış fayl",
        text: "Cover şəkilləri yalnız şəkil formatında olmalıdır.",
        confirmButtonColor: "#670fff",
      });

      e.target.value = "";
      return;
    }

    const oversizedFile = files.find((file) => file.size > 10 * 1024 * 1024);

    if (oversizedFile) {
      Swal.fire({
        icon: "error",
        title: "Fayl çox böyükdür",
        text: "Hər cover şəkli maksimum 10 MB ola bilər.",
        confirmButtonColor: "#670fff",
      });

      e.target.value = "";
      return;
    }

    // Köhnə blob URL-ləri təmizlə
    coverPreviews.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });

    const previewUrls = files.map((file) => URL.createObjectURL(file));

    setCoverFiles(files);
    setCoverPreviews(previewUrls);

    e.target.value = "";
  };
  // =====================================================
  // BİZNES YENİLƏ
  // =====================================================

  const handleBusinessSave = async (e) => {
    e.preventDefault();

    if (!isOwner) {
      return;
    }

    if (!business?._id) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      await Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Bu əməliyyatı etmək üçün hesabınıza daxil olun.",
        confirmButtonColor: "#670fff",
      });
      return;
    }

    if (!businessEditForm.businessName.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Biznes adı boşdur",
        text: "Biznes adını daxil edin.",
        confirmButtonColor: "#670fff",
      });
      return;
    }

    try {
      setSavingBusiness(true);

      const formData = new FormData();

      formData.append("businessName", businessEditForm.businessName.trim());

      formData.append(
        "businessType",
        businessEditForm.businessType || "magaza",
      );

      formData.append("description", businessEditForm.description || "");

      formData.append("phone", businessEditForm.phone || "");

      formData.append("email", businessEditForm.email || "");

      formData.append("address", businessEditForm.address || "");

      formData.append("city", businessEditForm.city || "");

      formData.append(
        "workingHours",
        JSON.stringify(businessEditForm.workingHours),
      );

      // LOGO
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      // ÇOXLU COVER ŞƏKİLLƏRİ
      if (coverFiles.length > 0) {
        coverFiles.forEach((file) => {
          formData.append("coverImages", file);
        });
      }

      console.log("=================================");
      console.log("📤 BUSINESS UPDATE START");
      console.log("🏪 BUSINESS ID:", business._id);
      console.log("🏪 BUSINESS NAME:", businessEditForm.businessName);
      console.log("🖼️ LOGO FILE:", logoFile);
      console.log("🖼️ COVER FILES:", coverFiles);
      console.log("🖼️ COVER COUNT:", coverFiles.length);
      console.log("⏰ WORKING HOURS:", businessEditForm.workingHours);
      console.log("=================================");

      const response = await axios.put(
        `${API}/api/business/${business._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("=================================");
      console.log("✅ BUSINESS UPDATE RESPONSE:");
      console.log(response.data);
      console.log("=================================");

      if (!response.data?.business) {
        throw new Error("Server yenilənmiş biznes məlumatını qaytarmadı.");
      }

      /*
       * Serverdən gələn real MongoDB məlumatını
       * əvvəlcə state-ə yazırıq.
       */
      setBusiness(response.data.business);

      /*
       * Form məlumatlarını təmizləyirik.
       */
      setLogoFile(null);
      setCoverFiles([]);

      /*
       * Carousel vəziyyətini sıfırlayırıq.
       */
      setActiveCoverIndex(0);
      setCoverProgress(0);

      /*
       * Modalı bağlayırıq.
       */
      setBusinessEditModalOpen(false);

      /*
       * Əlavə olaraq biznesi serverdən yenidən götürürük.
       * Beləliklə MongoDB + Cloudinary məlumatlarının
       * səhifədə tam aktual olduğuna əmin oluruq.
       */
      try {
        const freshBusinessResponse = await axios.get(
          `${API}/api/business/${slug}`,
        );

        const freshBusiness = freshBusinessResponse.data?.business || null;

        const freshAds = freshBusinessResponse.data?.ads || [];

        if (freshBusiness) {
          setBusiness(freshBusiness);
        }

        setAds(freshAds);

        console.log("🔄 FRESH BUSINESS DATA:", freshBusiness);
      } catch (refreshError) {
        console.error("⚠️ Business refresh error:", refreshError);
      }

      await Swal.fire({
        icon: "success",
        title: "Uğurla yadda saxlanıldı",
        text: "Biznes profiliniz yeniləndi.",
        confirmButtonColor: "#670fff",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("❌ BUSINESS UPDATE ERROR:", error);

      console.error("❌ SERVER STATUS:", error?.response?.status);

      console.error("❌ SERVER RESPONSE:", error?.response?.data);

      await Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Biznes profili yenilənə bilmədi.",
        confirmButtonColor: "#670fff",
      });
    } finally {
      setSavingBusiness(false);
    }
  };
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
  // ELAN EDIT MODALINI AÇ
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
  // ELAN EDIT MODALINI BAĞLA
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
  // ELAN FORM DƏYİŞİKLİYİ
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

  // digər istfadəçilərin biznes hesaba baxış sayı gətirən

  // =========
  return (
    <div className="w-[1010px] mx-auto">
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

      <div className=" max-w-screen overflow-hidden   shadow-sm">
        {/* COVER */}

        {/* =====================================================
    COVER CAROUSEL
===================================================== */}

        <div
          className="relative h-40 sm:h-80 overflow-hidden bg-gradient-to-r from-[#670fff] to-purple-400 select-none"
          onTouchStart={(e) => {
            e.currentTarget.dataset.touchStartX = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const startX = Number(e.currentTarget.dataset.touchStartX || 0);

            const endX = e.changedTouches[0].clientX;

            const difference = startX - endX;

            if (Math.abs(difference) < 50) {
              return;
            }

            if (difference > 0) {
              goToNextCover();
            } else {
              goToPreviousCover();
            }
          }}
        >
          {(() => {
            const coverImages =
              business.coverImages?.length > 0
                ? business.coverImages
                : business.coverImage
                  ? [business.coverImage]
                  : [];

            if (coverImages.length === 0) {
              return (
                <div className="w-full h-full bg-gradient-to-r from-[#670fff] to-purple-400" />
              );
            }

            return (
              <>
                {/* =================================================
            ŞƏKİL
        ================================================== */}

                <img
                  key={coverImages[activeCoverIndex]}
                  src={coverImages[activeCoverIndex]}
                  alt={business.businessName}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                />

                {/* =================================================
            DARK OVERLAY
        ================================================== */}

                <div className="absolute pointer-events-none" />

                {/* =================================================
            WHATSAPP STATUS PROGRESS
        ================================================== */}

                {coverImages.length > 1 && (
                  <div className="absolute top-3 left-3 right-3 z-20 flex gap-1.5">
                    {coverImages.map((image, index) => {
                      const isCompleted = index < activeCoverIndex;

                      const isCurrent = index === activeCoverIndex;

                      return (
                        <div
                          key={`${image}-${index}`}
                          className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/35 backdrop-blur-sm"
                        >
                          <div
                            className="h-full rounded-full bg-white transition-[width] duration-75 ease-linear"
                            style={{
                              width: isCompleted
                                ? "100%"
                                : isCurrent
                                  ? `${coverProgress}%`
                                  : "0%",
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* =================================================
            SOL TƏRƏF - ƏVVƏLKİ
        ================================================== */}
                {/* =================================================
    SOL TƏRƏF - ƏVVƏLKİ COVER
================================================= */}
                {coverImages.length > 1 && (
                  <button
                    type="button"
                    aria-label="Əvvəlki cover"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPreviousCover();
                    }}
                    className="
      absolute left-3 top-1/2 -translate-y-1/2
      z-30
      flex h-10 w-10
      items-center justify-center
      rounded-full
      bg-black/45
      text-white
      backdrop-blur-md
      shadow-lg
      transition-all
      duration-200
      hover:bg-black/70
      hover:scale-105
      active:scale-95
    "
                  >
                    <ChevronLeft size={26} strokeWidth={2.5} />
                  </button>
                )}

                {/* =================================================
    SAĞ TƏRƏF - NÖVBƏTİ COVER
================================================= */}
                {coverImages.length > 1 && (
                  <button
                    type="button"
                    aria-label="Növbəti cover"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNextCover();
                    }}
                    className="
      absolute right-3 top-1/2 -translate-y-1/2
      z-30
      flex h-10 w-10
      items-center justify-center
      rounded-full
      bg-black/45
      text-white
      backdrop-blur-md
      shadow-lg
      transition-all
      duration-200
      hover:bg-black/70
      hover:scale-105
      active:scale-95
    "
                  >
                    <ChevronRight size={26} strokeWidth={2.5} />
                  </button>
                )}

                {/* =================================================
            ŞƏKİL SAYI
        ================================================== */}

                {coverImages.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                    {activeCoverIndex + 1} / {coverImages.length}
                  </div>
                )}
              </>
            );
          })()}

          {/* =================================================
      REDAKTƏ
  ================================================== */}

          {isOwner && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openBusinessEditModal();
              }}
              className="absolute right-4 top-7 z-30 flex items-center gap-2 rounded-xl bg-black/40 backdrop-blur-md px-4 py-2.5 text-sm font-bold text-white hover:bg-black/60 transition"
            >
              <Pencil size={16} />
              Redaktə et
            </button>
          )}
        </div>

        <div className="px-5 sm:px-8 pb-7">
          {/* LOGO + NAME */}

          <div className="-mt-14 relative flex flex-col sm:flex-row sm:items-end gap-4">
            {/* LOGO */}

            <div className="w-28 h-28 rounded-3xl bg-white dark:bg-[#15151b] border-4 border-white dark:border-[#15151b] shadow-lg overflow-hidden flex items-center justify-center shrink-0">
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

            {/* BUSINESS INFO */}

            <div className="flex-1 pt-2 sm:pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-black dark:text-white">
                  {business.businessName}
                </h1>

                {business.verified && (
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                    ✓ Təsdiqlənmiş
                  </span>
                )}
              </div>

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

              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#670fff]/10 text-[#670fff] text-xs font-bold">
                <CategoryIcon size={15} />
                {categoryInfo.label}
              </div>
            </div>

            {/* OWNER BUTTONS */}

            {isOwner && (
              <div className="flex flex-col sm:flex-row gap-2 sm:mb-2">
                <button
                  type="button"
                  onClick={handleCreateAd}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#670fff] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-[#5600db] active:scale-95"
                >
                  <Plus size={17} />
                  Elan yerləşdir
                </button>

                <button
                  type="button"
                  onClick={openBusinessEditModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#670fff]/20 bg-[#670fff]/5 px-4 py-2.5 text-sm font-bold text-[#670fff] transition hover:bg-[#670fff]/10 active:scale-95"
                >
                  <Pencil size={17} />
                  Biznesi redaktə et
                </button>
              </div>
            )}
          </div>

          {/* =====================================================
                MƏLUMATLAR
            ====================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-7">
            {/* ŞƏHƏR */}

            {business.city && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#101015]">
                <MapPin size={19} className="text-[#670fff] shrink-0" />

                <div className="min-w-0">
                  <div className="text-xs text-slate-400">Şəhər</div>

                  <div className="font-bold text-sm text-slate-800 dark:text-white truncate">
                    {business.city}
                  </div>
                </div>
              </div>
            )}

            {/* ÜNVAN */}

            {business.address && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#101015]">
                <MapPin size={19} className="text-[#670fff] shrink-0" />

                <div className="min-w-0">
                  <div className="text-xs text-slate-400">Ünvan</div>

                  <div className="font-bold text-sm text-slate-800 dark:text-white truncate">
                    {business.address}
                  </div>
                </div>
              </div>
            )}

            {/* TELEFON */}

            {business.phone && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#101015]">
                <Phone size={19} className="text-[#670fff] shrink-0" />

                <div className="min-w-0">
                  <div className="text-xs text-slate-400">Telefon</div>

                  <div className="font-bold text-sm text-slate-800 dark:text-white truncate">
                    {business.phone}
                  </div>
                </div>
              </div>
            )}

            {/* EMAIL */}

            {business.email && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#101015]">
                <Mail size={19} className="text-[#670fff] shrink-0" />

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
                İŞ SAATLARI
            ====================================================== */}
          {isOwner && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black">Profil statistikası</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Biznes profilinizə daxil olan istifadəçilər
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchBusinessViews}
                  className="rounded-xl bg-[#670fff] px-4 py-2 text-sm font-bold text-white"
                >
                  Yenilə
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
                  <p className="text-sm text-slate-500">Ümumi baxış</p>

                  <p className="mt-1 text-2xl font-black">
                    {businessViews?.totalViews || 0}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
                  <p className="text-sm text-slate-500">Unikal istifadəçi</p>

                  <p className="mt-1 text-2xl font-black">
                    {businessViews?.uniqueUsers || 0}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <h4 className="mb-3 font-black">Profilə daxil olanlar</h4>

                {loadingViews ? (
                  <p className="text-sm text-slate-500">Yüklənir...</p>
                ) : businessViews?.visitors?.length ? (
                  <div className="space-y-2">
                    {businessViews.visitors.map((visitor) => (
                      <div
                        key={visitor.id}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-white/10"
                      >
                        {visitor.avatar ? (
                          <img
                            src={visitor.avatar}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#670fff] font-bold text-white">
                            {(visitor.username || visitor.name || "?")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div>
                          <p className="font-bold">
                            {visitor.name || visitor.username || "İstifadəçi"}
                            {visitor.surname ? ` ${visitor.surname}` : ""}
                          </p>

                          {visitor.username && (
                            <p className="text-xs text-slate-500">
                              @{visitor.username}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    Hələ heç bir istifadəçi profilə daxil olmayıb.
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#670fff] dark:bg-purple-950/40">
                <Clock size={20} />
              </div>
              <div className="w-full flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    İş saatları
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Biznesin həftəlik iş qrafiki
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Eye size={17} />
                  <span>{publicViewCount.toLocaleString("az-AZ")} baxış</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {WORKING_DAYS.map((day) => {
                const hours = {
                  ...DEFAULT_WORKING_HOURS[day.key],
                  ...(business.workingHours?.[day.key] || {}),
                };

                return (
                  <div
                    key={day.key}
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50"
                  >
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {day.label}
                    </span>

                    {hours.closed ? (
                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                        Bağlıdır
                      </span>
                    ) : (
                      <span className="font-bold text-[#670fff] whitespace-nowrap">
                        {hours.open} — {hours.close}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
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

        {/* ELAN YOXDUR */}

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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {ads.map((ad) => {
              const adId = ad?._id || ad?.id;
              const detailPath = getAdDetailPath(ad);

              return (
                <div
                  key={adId}
                  className="group bg-white dark:bg-[#15151b] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* DETAL */}

                  <Link to={detailPath} className="block">
                    {/* ŞƏKİL */}

                    <div className="relative h-36 sm:h-48 bg-slate-100 dark:bg-[#101015] overflow-hidden">
                      {ad.mainImage || ad.images?.[0] ? (
                        <img
                          src={ad.mainImage || ad.images?.[0]}
                          alt={ad.title || "Elan"}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Store
                            size={35}
                            className="text-slate-300 dark:text-slate-600"
                          />
                        </div>
                      )}

                      <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur">
                        <ExternalLink size={14} />
                      </div>
                    </div>

                    {/* MƏLUMAT */}

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

                  {/* OWNER CONTROLS */}

                  {isOwner && (
                    <div className="flex items-center gap-2 border-t border-slate-100 dark:border-white/10 p-3">
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

      {/* =========================================================
          BUSINESS EDIT MODAL
      ========================================================== */}

      {businessEditModalOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm px-3 sm:px-5 py-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !savingBusiness) {
              closeBusinessEditModal();
            }
          }}
        >
          <div
            className="relative w-full max-w-4xl max-h-[94vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#15151b] shadow-2xl border border-slate-200 dark:border-white/10"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* HEADER */}

            <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#15151b] px-5 sm:px-7 py-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Biznesi redaktə et
                </h2>

                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Biznes məlumatlarını, şəkilləri və iş saatlarını dəyişin
                </p>
              </div>

              <button
                type="button"
                disabled={savingBusiness}
                onClick={closeBusinessEditModal}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/15 transition disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleBusinessSave}
              className="p-5 sm:p-7 space-y-7"
            >
              {/* =================================================
                  COVER
              ================================================== */}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white">
                      Cover şəkli
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Biznes profilinin yuxarı hissəsində görünür
                    </p>
                  </div>

                  <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-[#670fff] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#5700db] transition">
                    <Upload size={16} />
                    Cover şəkilləri seç
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleCoverChange}
                    />
                  </label>
                </div>

                <div className="relative h-40 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-r from-[#670fff] to-purple-400 border border-slate-200 dark:border-white/10">
                  {coverPreviews.length > 0 ? (
                    <div className="w-full h-full flex gap-2 overflow-x-auto snap-x snap-mandatory">
                      {coverPreviews.map((image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="relative min-w-full h-full snap-center"
                        >
                          <img
                            src={image}
                            alt={`Cover ${index + 1}`}
                            className="w-full h-full object-cover"
                          />

                          <div className="absolute top-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                            {index + 1} / {coverPreviews.length}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/80">
                      <ImagePlus size={35} />

                      <span className="mt-2 text-sm font-bold">
                        Cover şəkilləri yoxdur
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Bir neçə şəkil seçə bilərsiniz. Maksimum 10 şəkil, hər biri
                  maksimum 10 MB. Cover ölçüsü: 1200 × 400 px (En × Hündürlük)
                </p>
              </div>

              {/* =================================================
                  LOGO
              ================================================== */}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white">
                      Biznes loqosu
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Profil şəkliniz kimi göstəriləcək
                    </p>
                  </div>

                  <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-[#670fff]/20 bg-[#670fff]/5 px-4 py-2.5 text-sm font-bold text-[#670fff] hover:bg-[#670fff]/10 transition">
                    <Upload size={16} />
                    Logo seç
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-[#101015] flex items-center justify-center shrink-0">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Store size={40} className="text-[#670fff]" />
                    )}
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <p>JPG, PNG, WEBP və digər şəkil formatları.</p>
                    <p className="mt-1">Maksimum ölçü: 10 MB.</p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  BASIC INFO
              ================================================== */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* BUSINESS NAME */}

                <div className="sm:col-span-2">
                  <label className="block mb-2 text-sm font-black text-slate-800 dark:text-slate-200">
                    Biznes adı
                  </label>

                  <input
                    type="text"
                    value={businessEditForm.businessName}
                    onChange={(e) =>
                      setBusinessEditForm((prev) => ({
                        ...prev,
                        businessName: e.target.value,
                      }))
                    }
                    placeholder="Biznes adını daxil edin"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10"
                  />
                </div>

                {/* BUSINESS TYPE */}

                <div>
                  <label className="block mb-2 text-sm font-black text-slate-800 dark:text-slate-200">
                    Biznes növü
                  </label>

                  <select
                    value={businessEditForm.businessType}
                    onChange={(e) =>
                      setBusinessEditForm((prev) => ({
                        ...prev,
                        businessType: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10"
                  >
                    {BUSINESS_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CITY */}

                <div>
                  <label className="block mb-2 text-sm font-black text-slate-800 dark:text-slate-200">
                    Şəhər
                  </label>

                  <input
                    type="text"
                    value={businessEditForm.city}
                    onChange={(e) =>
                      setBusinessEditForm((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    placeholder="Məsələn: Bakı"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10"
                  />
                </div>

                {/* ADDRESS */}

                <div>
                  <label className="block mb-2 text-sm font-black text-slate-800 dark:text-slate-200">
                    Ünvan
                  </label>

                  <input
                    type="text"
                    value={businessEditForm.address}
                    onChange={(e) =>
                      setBusinessEditForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="Məsələn: Nərimanov r."
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label className="block mb-2 text-sm font-black text-slate-800 dark:text-slate-200">
                    Telefon
                  </label>

                  <input
                    type="text"
                    value={businessEditForm.phone}
                    onChange={(e) =>
                      setBusinessEditForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="+994 XX XXX XX XX"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label className="block mb-2 text-sm font-black text-slate-800 dark:text-slate-200">
                    E-poçt
                  </label>

                  <input
                    type="email"
                    value={businessEditForm.email}
                    onChange={(e) =>
                      setBusinessEditForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="example@mail.com"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10"
                  />
                </div>

                {/* DESCRIPTION */}

                <div className="sm:col-span-2">
                  <label className="block mb-2 text-sm font-black text-slate-800 dark:text-slate-200">
                    Biznes haqqında
                  </label>

                  <textarea
                    rows={5}
                    value={businessEditForm.description}
                    onChange={(e) =>
                      setBusinessEditForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Biznesiniz haqqında məlumat yazın..."
                    className="w-full resize-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10"
                  />
                </div>
              </div>

              {/* =================================================
                  WORKING HOURS
              ================================================== */}

              <div>
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#670fff] dark:bg-purple-950/40">
                      <Clock size={20} />
                    </div>

                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white">
                        İş saatları
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Hər gün üçün iş vaxtını təyin edin
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {WORKING_DAYS.map((day) => {
                    const hours =
                      businessEditForm.workingHours?.[day.key] ||
                      DEFAULT_WORKING_HOURS[day.key];

                    return (
                      <div
                        key={day.key}
                        className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] p-4"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          {/* DAY */}

                          <div className="lg:w-44 shrink-0">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!hours.closed}
                                onChange={(e) =>
                                  handleDayClosedChange(
                                    day.key,
                                    !e.target.checked,
                                  )
                                }
                                className="h-5 w-5 accent-[#670fff]"
                              />

                              <span className="font-black text-sm text-slate-800 dark:text-slate-200">
                                {day.label}
                              </span>
                            </label>
                          </div>

                          {/* TIMES */}

                          {hours.closed ? (
                            <div className="flex-1">
                              <div className="inline-flex items-center rounded-xl bg-red-50 dark:bg-red-950/30 px-4 py-2.5 text-sm font-bold text-red-600 dark:text-red-400">
                                Bu gün bağlıdır
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block mb-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                                  Açılış
                                </label>

                                <input
                                  type="time"
                                  value={hours.open}
                                  onChange={(e) =>
                                    handleWorkingHourChange(
                                      day.key,
                                      "open",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#15151b] px-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#670fff]"
                                />
                              </div>

                              <div>
                                <label className="block mb-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                                  Bağlanış
                                </label>

                                <input
                                  type="time"
                                  value={hours.close}
                                  onChange={(e) =>
                                    handleWorkingHourChange(
                                      day.key,
                                      "close",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#15151b] px-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#670fff]"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* =================================================
                  BUTTONS
              ================================================== */}

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  disabled={savingBusiness}
                  onClick={closeBusinessEditModal}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-5 py-3.5 font-black text-slate-700 dark:text-slate-200 transition hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-50"
                >
                  Ləğv et
                </button>

                <button
                  type="submit"
                  disabled={savingBusiness}
                  className="flex-1 rounded-xl bg-[#670fff] hover:bg-[#5700db] px-5 py-3.5 font-black text-white transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {savingBusiness ? (
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

      {/* =========================================================
          AD EDIT MODAL
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
            {/* HEADER */}

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

            {/* FORM */}

            <form onSubmit={handleSaveEdit} className="p-5 sm:p-6 space-y-5">
              {/* TITLE */}

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

              {/* PRICE */}

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

              {/* CITY + LOCATION */}

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

              {/* DESCRIPTION */}

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

              {/* BUTTONS */}

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
