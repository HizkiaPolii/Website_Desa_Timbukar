"use client";

import { Download, AlertCircle } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PDFPreview from "@/components/PDFPreview";
import { useState, useEffect } from "react";

interface RKPDesaItem {
  id: number;
  tahun: number;
  judul: string;
  deskripsi: string;
  anggaran: number;
  status: string;
  fileDokumen: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function RKPDESA() {
  const [rkpdesaList, setRkpdesaList] = useState<RKPDesaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRKPDesaData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch from backend API
        const apiUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
        const response = await fetch(`${apiUrl}/rkpdesa`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            console.log("RKPDESA data from backend:", data.data);
            setRkpdesaList(data.data);
          } else {
            setRkpdesaList([]);
          }
        } else {
          console.warn("Backend API not available");
          setRkpdesaList([]);
        }
      } catch (err) {
        console.error("Error fetching RKPDESA data from backend:", err);
        setRkpdesaList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRKPDesaData();
  }, []);

  // Function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "aktif":
        return "bg-green-100 text-green-800";
      case "selesai":
        return "bg-blue-100 text-blue-800";
      case "tertunda":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <PageLayout
      heroTitle="RKPDESA"
      heroSubtitle="Rencana Kerja Pembangunan Desa Timbukar"
      currentPage="rkpdesa"
    >
      {/* RKPDESA Data dari Database */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
            <p className="text-gray-600">Memuat data RKPDESA...</p>
          </div>
        </div>
      ) : error ? (
        <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : rkpdesaList.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">
            Belum ada data RKPDESA yang tersedia.
          </p>
        </div>
      ) : (
        <section className="mb-16 sm:mb-20">
          <h2 className="section-title mb-12">Data RKPDESA</h2>
          <div className="space-y-8">
            {rkpdesaList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-emerald-100"
              >
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 sm:px-12 py-8">
                  <div className="flex items-start justify-between gap-6 mb-3">
                    <div className="flex-1">
                      <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                        {item.judul}
                      </h3>
                      <p className="text-emerald-100 text-lg font-semibold">
                        Tahun {item.tahun}
                      </p>
                    </div>
                    <span
                      className={`px-5 py-3 rounded-full text-base font-bold whitespace-nowrap flex-shrink-0 ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="px-8 sm:px-12 py-10">
                  {/* Layout 2 Kolom: Info di kiri, Preview di kanan */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Kolom Kiri - Info */}
                    <div className="lg:col-span-1">
                      {item.deskripsi && (
                        <p className="text-gray-700 text-lg leading-relaxed mb-8 bg-gray-50 p-6 rounded-lg border-l-4 border-emerald-500">
                          {item.deskripsi}
                        </p>
                      )}

                      <div className="space-y-6">
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-lg border border-emerald-200">
                          <p className="text-sm font-semibold text-emerald-700 mb-2 uppercase tracking-wider">
                            Anggaran
                          </p>
                          <p className="text-3xl sm:text-4xl font-bold text-emerald-900">
                            {formatCurrency(item.anggaran)}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                          <p className="text-sm font-semibold text-blue-700 mb-2 uppercase tracking-wider">
                            Diperbarui
                          </p>
                          <p className="text-lg font-semibold text-blue-900">
                            {new Date(item.updatedAt).toLocaleDateString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      {item.fileDokumen && (
                        <div className="mt-6">
                          <a
                            href={item.fileDokumen}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg transition-colors font-semibold text-lg shadow-md hover:shadow-lg"
                          >
                            <Download size={22} />
                            <span>Download</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Kolom Kanan - Preview PDF */}
                    {item.fileDokumen && (
                      <div className="lg:col-span-2">
                        <PDFPreview 
                          fileUrl={item.fileDokumen} 
                          fileName={item.judul}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </PageLayout>
  );
}
