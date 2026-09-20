import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  CreditCard,
  Crown,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { useTheme } from "../components/Main/ThemeContext";
import BubbleBackground from "../components/ui/BubbleBackground";
import BottomMenu from "../components/MobileMenu";

const PaymentPage = () => {
  const { listingId } = useParams();

  const [type, setType] = useState("premium");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handlePayment = async () => {
    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL;

      if (!API_URL) {
        throw new Error("API URL undefined!");
      }

      const res = await axios.post(`${API_URL}/api/payment/create`, {
        listingId,
        type,
      });

      if (res.data?.url) {
        // Ödəniş portalına yönləndir
        window.location.href = res.data.url;
      } else {
        alert("Ödəniş URL-i tapılmadı");
      }
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);

      alert("Ödənişdə xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        relative min-h-screen overflow-hidden
        flex items-center justify-center
        transition-colors duration-300
        ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-800"}
      `}
    >
      {/* Arxa fon */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <BubbleBackground />

        <div
          className={`absolute -top-40 -right-40 w-[420px] h-[420px] rounded-full blur-3xl ${
            darkMode ? "bg-purple-600/10" : "bg-purple-400/10"
          }`}
        />

        <div
          className={`absolute -bottom-40 -left-40 w-[420px] h-[420px] rounded-full blur-3xl ${
            darkMode ? "bg-green-600/10" : "bg-green-400/10"
          }`}
        />
      </div>

      <main className="relative z-10 w-full max-w-xl px-4 sm:px-6 pt-20 pb-24">
        {/* Geri */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`
            mb-5 inline-flex items-center gap-2
            text-sm font-semibold transition-colors
            ${
              darkMode
                ? "text-slate-400 hover:text-white"
                : "text-slate-500 hover:text-slate-900"
            }
          `}
        >
          <ArrowLeft size={18} />
          Geri qayıt
        </button>

        {/* Əsas kart */}
        <div
          className={`
            relative overflow-hidden rounded-3xl border
            shadow-2xl
            ${
              darkMode
                ? "bg-slate-900/85 border-slate-800 shadow-black/30"
                : "bg-white/95 border-slate-200 shadow-slate-200/70"
            }
          `}
        >
          {/* Üst gradient */}
          <div className="h-1.5 bg-gradient-to-r from-[#670fff] via-purple-500 to-green-400" />

          <div className="p-6 sm:p-8">
            {/* Başlıq */}
            <div className="text-center mb-8">
              <div
                className={`
                  mx-auto mb-4 w-16 h-16 rounded-2xl
                  flex items-center justify-center
                  ${
                    darkMode
                      ? "bg-purple-500/10 text-purple-400"
                      : "bg-purple-50 text-[#670fff]"
                  }
                `}
              >
                <CreditCard size={32} />
              </div>

              <h1
                className={`
                  text-2xl sm:text-3xl font-black mb-2
                  ${darkMode ? "text-white" : "text-slate-900"}
                `}
              >
                Ödəniş səhifəsi
              </h1>

              <p
                className={`
                  text-sm leading-6
                  ${darkMode ? "text-slate-400" : "text-slate-500"}
                `}
              >
                Elanınızı daha çox istifadəçiyə göstərmək üçün xidmət seçin.
              </p>
            </div>

            {/* Elan ID */}
            <div
              className={`
                mb-6 rounded-2xl border p-4
                ${
                  darkMode
                    ? "bg-slate-800/60 border-slate-700"
                    : "bg-slate-50 border-slate-200"
                }
              `}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`
                    text-sm font-medium
                    ${darkMode ? "text-slate-400" : "text-slate-500"}
                  `}
                >
                  Elan ID
                </span>

                <span
                  className={`
                    max-w-[65%] truncate text-sm font-bold
                    ${darkMode ? "text-purple-400" : "text-[#670fff]"}
                  `}
                  title={listingId}
                >
                  {listingId}
                </span>
              </div>
            </div>

            {/* Ödəniş növləri */}
            <div className="mb-6">
              <label
                className={`
                  block text-sm font-bold mb-3
                  ${darkMode ? "text-slate-200" : "text-slate-700"}
                `}
              >
                Ödəniş növünü seçin
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Premium */}
                <button
                  type="button"
                  onClick={() => setType("premium")}
                  className={`
                    relative text-left rounded-2xl border p-4
                    transition-all duration-300
                    ${
                      type === "premium"
                        ? darkMode
                          ? "border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/20"
                          : "border-[#670fff] bg-purple-50 ring-2 ring-purple-500/10"
                        : darkMode
                          ? "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                          : "border-slate-200 bg-white hover:border-purple-200"
                    }
                  `}
                >
                  {type === "premium" && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 size={20} className="text-[#670fff]" />
                    </div>
                  )}

                  <div
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center mb-3
                      ${
                        darkMode
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-purple-50 text-[#670fff]"
                      }
                    `}
                  >
                    <Crown size={21} />
                  </div>

                  <h3
                    className={`
                      font-extrabold text-base mb-1
                      ${darkMode ? "text-white" : "text-slate-900"}
                    `}
                  >
                    Premium
                  </h3>

                  <p
                    className={`
                      text-xs leading-5
                      ${darkMode ? "text-slate-400" : "text-slate-500"}
                    `}
                  >
                    Elanınızı premium olaraq önə çıxarın.
                  </p>
                </button>

                {/* VIP */}
                <button
                  type="button"
                  onClick={() => setType("vip")}
                  className={`
                    relative text-left rounded-2xl border p-4
                    transition-all duration-300
                    ${
                      type === "vip"
                        ? darkMode
                          ? "border-green-500 bg-green-500/10 ring-2 ring-green-500/20"
                          : "border-green-500 bg-green-50 ring-2 ring-green-500/10"
                        : darkMode
                          ? "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                          : "border-slate-200 bg-white hover:border-green-200"
                    }
                  `}
                >
                  {type === "vip" && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 size={20} className="text-green-500" />
                    </div>
                  )}

                  <div
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center mb-3
                      ${
                        darkMode
                          ? "bg-green-500/10 text-green-400"
                          : "bg-green-50 text-green-600"
                      }
                    `}
                  >
                    <Sparkles size={21} />
                  </div>

                  <h3
                    className={`
                      font-extrabold text-base mb-1
                      ${darkMode ? "text-white" : "text-slate-900"}
                    `}
                  >
                    VIP
                  </h3>

                  <p
                    className={`
                      text-xs leading-5
                      ${darkMode ? "text-slate-400" : "text-slate-500"}
                    `}
                  >
                    Elanınızı VIP olaraq daha görünən edin.
                  </p>
                </button>
              </div>
            </div>

            {/* Seçilmiş xidmət */}
            <div
              className={`
                mb-6 flex items-center gap-3 rounded-2xl p-4
                ${darkMode ? "bg-slate-800/70" : "bg-slate-50"}
              `}
            >
              <div
                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center
                  ${
                    type === "premium"
                      ? "bg-purple-500/10 text-[#670fff]"
                      : "bg-green-500/10 text-green-600"
                  }
                `}
              >
                {type === "premium" ? (
                  <Crown size={20} />
                ) : (
                  <Sparkles size={20} />
                )}
              </div>

              <div className="flex-1">
                <p
                  className={`
                    text-xs
                    ${darkMode ? "text-slate-500" : "text-slate-400"}
                  `}
                >
                  Seçilmiş xidmət
                </p>

                <p
                  className={`
                    font-bold
                    ${darkMode ? "text-white" : "text-slate-800"}
                  `}
                >
                  {type === "premium" ? "Premium" : "VIP"}
                </p>
              </div>

              <CheckCircle2
                size={20}
                className={
                  type === "premium" ? "text-[#670fff]" : "text-green-500"
                }
              />
            </div>

            {/* Ödəniş düyməsi */}
            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className={`
                w-full flex items-center justify-center gap-2
                py-3.5 rounded-2xl
                text-white font-bold
                shadow-lg
                transition-all duration-300
                ${
                  loading
                    ? "bg-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#670fff] to-[#8b5cf6] hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/20 active:scale-[0.98]"
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Yüklənir...
                </>
              ) : (
                <>
                  <CreditCard size={19} />
                  Ödənişə keç
                </>
              )}
            </button>

            {/* Təhlükəsizlik */}
            <div
              className={`
                mt-5 flex items-center justify-center gap-2
                text-xs
                ${darkMode ? "text-slate-500" : "text-slate-400"}
              `}
            >
              <ShieldCheck size={16} />
              Təhlükəsiz ödəniş sistemi
            </div>
          </div>
        </div>

        <p
          className={`
            text-center text-xs mt-5
            ${darkMode ? "text-slate-600" : "text-slate-400"}
          `}
        >
          ProElan.az — Azərbaycanda Pulsuz Elanlar Platforması
        </p>
      </main>

      <BottomMenu />
    </div>
  );
};

export default PaymentPage;
