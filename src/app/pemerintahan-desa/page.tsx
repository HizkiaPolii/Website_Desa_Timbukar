"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Phone } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import Card from "@/components/Card";

interface Posisi {
  nama: string;
  jabatan: string;
  foto: string;
  kontak: string;
  tugas?: string;
}

interface Level {
  level: string;
  posisi: Posisi[];
}

interface Bidang {
  nama: string;
  deskripsi: string;
  icon: string;
}

interface PemerintahanData {
  struktur: Level[];
  bidang: Bidang[];
}

export default function PemerintahanDesaPage() {
  const [data, setData] = useState<PemerintahanData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/pemerintahan");
        if (!response.ok) throw new Error("Gagal mengambil data");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching pemerintahan data:", error);
        // Fallback ke data kosong jika gagal
        setData({ struktur: [], bidang: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <PageLayout
        heroTitle="Pemerintahan Desa"
        heroSubtitle="Struktur organisasi dan bidang-bidang pemerintahan Desa Timbukar"
        currentPage="pemerintahan-desa"
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600">Memuat data pemerintahan...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!data) {
    return (
      <PageLayout
        heroTitle="Pemerintahan Desa"
        heroSubtitle="Struktur organisasi dan bidang-bidang pemerintahan Desa Timbukar"
        currentPage="pemerintahan-desa"
      >
        <div className="text-center text-red-600">
          Gagal memuat data pemerintahan
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      heroTitle="Pemerintahan Desa"
      heroSubtitle="Struktur organisasi dan bidang-bidang pemerintahan Desa Timbukar"
      currentPage="pemerintahan-desa"
    >
      {/* Struktur Organisasi */}
      {data.struktur.map((level, levelIdx) => (
        <section key={levelIdx} className="mb-16 sm:mb-20">
          <h2 className="section-title text-emerald-600">{level.level}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {level.posisi.map((pos, posIdx) => (
              <div key={posIdx} className="section-box-blue overflow-hidden">
                {/* Photo */}
                <div className="relative w-full h-48 sm:h-56 bg-gray-200 -m-4 sm:-m-6 lg:-m-8 mb-4 sm:mb-6">
                  <Image
                    src={pos.foto}
                    alt={pos.nama}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/placeholder.svg";
                    }}
                  />
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                    {pos.nama}
                  </h3>
                  <p className="text-sm sm:text-base badge-primary mb-3">
                    {pos.jabatan}
                  </p>

                  {pos.tugas && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-4">
                      {pos.tugas}
                    </p>
                  )}

                  {/* Contact */}
                  {pos.kontak && pos.kontak !== "-" && (
                    <div className="flex items-center gap-2 text-gray-700 text-xs sm:text-sm">
                      <Phone
                        size={16}
                        className="text-emerald-600 flex-shrink-0"
                      />
                      <span>{pos.kontak}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Bidang-Bidang */}
      <section className="mt-12">
        <h2 className="section-title text-emerald-600">
          Bidang-Bidang Pemerintahan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {data.bidang.map((bid, idx) => (
            <div key={idx} className="section-box-emerald">
              <div className="text-3xl sm:text-4xl mb-4">{bid.icon}</div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                {bid.nama}
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                {bid.deskripsi}
              </p>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
