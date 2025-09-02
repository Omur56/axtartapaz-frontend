import { 
  AiFillHome, 
  AiOutlineUser, 
  AiOutlineSetting, 
  AiOutlineMail, 
  AiOutlineAppstore, 
  AiOutlinePlus, 
  AiOutlineSearch 
} from "react-icons/ai";

const menuItems = [
  {
    id: 1,
    text: "Əsas",
    url: "/",
    icon: (
      <AiFillHome 
        className="text-slate-500 border rounded-[8px] hover:text-red-500 hover:text-white bg-transparent transition duration-300 transform hover:scale-125" 
        size={28} 
      />
    ),
  },
  {
    id: 2,
    text: "Katalog",
    url: "/Katalog",
    icon: (
      <AiOutlineAppstore 
        className="text-slate-500 border rounded-[8px] hover:text-red-500 transition duration-300 transform hover:scale-125 " 
        size={28} 
      />
    ),
  },
  {
    id: 3,
    text: "Yeni Elan",
    url: "/CreateCatalogPost",
    icon: (
      <AiOutlinePlus 
        className="text-white bg-red-500  mt-[-15px] hover:bg-red-700 border rounded-[50px] hover:text-white transition duration-300 transform hover:scale-125 " 
        size={60} 
      />
    ),
  },
  {
    id: 4,
    text: "Profil",
    url: "/profile",
    icon: (
      <AiOutlineUser 
        className="text-slate-500 hover:bg-red-500 transition border rounded-[50px] hover:text-white duration-300 transform hover:scale-125 " 
        size={28} 
      />
    ),
  },
  {
    id: 5,
    text: "Axtarış",
    url: "/search",
    icon: (
      <AiOutlineSearch 
        className="text-slate hover:bg-red-500 transition border rounded-[50px] hover:text-white duration-300 transform hover:scale-125 " 
        size={28} 
      />
    ),
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
  {
    id: 7,
    text: "Settings",
    url: "/settings",
    icon: (
      <AiOutlineSetting 
        className="text-indigo-500 hover:text-indigo-700 transition duration-300 transform hover:scale-125 hover:rotate-6" 
        size={28} 
      />
    ),
  },
];

export default menuItems; // ✅ default export
