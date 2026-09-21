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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { Store, ChevronRight } from "lucide-react";

import Swal from "sweetalert2";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [myAds, setMyAds] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= EDIT STATES =================
  const [editOpen, setEditOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const API = process.env.REACT_APP_API_URL;
  const [business, setBusiness] = useState(null);

  // =========================================================
  // USER
  // =========================================================

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

  // =========================================================
  // ADS
  // =========================================================

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

  // =========================================================
  // INIT
  // =========================================================
// ------biznes profil yoxlaması

useEffect(() => {
  const fetchBusiness = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const API = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

      const res = await axios.get(`${API}/api/business/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBusiness(res.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Business fetch error:", error);
      }

      setBusiness(null);
    }
  };

  fetchBusiness();
}, []);




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

  // =========================================================
  // DELETE
  // =========================================================

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
      Swal.fire({
        title: "Xəta!",
        text: err.response?.data?.message || "Elan silinmədi.",
        icon: "error",
        confirmButtonColor: "#670fff",
      });

      console.log(err);
    }
  };

  // =========================================================
  // EDIT - MODAL OPEN
  // =========================================================

  const handleEdit = (ad) => {
    console.log("EDIT AD:", ad);

    setEditingAd(ad);

    setEditForm({
      title: ad.title || "",
      price: ad.price !== undefined && ad.price !== null ? ad.price : "",
      city: ad.city || ad.location || "",
      description: ad.description || "",

      // Maşın məlumatları
      brand: ad.car?.brand || "",
      model: ad.car?.model || "",
      motor: ad.car?.motor || "",
      engine: ad.car?.engine || "",
      year: ad.car?.year ?? "",
      transmission: ad.car?.transmission || "",
      color: ad.car?.color || "",
      km: ad.car?.km ?? "",
      generation: ad.car?.generation || "",
    });

    setEditOpen(true);
  };

  // =========================================================
  // CLOSE EDIT MODAL
  // =========================================================

  const handleCloseEdit = () => {
    if (savingEdit) return;

    setEditOpen(false);
    setEditingAd(null);
    setEditForm({});
  };

  // =========================================================
  // EDIT INPUT CHANGE
  // =========================================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    
    }));
  };

  // =========================================================
  // SAVE EDIT
  // =========================================================

  const handleSaveEdit = async () => {
    if (!editingAd) return;

    if (!editForm.title?.trim()) {
      Swal.fire({
        title: "Diqqət!",
        text: "Elanın başlığını daxil edin.",
        icon: "warning",
        confirmButtonColor: "#670fff",
      });

      return;
    }

    setSavingEdit(true);

    try {
      const formData = new FormData();

      // =====================================================
      // ÜMUMİ ELAN MƏLUMATLARI
      // =====================================================

      formData.append("title", editForm.title);
      formData.append("price", editForm.price);
      formData.append("city", editForm.city);
      formData.append("location", editForm.city);
      formData.append("description", editForm.description);

      // =====================================================
      // MAŞIN MƏLUMATLARI
      // =====================================================

      if (editingAd.category === "car") {
        formData.append(
          "car",
          JSON.stringify({
            title: editForm.title,
            price: editForm.price,
            city: editForm.city,
            location: editForm.city,
            description: editForm.description,

            brand: editForm.brand,
            model: editForm.model,
            motor: editForm.motor,
            engine: editForm.engine,
            year: editForm.year,
            transmission: editForm.transmission,
            color: editForm.color,
            km: editForm.km,
            generation: editForm.generation,
          }),
        );
      }

      // =====================================================
      // KATEQORİYAYA GÖRƏ PUT ROUTE
      // =====================================================

      const categoryRoutes = {
        car: "/api/car",
        phone: "/api/phone",
        electronics: "/api/electronics",
        clothing: "/api/clothing",
        realEstate: "/api/realEstate",
        homeGarden: "/api/homeGarden",
        household: "/api/household",
        accessory: "/api/accessory",
      };

      const route = categoryRoutes[editingAd.category];

      if (!route) {
        throw new Error(
          `Bu kateqoriya üçün PUT route tapılmadı: ${editingAd.category}`,
        );
      }

      console.log("UPDATE CATEGORY:", editingAd.category);

      console.log("UPDATE URL:", `${API}${route}/${editingAd._id}`);

      // =====================================================
      // UPDATE
      // =====================================================

      const res = await axios.put(`${API}${route}/${editingAd._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("UPDATE RESPONSE:", res.data);

      const updatedAd = res.data?.ad || res.data;

      // =====================================================
      // PROFİLDƏ ELANI YENİLƏ
      // =====================================================

      setMyAds((prev) =>
        prev.map((ad) =>
          ad._id === editingAd._id
            ? {
                ...ad,
                ...updatedAd,
              }
            : ad,
        ),
      );

      // =====================================================
      // MODALI BAĞLA
      // =====================================================

      setEditOpen(false);
      setEditingAd(null);
      setEditForm({});

      // =====================================================
      // SERVERDƏN YENİ MƏLUMATLARI AL
      // =====================================================

      await fetchMyAds();

      // =====================================================
      // SUCCESS
      // =====================================================

      await Swal.fire({
        title: "Uğurlu!",
        text: "Elan məlumatları yeniləndi.",
        icon: "success",
        confirmButtonColor: "#670fff",
      });
    } catch (err) {
      console.error("FRONTEND UPDATE ERROR:", err);

      Swal.fire({
        title: "Xəta!",
        text: err.response?.data?.message || err.message || "Elan yenilənmədi.",
        icon: "error",
        confirmButtonColor: "#670fff",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  // =========================================================
  // IMAGE
  // =========================================================

  const getImage = (ad) => {
    if (ad.images?.[0]?.startsWith("http")) {
      return ad.images[0];
    }

    if (ad.mainImage?.startsWith("http")) {
      return ad.mainImage;
    }

    return ad.images?.[0] ? `${API}/uploads/${ad.images[0]}` : "/no-image.jpg";
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    navigate("/login");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <Box className="min-h-screen bg-gradient-to-br rounded-2xl from-slate-50 via-white to-purple-50 pt-24 pb-20 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* =====================================================
            PROFILE
        ====================================================== */}

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

                <div className="flex items-center gap-2 mt-0 sm:mt-16">
                  {business ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/biznes/${business.slug}`)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#670fff]/20 bg-[#670fff]/5 hover:bg-[#670fff]/10 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#670fff]/10 text-[#670fff] flex items-center justify-center">
                          <Store size={22} />
                        </div>

                        <div className="text-left">
                          <div className="font-black text-slate-900 dark:text-white">
                            Biznes profilim
                          </div>

                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {business.businessName}
                          </div>
                        </div>
                      </div>

                      <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate("/biznes-yarat")}
                      className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-[#670fff]/40 transition"
                    >
                      <div>
                        <div className="font-black text-slate-900 dark:text-white">
                          Biznes profili yarat
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Mağazanızı və ya şirkətinizi ProElan-da təqdim edin
                        </div>
                      </div>

                      <ChevronRight size={20} />
                    </button>
                  )}
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
                {/* USERNAME */}

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

                {/* EMAIL */}

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

                {/* PHONE */}

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

        {/* =====================================================
            ADS HEADER
        ====================================================== */}

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

        {/* =====================================================
            EMPTY
        ====================================================== */}

        {myAds.length === 0 ? (
          <Card
            elevation={0}
            className="rounded-3xl border border-dashed border-slate-300 bg-white/80"
          >
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-purple-100 flex items-center justify-center">
                <CampaignOutlinedIcon
                  className="!text-purple-500"
                  sx={{
                    fontSize: 40,
                  }}
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
          /* =====================================================
             ADS GRID
          ====================================================== */

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

                  {/* PRICE */}

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

                  <div className="flex items-center justify-between gap-2">
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

      {/* =========================================================
          EDIT MODAL
      ========================================================== */}

      <Dialog
        open={editOpen}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          className: "!rounded-3xl",
        }}
      >
        {/* MODAL HEADER */}

        <DialogTitle className="!px-5 !pt-5 !pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Elanı düzəlt
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Elan məlumatlarını yeniləyin
              </p>
            </div>

            <IconButton
              onClick={handleCloseEdit}
              disabled={savingEdit}
              className="!bg-slate-100 hover:!bg-slate-200"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>

        {/* MODAL CONTENT */}

        <DialogContent className="!px-5 !pb-2">
          <div className="space-y-4 pt-2">
            {/* ELANIN ŞƏKİLİ */}

            {editingAd && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <img
                  src={getImage(editingAd)}
                  alt={editingAd.title || "Elan"}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* CATEGORY */}

            {editingAd?.category && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Kateqoriya:</span>

                <Chip
                  label={editingAd.category}
                  size="small"
                  className="!bg-purple-100 !text-purple-700 !font-semibold"
                />
              </div>
            )}

            {/* TITLE */}

            <TextField
              fullWidth
              label="Elanın başlığı"
              name="title"
              value={editForm.title || ""}
              onChange={handleEditChange}
              disabled={savingEdit}
              inputProps={{
                maxLength: 150,
              }}
            />

            {/* PRICE */}

            <TextField
              fullWidth
              label="Qiymət"
              name="price"
              type="number"
              value={editForm.price ?? ""}
              onChange={handleEditChange}
              disabled={savingEdit}
              InputProps={{
                endAdornment: <span className="text-slate-400">₼</span>,
              }}
            />

            {/* CITY */}

            <TextField
              fullWidth
              label="Şəhər / Yer"
              name="city"
              value={editForm.city || ""}
              onChange={handleEditChange}
              disabled={savingEdit}
            />

            {/* DESCRIPTION */}

            <TextField
              fullWidth
              multiline
              minRows={5}
              label="Elanın açıqlaması"
              name="description"
              value={editForm.description || ""}
              onChange={handleEditChange}
              disabled={savingEdit}
              inputProps={{
                maxLength: 5000,
              }}
            />

            {/* ID */}

            {editingAd?._id && (
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <p className="text-xs text-slate-400">Elan ID</p>

                <p className="text-xs font-mono text-slate-600 break-all mt-1">
                  {editingAd._id}
                </p>
              </div>
            )}
          </div>
        </DialogContent>

        {/* MODAL ACTIONS */}

        <DialogActions className="!px-5 !pb-5 !pt-4">
          <Button
            onClick={handleCloseEdit}
            disabled={savingEdit}
            variant="outlined"
            className="!rounded-xl !normal-case !font-semibold"
          >
            Ləğv et
          </Button>

          <Button
            onClick={handleSaveEdit}
            disabled={savingEdit}
            variant="contained"
            startIcon={
              savingEdit ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            className="!rounded-xl !normal-case !font-bold !bg-[#670fff] hover:!bg-[#5600e8]"
          >
            {savingEdit ? "Yadda saxlanılır..." : "Yadda saxla"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
