
// ----------------------- Home.jsx ---------------------------
import React, { useEffect, useState, lazy, Suspense} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Heart, RefreshCcw, Percent, MapPin } from "lucide-react";
import { getCardData } from "../../utils/postHelpers";


import { Helmet } from "react-helmet-async";
import '../../styles/home_style.css'

import { useSearchParams } from "react-router-dom";
import { Gem } from "lucide-react";
import { Crown } from "lucide-react";

const Katalog = lazy(() =>import("../Katalog"));
const BottomMenu = lazy(() =>
  import("../../components/MobileMenu")
);

const API = process.env.REACT_APP_API_URL || "https://my-backend-wj5g.onrender.com";









const ITEMS_PER_LOAD = 8;

const CATEGORIES = {
  car: "/api/car",
  homeGarden: "/api/homeGarden",
  electronics: "/api/electronics",
  accessory: "/api/accessory",
  realEstate: "/api/realEstate",
  household: "/api/Household",
  phone: "/api/phone",
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
  const[ post, setPost] = useState({})


  const [brands, setBrands] = useState([]);
const [models, setModels] = useState([]);
const [motors, setMotors] = useState([]);

const brand = post?.car?.brand;
const model = post?.car?.model;
const [searchParams] = useSearchParams();



const cardData = getCardData(post);

const [filters1, setFilters1] = useState({
  category: "all",
  priceMin: "",
  priceMax: "",
  city: "",
  type: "all",

  // CAR
  brand: "",
  model: "",
  yearMin: "",
  yearMax: "",
  color: "",
  fuel: "",
  motor: "",
  credit: false,
  barter: false,
});


 



  //  const models = [
  //       "accessory",
  //       "electronics",
  //       "clothing",
  //       "homeGarden",
  //       "phone",
  //       "realEstate",
  //       "Household",
  //       "car",
  //     ];

useEffect(() => {
  axios.get(`${API}/api/brand`, {
    params: {
      brand,
      model,
    },
  })
  .then(res => setPost(res.data))
  .catch(console.error);

}, [brand, model]);
// ----axtarış filter
console.log(`${API}/api/filter/brands`);
useEffect(() => {
  axios
    .get(`${API}/api/filter/brands`)
    .then((res) => setBrands(res.data));
}, []);

useEffect(() => {
  if (!filters1.brand) {
    setModels([]);
    return;
  }

  axios
    .get(`${API}/api/filter/models`, {
      params: {
        brand: filters1.brand,
      },
    })
    .then((res) => setModels(res.data));
}, [filters1.brand]);

useEffect(() => {
  if (!filters1.brand || !filters1.model) {
    setMotors([]);
    return;
  }

  axios
    .get(`${API}/api/filter/motors`, {
      params: {
        brand: filters1.brand,
        model: filters1.model,
      },
    })
    .then((res) => setMotors(res.data));
}, [filters1.brand, filters1.model]);


  
const typeLabels = {
  magaza: "Salon",
  sifarisle: "Sifarişlə",
  resmi: "Rəsmi",
};



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



 

const allAds = Object.entries(data)
  .flatMap(([type, items]) =>
    (Array.isArray(items) ? items : []).map((item) => ({
      ...item,
      __type: type,
    }))
  )
  .filter((item) => {
    const price = Number(item.price || 0);

    // Category
    if (
      filters1.category !== "all" &&
      item.__type !== filters1.category
    )
      return false;

    // Price
    if (filters1.priceMin && price < Number(filters1.priceMin))
      return false;

    if (filters1.priceMax && price > Number(filters1.priceMax))
      return false;

    // City
    if (
      filters1.city &&
      !item.location
        ?.toLowerCase()
        .includes(filters1.city.toLowerCase())
    )
      return false;

    // Priority
    if (filters1.type !== "all") {
      const type = (item.priorityType || "free").toLowerCase();

      if (type !== filters1.type) return false;
    }

    // Car Filters
    if (item.__type === "car") {
      if (
        filters1.brand &&
        item?.car?.brand !== filters1.brand
      )
        return false;

      if (
        filters1.model &&
        item?.car?.model !== filters1.model
      )
        return false;

      if (
        filters1.motor &&
        item?.car?.motor !== filters1.motor
      )
        return false;

      if (
        filters1.yearMin &&
        Number(item?.car?.year) <
          Number(filters1.yearMin)
      )
        return false;

      if (
        filters1.yearMax &&
        Number(item?.car?.year) >
          Number(filters1.yearMax)
      )
        return false;

      if (
        filters1.color &&
        item?.car?.color !== filters1.color
      )
        return false;

      if (
        filters1.fuel &&
        item?.car?.fuel !== filters1.fuel
      )
        return false;

      if (filters1.credit && !item?.car?.credit)
        return false;

      if (filters1.barter && !item?.car?.barter)
        return false;
    }

    return true;
  })
  .sort((a, b) => {
    const priorityOrder = {
      premium: 3,
      vip: 2,
      free: 1,
    };

    const aPriority =
      priorityOrder[
        (a.priorityType || "free").toLowerCase()
      ] || 1;

    const bPriority =
      priorityOrder[
        (b.priorityType || "free").toLowerCase()
      ] || 1;

    // Premium -> VIP -> Free
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }

    // Eyni priority-də ən yeni əvvəl
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

const visibleAds = allAds.slice(0, visibleCount);



useEffect(() => {
  const timer = setTimeout(() => {
    axios.get(`${API}/api/ads/sticky`)
      .then((res) => {
        setStickyAds(Array.isArray(res.data) ? res.data : []);
      });
  }, 1500);

  return () => clearTimeout(timer);
}, []);

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
      const cached = sessionStorage.getItem("counts");

      if (cached) {
        setCounts(JSON.parse(cached));
        return;
      }

      const res = await axios.get(`${API}/api/countSay/counts`);

      setCounts(res.data);

      sessionStorage.setItem(
        "counts",
        JSON.stringify(res.data)
      );
    } catch (err) {
      console.log(err);
    }
  };

  fetchCounts();
}, []);


useEffect(() => {
  const onScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 300
    ) {
      setVisibleCount((prev) =>
        prev >= allAds.length
          ? prev
          : prev + ITEMS_PER_LOAD
      );
    }
  };

  window.addEventListener("scroll", onScroll);

  return () =>
    window.removeEventListener("scroll", onScroll);
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
 

  const q = query.toLowerCase();

  const filtered = allAds.filter((item) =>
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


 const optimizeImage = (url) => {
  if (!url || !url.includes("cloudinary")) return url;

  return url.replace(
    "/upload/",
    "/upload/f_auto,q_auto,w_400,h_250,c_fill/"
  );
};


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
    const Swal = (await import("sweetalert2")).default;

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


const getCardInfo = (item) => {
  switch (item.category) {
    case "car":
    return (
  <>
    <div className="font-semibold">
      {item?.car?.brand} {item?.car?.model}
    </div>

    <div>
      {[
        item?.car?.year,
        item?.car?.motor && `${item.car.motor} L`,
        item?.car?.km && `${item.car.km} km`,
      ]
        .filter(Boolean)
        .join(", ")}
    </div>
  </>
);

    case "phone":
      return [
        item?.model,
        item?.storage,
        item?.ram,
        item?.color,
      ]
        .filter(Boolean)
        .join(", ");

    case "electronics":
      return [
        item?.title,
        item?.type,
        item?.brand,
        item?.model,
      ]
        .filter(Boolean)
        .join(", ");

    case "realEstate":
      return [
        item?.realEstate?.rooms &&
          `${item.realEstate.rooms} otaq`,
        item?.realEstate?.area &&
          `${item.realEstate.area} m²`,
        item?.realEstate?.floor &&
          `${item.realEstate.floor}-ci mərtəbə`,
      ]
        .filter(Boolean)
        .join(", ");

    case "clothing":
      return item?.brand || "";

    case "homeGarden":
      return item?.brand || "";

    case "household":
      return item?.brand || "";

    case "accessory":
      return [
        item?.brand,
        item?.model,
        item?.title,
      ]
        .filter(Boolean)
        .join(" ");

    default:
      return "";
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



<div className="bg-white p-4 rounded-xl shadow mb-4">






  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">

    <select
      className="border p-2 rounded"
      value={filters1.category}
      onChange={(e) =>
        setFilters1({
          ...filters1,
          category: e.target.value,
        })
      }
    >
      <option value="all">Bütün kateqoriyalar</option>
      <option value="car">Avtomobil</option>
      <option value="electronics">Elektronika</option>
      <option value="phone">Telefon</option>
      <option value="realEstate">Əmlak</option>
      <option value="clothing">Geyim</option>
      <option value="accessory">Aksesuar və Ehtiyyat hissələri</option>
      <option value="household">Məişət texnikası</option>
      <option value="homeGarden">Ev və Bağ Məhsulları</option>
    </select>

    <input
      type="number"
      placeholder="Min qiymət"
      className="border p-2 rounded"
      onChange={(e) =>
        setFilters1({
          ...filters1,
          priceMin: e.target.value,
        })
      }
    />

    <input
      type="number"
      placeholder="Max qiymət"
      className="border p-2 rounded"
      onChange={(e) =>
        setFilters1({
          ...filters1,
          priceMax: e.target.value,
        })
      }
    />

    <input
      placeholder="Şəhər"
      className="border p-2 rounded"
      onChange={(e) =>
        setFilters1({
          ...filters1,
          city: e.target.value,
        })
      }
    />

    <select
      className="border p-2 rounded"
      value={filters1.type}
      onChange={(e) =>
        setFilters1({
          ...filters1,
          type: e.target.value,
        })
      }
    >
      <option value="all">Bütün elanlar</option>
      <option value="vip">VIP</option>
      <option value="premium">Premium</option>
      <option value="free">Adi</option>
    </select>

  </div>
  <div className="flex gap-2 bg-white mt-2">
      <select className="p-2 rounded-[2px] border shadow-sm"
    value={filters1.brand}
    onChange={(e)=>
        setFilters1({
            ...filters1,
            brand:e.target.value,
            model:"",
            motor:"",
            color: "",
        })
    }
>
<option value="">Marka</option>

{brands.map((brand)=>(
<option key={brand} value={brand}>
{brand}
</option>
))}

</select>


{filters1.brand && (
<select className="p-2 rounded-[2px] border shadow-sm"
    value={filters1.model}
    onChange={(e)=>
        setFilters1({
            ...filters1,
            model:e.target.value,
            motor:""
        })
    }
>
<option value="">Model</option>

{models.map((model)=>(
<option key={model} value={model}>
{model}
</option>
))}

</select>
)}

{filters1.model && (
<select className="p-2 rounded-[2px] border shadow-sm"
    value={filters1.motor}
    onChange={(e)=>
        setFilters1({
            ...filters1,
            motor:e.target.value
        })
    }
>
<option value="">Motor</option>

{motors.map((motor)=>(
<option key={motor} value={motor}>
{motor}
</option>
))}

</select>
)}


  <div className="flex gap-2 mb-3">
 

   
 
<button
  onClick={() => {
    setQuery("");

    setFilters1({
      category: "all",
      priceMin: "",
      priceMax: "",
      city: "",
      type: "all",
      brand: "",
      model: "",
      yearMin: "",
      yearMax: "",
      color: "",
      fuel: "",
      motor: "",
      credit: false,
      barter: false,
    });

    setResults([]);
  }}
  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
>
  Filtrləri Sıfırla
</button>

  </div>
</div>

</div>
 

      {loadingSearch && (
        <Typography align="center">
          <CircularProgress /> Axtarılır...
        </Typography>
      )}

      {!loadingSearch && results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {visibleAds.map((item, index) => (
            <Link key={item._id} to={`${item.source}/${item._id}`}>
              <div className="border rounded shadow p-2">
        


<img
 src={optimizeImage(
    item.images?.[item.images.length - 1] || "/no-image.jpg"
  )}
  loading={index < 10 ? "eager" : "lazy"}
  fetchPriority={index < 3 ? "high" : "auto"}
  decoding="async"
  className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
  alt={item.title || item.brand || item.model}

/>
                <p className="font-bold">{item.price} AZN</p>
                <p className="text-xs">{item.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

     

<Suspense fallback={null}>
  <div className="w-full max-w-[1200px] h-[150px]">
    <Katalog />
  </div>
</Suspense>



      {/* CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-[10px] sm:mt-[100px] justify-items-center ">

        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : visibleAds.map((item) => (
              <div
                key={item._id}
                className="relative "
              >
                <Link  to={`/${item.__type}/${item._id}`}>
                  <div className="z-1  bg-transparent    sm:w-[230.5px] sm:h-[268.75px] rounded-[8px] hover:shadow-xl  duration-300 ease-in-out overflow-hidden flex flex-col">
                    {/* ICONS */}
               


                    {/* <div className="absolute top-2 left-2 flex gap-2 z-10">
  {item?.car?.barter === "Bəli" && (
    <div className="w-6 h-6 flex items-center justify-center bg-green-500 rounded-full text-white">
      <RefreshCcw size={16} strokeWidth={1.5} />
    </div>
  )}

  {item?.car?.credit === "Bəli" && (
    <div className="w-6 h-6 flex items-center justify-center bg-orange-500 rounded-full text-white">
      <Percent size={16} strokeWidth={1.5} />
    </div>
  )}
</div> */}

{/* <div className="absolute top-2 left-2 flex gap-2 z-10">
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
</div> */}



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
    item.category
  }
  loading="lazy"
  decoding="async"
/>

  {/* VIP / PREMIUM badge */}
  {item.priorityType && item.priorityType !== "free" && (
    <span
      className={`z-20 px-2 py-1 text-xs rounded absolute bottom-2 right-2 flex items-center gap-1
      ${
        item.priorityType.toLowerCase() === "premium"
          ? "bg-white text-red-500 shadow-md"
          : "bg-white text-blue-600"
      }`}
    >
      {/* Icon */}
      {item.priorityType.toLowerCase() === "vip" && (
       
        <Gem size={16} />
      )}

      {item.priorityType.toLowerCase() === "premium" && (
        
        <Crown size={16} />
      )}

    
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
                    <div className="w-[173px] h-[110.6px] sm:w-[229px] sm:h-[118px] p-2">
                      <div className="font-bold text-[16px] sm:text-[18px]">
                        {item.price} AZN ₼
                      </div>
                   
                   
                      <div>
  <span className="h-[13px] text-[12px] sm:text-[16px] truncate">
    {getCardInfo(item)}
  </span>
</div>
                    <div className="flex justify-between items-center  mt-4 text-xs sm:text-sm">
                <span className="flex items-center gap-1">
                  <MapPin size={14} color="#75FC56" />
                  {item.location}
                </span>
             
                   <span className="capitalize text-[12px] p-1 rounded flex justify-between   truncate w-30">
  {formatDate(item.createdAt)} {getCurrentTime(item.createdAt)}
</span>
              </div>
                    </div>
                  </div>
                </Link>

          
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
  

      <Suspense fallback={null}>
  <BottomMenu />
</Suspense>
    </div>
    
  );
};

export default Home;