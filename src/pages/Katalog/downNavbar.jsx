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
    { id: 0, icon: List , iconSize: "w-20 h-20", bg: "bg-red-200", textColor: "text-[#FF0000]", name: "Bütün katalog", path: "/Katalog" },
    { id: 1, icon: Car1 , bg: "bg-green-500", textColor: "text-white", name: "Nəqliyyat", path: "Katalog/Nəqliyyat" },
    { id: 2, icon: EvBag  , bg: "bg-yellow-500", textColor: "text-white", name: "Ev və Bağ üçün", path: "/Katalog/Ev_veBag" },
    { id: 3, icon: Elektronika , bg: "bg-blue-600",textColor: "text-white", name: "Elektronika", path: "/Katalog/Elektronika" },
    { id: 4, icon: Ehtiyyat , bg: "bg-red-400", textColor: "text-white", name: "Ehtiyyat hissələri", path: "/Katalog/Ehtiyyat_hissələri_ve_aksesuarlar" },
    { id: 5, icon: Dasinmaz , bg: "bg-gray-600", textColor: "text-white", name: "Daşınmaz əmlak", path: "/Katalog/Daşınmaz_əmlak" },
    { id: 6, icon: Meiset , bg: "bg-orange-600", textColor: "text-white", name: "Məişət Texnikası", path: "/Katalog/Məişət_Texnikası" },
    { id: 7, icon: Telefon , bg: "bg-indigo-600", textColor: "text-white", name: "Telefonlar", path: "/Katalog/Telefonlar" },
    { id: 8, icon: Geyim , bg: "bg-pink-600", textColor: "text-white", name: "Geyimlər", path: "/Katalog/Geyimlər" },
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
      <nav onClick={scrollTop} className={`mt-[-15px]  w-[80px] h-[30px] sm:min-w-[200px] sm:min-h-[40px] rounded-[8px] transition duration-300 hover:border-green-500 border-[1px] flex bg-white  px-2 py-2 relative z-50 ${open ? "border-green-500" : "shadow"}`}>
        <div className="flex items-center max-w-screen-xl mx-auto">
          <button
            onClick={() => setOpen(!open)}

            type="button"

            className={`z-0 w-[80px] h-[10px] flex gap-2 text-gray-500   sm:min-w-[250px] sm:min-h-[20px] items-center font-semibold hover:text-green-500 transition duration-300 ${open ? "text-black" : ""}`}
          >
            <Grip className="text-gray-500" /><span className="hidden md:inline sm:text-[12px]">Bütün kateqoriyalar </span> 
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
          className={`absolute min-h-screen  top-0 left-0 w-full bg-white shadow-xl
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
          <div className="flex flex-col w-full sm:w-[50%] text-start sm:text-center items-start justify-start gap-4 p-4 max-h-[80vh] scroll-m-1 overflow-y-auto">
            {categories.map((cat) => (
              <div key={cat.id} className="w-full" >

              
              <Link 
                key={cat.id}
                to={cat.path}
               

                onClick={() => {
                  setOpen(false);
                  scrollTop();
                }}
                className={`flex min-w-[10px] min-h-[10px] max-h-[50px] w-full items-center justify-start ${cat.bg} ${cat.textColor} hover:bg-gray-100 rounded-lg
                 p-2 text-center
                hover:text-green-500  transition duration-300 `}
              >
                
                <img src={cat.icon} alt={cat.name}  className="w-[20px] h-[20px] sm:w-[20px] sm:h-[20px] md:w-[20px] md:h-[20px] xl:w-[30px] xl:h-[30px] xxl:w-[40px] xxl:h-[40px] mr-3" />
                <span className="grid grid-cols-1 sm:inline sm:text-sm font-medium text-[10px] justify-between ">{cat.name} </span>
                <svg data-prefix="fas" data-icon="chevron-right" className="svg-inline--fa justify-end gap-10 fa-chevron-right text-white" role="img" viewBox="0 0 320 512" aria-hidden="true"><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path></svg>
                
              </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DownNavbar;
