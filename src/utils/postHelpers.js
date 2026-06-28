// export const getBrand = (post) => {
//   if (!post) return "";

//   switch (post.category) {
//     case "car":
//       return post.car?.brand || "";

//     case "phone":
//       return post.phoneDetail?.brand || "";

//     case "electronics":
//       return post.electronics?.brand || "";

//     default:
//       return "";
//   }
// };

// export const getModel = (post) => {
//   if (!post) return "";

//   switch (post.category) {
//     case "car":
//       return post.car?.model || "";

//     case "phone":
//       return post.phoneDetail?.model || "";

//     case "electronics":
//       return post.electronics?.model || "";

//     default:
//       return "";
//   }
// };

// export const getLocation = (post) => {
//   if (!post) return "";

//   switch (post.category) {
//     case "realEstate":
//       return post.realEstate?.city || post.location;

//     default:
//       return post.location;
//   }
// };

// export const getTitle = (post) => {
//   if (!post) return "";

//   switch (post.category) {
//     case "car":
//       return `${post.car?.brand} ${post.car?.model}`;

//     case "phone":
//       return `${post.phoneDetail?.brand} ${post.phoneDetail?.model}`;

//     case "electronics":
//       return `${post.electronics?.brand} ${post.electronics?.model}`;

//     case "realEstate":
//       return `${post.realEstate?.city} ${post.realEstate?.rooms} otaqlı`;

//     default:
//       return post.title;
//   }
// };







// utils/cardHelpers.js

export const getCardData = (post) => {
  if (!post) {
    return {
      title: "",
      subtitle: "",
      brand: "",
      model: "",
      year: "",
      motor: "",
      km: "",
      location: "",
      price: 0,
    };
  }

  switch (post.category) {
    // ===========================
    // CAR
    // ===========================
    case "car":
      return {
        title:
          `${post.car?.brand || ""} ${post.car?.model || ""}`.trim(),

        subtitle: [
          post.car?.year,
          post.car?.motor,
          post.car?.km ? `${post.car.km} km` : "",
        ]
          .filter(Boolean)
          .join(" • "),

        brand: post.car?.brand || "",
        model: post.car?.model || "",
        year: post.car?.year || "",
        motor: post.car?.motor || "",
        km: post.car?.km || "",

        location: post.location || "",
        price: post.price || 0,
      };

    // ===========================
    // PHONE
    // ===========================
    case "phone":
      return {
        title:
          `${post.phoneDetail?.brand || ""} ${post.phoneDetail?.model || ""}`.trim(),

        subtitle: [
          post.phoneDetail?.storage
            ? `${post.phoneDetail.storage} GB`
            : "",
          post.phoneDetail?.ram
            ? `${post.phoneDetail.ram} GB RAM`
            : "",
          post.phoneDetail?.color,
        ]
          .filter(Boolean)
          .join(" • "),

        brand: post.phoneDetail?.brand || "",
        model: post.phoneDetail?.model || "",

        year: "",
        motor: "",
        km: "",

        location: post.location || "",
        price: post.price || 0,
      };

    // ===========================
    // ELECTRONICS
    // ===========================
    case "electronics":
      return {
        title:
          `${post.electronics?.brand || ""} ${post.electronics?.model || ""}`.trim(),

        subtitle: post.electronics?.type || "",

        brand: post.electronics?.brand || "",
        model: post.electronics?.model || "",

        year: "",
        motor: "",
        km: "",

        location: post.location || "",
        price: post.price || 0,
      };

    // ===========================
    // REAL ESTATE
    // ===========================
    case "realEstate":
      return {
        title: post.title || "Daşınmaz Əmlak",

        subtitle: [
          post.realEstate?.rooms
            ? `${post.realEstate.rooms} otaq`
            : "",
          post.realEstate?.area
            ? `${post.realEstate.area} m²`
            : "",
          post.realEstate?.floor
            ? `${post.realEstate.floor}. mərtəbə`
            : "",
        ]
          .filter(Boolean)
          .join(" • "),

        brand: "",
        model: "",
        year: "",
        motor: "",
        km: "",

        location:
          post.realEstate?.city ||
          post.location ||
          "",

        price: post.price || 0,
      };

    // ===========================
    // ACCESSORY
    // ===========================
    case "accessory":
      return {
        title: post.title || "",

        subtitle: [post.brand, post.model]
          .filter(Boolean)
          .join(" • "),

        brand: post.brand || "",
        model: post.model || "",

        year: "",
        motor: "",
        km: "",

        location: post.location || "",
        price: post.price || 0,
      };

    // ===========================
    // HOME GARDEN
    // ===========================
    case "homeGarden":
      return {
        title: post.title || "",

        subtitle: [post.brand, post.model]
          .filter(Boolean)
          .join(" • "),

        brand: post.brand || "",
        model: post.model || "",

        year: "",
        motor: "",
        km: "",

        location: post.location || "",
        price: post.price || 0,
      };

    // ===========================
    // HOUSEHOLD
    // ===========================
    case "household":
      return {
        title: post.title || "",

        subtitle: [post.brand, post.model]
          .filter(Boolean)
          .join(" • "),

        brand: post.brand || "",
        model: post.model || "",

        year: "",
        motor: "",
        km: "",

        location: post.location || "",
        price: post.price || 0,
      };

    // ===========================
    // CLOTHING
    // ===========================
    case "clothing":
      return {
        title: post.title || "",

        subtitle: [post.brand, post.model]
          .filter(Boolean)
          .join(" • "),

        brand: post.brand || "",
        model: post.model || "",

        year: "",
        motor: "",
        km: "",

        location: post.location || "",
        price: post.price || 0,
      };

    default:
      return {
        title: post.title || "",
        subtitle: "",

        brand: "",
        model: "",
        year: "",
        motor: "",
        km: "",

        location: post.location || "",
        price: post.price || 0,
      };
  }
};

export const getTitle = (post) => {
  return getCardData(post).title;
};

export const getLocation = (post) => {
  return getCardData(post).location;
};

export const getSubtitle = (post) => {
  return getCardData(post).subtitle;
};

export const getBrand = (post) => {
  return getCardData(post).brand;
};

export const getModel = (post) => {
  return getCardData(post).model;
};

export const getYear = (post) => {
  return getCardData(post).year;
};

export const getMotor = (post) => {
  return getCardData(post).motor;
};

export const getKm = (post) => {
  return getCardData(post).km;
};