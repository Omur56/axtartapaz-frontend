import { useState } from "react";

export default function NavbarModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header hissəsi */}
      <header className="h-[60px] px-5 bg-zinc-900 text-white flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold">LOGO</div>

        {/* Navbar icon */}
        <button
          onClick={() => setOpen(true)}
          className="text-2xl hover:text-blue-400 transition"
        >
          ☰
        </button>
      </header>

      {/* Modal overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
        >
          {/* Modal content */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-[320px] max-w-[90%] rounded-2xl p-6 relative animate-scaleIn"
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-black"
            >
              ×
            </button>

            {/* Navbar links (BURANI ÖZÜN DOLDUR) */}
            <nav className="flex flex-col gap-4 mt-6">
              <a href="#" className="text-lg hover:text-blue-500">
                Ana səhifə
              </a>
              <a href="#" className="text-lg hover:text-blue-500">
                Avtomobillər
              </a>
              <a href="#" className="text-lg hover:text-blue-500">
                Kateqoriyalar
              </a>
              <a href="#" className="text-lg hover:text-blue-500">
                Əlaqə
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
