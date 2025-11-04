"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Search, Filter } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { getImageUrl } from "@/utils/imageUrl";
import { showToast } from "@/utils/toast";

interface GaleriItem {
  id: number;
  judul: string;
  deskripsi: string;
  gambar: string;
  kategori: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  message: string;
  data: GaleriItem[] | GaleriItem;
}

export default function GaleriPage() {
  const [galeriData, setGaleriData] = useState<GaleriItem[]>([]);
  const [filteredData, setFilteredData] = useState<GaleriItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    judul: string;
  } | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const categories = [
    { id: "semua", label: "Semua Kategori" },
    { id: "Wisata", label: "Wisata" },
    { id: "Acara", label: "Acara" },
    { id: "Kegiatan", label: "Kegiatan" },
    { id: "Infrastruktur", label: "Infrastruktur" },
    { id: "KKT UNSRAT", label: "KKT UNSRAT" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/galeri");

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const result: ApiResponse = await response.json();
        const data = Array.isArray(result.data) ? result.data : [];
        setGaleriData(data);
        setFilteredData(data);
      } catch (error) {
        const msg =
          error instanceof Error ? error.message : "Gagal memuat galeri";
        console.error("Fetch error:", msg);
        showToast.error(msg);
        setGaleriData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = galeriData;

    if (selectedCategory !== "semua") {
      filtered = filtered.filter(
        (item) => item.kategori.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.judul.toLowerCase().includes(query) ||
          item.deskripsi.toLowerCase().includes(query)
      );
    }

    setFilteredData(filtered);
  }, [selectedCategory, searchQuery, galeriData]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      document.addEventListener("keydown", handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  return (
    <PageLayout
      currentPage="galeri"
      heroTitle="Galeri Desa Timbukar"
      heroSubtitle="Jelajahi keindahan dan kegiatan masyarakat Desa Timbukar"
    >
      <div className="w-full bg-white py-8 md:py-12 lg:py-16">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8 md:mb-12 lg:mb-16">
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari galeri berdasarkan judul atau deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm md:text-base font-normal transition-all focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center rounded-lg px-3 sm:px-4 md:px-5 py-2 md:py-2.5 text-xs sm:text-sm md:text-base font-medium transition-all duration-200 whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20 md:py-32">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600"></div>
                <p className="text-gray-500 text-sm md:text-base">
                  Memuat galeri...
                </p>
              </div>
            </div>
          )}

          {/* Gallery Grid */}
          {!loading && filteredData.length > 0 && (
            <div className="grid gap-4 sm:gap-5 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredData.map((galeri) => (
                <div
                  key={galeri.id}
                  onClick={() =>
                    setSelectedImage({
                      src: getImageUrl(galeri.gambar),
                      judul: galeri.judul,
                    })
                  }
                  className="group flex flex-col overflow-hidden rounded-xl bg-white hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div className="relative w-full overflow-hidden bg-gray-200 aspect-square sm:aspect-video">
                    <Image
                      src={getImageUrl(galeri.gambar)}
                      alt={galeri.judul}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />

                    {/* Category Badge */}
                    <div className="absolute right-2 top-2 sm:right-3 sm:top-3 rounded-lg bg-emerald-600 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-xs font-semibold text-white shadow-lg">
                      {categories.find(
                        (c) =>
                          c.id.toLowerCase() ===
                          (galeri.kategori?.toLowerCase() || "")
                      )?.label || galeri.kategori}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-3 sm:p-4 md:p-5">
                    <h3 className="line-clamp-2 text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1.5 md:mb-2 group-hover:text-emerald-600 transition-colors">
                      {galeri.judul}
                    </h3>
                    <p className="line-clamp-2 text-xs sm:text-sm text-gray-600 mb-3 md:mb-4 flex-grow">
                      {galeri.deskripsi}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {new Date(galeri.created_at).toLocaleDateString(
                          "id-ID",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 md:py-32">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-center text-gray-500 text-base md:text-lg">
                {galeriData.length === 0
                  ? "Belum ada galeri yang ditambahkan"
                  : "Tidak ada galeri yang sesuai dengan pencarian Anda"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 animate-fadeIn overflow-y-auto"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="fixed right-4 top-4 z-50 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 active:bg-white/30 backdrop-blur-sm"
          >
            <X size={24} className="md:w-7 md:h-7" />
          </button>

          {/* Container */}
          <div
            className="flex flex-col items-center justify-center w-full min-h-screen p-4 sm:p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Wrapper - Responsive Size */}
            <div className="relative w-full max-w-2xl md:max-w-4xl lg:max-w-6xl mb-6 md:mb-8">
              <div className="relative w-full aspect-auto">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.judul}
                  width={1200}
                  height={800}
                  className="w-full h-auto max-h-[60vh] md:max-h-[75vh] object-contain rounded-lg"
                  priority
                  quality={90}
                />
              </div>
            </div>

            {/* Title Section */}
            <div className="w-full max-w-2xl md:max-w-4xl lg:max-w-6xl bg-white/10 backdrop-blur-md rounded-lg p-4 md:p-6 border border-white/20">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white break-words">
                {selectedImage.judul}
              </h2>
            </div>

            {/* Keyboard Hint */}
            <p className="text-white/60 text-xs sm:text-sm mt-4 md:mt-6">
              Tekan ESC atau klik di luar untuk menutup
            </p>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
