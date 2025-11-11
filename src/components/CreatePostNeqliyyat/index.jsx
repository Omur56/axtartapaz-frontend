import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import confetti from "canvas-confetti";
import Checkbox from '@mui/material/Checkbox';
import { RefreshCcw, Percent, MapPin } from "lucide-react";



export default function CreatePost() {
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [editingId, setEditingId] = useState(null);
const [checked, setChecked] = React.useState(true);
 const [price, setPrice] = useState("");
 const [mainImageIndex, setMainImageIndex] = useState(null)
 
  const [form, setForm] = useState({
    id: Date.now(),
    category: "",
    brand: "",
    model: "",
    ban_type: "",
    year: "",
    price: "",
    location: "",
    images: [],
    km: "",
    motor: "",
    salon: "",
    default: "",
    barter: "",
    transmission: "",
    kredit: "",
    engine: "",
    contact: {
      name: "",
      email: "",
      phone: "",
    },
    liked: false,
    favorite: false,
    data: new Date(),
  });


   const [options, setOptions] = useState({
    kredit: false,
    barter: false,
  });

 // Kredit və Barter seçimini idarə edən funksiya
const handleChangeSelect = (e) => {
  const { name, checked } = e.target;

  setOptions((prev) => ({
    ...prev,
    [name]: checked,
  }));

  setForm((prev) => ({
    ...prev,
    [name]: checked ? "Bəli" : "Xeyr", // true olarsa Bəli, yoxsa Xeyr yazılır
  }));
};

  const [cars, setCars] = useState([]);

// const handleChange = (e) => {
//   const { name, value } = e.target;

//   if (name === "price" || name === "km") {
//     // yalnız rəqəmləri götür
//     let cleanedValue = value.replace(/\D/g, "");

//     // minlik formatlama (123456 → 123 456)
//     let formatted = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

//     setForm((prev) => ({ ...prev, [name]: formatted }));
//   } 
//   else if (name.startsWith("contact.")) {
//     const field = name.split(".")[1];
//     setForm((prev) => ({
//       ...prev,
//       contact: { ...prev.contact, [field]: value },
//     }));
//   } 
//   else if (name === "data") {
//     setForm((prev) => ({ ...prev, data: new Date(value) }));
//   } 
//   else {
//     setForm((prev) => ({ ...prev, [name]: value }));
//   }
// };



const handleChange = (e) => {
  const { name, value } = e.target;

  // Qiymət və KM üçün minlik formatlama
  if (name === "price" || name === "km") {
    let cleanedValue = value.replace(/\D/g, "");
    let formatted = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    setForm((prev) => ({ ...prev, [name]: formatted }));
  } 
  // Mobil nömrə formatlama
  else if (name === "contact.phone") {
    // +994 prefiksi hər zaman qalır
    let digits = value.replace(/\D/g, "").slice(3, 12); // 9 rəqəm
    // Formatlama: +994-XX-XXX-XX-XX
    if (digits.length > 0) digits = digits.replace(/^(\d{0,2})/, "$1");
    if (digits.length > 2) digits = digits.replace(/^(\d{2})(\d{0,3})/, "$1-$2");
    if (digits.length > 5) digits = digits.replace(/^(\d{2})-(\d{3})(\d{0,2})/, "$1-$2-$3");
    if (digits.length > 7) digits = digits.replace(/^(\d{2})-(\d{3})-(\d{2})(\d{0,2})/, "$1-$2-$3-$4");

    let formatted = "+994-" + digits;
    setForm((prev) => ({
      ...prev,
      contact: { ...prev.contact, phone: formatted },
    }));
  } 
  // Digər contact inputları
  else if (name.startsWith("contact.")) {
    const field = name.split(".")[1];
    setForm((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  } 
  // Tarix inputu
  else if (name === "data") {
    setForm((prev) => ({ ...prev, data: new Date(value) }));
  } 
  // Digər inputlar
  else {
    setForm((prev) => ({ ...prev, [name]: value }));
  }
};

  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 20) {
      alert("Ən çoxu 20 şəkil yükləyə bilərsiniz.");
      return;
    }
    setForm((prev) => ({ ...prev, images: files }));
    setMainImageIndex(0);
  };




  const fetchCars = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cars`);
      setCars(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      Swal.fire({
        icon: "warning",
        title: "Giriş tələb olunur",
        text: "Elan paylaşmaq üçün hesabınıza daxil olun.",
      });
       
      return;
    }

    const formData = new FormData();

    form.images.forEach((file) => formData.append("images", file));


if (mainImageIndex !== null) {
  formData.append("mainImageIndex", mainImageIndex);
}

    Object.entries(form).forEach(([key, value]) => {
      if (key === "data") return;
      if (key === "contact") {
        Object.entries(value).forEach(([k, v]) =>
          formData.append(`contact.${k}`, v)
        );
      } else if (key !== "images") {
        formData.append(key, value);
      } else if (key === "salon") {
        formData.append(key, value);
        return <div>{form.salon}</div>;
      }
    });

    formData.append(
      "data",
      form.data ? form.data.toISOString() : new Date().toISOString()
    );
    formData.append("userId", userId);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/cars`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      resetForm();
      fetchCars();
      Swal.fire({
        icon: "success",
        title: "Elanınız uğurla yerləşdirildi!",
        confirmButtonColor: "#3085d6",
      }).then(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  });
    } catch (err) {
      console.error("Elan yüklənmədi:", err.response?.data || err.message);
      Swal.fire({
        icon: "error",
        title: "Xəta baş verdi",
        text: err.response?.data?.error || "Server xətası",
        confirmButtonColor: "#d33",
      });
    }
  };

  const resetForm = () => {
    setForm({
      id: Date.now(),
      category: "",
      brand: "",
      model: "",
      ban_type: "",
      year: "",
      price: "",
      location: "",
      images: [],
      km: "",
      motor: "",
      transmission: "",
      description: "",
      
      salon: "",
      default: "",
      barter: "",
      kredit: "",
      engine: "",
      contact: {
        name: "",
        email: "",
        phone: "",
      },
      liked: false,
      favorite: false,
      data: new Date(),
    });
    setForm((prev) => {
      return {
        ...prev,
        contact: { ...prev.contact, name: "", email: "", phone: "" },
      };
    });
    setImages([]);
    setPreview([]);
    setEditingId(null);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const formatDate = (dateString) => {
    const postDate = new Date(dateString);
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const postDay = new Date(postDate.setHours(0, 0, 0, 0));
    const diffTime = today - postDay;
    const oneDay = 24 * 60 * 60 * 1000;

    if (diffTime === 0) return "bugün";
    if (diffTime === oneDay) return "dünən";

    return postDate.toLocaleDateString("az-AZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCurrentTime = (isoString) => {
    const date = new Date(isoString);
    const time = date.toTimeString().split(" ")[0].slice(0, 5);
    return time;
  };

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrls = [`${process.env.REACT_APP_API_URL}/api/cars`];

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const requests = apiUrls.map((url) => axios.get(url));
      const responses = await Promise.all(requests);

      let allData = [];
      responses.forEach((res) => {
        if (Array.isArray(res.data)) allData = allData.concat(res.data);
      });

      const filtered = allData.filter((item) => {
        const title = item.title?.toLowerCase() || "";
        const brand = item.brand?.toLowerCase() || "";
        const category = item.category?.toLowerCase() || "";
        const model = item.model?.toLowerCase() || "";
        const location = item.location?.toLowerCase() || "";
        const city = item.city?.toLowerCase() || "";
        const engine = item.engine?.toLowerCase() || "";
        const year = item.year?.toLowerCase() || "";
        const motor = item.motor?.toLowerCase() || "";
        const transmission = item.transmission?.toLowerCase() || "";
        const ban_type = item.ban_type?.toLowerCase() || "";
        const price = item.price?.toLowerCase() || "";
        const description = item.description?.toLowerCase() || "";
        return (
          title.includes(query.toLowerCase()) ||
          brand.includes(query.toLowerCase()) ||
          category.includes(query.toLowerCase()) ||
          location.includes(query.toLowerCase()) ||
          model.includes(query.toLowerCase()) ||
          city.includes(query.toLowerCase()) ||
          engine.includes(query.toLowerCase()) ||
          year.includes(query.toLowerCase()) ||
          motor.includes(query.toLowerCase()) ||
          transmission.includes(query.toLowerCase()) ||
          ban_type.includes(query.toLowerCase()) ||
          price.includes(query.toLowerCase()) ||
          description.includes(query.toLowerCase())
        );
      });

      setResults(filtered);
    } catch (error) {
      console.error("API axtarış xətası:", error);
    } finally {
      setLoading(false);
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  const [neqliyyat, setNeqliyyat] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const [neqliyyat] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/cars`),
        ]);

        setNeqliyyat(neqliyyat.data);
      } catch (err) {
        console.error("API xətası:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  const token = localStorage.getItem("token");

  // Yeni funksiyanı elanı açan buttona əlavə edirik
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

        <div className="p-4">
          <button
            onClick={handleOpenForm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md"
          >
            Elan yerləşdirmək üçün formu aç
          </button>

          {isOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="relative w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto bg-white p-6 rounded-xl shadow-lg">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
                >
                  <X size={28} />
                </button>

                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-2 gap-4 p-2"
                >
                  <input
                    type="text"
                    value={form.category}
                    name="category"
                    placeholder="Kateqoriya"
                    onChange={handleChange}
                    required
                    className="border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 "
                  />
                  <input
                    value={form.brand}
                    name="brand"
                    placeholder="Marka"
                    onChange={handleChange}
                    required
                    className="border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 "
                  />
                  <input
                    value={form.ban_type}
                    name="ban_type"
                    placeholder="Ban Növü"
                    onChange={handleChange}
                    required
                    className="border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 "
                  />
                  <input
                    value={form.model}
                    name="model"
                    placeholder="Model"
                    onChange={handleChange}
                    required
                    className="border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 "
                  />
                  <input
                    type="text"
                    value={form.year}
                    name="year"
                    placeholder="İl"
                    onChange={handleChange}
                    required
                    maxLength={4}
                    className="border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 "
                  />
                  <input
                    type="text"
                    value={form.motor}
                    name="motor"
                    placeholder="Motor"
                    onChange={handleChange}
                    required
                    className="border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 "
                  />
                  <input
                    type="text"
                    value={form.km}
                    name="km"
                    placeholder="KM"
                    onChange={handleChange}
                    required
                    maxLength={7}
                    className="border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 "
                  />
                  <input
                    type="text"
                    value={form.price}
                    name="price"
                    placeholder="Qiymət"
                    onChange={handleChange}
                    required
                    maxLength={7}
                    className="border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 "
                  />
                  <select
                    value={form.transmission}
                    name="transmission"
                    onChange={handleChange}
                    required
                    className="border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 "
                  >
                    <option value="">Transmissiya</option>
                    <option value="Avtomat">Avtomat</option>
                    <option value="Mexanika">Mexanika</option>
                  </select>
                  <select
                    value={form.engine}
                    name="engine"
                    onChange={handleChange}
                    required
                    className="border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 "
                  >
                    <option value="">Mühərrik</option>
                    <option value="Dizel">Dizel</option>
                    <option value="Benzin">Benzin</option>
                    <option value="Elektrik">Elektrik</option>
                    <option value="Hibrid">Hibrid</option>
                    <option value=" Plug-in Hibrid"> Plug-in Hibrid</option>
                    <option value="Qaz">Qaz</option>
                  </select>

                  <select
                    value={form.salon}
                    name="salon"
                    onChange={handleChange}
                    className="border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 "
                  >
                    <option disabled className="bg-transparent" value="">
                      Salon
                    </option>
                    <option value="Salon">Salon</option>
                    <option value="Rəsmi">Rəsmi</option>
                    <option value="Sifarişlə">Sifarişlə</option>
                   
                  </select>

                  {/* <select
                    value={form.barter}
                    name="barter"
                    onChange={handleChange}
                    className="border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 "
                  >
                    <option disabled className="bg-transparent" value="">
                      Barter
                    </option>
                    <option value="Barter">Barter</option>
                   
                  </select>
                  <select
                    value={form.kredit}
                    name="kredit"
                    onChange={handleChange}
                    className="border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 "
                  >
                    <option disabled className="bg-transparent" value="">
                      Kredit
                    </option>
                    <option value="Kredit">Kredit</option>
                    
                  </select> */}
                  <input
                    value={form.location}
                    name="location"
                    placeholder="Şəhər/Rayon"
                    onChange={handleChange}
                    required
                    className="border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 "
                  />

                     <label className="block mb-2  w-[200px] bg-gray-200 rounded-[10px] p-1 ">
       
       

        <Checkbox
         name="kredit"
          value={form.kredit}
          checked={options.kredit}
          onChange={handleChangeSelect}
          inputProps={{ 'aria-label': 'controlled' }}
    
    /> Kredit ilə satılır
      </label>
                   
      
      <label className="block mb-2 w-[100px] bg-gray-200 rounded-[10px] p-1 ">
        <Checkbox
         name="barter"
          value={form.barter}
          checked={options.barter}
          onChange={handleChangeSelect}
          inputProps={{ 'aria-label': 'controlled' }}
    
    /> 
        Barter
      </label>

                  <input
                    type="file"
                    multiple
                    name="images"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 "
                  />
                <div className="col-span-2">
  <label className="block font-semibold mb-2">Şəkillər:</label>
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={handleFileChange}
    className="border p-2 rounded-lg w-full"
  />

  {/* Əgər şəkillər varsa, onları göstər */}
  {form.images.length > 0 && (
    <div className="grid grid-cols-4 gap-3 mt-3">
      {form.images.map((img, index) => {
        const url = URL.createObjectURL(img);
        return (
          <div
            key={index}
            className={`relative border rounded-lg overflow-hidden cursor-pointer ${
              mainImageIndex === index ? "ring-4 ring-green-500" : ""
            }`}
            onClick={() => setMainImageIndex(index)}
          >
            <img
              src={url}
              alt={`Şəkil ${index + 1}`}
              className="object-cover w-full h-24"
            />
            {mainImageIndex === index && (
              <div className="absolute bottom-0 left-0 right-0 bg-green-600 text-white text-center text-xs py-1">
                Əsas şəkil
              </div>
            )}
          </div>
        );
      })}
    </div>
  )}
</div>
                  <input
                    type="text"
                    name="contact.phone"
                    
                    onChange={handleChange}
                    value={form.contact.phone}
                    required
                      placeholder="+994-XX-XXX-XX-XX"
  pattern="^\+994-(\d{2})-(\d{3})-(\d{2})-(\d{2})$"
                    className="border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 "
                  />
                  <input
                    type="email"
                    name="contact.email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={form.contact.email}
                    required
                    className="border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 "
                  />
                  <input
                    type="text"
                    name="contact.name"
                    placeholder="Ad"
                    onChange={handleChange}
                    value={form.contact.name}
                    required
                    
                    className="border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 capitalize"
                  />
                  <textarea
                    value={form.description}
                    name="description"
                    placeholder="Əlavə Qeydlər"
                    onChange={handleChange}
                    required
                    className="col-span-2 border-[1px] border-green-300/100 p-2 rounded-[10px]  invalid:border-red-500 invalid:text-red-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-red-500 focus:invalid:outline-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20 "
                  />
                  <button
                    type="submit"
                    className="col-span-2 bg-blue-500 text-white px-4 py-2 rounded-[10px] hover:bg-blue-600"
                  >
                    Əlavə et
                  </button>
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
            <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {results.map((item, index) => (
                <Link
                  key={item.id || item._id}
                  to={`/item/${item._id} || ${item.id}`}
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
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  key={car._id}
                  to={`/cars/${car._id}`}
                >
                  <div className="  w-[185.7px] h-[222.6px]  max-w-[240.4px] max-h-[268.8px] bg-white rounded-2xl shadow-lg transform hover:-translate-y-2 hover:scale-105 transition-all duration-300">
                    <div className="flex gap-2 rounded-t-sm">
                      {car.images?.[0] && (
                        <img
                          src={car.mainImage || car.images[0]}
  alt={car.brand}
                          className="w-full h-[100px] object-cover object-contain rounded-t-2xl"
                        />
                      )}
                    </div>
                    <div className="p-2 ">
                      <h2 className="text-lg font-bold">{car.price} AZN</h2>
                      <p className="font-sans capitalize text-[12px] truncate w-50 ">
                        {car.category} {car.brand} {car.model}
                      </p>
                      <p className="capitalize text-[12px] font-sans font-[500] truncate w-50">
                        {car.year}, {car.motor} L, {car.km} km
                      </p>
                       <div className="flex justify-between gap-1  ">
                              <p className="text-[10px] rounded flex justify-between text-gray-600">
                                <MapPin size={12} color="#75FC56" />{" "}
                                {car.location}
                              </p>
                              <p className="capitalize text-[12px]  rounded flex justify-between text-gray-600 truncate w-30">
                                {formatDate(car.data)}{" "}
                                {getCurrentTime(car.data)}
                              </p>
                            </div>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
