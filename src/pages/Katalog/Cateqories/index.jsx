
// export const categories = [
//   { id: 1, path: "Nəqliyyat", label: "Nəqliyyat", icon: "/assets/Katalog/carIcon-removebg-preview.png", bgColor: "bg-blue-500", color: "text-red-300", hover: "text-red-300" },
//   { id: 2, path: "Ev_veBag", label: "Ev və Bağ üçün", icon: "/assets/Katalog/mebeltransparent.png", bgColor: "bg-green-300", color: "text-green-300", hover: "text-green-300" },
//   { id: 3, path: "Elektronika", label: "Elektronika", icon: "/assets/Katalog/elektronika.png", bgColor: "bg-blue-300", color: "text-blue-300", hover: "text-blue-300" },
//   { id: 4, path: "Ehtiyyat_hissələri_ve_aksesuarlar", label: "Ehtiyyat hissələri və aksesuarlar", icon: "/assets/Katalog/ehtiyyatHisseleri.png", bgColor: "bg-yellow-300" , color: "text-yellow-300", hover: "text-yellow-300"},
//   { id: 5, path: "Daşınmaz_əmlak", label: "Daşınmaz əmlak", icon: "/assets/Katalog/binatransparent-removebg-preview.png", bgColor: "bg-purple-300", color: "text-purple-300", hover: "text-purple-300" },
//   { id: 6, path: "Məişət_Texnikası", label: "Məişət Texnikası", icon: "/assets/Katalog/meiset.png", bgColor: "bg-pink-300" , color: "text-pink-300", hover: "text-pink-300"},
//   { id: 7, path: "Telefonlar", label: "Telefonlar", icon: "/assets/Katalog/iphone-13.png", bgColor: "bg-indigo-300", color: "text-indigo-300", hover: "text-indigo-300" },
//   { id: 8, path: "Geyimlər", label: "Geyimlər", icon: "/assets/Katalog/geyimler.png", bgColor: "bg-teal-300" , color: "text-teal-300", hover: "text-teal-300"},
//   // { id: 9, path: "Zinət_əşyaları", label: "Zinət Əşyaları", icon: "/assets/Katalog/qizil.png", bgColor: "bg-orange-300" , color: "text-orange-300", hover: "text-orange-300"},
// ];

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
