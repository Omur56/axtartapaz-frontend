import { CheckCircle } from "lucide-react";

export default function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 md:p-12 max-w-md w-full text-center border border-green-100 animate-fade-in">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle size={48} className="text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Ödəniş uğurla tamamlandı
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 mt-3 text-sm md:text-base">
          Sizin əməliyyatınız uğurla həyata keçirildi. Təşəkkür edirik 🎉
        </p>

        {/* Button */}
        <div className="mt-6">
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
          >
            Ana səhifəyə qayıt
          </button>
        </div>
      </div>
    </div>
  );
}