

// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   Car,
//   Sofa,
//   Laptop,
//   Wrench,
//   Building2,
//   Refrigerator,
//   Smartphone,
//   Shirt,
// } from "lucide-react";


// export const categories = [
//   { id: 1, path: "Nəqliyyat", label: "Nəqliyyat", icon: Car, bgColor: "bg-blue-500", hover: "hover:bg-blue-400" },
//   { id: 2, path: "Ev_veBag", label: "Ev və Bağ üçün", icon: Sofa, bgColor: "bg-green-500", hover: "hover:bg-green-200" },
//   { id: 3, path: "Elektronika", label: "Elektronika", icon: Laptop, bgColor: "bg-blue-500", hover: "hover:bg-blue-400" },
//   { id: 4, path: "Ehtiyyat_hissələri_ve_aksesuarlar", label: "Ehtiyyat hissələri və aksesuarlar", icon: Wrench, bgColor: "bg-yellow-500", hover: "hover:bg-yellow-400" },
//   { id: 5, path: "Daşınmaz_əmlak", label: "Daşınmaz əmlak", icon: Building2, bgColor: "bg-purple-500", hover: "hover:bg-purple-400" },
//   { id: 6, path: "Məişət_Texnikası", label: "Məişət Texnikası", icon: Refrigerator, bgColor: "bg-pink-500", hover: "hover:bg-pink-400" },
//   { id: 7, path: "Telefonlar", label: "Telefonlar", icon: Smartphone, bgColor: "bg-indigo-500", hover: "hover:bg-indigo-400" },
//   { id: 8, path: "Geyimlər", label: "Geyimlər", icon: Shirt, bgColor: "bg-teal-500", hover: "hover:bg-teal-400" },
// ];




import React from "react";
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
  { id: 1, path: "Nəqliyyat", label: "Nəqliyyat", icon: Car1, iconSize: { width: "w-150", height: "h-100", objectFit: "object-contain" }, bgColor: "bg-blue-500", hover: "hover:bg-blue-400" },
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
    <div className="min-h-screen w-full max-w-7xl mx-auto py-[10vh] px-4">
      <h2 className="text-5xl md:text-7xl mb-10 font-bold text-center text-blue-700">Kataloq</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map(({ id, path, label, icon, bgColor, hover, iconSize}) => (
          <Link
            key={id}
            to={`/katalog/${path}`}
            className={`flex flex-col items-center justify-center p-6 rounded-[2rem] shadow-md transition-all transform ${bgColor} ${hover} hover:scale-105 duration-300`}
          >
            <div className="w-20 h-20 mb-3 bg-white  rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img src={icon} alt={label} className={ `object-contain   ${iconSize.width} ${iconSize.height}`} />
            </div>
            <span className="font-medium text-white text-center text-sm md:text-base">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );  
};

export default Katalog;
