"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GaleriItem {
  id: string | number;
  judul: string;
  deskripsi: string;
  gambar?: string;
  foto_url?: string;
  [key: string]: any;
}

export default function GaleriSlideshow() {
  const [galeries, setGaleries] = useState<GaleriItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get correct image URL
  const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return "/images/placeholder.svg";
    // Jika sudah full URL (http/https), kembalikan as-is
    if (imagePath.startsWith("http")) return imagePath;
    // Jika sudah path absolut dari Next.js API (/uploads/...), kembalikan as-is
    if (imagePath.startsWith("/uploads/")) return imagePath;
    if (imagePath.startsWith("/images/")) return imagePath;
    // Fallback: anggap sebagai nama file, transform to /uploads/galeri/...
    return `/uploads/galeri/${imagePath}`;
  };

  useEffect(() => {
    fetchGaleries();
  }, []);

  const fetchGaleries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/galeri");
      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        // Shuffle dan ambil random
        const shuffled = [...data.data].sort(() => Math.random() - 0.5);
        // Ambil maksimal 6 galeri untuk slideshow
        setGaleries(shuffled.slice(0, 6));
      } else if (Array.isArray(data)) {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setGaleries(shuffled.slice(0, 6));
      }
    } catch (err) {
      console.error("Error fetching galeries:", err);
      setError("Gagal memuat galeri");
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? galeries.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === galeries.length - 1 ? 0 : prev + 1));
  };

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    if (galeries.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === galeries.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [galeries.length]);

  if (loading) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center animate-pulse">
        <p className="text-gray-600">Memuat galeri...</p>
      </div>
    );
  }

  if (error || galeries.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-600">{error || "Tidak ada galeri tersedia"}</p>
      </div>
    );
  }

  const currentGalery = galeries[currentIndex];

  return (
    <div className="w-full">
      {/* Main Slideshow */}
      <div className="relative w-full h-96 sm:h-[500px] lg:h-[600px] overflow-hidden rounded-xl shadow-xl">
        {/* Image */}
        <div className="relative w-full h-full">
          <Image
            src={getImageUrl(currentGalery.gambar)}
            alt={currentGalery.judul}
            fill
            className="object-cover transition-transform duration-500"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white z-10">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
            {currentGalery.judul}
          </h3>
          <p className="text-sm sm:text-base text-gray-200 mb-4 line-clamp-2">
            {currentGalery.deskripsi}
          </p>
          <Link
            href="/galeri"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
          >
            Lihat Selengkapnya →
          </Link>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {galeries.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-emerald-500"
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Preview */}
      <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {galeries.map((galery, index) => (
          <button
            key={galery.id}
            onClick={() => setCurrentIndex(index)}
            className={`relative h-24 sm:h-28 rounded-lg overflow-hidden transition-all ${
              index === currentIndex
                ? "ring-2 ring-emerald-600 scale-105"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={getImageUrl(galery.gambar)}
              alt={galery.judul}
              fill
              className="object-cover"
            />
            {index === currentIndex && (
              <div className="absolute inset-0 bg-emerald-600/30"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
