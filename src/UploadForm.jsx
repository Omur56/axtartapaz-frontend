import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
const [link, setLink] = useState("");
  // Fayl seçimi
  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
formData.append("link", link);
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/ads`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Yükləndi:", res.data);
      alert("Uğurla yükləndi!");
      setTitle("");
      setDescription("");
      setImages([]);
    } catch (err) {
      console.error(err);
      alert("Xəta baş verdi!");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Elan Yüklə</h2>
      <form onSubmit={handleSubmit}>
  <input
    type="text"
    placeholder="Başlıq"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
  />
  <input
    type="text"
    placeholder="Link"
    value={link}
    onChange={(e) => setLink(e.target.value)}
    required
    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
  />
  <textarea
    placeholder="Təsvir"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    required
    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
  />
  <input
    type="file"
    multiple
    onChange={handleFileChange}
    style={{ marginBottom: "10px" }}
  />
  <button type="submit" style={{ padding: "10px 20px" }}>
    Yüklə
  </button>
</form>

    </div>
  );
};

export default UploadForm;
