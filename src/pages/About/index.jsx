const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl w-full bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-shadow duration-500">
        
        {/* Başlıq */}
        <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
          Layihə haqqında
        </h2>

        {/* Layihə təsviri */}
        <p className="text-gray-700 text-lg leading-relaxed text-center mb-8">
          ProElan.az layihəsi Azərbaycanda özəl elanlar üçün universal
          meydança təşkil etmək məqsədi ilə yaradılıb. Hər bir kəs saytdan
          istifadə etməklə geyim və mebeldən tutmuş elektronika və
          avtomobillərə qədər hər şey ala və sata bilər. ProElan.az-a əsasən
          ayrıca fərdlər elan yerləşdirir, lakin sayt şirkət və fərdi
          sahibkarlar üçün də maraq kəsb edir. Burada təkcə işlənmiş deyil,
          eləcə də yeni məhsullar da əldə etmək olar.
        </p>

        {/* Sahib və Əlaqə */}
        <div className="flex flex-col items-center space-y-4 text-center">
          
          <div className="bg-white/30 backdrop-blur-md rounded-xl px-6 py-4 shadow-md hover:shadow-lg transition-shadow duration-300 w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-1">Rəhbər</h3>
            <p className="text-gray-700 text-lg">Ömürxan Abdullayev</p>
          </div>

          <div className="bg-white/30 backdrop-blur-md rounded-xl px-6 py-4 shadow-md hover:shadow-lg transition-shadow duration-300 w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-1">Əlaqə</h3>
            <p className="text-gray-700 text-lg">+994 55 913 80 99</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;
