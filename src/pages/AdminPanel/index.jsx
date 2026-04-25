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
  const API = process.env.REACT_APP_API_URL;

  /* AUTH */
  useEffect(() => {
    if (!token) navigate("/admin/login");
  }, [token]);

  const axiosInstance = axios.create({
    baseURL: `${API}/api`,
    headers: { Authorization: `Bearer ${token}` },
  });

  /* FETCH */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, adsRes] = await Promise.all([
          axiosInstance.get("/stats"),
          axiosInstance.get("/ads"),
        ]);

        setStats(statsRes.data || { posts: 0, users: 0 });
        setAds(Array.isArray(adsRes.data) ? adsRes.data : []);
      } catch (err) {
        console.log(err);
        if (err.response?.status === 403) {
          navigate("/admin/login");
        }
      }
    };

    if (token) fetchData();
  }, [token]);

  /* ADD AD */
  const handleAddAd = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", newAd.title);
      formData.append("link", newAd.link);
      if (newAd.image) formData.append("image", newAd.image);

      const res = await axiosInstance.post("/ads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAds((prev) => [res.data, ...prev]);
      setNewAd({ title: "", link: "", image: null });

      alert("Reklam əlavə olundu");
    } catch (err) {
      console.log(err);
    }
  };

  /* DELETE */
  const handleDeleteAd = async (id) => {
    try {
      await axiosInstance.delete(`/ads/${id}`);
      setAds((prev) => prev.filter((ad) => ad._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  /* LOGOUT */
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">

      <div className="w-full max-w-6xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Çıxış
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">

          <div className="bg-white shadow rounded-xl p-6 text-center">
            <h2 className="text-gray-500">Elanlar</h2>
            <p className="text-3xl font-bold text-blue-600">
              {stats.posts}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6 text-center">
            <h2 className="text-gray-500">İstifadəçilər</h2>
            <p className="text-3xl font-bold text-green-600">
              {stats.users}
            </p>
          </div>

        </div>

        {/* ADD FORM */}
        <div className="bg-white shadow rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Yeni Reklam
          </h2>

          <form onSubmit={handleAddAd} className="space-y-3">

            <input
              type="text"
              placeholder="Başlıq"
              value={newAd.title}
              onChange={(e) =>
                setNewAd({ ...newAd, title: e.target.value })
              }
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="text"
              placeholder="Link"
              value={newAd.link}
              onChange={(e) =>
                setNewAd({ ...newAd, link: e.target.value })
              }
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="file"
              onChange={(e) =>
                setNewAd({ ...newAd, image: e.target.files[0] })
              }
              className="w-full border p-3 rounded-lg"
            />

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
              Əlavə Et
            </button>

          </form>
        </div>

        {/* ADS GRID */}
        <h2 className="text-xl font-semibold mb-4 text-center">
          Reklamlar
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {ads.map((ad) => (
            <div
              key={ad._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >

              <img
                src={`${API}/uploads/${ad.image}`}
                className="h-40 w-full object-cover"
              />

              <div className="p-4 text-center">

                <h3 className="font-semibold mb-1">
                  {ad.title}
                </h3>

                <a
                  href={ad.link}
                  target="_blank"
                  className="text-blue-500 text-sm break-all"
                >
                  {ad.link}
                </a>

                <button
                  onClick={() => handleDeleteAd(ad._id)}
                  className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                >
                  Sil
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}