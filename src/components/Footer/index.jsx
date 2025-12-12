import { Link } from "react-router-dom";
import TitleLogo from "../TitleLogo";

function Footer() {
  return (
    <footer className="bg-gray-800 py-10 px-4 w-full">
  {/* FULL WIDTH container */}
  <div className="w-full max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start px-4">

    {/* Logo */}
    <div className="flex justify-center md:justify-start w-full">
      <div className="w-full max-w-[240px]">
        <TitleLogo />
      </div>
    </div>

    {/* Links */}
    <div className="text-white flex flex-col items-center w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center w-full">
        <Link className="hover:text-[#43D262] hover:underline" to={"/about"}>Haqqımızda</Link>
        <Link className="hover:text-[#43D262] hover:underline" to={"/contact"}>Əlaqə</Link>
        <Link className="hover:text-[#43D262] hover:underline" to={"/yardim"}>Yardım</Link>
        <Link className="hover:text-[#43D262] hover:underline" to={"/Xidmetler"}>Xidmətlər</Link>
        <Link className="hover:text-[#43D262] hover:underline" to={"/Qaydalar"}>Qaydalar</Link>
      </div>
    </div>

    {/* Social + Phone */}
    <div className="flex flex-col items-center md:items-end gap-4 w-full">
      <div className="flex gap-4 justify-center md:justify-end flex-wrap w-full">
        <Link to="https://github.com/omur56">
          <img className="w-8 h-8" src="/assets/SocialMediaIcon/github_3291695-removebg-preview.png" />
        </Link>
        <Link to="https://mail.google.com/mail/?view=cm&fs=1&to=omur199624@gmail.com">
          <img className="w-8 h-8" src="/assets/SocialMediaIcon/icons8-gmail-48.png" />
        </Link>
        <Link to="https://www.linkedin.com/in/%C3%B6m%C3%BCrxan-abdullayev-b2052a318">
          <img className="w-8 h-8" src="/assets/SocialMediaIcon/linkedin_3992606-removebg-preview.png" />
        </Link>
        <Link to="https://t.me/omurxan1">
          <img className="w-8 h-8" src="/assets/SocialMediaIcon/telegram-svgrepo-com.svg" />
        </Link>
      </div>

      <a className="text-white text-sm flex items-center gap-2 hover:underline hover:text-sky-400" href="tel:+994559138099">
        <img className="w-6 h-6" src="/assets/SocialMediaIcon/telephoneicon.png" />
        +994 55 913 80 99
      </a>
    </div>

  </div>

  <div className="border-t border-slate-300 mt-10 w-full"></div>

  <div className="flex justify-center mt-6 w-full">
    <p className="text-white text-center text-sm sm:text-base w-full">
      © 2025 OmurCars.org Bütün Hüquqlar Qorunur.
    </p>
  </div>
</footer>

  );
}

export default Footer;
