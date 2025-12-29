import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Grip, ChevronDown, ChevronUp } from "lucide-react";

import Car1 from "../../../src/icon_nav/cat_1.png";
import EvBag from "../../../src/icon_nav/ev_ve_bag.png";
import Elektronika from "../../../src/icon_nav/elektronika.png";
import Ehtiyyat from "../../../src/icon_nav/ehtiyyat.png";
import Dasinmaz from "../../../src/icon_nav/dasinmaz.png";
import Meiset from "../../../src/icon_nav/meiset.png";
import Telefon from "../../../src/icon_nav/telefon.png";
import Geyim from "../../../src/icon_nav/geyim.png";
import List from "../../../src/icon_nav/fi-rr-grid.svg";
const DownNavbar = () => {
  const [open, setOpen] = useState(false);

  const categories = [
    { id: 0, icon: List ,   name: "Bütün katalog", path: "/Katalog" },
    { id: 1, icon: Car1 , name: "Nəqliyyat", path: "Katalog/Nəqliyyat" },
    { id: 2, icon: EvBag  , name: "Ev və Bağ üçün", path: "/Katalog/Ev_veBag" },
    { id: 3, icon: Elektronika , name: "Elektronika", path: "/Katalog/Elektronika" },
    { id: 4, icon: Ehtiyyat , name: "Ehtiyyat hissələri", path: "/Katalog/Ehtiyyat_hissələri_ve_aksesuarlar" },
    { id: 5, icon: Dasinmaz , name: "Daşınmaz əmlak", path: "/Katalog/Daşınmaz_əmlak" },
    { id: 6, icon: Meiset , name: "Məişət Texnikası", path: "/Katalog/Məişət_Texnikası" },
    { id: 7, icon: Telefon , name: "Telefonlar", path: "/Katalog/Telefonlar" },
    { id: 8, icon: Geyim , name: "Geyimlər", path: "/Katalog/Geyimlər" },
  ];

  const close = () => {
    setOpen(false);
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* HEADER */}
      <nav onClick={scrollTop} className={`mt-[-10px] w-[80px] h-[20px] sm:min-w-[250px] sm:min-h-[40px] rounded-[15px] transition duration-300 hover:border-green-500 border-[3px] flex bg-white  px-4 py-3 relative z-50 ${open ? "border-green-500" : "shadow"}`}>
        <div className="flex items-center max-w-screen-xl mx-auto">
          <button
            onClick={() => setOpen(!open)}

            type="button"

            className={`z-0 w-[80px] h-[10px] flex gap-2 text-black sm:min-w-[250px] sm:min-h-[20px] items-center font-medium hover:text-green-500 transition duration-300 ${open ? "text-black" : ""}`}
          >
            <Grip className="text-gray-500" /><span className="hidden md:inline">Bütün kateqoriyalar </span> 
            <ChevronUp className={`absolute right-4 text-green-500 transition-transform duration-300 ${open ? "rotate-0" : "rotate-180"}`} />
          </button>

        </div>
      </nav>

      {/* OVERLAY */}
      <div
        className={` fixed inset-0 z-40 transition duration-500 mt-[60px] ${
          open ? "visible" : "invisible"
        }`}
        
      >
        {/* Background */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* TOP PANEL */}
        <div
          className={`absolute top-0 left-0 w-full bg-white shadow-xl
          transform transition-transform duration-300
          ${open ? "translate-y-0" : "-translate-y-full"}`}
        >
          {/* Panel Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <span className="font-semibold">Bütün kateqoriyalar</span>
            <button
              onClick={() => setOpen(false)}
              className="text-xl font-semibold text-black hover:text-gray-600 transition duration-300"
            >
              ✕
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-col max-w-[500px]  text-start sm:text-center items-start justify-start gap-4 p-4 max-h-[80vh] scroll-m-1 overflow-y-auto">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.path}

                onClick={() => {
                  setOpen(false);
                  scrollTop();
                }}
                className="flex items-center justify-center
                 p-3 text-center
                hover:text-green-500  transition duration-300 "
              >
                <img src={cat.icon} alt={cat.name} className="w-[60px] h-[40px] mr-3" />
                <span className="text-sm font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DownNavbar;
