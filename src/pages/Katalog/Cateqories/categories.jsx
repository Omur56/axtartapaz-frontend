import React from "react";
import { Link } from "react-router-dom";
import BottomMenu from "../../../components/MobileMenu";

// Kategoriyaların şəkilləri
import Car1 from "../../../icon_nav/cat_1.png";
import EvBag from "../../../icon_nav/ev_ve_bag.png";
import Elektronika from "../../../icon_nav/elektronika.png";
import Ehtiyyat from "../../../icon_nav/ehtiyyat.png";
import Dasinmaz from "../../../icon_nav/dasinmaz.png";
import Meiset from "../../../icon_nav/meiset.png";
import Telefon from "../../../icon_nav/telefon.png";
import Geyim from "../../../icon_nav/geyim.png";

export const categories = [
  { id: 1, path: "Nəqliyyat", label: "Nəqliyyat", icon: Car1, bgColor: "bg-blue-500", hover: "hover:bg-blue-400" },
  { id: 2, path: "Ev_veBag", label: "Ev və Bağ üçün", icon: EvBag, bgColor: "bg-green-500", hover: "hover:bg-green-400" },
  { id: 3, path: "Elektronika", label: "Elektronika", icon: Elektronika, bgColor: "bg-blue-500", hover: "hover:bg-blue-400" },
  { id: 4, path: "Ehtiyyat_hissələri_ve_aksesuarlar", label: "Ehtiyyat hissələri və aksesuarlar", icon: Ehtiyyat, bgColor: "bg-yellow-500", hover: "hover:bg-yellow-400" },
  { id: 5, path: "Daşınmaz_əmlak", label: "Daşınmaz əmlak", icon: Dasinmaz, bgColor: "bg-purple-500", hover: "hover:bg-purple-400" },
  { id: 6, path: "Məişət_Texnikası", label: "Məişət Texnikası", icon: Meiset, bgColor: "bg-pink-500", hover: "hover:bg-pink-400" },
  { id: 7, path: "Telefonlar", label: "Telefonlar", icon: Telefon, bgColor: "bg-indigo-500", hover: "hover:bg-indigo-400" },
  { id: 8, path: "Geyimlər", label: "Geyimlər", icon: Geyim, bgColor: "bg-teal-500", hover: "hover:bg-teal-400" },
];

const Katalog = () => {
  return (
    <div className="min-h-screen mt-10 w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-10 font-bold text-center text-blue-700">
        Kataloq
      </h2>

      {/* --- Responsive grid for all devices --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map(({ id, path, label, icon, bgColor, hover }) => (
          <Link
            key={id}
            to={`/katalog/${path}`}
            className={`flex flex-col items-center justify-center p-6 rounded-[2rem] shadow-md transition-all ${bgColor} ${hover}`}
          >
            <img
              src={icon}
              alt={label}
              className="w-16 h-16 sm:w-20 sm:h-20 mb-3"
            />
            <span className="font-medium text-white text-center">{label}</span>
          </Link>
        ))}
      </div>

      <BottomMenu />
    </div>
  );
};

export default Katalog;
