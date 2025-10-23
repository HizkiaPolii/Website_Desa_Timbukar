"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Grid3x3, Search } from "lucide-react";
import PageLayout from "@/components/PageLayout";

export default function GaleriPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Data Galeri
  const galeriData = [
    {
      id: 1,
      title: "Air Terjun 3 Tingkat",
      category: "wisata",
      description: "Keindahan air terjun bertingkat di Desa Timbukar",
      image: "/images/placeholder.svg",
      date: "2025-01-15",
    },
    {
      id: 2,
      title: "Homestay Timbukar",
      category: "wisata",
      description: "Penginapan nyaman dengan pemandangan alam asri",
      image: "/images/placeholder.svg",
      date: "2025-01-14",
    },
    {
      id: 3,
      title: "Arung Jeram Sungai Timbukar",
      category: "wisata",
      description: "Petualangan seru di sungai dengan pemandangan indah",
      image: "/images/placeholder.svg",
      date: "2025-01-13",
    },
    {
      id: 4,
      title: "Acara Gotong Royong",
      category: "acara",
      description:
        "Kebersamaan masyarakat dalam kegiatan pembersihan jalan desa",
      image: "/images/placeholder.svg",
      date: "2025-01-12",
    },
    {
      id: 5,
      title: "Pelatihan UMKM",
      category: "kegiatan",
      description: "Program pemberdayaan usaha kecil menengah desa",
      image: "/images/placeholder.svg",
      date: "2025-01-11",
    },
    {
      id: 6,
      title: "Pembangunan Jalan",
      category: "infrastruktur",
      description: "Progres pembangunan infrastruktur jalan desa",
      image: "/images/placeholder.svg",
      date: "2025-01-10",
    },
    {
      id: 7,
      title: "Perayaan HUT Desa",
      category: "acara",
      description: "Meriah perayaan hari ulang tahun Desa Timbukar",
      image: "/images/placeholder.svg",
      date: "2025-01-09",
    },
    {
      id: 8,
      title: "Pemeliharaan Jembatan",
      category: "infrastruktur",
      description: "Tim maintenance melakukan perbaikan jembatan desa",
      image: "/images/placeholder.svg",
      date: "2025-01-08",
    },
    {
      id: 9,
      title: "Pelatihan Pariwisata",
      category: "kegiatan",
      description: "Sosialisasi pengembangan desa wisata untuk masyarakat",
      image: "/images/placeholder.svg",
      date: "2025-01-07",
    },
  ];

  const categories = [
    { id: "semua", label: "Semua Foto", icon: "📷" },
    { id: "wisata", label: "Wisata", icon: "🏞️" },
    { id: "acara", label: "Acara", icon: "🎉" },
    { id: "kegiatan", label: "Kegiatan", icon: "🤝" },
    { id: "infrastruktur", label: "Infrastruktur", icon: "🏗️" },
  ];

  // Filter galeri
  const filteredGaleri = galeriData.filter((item) => {
    const matchCategory =
      selectedCategory === "semua" || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <>
      <PageLayout
        heroTitle="Galeri Desa"
        heroSubtitle="Koleksi foto keindahan alam dan kegiatan Desa Timbukar"
        currentPage="galeri"
        includeFooter={false}
      >
        {/* Search Bar */}
        <div className="mb-8 sm:mb-12">
          <div className="relative">
            <Search
              className="absolute left-4 top-3.5 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari foto galeri..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 transition-colors text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Filter Category */}
        <div className="mb-8 sm:mb-12">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            Kategori
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSearchQuery("");
                }}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mb-12 sm:mb-16">
          {filteredGaleri.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredGaleri.map((item) => (
                <div
                  key={item.id}
                  className="group cursor-pointer section-box-blue"
                  onClick={() => setSelectedImage(item.image)}
                >
                  <div className="relative h-56 sm:h-64 bg-gray-200 rounded-lg overflow-hidden mb-4 -m-4 sm:-m-6">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                      <Grid3x3
                        size={32}
                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.date).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-base sm:text-lg text-gray-600">
                Tidak ada foto yang sesuai dengan pencarian Anda.
              </p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="section-box-blue">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            📸 Kontribusi Foto
          </h3>
          <p className="text-gray-700 mb-4 text-sm sm:text-base">
            Anda memiliki foto menarik dari Desa Timbukar? Kami senang menerima
            kontribusi foto untuk galeri desa kami.
          </p>
          <div className="space-y-2 text-xs sm:text-sm text-gray-600">
            <p>
              📧 Kirim foto Anda ke: <strong>infodesatimbukar@gmail.com</strong>
            </p>
            <p>
              📞 Hubungi: <strong>081340798030</strong>
            </p>
            <p>✨ Sertakan judul, deskripsi, dan tanggal pengambilan foto</p>
          </div>
        </div>
      </PageLayout>

      {/* Lightbox/Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <Image
              src={selectedImage}
              alt="Gallery image"
              width={800}
              height={600}
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-200 transition-colors"
            >
              <X size={24} className="text-gray-900" />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DESA TIMBUKAR</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Website resmi Desa Timbukar, Kecamatan Sonder, Kabupaten
                Minahasa
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Menu</h4>
              <div className="space-y-2">
                <a
                  href="/"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Home
                </a>
                <a
                  href="/profil"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Profil Desa
                </a>
                <a
                  href="/galeri"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Galeri
                </a>
                <a
                  href="/kontak"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Kontak</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <p>📞 081340798030</p>
                <p>📧 infodesatimbukar@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Desa Timbukar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
