import React, { useRef } from "react";
import { Link } from "react-router-dom";

// Kategoriyaların şəkilləri
import Car1 from "../../../icon_nav/cat_1.png";
import EvBag from "../../../icon_nav/ev_ve_bag.png";
import Elektronika from "../../../icon_nav/elektronika.png";
import Ehtiyyat from "../../../icon_nav/ehtiyyat.png";
import Dasinmaz from "../../../icon_nav/dasinmaz.png";
import Meiset from "../../../icon_nav/meiset.png";
import Telefon from "../../../icon_nav/telefon.png";
import Geyim from "../../../icon_nav/geyim.png";

// Kategoriyalar
export const categories = [
  { id: 1, path: "Nəqliyyat", label: "Nəqliyyat", icon: Car1, iconSize: "w-20 h-20", bgColor: "bg-blue-500", hover: "hover:bg-blue-400" },
  { id: 2, path: "Ev_veBag", label: "Ev və Bağ üçün", icon: EvBag, iconSize: "w-20 h-20", bgColor: "bg-green-500", hover: "hover:bg-green-400" },
  { id: 3, path: "Elektronika", label: "Elektronika", icon: Elektronika, iconSize: "w-20 h-20", bgColor: "bg-blue-500", hover: "hover:bg-blue-400" },
  { id: 4, path: "Ehtiyyat_hissələri_ve_aksesuarlar", label: "Ehtiyyat hissələri və aksesuarlar", icon: Ehtiyyat, iconSize: "w-20 h-20", bgColor: "bg-yellow-500", hover: "hover:bg-yellow-400" },
  { id: 5, path: "Daşınmaz_əmlak", label: "Daşınmaz əmlak", icon: Dasinmaz, iconSize: "w-20 h-20", bgColor: "bg-purple-500", hover: "hover:bg-purple-400" },
  { id: 6, path: "Məişət_Texnikası", label: "Məişət Texnikası", icon: Meiset, iconSize: "w-20 h-20", bgColor: "bg-pink-500", hover: "hover:bg-pink-400" },
  { id: 7, path: "Telefonlar", label: "Telefonlar", icon: Telefon, iconSize: "w-20 h-20", bgColor: "bg-indigo-500", hover: "hover:bg-indigo-400" },
  { id: 8, path: "Geyimlər", label: "Geyimlər", icon: Geyim, iconSize: "w-20 h-20", bgColor: "bg-teal-500", hover: "hover:bg-teal-400" },
];

const Katalog = () => {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -150, behavior: "smooth" });
  };
  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 150, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen mt-10 w-full max-w-7xl mx-auto py-10">
      <h2 className="text-5xl md:text-7xl mb-10 font-bold text-center text-blue-700">
        Kataloq
      </h2>

      {/* --- Mobil slider --- */}
      <div className="relative block md:hidden mb-6 max-w-full">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-200 rounded-full p-2 z-10 shadow"
        >
          &#8592;
        </button>

        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto   h-[80px] scrollbar-hide scroll-smooth px-2"
        >
          {categories.map(({ id, path, label, icon, iconSize, bgColor, hover }) => (
            <Link
              key={id}
              to={`/katalog/${path}`}
              className={`flex flex-col min-w-[100px]   rounded-lg shadow-md transition-all ${bgColor} ${hover}`}
            >
              <img src={icon} alt={label} className={`${iconSize} mb-[-32px] ml-5`} />
             
            </Link>
            
          ))}
          
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-200 rounded-full p-2 z-10 shadow"
        >
          &#8594;
        </button>
      </div>

      {/* --- Desktop grid --- */}
      <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map(({ id, path, label, icon, iconSize, bgColor, hover }) => (
          <Link
            key={id}
            to={`/katalog/${path}`}
            className={`flex flex-col items-center justify-center p-6 rounded-[2rem] shadow-md transition-all ${bgColor} ${hover}`}
          >
            <img src={icon} alt={label} className={`${iconSize} mb-3`} />
            <span className="font-medium text-white text-center">{label}</span>
          </Link>
        ))}
      </div>
 
    </div>
  );
};

export default Katalog;
