import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import TitleLogo from "../TitleLogo";
import DownNavbar from "../../pages/Katalog/downNavbar";

import {
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";

import {
  User,
  Heart,
  Plus,
} from "lucide-react";

function Header() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Login vəziyyətini yoxla
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Scroll zamanı header görünüşünü dəyiş
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");

    setIsLoggedIn(false);

    navigate("/");
  };

  return (
    <header
      className={`
        fixed
        top-0
        left-0
        z-[100]
        w-full
        h-[64px]
        transition-all
        duration-300
        ease-out
        ${
          scrolled
            ? "bg-white/95 dark:bg-gray-950/95 shadow-lg backdrop-blur-xl border-b border-gray-200/70 dark:border-gray-800"
            : "bg-white/85 dark:bg-gray-950/85 backdrop-blur-xl border-b border-gray-200/40 dark:border-gray-800/50"
        }
      `}
    >
      <div
        className="
          max-w-[1240px]
          h-full
          mx-auto
          px-3
          sm:px-5
          lg:px-6
          flex
          items-center
          justify-between
          gap-3
        "
      >
        {/* SOL TƏRƏF */}
        <div className="flex items-center gap-3 min-w-0">
          {/* LOGO */}
          <Link
            to="/"
            className="
              flex
              items-center
              shrink-0
              transition-transform
              duration-200
              hover:scale-[1.03]
              active:scale-95
            "
          >
            <TitleLogo />
          </Link>

          {/* DESKTOP KATALOQ */}
          <div className="hidden sm:flex items-center">
            <DownNavbar />
          </div>
        </div>

        {/* SAĞ TƏRƏF */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* FAVORİLƏR */}
          <Link
            to="/favorites"
            aria-label="Seçilmiş elanlar"
            className="
              group
              relative
              w-10
              h-10
              sm:w-11
              sm:h-11
              rounded-xl
              flex
              items-center
              justify-center
              bg-gray-100
              dark:bg-gray-900
              border
              border-gray-200
              dark:border-gray-800
              text-gray-600
              dark:text-gray-300
              hover:text-red-500
              hover:border-red-200
              dark:hover:border-red-900
              hover:bg-red-50
              dark:hover:bg-red-950/30
              transition-all
              duration-200
              active:scale-90
            "
          >
            <Heart
              size={20}
              strokeWidth={2}
              className="
                transition-transform
                duration-200
                group-hover:scale-110
              "
            />
          </Link>

          {/* LOGIN / REGISTER */}
          {!isLoggedIn ? (
            <>
              {/* GİRİŞ */}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="
                  hidden
                  sm:flex
                  items-center
                  justify-center
                  gap-2
                  h-10
                  px-3
                  lg:px-4
                  rounded-xl
                  text-sm
                  font-semibold
                  text-gray-700
                  dark:text-gray-200
                  bg-gray-100
                  dark:bg-gray-900
                  border
                  border-gray-200
                  dark:border-gray-800
                  hover:bg-gray-200
                  dark:hover:bg-gray-800
                  transition-all
                  duration-200
                  active:scale-95
                "
              >
                <FaSignInAlt size={14} />
                <span>Giriş</span>
              </button>

              {/* QEYDİYYAT */}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="
                  hidden
                  md:flex
                  items-center
                  justify-center
                  gap-2
                  h-10
                  px-3
                  lg:px-4
                  rounded-xl
                  text-sm
                  font-semibold
                  text-[#670fff]
                  bg-[#670fff]/10
                  border
                  border-[#670fff]/20
                  hover:bg-[#670fff]
                  hover:text-white
                  transition-all
                  duration-200
                  active:scale-95
                "
              >
                <FaUserPlus size={14} />
                <span>Qeydiyyat</span>
              </button>

              {/* MOBİL GİRİŞ */}
              <button
                type="button"
                onClick={() => navigate("/login")}
                aria-label="Giriş"
                className="
                  sm:hidden
                  w-10
                  h-10
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  bg-gray-100
                  dark:bg-gray-900
                  border
                  border-gray-200
                  dark:border-gray-800
                  text-gray-700
                  dark:text-gray-200
                  active:scale-90
                  transition
                "
              >
                <User size={19} />
              </button>
            </>
          ) : (
            <>
              {/* PROFİL */}
              <button
                type="button"
                onClick={() => navigate("/profile")}
                aria-label="Profil"
                className="
                  w-10
                  h-10
                  sm:w-auto
                  sm:h-10
                  sm:px-3
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-gray-700
                  dark:text-gray-200
                  bg-gray-100
                  dark:bg-gray-900
                  border
                  border-gray-200
                  dark:border-gray-800
                  hover:bg-gray-200
                  dark:hover:bg-gray-800
                  transition-all
                  duration-200
                  active:scale-95
                "
              >
                <User size={18} />
                <span className="hidden sm:inline text-sm font-semibold">
                  Profil
                </span>
              </button>

              {/* ÇIXIŞ */}
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Çıxış"
                className="
                  w-10
                  h-10
                  sm:w-auto
                  sm:h-10
                  sm:px-3
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-red-500
                  bg-red-50
                  dark:bg-red-950/20
                  border
                  border-red-100
                  dark:border-red-900/40
                  hover:bg-red-500
                  hover:text-white
                  transition-all
                  duration-200
                  active:scale-95
                "
              >
                <FaSignOutAlt size={15} />
                <span className="hidden sm:inline text-sm font-semibold">
                  Çıxış
                </span>
              </button>
            </>
          )}

          {/* YENİ ELAN */}
          <button
            type="button"
            onClick={() => navigate("/CreateCatalogPost")}
            className="
              h-10
              sm:h-11
              px-3
              sm:px-4
              rounded-xl
              flex
              items-center
              justify-center
              gap-1.5
              sm:gap-2
              bg-[#670fff]
              text-white
              font-bold
              text-sm
              shadow-lg
              shadow-[#670fff]/25
              hover:bg-[#5700e6]
              hover:shadow-xl
              hover:shadow-[#670fff]/30
              hover:-translate-y-[1px]
              transition-all
              duration-200
              active:scale-95
              whitespace-nowrap
            "
          >
            <Plus
              size={19}
              strokeWidth={2.8}
            />

            <span className="hidden sm:inline">
              Yeni elan
            </span>

            <span className="sm:hidden">
              Elan
            </span>
          </button>
        </div>
      </div>

      {/* MOBİL KATALOQ */}
      <div
        className="
          sm:hidden
          absolute
          top-[64px]
          left-0
          w-full
          flex
          justify-center
          pointer-events-none
        "
      >
        <div
          className="
            pointer-events-auto
            mt-1
            px-3
            py-1
            rounded-b-2xl
            bg-white/95
            dark:bg-gray-950/95
            backdrop-blur-xl
            border
            border-t-0
            border-gray-200
            dark:border-gray-800
            shadow-md
          "
        >
          <DownNavbar />
        </div>
      </div>
    </header>
  );
}

export default Header;