import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { categories } from "../Katalog/Cateqories";
import { Link } from "react-router-dom";

const Katalog = () => {
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
      sliderRef.current.scrollBy({ left: -sliderRef.current.clientWidth / 2, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: sliderRef.current.clientWidth / 2, behavior: "smooth" });
    }
  };

  return (
    <div className="min-w-[370px]  max-w-[400px] md:max-w-[600px] lg:max-w-[800px]   mx-auto mb-4 ">
      {/* --- Mobil versiya (slider) --- */}
      <div className="relative block md:hidden mt-[30px] ">
        
        <div
          ref={sliderRef}
          className="flex gap-[10px] h-[180px] overflow-x-auto scrollbar-hide scroll-smooth "
        >
          {categories.map(({ id, path, label, icon: Icon, bgColor, hover }) => (
            <Link
              key={id}
              to={`/katalog/${path}`}
              className={`flex flex-col p-10 items-center justify-center rounded-2xl shadow-md transition-all ${bgColor} ${hover}`}
            >
              <Icon className="w-10 h-10 mb-3 text-gray-700" />
              <span className="text-sm font-medium text-gray-800 text-center">{label}</span>
            </Link>
          ))}
        </div>
      
      </div>

      {/* --- Desktop versiya (grid) --- */}
      <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center ">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id, cat.path)}
              className="w-[100px] text-center"
            >
              <div className="mt-4" >
                <button
                  className={`${cat.bgColor} transform hover:scale-105 border w-[100px] h-[30px] rounded-[10px] flex justify-center items-center shadow transition-all duration-200`}
                >
                  <Icon className="w-[20px] h-[20px] text-gray-700" />
                </button>
                <div className="mt-2">
                  <span className="text-[10px] text-black font-bold leading-tight block">
                    {cat.label}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Katalog;
