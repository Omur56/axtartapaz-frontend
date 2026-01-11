import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Heart, RefreshCcw, Percent, MapPin, Search, User } from "lucide-react";
import Katalog from "../Katalog";
import BottomMenu from "../../components/MobileMenu";
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

const Home = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  const [favorites, setFavorites] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  /* ================= FETCH ALL ================= */
  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const requests = Object.entries(CATEGORIES).map(async ([key, url]) => {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}${url}`);
          return [key, res.data];
        });

        const responses = await Promise.all(requests);
        setData(Object.fromEntries(responses));
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  /* ================= ALL ADS ================= */
  const allAds = Object.entries(data)
    .flatMap(([type, items]) =>
      (items || []).map((item) => ({ ...item, __type: type }))
    )
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  const visibleAds = allAds.slice(0, visibleCount);

  /* ================= INFINITE SCROLL ================= */
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 300
      ) {
        setVisibleCount((prev) =>
          prev >= allAds.length ? prev : prev + ITEMS_PER_LOAD
        );
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [allAds.length]);

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

    try {
      const requests = Object.entries(CATEGORIES).map(async ([key, url]) => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}${url}`);
        return res.data.map((i) => ({ ...i, source: key }));
      });

      const responses = await Promise.all(requests);
      const merged = responses.flat();

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
        ]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q))
      );

      setResults(filtered);
    } catch (e) {
      console.error("Search error:", e);
    } finally {
      setLoadingSearch(false);
    }
  };

  /* ================= DATE HELPERS ================= */
  // const formatDate = (d) =>
  //   new Date(d).toLocaleDateString("az-AZ", {
  //     day: "numeric",
  //     month: "long",

  //   });

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

  const SkeletonCard = () => {
    return (
      <div className="bg-gray-50 w-[185.7px] h-[268.6px] sm:w-[268.75px] sm:h-[268.6px] max-w-[240.4px] max-h-[368.8px] rounded-[12px] shadow-md overflow-hidden animate-pulse">
        <div className="h-[147px] w-full bg-gray-300" />

        <div className="p-2 space-y-2">
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
  };

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen max-w-[1000px] mx-auto mt-[80px] mb-10">
      {/* SEARCH */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Axtar..."
        className="w-full border p-2 rounded mb-4"
      />

      {loadingSearch && (
        <Typography align="center">
          <CircularProgress /> Axtarılır...
        </Typography>
      )}

      {!loadingSearch && results.length > 0 && (
        <div className="grid grid-cols-2  sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 ">
          {results.map((item) => (
            <Link key={item._id} to={`/ads/${item.source}/${item._id}`}>
              <div className="border rounded shadow p-2">
                <img
                  src={item.images?.[0] || "/no-image.jpg"}
                  className="h-[100px] w-full object-cover"
                />
                <p className="font-bold">{item.price} AZN</p>
                <p className="text-xs">{item.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Katalog />

      {/* CARDS (DESIGN SAXLANILIB) */}
      <div className=" p-4  justify-items-center grid bg-gray-50 grid-cols-2 justify-center items-center sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : visibleAds.map((item) => (
              <div key={item._id} className="relative">
                <Link target="_blank" to={`/${item.__type}/${item._id}`}>
                  <div className="bg-gray-50 w-[185.7px] mb-10 h-[268.6px] sm:w-[268.75px] sm:h-[268.6px] max-w-[240.4px] max-h-[368.8px] rounded-[4px] shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out overflow-hidden">
                    {/* ICONS */}
                    

                    {/* IMAGE */}
                    <div className="relative">
                      <div className="absolute mt-1 w-full p-1 top-0 left-0 flex gap-2 ">
                      {item.kredit && (
                        <div className="w-[25px] h-[25px] flex items-center justify-center bg-orange-500 rounded-full text-white">
                          <Percent size={16} strokeWidth={1.5} />
                        </div>
                      )}
                      {item.barter && (
                        <div className="w-[25px] h-[25px] flex items-center justify-center bg-green-500 rounded-full text-white">
                          <RefreshCcw size={16} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <img
                      src={item.images?.[0] || "/no-image.jpg"}
                      className="h-[147px] w-full object-cover"
                      alt={item.title}
                    />

                    
                    {item.salon === "Salon" && (
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded">Salon</div>
                    )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-2">
                      <h3 className="font-bold">{item.price} AZN ₼</h3>
                      <p className="text-[10px] sm:text-[18px] truncate font-semibold">
                        {item.title || item.brand}
                      </p>

                      {item.year && item.motor && item.km && (
                        <p className="text-[10px] sm:text-[14px] truncate text-gray-600">
                          {item.year}, {item.motor}, {item.km} km
                        </p>
                      )}

                      <div className="flex justify-between text-[10px] text-gray-600 mt-2">
                        <span className="flex items-center gap-1 text-[12px]">
                          <MapPin size={12} color="#75FC56" />
                          {item.location}
                        </span>
                        <span>
                          {formatDate(item.data)} {getCurrentTime(item.data)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* FAVORITE */}
                <button
                  onClick={() => toggleFavorite(item)}
                  className="absolute top-2 right-2 "
                >
                  <Heart
                    size={22}
                    fill={
                      favorites.some((f) => f._id === item._id) ? "red" : "none"
                    }
                    color="#fff"
                  />
                </button>
              </div>
            ))}
      </div>
      <BottomMenu />
    </div>
  );
};

export default Home;
