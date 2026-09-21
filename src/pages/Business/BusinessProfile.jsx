
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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
} from "lucide-react";

const BusinessProfile = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const API = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");

  const [business, setBusiness] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.log(
          "🏪 CATEGORY FROM API:",
          res.data?.business?.category
        );

        const businessData = res.data?.business || null;

        if (businessData) {
          console.log("🏪 BUSINESS ID:", businessData._id);
          console.log("🏪 BUSINESS NAME:", businessData.businessName);
          console.log("🏪 BUSINESS CATEGORY:", businessData.category);
        }

        setBusiness(businessData);
        setAds(res.data?.ads || []);
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
  // ELAN YERLƏŞDİRMƏ
  // =====================================================

  const handleCreateAd = () => {
    if (!business?._id) {
      console.error("❌ Business ID yoxdur");
      return;
    }

    console.log("🚀 BUSINESS OBJECT:", business);
    console.log(
      "🚀 BUSINESS CATEGORY BEFORE NAVIGATE:",
      business.category
    );

    // Kateqoriya yoxdursa elan yerləşdirməyə keçmə
    if (!business.category) {
      console.error("❌ Business category yoxdur:", business);

      alert(
        "Bu biznes üçün kateqoriya təyin edilməyib. Zəhmət olmasa biznes kateqoriyasını yoxlayın."
      );

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
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0b0f]">
        <Loader2
          size={35}
          className="animate-spin text-[#670fff]"
        />
      </div>
    );
  }

  // =====================================================
  // BİZNES TAPILMADI
  // =====================================================

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0b0b0f] px-4">
        <Building2
          size={50}
          className="text-slate-400 mb-4"
        />

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0b0f]">
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
                  <Store
                    size={42}
                    className="text-[#670fff]"
                  />
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

              {/* Elan yerləşdir */}

              <button
                type="button"
                onClick={handleCreateAd}
                className="sm:mb-2 w-full sm:w-auto px-5 py-3 rounded-xl bg-[#670fff] hover:bg-[#5700db] text-white font-black flex items-center justify-center gap-2 transition shadow-lg shadow-[#670fff]/20"
              >
                <Plus size={19} />
                Elan yerləşdir
              </button>
            </div>

            {/* =====================================================
                MƏLUMATLAR
            ====================================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-7">

              {/* Şəhər */}

              {business.city && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#101015]">
                  <MapPin
                    size={19}
                    className="text-[#670fff]"
                  />

                  <div>
                    <div className="text-xs text-slate-400">
                      Şəhər
                    </div>

                    <div className="font-bold text-sm text-slate-800 dark:text-white">
                      {business.city}
                    </div>
                  </div>
                </div>
              )}

              {/* Ünvan */}

              {business.address && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#101015]">
                  <MapPin
                    size={19}
                    className="text-[#670fff]"
                  />

                  <div>
                    <div className="text-xs text-slate-400">
                      Ünvan
                    </div>

                    <div className="font-bold text-sm text-slate-800 dark:text-white">
                      {business.address}
                    </div>
                  </div>
                </div>
              )}

              {/* Telefon */}

              {business.phone && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#101015]">
                  <Phone
                    size={19}
                    className="text-[#6700ff]"
                  />

                  <div>
                    <div className="text-xs text-slate-400">
                      Telefon
                    </div>

                    <div className="font-bold text-sm text-slate-800 dark:text-white">
                      {business.phone}
                    </div>
                  </div>
                </div>
              )}

              {/* Email */}

              {business.email && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#101015]">
                  <Mail
                    size={19}
                    className="text-[#670fff]"
                  />

                  <div className="min-w-0">
                    <div className="text-xs text-slate-400">
                      E-poçt
                    </div>

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

            <CategoryIcon
              size={27}
              className="text-[#670fff]"
            />
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

              <button
                type="button"
                onClick={handleCreateAd}
                className="mt-5 px-5 py-3 rounded-xl bg-[#670fff] text-white font-black inline-flex items-center gap-2"
              >
                <Plus size={18} />
                İlk elanı yerləşdir
              </button>
            </div>
          ) : (

            /* =====================================================
                ELANLAR
            ====================================================== */

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">

              {ads.map((ad) => (
                <div
                  key={ad._id || ad.id}
                  className="bg-white dark:bg-[#15151b] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm"
                >

                  {/* Şəkil */}

                  <div className="h-36 sm:h-48 bg-slate-100 dark:bg-[#101015]">
                    {(ad.mainImage || ad.images?.[0]) && (
                      <img
                        src={ad.mainImage || ad.images?.[0]}
                        alt={ad.title || "Elan"}
                        className="w-full h-full object-cover"
                      />
                    )}
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;

