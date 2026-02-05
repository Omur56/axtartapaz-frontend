import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { X, MapPin, Phone, MessageCircleMore } from "lucide-react";
import { Box, LinearProgress, Avatar } from "@mui/material";
import { Percent, RefreshCcw, CarFront   } from "lucide-react";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link as RouterLink } from "react-router-dom";



export default function PostDetailCar() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [cars, setCars] = useState([]);
  const [zoomIndex, setZoomIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);
  const [showPhone, setShowPhone] = useState(false);
  const phone = post?.contact?.phone;

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

  // Fetch all cars for "similar cars"
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/cars`)
      .then((res) => setCars(res.data))
      .catch((err) => console.error("Elanlar yüklənmədi:", err));
  }, [BASE_URL]);

  // Fetch single post by ID
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/cars/${id}`)
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setNotFound(true);
        setLoading(false);
      });
  }, [id, BASE_URL]);

  // Image Zoom keyboard navigation
  const prevImage = useCallback(() => {
    if (!post?.images) return;
    setZoomIndex((prev) => (prev === 0 ? post.images.length - 1 : prev - 1));
  }, [post]);

  const nextImage = useCallback(() => {
    if (!post?.images) return;
    setZoomIndex((prev) => (prev === post.images.length - 1 ? 0 : prev + 1));
  }, [post]);

  useEffect(() => {
    if (zoomIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextImage();
      else if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "Escape") setZoomIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomIndex, nextImage, prevImage]);

  // Loading progress
  const progressRef = useRef(() => {});
  useEffect(() => {
    progressRef.current = () => {
      if (progress >= 100) {
        setProgress(0);
        setBuffer(10);
      } else {
        setProgress(progress + 1);
        if (buffer < 100 && progress % 5 === 0) {
          const newBuffer = buffer + 1 + Math.random() * 10;
          setBuffer(newBuffer > 100 ? 100 : newBuffer);
        }
      }
    };
  }, [progress, buffer]);

  useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 100);
    return () => clearInterval(timer);
  }, []);

  if (loading)
    return (
      <Box className="min-h-screen mt-14" sx={{ width: "100%" }}>
        <LinearProgress
          variant="buffer"
          value={progress}
          valueBuffer={buffer}
        />
      </Box>
    );

  if (notFound || !post)
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center bg-gradient-to-r from-fuchsia-100 to-violet-200">
        <h1 className="text-9xl font-extrabold text-white tracking-widest">
          404
        </h1>
        <div className="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute">
          Elan Yüklənmədi
        </div>
        <Link
          to="/"
          className="mt-5 relative inline-block text-sm font-medium text-green-500 group"
        >
          <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-red-500 group-hover:translate-y-0 group-hover:translate-x-0"></span>
          <span className="relative block px-8 py-3 bg-[#1A2238] border border-current">
            Əsas səhifə
          </span>
        </Link>
      </div>
    );

  const imageArray = Array.isArray(post.images)
    ? post.images
    : post.images
    ? [post.images]
    : [];

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
    return date.toTimeString().split(" ")[0].slice(0, 5);
  };

  const openZoom = (index) => setZoomIndex(index);


  // sayt xeritesi 
function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}
  return (
    <div className="max-w-6xl min-h-screen mx-auto ">


      {/* Back button */}
      <Link to="/Katalog/Nəqliyyat" className="p-4 ">
        <button className="flex items-center gap-2 mt-12 mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Geri
        </button>
      </Link>

      <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
        component={RouterLink} underline="hover"className="capitalize hover:underline hover:text-[#43D262]"  href="*" to="/">
          Ana Səhifə
        </Link>
        <Link
        component={RouterLink}
        to={`/Katalog/Nəqliyyat`}
          underline="hover"
          className="capitalize hover:underline hover:text-[#43D262]"
        >
          Nəqliyyat
        </Link>
        <Link
  component={RouterLink}     // React Router Link istifadə et
  to={`/cars/${post._id}`}    // klik edəndə yönləndirəcək
  className="capitalize hover:underline hover:text-[#43D262]"
  underline="hover"
  
>
  {post.brand} {post.model}
</Link>

      </Breadcrumbs>
    </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white shadow-lg rounded-xl sm:p-6 ">
        {/* Left / Main column */}
        <div className="lg:col-span-2 space-y-4 ">
          <h1 className="text-2xl font-bold mb-4 capitalize p-2">
            {post.category} {post.brand} {post.model}
          </h1>

          <Carousel showThumbs showStatus={false} autoPlay infiniteLoop>
  {imageArray.map((img, index) => {
    const imageSrc = img.startsWith("http")
      ? img
      : `${BASE_URL}/uploads/${img}`;

    return (
      <div
        key={index}
        className="relative max-w-full max-h-[400px] sm:w-full sm:h-[400px] overflow-hidden cursor-pointer"
        onClick={() => openZoom(index)}
      >
        {/* 🔵 Blur background */}
        <div
          className="absolute inset-0 bg-center bg-cover blur-xl scale-110"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />

        {/* ⚫ Overlay (istəyə görə qaraldır) */}
        <div className="absolute inset-0 bg-black/20" />

        {/* 🖼️ Main image */}
        <img
          src={imageSrc}
          alt={`Şəkil ${index + 1}`}
          className="relative z-10 w-full h-full object-contain rounded-lg"
        />
      </div>
    );
  })}
</Carousel>


          <p className="text-3xl font-bold text-black mt-4 p-2">{post.price} AZN</p>

          <div className="border-t pt-4 p-2">
            <ul className="text-sm text-gray-700 space-y-1 mt-4 justify-between grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <li>
                <span className="font-bold">Ban:</span> {post.ban_type}
              </li>
              <li>
                <span className="font-bold">İl:</span> {post.year}
              </li>
              <li>
                <span className="font-bold">Yürüş:</span> {post.km} km
              </li>
              <li>
                <span className="font-bold">Motor:</span> {post.motor}
              </li>
              <li>
                <span className="font-bold">Mühərrik növü:</span> {post.engine}
              </li>
              <li>
                <span className="font-bold">Transmissiya:</span>{" "}
                {post.transmission}
              </li>
              <li>
                <span className="font-bold">Yerləşmə:</span> {post.location}
              </li>
            </ul>

            <div className="w-full h-[1px] border rounded-1 bg-black mb-2"></div>

            <ul className="text-sm text-gray-700 gap-2">
              <li>
                <span className="font-bold">Qeyd:</span> {post?.description}
              </li>
            </ul>
          </div>

          <div className="flex justify-between text-sm text-gray-500 mt-4 p-2">
            <p>Elanın nömrəsi: {post.id}</p>
            <p>
              {post.location}, {formatDate(post.data)},{" "}
              {getCurrentTime(post.data)}
            </p>
          </div>
        </div>

        {/* Right / Contact column */}
        <div className="bg-gray-50  w-full h-fit sticky top-0 border-blue-500 border-2 rounded-[4px] shadow-md p-5 ">
          <div className="w-full h-[20px]  k ">
            <span className="font-bold text-xl">
              {" "}
              <span className="text-xl font-bold">≈</span> {post.price} AZN
            </span>
          </div>
          <div className="flex mt-2 w-full h-[100px]  gap-2">
            <div className="  w-full h-[50px] p-1  flex gap-2">
              {post.kredit && (
                <div className="w-[100px] h-[50px] flex gap-2">
                  <div className="flex w-full h-[40px] gap-2  bg-white rounded-lg p-2 shadow-md">
                    <p className="w-[25px] bg-orange-500 h-[25px] p-1 justify-items-center  flex rounded-full text-white">
                      {" "}
                      <Percent
                        size={16}
                        strokeWidth={1.5}
                        absoluteStrokeWidth
                      />{" "}
                    </p>

                    <span className="text-sm text-gray-400 font-semibold mt-1">
                      Kredit
                    </span>
                  </div>
                  <div className="w-full h-[40px] flex gap-2 bg-white rounded-lg p-2 shadow-md">
                    {post.barter && (
                      <p className="w-[25px] bg-green-500 h-[25px] p-1 justify-items-center  flex rounded-full text-white">
                        <RefreshCcw
                          size={16}
                          strokeWidth={1.5}
                          absoluteStrokeWidth
                        />
                      </p>
                    )}
                    <span className="text-sm text-gray-400 font-semibold mt-1">
                      Barter
                    </span>
                  </div>
                 {post.salon === "Salon" && (
  <div className="w-full h-[40px] flex  text-white bg-blue-500 rounded-lg p-2 shadow-md">
    <span className="w-[25px] bg-blue-500 h-[25px] p-1 justify-items-center  flex rounded-full text-white">
    <CarFront size={16} strokeWidth={1.5} absoluteStrokeWidth  />
    </span>
    <span className="text-sm text-white font-semibold">
      
       Salon
    </span>
  </div>
)}

                </div>
              )}
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4">Əlaqə məlumatı</h2>
          <div className="space-y-2 text-gray-700">
            <div className="w-full h-[1px] border rounded-1 bg-black mb-2"></div>
            <div className="flex justify-between h-[100px] w-full items-center gap-3">
              <div className="w-full h-[100px]  block ">
                <div className="flex gap-3 items-center">
                  <Avatar
                    alt={post?.contact?.name}
                    src="/broken-image.jpg"
                    className="w-[50px] h-[50px] border-blue-400 border-2"
                  />
                  <span className="font-semibold justify-center items-center"></span>{" "}
                  {post?.contact?.name}
                </div>

                <div
                  className="w-full gap-5 hidden sm:flex 
           flex-col  h-[280px]   my-4"
                >
                  <button className="bg-green-500 w-full h-[50px]   rounded-[8px] flex justify-center items-center hover:bg-green-600 text-white">
                    <a
                      href={showPhone ? `tel:${phone}` : "#"}
                      onClick={(e) => {
                        if (!showPhone) {
                          e.preventDefault(); // ilk klikdə zəng getməsin
                          setShowPhone(true);
                          setTimeout(() => setShowPhone(false), 10000);
                        }
                      }}
                      className="text-white flex gap-2 font-[14px] text-center justify-center items-center"
                    >
                      <Phone
                        className="w-4 h-4  bg-transparent"
                        stroke="red"
                        fill="red"
                      />
                      {showPhone ? phone : "Nömrəni göstər"}
                    </a>
                  </button>

                  <button className="bg-blue-500  w-full h-8  rounded-[8px] flex justify-center items-center hover:bg-blue-600 text-white">
                    <a
                      href={`https://wa.me/${post?.contact?.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white flex gap-2 text-[14px] font-sans text-center justify-center items-center"
                    >
                      <MessageCircleMore
                        className=" w-4 h-4 "
                        size={28}
                        fill="white"
                        stroke="#4C88F9"
                      />{" "}
                      Mesaj göndər
                    </a>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full hidden sm:block h-[1px] border rounded-1 mt-24 bg-black mb-2"></div>
          <div className="text-gray-700 mt-4 gap-5">
            <span className="font-bold">{post?.contact?.name}</span>
            <span className="block">{post?.location}</span>
          </div>
          <div className="text-gray-700 mt-4">
            <span className="font-bold">{post?.description}</span>
          </div>
        </div>

        <div className="w-full flex justify-center items-center">
          <div
            className="max-w-[450px]  justify-between items-center  sm:hidden 
          fixed bottom-0 z-50  gap-5 flex  h-[50px]   my-4"
          >
            <button className="bg-green-500 sm:w-[200px]    min-w-[170px] h-[40px]  sm:h-10 rounded-[8px] flex justify-center items-center hover:bg-green-600 text-white">
              <a
                href={`tel:${post?.contact?.phone}`}
                className="text-white flex gap-2 font-[14px] text-center justify-center items-center"
              >
                <Phone
                  className=" w-4 h-4 "
                  size={28}
                  fill="white"
                  stroke="white"
                />{" "}
                Zəng et
              </a>
            </button>

            <button className="bg-blue-500  min-w-[170px] h-[40px] sm:h-10 sm:w-[200px] rounded-[8px] flex justify-center items-center hover:bg-blue-600 text-white">
              <a
                href={`https://wa.me/${post?.contact?.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white flex gap-2 text-[14px] font-sans text-center justify-center items-center"
              >
                <MessageCircleMore
                  className=" w-4 h-4 "
                  size={28}
                  fill="white"
                  stroke="#4C88F9"
                />{" "}
                Mesaj göndər
              </a>
            </button>
          </div>
        </div>
      </div>

      {/* Zoom modal */}
      {zoomIndex !== null && imageArray[zoomIndex] && (
        <div className="fixed inset-0 flex flex-col bg-black bg-opacity-90 justify-center items-center z-50">
          <div className="w-[50px] h-[50px]  rounded-[50%] dark:bg-zinc-800 bg-opacity-50 absolute   z-50 mt-[100%]  right-[80%]">
            <button className="bg-green-500 rounded-[50%]  flex justify-center items-center  w-full h-full  hover:bg-green-600 text-white">
              <a
                href={`tel:${post?.contact?.phone}`}
                className="text-white font-bold text-center justify-center items-center"
              >
                <Phone />
              </a>
            </button>
          </div>
          <div className="absolute   top-0 w-full h-[55px]   dark:bg-neutral-800 ">
            <div className="w-[700px] gap-5 text-center justify-start h-[55px] absolute top-0 left-0 flex  items-center pl-5 ">
              <span className="text-xs sm:text-xl top-2  h-2 font-sans mb-4 capitalize  justify-center items-center text-white">
                {post.category} {post.brand} {post.model}
              </span>
              <div className="w-[1px] h-[25px] border rounded-1 dark:bg-zinc-600 bg-opacity-50 mb-2"></div>
              <span className="text-xs sm:text-xl top-2  h-2 font-sans mb-4 capitalize justify-center items-center text-white">
                {post.price} AZN
              </span>
            </div>
            <a
              href={showPhone ? `tel:${phone}` : "#"}
              onClick={(e) => {
                if (!showPhone) {
                  e.preventDefault(); // ilk klikdə zəng getməsin
                  setShowPhone(true);
                  setTimeout(() => setShowPhone(false), 10000);
                }
              }}
              className="absolute hidden md:flex gap-2 top-2 right-60
                 text-white w-[200px] h-10 rounded-[8px]
                 flex justify-center items-center
                 bg-green-400 hover:bg-green-500 transition"
            >
              <Phone className="w-4 h-4 text-white" />
              {showPhone ? phone : "Nömrəni göstər"}
            </a>

            <button
              onClick={() => setZoomIndex(null)}
              className="absolute top-2 right-5 text-white w-10 h-10 rounded-[8px] flex justify-center items-center hover:bg-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <button
            className="absolute mt-[-20%]  left-2 text-white text-8xl w-10 h-10 font-500 z-50"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            ‹
          </button>
          <img
            src={
              imageArray[zoomIndex].startsWith("http")
                ? imageArray[zoomIndex]
                : `${BASE_URL}/uploads/${imageArray[zoomIndex]}`
            }
            alt="Zoomed"
            className="max-w-[75%] max-h-[75%] object-contain rounded-lg"
          />
          <button
            className="absolute mt-[-20%] right-2 w-10 h-10 text-white text-8xl font-500 z-50"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            ›
          </button>

          <div className="absolute mb-[-35%] text-white bg-gray-600 p-2 bg-opacity-50 rounded-[8px] max-w-[30%] max-h-[25px] text-sm justify-center items-center flex">
            {zoomIndex + 1}/{imageArray.length}
          </div>

          <div className="w-full flex gap-2 p-2 justify-center items-center absolute bottom-[40px] overflow-x-auto">
            {imageArray.map((img, index) => (
              <div
                key={index}
                onClick={() => setZoomIndex(index)}
                className={`cursor-pointer rounded-lg p-[2px] transition-all duration-200 ${
                  zoomIndex === index
                    ? "border-2 border-purple-600"
                    : "border-2 border-transparent"
                }`}
              >
                <img
                  src={
                    img.startsWith("http") ? img : `${BASE_URL}/uploads/${img}`
                  }
                  alt={post.brand}
                  className="w-[50px] h-[50px] object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar cars */}
      <h2 className="text-[22px] font-bold text-gray-700 mt-10 mb-4">
        Bənzər elanlar
      </h2>
      <div className="p-4 grid justify-items-center grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[15px] w-full">
        {cars.map((car) => (
          <Link
            key={car._id || car.id}
            to={`/cars/${car._id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-[185.7px] h-[222.6px] max-w-[240.4px] max-h-[268.8px] bg-white rounded-2xl shadow-sm transform transition-all duration-300">
              <div className="w-full h-[100px] rounded-t-[8px] relative">
                <img
                  src={car.mainImage || (car.images && car.images[0]) || ""}
                  alt={car.brand}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-t-2xl"
                  onClick={() => openZoom(0)}
                />
              </div>
              <div className="p-2">
                <h3 className="text-[18px] font-bold text-black">
                  {car.price} AZN ₼
                </h3>
                <h2 className="text-[12px] truncate w-30">
                  {car.category}, {car.brand}, {car.model}
                </h2>
                <p className="text-gray-600 truncate w-30">
                  {car.year}, {car.km} km
                </p>
                <div className="flex justify-between gap-1 mt-7">
                  <p className="text-[10px] p-1 rounded flex justify-between text-gray-600">
                    <MapPin size={12} color="#75FC56" /> {car.location}
                  </p>
                  <p className="capitalize text-[12px] p-1 rounded flex justify-between text-gray-600 truncate w-30">
                    {formatDate(car.data)} {getCurrentTime(car.data)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
