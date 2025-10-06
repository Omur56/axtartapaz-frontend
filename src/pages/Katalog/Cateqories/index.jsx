

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
  { id: 1, path: "Nəqliyyat", label: "Nəqliyyat", icon: Car, bgColor: "bg-blue-500", hover: "hover:bg-blue-400" },
  { id: 2, path: "Ev_veBag", label: "Ev və Bağ üçün", icon: Sofa, bgColor: "bg-green-500", hover: "hover:bg-green-200" },
  { id: 3, path: "Elektronika", label: "Elektronika", icon: Laptop, bgColor: "bg-blue-500", hover: "hover:bg-blue-400" },
  { id: 4, path: "Ehtiyyat_hissələri_ve_aksesuarlar", label: "Ehtiyyat hissələri və aksesuarlar", icon: Wrench, bgColor: "bg-yellow-500", hover: "hover:bg-yellow-400" },
  { id: 5, path: "Daşınmaz_əmlak", label: "Daşınmaz əmlak", icon: Building2, bgColor: "bg-purple-500", hover: "hover:bg-purple-400" },
  { id: 6, path: "Məişət_Texnikası", label: "Məişət Texnikası", icon: Refrigerator, bgColor: "bg-pink-500", hover: "hover:bg-pink-400" },
  { id: 7, path: "Telefonlar", label: "Telefonlar", icon: Smartphone, bgColor: "bg-indigo-500", hover: "hover:bg-indigo-400" },
  { id: 8, path: "Geyimlər", label: "Geyimlər", icon: Shirt, bgColor: "bg-teal-500", hover: "hover:bg-teal-400" },
];


