import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Heart, RefreshCcw, Percent, MapPin } from "lucide-react";
import BottomMenu from "../../components/MobileMenu";
import Katalog from "../Katalog/index";
import Swal from "sweetalert2";
import { User } from "lucide-react";
import { Mail } from "lucide-react";

// ==================== CONSTANTS ====================

const ITEMS_PER_LOAD = 8;


const CATEGORIES = {
  cars: "/api/cars",
  homeGarden: "/api/homeGarden",
  electronika: "/api/electronika",
  accessories: "/api/accessories",
  realEstate: "/api/realEstate",
  household: "/api/Household",
  phone: "/api/Phone",
  clothing: "/api/Clothing",
};



// ==================== AD CARD COMPONENT ====================
const AdCard = ({ item, favorites, toggleFavorite }) => {
  const formatDate = (dateString) => {
    const postDate = new Date(dateString);
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const postDay = new Date(postDate.setHours(0, 0, 0, 0));
    const diffTime = today - postDay;
    const oneDay = 24 * 60 * 60 * 1000;

    if (diffTime === 0) return "bugün";
    if (diffTime === oneDay) return "dünən";

    return postDate.toLocaleDateString("az-AZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCurrentTime = (d) => new Date(d).toTimeString().slice(0, 5);

  return (
    <div className="relative w-[220px] h-[380px]">
      
      <Link target="_blank" to={`/${item.__type}/${item._id}`}>
     <div className=" w-full sm:w-[220px] md:w-[220px] lg:w-[220px] xl:w-[220px] h-[380px] rounded-xl   transition-shadow duration-300 ease-in-out overflow-hidden flex flex-col relative">
  {/* ICONS */}
  <div className="absolute top-2 left-2 flex gap-2 z-10">
    {item.kredit && (
      <div className="w-6 h-6 flex items-center justify-center bg-orange-500 rounded-full text-white">
        <Percent size={16} strokeWidth={1.5} />
      </div>
    )}
    {item.barter && (
      <div className="w-6 h-6 flex items-center justify-center bg-green-500 rounded-full text-white">
        <RefreshCcw size={16} strokeWidth={1.5} />
      </div>
    )}
  </div>

  {/* IMAGE */}
  <div className="relative w-[220px] h-[150px] overflow-hidden rounded">
    <div className="w-full h-full overflow-hidden rounded-[10px]">
    <img
      src={item.images?.[0] || "/no-image.jpg"}
      alt={item.title}
      className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
    />
    </div>

    {item.salon === "Salon" && (
      <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs sm:text-sm px-2 py-1 rounded">
        Salon
      </div>
    )}
  </div>

  {/* CONTENT */}
  <div className="flex-1 p-2  h-[150px] flex flex-col justify-between">
    
      <h3 className="font-bold text-base sm:text-lg truncate-overflow">
        {item.price} AZN ₼
      </h3>
      <div className="space-y-1 ">
      {item.category && item.brand && item.model  && (
        <p className="text-sm sm:text-base font-semibold truncate mt-1">
          {item.category } {item.brand} {item.model}  {item.title}
        </p>
      )}
      {item.category && item.brand && item.model && item.title && (
        <p className="text-sm sm:text-base font-semibold truncate mt-1">
          {item.category } {item.brand} {item.model} {item.title}
        </p>

       

      )}

      {item.title && !item.brand && !item.model && (
        <p className="text-sm sm:text-base font-semibold truncate mt-1">
          {item.title} {item.category} {item.brand} {item.model}
        </p> 
      )}

      {item.title && !item.brand && !item.model && !item.category && (
        <p className="text-sm sm:text-base font-semibold truncate mt-1">
          {item.title} {item.category} {item.brand} {item.model}
        </p> 
      )}

      {item.title && item.brand && item.model && !item.category && (
        <p className="text-sm sm:text-base font-semibold truncate mt-1">
          {item.title} {item.brand} {item.model} {item.category}
        </p>
      )}

      {item.title && item.brand && item.model && item.category && (
        <p className="text-sm sm:text-base font-semibold truncate mt-1">
          {item.title} {item.brand} {item.model} {item.category}
        </p>
      )}

      {item.title && !item.brand && !item.model && item.category && (
        <p className="text-sm sm:text-base font-semibold truncate mt-1">
          {item.title} {item.category} {item.brand} {item.model}
        </p>
      )}

      {item.title && item.brand && !item.model && !item.category && (
        <p className="text-sm sm:text-base font-semibold truncate mt-1">
          {item.title} {item.brand} {item.category} {item.model}
        </p>
      )}


      {item.title && item.brand && !item.model && item.category && (
        <p className="text-sm sm:text-base font-semibold truncate mt-1">
          {item.title} {item.brand} {item.category} {item.model}
        </p>
      )}
     

      {item.year && item.motor && item.km && (
        <p className="text-xs sm:text-sm text-gray-600 truncate mt-1">
          {item.year}, {item.motor}, {item.km} km
        </p>
      )}
    </div>

    {/* PRICE */}
    <div className="flex justify-between items-center text-gray-600 mt-2 text-xs sm:text-sm">
      <span className="flex items-center gap-1">
        <User size={14} color="#75FC56" />
        {item.contact.name}
      </span>
      <span className="truncate">{item.phone}</span>
    </div>
    <div className="flex justify-between items-center text-gray-600 mt-2 text-xs sm:text-sm">
      <span className="flex items-center gap-1">
       <Mail size={8} color="#75FC56" className="truncate-1" />
        {item.contact.email}
      </span>
      <span className="truncate">{item.email} 
      </span>
</div>
    <div className="flex justify-between items-center text-gray-600 mt-2 text-xs sm:text-sm">
      <span className="flex items-center gap-1">
        <MapPin size={14} color="#75FC56" />
        {item.location}
      </span>
      <span className="truncate">
        {formatDate(item.data)} {getCurrentTime(item.data)}
      </span>
    </div>
  </div>
</div>

      </Link>

      {/* FAVORITE */}
      <button
        onClick={() => toggleFavorite(item)}
        className=" absolute z-10 top-2 right-2 p-1 transition duration-300 ease-in-out"
        
      >
        <Heart
          size={22}
          fill={favorites.some((f) => f._id === item._id) ? "red" : "none"}
          color="#fff"
        />
      </button>
    </div>
  );
};

// ==================== SKELETON CARD ====================
const SkeletonCard = () => (
  <div className="bg-gray-50 w-full sm:w-[280px] h-[300px] rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="h-[180px] w-full bg-gray-300" />
    <div className="p-3 space-y-2">
      <div className="h-4 w-24 bg-gray-300 rounded" />
      <div className="h-3 w-full bg-gray-300 rounded" />
      <div className="h-3 w-3/4 bg-gray-300 rounded" />
      <div className="flex justify-between mt-3">
        <div className="h-3 w-16 bg-gray-300 rounded" />
        <div className="h-3 w-12 bg-gray-300 rounded" />
      </div>
    </div>
  </div>
);

// ==================== HOME COMPONENT ====================
const Home = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [favorites, setFavorites] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  /* ================= FETCH ALL SERIAL + CACHE ================= */
  useEffect(() => {
    const fetchAllSerial = async () => {
      setIsLoading(true);
      let tempData = {};
      const cached = localStorage.getItem("allAds");
      if (cached) {
        setData(JSON.parse(cached));
        setIsLoading(false);
        return;
      }

      try {
        for (const [key, url] of Object.entries(CATEGORIES)) {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}${url}`);
          tempData[key] = res.data;
          await new Promise((r) => setTimeout(r, 150)); // 150ms delay
        }
        setData(tempData);
        localStorage.setItem("allAds", JSON.stringify(tempData));
      } catch (err) {
        if (err.response?.status === 429) {
          console.warn("Too many requests, wait a bit...");
        } else {
          console.error("API error:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllSerial();
  }, []);

  /* ================= ALL ADS ================= */
  const allAds = Object.entries(data)
    .flatMap(([type, items]) =>
      (items || []).map((item) => ({ ...item, __type: type }))
    )
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  const visibleAds = allAds.slice(0, visibleCount);

  /* ================= FAVORITES ================= */
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const toggleFavorite = (item) => {
    const exists = favorites.some((f) => f._id === item._id);
    const updated = exists
      ? favorites.filter((f) => f._id !== item._id)
      : [...favorites, item];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoadingSearch(true);

    if (!query.length) {
      setLoadingSearch(false);
      return;

    }
    try {
      const merged = allAds.map((i) => ({ ...i, source: i.__type }));
      const q = query.toLowerCase();
      const filtered = merged.filter((item) =>
        [
          item.title,
          item.brand,
          item.model,
          item.category,
          item.city,
          item.location,
          item.description,
          item.year,
          item.price,
          item.motor,
          item.km,
          item.color,
          item.ban_type,
          item.engine,
          item.transmission,
          item.salon,
          item.type_of_goods, item.cateqory,
          item.type,
          item.size,
          item.material,
          item.color,
          

        ]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q))
      );
      setResults(filtered);
    } catch (e) {
      console.error("Search error:", e);
      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text: "Axtarış zamanı xəta baş verdi. Zəhmət olmasa, yenidən cəhd edin.",
      });
    } finally {
      setLoadingSearch(false);
    }



  };

  /* ================= INFINITE SCROLL ================= */
  useEffect(() => {
    let isFetching = false;

    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 300
      ) {
        if (visibleCount >= allAds.length) return;
        if (isFetching) return;

        isFetching = true;
        setVisibleCount((prev) => Math.min(prev + ITEMS_PER_LOAD, allAds.length));
        setTimeout(() => (isFetching = false), 300);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [allAds.length, visibleCount]);

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen max-w-[1200px] mx-auto mt-[80px] mb-10 p-2">
      {/* SEARCH */}
      <input className="border border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition mb-6"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Axtar..."
        
      />

    


      {loadingSearch && (
        <Typography align="center">
          <CircularProgress /> Axtarılır...
        </Typography>
      )}

      
      <Katalog />

      {!loadingSearch && results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-5 gap-4 mb-6">
          {results.map((item) => (
            <Link key={item._id} to={`/ads/${item.source}/${item._id}`}>
              <div className="border rounded-[10px] shadow w-full h-[320px] rounded-[10px] bg-white hover:shadow-lg transition-shadow duration-300 ease-in-out overflow-hidden flex flex-col">
               
                <img
                  src={item.images?.[0] || "/no-image.jpg"}
                  className="h-[150px] rounded-[10px] w-full object-cover"
                />
                 <div className=" p-2">
                <p className="font-bold">{item.price} AZN</p>
                <p className="text-[8px]  sm:text-[14px] lg:text-[14px] xl:text-[14px] xxl:text-[14px] text-black truncate">{item.category} {item.brand} {item.model}</p>
                <p className="text-xs">{item.title}</p>
                <p className="text-xs">{item.location}</p>
                <p className="text-xs">{item.city}</p>
                <div className="flex gap-1">
                  {item.km && item.motor && item.year && (
                    <p className="text-xs">{item.km} Km - {item.motor} L - {item.year} il</p>
                  )}
                
                </div>
                <p className="text-xs">{item.data}</p>

</div>
              </div>
            </Link>
          ))}
        </div>
        
      )}


      {/* MAIN CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: ITEMS_PER_LOAD }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : visibleAds.map((item) => (
              <AdCard
                key={item._id}
                item={item}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            ))}
      </div>
    

      <BottomMenu />
    </div>
  );
};

export default Home;
