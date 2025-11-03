import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 sm:py-16 mt-16 sm:mt-20">
      <div className="container-main">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 mb-8 sm:mb-12">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              DESA TIMBUKAR
            </h3>
            <p className="text-sm sm:text-base text-gray-400">
              Website resmi Desa Timbukar, Kecamatan Sonder, Kabupaten Minahasa,
              Sulawesi Utara
            </p>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Menu Utama
            </h4>
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-sm sm:text-base text-gray-400 hover:text-white transition-colors"
              >
                🏠 Beranda
              </Link>
              <Link
                href="/profil"
                className="block text-sm sm:text-base text-gray-400 hover:text-white transition-colors"
              >
                📋 Profil Desa
              </Link>
              <Link
                href="/pemerintahan-desa"
                className="block text-sm sm:text-base text-gray-400 hover:text-white transition-colors"
              >
                👥 Pemerintahan Desa
              </Link>
              <Link
                href="/galeri"
                className="block text-sm sm:text-base text-gray-400 hover:text-white transition-colors"
              >
                🖼️ Galeri
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Hubungi Kami
            </h4>
            <div className="space-y-2 text-sm sm:text-base text-gray-400">
              <p>📞 081340798030</p>
              <p>📧 infodesatimbukar@gmail.com</p>
              <p>📍 Desa Timbukar, Kecamatan Sonder</p>
              <p className="pt-2 font-medium text-emerald-400">
                Kabupaten Minahasa, Sulawesi Utara
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2025 Desa Timbukar. Semua hak dilindungi. | Website
            Pemerintah Desa
          </p>
          <div className="mt-4 p-3 sm:p-4 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-sm sm:text-base font-semibold text-gray-200">
              ©️ Hak Kekayaan Intelektual
            </p>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Didesain dan disusun oleh Mahasiswa KKT 144 Unsrat Posko Timbukar
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
