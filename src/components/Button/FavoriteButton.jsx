import React from "react";

const FavoriteButton = ({ item, favorites, setFavorites }) => {
  const isFavorite = favorites.some((fav) => fav._id === item._id);

  const toggleFavorite = () => {
    let updatedFavorites;
    if (isFavorite) {
      // Favoritdən sil
      updatedFavorites = favorites.filter((fav) => fav._id !== item._id);
    } else {
      // Favoritə əlavə et
      updatedFavorites = [...favorites, item];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
        isFavorite ? "bg-red-500 text-white" : "bg-gray-200 text-black"
      }`}
    >
      ♥
    </button>
  );
};

export default FavoriteButton;
