import React, { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import axios from "axios";

import { Carousel } from "react-responsive-carousel";

import "react-responsive-carousel/lib/styles/carousel.min.css";

import { Store } from "lucide-react";

export default function PostDetailElectronika() {
  const { id } = useParams();

  const [electronikaPost, setElectronikaPost] = useState(null);

  const [business, setBusiness] = useState(null);

  const contact = electronikaPost?.contact ?? {};

  // =====================================================
  // ELANI GƏTİR
  // =====================================================

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/electronika/${id}`)
      .then((res) => {
        setElectronikaPost(res.data);
      })
      .catch((err) => {
        console.error("Xeta:", err);
      });
  }, [id]);

  // =====================================================
  // BİZNES MƏLUMATINI GƏTİR
  // =====================================================

  useEffect(() => {
    const fetchBusiness = async () => {
      // Elan biznesə aid deyilsə heç nə etmirik
      if (!electronikaPost?.businessId) {
        setBusiness(null);
        return;
      }

      try {
        console.log("🏪 ELECTRONIKA BUSINESS ID:", electronikaPost.businessId);

        /*
          BusinessProfile API-də artıq:

          GET /api/business/:slug

          var.

          Amma burada bizdə slug yox, businessId var.
          Ona görə əvvəlcə backend-dən businessId ilə
          biznesi tapmaq üçün mövcud API lazım olur.
        */

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/business/by-id/${electronikaPost.businessId}`,
        );

        console.log("🏪 BUSINESS DATA:", response.data);

        setBusiness(response.data?.business || response.data || null);
      } catch (error) {
        console.error("❌ Biznes məlumatı alınmadı:", error);

        setBusiness(null);
      }
    };

    fetchBusiness();
  }, [electronikaPost?.businessId]);

  // =====================================================
  // LOADING
  // =====================================================

  if (!electronikaPost) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // =====================================================
  // SƏHİFƏ
  // =====================================================

  return (
    <div className="max-w-[900px] mx-auto mt-10 bg-white p-5 rounded-lg shadow">
      {/* =====================================================
          K A R U S E L
      ===================================================== */}

      <Carousel showThumbs={false} dynamicHeight={false} infiniteLoop>
        {electronikaPost.images?.length > 0 ? (
          electronikaPost.images.map((img, idx) => (
            <div key={idx}>
              <img src={img} alt={`Şəkil ${idx + 1}`} />
            </div>
          ))
        ) : (
          <div>
            <img src="/no-image.jpg" alt="Şəkil yoxdur" />
          </div>
        )}
      </Carousel>

      {/* =====================================================
          ELAN DETALLARI
      ===================================================== */}

      <div className="mt-5">
        <h1 className="text-2xl font-bold">{electronikaPost.title}</h1>

        <p className="text-lg font-semibold">{electronikaPost.price} AZN ₼</p>

        <p className="text-gray-600">{electronikaPost.location}</p>

        <p className="mt-3">{electronikaPost.description}</p>

        {/* =====================================================
            ƏLAQƏ MƏLUMATLARI
        ===================================================== */}

        <div className="mt-4 p-4 border rounded">
          <h3 className="font-bold">Əlaqə</h3>

          <p>{contact?.name || "—"}</p>

          <p>{contact?.phone || "—"}</p>

          <p>{contact?.email || "—"}</p>

          {/* =====================================================
              MAĞAZAYA KEÇİD
          ===================================================== */}

          {electronikaPost.businessId && business?.slug && (
            <Link
              to={`/business/${business.slug}`}
              className="mt-4 inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-xl bg-[#670fff] hover:bg-[#5700db] text-white font-bold transition shadow-lg shadow-[#670fff]/20"
            >
              <Store size={19} />
              Mağazaya keçid et
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
