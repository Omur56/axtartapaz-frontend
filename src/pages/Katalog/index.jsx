
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { categories } from "../Katalog/Cateqories";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "../../styles/scrolbarr.css";


// import Breadcrumb from "../../components/Breadcrumb";
import { Label } from './../../components/ui/label';
import BottomMenu from "../../components/MobileMenu";

const Katalog = ({ className, width, height, marginTop }) => {
  const [activeId, setActiveId] = useState(null);
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  

  useEffect(() => {
    const savedId = sessionStorage.getItem("selectedCategoryId");
    if (savedId) {
      setActiveId(Number(savedId));
    }
  }, []);

  const handleCategoryClick = (id, path) => {
    setActiveId(id);
    localStorage.setItem("selectedCategoryId", id);
    navigate(`/Katalog/${encodeURIComponent(path)}`);
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.clientWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.clientWidth / 2,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={`${className}  gap-6 scrollbar-hide    mx-auto  p-2 `}
    style={{ width: width || "100%", height: height || "100px", marginTop: marginTop  || "80px" }} >
      {/* --- Mobil versiya (slider) --- */}
      <div
      className="relative scrollbar-hide block md:hidden mx-auto p-2 scrollbar-hide "
      style={{ width: width || "100%", height: height || "150px", marginTop: marginTop || "20px" }}
    >
      {/* Slider container */}
      <div
        ref={sliderRef}
        className="flex gap-[10px] h-[120px] overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {categories.map(({ id, path, icon, bgColor, hover, label }) => (
          
    <Link
  key={id}
  to={`/katalog/${path}`}
  className={`relative min-w-[100px] max-w-[120px] h-[120px] rounded-[10px] shadow-md flex items-end justify-end p-2 transition-all ${bgColor} ${hover} snap-start`}
>
  {typeof icon === "string" ? (
    <img
      src={icon}
      alt={label}
      className="w-[100px] h-[80px] object-cover absolute bottom-0 right-0"
    />
  ) : (
    <icon className="w-[50px] h-[50px] text-white absolute bottom-0 right-0" />
  )}

  {/* LABEL BURADA */}
  <div className="absolute top-1 left-2  ">
    <span className="text-[10px] font-bold text-white drop-shadow">
      {label}
    </span>
  </div>
</Link>
        ))}
      </div>

 
    </div>

      {/* --- Desktop versiya (grid) --- */}
      <div className="hidden  min-h-[200px] w-full md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
        {categories.map((cat) => {
           const Icon = cat.icon; // 👈 BURADA
         
          return (
            <Link
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id, cat.path)}
              aria-label={cat.label}
              className="w-[150px] h-[90px] text-center"
            >
              <div className="mt-4 ">
                <button
                  className={`${cat.bgColor} h- ring-2 ring-blue-500 flex-col transform hover:scale-105 border w-[150px] h-[100px] rounded-[7px] flex justify-center items-center shadow transition-all duration-200`}
                >
                  
                  <div className="absolute top-2 right-2 opacity-50 ">
                    <FontAwesomeIcon icon={faChevronRight} className="text-white" />
                  </div>
                  <div className="h-[20px] w-full flex flex-col items-center justify-center relative">
               {typeof cat.icon === "string" ? (
  <img src={cat.icon} alt={cat.label} />
) : (
  <Icon className="w-[50px] h-[50px] text-white" />
)}
                 
                  </div>
                   <p className="z-50 left-2 absolute p-1 mt-[-50px]   color:red text-[10px] text-white font-bold">{cat.label}</p>
                </button>
               
              </div>
            </Link>
          );
        })}
      </div>
      <BottomMenu />
    </div>
  );
};

export default Katalog;
