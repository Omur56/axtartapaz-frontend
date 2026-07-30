
import { Icon } from "./iconhome";
import {Icon_category} from "./iconcategory"
import { Icon_add } from "./imgadd";
import { Icon_person } from "./person";
import { Icon_search } from "./iconsearch";

// const menuItems = [
//   { id: 1, text: "Əsas", url: "/", icon: Icon },
//   { id: 2, text: "Katalog", url: "/categories", icon: Icon_category },
//   { id: 3, text: "Yeni Elan", url: "/CreateCatalogPost", icon: Icon_add },
//   { id: 4, text: "Profil", url: "/profile", icon: Icon_person},
//   { id: 5, text: "Axtarış", url: "/search", icon: Icon_search,  },
// ];




import {
  House,
  Search,
  CirclePlus,
  Heart,
  UserRound,
} from "lucide-react";

const menuItems = [
  {
    id: 1,
    text: "Əsas",
    url: "/",
    icon: House,
  },
  {
    id: 2,
    text: "Axtar",
    url: "/search",
    icon: Search,
  },
  {
    id: 3,
    text: "Elan",
    url: "/CreateCatalogPost",
    icon: CirclePlus,
    className: "mt-[-10px]",
  },
  {
    id: 4,
    text: "Seçilmiş",
    url: "/favorites",
    icon: Heart,
  },
  {
    id: 5,
    text: "Kabinet",
    url: "/profile",
    icon: UserRound,
  },
];
export default menuItems;
