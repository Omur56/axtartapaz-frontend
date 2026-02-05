// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router";
// import { categories } from "../Katalog/Cateqories";
// import { Link } from "react-router-dom";
// // import Breadcrumb from "../../components/Breadcrumb";

// const Katalog = () => {
//   const [activeId, setActiveId] = useState(null);
//   const navigate = useNavigate();
//   const sliderRef = useRef(null);

//   useEffect(() => {
//     const savedId = sessionStorage.getItem("selectedCategoryId");
//     if (savedId) {
//       setActiveId(Number(savedId));
//     }
//   }, []);

//   const handleCategoryClick = (id, path) => {
//     setActiveId(id);
//     localStorage.setItem("selectedCategoryId", id);
//     navigate(`/Katalog/${encodeURIComponent(path)}`);
//   };

//   const scrollLeft = () => {
//     if (sliderRef.current) {
//       sliderRef.current.scrollBy({ left: -sliderRef.current.clientWidth / 2, behavior: "smooth" });
//     }
//   };

//   const scrollRight = () => {
//     if (sliderRef.current) {
//       sliderRef.current.scrollBy({ left: sliderRef.current.clientWidth / 2, behavior: "smooth" });
//     }
//   };

//   return (
//     <div className="min-w-[380px]  max-w-[400px] md:max-w-[600px] lg:max-w-[700px]   mx-auto mb-4 ">
//       {/* <Breadcrumb /> */}
//       {/* --- Mobil versiya (slider) --- */}
//       <div className="relative block md:hidden mt-[30px] ">

//         <div
//           ref={sliderRef}
//           className="flex gap-[10px] h-[180px] overflow-x-auto scrollbar-hide scroll-smooth "
//         >
//           {categories.map(({ id, path, label, icon: Icon, bgColor, hover }) => (
//             <Link
//               key={id}
//               to={`/katalog/${path}`}
//               className={`flex flex-col p-10 items-center justify-center rounded-2xl shadow-md transition-all ${bgColor} ${hover}`}
//             >
//               <Icon className="w-10 h-10 mb-3 text-white" />
//               <span className="text-sm font-medium text-white text-center">{label}</span>
//             </Link>
//           ))}
//         </div>

//       </div>

//       {/* --- Desktop versiya (grid) --- */}
//       <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center ">
//         {categories.map((cat) => {
//           const Icon = cat.icon;
//           return (
//             <Link
//               key={cat.id}
//               onClick={() => handleCategoryClick(cat.id, cat.path)}
//               className="w-[100px] text-center"
//             >
//               <div className="mt-4" >
//                 <button
//                   className={`${cat.bgColor} transform hover:scale-105 border w-[100px] h-[30px] rounded-[10px] flex justify-center items-center shadow transition-all duration-200`}
//                 >
//                   <Icon className="w-[20px] h-[20px] text-white" />
//                 </button>
//                 <div className="mt-2">
//                   <span className="text-[10px] text-white font-bold leading-tight block">
//                     {cat.label}
//                   </span>
//                 </div>
//               </div>
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Katalog;

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
    <div className={`${className} filex flex-col md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4  justify-items-center max-h-[300px]    md:max-w-[700px] lg:max-w-[1000px] mx-auto  p-2 `}
    style={{ width: width || "100%", height: height || "100px", marginTop: marginTop  || "20%" }} >
      {/* --- Mobil versiya (slider) --- */}
      <div
      className="relative block md:hidden mx-auto p-2  "
      style={{ width: width || "100%", height: height || "150px", marginTop: marginTop || "20px" }}
    >
      {/* Slider container */}
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory"
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
                alt=""
                className="w-[100px] h-[80px] object-cover absolute bottom-0 right-0"
              />
            ) : (
              <icon
                className="w-[50px] h-[50px] text-white absolute bottom-0 right-0"
              />
            )}
            <div className="w-full text-start p-1 flex items-start rounded-lg">
              <span className="text-white text-[10px] font-bold">{label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Scroll buttons */}
      {/* <button
        onClick={scrollLeft}
        className="absolute left-1 top-1/2 -translate-y-1/2 bg-gray-200/80 hover:bg-gray-300 rounded-full p-2 z-10 shadow transition"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      <button
        onClick={scrollRight}
        className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-200/80 hover:bg-gray-300 rounded-full p-2 z-10 shadow transition"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button> */}
    </div>

      {/* --- Desktop versiya (grid) --- */}
      <div className="hidden top-[100px] min-h-[200px] w-full md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
        {categories.map((cat) => {
          return (
            <Link
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id, cat.path)}
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
                    <img
                      src={cat.icon}
                      alt={cat.label}
                      className="mb-[-13px] ml-[-2px] text-white"
                    />
                  ) : (
                    <cat.icon className="w-[50px] h-[50px] text-white" />
                  )}
                 
                  </div>
                   <p className="z-50 left-2 absolute p-1  mt-[40px]  color:red text-[10px] text-white font-bold">{cat.label}</p>
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
