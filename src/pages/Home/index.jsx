
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
import '../../styles/home_style.css'
import { useTheme } from "../../components/Main/ThemeContext";
import Swal from "sweetalert2";


const API = process.env.REACT_APP_API_URL || "https://my-backend-wj5g.onrender.com";

// const API = process.env.REACT_APP_API_URL;





const ITEMS_PER_LOAD = 8;

const CATEGORIES = {
  car: "/api/car",
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
  const [announcements, setAnnouncements] = useState([]);
const [counts, setCounts] = useState({});
const [stickyAds, setStickyAds] = useState([]);
  const currentUserId = localStorage.getItem("userId");

   const models = [
        "accessories",
        "electronika",
        "clothing",
        "homeGarden",
        "phone",
        "realEstate",
        "Household",
        "car",
      ];

const typeLabels = {
  magaza: "Salon",
  sifarisle: "Sifarişlə",
  resmi: "Rəsmi",
};


useEffect(() => {
  axios.get(`${API}/api/ads/sticky`).then((res) => {
    console.log("STICKY ADS:", res.data);

    const safeData = Array.isArray(res.data) ? res.data : [];

    setStickyAds(safeData);
  });
}, []);

// axios.get(`${API}/api/ads`);

useEffect(() => {
  const fetchAds = async () => {
    try {
      const res = await axios.get(`${API}/api/ads`);
      console.log("ADS:", res.data);
    } catch (err) {
      console.log("ADS ERROR:", err.message);
    }
  };

  fetchAds();
}, []);
  /* FETCH ALL DATA */
  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const requests = Object.entries(CATEGORIES).map(async ([key, url]) => {
          const res = await axios.get(`${API}${url}`);
          const safeData = Array.isArray(res.data) ? res.data : [];
          return [key, safeData];
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
    (Array.isArray(items) ? items : []).map((item) => ({
      ...item,
      __type: type,
    })),
  )
  .sort((a, b) => {
    const priorityMap = {
      premium: 1,
      vip: 2,
      
      free: 3,
    };

    const aType = (a.priorityType || "free").toLowerCase();
    const bType = (b.priorityType || "free").toLowerCase();

    // 1. priority (VIP ən yuxarı)
    const priorityDiff =
      (priorityMap[aType] || 3) - (priorityMap[bType] || 3);

    if (priorityDiff !== 0) return priorityDiff;

    // 2. newest first
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const visibleAds = allAds.slice(0, visibleCount);

// ------count say --
// useEffect(() => {
//   axios.get(`${API}/api/count/cars`).then(res => console.log(res.data.count));
//   axios.get(`${API}/api/count/electronika`).then(res => console.log(res.data.count));
//   axios.get(`${API}/api/count/clothing`).then(res => console.log(res.data.count));
//   axios.get(`${API}/api/count/realEstate`).then(res => console.log(res.data.count));
//   axios.get(`${API}/api/count/phone`).then(res => console.log(res.data.count));
//   axios.get(`${API}/api/count/homeGarden`).then(res => console.log(res.data.count));
// axios.get(`${API}/api/count/Household`).then(res => console.log(res.data.count));
// axios.get(`${API}/api/count/accessories`).then(res => console.log(res.data.count));
// }, []);



const items = [
  { key: "car", label: "Avtomobil" },
  { key: "electronics", label: "Elektronika" },
  { key: "clothing", label: "Geyim" },
  { key: "accessory", label: "Aksesuar" },
  { key: "household", label: "Məişət" },
  { key: "homeGarden", label: "Ev və bağ üçün" },
  { key: "phone", label: "Telefon" },
  { key: "realEstate", label: "Evlər" },
];

useEffect(() => {
  const fetchCounts = async () => {
    try {
      const res = await axios.get(`${API}/api/countSay/counts`);
      setCounts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchCounts();
}, []);
// --------

  /* INFINITE SCROLL */
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 300
      ) {
        setVisibleCount((prev) =>
          prev >= allAds.length ? prev : prev + ITEMS_PER_LOAD,
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
        const res = await axios.get(`${API}${url}`);
        const safeData = Array.isArray(res.data) ? res.data : [];
        return safeData.map((i) => ({ ...i, source: key }));
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
          .some((v) => v.toLowerCase().includes(q)),
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

  /* FETCH ANNOUNCEMENTS */
useEffect(() => {
  const fetchAllModels = async () => {
    try {
      const token = localStorage.getItem("token");

      // bütün modellərin endpointləri
     
      // bütün modellərdən paralel fetch
      const requests = models.map((model) =>
        axios
          .get(`${API}/api/${model}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) =>
            Array.isArray(res.data)
              ? res.data.map((item) => ({ ...item, __type: model }))
              : []
          )
          .catch(() => [])
      );

      const results = await Promise.all(requests);

      // flatten: bütün elanları tək array-də birləşdir
      let allAds = results.flat();

      // yalnız VIP və PREMIUM elanları seç
      const paidAds = allAds.filter(
        (item) =>
          item.priorityType?.toLowerCase() === "vip" ||
          item.priorityType?.toLowerCase() === "premium"
      );

      // VIP / PREMIUM ön sıraya
      const sorted = paidAds.sort((a, b) => {
        const priority = { vip: 2, premium: 1 };
        const aPr = priority[a.priorityType?.toLowerCase()] || 0;
        const bPr = priority[b.priorityType?.toLowerCase()] || 0;
        if (aPr !== bPr) return bPr - aPr;

        // əgər priority eyni olarsa, tarixə görə sortla
        return new Date(b.data) - new Date(a.data);
      });

      setAnnouncements(sorted);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  fetchAllModels();
}, []);

  // const handleUpgrade = async (listingId, type) => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     const { data } = await axios.post(
  //       `${API}/api/payments/create-checkout/${listingId}`,
  //       { type },
  //       { headers: { Authorization: `Bearer ${token}` } },
  //     );

  //     window.location.href = data.url;
  //   } catch (err) {
  //     console.log(err.response?.data || err.message);
  //   }
  // };


  const handleUpgrade = async (listingId, type) => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.post(
      `${API}/api/payments/create-checkout/${listingId}`,
      { type },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    window.location.href = data.url;
  } catch (err) {
    console.log(err.response?.data || err.message);

    // 🔥 BURADA MODAL ÇIXIR
    Swal.fire({
      icon: "error",
      title: "Xəta",
      text:
        err.response?.data?.message ||
        "Siz bu elanı yüksəldə bilməzsiniz",
      confirmButtonText: "Bağla",
    });
  }
};
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

  /* RENDER */
  return (
  
      
    <div className="min-h-screen max-w-[1200px] mx-auto mt-[80px] mb-10">
    <div className="fixed left-0 top-1/2 -translate-y-1/2 w-[120px] space-y-3 z-50">
  {(Array.isArray(stickyAds) ? stickyAds : [])
    .filter(a => a.position === "left")
    .map(ad => (
      <a href={ad.link} key={ad._id}>
        <img
          src={`${API}/uploads/${ad.image}`}
          className="w-full rounded shadow" alt={ad._id}
        />
      </a>
    ))}
</div>
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
            <Link key={item._id} to={`${item.source}/${item._id}`}>
              <div className="border rounded shadow p-2">
                <img
                  src={item.images?.[0] || "/no-image.jpg"}
                  className="h-[100px] w-full object-cover"
                  alt={item._id}
                />
                <p className="font-bold">{item.price} AZN</p>
                <p className="text-xs">{item.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Katalog className="mt-1" width="100%" height="60px" marginTop="10px" />

 

<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-52">
  {items.map((item) => (
    <div
      key={item.key}
      className="p-4 rounded-xl shadow-md bg-gradient-to-r from-blue-500 to-blue-700 text-white"
    >
      <h3 className="text-lg font-semibold">{item.label}</h3>
      <p className="text-2xl font-bold">
        {counts[item.key] || 0}
      </p>
      <span className="text-sm opacity-80">ümumi elan</span>
    </div>
  ))}
</div>

      <div className="flex justify-center mt-4 border-t rounded-[10px] border-blue-700 border-[10px] "></div>

      {/* CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-[120px] sm:mt-[20px] justify-items-center ">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : visibleAds.map((item) => (
              <div
                key={item._id}
                className="relative "
              >
                <Link  to={`/${item.__type}/${item._id}`}>
                  <div className="z-1 shadow-sm bg-white border-[1px] border-blue-500 border-shadow sm:w-[229px] sm:h-[268.75px] rounded-[8px] hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden flex flex-col">
                    {/* ICONS */}
                    <div className="absolute top-2 left-2 flex gap-2 z-10">
                      {item?.car?.barter && (
                        <div className="w-6 h-6 flex items-center justify-center bg-green-500 rounded-full text-white">
                          <RefreshCcw size={16} strokeWidth={1.5} />
                        </div>
                      )}
                      {item?.car?.credit && (
                        <div className="w-6 h-6 flex items-center justify-center bg-orange-500 rounded-full text-white">
                          <Percent size={16} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>

                    {/* IMAGE */}
                    <div className="relative sm:w-[229px] w-[178px] h-[129px] sm:h-[170.75px] overflow-hidden rounded-[4px]">

  <img
    src={item.images?.[item.images.length - 1] || "/no-image.jpg"}
    className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
    alt={
      item.title ||
      item.brand ||
      item.model ||
      item.category ||
      item._id ||
      item.id ||
      item.ban_type
    }
  />

  {/* VIP / PREMIUM badge */}
  {item.priorityType && item.priorityType !== "free" && (
    <span
      className={`z-20 px-2 py-1 text-xs rounded absolute bottom-2 right-2 flex items-center gap-1
      ${
        item.priorityType.toLowerCase() === "premium"
          ? "bg-yellow-400 text-black shadow-md"
          : "bg-blue-600 text-white"
      }`}
    >
      {/* Icon */}
      {item.priorityType.toLowerCase() === "vip" && (
        <span className="material-icons text-[16px]">diamond</span>
      )}

      {item.priorityType.toLowerCase() === "premium" && (
        <span className="material-icons text-[16px]">workspace_premium</span>
      )}

      {/* Text */}
      <span className="capitalize">
        {item.priorityType}
      </span>
    </span>
  )}

  {/* Car magazine label */}
  {item?.car?.type_magasine && (
    <div className="absolute p-1 bottom-2 left-2 bg-blue-600 text-white text-xs sm:text-sm rounded">
      {typeLabels?.[item.car.type_magasine] || item.car.type_magasine}
    </div>
  )}

</div>

                    {/* CONTENT */}
                    <div className="w-[173px] h-[96.6px] sm:w-[229px] sm:h-[98px] p-2">
                      <div className="font-bold text-[16px] sm:text-[18px]">
                        {item.price} AZN ₼
                      </div>
                      <div className="text-[12px] sm:text-[16px]">
                        {item.brand ||
                          item.category ||
                          item.model ||
                          item.title}
                      </div>
                      {item.year && item.motor && item.km && (
                        <div className=" text-[12px] sm:text-[16px]">
                          {item.year}, {item.motor}, {item.km} km
                        </div>
                      )}
                    <div className="flex justify-between items-center text-gray-600 mt-2 text-xs sm:text-sm">
                <span className="flex items-center gap-1">
                  <MapPin size={14} color="#75FC56" />
                  {item.location}
                </span>
                {/* <span className="truncate">
                  {formatDate(item.data)} {getCurrentTime(item.data)}
                </span> */}
                   <span className="capitalize text-[12px] p-1 rounded flex justify-between text-gray-600 truncate w-30">
  {formatDate(item.createdAt)} {getCurrentTime(item.createdAt)}
</span>
              </div>
                    </div>
                  </div>
                </Link>

                {/* UPGRADE BUTTONS */}
                <div className="flex justify-between top-1 items-center mt-2">
                  <button
                    className="border-[1px] border-gray-300 min-w-[10px] max-w-[100px] text-blue-500 hover:border-blue-500 ease-in-out transition-transform duration-300  py-1 px-3 rounded"
                    onClick={() => handleUpgrade(item._id, "vip")}
                  >
                    VIP Et
                  </button>
                  <button
                    className="border-[1px] border-gray-300 text-blue-500 hover:border-blue-500 ease-in-out transition-transform duration-300 py-1 px-3  rounded"
                    onClick={() => handleUpgrade(item._id, "premium")}
                  >
                    Premium Et
                  </button>
                </div>

                {/* FAVORITE */}
                <button
                  onClick={() => toggleFavorite(item)}
                  className="absolute top-2 right-2"
                  aria-label="toggleFavoriteButton"
                >
                  <Heart
                    size={22}
                    fill={
                      favorites.some((f) => f._id === item._id)
                        ? "red"
                        : "rgba(0,0,0,0.4)"
                    }
                    color="#fff"
                  />
                </button>
              </div>
            ))}
      </div>
<div className="fixed right-0 top-1/2 -translate-y-1/2 w-[120px] space-y-3 z-50">
  {(Array.isArray(stickyAds) ? stickyAds : [])
    .filter(a => a.position === "right")
    .map(ad => (
      <a href={ad.link} key={ad._id}>
        <img
          src={`${API}/uploads/${ad.image}`}
          className="w-full rounded shadow"
          alt={ad._id}
        />
      </a>
    ))}
</div>
      <BottomMenu />
    </div>
    
  );
};

export default Home;
