// AdsList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdsList = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/ads`);
        setAds(res.data);
      } catch (err) {
        console.error("Elanları gətirərkən xəta:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  if (loading) return <p>Yüklənir...</p>;
  if (!ads.length) return <p>Heç bir elan yoxdur.</p>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {ads.map((ad) => (
        <div
          key={ad._id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            width: "250px",
          }}
        >
          {ad.images && ad.images.length > 0 && (
            <img
              src={ad.images[0]} // İlk şəkil kart üçün
              alt={ad.title}
              style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }}
            />
          )}
          <h3 style={{ margin: "10px 0 5px" }}>{ad.title}</h3>
          <p style={{ fontSize: "14px", marginBottom: "5px" }}>{ad.description}</p>
          {ad.link && (
            <a href={ad.link} target="_blank" rel="noopener noreferrer">
              Ətraflı bax
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdsList;
