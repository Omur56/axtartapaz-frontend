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
  

  {
  id: 1,
  path: "Nəqliyyat",
  label: "Nəqliyyat",
  icon: Car1,
  iconSize: {
    width: "w-150",
    height: "h-100",
    objectFit: "object-contain",
  },
  bgColor: "bg-gradient-to-br from-sky-400 to-blue-500",
},
{
  id: 2,
  path: "Ev_veBag",
  label: "Ev və Bağ üçün",
  icon: EvBag,
  bgColor: "bg-gradient-to-br from-emerald-400 to-green-500",
  
},
{
  id: 3,
  path: "Elektronika",
  label: "Elektronika",
  icon: Elektronika,
  bgColor: "bg-gradient-to-br from-cyan-400 to-blue-500",

},
{
  id: 4,
  path: "Ehtiyyat_hissələri_ve_aksesuarlar",
  label: "Ehtiyyat hissələri və aksesuarlar",
  icon: Ehtiyyat,
 bgColor: "bg-gradient-to-br from-amber-400 to-orange-500",
  
},
{
  id: 5,
  path: "Daşınmaz_əmlak",
  label: "Daşınmaz əmlak",
  icon: Dasinmaz,
  bgColor: "bg-gradient-to-br from-violet-400 to-fuchsia-500",
  
},
{
  id: 6,
  path: "Məişət_Texnikası",
  label: "Məişət Texnikası",
  icon: Meiset,
bgColor: "bg-gradient-to-br from-rose-400 to-pink-500",

},
{
  id: 7,
  path: "Telefonlar",
  label: "Telefonlar",
  icon: Telefon,
 bgColor: "bg-gradient-to-br from-indigo-400 to-blue-600",
  
},
{
  id: 8,
  path: "Geyimlər",
  label: "Geyimlər",
  icon: Geyim,
  bgColor: "bg-gradient-to-br from-teal-400 to-emerald-500",

},
];

const Katalog = () => {
  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto py-[10vh] px-4">
 <h2 className="text-4xl md:text-6xl font-black text-center mb-14 tracking-tight bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
  Kataloq
</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map(
          ({ id, path, label, icon, bgColor, iconSize }) => (
            <Link
              key={id}
              to={`/katalog/${path}`}
              className={`
group
relative
overflow-hidden
flex
flex-col
items-center
justify-center
rounded-[28px]
p-6
${bgColor}
shadow-xl shadow-black/15

border border-black/5
transition-all
duration-300
hover:-translate-y-2
hover:scale-[1.03]
hover:shadow-[0_20px_40px_rgba(0,0,0,0.18)]
`}
            >
               <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-white/20 blur-[70px]" />

<div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-white/10 blur-[60px]" />
             <div
 className="
relative
z-10
w-24
h-24
rounded-[24px]
bg-white
ring-1
ring-white/70
shadow-xl
flex
items-center
justify-center
transition-all
duration-300
group-hover:scale-110
group-hover:-rotate-3
"
>
  <img
    src={icon}
    alt={label}
    className={`object-contain ${
      iconSize?.width || "w-16"
    } ${iconSize?.height || "h-16"} ${iconSize?.objectFit || ""}`}
  />
</div>
              <span
  className="
    relative
    z-10
    mt-5
    text-center
    text-[15px]
    font-semibold
    tracking-wide
    text-gray-800
    transition-all
    duration-300
    group-hover:text-black
  "
>
  {label}
</span>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default Katalog;
