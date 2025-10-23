"use client";

import { useEffect, useState } from "react";
import PageLayout from "@/components/PageLayout";

interface Lembaga {
  id: string;
  nama: string;
  pengertian: string;
  fungsi: string[];
  tugas: string[];
  wewenang: string[];
  susunanKeanggotaan: string;
  masaJabatan: string;
  prinsipKerja: {
    musyawarah: string;
    transparan: string;
    akuntabel: string;
    demokratis: string;
  };
}

export default function LembagaMasyarakatPage() {
  const [lembaga, setLembaga] = useState<Lembaga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/lembaga-masyarakat");
        if (!response.ok) throw new Error("Gagal mengambil data");
        const result = await response.json();
        setLembaga(result);
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
      {lembaga.map((item, idx) => (
        <section key={item.id} className="mb-12">
          <div className="section-box-blue">
            <h2 className="section-title">{item.nama}</h2>

            {/* Pengertian */}
            <div className="mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                📋 Pengertian
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {item.pengertian}
              </p>
            </div>

            {/* Fungsi */}
            {item.fungsi && item.fungsi.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                  ⚙️ Fungsi {item.nama}
                </h3>
                <ul className="space-y-3">
                  {item.fungsi.map((fungsi, index) => (
                    <li key={index} className="list-item">
                      <span className="list-bullet">•</span>
                      <span className="list-text">{fungsi}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tugas dan Wewenang */}
            {(item.tugas && item.tugas.length > 0) ||
            (item.wewenang && item.wewenang.length > 0) ? (
              <div className="mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                  🎯 Tugas dan Wewenang
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {item.tugas && item.tugas.length > 0 && (
                    <div className="bg-white p-4 sm:p-6 rounded border-l-4 border-blue-400">
                      <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">
                        Tugas
                      </h4>
                      <ul className="text-xs sm:text-sm text-gray-700 space-y-2">
                        {item.tugas.map((tugas, idx) => (
                          <li key={idx}>• {tugas}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.wewenang && item.wewenang.length > 0 && (
                    <div className="bg-white p-4 sm:p-6 rounded border-l-4 border-green-400">
                      <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">
                        Wewenang
                      </h4>
                      <ul className="text-xs sm:text-sm text-gray-700 space-y-2">
                        {item.wewenang.map((wewenang, idx) => (
                          <li key={idx}>• {wewenang}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Susunan Keanggotaan */}
            {item.susunanKeanggotaan && (
              <div className="mb-8">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                  👥 Susunan Keanggotaan
                </h3>
                <div className="bg-white p-4 sm:p-6 rounded">
                  <p className="text-gray-700 mb-3 text-sm sm:text-base">
                    {item.susunanKeanggotaan}
                  </p>
                  {item.masaJabatan && (
                    <p className="text-xs sm:text-sm text-gray-600">
                      <strong>Masa jabatan:</strong> {item.masaJabatan}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Prinsip Kerja */}
            {item.prinsipKerja && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                  💼 Prinsip Kerja
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {item.prinsipKerja.musyawarah && (
                    <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
                      <p className="text-xs sm:text-sm text-gray-700">
                        <strong className="text-green-700">Musyawarah:</strong>{" "}
                        {item.prinsipKerja.musyawarah}
                      </p>
                    </div>
                  )}
                  {item.prinsipKerja.transparan && (
                    <div className="bg-amber-50 p-4 rounded border-l-4 border-amber-500">
                      <p className="text-xs sm:text-sm text-gray-700">
                        <strong className="text-amber-700">Transparan:</strong>{" "}
                        {item.prinsipKerja.transparan}
                      </p>
                    </div>
                  )}
                  {item.prinsipKerja.akuntabel && (
                    <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-500">
                      <p className="text-xs sm:text-sm text-gray-700">
                        <strong className="text-purple-700">Akuntabel:</strong>{" "}
                        {item.prinsipKerja.akuntabel}
                      </p>
                    </div>
                  )}
                  {item.prinsipKerja.demokratis && (
                    <div className="bg-red-50 p-4 rounded border-l-4 border-red-500">
                      <p className="text-xs sm:text-sm text-gray-700">
                        <strong className="text-red-700">Demokratis:</strong>{" "}
                        {item.prinsipKerja.demokratis}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      ))}
    </PageLayout>
  );
}
