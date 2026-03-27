import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [ads, setAds] = useState([]);
  const [newAd, setNewAd] = useState({
    title: "",
    link: "",
    image: null,
  });
  const [stats, setStats] = useState({ posts: 0, users: 0 });

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  /* 🔐 TOKEN CHECK */
  useEffect(() => {
    if (!token) navigate("/admin/login");
  }, [token, navigate]);

  /* 🔥 AXIOS INSTANCE */
  const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
    headers: { Authorization: `Bearer ${token}` },
  });

  /* 📦 DATA FETCH */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axiosInstance.get("/stats");
        setStats(statsRes.data || { posts: 0, users: 0 });

        const adsRes = await axiosInstance.get("/ads");

        // 🔥 SAFE ARRAY
        setAds(Array.isArray(adsRes.data) ? adsRes.data : []);
      } catch (err) {
        console.error("Xəta:", err);
        if (err.response?.status === 403) {
          navigate("/admin/login");
        }
      }
    };

    if (token) fetchData();
  }, [token]);

  /* ➕ ADD AD (FIXED) */
  const handleAddAd = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", newAd.title);
      formData.append("link", newAd.link);
      if (newAd.image) {
        formData.append("image", newAd.image);
      }

      const res = await axiosInstance.post("/ads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 🔥 UI UPDATE (reload yox!)
      setAds((prev) => [res.data, ...prev]);

      setNewAd({ title: "", link: "", image: null });

      alert("✅ Reklam əlavə olundu");
    } catch (err) {
      console.error(err);
      alert("❌ Xəta baş verdi");
    }
  };

  /* ❌ DELETE */
  const handleDeleteAd = async (id) => {
    try {
      await axiosInstance.delete(`/ads/${id}`);
      setAds((prev) => prev.filter((ad) => ad._id !== id));
    } catch (err) {
      console.error("Silmə xətası:", err);
    }
  };

  /* 🚪 LOGOUT */
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="p-6 mt-[50px] max-w-[1000px] min-h-screen mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Çıxış
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-blue-100 rounded-lg shadow">
          <h2>Elanlar</h2>
          <p className="text-2xl">{stats.posts}</p>
        </div>
        <div className="p-4 bg-green-100 rounded-lg shadow">
          <h2>İstifadəçilər</h2>
          <p className="text-2xl">{stats.users}</p>
        </div>
      </div>

      {/* ADD FORM */}
      <form
        onSubmit={handleAddAd}
        className="p-4 bg-gray-100 rounded-lg shadow mb-6"
      >
        <h2 className="text-xl mb-4">Yeni Reklam</h2>

        <input
          type="text"
          placeholder="Başlıq"
          className="w-full p-2 border rounded mb-2"
          value={newAd.title}
          onChange={(e) =>
            setNewAd({ ...newAd, title: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Link"
          className="w-full p-2 border rounded mb-2"
          value={newAd.link}
          onChange={(e) =>
            setNewAd({ ...newAd, link: e.target.value })
          }
        />

        <input
          type="file"
          className="w-full p-2 border rounded mb-2"
          onChange={(e) =>
            setNewAd({ ...newAd, image: e.target.files[0] })
          }
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Əlavə Et
        </button>
      </form>

      {/* ADS LIST */}
      <div>
        <h2 className="text-xl mb-4">Reklamlar</h2>

        <div className="grid grid-cols-3 gap-4">
          {Array.isArray(ads) &&
            ads
              .slice()
              .reverse()
              .map((ad) => (
                <div key={ad._id} className="p-4 bg-white rounded shadow">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/${ad.image}`}
                    alt={ad.title}
                    className="w-full h-32 object-cover mb-2 rounded"
                  />

                  <h3 className="font-semibold">{ad.title}</h3>

                  <a
                    href={ad.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 text-sm block truncate"
                  >
                    Link
                  </a>

                  <button
                    onClick={() => handleDeleteAd(ad._id)}
                    className="bg-red-600 text-white px-3 py-1 mt-2 rounded text-sm"
                  >
                    Sil
                  </button>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}