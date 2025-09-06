
import { AiOutlineUser, AiOutlineSetting, AiOutlineMail, AiOutlineAppstore, AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";

import { LayoutPanelLeft, ChartBarStacked, CirclePlus, User, Search  } from 'lucide-react';






const menuItems = [
  {
    id: 1,
    text: "Əsas",
    url: "/",
    icon:<div className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 cursor-pointer inline-flex items-center justify-center transition-colors duration-300 ease-in-out">
  <LayoutPanelLeft
    size={28}
    className="text-blue-600 hover:text-blue-800 transition-colors duration-300 ease-in-out"
  />
</div>
  },
  {
    id: 2,
    text: "Katalog",
    url: "/Katalog",
    icon:<div className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 cursor-pointer inline-flex items-center justify-center transition-colors duration-300 ease-in-out">
  <ChartBarStacked
    size={28}
    strokeWidth={1.75}
    className="text-gray-700 hover:text-blue-600 transition-colors duration-300 ease-in-out"
  />
</div>

  },
  {
    id: 3,
    text: "Yeni Elan",
    url: "/CreateCatalogPost",
    icon: <div className="p-3 rounded-full bg-gray-100 hover:bg-red-100 cursor-pointer  inline-flex items-center justify-center transition-colors duration-300 ease-in-out">
  <CirclePlus
    size={40}
    strokeWidth={1.75}
    className="text-gray-700 hover:text-red-500 transition-colors duration-300 ease-in-out"
  />
</div>


  },
  {
    id: 4,
    text: "Profil",
    url: "/profile",
    icon:<div className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 cursor-pointer inline-flex items-center justify-center transition-colors duration-300 ease-in-out">
  <User
    size={28}
    strokeWidth={1.75}
    className="text-gray-700 hover:text-blue-600 transition-colors duration-300 ease-in-out"
  />
</div>

  },
  {
    id: 5,
    text: "Axtarış",
    url: "/search",
    icon:<div className="p-2 rounded-lg bg-gray-100 hover:bg-purple-100 cursor-pointer inline-flex items-center justify-center transition-colors duration-300 ease-in-out">
  <Search
    size={28}
    strokeWidth={1.75}
    className="text-gray-700 hover:text-purple-500 transition-colors duration-300 ease-in-out"
  />
</div>

  },
  {
    id: 6,
    text: "Əlaqə",
    url: "/contact",
    icon: (
      <AiOutlineMail 
        className="text-red-500 hover:text-red-700 transition duration-300 transform hover:scale-125 hover:-rotate-12" 
        size={28} 
      />
    ),
  },

];

export default menuItems; // ✅ default export
