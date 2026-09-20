import React, { useEffect, useState } from "react";
import axios from "axios";
import Home from "../Home";
import { Megaphone, ExternalLink, ImageOff, Loader2 } from "lucide-react";
import { useTheme } from "../../components/Main/ThemeContext";

export default function AdsPanel() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchAds = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/ads/`);
      setAds(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Reklamları gətirərkən xəta:", err);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const renderAd = (ad) => {
    const imageUrl = `${API_URL}/${ad.image}`;

    return (
      <a
        key={ad._id}
        href={ad.link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          group relative block overflow-hidden rounded-2xl
          border transition-all duration-300
          hover:-translate-y-1 hover:shadow-xl
          ${
            darkMode
              ? "bg-slate-900/80 border-white/10 shadow-black/20"
              : "bg-white border-slate-200 shadow-slate-200/60"
          }
        `}
      >
        {/* Reklam etiketi */}
        <div className="absolute top-2 left-2 z-10">
          <span
            className="
              inline-flex items-center gap-1
              rounded-full bg-black/60 backdrop-blur-md
              px-2 py-1 text-[10px] font-semibold text-white
            "
          >
            <Megaphone size={10} />
            Reklam
          </span>
        </div>

        {/* Xarici link */}
        <div
          className="
            absolute top-2 right-2 z-10
            flex h-7 w-7 items-center justify-center
            rounded-full bg-black/50 backdrop-blur-md
            text-white opacity-0
            transition-all duration-300
            group-hover:opacity-100
          "
        >
          <ExternalLink size={13} />
        </div>

        {/* Şəkil */}
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={ad.title || "ProElan reklamı"}
            loading="lazy"
            className="
              h-full w-full object-cover
              transition-transform duration-500
              group-hover:scale-105
            "
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling.style.display = "flex";
            }}
          />

          {/* Şəkil yüklənmədikdə */}
          <div
            className={`
              absolute inset-0 hidden
              items-center justify-center
              ${
                darkMode
                  ? "bg-slate-800 text-slate-500"
                  : "bg-slate-100 text-slate-400"
              }
            `}
          >
            <div className="text-center">
              <ImageOff size={30} className="mx-auto mb-2" />
              <span className="text-xs">Şəkil mövcud deyil</span>
            </div>
          </div>

          {/* Alt gradient */}
          <div
            className="
              absolute inset-x-0 bottom-0 h-24
              bg-gradient-to-t from-black/70 to-transparent
              pointer-events-none
            "
          />

          {/* Reklam başlığı */}
          {ad.title && (
            <div className="absolute bottom-3 left-3 right-3">
              <p className="line-clamp-2 text-sm font-semibold text-white drop-shadow-lg">
                {ad.title}
              </p>
            </div>
          )}
        </div>
      </a>
    );
  };

  const renderLoading = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className={`
            aspect-[4/5] animate-pulse rounded-2xl
            ${darkMode ? "bg-slate-800" : "bg-slate-200"}
          `}
        />
      ))}
    </div>
  );

  return (
    <div
      className={`
        min-h-screen w-full
        ${
          darkMode
            ? "bg-transparent text-white"
            : "bg-transparent text-slate-900"
        }
      `}
    >
      <div
        className="
          mx-auto flex w-full
          max-w-[1500px]
          items-start justify-between
          gap-3 lg:gap-5
        "
      >
        {/* =========================
            SOL REKLAMLAR
        ========================== */}
        <aside
          className="
            hidden xl:block
            w-[150px] 2xl:w-[180px]
            shrink-0
            sticky top-[82px]
            self-start
          "
        >
          {ads.length > 0 && (
            <div className="mb-3 flex items-center gap-2 px-1">
              <div
                className="
                  flex h-7 w-7 items-center justify-center
                  rounded-lg bg-[#670fff]/10
                "
              >
                <Megaphone size={14} className="text-[#670fff]" />
              </div>

              <span
                className={`
                  text-xs font-bold
                  ${darkMode ? "text-slate-400" : "text-slate-500"}
                `}
              >
                Reklam
              </span>
            </div>
          )}

          {loading ? (
            renderLoading()
          ) : (
            <div className="space-y-4">{ads.slice(0, 3).map(renderAd)}</div>
          )}
        </aside>

        {/* =========================
            ƏSAS MƏZMUN
        ========================== */}
        <main className="min-w-0 flex-1">
          <Home />
        </main>

        {/* =========================
            SAĞ REKLAMLAR
        ========================== */}
        <aside
          className="
            hidden xl:block
            w-[150px] 2xl:w-[180px]
            shrink-0
            sticky top-[82px]
            self-start
          "
        >
          {ads.length > 3 && (
            <div className="mb-3 flex items-center gap-2 px-1">
              <div
                className="
                  flex h-7 w-7 items-center justify-center
                  rounded-lg bg-[#670fff]/10
                "
              >
                <Megaphone size={14} className="text-[#670fff]" />
              </div>

              <span
                className={`
                  text-xs font-bold
                  ${darkMode ? "text-slate-400" : "text-slate-500"}
                `}
              >
                Reklam
              </span>
            </div>
          )}

          {loading ? (
            renderLoading()
          ) : (
            <div className="space-y-4">{ads.slice(3, 6).map(renderAd)}</div>
          )}
        </aside>
      </div>

      {/* =================================
          TABLET / MOBİL REKLAMLAR
      ================================== */}
      {ads.length > 0 && (
        <div className="xl:hidden mt-6 px-3 sm:px-4">
          <div
            className={`
              rounded-2xl border p-3
              ${
                darkMode
                  ? "border-white/10 bg-slate-900/60"
                  : "border-slate-200 bg-white/70"
              }
            `}
          >
            <div className="mb-3 flex items-center gap-2">
              <div
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-lg bg-[#670fff]/10
                "
              >
                <Megaphone size={15} className="text-[#670fff]" />
              </div>

              <div>
                <p
                  className={`
                    text-sm font-bold
                    ${darkMode ? "text-white" : "text-slate-800"}
                  `}
                >
                  Reklamlar
                </p>

                <p
                  className={`
                    text-[11px]
                    ${darkMode ? "text-slate-500" : "text-slate-400"}
                  `}
                >
                  Sizə maraqlı ola biləcək təkliflər
                </p>
              </div>
            </div>

            <div
              className="
                flex gap-3 overflow-x-auto
                pb-1 scrollbar-hide
              "
            >
              {ads.slice(0, 6).map((ad) => (
                <div
                  key={ad._id}
                  className="
                    w-[145px] sm:w-[170px]
                    shrink-0
                  "
                >
                  {renderAd(ad)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
