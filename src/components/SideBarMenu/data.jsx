import {
  IconSmartHome,
  IconTriangleSquareCircleFilled,
  IconLibraryPlus,
  IconUserCircle,
  IconSearch,
} from "@tabler/icons-react";

const menuItems = [
  { id: 1, text: "Əsas", url: "/", icon: IconSmartHome },
  { id: 2, text: "Katalog", url: "/categories", icon: IconTriangleSquareCircleFilled },
  { id: 3, text: "Yeni Elan", url: "/CreateCatalogPost", icon: IconLibraryPlus },
  { id: 4, text: "Profil", url: "/profile", icon: IconUserCircle },
  { id: 5, text: "Axtarış", url: "/search", icon: IconSearch },
];

export default menuItems;
