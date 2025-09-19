
import { IconSmartHome,IconTriangleSquareCircleFilled,  IconLibraryPlus, IconUserCircle, IconSearch   } from '@tabler/icons-react';





const menuItems = [
  {
    id: 1,
    text: "Əsas",
    url: "/",
    icon:<div className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 cursor-pointer inline-flex items-center justify-center transition-colors duration-300 ease-in-out">
  <IconSmartHome stroke={2} 
    size={28}
    className="text-blue-600 hover:text-blue-800 transition-colors duration-300 ease-in-out"
  />
</div>
  },
  {
    id: 2,
    text: "Katalog",
    url: "/categories",
    icon:<div className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 cursor-pointer inline-flex items-center justify-center transition-colors duration-300 ease-in-out">
  <IconTriangleSquareCircleFilled 
    size={28}
    strokeWidth={0.75}
    className="text-gray-500 hover:text-blue-600 transition-colors duration-300 ease-in-out"
  />
</div>

  },
  {
    id: 3,
    text: "Yeni Elan",
    url: "/CreateCatalogPost",
    icon: <div className="p-3 rounded-full bg-gray-100 hover:bg-red-100 cursor-pointer  inline-flex items-center justify-center transition-colors duration-300 ease-in-out">
  <IconLibraryPlus stroke={2}
    size={40}
    strokeWidth={0.75}
    className="text-gray-700 hover:text-red-500 transition-colors duration-300 ease-in-out"
  />
</div>

  },
  {
    id: 4,
    text: "Profil",
    url: "/profile",
    icon:<div className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 cursor-pointer inline-flex items-center justify-center transition-colors duration-300 ease-in-out">
  <IconUserCircle stroke={2} 
    size={28}
    strokeWidth={0.75}
    className="text-gray-700 hover:text-blue-600 transition-colors duration-300 ease-in-out"
  />
</div>

  },
  {
    id: 5,
    text: "Axtarış",
    url: "/search",
    icon:<div className="p-2 rounded-lg bg-gray-100 hover:bg-purple-100 cursor-pointer inline-flex items-center justify-center transition-colors duration-300 ease-in-out">
  <IconSearch stroke={2} 
    size={28}
    strokeWidth={0.75}
    className="text-gray-700 hover:text-purple-500 transition-colors duration-300 ease-in-out"
  />
</div>

  }
  

];

export default menuItems; // ✅ default export
