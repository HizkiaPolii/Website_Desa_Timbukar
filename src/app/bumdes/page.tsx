"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";

interface BumdesData {
  id: number;
  nama_bumdes: string;
  deskripsi: string;
  jenis_usaha: string;
  alamat: string;
  no_telepon: string;
  pimpinan: string;
  gambar: string;
  created_at: string;
  updated_at: string;
}

export default function BumdesPage() {
  const [bumdesData, setBumdesData] = useState<BumdesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/bumdes");

        if (!response.ok) {
          throw new Error("Gagal mengambil data dari server");
        }

        const result = await response.json();

        // API returns { message: "...", data: [...] }
        setBumdesData(result.data || []);
      } catch (error) {
        console.error("Error fetching bumdes data:", error);
        setError(error instanceof Error ? error.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <PageLayout
        heroTitle="BUMDES"
        heroSubtitle="Badan Usaha Milik Desa Timbukar"
        currentPage="bumdes"
      >
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        heroTitle="BUMDES"
        heroSubtitle="Badan Usaha Milik Desa Timbukar"
        currentPage="bumdes"
      >
        <div className="bg-red-50 p-4 rounded-lg text-red-700 border border-red-200">
          <p>⚠️ {error}</p>
        </div>
      </PageLayout>
    );
  }

  if (bumdesData.length === 0) {
    return (
      <PageLayout
        heroTitle="BUMDES"
        heroSubtitle="Badan Usaha Milik Desa Timbukar"
        currentPage="bumdes"
      >
        <div className="text-center py-12">
          <p className="text-gray-500">Belum ada data BUMDES</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      heroTitle="BUMDES"
      heroSubtitle="Badan Usaha Milik Desa Timbukar"
      currentPage="bumdes"
    >
      {/* Business Units */}
      <div className="space-y-8 sm:space-y-12 lg:space-y-16">
        {bumdesData.map((bumdes, index) => {
          // Generate color based on index
          const colors = ["blue", "green", "cyan", "amber"];
          const color = colors[index % colors.length];

          const bgColorMap: { [key: string]: string } = {
            blue: "section-box-blue",
            green: "section-box-green",
            cyan: "section-box-blue",
            amber: "section-box-amber",
          };

          return (
            <div 
              key={bumdes.id} 
              className={`${bgColorMap[color]} shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden rounded-xl`}
            >
              {/* Layout: Deskripsi Kiri, Gambar Kanan */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-10">
                
                {/* Konten Kiri - Deskripsi */}
                <div className="flex flex-col justify-center">
                  {/* Nama BUMDES - Sangat Besar */}
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    {bumdes.nama_bumdes}
                  </h3>

                  {/* Jenis Usaha - Besar */}
                  <p className="text-base sm:text-lg lg:text-xl text-emerald-600 mb-6 font-bold uppercase tracking-widest">
                    {bumdes.jenis_usaha}
                  </p>

                  {/* Separator Line */}
                  <div className="w-16 h-1 bg-emerald-500 mb-6 rounded-full"></div>

                  {/* Deskripsi - Besar dan Readable */}
                  <p className="text-gray-700 mb-8 text-base sm:text-lg lg:text-xl leading-relaxed lg:leading-9">
                    {bumdes.deskripsi}
                  </p>

                  {/* Info Tambahan - Besar */}
                  <div className="text-base sm:text-lg lg:text-xl text-gray-700 space-y-5">
                    {bumdes.pimpinan && (
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 mb-1">Pimpinan</span>
                        <span className="text-gray-700 text-lg">{bumdes.pimpinan}</span>
                      </div>
                    )}
                    {bumdes.alamat && (
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 mb-1">Alamat</span>
                        <span className="text-gray-700 text-lg">{bumdes.alamat}</span>
                      </div>
                    )}
                    {bumdes.no_telepon && (
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 mb-1">Telepon</span>
                        <span className="text-gray-700 text-lg">{bumdes.no_telepon}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gambar Kanan - Sangat Besar */}
                {bumdes.gambar && (
                  <div className="flex items-center justify-center">
                    <Image
                      src={bumdes.gambar}
                      alt={bumdes.nama_bumdes}
                      width={600}
                      height={600}
                      className="w-full h-auto object-cover rounded-xl shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
