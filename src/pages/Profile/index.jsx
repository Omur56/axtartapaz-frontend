
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Button, Typography, Card, CardContent, CardMedia, Avatar  } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
export default function Profile() {
  const [myAds, setMyAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return navigate("/login");
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyAds = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/my-announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyAds(res.data);
    } catch (err) {
      console.error("Elanları gətirərkən xəta:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchMyAds();
  }, []);



const modelMap = {
  homGarden: "homGarden",
  Clothing: "clothing",
  Phone: "phone",
  Household: "household",
  RealEstate: "realEstate",
  accessories: "accessories",
  cars: "cars",
  electronika: "electronika",
};



const handleDelete = async (ad) => {
  if (!window.confirm("Bu elanı silmək istədiyinizə əminsiniz?")) return;

  try {
    console.log("Silinəcək ID:", ad._id);

    // await axios.delete(`${process.env.REACT_APP_API_URL}/api/${modelMap[ad.modelName]}/${ad._id}`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
await axios.delete(`${process.env.REACT_APP_API_URL}/api/announcements/${ad.id}`, {
  headers: { Authorization: `Bearer ${token}` },
});
    setMyAds((prev) => prev.filter((a) => a._id !== ad._id));
    alert("Elan uğurla silindi!");
  } catch (err) {
    console.error("Elan silinmədi:", err.response?.data || err);
    alert("Elan silinmədi. Backend-də problem var.");
  }
};


  const openAdDetail = (id) => navigate(`/ads/${id}`);

  const getAdImage = (ad) => {
    if (ad.images && ad.images.length > 0) {
      const firstImage = ad.images[0];
      if (firstImage.startsWith("http")) return firstImage;
      return `${process.env.REACT_APP_API_URL}/uploads/${firstImage}`;
    }
    return "/no-image.jpg";
  };

  if (loading) return (
    <div className="flex  justify-center items-center h-screen"> 
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
    </div>
  );


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <Box className="min-h-screen mt-12 max-w-[1000px]  mx-auto p-6 ">
       
      {/* Müasir Profil Kartı */}
      {userData && (
          <Box
      sx={{
        width: "100%",
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
       
        p: 2,
      }}
    >
      <Card
        sx={{
          width: { xs: "100%", md: "50%", sm: 400 },
          borderRadius: 4,
          boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
          bgcolor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          transition: "transform 0.3s ease",
          "&:hover": { transform: "translateY(-5px)" },
        }}
      >
        <CardContent sx={{ textAlign: "center", p: 4 }}>
          <Avatar
            src="/user-avatar.png"
            alt={userData.username}
            sx={{
              width: 100,
              height: 100,
              mx: "auto",
              mb: 2,
              border: "3px solid #1976d2",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
            Profil Məlumatları
          </Typography>

          <Box sx={{ textAlign: "left", mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>İstifadəçi adı:</strong> {userData.username}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {userData.email}
            </Typography>
            <Typography variant="body1">
              <strong>Mobil:</strong>{" "}
              {userData.phone || "-"}{" "}
              {userData.phoneVerified && (
                <span style={{ color: "green", fontWeight: 500 }}>✅ Təsdiqlənib</span>
              )}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="error"
            fullWidth
            sx={{
              py: 1.3,
              borderRadius: 3,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "bold",
              letterSpacing: 0.5,
              boxShadow: "0 4px 12px rgba(244,67,54,0.4)",
            }}
            onClick={handleLogout}
          >
            Çıxış
          </Button>
        </CardContent>
      </Card>
    </Box>
      )}

      {/* İstifadəçi elanları */}
      <Typography variant="h3" align="center" gutterBottom>Mənim Elanlarım</Typography>
      {myAds.length === 0 ? (
        <Typography align="center" color="text.secondary">Hazırda heç bir elanınız yoxdur.</Typography>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {myAds.map((ad) => (
            <div
              key={ad._id}
              className="bg-white w-[180px] h-[250px] max-w-[240px] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer flex flex-col"
              onClick={() => openAdDetail(ad._id)}
            >
              <div className="w-full h-[100px] bg-gray-200">
                <img
                  src={getAdImage(ad)}
                  alt={ad.title || "Elan"}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = "/no-image.jpg"; }}
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold mb-1 truncate w-30">{ad.title || "Başlıq yoxdur"}</h2>
                <p className="text-gray-600 text-sm mb-3 flex-grow truncate w-30 h-55">
                  {ad.description ? ad.description.slice(0, 100) + "..." : "Təsvir yoxdur"}
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-green-600 font-bold text-lg">{ad.price ? ad.price + " ₼" : "-"}</span>
                 <button
      onClick={() => handleDelete(ad)}
      className="delete-btn"
      style={{ backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", borderRadius: "5px", cursor: "pointer" }}
    >
      Sil
    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
}
