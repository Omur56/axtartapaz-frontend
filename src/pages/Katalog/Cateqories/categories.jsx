import React from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Sofa,
  Laptop,
  Wrench,
  Building2,
  Refrigerator,
  Smartphone,
  Shirt,
} from "lucide-react";

export const categories = [
  { id: 1, path: "Nəqliyyat", label: "Nəqliyyat", icon: Car, bgColor: "bg-blue-100", hover: "hover:bg-blue-200" },
  { id: 2, path: "Ev_veBag", label: "Ev və Bağ üçün", icon: Sofa, bgColor: "bg-green-100", hover: "hover:bg-green-200" },
  { id: 3, path: "Elektronika", label: "Elektronika", icon: Laptop, bgColor: "bg-blue-100", hover: "hover:bg-blue-200" },
  { id: 4, path: "Ehtiyyat_hissələri_ve_aksesuarlar", label: "Ehtiyyat hissələri və aksesuarlar", icon: Wrench, bgColor: "bg-yellow-100", hover: "hover:bg-yellow-200" },
  { id: 5, path: "Daşınmaz_əmlak", label: "Daşınmaz əmlak", icon: Building2, bgColor: "bg-purple-100", hover: "hover:bg-purple-200" },
  { id: 6, path: "Məişət_Texnikası", label: "Məişət Texnikası", icon: Refrigerator, bgColor: "bg-pink-100", hover: "hover:bg-pink-200" },
  { id: 7, path: "Telefonlar", label: "Telefonlar", icon: Smartphone, bgColor: "bg-indigo-100", hover: "hover:bg-indigo-200" },
  { id: 8, path: "Geyimlər", label: "Geyimlər", icon: Shirt, bgColor: "bg-teal-100", hover: "hover:bg-teal-200" },
];

const Katalog = () => {
  return (
    <div className="min-h-screen  w-full mx-auto py-[10vh] justify-items-center  max-w-7xl mx-auto">
      <h2 className="text-7xl mb-10 font-bold  text-center  text-gray-500 ">Kataloq</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map(({ id, path, label, icon: Icon, bgColor, hover }) => (
          <Link
            key={id}
            to={`/katalog/${path}`}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-md transition-all ${bgColor} ${hover}`}
          >
            <Icon className="w-10 h-10 mb-3 text-gray-700" />
            <span className="text-sm font-medium text-gray-800 text-center">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Katalog;
