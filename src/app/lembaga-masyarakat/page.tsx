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
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
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
        lembaga.map((item) => (
          <section key={item.id} className="mb-12">
            <div className="section-box-blue">
              <h2 className="section-title">{item.nama}</h2>

              {/* Gambar */}
              {item.gambar && (
                <div className="mb-8">
                  <Image
                    src={item.gambar}
                    alt={item.nama}
                    width={300}
                    height={200}
                    className="w-full max-w-md h-auto rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Deskripsi */}
              {item.deskripsi && (
                <div className="mb-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                    📋 Deskripsi
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {item.deskripsi}
                  </p>
                </div>
              )}

              {/* Ketua */}
              {item.ketua && (
                <div className="mb-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                    � Ketua Lembaga
                  </h3>
                  <div className="bg-white p-4 sm:p-6 rounded border-l-4 border-blue-400">
                    <p className="text-gray-700 text-sm sm:text-base">
                      {item.ketua}
                    </p>
                  </div>
                </div>
              )}

              {/* Alamat */}
              {item.alamat && (
                <div className="mb-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                    📍 Alamat
                  </h3>
                  <div className="bg-white p-4 sm:p-6 rounded border-l-4 border-green-400">
                    <p className="text-gray-700 text-sm sm:text-base">
                      {item.alamat}
                    </p>
                  </div>
                </div>
              )}

              {/* No. Telepon */}
              {item.noTelepon && (
                <div className="mb-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                    📞 Nomor Telepon
                  </h3>
                  <div className="bg-white p-4 sm:p-6 rounded border-l-4 border-purple-400">
                    <a
                      href={`tel:${item.noTelepon}`}
                      className="text-blue-600 hover:text-blue-800 text-sm sm:text-base font-semibold"
                    >
                      {item.noTelepon}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </section>
        ))
      )}
    </PageLayout>
  );
}
