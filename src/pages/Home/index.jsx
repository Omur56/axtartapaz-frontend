// ----------------------- Home.jsx ---------------------------
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Heart, RefreshCcw, Percent, MapPin } from "lucide-react";
import Katalog from "../Katalog";
import BottomMenu from "../../components/MobileMenu";
import { Helmet } from "react-helmet-async";

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

  const currentUserId = localStorage.getItem("userId");

  /* FETCH ALL DATA */
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

  /* ALL ADS */
  const allAds = Object.entries(data)
    .flatMap(([type, items]) =>
      (items || []).map((item) => ({ ...item, __type: type }))
    )
    .sort((a, b) => {
      const priority = { vip: 2, premium: 1, free: 0 };
      const aPr = priority[a.type] || 0;
      const bPr = priority[b.type] || 0;
      if (aPr !== bPr) return bPr - aPr;
      return new Date(b.data) - new Date(a.data);
    });

  const visibleAds = allAds.slice(0, visibleCount);

  /* INFINITE SCROLL */
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

  /* FAVORITES */
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

  /* SEARCH */
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

  /* DATE HELPERS */
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

  /* SKELETON */
  const SkeletonCard = () => (
    <div className="bg-gray-50 w-[185px] h-[268px] sm:w-[268px] sm:h-[268px] max-w-[240px] max-h-[368px] rounded-[12px] shadow-md overflow-hidden animate-pulse">
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

  const handleUpgrade = async (listingId, type) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payments/create-checkout/${listingId}`,
        { type }, // "vip" / "premium"
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.url) {
        window.location.href = res.data.url; // Stripe checkout səhifəsinə yönləndir
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const typeLabels = {
    sifarisle: "Sifariş",
    magaza: "Salon",
    resmi: "Rəsmi",
  };

  /* RENDER */
  return (
    <div className="min-h-screen max-w-[1200px] mx-auto mt-[80px] mb-10">
      <Helmet>
        <title>ProElan.az - Azərbaycanda Pulsuz Elanlar</title>
        <meta
          name="description"
          content="ProElan.az - Avtomobil, əmlak və digər pulsuz elanlar platforması."
        />
        <link rel="canonical" href="https://proelan.az/" />
      </Helmet>

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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
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

      <Katalog className="mt-1" width="100%" height="60px" marginTop="10px" />

      {/* CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-[120px] sm:mt-[220px] justify-items-center">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : visibleAds.map((item) => (
              <div
                key={item._id}
                className="relative w-full max-w-[280px] min-w-[100px] max-h-[300.8px] min-h-[100px] mb-36"
              >
                <Link target="_blank" to={`/${item.__type}/${item._id}`}>
                  <div className="w-full max-h-[350px]  min-h-[100px] rounded-[15px] hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden flex flex-col">
                    {/* ICONS */}
                    <div className="absolute top-2 left-2 flex gap-2 z-10">
                      {item.barter && (
                        <div className="w-6 h-6 flex items-center justify-center bg-green-500 rounded-full text-white">
                          <RefreshCcw size={16} strokeWidth={1.5} />
                        </div>
                      )}
                      {item.kredit && (
                        <div className="w-6 h-6 flex items-center justify-center bg-orange-500 rounded-full text-white">
                          <Percent size={16} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>

                    {/* IMAGE */}
                    <div className="relative w-full h-[350px] overflow-hidden rounded-[15px]">
                      <img
                        src={item.images?.[item.images.length - 1] || "/no-image.jpg"}
                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                        alt={item.title || item.brand || item.model || item.category || item._id || item.id || item.ban_type}
                      />
                      {/* VIP / PREMIUM badge */}
                      {item.priorityType && item.priorityType !== "free" && (
                        <span className="vip-badge z-20 bg-red-500 text-white px-2 py-1 text-xs rounded absolute top-[152px] right-2">
                          {item.priorityType?.toUpperCase() || ""}
                        </span>
                      )}


                      {item.type === "Magaza" && (
                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs sm:text-sm px-2 py-1 rounded">
                          Salon
                        </div>
                      )}

                      {item.type === "sifarisle"}


                      {item.type === "sifarisle" && (
                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs sm:text-sm px-2 py-1 rounded">
                          Sifarişlə
                        </div>
                      )}

                       {item.type === "resmi" && (
                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs sm:text-sm px-2 py-1 rounded">
                          Rəsmi
                        </div>
                       )}

                      
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 p-3 flex flex-col justify-between h-[200px]">
                      <h3 className="font-bold text-base sm:text-lg truncate">
                        {item.price} AZN ₼
                      </h3>
                      <p className="text-sm sm:text-base font-semibold ">
                        {item.brand || item.category || item.model || item.title}
                      </p>
                      {item.year && item.motor && item.km && (
                        <p className="text-xs sm:text-sm text-gray-600 truncate ">
                          {item.year}, {item.motor}, {item.km} km
                        </p>
                      )}
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

                {/* UPGRADE BUTTONS */}
                <div className="flex justify-between top-1 items-center mt-2">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 min-w-[10px] max-w-[100px] text-black font-bold py-1 px-3 rounded"
                    onClick={() => handleUpgrade(item._id, "vip")}
                  >
                    VIP Et
                  </button>
                  <button
                    className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-1 px-3 rounded"
                    onClick={() => handleUpgrade(item._id, "premium")}
                  >
                    Premium Et
                  </button>
                </div>

                {/* FAVORITE */}
                <button
                  onClick={() => toggleFavorite(item)}
                  className="absolute top-2 right-2"
                >
                  <Heart
                    size={22}
                    fill={favorites.some((f) => f._id === item._id) ? "red" : "rgba(0,0,0,0.4)"}
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