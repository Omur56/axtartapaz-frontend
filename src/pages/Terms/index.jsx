import React from "react";
import { Helmet } from "react-helmet-async";

const sections = [
  {
    title: "1. Ümumi müddəalar",
    icon: (
      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    content:
      "ProElan.az pulsuz elan və alqı-satqı platformasıdır. Platformadan istifadə etməklə siz bu şərtlərlə razılaşmış olursunuz.",
  },
  {
    title: "2. Platformanın məqsədi",
    icon: (
      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M3 6h18M3 18h18" />
      </svg>
    ),
    content:
      "Platforma istifadəçilərə avtomobil, əmlak, elektronika, telefon, məişət avadanlıqları, bağ ləvazimatları, geyim və digər məhsullar üzrə elan yerləşdirmək və alqı-satqı aparmaq imkanı yaradır.",
  },
  {
    title: "3. İstifadəçi öhdəlikləri",
    icon: (
      <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    list: [
      "Dəqiq və doğru məlumat təqdim etmək",
      "Qanunsuz və saxta elan yerləşdirməmək",
      "Digər istifadəçilərin hüquqlarını pozmamaq",
      "Platformadan sui-istifadə etməmək",
    ],
  },
  {
    title: "4. Məsuliyyətin məhdudlaşdırılması",
    icon: (
      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    content:
      "ProElan.az yalnız elanların yerləşdirilməsi üçün vasitəçi platformadır. Alqı-satqı əməliyyatlarına görə məsuliyyət daşımır.",
  },
  {
    title: "5. Hesabın bloklanması",
    icon: (
      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
      </svg>
    ),
    content:
      "Qayda pozuntusu aşkar edildikdə istifadəçi hesabı xəbərdarlıq edilmədən bloklana bilər.",
  },
];

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto mt-20 mb-10 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl text-gray-800 font-sans">
      <Helmet>
        <title>İstifadəçi Müqaviləsi - ProElan.az</title>
        <meta
          name="description"
          content="ProElan.az istifadəçi müqaviləsi və platformadan istifadə qaydaları."
        />
        <link rel="canonical" href="https://proelan.az/terms" />
      </Helmet>

      <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
        İstifadəçi Müqaviləsi
      </h1>
      <p className="italic text-gray-500 mb-8">
        <strong>Son yenilənmə:</strong> 21 Fevral 2026
      </p>

      {sections.map((section, idx) => (
        <section
          key={idx}
          className="mb-6 p-6 bg-white rounded-2xl shadow hover:shadow-xl transition-shadow duration-300 flex items-start gap-4"
        >
          <div className="mt-1">{section.icon}</div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-3 text-indigo-600">{section.title}</h2>
            {section.content && <p className="text-gray-700">{section.content}</p>}
            {section.list && (
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {section.list.map((item, i) => (
                  <li key={i} className="hover:text-indigo-500 transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}

      <section className="mt-8 pt-6 border-t border-gray-300 flex gap-4">
        <svg className="w-6 h-6 text-blue-500 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m0 0l4-4m-4 4l4 4" />
        </svg>
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-indigo-600">6. Əlaqə</h2>
          <p><strong>Sahib:</strong> Ömürxan Abdullayev</p>
          <p>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:omur199624@gmail.com"
              className="text-blue-600 underline hover:text-blue-800 transition-colors"
            >
              omur199624@gmail.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}