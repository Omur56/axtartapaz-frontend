import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { X, MapPin, Phone, MessageCircleMore } from "lucide-react";
import { Box, LinearProgress, Avatar } from "@mui/material";

export default function PostDetailElectronika() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [zoomIndex, setZoomIndex] = useState(null);

  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);

  const contact = post?.contact ?? {};
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/electronika`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/electronika/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const imageArray = Array.isArray(post?.images)
    ? post.images
    : post?.images
    ? [post.images]
    : [];

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("az-AZ");
  };

  const getCurrentTime = (iso) =>
    new Date(iso).toTimeString().split(" ")[0].slice(0, 5);

  const openZoom = (i) => setZoomIndex(i);
  const prevImage = () =>
    setZoomIndex((p) => (p === 0 ? imageArray.length - 1 : p - 1));
  const nextImage = () =>
    setZoomIndex((p) => (p === imageArray.length - 1 ? 0 : p + 1));

  if (!post)
    return (
      <Box className="min-h-screen mt-14" sx={{ width: "100%" }}>
        <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />
      </Box>
    );

  return (
    <div className="max-w-6xl min-h-screen mx-auto">

      {/* BACK */}
      <Link to="/Katalog/Elektronika">
        <button className="flex items-center gap-2 mt-12 mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
          Geri
        </button>
      </Link>

      {/* GRID (CAR DESIGN STYLE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shadow-lg rounded-xl">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">

          <h1 className="text-2xl font-bold mb-4 p-2">
            {post.brand} {post.model}
          </h1>

          <Carousel showThumbs showStatus={false} autoPlay infiniteLoop>
            {imageArray.map((img, index) => (
              <div key={index} onClick={() => openZoom(index)}>
                <img
                  src={
                    img.startsWith("http")
                      ? img
                      : `${BASE_URL}/uploads/${img}`
                  }
                  className="w-full h-[400px] object-contain"
                />
              </div>
            ))}
          </Carousel>

          <p className="text-3xl font-bold p-2">{post.price} AZN</p>

          <div className="border-t pt-4 p-2">
            <ul className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
              <li><b>Marka:</b> {post.brand}</li>
              <li><b>Model:</b> {post.model}</li>
              <li><b>Şəhər:</b> {post.location}</li>
            </ul>

            <div className="border-t mt-3 pt-2">
              <b>Qeyd:</b> {post.description}
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-500 p-2">
            <p>{post.location}</p>
            <p>{formatDate(post.createdAt)} {getCurrentTime(post.createdAt)}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-gray-50 border-2 rounded-md shadow-md p-5">

          <h2 className="text-xl font-bold mb-4">Əlaqə</h2>

          <div className="space-y-2">
            <p><b>Ad:</b> {contact.name || "—"}</p>
            <p><b>Telefon:</b> {contact.phone || "—"}</p>
            <p><b>Email:</b> {contact.email || "—"}</p>
          </div>

          <a
            href={`tel:${contact.phone}`}
            className="block mt-5 bg-green-500 text-white text-center py-3 rounded-md"
          >
            Zəng et
          </a>
        </div>
      </div>

      {/* SIMILAR */}
      <h2 className="text-xl font-bold mt-10 mb-4">Bənzər elanlar</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {posts.slice(0, 8).map((item) => (
          <Link key={item._id} to={`/PostDetailElectronika/${item._id}`}>
            <div className="border rounded-lg p-2">
              <img
                src={
                  item.images?.[0]?.startsWith("http")
                    ? item.images[0]
                    : "/no-image.jpg"
                }
                className="h-[120px] w-full object-cover"
              />
              <p className="font-bold">{item.price} ₼</p>
              <p className="text-sm truncate">{item.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ZOOM */}
      {zoomIndex !== null && (
        <div
          className="fixed inset-0 bg-black flex justify-center items-center"
          onClick={() => setZoomIndex(null)}
        >
          <button onClick={prevImage} className="text-white text-5xl">‹</button>

          <img
            src={
              imageArray[zoomIndex].startsWith("http")
                ? imageArray[zoomIndex]
                : `${BASE_URL}/uploads/${imageArray[zoomIndex]}`
            }
            className="max-w-[80%] max-h-[80%]"
          />

          <button onClick={nextImage} className="text-white text-5xl">›</button>
        </div>
      )}
    </div>
  );
}