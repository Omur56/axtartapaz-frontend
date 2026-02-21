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
      "ProElan.az platforması istifadəçilər üçün pulsuz elan yerləşdirmə və alqı-satqı imkanı təqdim edən onlayn platformadır. Platformanın məqsədi insanların avtomobil, əmlak, elektronika, telefon, məişət avadanlıqları, bağ ləvazimatları, geyim və digər məhsullar üzrə elan yerləşdirərək alıb-satmalarını asanlaşdırmaqdır. Platforma Ömürxan Abdullayev tərəfindən yaradılmış və idarə olunur.",
  },
  {
    title: "2. Toplanan məlumatlar",
    icon: (
      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    ),
    list: [
      "Ad və soyad",
      "Email ünvanı",
      "Telefon nömrəsi",
      "Şifrə (şifrələnmiş formada saxlanılır)",
      "Elan başlığı və təsviri",
      "Şəkillər və qiymət məlumatı",
      "IP ünvanı",
      "Brauzer və cihaz məlumatları",
      "Giriş tarixçəsi",
      "Cookie məlumatları",
    ],
  },
  {
    title: "3. Məlumatların istifadə məqsədi",
    icon: (
      <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    list: [
      "İstifadəçi hesabının yaradılması və idarə olunması",
      "Elanların platformada yayımlanması",
      "İstifadəçilər arasında əlaqənin təmin olunması",
      "Təhlükəsizlik və saxtakarlığın qarşısının alınması",
      "Platformanın təkmilləşdirilməsi",
      "Texniki problemlərin aradan qaldırılması",
      "Qanuni öhdəliklərin yerinə yetirilməsi",
    ],
  },
  {
    title: "4. Cookie siyasəti",
    icon: (
      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
      </svg>
    ),
    content:
      "ProElan.az istifadəçi təcrübəsini yaxşılaşdırmaq üçün cookie texnologiyasından istifadə edə bilər. Cookie-lər sessiya idarəsi, təhlükəsizlik və statistik analiz məqsədli istifadə olunur. İstifadəçilər brauzer ayarları vasitəsilə cookie istifadəsini deaktiv edə bilərlər.",
  },
  {
    title: "5. Məlumatların paylaşılması",
    icon: (
      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M12 4l8 8-8 8" />
      </svg>
    ),
    content:
      "ProElan.az istifadəçi məlumatlarını üçüncü şəxslərə satmır və kommersiya məqsədilə paylaşmır. Məlumatlar yalnız qanunvericiliyin tələbi olduqda və ya texniki xidmət təminatçıları ilə zəruri hallarda paylaşa bilər.",
  },
  {
    title: "6. Məlumatların qorunması",
    icon: (
      <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-3.866-3.134-7-7-7S-2 7.134-2 11s3.134 7 7 7 7-3.134 7-7z" />
      </svg>
    ),
    content:
      "Platforma istifadəçi məlumatlarının qorunması üçün müvafiq texniki və inzibati təhlükəsizlik tədbirləri görür. Lakin internet üzərindən ötürülən məlumatların 100% təhlükəsizliyinə zəmanət verilmir.",
  },
  {
    title: "7. İstifadəçi hüquqları",
    icon: (
      <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    list: [
      "Öz məlumatlarına çıxış əldə etmək",
      "Məlumatların düzəldilməsini tələb etmək",
      "Hesabın və məlumatların silinməsini tələb etmək",
      "Məlumat emalının məhdudlaşdırılmasını tələb etmək",
    ],
  },
  {
    title: "8. Yetkinlik yaşı",
    icon: (
      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
    content: "Platformadan istifadə edən şəxslər yerli qanunvericiliyə uyğun yaş həddinə çatmış olmalıdırlar.",
  },
  {
    title: "9. Dəyişikliklər",
    icon: (
      <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4z" />
      </svg>
    ),
    content: "ProElan.az bu Məxfilik Siyasətini istənilən vaxt yeniləmək hüququnu özündə saxlayır. Yenilənmiş versiya saytda dərc olunduğu andan qüvvəyə minir.",
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto mt-20 mb-10 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl text-gray-800 font-sans">
      <Helmet>
        <title>Məxfilik Siyasəti - ProElan.az</title>
        <meta
          name="description"
          content="ProElan.az Məxfilik Siyasəti. Pulsuz elan və alqı-satqı platformasında istifadəçi məlumatlarının qorunması qaydaları."
        />
        <link rel="canonical" href="https://proelan.az/privacy-policy" />
      </Helmet>

      <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-600">
        Məxfilik Siyasəti
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
            <h2 className="text-2xl font-semibold mb-3 text-teal-600">{section.title}</h2>
            {section.content && <p className="text-gray-700">{section.content}</p>}
            {section.list && (
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {section.list.map((item, i) => (
                  <li key={i} className="hover:text-teal-500 transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}

      <section className="mt-8 pt-6 border-t border-gray-300 flex gap-4">
        <svg className="w-6 h-6 text-teal-500 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m0 0l4-4m-4 4l4 4" />
        </svg>
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-teal-600">Əlaqə</h2>
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
          <p><strong>Platforma:</strong> ProElan.az</p>
        </div>
      </section>
    </div>
  );
}