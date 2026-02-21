import React from "react";
import { Helmet } from "react-helmet-async";

// SVG Icons
const icons = {
  weapon: (
    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L15 8H9L12 2zM2 22l10-10-10-10v20zM22 22l-10-10 10-10v20z" />
    </svg>
  ),
  drug: (
    <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8v16z" />
    </svg>
  ),
  fake: (
    <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L2 12h3v8h14v-8h3L12 2z" />
    </svg>
  ),
  theft: (
    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 4h16v16H4V4zm2 2v12h12V6H6z" />
    </svg>
  ),
  scam: (
    <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l7 12h-14l7-12zm0 3.27L10.66 10h2.68L12 5.27z" />
    </svg>
  ),
  dangerous: (
    <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l10 20H2L12 2z" />
    </svg>
  ),
  hate: (
    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c2 0 3.5 1 4.5 2.09C13 4 14.5 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
};

export default function Prohibited() {
  const items = [
    { icon: icons.weapon, text: "Qanunsuz silah və partlayıcı maddələr" },
    { icon: icons.drug, text: "Narkotik vasitələr və psixotrop maddələr" },
    { icon: icons.fake, text: "Saxta sənədlər" },
    { icon: icons.theft, text: "Oğurluq və ya şübhəli mənşəli məhsullar" },
    { icon: icons.scam, text: "Fırıldaqçılıq xarakterli elanlar" },
    { icon: icons.dangerous, text: "Təhlükəli və qanunla qadağan edilmiş məhsullar" },
    { icon: icons.hate, text: "Nifrət və ayrı-seçkilik yaradan məzmun" },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-20 mb-10 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl text-gray-900 font-sans">
      <Helmet>
        <title>Qadağan Olunmuş Elanlar - ProElan.az</title>
        <meta
          name="description"
          content="ProElan.az platformasında yerləşdirilməsi qadağan olunan elanlar."
        />
        <link rel="canonical" href="https://proelan.az/prohibited" />
      </Helmet>

      <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600">
        Qadağan Olunmuş Elanlar
      </h1>
      <p className="italic text-gray-500 mb-8">
        Platformada aşağıdakı elanların yerləşdirilməsi qəti qadağandır
      </p>

      <ul className="space-y-4">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-center p-4 bg-white rounded-xl shadow hover:shadow-lg transition-shadow transform hover:scale-105"
          >
            <div className="mr-4">{item.icon}</div>
            <span className="text-lg font-medium text-gray-800">{item.text}</span>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-lg font-semibold text-red-700">
        Qadağan olunmuş elan yerləşdirən istifadəçilərin hesabları dərhal bloklanacaq.
      </p>
    </div>
  );
}