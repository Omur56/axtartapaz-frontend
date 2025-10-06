import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import TitleLogo from "../TitleLogo";
import { FaSignInAlt, FaUserPlus, FaPlus, FaUser, FaSignOutAlt } from "react-icons/fa";
import { User, Heart  } from 'lucide-react';
import { Link } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Page load zamanı localStorage yoxlanılır
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/"); // logout sonrası əsas səhifəyə yönləndir
  };

 const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
    
  return (
    <header className="header h-[50px]  p-2  w-full z-50 fixed top-0 bg-gradient-to-r from-blue-500 to-rose-500 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.5)] rounded-b-[10px]">  
      <div className="flex justify-between items-center py-1 mx-auto my-auto max-w-[1200px]">
        <TitleLogo />

        <div className="flex gap-3 mt-[-8px]">
           <Link
                  
                  rel="noopener noreferrer"
                 
                  to={`/favorites`}
                > 
            <button
      onClick={toggleFavorite}
      className="p-1 rounded-full transition-colors duration-300"
    >
      <Heart
      size={24}
      strokeWidth={2}
      onClick={() => setIsFavorite(!isFavorite)}
      className={`cursor-pointer transition-colors duration-200 ${
        isFavorite ? "text-white" : "text-white"
      } hover:text-blue-500`}
    />

                   

    </button>
    </Link>
          {!isLoggedIn && (
            <>
          
              <button
                className="flex hidden md:flex transform ease-in-out duration-500 items-center text-[10px] font-[500] gap-2 bg-transparent border border-blue-500 text-blue-600 hover:text-white px-2 py-2 rounded-[4px] hover:bg-blue-500"
                onClick={() => navigate("/login")}
              >
                <FaSignInAlt /> Daxil ol
              </button>
              <button
                className="flex hidden md:flex transform ease-in-out duration-500 items-center text-[10px] font-[500] gap-2 bg-transparent border border-blue-500 text-blue-600 hover:text-white px-2 py-2 rounded-[4px] hover:bg-blue-500"
                onClick={() => navigate("/reqister")}
              >
                <FaUserPlus /> Qeydiyyat
              </button>
            </>
          )}

          {isLoggedIn && (
            <>
            <button
  className="flex hidden md:flex items-center text-[10px] font-medium gap-2 bg-transparent border border-blue-500 text-blue-600 px-2 py-2 rounded-[4px] 
             hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
  onClick={() => navigate("/profile")}
>
  <User className="transition-colors duration-300 ease-in-out" /> Profil
</button>
              <button
                className="flex hidden md:flex transform ease-in-out duration-500 items-center text-[10px] font-[500] gap-2 bg-red-600 text-white px-2 py-2 rounded-[4px] hover:bg-red-400"
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          )}

          <button
            className="flex hidden md:flex items-center gap-2 bg-gradient-to-r from-sky-600 to-cyan-400 hover:text-black text-white px-2 py-2 rounded-[4px] hover:bg-gradient-to-r hover:from-sky-200 hover:to-cyan-100 transition"
            onClick={() => navigate("/CreateCatalogPost")}
          >
            <FaPlus /> Yeni Elan
          </button>
        </div>
      </div>  
    </header>
  );
}

export default Header;
