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
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Cari galeri..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          )}

          {/* Gallery Grid */}
          {!loading && filteredData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredData.map((galeri) => (
                <div
                  key={galeri.id}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 group cursor-pointer"
                  onClick={() =>
                    setSelectedImage({
                      src: getImageUrl(galeri.gambar),
                      judul: galeri.judul,
                    })
                  }
                >
                  <div className="relative h-80 overflow-hidden bg-gray-200">
                    <Image
                      src={getImageUrl(galeri.gambar)}
                      alt={galeri.judul}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {categories.find(
                        (c) =>
                          c.id.toLowerCase() ===
                          (galeri.kategori?.toLowerCase() || "")
                      )?.label || galeri.kategori}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {galeri.judul}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
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

          {/* Empty State */}
          {!loading && filteredData.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-gray-500">
                {galeriData.length === 0
                  ? "Belum ada galeri yang tersedia"
                  : "Tidak ada galeri yang cocok dengan pencarian Anda"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-screen flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-200 transition-colors z-10"
            >
              <X size={28} className="text-gray-900" />
            </button>

            {/* Image */}
            <div className="relative w-full h-screen max-h-[85vh] bg-black">
              <Image
                src={selectedImage.src}
                alt={selectedImage.judul}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Title */}
            <div className="bg-white p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedImage.judul}
              </h2>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
