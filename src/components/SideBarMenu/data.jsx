import { IconSmartHome, IconTriangleSquareCircleFilled, IconLibraryPlus, IconUserCircle, IconSearch } from "@tabler/icons-react";








// ==================== MENU ITEMS ====================
const menuItems = [
  {
    id: 1,
    text: "Əsas",
    url: "/",
    icon: (
      <div className="p-2 rounded-lg  cursor-pointer inline-flex items-center justify-center transition-colors duration-300 ease-in-out">
        <IconSmartHome
          stroke={2}
          size={22}
          className="text-blue-600 transition-colors duration-300 ease-in-out"
          strokeWidth={1.5}
          
         
        />
      </div>
    ),
  },
  {
    id: 2,
    text: "Katalog",
    url: "/categories",
    icon: (
      <div className="p-2 rounded-lg  cursor-pointer inline-flex items-center justify-center transition-colors duration-300 ease-in-out">
        <IconTriangleSquareCircleFilled
          size={22}
          strokeWidth={1.5}
          className="text-blue-600  transition-colors duration-300 ease-in-out"
        />
      </div>
    ),
  },
  {
    id: 3,
    text: "Yeni Elan",
    url: "/CreateCatalogPost",
    icon: (
      <div className="p-3 rounded-full  cursor-pointer inline-flex items-center justify-center transition-colors duration-300 ease-in-out">
        <IconLibraryPlus
          stroke={2}
          size={35}
          strokeWidth={1.5}
          className="text-blue-600  transition-colors duration-300 ease-in-out"
        />
      </div>
    ),
  },
  {
    id: 4,
    text: "Profil",
    url: "/profile",
    icon: (
      <div className="p-2 rounded-lg   cursor-pointer inline-flex items-center justify-center transition-colors duration-300 ease-in-out">
        <IconUserCircle
          stroke={2}
          size={22}
          strokeWidth={1.5}
          className="text-blue-600  transition-colors duration-300 ease-in-out"
        />
      </div>
    ),
  },
  {
    id: 5,
    text: "Axtarış",
    url: "/search",
    icon: (
      <div className="p-2 rounded-lg cursor-pointer inline-flex items-center justify-center transition-colors duration-300 ease-in-out">
        <IconSearch
          stroke={2}
          size={22}
          strokeWidth={1.5}
          className="text-blue-600  transition-colors duration-300 ease-in-out"
        />
      </div>
    ),
  },
];

export default menuItems;
