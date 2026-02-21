import React from "react";
import { Helmet } from "react-helmet-async";

const rules = [
  {
    title: "1. Məlumatların düzgünlüyü",
    icon: (
      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    content: "Elan başlığı və təsviri real və doğru olmalıdır. Yanıltıcı məlumatlara icazə verilmir.",
  },
  {
    title: "2. Şəkillər",
    icon: (
      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    ),
    content: "Yüklənən şəkillər məhsula aid olmalı və keyfiyyətli olmalıdır.",
  },
  {
    title: "3. Qiymət",
    icon: (
      <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.567-3 3.5S10.343 15 12 15s3-1.567 3-3.5S13.657 8 12 8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2M12 19v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
    content: "Qiymət real və satışa uyğun göstərilməlidir.",
  },
  {
    title: "4. Təkrar elanlar",
    icon: (
      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6l-6 6 6 6" />
      </svg>
    ),
    content: "Eyni məhsul üçün təkrar və spam xarakterli elan yerləşdirmək qadağandır.",
  },
  {
    title: "5. Məsuliyyət",
    icon: (
      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-3.866-3.134-7-7-7s-7 3.134-7 7 3.134 7 7 7 7-3.134 7-7z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
      </svg>
    ),
    content: "Elan yerləşdirən istifadəçi elan məzmununa görə tam məsuliyyət daşıyır.",
  },
];

export default function PostingRules() {
  return (
    <div className="max-w-4xl mx-auto mt-20 mb-10 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl text-gray-800 font-sans">
      <Helmet>
        <title>Elan Yerləşdirmə Qaydaları - ProElan.az</title>
        <meta
          name="description"
          content="ProElan.az platformasında elan yerləşdirmə qaydaları."
        />
        <link rel="canonical" href="https://proelan.az/posting-rules" />
      </Helmet>

      <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
        Elan Yerləşdirmə Qaydaları
      </h1>

      {rules.map((rule, idx) => (
        <div
          key={idx}
          className="flex items-start gap-4 mb-6 p-6 bg-white rounded-2xl shadow hover:shadow-xl transition-shadow duration-300"
        >
          <div className="mt-1">{rule.icon}</div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2 text-indigo-600">{rule.title}</h2>
            <p className="text-gray-700">{rule.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}