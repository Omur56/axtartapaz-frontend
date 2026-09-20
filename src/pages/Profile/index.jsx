import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  CircularProgress,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import Swal from "sweetalert2";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [myAds, setMyAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const API = process.env.REACT_APP_API_URL;

  // USER
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API}/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(res.data);
    } catch (err) {
      console.log("User error:", err);
    }
  };

  // ADS
  const fetchMyAds = async () => {
    try {
      const res = await axios.get(`${API}/api/my-ads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMyAds(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Ads error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    const init = async () => {
      await fetchUser();
      await fetchMyAds();
    };

    init();
  }, []);

  // DELETE
  const handleDelete = async (ad) => {
    const result = await Swal.fire({
      title: "Əminsən?",
      text: "Bu elan silinəcək!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Xeyr",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API}/api/${ad.category}/${ad._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMyAds((prev) => prev.filter((x) => x._id !== ad._id));

      Swal.fire({
        title: "Silindi!",
        text: "Elan uğurla silindi.",
        icon: "success",
        confirmButtonColor: "#670fff",
      });
    } catch (err) {
      Swal.fire("Xəta!", "Elan silinmədi.", "error");
      console.log(err);
    }
  };

  // EDIT
  const handleEdit = (ad) => {
    navigate(`/edit/${ad.category}/${ad._id}`);
  };

  // IMAGE
  const getImage = (ad) => {
    if (ad.images?.[0]?.startsWith("http")) {
      return ad.images[0];
    }

    return ad.images?.[0] ? `${API}/uploads/${ad.images[0]}` : "/no-image.jpg";
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Box className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 pt-24 pb-20 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* ================= PROFILE ================= */}
        {userData && (
          <Card
            elevation={0}
            className="overflow-hidden rounded-3xl border border-slate-200 shadow-xl mb-8"
          >
            {/* COVER */}
            <div className="h-32 sm:h-40 bg-gradient-to-r from-[#670fff] via-[#7c3aed] to-[#4f46e5] relative">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute w-40 h-40 rounded-full bg-white -top-20 -right-10" />
                <div className="absolute w-32 h-32 rounded-full bg-white bottom-[-60px] left-10" />
              </div>
            </div>

            <CardContent className="relative px-5 sm:px-8 pb-7">
              {/* AVATAR */}
              <div className="-mt-14 sm:-mt-16 flex flex-col sm:flex-row sm:items-end gap-4">
                <Avatar
                  sx={{
                    width: 90,
                    height: 90,
                    borderRadius: "20px",
                    fontSize: "32px",
                    fontWeight: 700,
                  }}
                  className="border-4 border-white shadow-xl bg-gradient-to-br from-purple-500 to-indigo-600"
                  alt={userData.username}
                >
                  {userData.username?.charAt(0)?.toUpperCase()}
                </Avatar>

                <div className="flex-1 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {userData.username}
                    </h1>

                    {userData.phoneVerified && (
                      <Chip
                        label="Təsdiqlənmiş"
                        size="small"
                        className="!bg-green-100 !text-green-700 !font-semibold"
                      />
                    )}
                  </div>

                  <p className="text-slate-500 mt-1">Şəxsi profil</p>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon />}
                  className="!rounded-xl !normal-case !font-semibold"
                >
                  Çıxış
                </Button>
              </div>

              <Divider className="!my-6" />

              {/* USER INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
                    <PersonOutlineIcon className="!text-purple-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 font-medium">
                      İstifadəçi adı
                    </p>

                    <p className="font-bold text-slate-800 truncate">
                      {userData.username}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                    <EmailOutlinedIcon className="!text-blue-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 font-medium">Email</p>

                    <p className="font-bold text-slate-800 truncate">
                      {userData.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                    <PhoneOutlinedIcon className="!text-green-600" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 font-medium">
                      Mobil nömrə
                    </p>

                    <p className="font-bold text-slate-800 truncate">
                      {userData.phone || "Qeyd edilməyib"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ================= ADS HEADER ================= */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center">
              <CampaignOutlinedIcon className="!text-purple-600" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Mənim elanlarım
              </h2>

              <p className="text-sm text-slate-500">
                Yerləşdirdiyiniz elanları idarə edin
              </p>
            </div>
          </div>

          <div className="bg-purple-100 text-purple-700 font-bold px-4 py-2 rounded-full">
            {myAds.length} elan
          </div>
        </div>

        {/* ================= EMPTY ================= */}
        {myAds.length === 0 ? (
          <Card
            elevation={0}
            className="rounded-3xl border border-dashed border-slate-300 bg-white/80"
          >
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-purple-100 flex items-center justify-center">
                <CampaignOutlinedIcon
                  className="!text-purple-500"
                  sx={{ fontSize: 40 }}
                />
              </div>

              <h3 className="text-xl font-bold text-slate-800">
                Hələ elanınız yoxdur
              </h3>

              <p className="text-slate-500 mt-2">
                İlk elanınızı yerləşdirərək satışa başlayın.
              </p>
            </CardContent>
          </Card>
        ) : (
          /* ================= ADS GRID ================= */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {myAds.map((ad) => (
              <Card
                key={ad._id}
                elevation={0}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                {/* IMAGE */}
                <div
                  className="relative h-36 sm:h-44 bg-slate-100 cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/ad/${ad._id}`)}
                >
                  <img
                    src={getImage(ad)}
                    alt={ad.title || "Elan"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/no-image.jpg";
                    }}
                  />

                  {/* CATEGORY */}
                  {ad.category && (
                    <span className="absolute top-2 left-2 bg-black/65 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full font-medium">
                      {ad.category}
                    </span>
                  )}

                  {/* PRICE BADGE */}
                  <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-md">
                    <span className="text-purple-700 font-extrabold text-sm">
                      {ad.price ? `${ad.price} ₼` : "Qiymət yoxdur"}
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <CardContent className="!p-3.5">
                  <h3
                    className="font-bold text-slate-800 truncate cursor-pointer hover:text-purple-600 transition"
                    onClick={() => navigate(`/ad/${ad._id}`)}
                  >
                    {ad.title ||
                      [ad.brand, ad.model].filter(Boolean).join(" ") ||
                      "Adsız elan"}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {ad.description
                      ? ad.description.slice(0, 60)
                      : "Elan haqqında məlumat yoxdur"}
                  </p>

                  <Divider className="!my-3" />

                  {/* ACTIONS */}
                  <div className="flex items-center justify-between">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(ad)}
                      className="!rounded-xl !normal-case !font-semibold !text-purple-600 !border-purple-200 hover:!bg-purple-50"
                    >
                      Düzəlt
                    </Button>

                    <IconButton
                      onClick={() => handleDelete(ad)}
                      className="!bg-red-50 hover:!bg-red-100"
                    >
                      <DeleteIcon fontSize="small" className="!text-red-500" />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Box>
  );
}
