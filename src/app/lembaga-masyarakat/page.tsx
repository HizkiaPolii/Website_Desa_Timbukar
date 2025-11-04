"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";

interface Lembaga {
  id: number;
  nama: string;
  deskripsi: string | null;
  ketua: string | null;
  noTelepon: string | null;
  alamat: string | null;
  gambar: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function LembagaMasyarakatPage() {
  const [lembaga, setLembaga] = useState<Lembaga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://api.desatimbukar.id/api";
        const response = await fetch(`${apiUrl}/lembaga-masyarakat`);
        if (!response.ok) throw new Error("Gagal mengambil data");
        const result = await response.json();
        setLembaga(result.data || []);
      } catch (error) {
        console.error("Error fetching lembaga data:", error);
        setLembaga([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <PageLayout
        heroTitle="Lembaga Masyarakat"
        heroSubtitle="Informasi tentang lembaga-lembaga masyarakat di Desa Timbukar"
        currentPage="lembaga-masyarakat"
      >
        <div className="text-center py-12">Memuat data...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      heroTitle="Lembaga Masyarakat"
      heroSubtitle="Informasi tentang lembaga-lembaga masyarakat di Desa Timbukar"
      currentPage="lembaga-masyarakat"
    >
      {lembaga.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          Belum ada data lembaga masyarakat
        </div>
      ) : (
        <div className="space-y-8 sm:space-y-12 lg:space-y-16">
          {lembaga.map((item, index) => {
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
                key={item.id}
                className={`${bgColorMap[color]} shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden rounded-xl`}
              >
                {/* Layout: Deskripsi Kiri, Gambar Kanan */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-10">
                  {/* Konten Kiri - Deskripsi */}
                  <div className="flex flex-col justify-center">
                    {/* Nama Lembaga - Sangat Besar */}
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                      {item.nama}
                    </h2>

                    {/* Separator Line */}
                    <div className="w-16 h-1 bg-emerald-500 mb-6 rounded-full"></div>

                    {/* Deskripsi - Besar dan Readable */}
                    {item.deskripsi && (
                      <p className="text-gray-700 mb-8 text-base sm:text-lg lg:text-xl leading-relaxed lg:leading-9">
                        {item.deskripsi}
                      </p>
                    )}

                    {/* Info Tambahan - Besar */}
                    <div className="text-base sm:text-lg lg:text-xl text-gray-700 space-y-5">
                      {item.ketua && (
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 mb-1">
                            Ketua Lembaga
                          </span>
                          <span className="text-gray-700 text-lg">
                            {item.ketua}
                          </span>
                        </div>
                      )}
                      {item.alamat && (
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 mb-1">
                            Alamat
                          </span>
                          <span className="text-gray-700 text-lg">
                            {item.alamat}
                          </span>
                        </div>
                      )}
                      {item.noTelepon && (
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 mb-1">
                            Telepon
                          </span>
                          <a
                            href={`tel:${item.noTelepon}`}
                            className="text-blue-600 hover:text-blue-800 text-lg font-semibold"
                          >
                            {item.noTelepon}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gambar Kanan - Sangat Besar */}
                  {item.gambar && (
                    <div className="flex items-center justify-center">
                      <Image
                        src={item.gambar}
                        alt={item.nama}
                        width={600}
                        height={600}
                        className="w-full h-auto object-cover rounded-xl shadow-lg"
                        unoptimized={true}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
