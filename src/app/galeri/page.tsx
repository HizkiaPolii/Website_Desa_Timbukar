"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import PageLayout from "@/components/PageLayout";
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

  const getImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return "/images/placeholder.svg";
    // Jika sudah full URL (http/https), kembalikan as-is
    if (imagePath.startsWith("http")) return imagePath;
    // Jika sudah path absolut dari Next.js API (/uploads/...), kembalikan as-is
    if (imagePath.startsWith("/uploads/")) return imagePath;
    if (imagePath.startsWith("/images/")) return imagePath;
    // Fallback: anggap sebagai nama file, transform to /images/galeri/...
    return `/images/galeri/${imagePath}`;
  };

  return (
    <PageLayout
      currentPage="galeri"
      heroTitle="Galeri Desa Timbukar"
      heroSubtitle="Jelajahi keindahan dan kegiatan masyarakat Desa Timbukar"
    >
      <div className="w-full bg-gray-50 py-4 sm:py-6 md:py-8 lg:py-12">
        {/* Mobile Layout */}
        <div className="md:hidden mx-auto w-full px-3">
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Cari galeri..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-normal transition-all focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Category Filter */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600"></div>
            </div>
          )}

          {/* Gallery Grid - Mobile */}
          {!loading && filteredData.length > 0 && (
            <div className="grid gap-3 grid-cols-1">
              {filteredData.map((galeri) => (
                <div
                  key={galeri.id}
                  className="group flex overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 active:shadow-md cursor-pointer"
                  onClick={() =>
                    setSelectedImage({
                      src: getImageUrl(galeri.gambar),
                      judul: galeri.judul,
                    })
                  }
                >
                  {/* Image - Mobile Horizontal */}
                  <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden bg-gray-200">
                    <Image
                      src={getImageUrl(galeri.gambar)}
                      alt={galeri.judul}
                      fill
                      className="object-cover transition-transform duration-300 group-active:scale-110"
                      sizes="96px"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-active:bg-black/10" />
                  </div>

                  {/* Content - Mobile */}
                  <div className="flex flex-1 flex-col justify-between p-2.5">
                    <div>
                      <h3 className="line-clamp-1 text-sm font-bold text-gray-900">
                        {galeri.judul}
                      </h3>
                      <p className="line-clamp-1 text-xs text-gray-600">
                        {galeri.deskripsi}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {new Date(galeri.created_at).toLocaleDateString(
                          "id-ID"
                        )}
                      </p>
                      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
                        {categories.find(
                          (c) =>
                            c.id.toLowerCase() ===
                            (galeri.kategori?.toLowerCase() || "")
                        )?.label || galeri.kategori}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State - Mobile */}
          {!loading && filteredData.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <p className="text-center text-sm text-gray-500">
                {galeriData.length === 0
                  ? "Belum ada galeri"
                  : "Tidak ada hasil"}
              </p>
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block mx-auto w-full max-w-6xl px-6 lg:px-8">
          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Cari galeri..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base font-normal transition-all focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-md hover:shadow-lg"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-emerald-600 hover:text-emerald-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600"></div>
            </div>
          )}

          {/* Gallery Grid - Desktop */}
          {!loading && filteredData.length > 0 && (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredData.map((galeri) => (
                <div
                  key={galeri.id}
                  className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                  onClick={() =>
                    setSelectedImage({
                      src: getImageUrl(galeri.gambar),
                      judul: galeri.judul,
                    })
                  }
                >
                  {/* Image Container - Fixed Aspect Ratio */}
                  <div className="relative w-full aspect-video overflow-hidden bg-gray-200">
                    <Image
                      src={getImageUrl(galeri.gambar)}
                      alt={galeri.judul}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />
                    {/* Category Badge */}
                    <div className="absolute right-3 top-3 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md">
                      {categories.find(
                        (c) =>
                          c.id.toLowerCase() ===
                          (galeri.kategori?.toLowerCase() || "")
                      )?.label || galeri.kategori}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 line-clamp-2 text-base font-bold text-gray-900">
                      {galeri.judul}
                    </h3>
                    <p className="mb-3 flex-1 line-clamp-2 text-sm text-gray-600">
                      {galeri.deskripsi}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(galeri.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State - Desktop */}
          {!loading && filteredData.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <p className="text-lg text-gray-500">
                {galeriData.length === 0
                  ? "Belum ada galeri yang tersedia"
                  : "Tidak ada galeri yang cocok dengan pencarian Anda"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal - Mobile Version (< 768px) */}
      {selectedImage && (
        <>
          {/* Mobile Modal */}
          <div className="fixed inset-0 z-50 flex flex-col bg-black/70 md:hidden">
            {/* Close Button - Mobile */}
            <div className="flex items-center justify-between bg-black px-4 py-3">
              <h3 className="text-white font-semibold text-sm truncate flex-1">
                {selectedImage.judul}
              </h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
              >
                <X size={20} />
              </button>
            </div>

            {/* Image Container - Mobile */}
            <div className="relative flex-1 w-full overflow-auto bg-black">
              <Image
                src={selectedImage.src}
                alt={selectedImage.judul}
                fill
                className="object-contain"
                priority
                sizes="100vw"
              />
            </div>

            {/* Title & Info - Mobile */}
            <div className="bg-black px-4 py-3 border-t border-gray-800">
              <h2 className="text-white text-base font-bold break-words mb-2">
                {selectedImage.judul}
              </h2>
              <button
                onClick={() => setSelectedImage(null)}
                className="w-full rounded-lg bg-emerald-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>

          {/* Desktop Modal */}
          <div
            className="hidden md:fixed md:inset-0 md:z-50 md:flex md:items-center md:justify-center bg-black/85 md:p-4 lg:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[95vh] lg:max-h-screen"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Desktop */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white hover:bg-gray-100 text-gray-800 transition-colors shadow-lg hover:shadow-xl"
              >
                <X size={28} />
              </button>

              {/* Image Container - Desktop (Much Larger) */}
              <div className="relative w-full flex-1 overflow-auto bg-gray-900">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.judul}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 1024px) 95vw, 90vw"
                />
              </div>

              {/* Title Section - Desktop */}
              <div className="border-t border-gray-300 bg-white px-8 py-6 lg:py-8 overflow-y-auto max-h-32">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 break-words">
                  {selectedImage.judul}
                </h2>
              </div>
            </div>
          </div>
        </>
      )}
    </PageLayout>
  );
}
