// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Card,
//   CardContent,
//   Avatar,
//   Typography,
//   Button,
//   CircularProgress,
// } from "@mui/material";
// import BottomMenu from "../../components/MobileMenu";
// import BubbleBackground from "../../components/ui/BubbleBackground";

// export default function Profile() {
//   const [myAds, setMyAds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const fetchUser = async () => {
//     const userId = localStorage.getItem("userId");
//     if (!token || !userId) return navigate("/login");
//     try {
//       const res = await axios.get(
//         `${process.env.REACT_APP_API_URL}/api/users/${userId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setUserData(res.data);
//     } catch (err) {
//       console.error("User fetch error:", err);
//     }
//   };

//   const fetchMyAds = async () => {
//     try {
//       const res = await axios.get(
//         `${process.env.REACT_APP_API_URL}/api/my-announcements`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // res.data array yoxdursa, array-ə çeviririk
//       const data = Array.isArray(res.data) ? res.data : [res.data];
//       setMyAds(data);
//     } catch (err) {
//       console.error("Elanları gətirərkən xəta:", err.response?.data || err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const init = async () => {
//       await fetchUser();
//       await fetchMyAds();
//     };
//     init();
//   }, []);

//   const handleDelete = async (ad) => {
//     if (!window.confirm("Bu elanı silmək istədiyinizə əminsiniz?")) return;

//     try {
//       await axios.delete(
//         `${process.env.REACT_APP_API_URL}/api/ad/${ad._id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setMyAds((prev) => prev.filter((a) => a._id !== ad._id));
//       alert("Elan uğurla silindi!");
//     } catch (err) {
//       console.error("Elan silinmədi:", err.response?.data || err);
//       alert("Elan silinmədi. Backend-də problem var.");
//     }
//   };

//   const getAdImage = (ad) => {
//     if (ad.images && ad.images.length > 0) {
//       const firstImage = ad.images[0];
//       if (firstImage.startsWith("http")) return firstImage;
//       return `${process.env.REACT_APP_API_URL}/uploads/${firstImage}`;
//     }
//     return "/no-image.jpg";
//   };

//   const openAdDetail = (id) => navigate(`/ad/${id}`);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userId");
//     navigate("/login");
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <CircularProgress />
//       </div>
//     );

//   return (
    
//       <Box className="min-h-screen mt-12 max-w-[1000px] mx-auto p-6">
//         {/* Profil Kartı */}
//         {userData && (
//           <Box className="flex justify-center items-center mb-10">
//             <Card className="w-full max-w-md p-6 bg-white/80 rounded-xl shadow-lg">
//               <CardContent className="text-center">
//                 <Avatar
//                   src="/user-avatar.png"
//                   alt={userData.username}
//                   className="w-24 h-24 mx-auto mb-4 border-2 border-blue-600"
//                 />
//                 <Typography variant="h5" className="font-bold mb-2">
//                   Profil Məlumatları
//                 </Typography>
//                 <Typography className="mb-1">
//                   <strong>İstifadəçi adı:</strong> {userData.username}
//                 </Typography>
//                 <Typography className="mb-1">
//                   <strong>Email:</strong> {userData.email}
//                 </Typography>
//                 <Typography>
//                   <strong>Mobil:</strong> {userData.phone || "-"}{" "}
//                   {userData.phoneVerified && (
//                     <span className="text-green-600 font-semibold">✅ Təsdiqlənib</span>
//                   )}
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   color="error"
//                   className="mt-4 w-full"
//                   onClick={handleLogout}
//                 >
//                   Çıxış
//                 </Button>
//               </CardContent>
//             </Card>
//           </Box>
//         )}

//         {/* İstifadəçi elanları */}
//         <Typography variant="h4" align="center" gutterBottom>
//           Mənim Elanlarım
//         </Typography>

//         {myAds.length === 0 ? (
//           <Typography align="center" color="text.secondary">
//             Hazırda heç bir elanınız yoxdur.
//           </Typography>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
//             {myAds.map((ad) => (
//               <div
//                 key={ad._id}
//                 className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer flex flex-col"
//                 onClick={() => openAdDetail(ad._id)}
//               >
//                 <div className="w-full h-28 bg-gray-200">
//                   <img
//                     src={getAdImage(ad)}
//                     alt={ad.title || "Elan"}
//                     className="w-full h-full object-cover"
//                     onError={(e) => (e.target.src = "/no-image.jpg")}
//                   />
//                 </div>
//                 <div className="p-3 flex flex-col flex-grow">
//                   <h2 className="text-md font-semibold truncate">
//                     {ad.title || "Başlıq yoxdur"}
//                   </h2>
//                   <p className="text-gray-600 text-sm flex-grow truncate">
//                     {ad.description
//                       ? ad.description.slice(0, 80) + "..."
//                       : "Təsvir yoxdur"}
//                   </p>
//                   <div className="flex justify-between items-center mt-2">
//                     <span className="text-green-600 font-bold">
//                       {ad.price ? ad.price + " ₼" : "-"}
//                     </span>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleDelete(ad);
//                       }}
//                       className="px-2 py-1 bg-red-500 text-white rounded"
//                     >
//                       Sil
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//         <BottomMenu />
//       </Box>
    
//   );
// }






import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  CircularProgress,
  IconButton,

} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 REAL BACKEND: my-ads yoxdur, hər category ayrı gəlir

  const fetchMyAds = async () => {
  try {
    const res = await axios.get(`${API}/api/my-ads`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setMyAds(res.data);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
  // const fetchMyAds = async () => {
  //   try {
  //     const endpoints = [
  //      "car",
  //      "phone",
  //      "electronika",
  //      "Clothing",
  //      "homeGarden",
  //      "realEstate",
  //      "household",
  //      "accessories",

       
  //     ];

  //     const requests = endpoints.map((cat) =>
  //       axios.get(`${API}/api/${cat}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       })
  //     );

  //     const results = await Promise.all(requests);

  //     const merged = results.flatMap((res, index) =>
  //       (res.data || []).map((item) => ({
  //         ...item,
  //         category: endpoints[index],
  //       }))
  //     );

  //     setMyAds(merged);
  //   } catch (err) {
  //     console.log("Ads error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (!token || !userId) return navigate("/login");

    const init = async () => {
      await fetchUser();
      await fetchMyAds();
    };

    init();
  }, []);

  // 🔥 DELETE (CATEGORY FIX)
  const handleDelete = async (ad) => {
    const result = await Swal.fire({
  title: "Əminsən?",
  text: "Bu elan silinəcək!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Bəli, sil",
  cancelButtonText: "Xeyr",
});

if (!result.isConfirmed) return;

    try {
      await axios.delete(
        `${API}/api/${ad.category}/${ad._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMyAds((prev) => prev.filter((x) => x._id !== ad._id));
    } catch (err) {
      Swal.fire("Xəta!", "Silinmədi!", "error");
      console.log(err);
    }
  };

  const handleEdit = (ad) => {
    navigate(`/edit/${ad.category}/${ad._id}`);
  };

  const getImage = (ad) =>
    ad.images?.[0]?.startsWith("http")
      ? ad.images[0]
      : `${API}/uploads/${ad.images?.[0]}`;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  const handleLogout = () =>{
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    navigate("/login");
  };

  return (
    <Box className="max-w-6xl mx-auto p-4 mt-20">


      {/* USER PROFILE */}
      <Card className="mb-6 shadow-xl rounded-2xl">
        <CardContent className="flex items-center gap-4">
          <Avatar sx={{ width: 70, height: 70 }} />

          <div>
            <h2 className="text-xl font-bold">
              {userData.username}
            </h2>
            <p className="text-gray-600">{userData.email}</p>
            <p className="text-gray-600">{userData.phone}</p>

            
          </div>
          <CardContent className="flex items-center gap-4">
              <Button variant="contained"
              color="error"
              onClick={handleLogout}
              sx={{marginLeft: "auto"}}>
                Çıxış
              </Button>
            </CardContent>
        </CardContent>
      </Card>

      {/* ADS */}
      <h2 className="text-2xl font-bold mb-4">
        Mənim Elanlarım ({myAds.length})
      </h2>

      {myAds.length === 0 ? (
        <p>Heç bir elan yoxdur</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {myAds.map((ad) => (
            <div
              key={ad._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={getImage(ad)}
                className="h-32 w-full object-cover"
              />

              <div className="p-3 block">
                <h2 className="font-semibold truncate">
                  {ad.brand}
                  </h2>
                <h3 className="font-semibold truncate">
                  {ad.model}
                </h3>

                <p className="text-green-600 font-bold">
                  {ad.price} ₼
                </p>

                

                {/* ACTIONS */}
                <div className="flex justify-between mt-2">
                  <IconButton onClick={() => handleEdit(ad)}>
                    <EditIcon color="primary" />
                  </IconButton>

                  <IconButton onClick={() => handleDelete(ad)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
}