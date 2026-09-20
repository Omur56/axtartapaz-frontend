import { Link } from "react-router-dom";
import TitleLogo from "../TitleLogo";

function Footer() {
  return (
    <footer
      className="
        relative
        w-full
        mt-16
        pt-10
        pb-6
        px-4
        sm:px-6
        lg:px-8
        bg-white
        dark:bg-gray-950
        border-t
        border-gray-200
        dark:border-gray-800
      "
    >
      {/* Yuxarı dekorativ xətt */}
      <div
        className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2
          w-24
          h-1
          rounded-full
          bg-gradient-to-r
          from-[#670fff]
          via-[#8b5cf6]
          to-[#43D262]
        "
      />

      <div className="max-w-[1240px] mx-auto">
        {/* ƏSAS FOOTER */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-10
            lg:gap-12
          "
        >
          {/* LOGO + HAQQIMIZDA */}
          <div className="flex flex-col items-center sm:items-start">
            <Link
              to="/"
              className="
                block
                w-[210px]
                mb-5
                transition-transform
                duration-200
                hover:scale-[1.02]
              "
            >
              <TitleLogo />
            </Link>

            <p
              className="
                max-w-[280px]
                text-center
                sm:text-left
                text-sm
                leading-6
                text-gray-500
                dark:text-gray-400
              "
            >
              Azərbaycanda elan yerləşdirmək və elan axtarmaq üçün müasir və
              rahat platforma.
            </p>

            {/* Sosial şəbəkələr */}
            <div className="flex items-center gap-2.5 mt-6">
              <a
                href="https://github.com/omur56"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="
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
                  hover:bg-gray-200
                  dark:hover:bg-gray-800
                  hover:-translate-y-1
                  transition-all
                  duration-200
                "
              >
                <img
                  className="w-6 h-6 object-contain"
                  src="/assets/SocialMediaIcon/github_3291695-removebg-preview.png"
                  alt="GitHub"
                />
              </a>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=omur199624@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Gmail"
                className="
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
                  hover:bg-gray-200
                  dark:hover:bg-gray-800
                  hover:-translate-y-1
                  transition-all
                  duration-200
                "
              >
                <img
                  className="w-6 h-6 object-contain"
                  src="/assets/SocialMediaIcon/icons8-gmail-48.png"
                  alt="Gmail"
                />
              </a>

              <a
                href="https://www.linkedin.com/in/%C3%B6m%C3%BCrxan-abdullayev-b2052a318"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="
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
                  hover:bg-gray-200
                  dark:hover:bg-gray-800
                  hover:-translate-y-1
                  transition-all
                  duration-200
                "
              >
                <img
                  className="w-6 h-6 object-contain"
                  src="/assets/SocialMediaIcon/linkedin_3992606-removebg-preview.png"
                  alt="LinkedIn"
                />
              </a>

              <a
                href="https://t.me/omurxan1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="
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
                  hover:bg-gray-200
                  dark:hover:bg-gray-800
                  hover:-translate-y-1
                  transition-all
                  duration-200
                "
              >
                <img
                  className="w-6 h-6 object-contain"
                  src="/assets/SocialMediaIcon/telegram-svgrepo-com.svg"
                  alt="Telegram"
                />
              </a>
            </div>
          </div>

          {/* SAYT */}
          <div className="flex flex-col items-center sm:items-start">
            <h3
              className="
                text-base
                font-bold
                text-gray-900
                dark:text-white
                mb-5
              "
            >
              Sayt
            </h3>

            <div
              className="
                flex
                flex-col
                items-center
                sm:items-start
                gap-3
                text-sm
              "
            >
              <Link
                to="/about"
                className="
                  text-gray-500
                  dark:text-gray-400
                  hover:text-[#670fff]
                  dark:hover:text-[#8b5cf6]
                  transition-colors
                "
              >
                Haqqımızda
              </Link>

              <Link
                to="/contact"
                className="
                  text-gray-500
                  dark:text-gray-400
                  hover:text-[#670fff]
                  dark:hover:text-[#8b5cf6]
                  transition-colors
                "
              >
                Əlaqə
              </Link>

              <Link
                to="/yardim"
                className="
                  text-gray-500
                  dark:text-gray-400
                  hover:text-[#670fff]
                  dark:hover:text-[#8b5cf6]
                  transition-colors
                "
              >
                Yardım
              </Link>

              <Link
                to="/Xidmetler"
                className="
                  text-gray-500
                  dark:text-gray-400
                  hover:text-[#670fff]
                  dark:hover:text-[#8b5cf6]
                  transition-colors
                "
              >
                Xidmətlər
              </Link>

              <Link
                to="/Qaydalar"
                className="
                  text-gray-500
                  dark:text-gray-400
                  hover:text-[#670fff]
                  dark:hover:text-[#8b5cf6]
                  transition-colors
                "
              >
                Qaydalar
              </Link>
            </div>
          </div>

          {/* QAYDALAR */}
          <div className="flex flex-col items-center sm:items-start">
            <h3
              className="
                text-base
                font-bold
                text-gray-900
                dark:text-white
                mb-5
              "
            >
              Hüquqi məlumat
            </h3>

            <div
              className="
                flex
                flex-col
                items-center
                sm:items-start
                gap-3
                text-sm
              "
            >
              <Link
                to="/privacy-policy"
                className="
                  text-gray-500
                  dark:text-gray-400
                  hover:text-[#670fff]
                  dark:hover:text-[#8b5cf6]
                  transition-colors
                "
              >
                Məxfilik siyasəti
              </Link>

              <Link
                to="/posting-rules"
                className="
                  text-gray-500
                  dark:text-gray-400
                  hover:text-[#670fff]
                  dark:hover:text-[#8b5cf6]
                  transition-colors
                "
              >
                Elan yerləşdirmə qaydaları
              </Link>

              <Link
                to="/prohibited"
                className="
                  text-gray-500
                  dark:text-gray-400
                  hover:text-[#670fff]
                  dark:hover:text-[#8b5cf6]
                  transition-colors
                "
              >
                Qadağan olunmuş elanlar
              </Link>

              <Link
                to="/terms"
                className="
                  text-gray-500
                  dark:text-gray-400
                  hover:text-[#670fff]
                  dark:hover:text-[#8b5cf6]
                  transition-colors
                "
              >
                İstifadə şərtləri
              </Link>
            </div>
          </div>

          {/* ƏLAQƏ */}
          <div className="flex flex-col items-center sm:items-start">
            <h3
              className="
                text-base
                font-bold
                text-gray-900
                dark:text-white
                mb-5
              "
            >
              Əlaqə
            </h3>

            <div className="flex flex-col gap-4">
              {/* Telefon */}
              <a
                href="tel:+994559138099"
                className="
                  flex
                  items-center
                  gap-3
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                  hover:text-[#670fff]
                  dark:hover:text-[#8b5cf6]
                  transition-colors
                "
              >
                <span
                  className="
                    w-10
                    h-10
                    shrink-0
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    bg-[#670fff]/10
                    dark:bg-[#670fff]/20
                  "
                >
                  <img
                    className="w-5 h-5 object-contain"
                    src="/assets/SocialMediaIcon/telephoneicon.png"
                    alt="Telefon"
                  />
                </span>

                <span>+994 55 913 80 99</span>
              </a>

              {/* Email */}
              <a
                href="mailto:omur199624@gmail.com"
                className="
                  flex
                  items-center
                  gap-3
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                  hover:text-[#670fff]
                  dark:hover:text-[#8b5cf6]
                  transition-colors
                "
              >
                <span
                  className="
                    w-10
                    h-10
                    shrink-0
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    bg-[#670fff]/10
                    dark:bg-[#670fff]/20
                  "
                >
                  <img
                    className="w-5 h-5 object-contain"
                    src="/assets/SocialMediaIcon/icons8-gmail-48.png"
                    alt="Email"
                  />
                </span>

                <span className="break-all">omur199624@gmail.com</span>
              </a>

              {/* İş saatları */}
              <div
                className="
                  flex
                  items-start
                  gap-3
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                <span
                  className="
                    w-10
                    h-10
                    shrink-0
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    bg-[#43D262]/10
                    dark:bg-[#43D262]/15
                    text-[#43D262]
                    text-lg
                  "
                >
                  ⏰
                </span>

                <div className="flex flex-col gap-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    İş saatları
                  </span>

                  <span>Hər gün 09:00 - 18:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AYIRICI */}
        <div
          className="
            mt-10
            pt-6
            border-t
            border-gray-200
            dark:border-gray-800
          "
        >
          <div
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              justify-between
              gap-4
            "
          >
            {/* Copyright */}
            <p
              className="
                text-gray-400
                dark:text-gray-500
                text-xs
                sm:text-sm
                text-center
              "
            >
              © 2026 ProElan.az — Bütün Hüquqlar Qorunur.
            </p>

            {/* Site by */}
            <p
              className="
                text-gray-400
                dark:text-gray-500
                text-xs
                sm:text-sm
              "
            >
              Site by{" "}
              <span
                className="
                  font-bold
                  text-[#43D262]
                "
              >
                Ömürxan Abdullayev
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
