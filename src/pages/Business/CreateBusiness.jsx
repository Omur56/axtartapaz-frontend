import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Store,
  CarFront,
  Building2,
  BriefcaseBusiness,
  Wrench,
  MapPin,
  Phone,
  Mail,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Smartphone,
  Laptop,
  Home,
  Shirt,
  Sofa,
  Gem,
} from "lucide-react";

import Swal from "sweetalert2";

const CreateBusiness = () => {
  const navigate = useNavigate();

  const API = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    businessName: "",
    voen: "",
    businessType: "magaza",

    // 🔹 Biznesin elan kateqoriyası
    businessCategory: "",

    description: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });

  const [saving, setSaving] = useState(false);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // BUSINESS TYPE
  // =========================================================

  const handleBusinessType = (type) => {
    setFormData((prev) => ({
      ...prev,
      businessType: type,
    }));
  };

  // =========================================================
  // BUSINESS CATEGORY
  // =========================================================

  const handleBusinessCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      businessCategory: category,
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    // ---------------------------------------------------------
    // BUSINESS NAME
    // ---------------------------------------------------------

    if (!formData.businessName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Biznes adı daxil edilməyib",
        text: "Zəhmət olmasa biznesinizin adını yazın.",
        confirmButtonText: "Bağla",
      });

      return;
    }

    // ---------------------------------------------------------
    // VOEN
    // ---------------------------------------------------------

    if (!formData.voen.trim()) {
      Swal.fire({
        icon: "warning",
        title: "VÖEN daxil edilməyib",
        text: "Zəhmət olmasa VÖEN-i daxil edin.",
        confirmButtonText: "Bağla",
      });

      return;
    }

    if (!/^\d{10}$/.test(formData.voen.trim())) {
      Swal.fire({
        icon: "warning",
        title: "VÖEN düzgün deyil",
        text: "VÖEN 10 rəqəmdən ibarət olmalıdır.",
        confirmButtonText: "Bağla",
      });

      return;
    }

    // ---------------------------------------------------------
    // BUSINESS CATEGORY
    // ---------------------------------------------------------

    if (!formData.businessCategory) {
      Swal.fire({
        icon: "warning",
        title: "Kateqoriya seçilməyib",
        text: "Zəhmət olmasa biznesiniz üçün elan kateqoriyası seçin.",
        confirmButtonText: "Bağla",
      });

      return;
    }

    // ---------------------------------------------------------
    // SEND
    // ---------------------------------------------------------

    try {
      setSaving(true);

      // 🔹 Backend-ə göndərilən məlumatı görmək üçün
      console.log("📤 BUSINESS PAYLOAD:", formData);

      const res = await axios.post(`${API}/api/business`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ BUSINESS CREATED:", res.data);

      const business = res.data?.business;

      await Swal.fire({
        icon: "success",
        title: "Biznes profili yaradıldı!",
        text: "Biznes profiliniz uğurla yaradıldı.",
        confirmButtonText: "Biznes profilinə keç",
        confirmButtonColor: "#670fff",
      });

      if (business?.slug) {
        navigate(`/biznes/${business.slug}`);
      } else {
        navigate("/profile");
      }
    } catch (error) {
      console.error("❌ Business create error:", error);

      // 🔹 Backend-in göndərdiyi konkret xəta
      console.error("❌ Backend response:", error.response?.data);

      const message =
        error.response?.data?.message ||
        "Biznes profili yaradılarkən xəta baş verdi.";

      Swal.fire({
        icon: "error",
        title: "Xəta",
        text: message,
        confirmButtonText: "Bağla",
      });
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // BUSINESS TYPES
  // =========================================================

  const businessTypes = [
    {
      value: "magaza",
      label: "Mağaza",
      icon: Store,
    },
    {
      value: "avtosalon",
      label: "Avtosalon",
      icon: CarFront,
    },
    {
      value: "sirket",
      label: "Şirkət",
      icon: Building2,
    },
    {
      value: "xidmet",
      label: "Xidmət",
      icon: Wrench,
    },
    {
      value: "digər",
      label: "Digər",
      icon: BriefcaseBusiness,
    },
  ];

  // =========================================================
  // BUSINESS CATEGORIES
  // =========================================================

  const businessCategories = [
    {
      value: "car",
      label: "Avtomobil",
      icon: CarFront,
    },
    {
      value: "phone",
      label: "Telefon",
      icon: Smartphone,
    },
    {
      value: "electronics",
      label: "Elektronika",
      icon: Laptop,
    },
    {
      value: "clothing",
      label: "Geyim",
      icon: Shirt,
    },
    {
      value: "realEstate",
      label: "Daşınmaz əmlak",
      icon: Home,
    },
    {
      value: "homeGarden",
      label: "Ev və bağ",
      icon: Sofa,
    },
    {
      value: "household",
      label: "Məişət",
      icon: Store,
    },
    {
      value: "accessory",
      label: "Aksesuar",
      icon: Gem,
    },
  ];

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0b0f] py-6 sm:py-10 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#670fff] transition"
        >
          <ArrowLeft size={18} />
          Geri qayıt
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#670fff]/10 text-[#670fff] mb-4">
            <Store size={28} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Biznes profili yarat
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Mağazanızı, avtosalonunuzu və ya şirkətinizi ProElan-da ayrıca
            təqdim edin.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-[#15151b] rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 overflow-hidden">
            {/* =====================================================
                BUSINESS INFORMATION
            ===================================================== */}

            <div className="p-5 sm:p-7 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#670fff]/10 text-[#670fff] flex items-center justify-center shrink-0">
                  <Building2 size={20} />
                </div>

                <div>
                  <h2 className="font-black text-lg text-slate-900 dark:text-white">
                    Biznes məlumatları
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Biznesiniz haqqında əsas məlumatları daxil edin.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-7">
                {/* Business Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                    Biznes adı *
                  </label>

                  <div className="relative">
                    <Store
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Məsələn: Elxan Auto"
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] text-slate-900 dark:text-white outline-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10 transition"
                    />
                  </div>
                </div>

                {/* VOEN */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                    VÖEN *
                  </label>

                  <input
                    type="text"
                    name="voen"
                    value={formData.voen}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                      setFormData((prev) => ({
                        ...prev,
                        voen: value,
                      }));
                    }}
                    placeholder="10 rəqəm"
                    inputMode="numeric"
                    maxLength={10}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] text-slate-900 dark:text-white outline-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10 transition"
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    VÖEN dövlət tərəfindən verilmiş mövcud VÖEN olmalıdır.
                  </p>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                    Şəhər
                  </label>

                  <div className="relative">
                    <MapPin
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Məsələn: Bakı"
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] text-slate-900 dark:text-white outline-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10 transition"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                    Ünvan
                  </label>

                  <div className="relative">
                    <MapPin
                      size={19}
                      className="absolute left-4 top-4 text-slate-400"
                    />

                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Məsələn: Babək prospekti 12"
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] text-slate-900 dark:text-white outline-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================================
                BUSINESS CATEGORY
            ===================================================== */}

            <div className="p-5 sm:p-7 border-b border-slate-200 dark:border-white/10">
              <h2 className="font-black text-lg text-slate-900 dark:text-white">
                Biznes kateqoriyası
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">
                Biznesiniz hansı kateqoriyada elan yerləşdirəcək?
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {businessCategories.map((category) => {
                  const Icon = category.icon;

                  const selected = formData.businessCategory === category.value;

                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => handleBusinessCategory(category.value)}
                      className={`relative p-4 rounded-2xl border transition-all ${
                        selected
                          ? "border-[#670fff] bg-[#670fff]/10 text-[#670fff] shadow-sm"
                          : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] text-slate-600 dark:text-slate-300 hover:border-[#670fff]/40"
                      }`}
                    >
                      {selected && (
                        <CheckCircle2
                          size={17}
                          className="absolute top-2 right-2"
                        />
                      )}

                      <Icon size={25} className="mx-auto mb-2" />

                      <span className="text-xs sm:text-sm font-bold">
                        {category.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {formData.businessCategory && (
                <div className="mt-4 text-sm font-semibold text-[#670fff]">
                  Seçilmiş kateqoriya:{" "}
                  {
                    businessCategories.find(
                      (item) => item.value === formData.businessCategory,
                    )?.label
                  }
                </div>
              )}
            </div>

            {/* =====================================================
                BUSINESS TYPE
            ===================================================== */}

            <div className="p-5 sm:p-7 border-b border-slate-200 dark:border-white/10">
              <h2 className="font-black text-lg text-slate-900 dark:text-white">
                Fəaliyyət sahəsi
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">
                Biznesinizə uyğun fəaliyyət sahəsini seçin.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {businessTypes.map((type) => {
                  const Icon = type.icon;

                  const selected = formData.businessType === type.value;

                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleBusinessType(type.value)}
                      className={`relative p-4 rounded-2xl border transition-all ${
                        selected
                          ? "border-[#670fff] bg-[#670fff]/10 text-[#670fff] shadow-sm"
                          : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] text-slate-600 dark:text-slate-300 hover:border-[#670fff]/40"
                      }`}
                    >
                      {selected && (
                        <CheckCircle2
                          size={17}
                          className="absolute top-2 right-2"
                        />
                      )}

                      <Icon size={25} className="mx-auto mb-2" />

                      <span className="text-xs sm:text-sm font-bold">
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =====================================================
                CONTACT
            ===================================================== */}

            <div className="p-5 sm:p-7 border-b border-slate-200 dark:border-white/10">
              <h2 className="font-black text-lg text-slate-900 dark:text-white">
                Əlaqə məlumatları
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">
                Müştərilərinizin sizinlə əlaqə saxlaması üçün.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                    Telefon
                  </label>

                  <div className="relative">
                    <Phone
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="050 123 45 67"
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] text-slate-900 dark:text-white outline-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10 transition"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                    E-poçt
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@mail.com"
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] text-slate-900 dark:text-white outline-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================================
                DESCRIPTION
            ===================================================== */}

            <div className="p-5 sm:p-7">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={19} className="text-[#670fff]" />

                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Biznes haqqında
                </label>
              </div>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                maxLength={1000}
                placeholder="Biznesiniz haqqında qısa məlumat yazın..."
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#101015] text-slate-900 dark:text-white outline-none resize-none focus:border-[#670fff] focus:ring-2 focus:ring-[#670fff]/10 transition"
              />

              <div className="text-right text-xs text-slate-400 mt-1">
                {formData.description.length}/1000
              </div>
            </div>
          </div>

          {/* =====================================================
              BUTTONS
          ===================================================== */}

          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={saving}
              className="w-full sm:w-auto px-6 h-12 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#15151b] text-slate-700 dark:text-slate-200 font-bold hover:border-[#670fff]/40 transition disabled:opacity-50"
            >
              Ləğv et
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:flex-1 h-12 rounded-xl bg-[#670fff] hover:bg-[#5700db] text-white font-black transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#670fff]/20"
            >
              {saving ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Yaradılır...
                </>
              ) : (
                <>
                  <CheckCircle2 size={19} />
                  Biznes profilini yarat
                </>
              )}
            </button>
          </div>
        </form>

        {/* =====================================================
            INFORMATION
        ===================================================== */}

        <div className="mt-5 p-4 rounded-2xl bg-[#670fff]/5 border border-[#670fff]/10">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-6">
            <strong className="text-[#670fff]">Qeyd:</strong> VÖEN ProElan
            tərəfindən yaradılmır. Buraya dövlət tərəfindən sizə verilmiş mövcud
            VÖEN daxil edilməlidir. Biznes profilini yaratdıqdan sonra logo və
            arxa fon şəklini əlavə edə biləcəksiniz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateBusiness;
