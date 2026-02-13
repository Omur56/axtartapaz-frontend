
import { Icon } from "./iconhome";
import {Icon_category} from "./iconcategory"
import { Icon_add } from "./imgadd";
import { Icon_person } from "./person";
import { Icon_search } from "./iconsearch";

const menuItems = [
  { id: 1, text: "Əsas", url: "/", icon: Icon },
  { id: 2, text: "Katalog", url: "/categories", icon: Icon_category },
  { id: 3, text: "Yeni Elan", url: "/CreateCatalogPost", icon: Icon_add },
  { id: 4, text: "Profil", url: "/profile", icon: Icon_person},
  { id: 5, text: "Axtarış", url: "/search", icon: Icon_search },
];

export default menuItems;
