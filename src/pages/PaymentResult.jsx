import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Home,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../components/Main/ThemeContext";
import BubbleBackground from "../components/ui/BubbleBackground";
import BottomMenu from "../components/MobileMenu";

export default function PaymentResult() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);

  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");
  const type = searchParams.get("type");
  const paymentStatus = searchParams.get("paymentStatus");
  const reason = searchParams.get("reason");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  const isSuccess = status === "success";
  const isFailed = status === "failed";
  const isError = status === "error";

  const serviceName =
    type === "premium"
      ? "Premium"
      : type === "vip"
        ? "VIP"
        : "ödəniş xidməti";

  const getFailedMessage = () => {
    if (paymentStatus === "Refused") {
      return "Ödəniş bank tərəfindən təsdiqlənmədi. Zəhmət olmasa yenidən cəhd edin.";
    }

    if (paymentStatus === "Cancelled") {
      return "Ödəniş əməliyyatı ləğv edildi.";
    }

    return "Ödəniş tamamlanmadı. Zəhmət olmasa yenidən cəhd edin.";
  };

  const getErrorMessage = () => {
    if (reason === "no_order_id") {
      return "Ödəniş sifarişinin nömrəsi müəyyən edilə bilmədi.";
    }

    if (reason === "payment_not_found") {
      return "Ödəniş məlumatı sistemdə tapılmadı.";
    }

    if (reason === "order_not_found") {
      return "Kapital Bank ödəniş məlumatı tapılmadı.";
    }

    if (reason === "callback_error") {
      return "Ödənişin təsdiqlənməsi zamanı texniki xəta baş verdi.";
    }

    return "Ödəniş zamanı gözlənilməz xəta baş verdi.";
  };

  if (loading) {
    return (
      <div
        className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
          darkMode
            ? "bg-slate-950 text-white"
            : "bg-slate-50 text-slate-800"
        }`}
      >
        <Helmet>
          <title>Ödəniş yoxlanılır - ProElan.az</title>
        </Helmet>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <BubbleBackground />
        </div>

        <div className="relative z-10 text-center px-6">
          <div
            className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border ${
              darkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200"
            } shadow-xl`}
          >
            <Loader2
              size={38}
              className="animate-spin text-[#670fff]"
            />
          </div>

          <h1 className="text-xl font-black mb-2">
            Ödəniş yoxlanılır
          </h1>

          <p
            className={`text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Zəhmət olmasa bir neçə saniyə gözləyin...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen overflow-hidden flex items-center justify-center transition-colors duration-300 ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-slate-50 text-slate-800"
      }`}
    >
      <Helmet>
        <title>
          {isSuccess
            ? "Ödəniş uğurlu oldu"
            : isFailed
              ? "Ödəniş tamamlanmadı"
              : "Ödəniş xətası"}{" "}
          - ProElan.az
        </title>

        <meta
          name="description"
          content="ProElan.az Kapital Bank ödəniş nəticəsi"
        />
      </Helmet>

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <BubbleBackground />

        <div
          className={`absolute -top-40 -right-40 w-[430px] h-[430px] rounded-full blur-3xl ${
            isSuccess
              ? darkMode
                ? "bg-green-500/10"
                : "bg-green-400/10"
              : darkMode
                ? "bg-red-500/10"
                : "bg-red-400/10"
          }`}
        />

        <div
          className={`absolute -bottom-40 -left-40 w-[430px] h-[430px] rounded-full blur-3xl ${
            darkMode ? "bg-purple-600/10" : "bg-purple-400/10"
          }`}
        />
      </div>

      <main className="relative z-10 w-full max-w-xl px-4 sm:px-6 pt-20 pb-24">
        <div
          className={`relative overflow-hidden rounded-3xl border p-7 sm:p-10 text-center shadow-2xl ${
            darkMode
              ? "bg-slate-900/90 border-slate-800 shadow-black/30"
              : "bg-white/95 border-slate-200 shadow-slate-200/70"
          }`}
        >
          {/* TOP LINE */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 ${
              isSuccess
                ? "bg-gradient-to-r from-green-400 via-emerald-500 to-[#670fff]"
                : "bg-gradient-to-r from-red-400 via-orange-500 to-[#670fff]"
            }`}
          />

          {/* ICON */}
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-6">
            <div
              className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                isSuccess ? "bg-green-500" : "bg-red-500"
              }`}
            />

            <div
              className={`relative w-full h-full rounded-full flex items-center justify-center border-8 ${
                isSuccess
                  ? darkMode
                    ? "bg-green-500/10 border-green-500/10 text-green-400"
                    : "bg-green-50 border-green-100 text-green-600"
                  : darkMode
                    ? "bg-red-500/10 border-red-500/10 text-red-400"
                    : "bg-red-50 border-red-100 text-red-600"
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 size={56} strokeWidth={1.8} />
              ) : isFailed ? (
                <XCircle size={56} strokeWidth={1.8} />
              ) : (
                <AlertCircle size={56} strokeWidth={1.8} />
              )}
            </div>
          </div>

          {/* STATUS */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-5 ${
              isSuccess
                ? darkMode
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-green-50 text-green-600 border border-green-100"
                : darkMode
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-red-50 text-red-600 border border-red-100"
            }`}
          >
            {isSuccess ? (
              <>
                <Sparkles size={16} />
                Ödəniş təsdiqləndi
              </>
            ) : isFailed ? (
              <>
                <XCircle size={16} />
                Ödəniş tamamlanmadı
              </>
            ) : (
              <>
                <AlertCircle size={16} />
                Ödəniş xətası
              </>
            )}
          </div>

          {/* TITLE */}
          <h1
            className={`text-2xl sm:text-3xl font-black mb-3 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {isSuccess
              ? "Ödəniş uğurla tamamlandı"
              : isFailed
                ? "Ödəniş tamamlanmadı"
                : "Ödəniş zamanı xəta baş verdi"}
          </h1>

          {/* DESCRIPTION */}
          <p
            className={`max-w-md mx-auto text-sm sm:text-base leading-7 ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {isSuccess
              ? `Sizin ${serviceName} xidmətiniz uğurla aktivləşdirildi. Elanınız seçdiyiniz xidmətə uyğun olaraq yeniləndi.`
              : isFailed
                ? getFailedMessage()
                : getErrorMessage()}
          </p>

          {/* SUCCESS INFO */}
          {isSuccess && (
            <div
              className={`mt-6 rounded-2xl border p-4 text-left ${
                darkMode
                  ? "bg-slate-950/60 border-slate-800"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck
                  size={22}
                  className="text-green-500 shrink-0"
                />

                <div>
                  <p className="text-sm font-bold">
                    Ödəniş təsdiqləndi
                  </p>

                  <p
                    className={`text-xs mt-1 ${
                      darkMode
                        ? "text-slate-500"
                        : "text-slate-400"
                    }`}
                  >
                    {type === "premium"
                      ? "Premium xidmət 7 gün müddətinə aktivdir."
                      : type === "vip"
                        ? "VIP xidmət 3 gün müddətinə aktivdir."
                        : "Xidmətiniz aktivləşdirildi."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ORDER ID */}
          {orderId && (
            <div
              className={`mt-4 rounded-2xl px-4 py-3 text-xs ${
                darkMode
                  ? "bg-slate-950/50 text-slate-500"
                  : "bg-slate-50 text-slate-400"
              }`}
            >
              Əməliyyat nömrəsi:{" "}
              <span className="font-bold">{orderId}</span>
            </div>
          )}

          {/* SECURITY */}
          <div
            className={`mt-6 flex items-center justify-center gap-2 text-xs ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            <ShieldCheck size={16} />
            Kapital Bank ödəniş sistemi ilə təhlükəsiz ödəniş
          </div>

          {/* BUTTONS */}
          <div className="mt-7 flex flex-col gap-3">
            {isSuccess ? (
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg shadow-green-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
              >
                <Home size={19} />
                Ana səhifəyə qayıt
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#670fff] text-white font-bold shadow-lg shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
                >
                  <ArrowLeft size={19} />
                  Yenidən cəhd et
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold border transition-all duration-300 ${
                    darkMode
                      ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Home size={19} />
                  Ana səhifəyə qayıt
                </button>
              </>
            )}
          </div>
        </div>

        <p
          className={`text-center text-xs mt-5 ${
            darkMode ? "text-slate-600" : "text-slate-400"
          }`}
        >
          ProElan.az — Azərbaycanda Pulsuz Elanlar Platforması
        </p>
      </main>

      <BottomMenu />
    </div>
  );
}