import React, { useEffect, useState } from "react";
import Katalog from "../Katalog";
import axios from "axios";
import { Link } from "react-router-dom";
import BottomMenu from "../../components/MobileMenu";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Heart } from "lucide-react";
import { RefreshCcw, Percent, MapPin } from "lucide-react";
import Typography from "@mui/material/Typography";
const Home = () => {
  const [homeGarden, setHomeGarden] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [elektronikaPost, setElektronikaPost] = useState([]);
  const [realEstate, setRealEstate] = useState([]);
  const [Household, setHousehold] = useState([]);
  const [Phone, setPhone] = useState([]);
  const [Clothing, setClothing] = useState([]);
  const [cars, setCars] = useState([]);

  const ITEMS_PER_LOAD = 8;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  const allAds = [
    ...cars.map((i) => ({ ...i, __type: "cars" })),
    ...homeGarden.map((i) => ({ ...i, __type: "homeGarden" })),
    ...elektronikaPost.map((i) => ({ ...i, __type: "electronika" })),
    ...accessories.map((i) => ({ ...i, __type: "accessories" })),
    ...realEstate.map((i) => ({ ...i, __type: "realEstate" })),
    ...Household.map((i) => ({ ...i, __type: "household" })),
    ...Phone.map((i) => ({ ...i, __type: "phone" })),
    ...Clothing.map((i) => ({ ...i, __type: "clothing" })),
  ].sort((a, b) => new Date(b.data) - new Date(a.data));

  const visibleAds = allAds.slice(0, visibleCount);

  useEffect(() => {
    if (allAds.length === 0) return;

    const handleScroll = () => {
      const scrollBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 300;

      if (scrollBottom) {
        setVisibleCount((prev) => {
          if (prev >= allAds.length) return prev;
          return prev + ITEMS_PER_LOAD;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [allAds.length]);

  const [favorites, setFavorites] = useState([]);
  const [options, setOptions] = useState({
    kredit: false,
    barter: false,
  });

  const getAllSortedAds = () => {
    const allAds = [
      ...cars,
      ...homeGarden,
      ...elektronikaPost,
      ...accessories,
      ...realEstate,
      ...Household,
      ...Phone,
      ...Clothing,
    ];

    // tarixə görə (ən yenisi əvvəldə)
    return allAds.sort((a, b) => new Date(b.data) - new Date(a.data));
  };

  // LocalStorage-dan favorites oxumaq
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
  }, []);

  const toggleFavorite = (item) => {
    let updatedFavorites;
    if (favorites.find((fav) => fav._id === item._id)) {
      // Silmək
      updatedFavorites = favorites.filter((fav) => fav._id !== item._id);
    } else {
      // Əlavə etmək
      updatedFavorites = [...favorites, item];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // useEffect(() => {
  //   const fetchCars = async () => {
  //     try {
  //       const res = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/api/cars`
  //       );
  //       setCars(res.data);
  //     } catch (err) {
  //       console.error("Elanlar yüklənmədi:", err);
  //     }
  //   };

  //   fetchCars();
  // }, []);

  // useEffect(() => {
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/api/homGarden`)
  //     .then((res) => {
  //       setHomeGarden(res.data);
  //     })
  //     .catch((err) => {
  //       console.error("Xəta baş verdi:", err);
  //     });
  // }, []);

  // useEffect(() => {
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/api/electronika`)
  //     .then((res) => {
  //       setElektronikaPost(res.data);
  //     })
  //     .catch((err) => {
  //       console.error("Xəta baise verdi:", err);
  //     });
  // }, []);

  // useEffect(() => {
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/api/accessories`)
  //     .then((res) => {
  //       setAccessories(res.data);
  //     })
  //     .catch((err) => {
  //       console.error("Xəta baise verdi:", err);
  //     });
  // }, []);

  // useEffect(() => {
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/api/realEstate`)
  //     .then((res) => {
  //       setRealEstate(res.data);
  //     })
  //     .catch((err) => {
  //       console.error("Xəta baise verdi:", err);
  //     });
  // }, []);

  // useEffect(() => {
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/api/Household`)
  //     .then((res) => {
  //       setHousehold(res.data);
  //     })
  //     .catch((err) => {
  //       console.error("Xəta baise verdi:", err);
  //     });
  // }, []);

  // useEffect(() => {
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/api/Phone`)
  //     .then((res) => {
  //       setPhone(res.data);
  //     })
  //     .catch((err) => {
  //       console.error("Xəta baise verdi:", err);
  //     });
  // }, []);

  // useEffect(() => {
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/api/Clothing`)
  //     .then((res) => {
  //       setClothing(res.data);
  //     })
  //     .catch((err) => {
  //       console.error("Xəta baise verdi:", err);
  //     });
  // }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const [
          carsRes,
          homeGardenRes,
          elektronikaRes,
          accessoriesRes,
          realEstateRes,
          householdRes,
          phoneRes,
          clothingRes,
        ] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/cars`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/homGarden`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/electronika`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/accessories`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/realEstate`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/Household`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/Phone`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/Clothing`),
        ]);

        setCars(carsRes.data);
        setHomeGarden(homeGardenRes.data);
        setElektronikaPost(elektronikaRes.data);
        setAccessories(accessoriesRes.data);
        setRealEstate(realEstateRes.data);
        setHousehold(householdRes.data);
        setPhone(phoneRes.data);
        setClothing(clothingRes.data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

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

  const getCurrentTime = (isoString) => {
    const date = new Date(isoString);
    const time = date.toTimeString().split(" ")[0].slice(0, 5);
    return time;
  };

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrls = [
    { url: `${process.env.REACT_APP_API_URL}/api/cars`, source: "cars" },
    { url: `${process.env.REACT_APP_API_URL}/api/homGarden`, source: "homGarden" },
    { url: `${process.env.REACT_APP_API_URL}/api/electronika`, source: "electronika" },
    { url: `${process.env.REACT_APP_API_URL}/api/accessories`, source: "accessories" },
    { url: `${process.env.REACT_APP_API_URL}/api/realEstate`, source: "realEstate" },
    { url: `${process.env.REACT_APP_API_URL}/api/Household`, source: "Household" },
    { url: `${process.env.REACT_APP_API_URL}/api/Phone`, source: "Phone" },
    { url: `${process.env.REACT_APP_API_URL}/api/Clothing`, source: "Clothing" },
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      // Bütün API-ləri eyni vaxtda çağıraq
      const requests = apiUrls.map((item) => axios.get(item.url));
      const responses = await Promise.allSettled(requests);

      // Məlumatları toplamaq
      let allData = [];
      responses.forEach((res, index) => {
        if (res.status === "fulfilled" && Array.isArray(res.value.data)) {
          const withSource = res.value.data.map((item) => ({
            ...item,
            source: apiUrls[index].source,
          }));
          allData = allData.concat(withSource);
        }
      });

      // Axtarış filtrləməsi
      const q = query.toLowerCase();
      const filtered = allData.filter((item) =>
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
          .some((field) => field.toLowerCase().includes(q))
      );

      setResults(filtered);
    } catch (err) {
      console.error("Axtarış xətası:", err);
    } finally {
      setLoading(false);
    }
  };


  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const [
          carsRes,
          homeGardenRes,
          elektronikaRes,
          accessoriesRes,
          realEstateRes,
          householdRes,
          phoneRes,
          clothingRes,
        ] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/cars`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/homGarden`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/electronika`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/accessories`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/realEstate`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/Household`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/Phone`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/Clothing`),
        ]);

        setCars(carsRes.data);
        setHomeGarden(homeGardenRes.data);
        setElektronikaPost(elektronikaRes.data);
        setAccessories(accessoriesRes.data);
        setRealEstate(realEstateRes.data);
        setHousehold(householdRes.data);
        setPhone(phoneRes.data);
        setClothing(clothingRes.data);
      } catch (err) {
        console.error("API xətası:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  const [ads, setAds] = useState([]);

  const fetchAds = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/ads`);
      setAds(res.data);
    } catch (err) {
      console.error("Reklamları gətirərkən xəta:", err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [ ads ]);

  // Pagination üçün state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Bütün elanları birləşdiririk
  // const allAds = [
  //   ...cars,
  //   ...homeGarden,
  //   ...elektronikaPost,
  //   ...accessories,
  //   ...realEstate,
  //   ...Household,
  //   ...Phone,
  //   ...Clothing,
  // ].sort((a, b) => new Date(b.data) - new Date(a.data));

  // Cari səhifədə göstəriləcək elanlar
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAds = allAds.slice(indexOfFirstItem, indexOfLastItem);


  
  return (
    <div className="min-h-screen max-w-[1000px] mx-auto mb-10 mt-10">
      <div className="flex  justify-between gap-4 mt-5">
        <div className="flex-1 ">
          <div className="max-w-5xl mx-auto p-4  gap-4">
            <div className="flex justify-center  mx-auto my-auto  "></div>
          </div>
          {/* <BottomMenu /> */}
          <main className="  min-h-screen w-full mx-auto ">
            <div className="mt-[18px] "></div>
            <div className="relative">
             <div className="w-full">
      {/* Axtarış input */}
      <div className="relative w-full">
        <input
          className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-[10px] pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          placeholder="Axtar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter"  && handleSearch()}
          
         
        />
        <button
          className="absolute top-1 right-1 flex items-center rounded bg-green-500 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-blue-700 focus:shadow-none active:bg-slate-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          onClick={handleSearch}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 mr-2"
          >
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
              clipRule="evenodd"
            />
          </svg>
          Axtar
        </button>
      </div>

      {/* Nəticələr */}
      <div className="mt-4">
        {loading && (
          <Typography align="center"  color="text.secondary">
            <CircularProgress />
            Axtarış aparılır...
          </Typography>
        )}

    


        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {results.map((item) => {
              const id = item._id || item.id;
              return (
                <Link key={id} to={`/ads/${(item.source)}/${id}`}>
                  <div className="border w-[185.7px] h-[222.6px] rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer">
                    <img
                      src={item.images?.[0] || item.imageUrls?.[0] || "/placeholder.png"}
                      alt={item.title || "Image"}
                      className="w-full h-[100px] object-cover"
                    />
                    <div className="p-3">
                      <h2 className="text-sm font-bold text-green-600">
                        {item.price} AZN
                      </h2>
                      <h3 className="text-xs font-semibold line-clamp-2">
                        {item.title} {item.brand} {item.model}
                      </h3>
                      <p className="text-gray-500 text-xs">
                        {item.city || item.location}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>

              
              <div className=" border bg-slate-400 h-[1px] mb-6 w-full"></div>
            </div>
            <Katalog />
            <div className=" border bg-slate-400 h-[1px] mb-6 w-full"></div>
            <div className="mt-4 p-4 mb-10  grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 place-items-center  shadow-b-md bg-white rounded-lg">
              {isLoading ? (
                Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className=" w-[185.7px] h-[222.6px]  max-w-[220.4px] max-h-[268.8px] rounded-2xl shadow-md bg-gradient-to-r from-teal-900 via-gray-400 to-teal-900 animate-[shimmer_1.5s_infinite]"
                  >
                    <div className=" w-[185.7px] sm:w-[225.7px] md:w-[225.7px] lg:w-[225.7px] mb-10 h-[229.6px] bg-white rounded-2xl shadow-md ">
                      <div className="w-full h-[100px] rounded-t-[8px] mb-2 bg-gradient-to-r from-teal-900 via-gray-400 to-teal-900 animate-shimmer"></div>
                      <div className="p-1">
                        <div className="h-6 bg-gradient-to-r from-teal-900 via-gray-400 to-teal-900 rounded mb-1 w-3/4 animate-shimmerh-6 bg-teal-900 rounded mb-1 w-3/4 animate-shimmer"></div>
                        <div className="h-4 bg-gradient-to-r from-teal-900 via-gray-400 to-teal-900 rounded mb-1 w-2/3 animate-shimmer"></div>
                        <div className="h-4 bg-gradient-to-r from-teal-900 via-gray-400 to-teal-900 rounded w-1/2 animate-shimmer"></div>

                        <div className="flex items-center justify-between">
                          <div className="h-4 mt-4 bg-gradient-to-r from-teal-900 via-gray-400 to-teal-900 bg-teal-900 rounded w-1/4 animate-shimmer "></div>
                          <div className="h-4 mt-4 bg-gradient-to-r from-teal-900 via-gray-400 to-teal-900 bg-teal-900 rounded w-1/2 animate-shimmer "></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {visibleAds
                    .filter((item) => item.__type === "cars")
                    .map((car) => (
                      <div className="relative">
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          key={car.id}
                          to={`/cars/${car._id}`}
                        >
                          <div className="w-[185.7px] mb-10 h-[268.6px] sm:w-[268.75px] sm:h-[268.6px]   max-w-[240.4px] max-h-[368.8px] bg-gray-100 rounded-[20px]  hover:shadow-2xl transform shake  transition-all duration-100">
                            <div className="w-[185.7px] h-[229.6px] sm:w-[268.75px] sm:h-[268.6px] max-w-[240.4px] max-h-[150px] rounded-t-[8px] relative">
                              {car.salon && (
                                <p className="absolute top-[125px] z-50 left-2 bg-indigo-500 text-white text-[10px] font-500 p-1 rounded">
                                  {car.salon}
                                </p>
                              )}
                              <div className="flex justify-between z-50 gap-2">
                                <div className="absolute mt-1 w-full p-1 z-50 top-0 left-0 flex gap-2">
                                  {car.kredit && (
                                    <p className="w-[25px] bg-orange-500 h-[25px] p-1 justify-items-center  flex rounded-full text-white">
                                      {" "}
                                      <Percent
                                        size={16}
                                        strokeWidth={1.5}
                                        absoluteStrokeWidth
                                      />{" "}
                                    </p>
                                  )}
                                  {car.barter && (
                                    <p className="w-[25px] bg-green-500 h-[25px] p-1 justify-items-center  flex rounded-full text-white">
                                      <RefreshCcw
                                        size={16}
                                        strokeWidth={1.5}
                                        absoluteStrokeWidth
                                      />
                                    </p>
                                  )}
                                  {/* <p>{options.kredit && options.barter }</p> */}
                                </div>
                              </div>

                              <img
                                src={car.mainImage || car.images[0]}
                                alt={car.brand}
                                className="absolute top-0 left-0 w-full h-full object-cover rounded-t-[20px]"
                              />
                            </div>
                            <div className="p-2 ">
                              <h3 className="text-[12px] font-bold font-black text-black">
                                {car.price} AZN ₼
                              </h3>
                              <h2 className="text-[12px] truncate w-30">
                                {car.category}, {car.brand}, {car.model}
                              </h2>
                              <p className="text-gray-600 truncate w-30">
                                {car.year},{car.motor} {car.km} km
                              </p>
                              <div className="flex justify-between gap-1 mt-7 ">
                                <p className="text-[10px] p-1 rounded flex justify-between text-gray-600">
                                  <MapPin size={12} color="#75FC56" />{" "}
                                  {car.location}
                                </p>
                                <p className="capitalize text-[12px] p-1 rounded flex justify-between text-gray-600 truncate w-30">
                                  {formatDate(car.data)}{" "}
                                  {getCurrentTime(car.data)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                        <div className=" mt-1 w-full p-1 z-50 top-1 left-1 flex gap-2">
                          <button
                            onClick={() => toggleFavorite(car)}
                            className={`absolute   top-1 right-1 p-[2px] rounded-full`}
                          >
                            <Heart
                              fill={
                                favorites.find((fav) => fav._id === car._id)
                                  ? "red"
                                  : "none"
                              }
                              size={24}
                              color="#ffffff"
                              strokeWidth={1.75}
                            />
                          </button>
                        </div>
                      </div>
                    ))}

                  {visibleAds
                    .filter((item) => item.__type === "homeGarden")
                    .map((post) => (
                      <div className="relative">
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          key={post._id}
                          to={`/elan/${post._id}`}
                        >
                          <div
                            key={post._id}
                            className="w-[185.7px] h-[222.w-[185.7px] mb-10 h-[268.6px] sm:w-[268.75px] sm:h-[268.6px]   max-w-[240.4px] max-h-[368.8px] bg-gray-50 rounded-[5px] shadow-sm transform  transition-all duration-300"
                          >
                            <img
                              src={
                                post.images && post.images.length > 0
                                  ? post.images[0].startsWith("http")
                                    ? post.images[0]
                                    : `${process.env.REACT_APP_API_URL}/uploads/${post.images[0]}`
                                  : "/no-image.jpg"
                              }
                              alt={post.title}
                              className="w-full h-[147px] object-cover rounded-t-[8px]"
                            />
                            <div className="p-4">
                              <h3 className="text-[12px] font-bold text-black truncate w-30 ">
                                {post.price} AZN ₼
                              </h3>
                              <h2 className="text-[12px] font-bold truncate w-30">
                                {post.title}
                              </h2>

                              <div className="flex justify-between gap-1 mt-8 ">
                                <p className="text-[10px] rounded flex justify-between text-gray-600">
                                  <MapPin size={12} color="#75FC56" />{" "}
                                  {post.location}
                                </p>
                                <p className="capitalize text-[12px]  rounded flex justify-between text-gray-600 truncate w-30">
                                  {formatDate(post.data)}{" "}
                                  {getCurrentTime(post.data)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={() => toggleFavorite(post)}
                          className={`absolute top-1 right-1 p-[2px] rounded-full `}
                        >
                          <Heart
                            fill={
                              favorites.find((fav) => fav._id === post._id)
                                ? "red"
                                : "#cccccc"
                            }
                            size={24}
                            color="#ffffff"
                            strokeWidth={1.75}
                          />
                        </button>
                      </div>
                    ))}

                  {visibleAds
                    .filter((item) => item.__type === "electronika")
                    .map((item) => (
                      <div className="relative">
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          key={item._id}
                          to={`/PostDetailElectronika/${item._id}`}
                        >
                          <div
                            key={item._id}
                            className="w-[185.7px] h-[222.6w-[185.7px] mb-10 h-[268.6px] sm:w-[268.75px] sm:h-[268.6px]   max-w-[240.4px] max-h-[368.8px] bg-gray-50 rounded-[5px] shadow-sm transform  transition-all duration-300"
                          >
                            <img
                              src={
                                item.images?.[0]?.startsWith("http")
                                  ? item.images[0]
                                  : "/no-image.jpg"
                              }
                              alt={item.title}
                              className="w-full h-[147px] object-cover rounded-t-[8px]"
                            />
                            <div className="p-4">
                              <h3 className="text-xl font-bold text-black">
                                {item.price} AZN ₼
                              </h3>
                              <h2 className="text-[12px] font-bold truncate w-30">
                                {item.category}
                              </h2>
                              <h3 className="text-[12px] font-semibold truncate w-30">
                                {item.title}
                              </h3>
                              <div className="flex justify-between gap-1 mt-8 ">
                                <p className="text-[10px] rounded flex justify-between text-gray-600">
                                  <MapPin size={12} color="#75FC56" />{" "}
                                  {item.location}
                                </p>
                                <p className="capitalize text-[12px]  rounded flex justify-between text-gray-600 truncate w-30">
                                  {formatDate(item.data)}{" "}
                                  {getCurrentTime(item.data)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={() => toggleFavorite(item)}
                          className={`absolute top-1 right-1 p-[2px] rounded-full `}
                        >
                          <Heart
                            fill={
                              favorites.find((fav) => fav._id === item._id)
                                ? "red"
                                : "#cccccc"
                            }
                            size={24}
                            color="#ffffff"
                            strokeWidth={1.75}
                          />
                        </button>
                      </div>
                    ))}

                  {visibleAds
                    .filter((item) => item.__type === "accessories")
                    .map((item) => (
                      <div className="relative">
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          key={item._id}
                          to={`/PostDetailAcsesuar/${item._id}`}
                        >
                          <div
                            key={item._id}
                            className="w-[185.7px] h-[222.6pw-[185.7px] mb-10 h-[268.6px] sm:w-[268.75px] sm:h-[268.6px]   max-w-[240.4px] max-h-[368.8px] bg-gray-50 rounded-[5px] shadow-sm transform  transition-all duration-300"
                          >
                            <img
                              src={
                                item.images?.[0]?.startsWith("http")
                                  ? item.images[0]
                                  : "/no-image.jpg"
                              }
                              alt={item.title}
                              className="w-full h-[147px] object-cover rounded-t-[8px]"
                            />
                            <div className="p-4">
                              <h3 className="text-[12px] font-bold text-black">
                                {item.price} AZN ₼
                              </h3>
                              <h2 className="text-[12px] font-bold truncate w-30">
                                {item.category}
                              </h2>
                              <h3 className="text-[12px] font-semibold truncate w-30">
                                {item.title}
                              </h3>
                              <div className="flex justify-between gap-1 mt-8 ">
                                <p className="text-[10px] rounded flex justify-between text-gray-600">
                                  <MapPin size={12} color="#75FC56" />{" "}
                                  {item.location}
                                </p>
                                <p className="capitalize text-[12px]  rounded flex justify-between text-gray-600 truncate w-30">
                                  {formatDate(item.data)}{" "}
                                  {getCurrentTime(item.data)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={() => toggleFavorite(item)}
                          className={`absolute top-1 right-1 p-[2px] rounded-full `}
                        >
                          <Heart
                            fill={
                              favorites.find((fav) => fav._id === item._id)
                                ? "red"
                                : "#cccccc"
                            }
                            size={24}
                            color="#ffffff"
                            strokeWidth={1.75}
                          />
                        </button>
                      </div>
                    ))}

                  {visibleAds
                    .filter((item) => item.__type === "realEstate")
                    .map((item) => (
                      <div className="relative">
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          key={item._id}
                          to={`/PostRealEstate/${item._id}`}
                        >
                          <div
                            key={item._id}
                            className="w-[185.7px] mb-10 h-[268.6px] sm:w-[268.75px] sm:h-[268.6px]   max-w-[240.4px] max-h-[368.8px] bg-gray-50 rounded-[5px] shadow-sm transform  transition-all duration-300"
                          >
                            <img
                              src={
                                item.images?.[0]?.startsWith("http")
                                  ? item.images[0]
                                  : "/no-image.jpg"
                              }
                              alt={item.title}
                              className="w-full h-[147px] object-cover rounded-t-[8px]"
                            />
                            <div className="p-4">
                              <h3 className="text-[12px] font-bold text-black">
                                {item.price} AZN ₼
                              </h3>
                              <h2 className="text-[12px] font-bold truncate w-30">
                                {item.title_type}, {item.type_building},{" "}
                                {item.location}
                              </h2>

                              <div className="flex justify-between gap-1 mt-8 ">
                                <p className="text-[10px] rounded flex justify-between text-gray-600">
                                  <MapPin size={12} color="#75FC56" />{" "}
                                  {item.location}
                                </p>
                                <p className="capitalize text-[12px]  rounded flex justify-between text-gray-600 truncate w-30">
                                  {formatDate(item.data)}{" "}
                                  {getCurrentTime(item.data)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={() => toggleFavorite(item)}
                          className={`absolute top-1 right-1 p-[2px] rounded-full `}
                        >
                          <Heart
                            fill={
                              favorites.find((fav) => fav._id === item._id)
                                ? "red"
                                : "none"
                            }
                            size={24}
                            color="#ffffff"
                            strokeWidth={1.75}
                          />
                        </button>
                      </div>
                    ))}

                  {visibleAds
                    .filter((item) => item.__type === "household")
                    .map((item) => (
                      <div className="relative">
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          key={item._id}
                          to={`/PostDetailHousehold/${item._id}`}
                        >
                          <div
                            key={item._id}
                            className="w-[185.7px] mb-10 h-[268.6px] sm:w-[268.75px] sm:h-[268.6px]   max-w-[240.4px] max-h-[368.8px] bg-gray-50 rounded-[5px] shadow-sm transform  transition-all duration-300"
                          >
                            <img
                              src={
                                item.images?.[0]?.startsWith("http")
                                  ? item.images[0]
                                  : "/no-image.jpg"
                              }
                              alt={item.title}
                              className="w-full h-[147px] object-cover rounded-t-[8px]"
                            />
                            <div className="p-4">
                              <h3 className="text-[12px] font-bold text-black truncate w-30">
                                {item.price} AZN ₼
                              </h3>
                              <h2 className="text-[12px] font-bold truncate w-30">
                                {item.title}, {item.category}, {item.location}
                              </h2>

                              <div className="flex justify-between gap-1 mt-8 ">
                                <p className="text-[10px] rounded flex justify-between text-gray-600">
                                  <MapPin size={12} color="#75FC56" />{" "}
                                  {item.location}
                                </p>
                                <p className="capitalize text-[12px]  rounded flex justify-between text-gray-600 truncate w-30">
                                  {formatDate(item.data)}{" "}
                                  {getCurrentTime(item.data)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={() => toggleFavorite(item)}
                          className={`absolute top-1 right-1 p-[2px]  rounded-full `}
                        >
                          <Heart
                            fill={
                              favorites.find((fav) => fav._id === item._id)
                                ? "red"
                                : "#cccccc"
                            }
                            size={24}
                            color="#ffffff"
                            strokeWidth={1.75}
                          />
                        </button>
                      </div>
                    ))}

                  {visibleAds
                    .filter((item) => item.__type === "phone")
                    .map((item) => (
                      <div className="relative">
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          key={item._id}
                          to={`/PostDetailPhone/${item._id}`}
                        >
                          <div
                            key={item._id}
                            className="ww-[185.7px] mb-10 h-[268.6px] sm:w-[268.75px] sm:h-[268.6px]   max-w-[240.4px] max-h-[368.8px] bg-gray-50 rounded-[5px] shadow-sm transform  transition-all duration-300"
                          >
                            <img
                              src={
                                item.images?.[0]?.startsWith("http")
                                  ? item.images[0]
                                  : "/no-image.jpg"
                              }
                              alt={item.title}
                              className="w-full h-[147px] object-cover rounded-t-[8px]"
                            />
                            <div className="p-4">
                              <h3 className="text-xl font-bold text-black">
                                {item.price} AZN ₼
                              </h3>
                              <h2 className="text-[12px] font-bold truncate w-30">
                                {item.title}, {item.brand}, {item.model}
                              </h2>
                              <h3 className="text-[12px] font-semibold truncate w-30"></h3>
                              <div className="flex justify-between gap-1 mt-8 ">
                                <p className="text-[10px] rounded flex justify-between text-gray-600">
                                  <MapPin size={12} color="#75FC56" />{" "}
                                  {item.location}
                                </p>
                                <p className="capitalize text-[12px]  rounded flex justify-between text-gray-600 truncate w-30">
                                  {formatDate(item.data)}{" "}
                                  {getCurrentTime(item.data)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={() => toggleFavorite(item)}
                          className={`absolute top-1 right-1 p-[2px] rounded-full `}
                        >
                          <Heart
                            fill={
                              favorites.find((fav) => fav._id === item._id)
                                ? "red"
                                : "#cccccc"
                            }
                            size={24}
                            color="#ffffff"
                            strokeWidth={1.75}
                          />
                        </button>
                      </div>
                    ))}

                  {visibleAds
                    .filter((item) => item.__type === "clothing")
                    .map((item) => (
                      <div className="relative">
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          key={item._id}
                          to={`/PostDetailClothing/${item._id}`}
                        >
                          <div
                            key={item._id}
                            className="w-[185.7px] mb-10 h-[268.6px] sm:w-[268.75px] sm:h-[268.6px]   max-w-[240.4px] max-h-[368.8px] bg-gray-50 rounded-[5px] shadow-sm transform  transition-all duration-300"
                          >
                            <img
                              src={
                                item.images?.[0]?.startsWith("http")
                                  ? item.images[0]
                                  : "/no-image.jpg"
                              }
                              alt={item.title}
                              className="w-full h-[147px] object-cover rounded-t-[8px]"
                            />
                            <div className="p-4">
                              <h3 className="text-xl font-bold text-black">
                                {item.price} AZN ₼
                              </h3>
                              <h2 className="text-[12px] font-bold truncate w-30">
                                {item.title}, {item.brand}, {item.model}
                              </h2>
                              <h3 className="text-[12px] font-semibold truncate w-30"></h3>
                              <div className="flex justify-between gap-1 mt-8 ">
                                <p className="text-[10px] rounded flex justify-between text-gray-600">
                                  <MapPin size={12} color="#75FC56" />{" "}
                                  {item.location}
                                </p>
                                <p className="capitalize text-[12px]  rounded flex justify-between text-gray-600 truncate w-30">
                                  {formatDate(item.data)}{" "}
                                  {getCurrentTime(item.data)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={() => toggleFavorite(item)}
                          className={`absolute top-1 right-1 p-[2px] rounded-full `}
                        >
                          <Heart
                            fill={
                              favorites.find((fav) => fav._id === item._id)
                                ? "red"
                                : "#cccccc"
                            }
                            size={24}
                            color="#ffffff"
                            strokeWidth={1.75}
                          />
                        </button>
                      </div>
                    ))}
                </>
              )}
            </div>
            {/* {!isLoading && (
  <div className="w-full flex justify-center py-6">
    
    <CircularProgress size={28} />
  </div>
)} */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
