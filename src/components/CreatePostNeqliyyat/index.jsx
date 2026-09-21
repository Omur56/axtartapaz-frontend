import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useLocation } from "react-router-dom";
import index from "./index.css";
import {
  X,
  Search,
  MapPin,
  Edit3,
  Trash2,
  Plus,
  ImagePlus,
  Heart,
  Star,
} from "lucide-react";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import confetti from "canvas-confetti";
import Checkbox from "@mui/material/Checkbox";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import CitySelect from "./CitySelect";


export default function CreatePost() {
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [checked, setChecked] = React.useState(false);
  const [price, setPrice] = useState("");
  const [mainImageIndex, setMainImageIndex] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [imageClose, setImageClose] = useState(false);
  const [modelImagePreview, setModelImagePreview] = useState("");
  const [handleModelImageChange, setHandleModelImageChange] = useState(null);
  // const [options, setOptions] = useState({
  //   credit: false,
  //   barter: false,
  //   salon: false,
  // });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  
const [query, setQuery] = useState("");
const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  

const [form, setForm] = useState({
  id: Date.now(),
  title: "",
  modification: "",
  color: "",
  type: "",
  city: "",
  category: "",
  generation: "",
  brand: "",
  model: "",
  ban_type: "",
  year: "",
  price: "",
  location: "",
  description: "",
  images: [],
  km: "",
  motor: "",
  salon: false,
  barter: false,
  transmission: "",
  credit: false,
  engine: "",
  type_magasine: "",
  contact: {
    name: "",
    email: "",
    phone: "",
  },
  liked: false,
  favorite: false,
  createdAt: new Date(),
});

  const location = useLocation();

  // =====================================================
  // BİZNES PROFİLİNDƏN GƏLƏN MƏLUMATLAR
  // =====================================================

const savedBusinessContext = JSON.parse(
  sessionStorage.getItem("businessAdContext") || "null",
);

const businessId =
  location.state?.businessId || savedBusinessContext?.businessId || null;

const businessName =
  location.state?.businessName || savedBusinessContext?.businessName || "";

const businessCategory =
  location.state?.businessCategory ||
  savedBusinessContext?.businessCategory ||
  null;

console.log("🏪 BUSINESS ID:", businessId);
console.log("🏪 BUSINESS NAME:", businessName);
console.log("🏪 BUSINESS CATEGORY:", businessCategory);

  console.log("🏪 BUSINESS ID:", businessId);
  console.log("🏪 BUSINESS NAME:", businessName);
  console.log("🏪 BUSINESS CATEGORY:", businessCategory);



  const typeOptions = ["sifarisle", "magaza", "resmi"];

  const carData = {
    Bmw: [
      {
        model: "X5",
        motor: ["2.0", "3.0", "4.0"],
        ban_type: ["Sedan", "Hatchback"],
        transmission: ["Avtomat", "Mexanika"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi", "Gold", "Berj"],
        year: Array.from(
          { length: new Date().getFullYear() - 1980 + 1 },
          (_, i) => String(1980 + i),
        ),
        engine: ["Benzin", "Dizel", "Hibrid"],
        salon: ["Dəri", "Parça"],
        modfikasiya: ["Ön"],
      },
    ],

    Audi: [
      {
        model: "A4",
        motor: ["2.0", "3.0", "4.0"],
        ban_type: ["Sedan", "Hatchback"],
        transmission: ["Avtomat", "Mexanika"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi", "Gold", "Berj"],
        year: Array.from(
          { length: new Date().getFullYear() - 1980 + 1 },
          (_, i) => String(1980 + i),
        ),
        engine: ["Benzin", "Dizel", "Hibrid"],
        salon: ["Dəri", "Parça"],
        modfikasiya: ["Ön"],
      },
    ],

    Mercedess: [
      {
        model: "Gle",
        motor: ["2.0", "3.0", "4.0"],
        ban_type: ["Sedan", "Hatchback"],
        transmission: ["Avtomat", "Mexanika"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi", "Gold", "Berj"],
        year: Array.from(
          { length: new Date().getFullYear() - 1980 + 1 },
          (_, i) => String(1980 + i),
        ),
        engine: ["Benzin", "Dizel", "Hibrid"],
        salon: ["Dəri", "Parça"],
        modfikasiya: ["Ön"],
      },
      {
        model: "GLC",
        motor: ["2.0", "3.0", "4.0"],
        ban_type: ["Sedan", "Hatchback"],
        transmission: ["Avtomat", "Mexanika"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi"],
        year: Array.from(
          { length: new Date().getFullYear() - 1980 + 1 },
          (_, i) => String(1980 + i),
        ),
        engine: ["Benzin", "Dizel", "Hibrid"],
        salon: ["Dəri", "Parça"],
        modfikasiya: ["Ön"],
      },
      {
        model: "GLE",
        motor: ["2.0", "3.0", "4.0"],
        ban_type: ["Sedan", "Hatchback"],
        transmission: ["Avtomat", "Mexanika"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi"],
        year: Array.from(
          { length: new Date().getFullYear() - 1980 + 1 },
          (_, i) => String(1980 + i),
        ),
        engine: ["Benzin", "Dizel", "Hibrid"],
        salon: ["Dəri", "Parça"],
        modfikasiya: ["Ön"],
      },
      {
        model: "GLA",
        motor: ["2.0", "3.0", "4.0"],
        ban_type: ["Sedan", "Hatchback"],
        transmission: ["Avtomat", "Mexanika"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi"],
        year: Array.from(
          { length: new Date().getFullYear() - 1980 + 1 },
          (_, i) => String(1980 + i),
        ),
        engine: ["Benzin", "Dizel", "Hibrid"],
        salon: ["Dəri", "Parça"],
        modfikasiya: ["Ön"],
      },
      {
        model: "170 S",
        motor: ["1.8 L / 52 a.g."],
        year: ["1950", "1951", "1952", "1949"],
        ban_type: ["Sedan", "Kabrolet"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi", "Gold", "Berj"],
        engine: ["Benzin", "Dizel", "Hibrid"],
        modfikasiya: ["Ön"],
        transmission: ["Mexanika"],
        salon: ["Dəri", "Parça"],
      },

      {
        model: "A-Class",

        generation: [
          {
            name: "A 140",
            year: Array.from(
              { length: new Date().getFullYear() - 1980 + 1 },
              (_, i) => String(1980 + i),
            ),
            color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi", "Gold", "Berj"],
          },

          {
            name: "A 160",
            year: Array.from(
              { length: new Date().getFullYear() - 1980 + 1 },
              (_, i) => String(1980 + i),
            ),
            color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi", "Gold", "Berj"],
          },

          {
            name: "A 170",
            year: Array.from(
              { length: new Date().getFullYear() - 1980 + 1 },
              (_, i) => String(1980 + i),
            ),
            color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi", "Gold", "Berj"],
          },
          {
            name: "A 180",
            year: Array.from(
              { length: new Date().getFullYear() - 1980 + 1 },
              (_, i) => String(1980 + i),
            ),
            color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi", "Gold", "Berj"],
          },
          {
            name: "A 190",
            year: Array.from(
              { length: new Date().getFullYear() - 1980 + 1 },
              (_, i) => String(1980 + i),
            ),
            color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi", "Gold", "Berj"],
          },
          {
            name: "A 200",
            year: Array.from(
              { length: new Date().getFullYear() - 1980 + 1 },
              (_, i) => String(1980 + i),
            ),
            color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi", "Gold", "Berj"],
          },
          {
            name: "A 220",
            year: Array.from(
              { length: new Date().getFullYear() - 1980 + 1 },
              (_, i) => String(1980 + i),
            ),
            color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi", "Gold", "Berj"],
          },

          {
            name: "A 220 MATIC",
            year: Array.from(
              { length: new Date().getFullYear() - 1980 + 1 },
              (_, i) => String(1980 + i),
            ),
            color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi", "Gold", "Berj"],
          },

          {
            name: "A 220 E",
            year: Array.from(
              { length: new Date().getFullYear() - 1980 + 1 },
              (_, i) => String(1980 + i),
            ),
            color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi", "Gold", "Berj"],
          },
        ],

        motor: [
          "1.4 l / 82 a.g.",
          "1.6 l / 82 a.g.",
          "1.6 l / 102 a.g.",
          "1.9 l / 125 a.g.",
          "2.1 l / 140 a.g.",
        ],
        ban_type: ["Sedan", "Hatchback"],
        transmission: ["Avtomat", "Mexanika"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi", "Gold", "Berj"],
        year: Array.from(
          { length: new Date().getFullYear() - 1980 + 1 },
          (_, i) => String(1980 + i),
        ),
        engine: ["Benzin", "Dizel", "Hibrid"],
        salon: ["Dəri", "Parça"],
        modfikasiya: ["Ön"],
      },
    ],
    Chevrolet: [
      {
        model: "Cruze",
        imagesByYear: {
          2009: "../../../public/assets/car_image_list/chevrolet-cruze.jpg",
          2010: "../../../public/assets/car_image_list/chevrolet-cruze.jpg",
          2011: "../../../public/assets/car_image_list/chevrolet-cruze.jpg",
          2012: "../../../public/assets/car_image_list/chevrolet-cruze.jpg",
          2013: "../../../public/assets/car_image_list/chevrolet-cruze.jpg",

          2014: "../../../public/assets/car_image_list/chevrolet-cruze-2012-2016.png",

          2015: "../../../public/assets/car_image_list/2015-Chevrolet-Cruze.jpg",

          2016: "../../../public/assets/car_image_list/chevrolet-cruze-2016-2019.png",
          2017: "../../../public/assets/car_image_list/chevrolet-cruze-2016-2019.png",
          2018: "../../../public/assets/car_image_list/chevrolet-cruze-2016-2019.png",
          2019: "../../../public/assets/car_image_list/chevrolet-cruze-2016-2019.png",

          2020: "../../../public/assets/car_image_list/chevrolet-cruze-2020.jpg",

          2021: "../../../public/assets/car_image_list/chevrolet-cruze-2021.jpg",

          2022: "../../../public/assets/car_image_list/cruze-2016-2026.jpg",
          2023: "../../../public/assets/car_image_list/cruze-2016-2026.jpg",
          2024: "../../../public/assets/car_image_list/cruze-2016-2026.jpg",
          2025: "../../../public/assets/car_image_list/cruze-2016-2026.jpg",
        },
        motor: ["1.4", "1.6", "1.8"],
        ban_type: ["Sedan", "Hatchback"],
        transmission: ["Avtomat", "Mexanika"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi"],
        engine: ["Benzin", "Dizel", "Hibrid"],
        salon: ["Dəri", "Parça"],
        modfikasiya: ["Ön"],
      },

      {
        model: "Aveo",
        motor: ["1.4", "1.6", "1.8"],
        ban_type: ["Sedan", "Hatchback"],
        transmission: ["Avtomat", "Mexanika"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi"],
        year: Array.from(
          { length: new Date().getFullYear() - 1980 + 1 },
          (_, i) => String(1980 + i),
        ),
        engine: ["Benzin", "Dizel", "Hibrid"],
        salon: ["Dəri", "Parça"],
        modfikasiya: ["Ön"],
      },
      {
        model: "Camaro",
        motor: ["2.0", "3.0", "5.0"],
        ban_type: ["Coupe"],
        transmission: ["Avtomat", "Mexanika"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi"],
        year: Array.from(
          { length: new Date().getFullYear() - 1980 + 1 },
          (_, i) => String(1980 + i),
        ),
        engine: ["Benzin"],
        salon: ["Dəri", "Parça"],
        modfikasiya: ["Arxa"],
      },
      {
        model: "Malibu",
        motor: ["1.5", "2.0", "2.5"],
        ban_type: ["Sedan"],
        transmission: ["Avtomat", "Mexanika"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi"],
        year: Array.from(
          { length: new Date().getFullYear() - 1980 + 1 },
          (_, i) => String(1980 + i),
        ),
        engine: ["Benzin", "Hibrid"],
        salon: ["Dəri", "Parça"],
        modfikasiya: ["Ön"],
      },
      {
        model: "Niva",
        motor: ["1.5", "1.7"],
        ban_type: ["SUV"],
        transmission: ["Mexanika"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi"],
        year: Array.from(
          { length: new Date().getFullYear() - 1980 + 1 },
          (_, i) => String(1980 + i),
        ),
        engine: ["Benzin"],
        salon: ["Parça"],
        modfikasiya: ["Tam"],
      },
      {
        model: "Tahoe",
        motor: ["5.3", "6.2"],
        ban_type: ["SUV"],
        transmission: ["Avtomat"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi"],
        year: Array.from(
          { length: new Date().getFullYear() - 1980 + 1 },
          (_, i) => String(1980 + i),
        ),
        engine: ["Benzin"],
        salon: ["Dəri"],
        modfikasiya: ["Tam"],
      },
      {
        model: "Tracker",
        motor: ["1.4", "1.6"],
        ban_type: ["SUV"],
        transmission: ["Avtomat", "Mexanika"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi"],
        year: Array.from(
          { length: new Date().getFullYear() - 1980 + 1 },
          (_, i) => String(1980 + i),
        ),
        engine: ["Benzin"],
        salon: ["Parça"],
        modfikasiya: ["Ön"],
      },
      {
        model: "Orlando",
        motor: ["1.8"],
        ban_type: ["MPV"],
        transmission: ["Avtomat"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi"],
        year: Array.from(
          { length: new Date().getFullYear() - 1980 + 1 },
          (_, i) => String(1980 + i),
        ),
        engine: ["Benzin"],
        salon: ["Dəri"],
        modfikasiya: ["Ön"],
      },
      {
        model: "Spin",
        motor: ["1.8"],
        ban_type: ["MPV"],
        transmission: ["Avtomat"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi"],
        year: Array.from(
          { length: new Date().getFullYear() - 1980 + 1 },
          (_, i) => String(1980 + i),
        ),
        engine: ["Benzin"],
        salon: ["Dəri"],
        modfikasiya: ["Ön"],
      },
      {
        model: "Sail",
        motor: ["1.5"],
        ban_type: ["Sedan"],
        transmission: ["Avtomat", "Mexanika"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi"],
        year: Array.from(
          { length: new Date().getFullYear() - 1980 + 1 },
          (_, i) => String(1980 + i),
        ),
        engine: ["Benzin"],
        salon: ["Dəri", "Parça"],
        modfikasiya: ["Ön"],
      },
      {
        model: "Rezzo",
        motor: ["1.8"],
        ban_type: ["MPV"],
        transmission: ["Avtomat"],
        color: ["Ağ", "Qara", "Gümüşü", "Qırmızı", "Mavi"],
        year: ["2015", "2016", "2017", "2018", "2019", "2020", "2024", "2025"],
        engine: ["Benzin"],
        salon: ["Dəri"],
        modfikasiya: ["Ön"],
      },
    ],
  };

  // const handleChangeSelect = (e) => {
  //   const { name, checked } = e.target;

  //   setOptions((prev) => ({
  //     ...prev,
  //     [name]: checked,
  //   }));

  //   setForm((prev) => ({
  //     ...prev,
  //     [name]: checked ? "Bəli" : "Xeyr",
  //   }));
  // };

  // const handleChangeSelect = (e) => {
  //   const {name, checked} = e.target;
  //   setOptions((prev) => ({
  //     ...prev,
  //     [name]: checked,
  //   }));
  // setForm((prev) =>({
  //   ...prev,
  //   [name]: checked,
  // }));
  // }

  const official_store_salon_checked_group = (e) => {
    const { name } = e.target;

    setForm((prev) => ({
      ...prev,
      type: prev.type === name ? "" : name,
    }));
  };
  const [cars, setCars] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // CONTACT
    if (name.startsWith("contact.")) {
      const field = name.split(".")[1];

      if (field === "phone") {
        let digits = value.replace(/\D/g, "");

        // +994 ilə daxil edilərsə
        if (digits.startsWith("994")) {
          digits = digits.slice(3);
        }

        digits = digits.slice(0, 9);

        let formatted = "+994";

        if (digits.length > 0) {
          formatted += "-" + digits.slice(0, 2);
        }

        if (digits.length > 2) {
          formatted += "-" + digits.slice(2, 5);
        }

        if (digits.length > 5) {
          formatted += "-" + digits.slice(5, 7);
        }

        if (digits.length > 7) {
          formatted += "-" + digits.slice(7, 9);
        }

        setForm((prev) => ({
          ...prev,
          contact: {
            ...prev.contact,
            phone: formatted,
          },
        }));

        return;
      }

      setForm((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [field]: value,
        },
      }));

      return;
    }

    // QİYMƏT
    if (name === "price") {
      const cleanedValue = value.replace(/\D/g, "");

      const formatted = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

      setForm((prev) => ({
        ...prev,
        price: formatted,
      }));

      return;
    }

    // KM
    if (name === "km") {
      const cleanedValue = value.replace(/\D/g, "");

      const formatted = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

      setForm((prev) => ({
        ...prev,
        km: formatted,
      }));

      return;
    }

    // DİGƏR INPUTLAR
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
 const handleFileChange = (e) => {
   const files = Array.from(e.target.files || []);

   if (!files.length) return;

   setForm((prev) => {
     const totalImages = [...prev.images, ...files];

     if (totalImages.length > 20) {
       Swal.fire({
         icon: "warning",
         title: "Maksimum 20 şəkil",
         text: "Ən çox 20 şəkil yükləyə bilərsiniz.",
       });

       return prev;
     }

     return {
       ...prev,
       images: totalImages,
     };
   });

   if (form.images.length === 0) {
     setMainImageIndex(0);
   }

   e.target.value = "";
  };
  

  const handleRemoveImage = (index) => {
    setPreview((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };



const fetchCars = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/car`);

    const data = Array.isArray(res.data) ? res.data : res.data?.ads || [];

    setCars(data);
    
  } catch (err) {
    console.error("Elanları gətirmək mümkün olmadı:", err);
  }
};

  // ❌ contact burada YOXDUR
const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // =====================================================
  // LOGIN YOXLAMASI
  // =====================================================

  if (!token || !userId) {
    Swal.fire({
      icon: "warning",
      title: "Giriş tələb olunur",
      text: "Elan paylaşmaq üçün hesabınıza daxil olun.",
      confirmButtonText: "Bağla",
    });

    return;
  }

  // =====================================================
  // BİZNES KATEQORİYASI YOXLAMASI
  // =====================================================

  if (businessId && businessCategory !== "car") {
    Swal.fire({
      icon: "warning",
      title: "Yanlış kateqoriya",
      text: `${
        businessName || "Bu biznes"
      } avtomobil kateqoriyasına aid deyil.`,
      confirmButtonText: "Bağla",
    });

    return;
  }

  setIsUploading(true);
  setUploadProgress(0);

  const formData = new FormData();

  // =====================================================
  // ŞƏKİLLƏR
  // =====================================================

  form.images.forEach((file) => {
    formData.append("images", file);
  });

  // =====================================================
  // ƏSAS ŞƏKİL
  // =====================================================

  if (mainImageIndex !== null) {
    formData.append("mainImageIndex", mainImageIndex);
  }

  // =====================================================
  // QİYMƏT
  // =====================================================

  const cleanedPrice = Number(String(form.price || "").replace(/\s/g, ""));

  // =====================================================
  // KM
  // =====================================================

  const cleanedKm = Number(String(form.km || "").replace(/\s/g, ""));

  // =====================================================
  // CAR OBJECT
  // =====================================================

  const carObject = {
    title: form.title,

    brand: form.brand,

    model: form.model,

    ban_type: form.ban_type,

    year: form.year,

    engine: form.engine,

    motor: form.motor,

    transmission: form.transmission,

    km: isNaN(cleanedKm) ? 0 : cleanedKm,

    color: form.color,

    modification: form.modification,

    generation: form.generation,

    credit: Boolean(form.credit),

    barter: Boolean(form.barter),

    salon: Boolean(form.salon),

    type_magasine: form.type_magasine,

    contact: {
      name: form.contact.name || "",

      email: form.contact.email || "",

      phone: form.contact.phone || "",
    },
  };

  // =====================================================
  // CAR MƏLUMATLARI
  // =====================================================

  formData.set("car", JSON.stringify(carObject));

  // =====================================================
  // ELAN MƏLUMATLARI
  // =====================================================

  formData.set("price", isNaN(cleanedPrice) ? 0 : cleanedPrice);

  formData.set("location", form.location || "");

  formData.set("description", form.description || "");

  // =====================================================
  // BİZNES ID
  // =====================================================

  // Şəxsi elandırsa businessId göndərilmir.
  // Biznesdən yerləşdirilirsə businessId göndərilir.

  if (businessId) {
    formData.set("businessId", businessId);
  }

  // =====================================================
  // API
  // =====================================================

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/car`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,

          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) {
            return;
          }

          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );

          setUploadProgress(percent);
        },
      },
    );

    console.log("✅ Elan yaradıldı:", response.data);

    // ===================================================
    // FORMU SIFIRLA
    // ===================================================

    resetForm();

    await fetchCars();

    // ===================================================
    // SUCCESS
    // ===================================================

    Swal.fire({
      icon: "success",

      title: "Elan uğurla yerləşdirildi!",

      text: businessId
        ? `${businessName || "Biznes"} profilinə elan əlavə edildi.`
        : "Elanınız uğurla yerləşdirildi.",

      confirmButtonText: "Bağla",
    });
  } catch (err) {
    console.error("❌ Elan yerləşdirmə xətası:", err);

    Swal.fire({
      icon: "error",

      title: "Xəta baş verdi",

      text: err.response?.data?.message || "Elan yerləşdirilə bilmədi.",

      confirmButtonText: "Bağla",
    });
  } finally {
    setIsUploading(false);

    setUploadProgress(0);
  }
};

  const resetForm = () => {
  setForm({
    id: Date.now(),
    title: "",
    modification: "",
    color: "",
    type: "",
    city: "",
    category: "",
    generation: "",
    brand: "",
    model: "",
    ban_type: "",
    year: "",
    price: "",
    location: "",
    description: "",
    images: [],
    km: "",
    motor: "",
    salon: false,
    barter: false,
    transmission: "",
    credit: false,
    engine: "",
    type_magasine: "",
    contact: {
      name: "",
      email: "",
      phone: "",
    },
    liked: false,
    favorite: false,
    createdAt: new Date(),
  });

  setImages([]);
  setPreview([]);
  setEditingId(null);
  setMainImageIndex(null);
  setModelImagePreview("");
};

  
  function handleClick(event) {
    event.preventDefault();
  }

  const selectedModel =
    form.brand &&
    carData[form.brand]?.find((item) => item.model === form.model);
useEffect(() => {
  if (!form.brand || !form.model || !form.year) {
    setModelImagePreview("");
    return;
  }

  const model = carData[form.brand]?.find((item) => item.model === form.model);

  if (!model) {
    setModelImagePreview("");
    return;
  }

  if (model.imagesByYear?.[form.year]) {
    setModelImagePreview(model.imagesByYear[form.year]);
    return;
  }

  setModelImagePreview("");
}, [form.brand, form.model, form.year]);

useEffect(() => {
  const loadCars = async () => {
    setIsLoading(true);

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/car`);

      const data = Array.isArray(res.data) ? res.data : res.data?.ads || [];

      setCars(data);
    } catch (err) {
      console.error("API xətası:", err);

      setCars([]);
    } finally {
      setIsLoading(false);
    }
  };

  loadCars();
}, []);

  const handleEdit = (car) => {
    setForm({
      ...form,
      ...car,
      contact: {
        name: car?.contact?.name || "",
        email: car?.contact?.email || "",
        phone: car?.contact?.phone || "",
      },
    });

    setEditingId(car._id || car.id);

    const serverImages = Array.isArray(car.images)
      ? car.images
          .map((img) => {
            if (typeof img === "string") return img;
            return img?.url || img?.secure_url || img?.path || "";
          })
          .filter(Boolean)
      : car.mainImage
        ? [car.mainImage]
        : [];

    setPreview(serverImages);
    setImages([]);

    setIsOpen(true);
  };


  const apiUrls = [`${process.env.REACT_APP_API_URL}/api/car`];

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const requests = apiUrls.map((url) => axios.get(url));

      const responses = await Promise.all(requests);

      let allData = [];

      responses.forEach((res) => {
        if (Array.isArray(res.data)) {
          allData = allData.concat(res.data);
        } else if (Array.isArray(res.data?.ads)) {
          allData = allData.concat(res.data.ads);
        }
      });

      const searchText = query.toLowerCase();

      const filtered = allData.filter((item) => {
        const title = String(item.title || "").toLowerCase();
        const brand = String(item.brand || item.car?.brand || "").toLowerCase();
        const category = String(item.category || "").toLowerCase();
        const model = String(item.model || item.car?.model || "").toLowerCase();
        const location = String(item.location || "").toLowerCase();
        const city = String(item.city || "").toLowerCase();
        const engine = String(
          item.engine || item.car?.engine || "",
        ).toLowerCase();
        const year = String(item.year || item.car?.year || "").toLowerCase();
        const motor = String(item.motor || item.car?.motor || "").toLowerCase();
        const transmission = String(
          item.transmission || item.car?.transmission || "",
        ).toLowerCase();
        const ban_type = String(
          item.ban_type || item.car?.ban_type || "",
        ).toLowerCase();
        const price = String(item.price || "").toLowerCase();
        const description = String(item.description || "").toLowerCase();

        return (
          title.includes(searchText) ||
          brand.includes(searchText) ||
          category.includes(searchText) ||
          location.includes(searchText) ||
          model.includes(searchText) ||
          city.includes(searchText) ||
          engine.includes(searchText) ||
          year.includes(searchText) ||
          motor.includes(searchText) ||
          transmission.includes(searchText) ||
          ban_type.includes(searchText) ||
          price.includes(searchText) ||
          description.includes(searchText)
        );
      });

      setResults(filtered);
    } catch (error) {
      console.error("API axtarış xətası:", error);

      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const token = localStorage.getItem("token");

  const handleOpenForm = () => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Elan paylaşmaq üçün hesabınıza daxil olun.",
        confirmButtonColor: "#3085d6",
      });

      return;
    }

    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Elan silinsin?",
      text: "Bu əməliyyatı geri qaytarmaq mümkün olmayacaq.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Ləğv et",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${process.env.REACT_APP_API_URL}/api/car/${id}`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

    await fetchCars();

      Swal.fire({
        icon: "success",
        title: "Elan silindi",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Delete error:", error);

      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text: error.response?.data?.message || "Elan silinə bilmədi.",
        confirmButtonColor: "#ef4444",
      });
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return "";

    const postDate = new Date(dateString);

    if (Number.isNaN(postDate.getTime())) {
      return "";
    }

    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const postDay = new Date(
      postDate.getFullYear(),
      postDate.getMonth(),
      postDate.getDate(),
    );

    const diffTime = today.getTime() - postDay.getTime();

    const oneDay = 24 * 60 * 60 * 1000;

    if (diffTime === 0) {
      return "bugün";
    }

    if (diffTime === oneDay) {
      return "dünən";
    }

    return postDate.toLocaleDateString("az-AZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (!form.brand || !form.model || !form.year) {
      setModelImagePreview("");
      return;
    }

    const model = carData[form.brand]?.find(
      (item) => item.model === form.model,
    );

    if (!model) {
      setModelImagePreview("");
      return;
    }

    if (model.imagesByYear?.[form.year]) {
      setModelImagePreview(model.imagesByYear[form.year]);

      return;
    }

    setModelImagePreview("");
  }, [form.brand, form.model, form.year]);

  const modernInputClass = `
  w-full
  h-12
  px-4
  rounded-xl
  border
  border-slate-200
  dark:border-slate-700
  bg-white
  dark:bg-slate-900
  text-slate-800
  dark:text-white
  text-sm
  outline-none
  transition-all
  duration-200
  hover:border-slate-300
  dark:hover:border-slate-600
  focus:border-blue-500
  focus:ring-4
  focus:ring-blue-500/10
  disabled:bg-slate-100
  dark:disabled:bg-slate-800
  disabled:text-slate-400
  disabled:cursor-not-allowed
`;

  const modernLabelClass = `
  block
  text-xs
  font-bold
  text-slate-600
  dark:text-slate-300
  mb-2
`;
  return (
    <div className="min-h-screen ">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="w-full justify-center  mx-auto my-auto max-w-[700px] min-w-[200px]">
          <div className="relative">
            <input
              className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="AxtarTap..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <button
              className="absolute top-1 right-1 flex items-center rounded bg-green-500 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-blue-700 focus:shadow-none active:bg-slate-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={handleSearch}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 mr-2"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
              Axtar
            </button>
          </div>
        </div>
        <Link to="/">
          <button className="flex  items-center gap-2 mt-4 mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Geri
          </button>
        </Link>
        <h2 className="text-2xl font-bold mb-4">Yeni Nəqliyyat Elanı</h2>
        <div role="presentation" onClick={handleClick}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              className="capitalize hover:underline hover:text-[#43D262]"
              underline="hover"
              color="inherit"
              to={"/"}
              href="/"
            >
              Ana Səhifə
            </Link>
            <Link
              className="capitalize hover:underline hover:text-[#43D262]"
              underline="hover"
              color="inherit"
              to={"/Katalog"}
              href="/Katalog"
            >
              Katalog
            </Link>
            <Link
              className="capitalize hover:underline hover:text-[#43D262]"
              underline="hover"
              color="inherit"
              to={"/Katalog/Nəqliyyat"}
              href="/Katalog/Nəqliyyat"
            >
              Nəqliyyat
            </Link>
          </Breadcrumbs>
        </div>
        <div className="p-4 w-full">
          <button
            onClick={handleOpenForm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md"
          >
            Elan yerləşdirmək üçün formu aç
          </button>

          {isOpen && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-0 sm:p-4">
              <div className="relative w-full h-full  sm:h-[96vh] max-w-6xl overflow-hidden rounded-none sm:rounded-3xl bg-white dark:bg-slate-950 shadow-2xl border border-white/20">
                {/* HEADER */}
                <div className="sticky top-0 z-30  flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg
                          className="w-5 h-5 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 17h14" />
                          <path d="M6 17V9l2-4h8l2 4v8" />
                          <circle cx="8" cy="17" r="2" />
                          <circle cx="16" cy="17" r="2" />
                        </svg>
                      </div>

                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                          {editingId
                            ? "Elanı redaktə et"
                            : "Yeni nəqliyyat elanı"}
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                          Avtomobil haqqında məlumatları daxil edin
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      resetForm();
                    }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center
                     bg-slate-100 dark:bg-slate-900
                     text-slate-500 dark:text-slate-400
                     hover:bg-red-50 hover:text-red-600
                     dark:hover:bg-red-950/40 dark:hover:text-red-400
                     transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* UPLOAD PROGRESS */}
                {isUploading && (
                  <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
                    <div className="w-[90%] max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-7 shadow-2xl border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-blue-600 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="9"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeDasharray="30 20"
                            />
                          </svg>
                        </div>

                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            Elan yüklənir
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Zəhmət olmasa gözləyin...
                          </p>
                        </div>
                      </div>

                      <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-violet-600 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>

                      <div className="flex justify-between mt-2 text-xs font-semibold">
                        <span className="text-slate-500">Yüklənir</span>
                        <span className="text-blue-600">{uploadProgress}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* FORM */}
                <form
                  onSubmit={handleSubmit}
                  className="h-[calc(100%-77px)] overflow-y-auto px-4 sm:px-7 py-5 sm:py-7"
                >
                  {/* ELAN MƏLUMATLARI */}
                  <section className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">01</span>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          Avtomobil məlumatları
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Avtomobilin əsas xüsusiyyətləri
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* MARKA */}
                      <div>
                        <label className="modern-label">Marka</label>

                        <select
                          name="brand"
                          value={form.brand}
                          onChange={handleChange}
                          className="modern-input"
                        >
                          <option value="">Marka seçin</option>

                          {Object.keys(carData).map((brand, index) => (
                            <option key={`brand-${index}`} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* MODEL */}
                      <div>
                        <label className="modern-label">Model</label>

                        <select
                          name="model"
                          value={form.model}
                          onChange={handleChange}
                          disabled={!form.brand}
                          className="modern-input"
                        >
                          <option value="">Model seçin</option>

                          {form.brand &&
                            carData[form.brand].map((item) => (
                              <option
                                key={`model-${item.model}`}
                                value={item.model}
                              >
                                {item.model}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* NƏSİL */}
                      <div>
                        <label className="modern-label">Nəsil</label>

                        <select
                          name="generation"
                          value={form.generation}
                          onChange={handleChange}
                          disabled={!form.model}
                          className="modern-input"
                        >
                          <option value="">Nəsil seçin</option>

                          {selectedModel?.generation?.map((gen) => (
                            <option key={gen.name} value={gen.name}>
                              {gen.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* RƏNG */}
                      <div>
                        <label className="modern-label">Rəng</label>

                        <select
                          name="color"
                          value={form.color}
                          onChange={handleChange}
                          disabled={!form.model}
                          className="modern-input"
                        >
                          <option value="">Rəng seçin</option>

                          {form.brand &&
                            form.model &&
                            carData[form.brand]
                              .filter((item) => item.model === form.model)
                              .flatMap((item) => item.color)
                              .map((color) => (
                                <option key={`color-${color}`} value={color}>
                                  {color}
                                </option>
                              ))}
                        </select>
                      </div>

                      {/* BAN */}
                      <div>
                        <label className="modern-label">Ban növü</label>

                        <select
                          name="ban_type"
                          value={form.ban_type}
                          onChange={handleChange}
                          disabled={!form.color}
                          className="modern-input"
                        >
                          <option value="">Ban növü seçin</option>

                          {form.brand &&
                            form.model &&
                            carData[form.brand]
                              .filter((item) => item.model === form.model)
                              .flatMap((item) => item.ban_type)
                              .map((type) => (
                                <option key={`ban-type-${type}`} value={type}>
                                  {type}
                                </option>
                              ))}
                        </select>
                      </div>

                      {/* MOTOR */}
                      <div>
                        <label className="modern-label">Motor</label>

                        <select
                          name="motor"
                          value={form.motor}
                          onChange={handleChange}
                          disabled={!form.ban_type}
                          className="modern-input"
                        >
                          <option value="">Motor seçin</option>

                          {form.brand &&
                            form.model &&
                            carData[form.brand]
                              .filter((item) => item.model === form.model)
                              .map((item) =>
                                item.motor.map((motorOption) => (
                                  <option
                                    key={`motor-${motorOption}`}
                                    value={motorOption}
                                  >
                                    {motorOption}
                                  </option>
                                )),
                              )}
                        </select>
                      </div>

                      {/* İL */}
                      <div>
                        <label className="modern-label">Buraxılış ili</label>

                        <select
                          name="year"
                          value={form.year}
                          onChange={handleChange}
                          disabled={!form.motor}
                          className="modern-input"
                        >
                          <option value="">İl seçin</option>

                          {Array.from(
                            { length: 80 },
                            (_, i) => new Date().getFullYear() - i,
                          ).map((year) => (
                            <option key={`year-${year}`} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* KM */}
                      <div>
                        <label className="modern-label">Yürüş</label>

                        <div className="relative">
                          <input
                            type="text"
                            name="km"
                            value={form.km}
                            placeholder="Məsələn: 125 000"
                            onChange={handleChange}
                            disabled={!form.year}
                            className="modern-input pr-14"
                          />

                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                            KM
                          </span>
                        </div>
                      </div>

                      {/* QİYMƏT */}
                      <div>
                        <label className="modern-label">Qiymət</label>

                        <div className="relative">
                          <input
                            type="text"
                            name="price"
                            value={form.price}
                            placeholder="Məsələn: 25 500"
                            onChange={handleChange}
                            disabled={!form.km}
                            className="modern-input pr-14"
                          />

                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                            AZN
                          </span>
                        </div>
                      </div>

                      {/* TRANSMİSSİYA */}
                      <div>
                        <label className="modern-label">Transmissiya</label>

                        <select
                          name="transmission"
                          value={form.transmission}
                          onChange={handleChange}
                          disabled={!form.price}
                          className="modern-input"
                        >
                          <option value="">Transmissiya seçin</option>

                          {form.brand &&
                            form.model &&
                            carData[form.brand]
                              .filter((item) => item.model === form.model)
                              .map((item) =>
                                item.transmission.map((trans) => (
                                  <option key={`trans-${trans}`} value={trans}>
                                    {trans}
                                  </option>
                                )),
                              )}
                        </select>
                      </div>

                      {/* YANACAQ */}
                      <div>
                        <label className="modern-label">Yanacaq növü</label>

                        <select
                          name="engine"
                          value={form.engine}
                          onChange={handleChange}
                          disabled={!form.transmission}
                          className="modern-input"
                        >
                          <option value="">Yanacaq növü</option>

                          {form.brand &&
                            form.model &&
                            carData[form.brand]
                              .filter((item) => item.model === form.model)
                              .map((engitem) =>
                                engitem.engine.map((eng) => (
                                  <option key={`engine-${eng}`} value={eng}>
                                    {eng}
                                  </option>
                                )),
                              )}
                        </select>
                      </div>

                      {/* MODİFİKASİYA */}
                      <div>
                        <label className="modern-label">Modifikasiya</label>

                        <select
                          name="modification"
                          value={form.modification}
                          onChange={handleChange}
                          disabled={!form.engine}
                          className="modern-input"
                        >
                          <option value="">Modifikasiya seçin</option>

                          {form.brand &&
                            form.model &&
                            carData[form.brand]
                              .filter((item) => item.model === form.model)
                              .map((item) =>
                                item.modfikasiya.map((mod) => (
                                  <option key={`mod-${mod}`} value={mod}>
                                    {mod}
                                  </option>
                                )),
                              )}
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* MODEL ŞƏKİLİ */}
                  {modelImagePreview && (
                    <section className="mb-6">
                      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                        <img
                          src={modelImagePreview}
                          alt={`${form.model} ${form.year}`}
                          className="w-full h-52 sm:h-72 object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                        <div className="absolute bottom-5 left-5">
                          <span className="inline-flex px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold mb-2">
                            Avtomobil
                          </span>

                          <h3 className="text-xl sm:text-2xl font-bold text-white">
                            {form.brand} {form.model}
                          </h3>

                          {form.year && (
                            <p className="text-sm text-white/80">{form.year}</p>
                          )}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* YER */}
                  <section className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">
                        <MapPin size={18} className="text-violet-600" />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          Yerləşmə
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Elanın yerləşdiyi şəhəri seçin
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/70 dark:bg-slate-900/50">
                      <CitySelect
                        selectedCity={form.location}
                        setSelectedCity={(city) =>
                          setForm((prev) => ({
                            ...prev,
                            location: city,
                          }))
                        }
                      />
                    </div>
                  </section>

                  {/* ŞƏKİLLƏR */}
                  <section className="mb-6">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-emerald-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="m21 15-5-5L5 21" />
                          </svg>
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white">
                            Avtomobil şəkilləri
                          </h3>

                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Bir neçə şəkil əlavə edə bilərsiniz
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {form.images?.length || 0} şəkil
                      </span>
                    </div>

                    <label
                      className={`relative flex flex-col items-center justify-center min-h-32 rounded-2xl border-2 border-dashed transition-all cursor-pointer
              ${
                form.modification
                  ? "border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
                  : "border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/50 cursor-not-allowed opacity-60"
              }`}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={!form.modification}
                        className="hidden"
                      />

                      <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center mb-2">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 16V4" />
                          <path d="m7 9 5-5 5 5" />
                          <path d="M5 20h14" />
                        </svg>
                      </div>

                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Şəkilləri seçin
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        JPG, PNG və digər şəkil formatları
                      </p>
                    </label>

                    {/* ŞƏKİL PREVIEW */}
                    {form.images?.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
                        {form.images.map((img, index) => {
                          const imageUrl =
                            typeof img === "string"
                              ? img
                              : URL.createObjectURL(img);

                          return (
                            <div
                              key={index}
                              className={`relative aspect-square overflow-hidden rounded-2xl border-2 bg-slate-100 dark:bg-slate-900 cursor-pointer transition-all
                      ${
                        mainImageIndex === index
                          ? "border-emerald-500 ring-4 ring-emerald-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:border-blue-400"
                      }`}
                              onClick={() => setMainImageIndex(index)}
                            >
                              <img
                                src={imageUrl}
                                alt={`Şəkil ${index + 1}`}
                                className="w-full h-full object-cover"
                              />

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRemoveImage(index);
                                }}
                                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 transition-all"
                              >
                                <X size={15} />
                              </button>

                              {mainImageIndex === index && (
                                <div className="absolute bottom-0 left-0 right-0 bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-semibold text-center py-2">
                                  Əsas şəkil
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>

                  {/* SATIŞ ŞƏRTLƏRİ */}
                  <section className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
                        <span className="text-amber-600 font-bold">03</span>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          Satış şərtləri
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Elanın satış imkanlarını seçin
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <label className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:border-blue-400 transition-all">
                        <Checkbox
                          name="credit"
                          checked={form.credit}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              credit: e.target.checked,
                            }))
                          }
                        />

                        <div>
                          <p className="font-semibold text-sm text-slate-800 dark:text-white">
                            Kredit
                          </p>
                          <p className="text-xs text-slate-400">
                            Kreditlə satılır
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:border-emerald-400 transition-all">
                        <Checkbox
                          name="barter"
                          checked={form.barter}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              barter: e.target.checked,
                            }))
                          }
                        />

                        <div>
                          <p className="font-semibold text-sm text-slate-800 dark:text-white">
                            Barter
                          </p>
                          <p className="text-xs text-slate-400">
                            Barter mümkündür
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                      {[
                        ["sifarisle", "Sifariş", "Sifarişlə"],
                        ["magaza", "Salon", "Avtosalon"],
                        ["resmi", "Rəsmi", "Rəsmi satış"],
                      ].map(([value, title, subtitle]) => (
                        <label
                          key={value}
                          className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all
                  ${
                    form.type_magasine === value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  }`}
                        >
                          <input
                            type="radio"
                            name="type_magasine"
                            checked={form.type_magasine === value}
                            onChange={() =>
                              setForm((prev) => ({
                                ...prev,
                                type_magasine: value,
                              }))
                            }
                            className="w-4 h-4 accent-blue-600"
                          />

                          <div>
                            <p className="font-semibold text-sm text-slate-800 dark:text-white">
                              {title}
                            </p>

                            <p className="text-xs text-slate-400">{subtitle}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </section>

                  {/* ƏLAQƏ */}
                  <section className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950/50 flex items-center justify-center">
                        <span className="text-pink-600 font-bold">04</span>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          Əlaqə məlumatları
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Elan sahibinin əlaqə məlumatları
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="modern-label">Ad</label>

                        <input
                          type="text"
                          name="contact.name"
                          value={form.contact.name}
                          onChange={handleChange}
                          placeholder="Adınız"
                          disabled={!form.modification}
                          className="modern-input"
                        />
                      </div>

                      <div>
                        <label className="modern-label">Telefon</label>

                        <input
                          type="text"
                          name="contact.phone"
                          value={form.contact.phone}
                          onChange={handleChange}
                          placeholder="+994 XX XXX XX XX"
                          disabled={!form.modification}
                          className="modern-input"
                        />
                      </div>

                      <div>
                        <label className="modern-label">Email</label>

                        <input
                          type="email"
                          name="contact.email"
                          value={form.contact.email}
                          onChange={handleChange}
                          placeholder="example@email.com"
                          disabled={!form.modification}
                          className="modern-input"
                        />
                      </div>
                    </div>
                  </section>

                  {/* QEYD */}
                  <section className="mb-7">
                    <label className="modern-label">Əlavə qeydlər</label>

                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Avtomobil haqqında əlavə məlumat yazın..."
                      disabled={!form.modification}
                      className="modern-input min-h-[140px] resize-none"
                    />
                  </section>

                  {/* SUBMIT */}
                  <div className="sticky bottom-0 -mx-4 sm:-mx-7 px-4 sm:px-7 py-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold shadow-xl shadow-blue-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading
                        ? `Yüklənir... ${uploadProgress}%`
                        : editingId
                          ? "Elanı yenilə"
                          : "Elanı əlavə et"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          {loading && (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          )}
          {loading && results.length === 0 && <p>Elan Tapılmadı</p>}

          {!loading && results.length > 0 && (
            <div className="grid grid-cols-2  sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {results.map((item, index) => (
                <Link
                  key={item.id || item._id}
                  to={`/item/${item._id || item.id}`}
                >
                  <div
                    key={index}
                    className="border sm:w-[240.4px] max-w-[240.4px] h-[300px] rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
                  >
                    <img
                      src={
                        item.images && item.images.length > 0
                          ? item.images[0]
                          : item.imageUrls && item.imageUrls.length > 0
                            ? item.imageUrls[0]
                            : "/placeholder.png"
                      }
                      alt={item.title || "Image"}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="text-lg font-semibold mb-1">
                        {item.price} AZN
                      </h2>
                      <h3 className="text-lg font-semibold mb-1">
                        {item.title} {item.category}, {item.brand}, {item.model}
                      </h3>
                      <p className="text-gray-600"></p>
                      <p className="text-gray-600">{item.model}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className=" ring-2 w-full my-4"></div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          Əlavə olunan Elanlar
        </h3>
        <div className=" mx-auto   rounded-2xl   grid justify-items-center grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 w-full min-h-screen">
          {isLoading ? (
            Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className=" w-[185.7px] h-[222.6px]  max-w-[240.4px] max-h-[268.8px] rounded-2xl shadow-md bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-[shimmer_1.5s_infinite]"
              >
                <div className=" w-[185.7px] h-[222.6px]  max-w-[240.4px] max-h-[268.8px] bg-white rounded-2xl shadow-md ">
                  <div className="w-full h-[100px] rounded-t-[8px] mb-2 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer"></div>
                  <div className="p-1">
                    <div className="h-6 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded mb-1 w-3/4 animate-shimmerh-6 bg-gray-300 rounded mb-1 w-3/4 animate-shimmer"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded mb-1 w-2/3 animate-shimmer"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-1/2 animate-shimmer"></div>

                    <div className="flex items-center justify-between">
                      <div className="h-4 mt-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-gray-300 rounded w-1/4 animate-shimmer "></div>
                      <div className="h-4 mt-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-gray-300 rounded w-1/2 animate-shimmer "></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              {[...cars].map((car) => (
                <div key={car._id || car.id} className="relative group">
                  <Link
                    target="_top"
                    rel="noopener noreferrer"
                    to={`/car/${car._id || car.id}`}
                  >
                    <div className="w-[185.7px] h-[222.6px] max-w-[240.4px] max-h-[268.8px] bg-white rounded-2xl shadow-lg transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 overflow-hidden">
                      <div className="flex rounded-t-sm">
                        {car.images?.[0] && (
                          <img
                            src={car.mainImage || car.images[0]}
                            alt={car.brand || "Avtomobil"}
                            className="w-full h-[100px] object-cover rounded-t-2xl"
                          />
                        )}
                      </div>

                      <div className="p-2">
                        <h2 className="text-lg font-bold">{car.price} AZN</h2>

                        <p className="font-sans capitalize text-[12px] truncate">
                          {car.brand} {car.model}
                        </p>

                        <p className="capitalize text-[12px] font-medium truncate">
                          {car.year}, {car.motor} L, {car.km} km
                        </p>

                        <div className="flex justify-between gap-1">
                          <p className="text-[10px] flex items-center text-gray-600 truncate">
                            <MapPin size={12} className="mr-1" />
                            {car.location}
                          </p>

                          <p className="text-[10px] text-gray-600 truncate">
                            {formatDate(car.data || car.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* REDAKTƏ / SİL */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEdit(car);
                      }}
                      className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1.5 rounded-lg text-xs shadow-lg hover:bg-blue-700"
                    >
                      <Edit3 size={13} />
                      Redaktə
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(car._id || car.id);
                      }}
                      className="flex items-center gap-1 bg-red-600 text-white px-2 py-1.5 rounded-lg text-xs shadow-lg hover:bg-red-700"
                    >
                      <Trash2 size={13} />
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
