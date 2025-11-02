"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import { apbdesApi } from "@/services/apbdesApi";
import { ChevronDown } from "lucide-react";

interface ApbdesData {
  id: number;
  tahun: number;
  keterangan: string;
  pendapatan: number | string;
  belanja: number | string;
  pembiayaan: number | string;
  file_dokumen: string | null;
}

const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numValue);
};

export default function ApbdesPage() {
  const [apbdesData, setApbdesData] = useState<ApbdesData | null>(null);
  const [allApbdesData, setAllApbdesData] = useState<ApbdesData[]>([]);
  const [selectedTahun, setSelectedTahun] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadApbdesData = async () => {
      try {
        setIsLoading(true);
        const allData = await apbdesApi.getAll();

        if (allData && allData.length > 0) {
          setAllApbdesData(allData);
          // Ambil data tahun terbaru
          const latestData = allData.reduce((latest, current) => {
            const currentTahun =
              typeof current.tahun === "string"
                ? parseInt(current.tahun)
                : current.tahun;
            const latestTahun =
              typeof latest.tahun === "string"
                ? parseInt(latest.tahun)
                : latest.tahun;
            return currentTahun > latestTahun ? current : latest;
          });
          setApbdesData(latestData);
          setSelectedTahun(
            typeof latestData.tahun === "string"
              ? parseInt(latestData.tahun)
              : latestData.tahun
          );
        } else {
          setError("Data APBDES belum tersedia");
        }
      } catch (err) {
        console.error("Error loading APBDES data:", err);
        setError("Gagal memuat data APBDES");
      } finally {
        setIsLoading(false);
      }
    };

    loadApbdesData();
  }, []);

  const handleTahunChange = (tahun: number) => {
    const selected = allApbdesData.find(
      (item) =>
        (typeof item.tahun === "string" ? parseInt(item.tahun) : item.tahun) ===
        tahun
    );
    if (selected) {
      setApbdesData(selected);
      setSelectedTahun(tahun);
    }
  };

  // Handle ESC key untuk tutup modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen]);

  // Convert string values to numbers if needed
  const pendapatan = apbdesData
    ? typeof apbdesData.pendapatan === "string"
      ? parseFloat(apbdesData.pendapatan)
      : apbdesData.pendapatan
    : 0;

  const belanja = apbdesData
    ? typeof apbdesData.belanja === "string"
      ? parseFloat(apbdesData.belanja)
      : apbdesData.belanja
    : 0;

  const pembiayaan = apbdesData
    ? typeof apbdesData.pembiayaan === "string"
      ? parseFloat(apbdesData.pembiayaan)
      : apbdesData.pembiayaan
    : 0;

  const surplus = pendapatan - belanja - pembiayaan;

  return (
    <PageLayout
      heroTitle="APBDES"
      heroSubtitle={
        apbdesData
          ? `Anggaran Pendapatan dan Belanja Desa Timbukar Tahun ${apbdesData.tahun}`
          : "Anggaran Pendapatan dan Belanja Desa Timbukar"
      }
      currentPage="apbdes"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4" />
            <p className="text-gray-600 font-semibold">Memuat data APBDES...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded mb-8">
          <p className="text-red-700 font-semibold">⚠️ Error</p>
          <p className="text-red-600">{error}</p>
        </div>
      ) : apbdesData ? (
        <>
          {/* Pemilihan Tahun */}
          {allApbdesData.length > 0 && (
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  📅 Pilih Tahun APBDES
                </label>
                <div className="relative">
                  <select
                    value={selectedTahun || ""}
                    onChange={(e) =>
                      handleTahunChange(parseInt(e.target.value))
                    }
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all hover:border-gray-400"
                  >
                    <option value="">-- Pilih Tahun --</option>
                    {allApbdesData
                      .map((item) =>
                        typeof item.tahun === "string"
                          ? parseInt(item.tahun)
                          : item.tahun
                      )
                      .sort((a, b) => b - a)
                      .map((tahun) => (
                        <option key={tahun} value={tahun}>
                          Tahun {tahun}
                        </option>
                      ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Ringkasan Lengkap */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📋 Detail APBDES Tahun {apbdesData.tahun}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pendapatan */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">📈</div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Pendapatan
                  </h3>
                </div>
                <p className="text-3xl font-bold text-green-600 mb-2">
                  {formatCurrency(pendapatan)}
                </p>
                <p className="text-sm text-gray-600">
                  Total pendapatan desa tahun {apbdesData.tahun}
                </p>
              </div>

              {/* Belanja */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-lg p-6 border-l-4 border-red-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">💸</div>
                  <h3 className="text-lg font-bold text-gray-900">Belanja</h3>
                </div>
                <p className="text-3xl font-bold text-red-600 mb-2">
                  {formatCurrency(belanja)}
                </p>
                <p className="text-sm text-gray-600">
                  Total belanja desa tahun {apbdesData.tahun}
                </p>
              </div>

              {/* Surplus/Defisit */}
              <div
                className={`bg-gradient-to-br ${
                  surplus >= 0
                    ? "from-blue-50 to-blue-100"
                    : "from-orange-50 to-orange-100"
                } rounded-lg shadow-lg p-6 border-l-4 ${
                  surplus >= 0 ? "border-blue-500" : "border-orange-500"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{surplus >= 0 ? "✅" : "⚠️"}</div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {surplus >= 0 ? "Surplus" : "Defisit"}
                  </h3>
                </div>
                <p
                  className={`text-3xl font-bold ${
                    surplus >= 0 ? "text-blue-600" : "text-orange-600"
                  } mb-2`}
                >
                  {formatCurrency(surplus)}
                </p>
                <p className="text-sm text-gray-600">
                  {surplus >= 0 ? "Sisa anggaran" : "Kekurangan anggaran"}
                </p>
              </div>
            </div>

            {/* Info Pembiayaan */}
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Pembiayaan
                  </h3>
                  <p className="text-sm text-gray-600">
                    Dana tambahan/pembiayaan yang digunakan
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-purple-600">
                    {formatCurrency(pembiayaan)}
                  </p>
                </div>
              </div>
            </div>

            {/* Keterangan */}
            {apbdesData.keterangan && (
              <div className="mt-6 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Catatan
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {apbdesData.keterangan}
                </p>
              </div>
            )}
          </section>

          {/* Foto APBDES Baliho */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              📸 Foto APBDES
            </h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                <p className="text-white">
                  Dokumentasi APBDES yang dicetak sebagai baliho dan ditampilkan
                  di masyarakat Desa Timbukar
                </p>
              </div>

              {apbdesData.file_dokumen ? (
                <div
                  className="relative w-full bg-gray-100 flex items-center justify-center min-h-96 cursor-pointer hover:opacity-90 transition"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Image
                    src={apbdesData.file_dokumen}
                    alt={`APBDES ${apbdesData.tahun}`}
                    fill
                    className="w-full h-auto object-contain"
                  />
                  <div className="p-6 bg-gradient-to-t from-black/40 to-transparent absolute bottom-0 w-full">
                    <h3 className="text-white font-bold text-lg">
                      APBDES Tahun {apbdesData.tahun}
                    </h3>
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded transition">
                    <span className="text-lg">🔍</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-6xl mb-4 block">📸</span>
                    <p className="text-gray-600 font-semibold text-lg">
                      Belum ada foto APBDES
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Admin akan segera menambahkan dokumentasi
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Modal Lightbox */}
          {isModalOpen && apbdesData.file_dokumen && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <div
                className="relative max-w-4xl max-h-[90vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute -top-10 right-0 text-white hover:text-gray-300 text-3xl font-bold transition"
                >
                  ✕
                </button>

                {/* Image Container */}
                <div className="bg-black rounded-lg overflow-hidden flex items-center justify-center">
                  <Image
                    src={apbdesData.file_dokumen}
                    alt={`APBDES ${apbdesData.tahun}`}
                    width={800}
                    height={600}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                </div>

                {/* Image Info */}
                <div className="mt-4 bg-white rounded-lg p-4">
                  <h3 className="font-bold text-gray-900">
                    APBDES Tahun {apbdesData.tahun}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {apbdesData.keterangan}
                  </p>
                </div>

                {/* Keyboard hint */}
                <p className="text-center text-gray-300 text-sm mt-2">
                  Tekan ESC atau klik di luar untuk menutup
                </p>
              </div>
            </div>
          )}
        </>
      ) : null}
    </PageLayout>
  );
}
