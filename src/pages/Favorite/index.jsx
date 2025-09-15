import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  // LocalStorage-dan oxumaq və güncəlləmək
  const loadFavorites = () => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    else setFavorites([]);
  };

  useEffect(() => {
    loadFavorites();

    // Home və ya digər səhifələrdə favoriti dəyişəndə dərhal güncəllə
    const handleStorageChange = () => {
      loadFavorites();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Favoriti silmək
  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter((item) => item._id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  if (favorites.length === 0)
    return <p  className="text-center mt-10 min-h-screen">Heç bir favoritiniz yoxdur.</p>;

  return (
    <div className="min-h-screen mt-[80px] mb-[50px]">
    <div className="max-w-5xl mx-auto p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 ">
      {favorites.map((item) => (
        <div key={item._id} className="relative border rounded-lg shadow p-2">
          <Link
            to={
              item.category === "item"
                ? `/${item.category}/${item._id}`
                : `/${item.category}/${item._id}` // kateqoriyaya uyğun route
            }
          >
            <img
              src={
                item.images?.[0]
                  ? item.images[0].startsWith("http")
                    ? item.images[0]
                    : `${process.env.REACT_APP_API_URL}/uploads/${item.images[0]}`
                  : "/placeholder.png"
              }
              alt={item.brand || item.title}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="font-bold mt-2">{item.price} AZN</h3>
            <p className="text-sm">
              {item.brand ? `${item.brand}, ${item.model}` : item.title}
            </p>
          </Link>
          <button
            onClick={() => removeFavorite(item._id)}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
          >
            Sil
          </button>
        </div>
      ))}
    </div>
    </div>
  );
};

export default Favorites;
