import React from "react";

import Katalog from "../Katalog";

import { Link, useLocation } from "react-router-dom";

import BottomMenu from "../../components/MobileMenu";

function CreateCatalogPost() {
  const location = useLocation();

  // Biznes profilindən gələn məlumatlar
  const routeBusinessId = location.state?.businessId || null;
  const routeBusinessName = location.state?.businessName || "";
  const routeBusinessCategory = location.state?.businessCategory || null;

  // Əgər route state itərsə, sessionStorage-dan götür
  let savedBusinessContext = null;

  try {
    const saved = sessionStorage.getItem("businessAdContext");

    if (saved) {
      savedBusinessContext = JSON.parse(saved);
    }
  } catch (error) {
    console.error("❌ Business context oxunmadı:", error);
  }

  const businessId =
    routeBusinessId || savedBusinessContext?.businessId || null;

  const businessName =
    routeBusinessName || savedBusinessContext?.businessName || "";

  const businessCategory =
    routeBusinessCategory || savedBusinessContext?.businessCategory || null;

  console.log("🏪 CREATE CATALOG POST:");
  console.log("🏪 BUSINESS ID:", businessId);
  console.log("🏪 BUSINESS NAME:", businessName);
  console.log("🏪 BUSINESS CATEGORY:", businessCategory);

  return (
    <div className="mx-auto my-[50px] max-w-[1200px] min-h-screen p-4">
      <Link to="/">
        <button className="flex mt-4 items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Geri
        </button>
      </Link>

      <Katalog
        businessId={businessId}
        businessName={businessName}
        businessCategory={businessCategory}
      />

      <h1 className="text-[20px] text-center mt-[20%] sm:text-[30px] text-sm">
        Əlavə edəcəyiniz elana uyğun bölməni seçib elanınızı rahatlıqla
        yerləşdirə bilərsiniz
      </h1>

      <BottomMenu />
    </div>
  );
}

export default CreateCatalogPost;
