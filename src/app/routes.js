import { createBrowserRouter } from "react-router-dom";

// =========================
// LAYOUT
// =========================
import RootLayout from "../components/Main";

// =========================
// MAIN PAGES
// =========================
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Qaydalar from "../pages/Qaydalar";
import Yardim from "../pages/Yardım";
import Xidmetler from "../pages/Xidmetler";

import Search from "../pages/Search";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Favorites from "../pages/Favorite";

// =========================
// CATALOG
// =========================
import Katalog from "../pages/Katalog";
import CreateCatalogPost from "../pages/CreateCatalogPost";
import Cataloq from "../pages/Katalog/Cateqories/categories";

import Nəqliyyat from "../pages/Katalog/Neqliyyat";
import EvVəBag from "../pages/Katalog/Ev_veBag";
import Elektronika from "../pages/Katalog/Elektronika";
import Geyimlər from "../pages/Katalog/Geyimlər";
import Zinət_əşyaları from "../pages/Katalog/Zinət_əşyaları";
import Telefonlar from "../pages/Katalog/Telefonlar";
import Daşınmaz_əmlak from "../pages/Katalog/Daşınmaz_əmlak";
import Məişət_Texnikası from "../pages/Katalog/Məişət_Texnikası";
import Ehtiyyat_hissələri_ve_aksesuarlar from "../pages/Katalog/Ehtiyyat_hissələri_ve_aksesuarlar";

// =========================
// DETAIL PAGES
// =========================
import AdDetail from "../pages/AdDetail";

import PostDetalCar from "../pages/PostDetalCar";
import PostDetailHome from "../pages/PostDetailHome";
import PostDetailElectronika from "../pages/PostDetailElectronika";
import PostDetailAcsesuar from "../pages/PostDetailAcsesuar";
import PostRealEstate from "../pages/PostRealEstate";
import PostDetailHousehold from "../pages/PostDetailHousehold";
import PostDetailPhone from "../pages/PostDetailPhone";
import PostDetailClothing from "../pages/PostDetailClothing";
import PostDetailJewelry from "../pages/PostDetailJewelry";

// =========================
// AUTH / PASSWORD
// =========================
import ResetPassword from "../pages/ResetPassword";
import ForgotPassword from "../pages/ResetPassword/ForgotPassword";

// =========================
// ADMIN
// =========================
import Admin from "../pages/AdminPanel";
import AdminLogin from "../pages/AdminLogin";
import AdsPanel from "../pages/AdsPanel";

// =========================
// PAYMENT
// =========================
import PaymentPage from "../pages/PaymentPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";

// =========================
// INFORMATION
// =========================
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Terms from "../pages/Terms";
import Prohibited from "../pages/Prohibited";
import PostingRules from "../pages/PostingRules";
import BusinessProfile from "../pages/Business/BusinessProfile";
import CreateBusiness from "../pages/Business/CreateBusiness";
import PaymentResult from "../pages/PaymentResult.jsx";

// =====================================================
// ROUTER
// =====================================================

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,

    children: [
      // =================================================
      // HOME
      // =================================================

      {
        index: true,
        Component: Home,
      },

      // =================================================
      // PAYMENT
      // =================================================

      {
        path: "success",
        Component: Success,
      },

      {
        path: "cancel",
        Component: Cancel,
      },

      {
        path: "payment/:listingId",
        Component: PaymentPage,
      },

      {
        path: "/payment-result",
        Component: PaymentResult,
      },

      // =================================================
      // AUTH
      // =================================================

      {
        path: "login",
        Component: Login,
      },

      {
        path: "register",
        Component: Register,
      },

      {
        path: "forgot-password",
        Component: ForgotPassword,
      },

      {
        path: "/biznes/:slug",
        Component: BusinessProfile,
      },
      {
        path: "/biznes-yarat",
        Component: CreateBusiness,
      },
      {
        path: "reset-password",
        Component: ResetPassword,
      },

      // =================================================
      // MAIN PAGES
      // =================================================

      {
        path: "about",
        Component: About,
      },

      {
        path: "contact",
        Component: Contact,
      },

      {
        path: "qaydalar",
        Component: Qaydalar,
      },

      {
        path: "yardim",
        Component: Yardim,
      },

      {
        path: "xidmetler",
        Component: Xidmetler,
      },

      {
        path: "search",
        Component: Search,
      },

      {
        path: "favorites",
        Component: Favorites,
      },

      {
        path: "Profile",
        Component: Profile,
      },

      // =================================================
      // ADS
      // =================================================

      {
        path: "AdsPanel",
        Component: AdsPanel,
      },

      {
        path: "ads/:id",
        Component: AdDetail,
      },

      {
        path: "elan/:id",
        Component: PostDetailHome,
      },

      // =================================================
      // CATALOG
      // =================================================

      {
        path: "Katalog",
        Component: Katalog,
      },

      {
        path: "CreateCatalogPost",
        Component: CreateCatalogPost,
      },

      {
        path: "categories",
        Component: Cataloq,
      },

      // =================================================
      // CATALOG CATEGORY PAGES
      // =================================================

      {
        path: "Katalog/Nəqliyyat",
        Component: Nəqliyyat,
      },

      {
        path: "Katalog/Ev_veBag",
        Component: EvVəBag,
      },

      {
        path: "Katalog/Elektronika",
        Component: Elektronika,
      },

      {
        path: "Katalog/Geyimlər",
        Component: Geyimlər,
      },

      {
        path: "Katalog/Zinət_əşyaları",
        Component: Zinət_əşyaları,
      },

      {
        path: "Katalog/Telefonlar",
        Component: Telefonlar,
      },

      {
        path: "Katalog/Daşınmaz_əmlak",
        Component: Daşınmaz_əmlak,
      },

      {
        path: "Katalog/Məişət_Texnikası",
        Component: Məişət_Texnikası,
      },

      {
        path: "Katalog/Ehtiyyat_hissələri_ve_aksesuarlar",
        Component: Ehtiyyat_hissələri_ve_aksesuarlar,
      },

      // =================================================
      // CAR
      // =================================================

      {
        path: "car/:id/:title?",
        Component: PostDetalCar,
      },

      {
        path: "cars/:id/:title?",
        Component: PostDetalCar,
      },

      {
        path: "ads/car/:id/:title?",
        Component: PostDetalCar,
      },

      {
        path: "PostDetalCar/:id/:title?",
        Component: PostDetalCar,
      },

      // =================================================
      // HOME & GARDEN
      // =================================================

      {
        path: "homeGarden/:id/:title?",
        Component: PostDetailHome,
      },

      {
        path: "ads/homeGarden/:id/:title?",
        Component: PostDetailHome,
      },

      {
        path: "PostDetailHome/:id/:title?",
        Component: PostDetailHome,
      },

      // =================================================
      // ELECTRONICS
      // =================================================

      {
        path: "electronics/:id/:title?",
        Component: PostDetailElectronika,
      },

      {
        path: "ads/electronics/:id/:title?",
        Component: PostDetailElectronika,
      },

      {
        path: "PostDetailElectronika/:id/:title?",
        Component: PostDetailElectronika,
      },

      // =================================================
      // ACCESSORIES
      // =================================================

      {
        path: "accessories/:id/:title?",
        Component: PostDetailAcsesuar,
      },

      {
        path: "ads/accessories/:id/:title?",
        Component: PostDetailAcsesuar,
      },

      {
        path: "PostDetailAcsesuar/:id/:title?",
        Component: PostDetailAcsesuar,
      },
      {
        path: "accessory/:id/:title?",
        Component: PostDetailAcsesuar,
      },

      // =================================================
      // REAL ESTATE
      // =================================================

      {
        path: "realEstate/:id/:title?",
        Component: PostRealEstate,
      },

      {
        path: "ads/realEstate/:id/:title?",
        Component: PostRealEstate,
      },

      {
        path: "PostRealEstate/:id/:title?",
        Component: PostRealEstate,
      },

      // =================================================
      // HOUSEHOLD
      // =================================================

      {
        path: "Household/:id/:title?",
        Component: PostDetailHousehold,
      },

      {
        path: "household/:id/:title?",
        Component: PostDetailHousehold,
      },

      {
        path: "ads/Household/:id/:title?",
        Component: PostDetailHousehold,
      },

      {
        path: "ads/household/:id/:title?",
        Component: PostDetailHousehold,
      },

      {
        path: "PostDetailHousehold/:id/:title?",
        Component: PostDetailHousehold,
      },

      // =================================================
      // PHONE
      // =================================================

      {
        path: "Phone/:id/:title?",
        Component: PostDetailPhone,
      },

      {
        path: "phone/:id/:title?",
        Component: PostDetailPhone,
      },

      {
        path: "ads/Phone/:id/:title?",
        Component: PostDetailPhone,
      },

      {
        path: "ads/phone/:id/:title?",
        Component: PostDetailPhone,
      },

      {
        path: "PostDetailPhone/:id/:title?",
        Component: PostDetailPhone,
      },

      // =================================================
      // CLOTHING
      // =================================================

      {
        path: "Clothing/:id/:title?",
        Component: PostDetailClothing,
      },

      {
        path: "clothing/:id/:title?",
        Component: PostDetailClothing,
      },

      {
        path: "ads/Clothing/:id/:title?",
        Component: PostDetailClothing,
      },

      {
        path: "ads/clothing/:id/:title?",
        Component: PostDetailClothing,
      },

      {
        path: "PostDetailClothing/:id/:title?",
        Component: PostDetailClothing,
      },

      // =================================================
      // JEWELRY
      // =================================================

      {
        path: "Zinet/:id/:title?",
        Component: PostDetailJewelry,
      },

      {
        path: "zinet/:id/:title?",
        Component: PostDetailJewelry,
      },

      {
        path: "ads/Zinet/:id/:title?",
        Component: PostDetailJewelry,
      },

      {
        path: "ads/zinet/:id/:title?",
        Component: PostDetailJewelry,
      },

      {
        path: "PostDetailJewelry/:id/:title?",
        Component: PostDetailJewelry,
      },

      // =================================================
      // ADMIN
      // =================================================

      {
        path: "AdminPanel",
        Component: Admin,
      },

      {
        path: "admin/login",
        Component: AdminLogin,
      },

      // =================================================
      // INFORMATION / RULES
      // =================================================

      {
        path: "privacy-policy",
        Component: PrivacyPolicy,
      },

      {
        path: "prohibited",
        Component: Prohibited,
      },

      {
        path: "posting-rules",
        Component: PostingRules,
      },

      {
        path: "terms",
        Component: Terms,
      },
    ],
  },
]);

export default router;