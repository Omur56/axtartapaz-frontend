import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ArrowRight, ShoppingBag, ImageOff } from "lucide-react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  // ==============================
  // FAVORİTLƏRİ LOCALSTORAGE-DAN OXU
  // ==============================
  const loadFavorites = () => {
    try {
      const storedFavorites = localStorage.getItem("favorites");

      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);

        setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Favorites oxunarkən xəta:", error);
      setFavorites([]);
    }
  };

  useEffect(() => {
    loadFavorites();

    // Başqa səhifədə favorit dəyişəndə yenilə
    const handleStorageChange = () => {
      loadFavorites();
    };

    window.addEventListener("storage", handleStorageChange);

    // Eyni tab daxilində dəyişikliklər üçün custom event
    window.addEventListener("favoritesUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("favoritesUpdated", handleStorageChange);
    };
  }, []);

  // ==============================
  // FAVORİTDƏN SİL
  // ==============================
  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter(
      (item) => (item._id || item.id) !== id,
    );

    setFavorites(updatedFavorites);

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  // ==============================
  // ŞƏKİL URL-İ
  // ==============================
  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";

    if (typeof image === "object") {
      image = image.url || image.secure_url || image.path || image.src || "";
    }

    if (!image) return "/placeholder.png";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:")
    ) {
      return image;
    }

    return `${process.env.REACT_APP_API_URL}/uploads/${image}`;
  };

  // ==============================
  // İLK ŞƏKİL
  // ==============================
  const getFirstImage = (item) => {
    const image =
      item?.images?.[0] ||
      item?.imageUrls?.[0] ||
      item?.mainImage ||
      item?.image;

    return getImageUrl(image);
  };

  // ==============================
  // ROUTE
  // ==============================
  const getItemRoute = (item) => {
    const id = item?._id || item?.id;

    if (!id) return "/";

    switch (item?.category) {
      case "car":
        return `/PostDetailCar/${id}`;

      case "phone":
        return `/PostDetailPhone/${id}`;

      case "electronics":
        return `/PostDetailElectronics/${id}`;

      case "clothing":
        return `/PostDetailClothing/${id}`;

      case "realEstate":
        return `/PostRealEstate/${id}`;

      case "homeGarden":
        return `/PostDetailHome/${id}`;

      case "household":
        return `/PostDetailHousehold/${id}`;

      case "accessory":
        return `/PostDetailAcsesuar/${id}`;

      default:
        return `/${item?.category || "item"}/${id}`;
    }
  };

  // ==============================
  // BAŞLIQ
  // ==============================
  const getItemTitle = (item) => {
    if (item?.brand && item?.model) {
      return `${item.brand} ${item.model}`;
    }

    if (item?.brand) {
      return item.brand;
    }

    return item?.title || "Elan";
  };

  // ==============================
  // BOŞ FAVORİTLƏR
  // ==============================
  if (favorites.length === 0) {
    return (
      <div className="min-h-screen mt-[50px] mb-[50px] px-4 flex items-center justify-center">
        <div className="w-full max-w-md text-center">
          <div
            className="
              mx-auto
              w-24
              h-24
              rounded-full
              flex
              items-center
              justify-center
              bg-[#670fff]/10
              dark:bg-[#670fff]/15
              mb-6
            "
          >
            <Heart size={42} strokeWidth={1.7} className="text-[#670fff]" />
          </div>

          <h2
            className="
              text-2xl
              sm:text-3xl
              font-black
              text-gray-900
              dark:text-white
              mb-3
            "
          >
            Favoritləriniz boşdur
          </h2>

          <p
            className="
              text-gray-500
              dark:text-gray-400
              text-sm
              sm:text-base
              leading-6
              mb-7
            "
          >
            Bəyəndiyiniz elanları favoritlərə əlavə edin. Daha sonra onları
            buradan rahatlıqla tapa bilərsiniz.
          </p>

          <Link
            to="/"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-6
              h-12
              rounded-2xl
              bg-gradient-to-r
              from-[#670fff]
              to-[#8b5cf6]
              text-white
              font-bold
              shadow-lg
              shadow-[#670fff]/20
              hover:-translate-y-0.5
              transition-all
            "
          >
            <ShoppingBag size={19} />
            Elanlara bax
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        mt-[50px]
        mb-[50px]
        bg-gray-50
        dark:bg-[#080b14]
        transition-colors
      "
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-6 sm:py-8">
        {/* ==============================
            HEADER
        ============================== */}
        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
            mb-6
          "
        >
          <div>
            <div className="flex items-center gap-3">
              <div
                className="
                  w-11
                  h-11
                  rounded-2xl
                  bg-[#670fff]/10
                  dark:bg-[#670fff]/15
                  flex
                  items-center
                  justify-center
                "
              >
                <Heart
                  size={22}
                  className="text-[#670fff]"
                  fill="currentColor"
                />
              </div>

              <div>
                <h1
                  className="
                    text-2xl
                    sm:text-3xl
                    font-black
                    text-gray-900
                    dark:text-white
                  "
                >
                  Favoritlərim
                </h1>

                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                    mt-0.5
                  "
                >
                  {favorites.length} elan yadda saxlanılıb
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==============================
            CARDS
        ============================== */}
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            gap-3
            sm:gap-5
          "
        >
          {favorites.map((item) => {
            const itemId = item?._id || item?.id;
            const imageUrl = getFirstImage(item);
            const title = getItemTitle(item);

            return (
              <div
                key={itemId}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  bg-white
                  dark:bg-[#111625]
                  border
                  border-gray-100
                  dark:border-white/5
                  shadow-sm
                  hover:shadow-xl
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >
                {/* ==============================
                    IMAGE / LINK
                ============================== */}
                <Link to={getItemRoute(item)} className="block">
                  <div
                    className="
                      relative
                      w-full
                      aspect-[4/3]
                      overflow-hidden
                      bg-gray-100
                      dark:bg-[#0d111d]
                    "
                  >
                    <img
                      src={imageUrl}
                      alt={title}
                      className="
                        w-full
                        h-full
                        object-cover
                        group-hover:scale-105
                        transition-transform
                        duration-500
                      "
                      onError={(e) => {
                        if (e.currentTarget.src.includes("placeholder")) {
                          return;
                        }

                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />

                    {/* Gradient */}
                    <div
                      className="
                        absolute
                        inset-x-0
                        bottom-0
                        h-24
                        bg-gradient-to-t
                        from-black/60
                        to-transparent
                        pointer-events-none
                      "
                    />

                    {/* Favorite badge */}
                    <div
                      className="
                        absolute
                        top-2
                        left-2
                        w-9
                        h-9
                        rounded-full
                        bg-white/90
                        dark:bg-black/60
                        backdrop-blur-md
                        flex
                        items-center
                        justify-center
                        shadow-md
                      "
                    >
                      <Heart
                        size={18}
                        className="text-red-500"
                        fill="currentColor"
                      />
                    </div>

                    {/* Price */}
                    {item.price !== undefined &&
                      item.price !== null &&
                      item.price !== "" && (
                        <div
                          className="
                            absolute
                            bottom-2
                            left-2
                            px-3
                            py-1.5
                            rounded-xl
                            bg-black/70
                            backdrop-blur-md
                            text-white
                            text-sm
                            font-black
                          "
                        >
                          {Number(item.price).toLocaleString("az-AZ")} AZN
                        </div>
                      )}
                  </div>

                  {/* ==============================
                      CARD INFO
                  ============================== */}
                  <div className="p-3">
                    <h3
                      className="
                        font-bold
                        text-sm
                        sm:text-base
                        text-gray-900
                        dark:text-white
                        line-clamp-1
                      "
                    >
                      {title}
                    </h3>

                    {item.brand && item.model && (
                      <p
                        className="
                          mt-1
                          text-xs
                          sm:text-sm
                          text-gray-500
                          dark:text-gray-400
                          line-clamp-1
                        "
                      >
                        {item.brand} • {item.model}
                      </p>
                    )}

                    {item.location && (
                      <p
                        className="
                          mt-2
                          text-xs
                          text-gray-400
                          dark:text-gray-500
                          line-clamp-1
                        "
                      >
                        {item.location}
                      </p>
                    )}
                  </div>
                </Link>

                {/* ==============================
                    DELETE BUTTON
                ============================== */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFavorite(itemId);
                  }}
                  title="Favoritdən sil"
                  className="
                    absolute
                    top-2
                    right-2
                    w-9
                    h-9
                    rounded-full
                    bg-white/95
                    dark:bg-[#111625]/95
                    backdrop-blur-md
                    text-gray-500
                    dark:text-gray-300
                    flex
                    items-center
                    justify-center
                    shadow-md
                    opacity-100
                    sm:opacity-0
                    sm:group-hover:opacity-100
                    hover:bg-red-500
                    hover:text-white
                    dark:hover:bg-red-500
                    transition-all
                    duration-200
                  "
                >
                  <Trash2 size={17} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
