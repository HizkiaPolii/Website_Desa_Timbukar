"use client";

import { useEffect, useState, useMemo } from "react";
import PageLayout from "@/components/PageLayout";
import Card, { StatsCard } from "@/components/Card";
import {
  Users,
  MapPin,
  Home,
  TrendingUp,
  Baby,
  Heart,
  Cross,
} from "lucide-react";

interface StatistikItem {
  label: string;
  value: string;
  icon: any;
  color: "blue" | "green" | "red" | "purple" | "pink" | "yellow";
}

interface StatisticsData {
  populasi: string;
  kepala_keluarga: string;
  luas_wilayah: string;
  angka_pertumbuhan: string;
  jumlah_bayi: string;
  angka_harapan_hidup: string;
}

interface DemographicsItem {
  kategori_usia: string;
  persentase: string;
  jumlah: string;
}

interface GenderItem {
  jenis_kelamin: string;
  jumlah: string;
  persentase: string;
}

interface EducationItem {
  tingkat_pendidikan: string;
  jumlah: string;
  persentase: string;
}

interface ReligionItem {
  agama: string;
  jumlah: string;
  persentase: string;
}

interface DataDesa {
  statistics: StatisticsData;
  demographics: DemographicsItem[];
  gender: GenderItem[];
  education: EducationItem[];
  religion: ReligionItem[];
}

export default function DataDesaPage() {
  const [dataDesa, setDataDesa] = useState<DataDesa | null>(null);
  const [loading, setLoading] = useState(true);

  // Default data jika API tidak tersedia
  const defaultData = useMemo(
    () =>
      ({
        statistics: {
          populasi: "2,500",
          kepala_keluarga: "625",
          luas_wilayah: "45.5 km²",
          angka_pertumbuhan: "2.5%",
          jumlah_bayi: "180",
          angka_harapan_hidup: "72 Tahun",
        },
        demographics: [
          { kategori_usia: "Usia 0-5 Tahun", persentase: "8%", jumlah: "200" },
          {
            kategori_usia: "Usia 5-15 Tahun",
            persentase: "15%",
            jumlah: "375",
          },
          {
            kategori_usia: "Usia 15-65 Tahun",
            persentase: "68%",
            jumlah: "1,700",
          },
          { kategori_usia: "Usia 65+ Tahun", persentase: "9%", jumlah: "225" },
        ],
        gender: [
          { jenis_kelamin: "Laki-laki", jumlah: "1,275", persentase: "51%" },
          { jenis_kelamin: "Perempuan", jumlah: "1,225", persentase: "49%" },
        ],
        education: [
          {
            tingkat_pendidikan: "Tidak Sekolah",
            jumlah: "125",
            persentase: "5%",
          },
          {
            tingkat_pendidikan: "SD/Sederajat",
            jumlah: "625",
            persentase: "25%",
          },
          {
            tingkat_pendidikan: "SMP/Sederajat",
            jumlah: "750",
            persentase: "30%",
          },
          {
            tingkat_pendidikan: "SMA/Sederajat",
            jumlah: "700",
            persentase: "28%",
          },
          { tingkat_pendidikan: "D1/D2/D3", jumlah: "150", persentase: "6%" },
          { tingkat_pendidikan: "S1/S2/S3", jumlah: "175", persentase: "7%" },
        ],
        religion: [
          { agama: "Islam", jumlah: "2,000", persentase: "80%" },
          { agama: "Kristen", jumlah: "300", persentase: "12%" },
          { agama: "Katolik", jumlah: "100", persentase: "4%" },
          { agama: "Hindu", jumlah: "50", persentase: "2%" },
          { agama: "Buddha", jumlah: "30", persentase: "1.2%" },
          { agama: "Lainnya", jumlah: "20", persentase: "0.8%" },
        ],
      } as DataDesa),
    []
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://api.desatimbukar.id/api";
        const response = await fetch(`${API_BASE_URL}/data-desa`);
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();

        // Backend sudah transform data sesuai format frontend
        // Gunakan data langsung dari API
        const mappedData: DataDesa = {
          statistics: result.data.statistics,
          demographics: result.data.demographics,
          gender: result.data.gender,
          education: result.data.education,
          religion: result.data.religion,
        };

        setDataDesa(mappedData);
      } catch (err) {
        console.error("Error loading data:", err);
        // Gunakan data default jika API gagal
        setDataDesa(defaultData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [defaultData]);

  // Helper function untuk menghitung persentase dari jumlah
  const calculatePercentage = (jumlah: string, total: string): string => {
    const numJumlah = parseFloat(jumlah.replace(/,/g, ""));
    const numTotal = parseFloat(total.replace(/,/g, ""));
    if (isNaN(numJumlah) || isNaN(numTotal) || numTotal === 0) return "0%";
    const percentage = ((numJumlah / numTotal) * 100).toFixed(1);
    return `${percentage}%`;
  };

  // Helper function untuk format angka dengan koma
  const formatNumber = (str: string): string => {
    const num = parseFloat(str.replace(/,/g, ""));
    if (isNaN(num)) return str;
    return num.toLocaleString("id-ID");
  };

  if (loading) {
    return (
      <PageLayout
        heroTitle="Data Desa Timbukar"
        heroSubtitle="Informasi statistik dan demografi lengkap tentang Desa Timbukar"
        currentPage="data-desa"
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  if (!dataDesa) {
    return (
      <PageLayout
        heroTitle="Data Desa Timbukar"
        heroSubtitle="Informasi statistik dan demografi lengkap tentang Desa Timbukar"
        currentPage="data-desa"
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">Gagal memuat data</div>
        </div>
      </PageLayout>
    );
  }

  // Build statistik dinamis dari data
  const statistikData: StatistikItem[] = [
    {
      label: "Jumlah Penduduk",
      value: formatNumber(dataDesa.statistics.populasi),
      icon: <Users size={32} />,
      color: "blue",
    },
    {
      label: "Kepala Keluarga",
      value: formatNumber(dataDesa.statistics.kepala_keluarga),
      icon: <Home size={32} />,
      color: "green",
    },
    {
      label: "Luas Wilayah",
      value: dataDesa.statistics.luas_wilayah,
      icon: <MapPin size={32} />,
      color: "red",
    },
    {
      label: "Angka Pertumbuhan",
      value: dataDesa.statistics.angka_pertumbuhan,
      icon: <TrendingUp size={32} />,
      color: "purple",
    },
    {
      label: "Jumlah Bayi",
      value: formatNumber(dataDesa.statistics.jumlah_bayi),
      icon: <Baby size={32} />,
      color: "pink",
    },
    {
      label: "Angka Harapan Hidup",
      value: dataDesa.statistics.angka_harapan_hidup,
      icon: <Heart size={32} />,
      color: "red",
    },
  ];

  return (
    <PageLayout
      heroTitle="Data Desa Timbukar"
      heroSubtitle="Informasi statistik dan demografi lengkap tentang Desa Timbukar"
      currentPage="data-desa"
    >
      {/* Statistics Grid */}
      <div className="mb-12 sm:mb-16 lg:mb-20">
        <h2 className="section-title">Statistik Utama</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {statistikData.map((stat, index) => (
            <StatsCard
              key={index}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>
      </div>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12">
        {/* Distribusi Jenis Kelamin */}
        <div className="section-box-blue">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
            Distribusi Jenis Kelamin
          </h3>
          <div className="space-y-6">
            {dataDesa.gender.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                    {item.jenis_kelamin}
                  </span>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      {formatNumber(item.jumlah)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {item.persentase}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.jenis_kelamin === "Laki-laki"
                        ? "bg-blue-500"
                        : "bg-pink-500"
                    }`}
                    style={{
                      width: item.persentase,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Age Distribution */}
        <div className="section-box-blue">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
            Distribusi Usia
          </h3>
          <div className="space-y-6">
            {dataDesa.demographics.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                    {item.kategori_usia}
                  </span>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      {formatNumber(item.jumlah)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {item.persentase}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width: item.persentase,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Education Distribution */}
      <div className="section-box-emerald mb-12">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
          Distribusi Pendidikan
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-emerald-600 bg-emerald-100">
                <th className="text-left py-3 px-3 sm:px-4 font-bold text-gray-900">
                  Tingkat Pendidikan
                </th>
                <th className="text-center py-3 px-3 sm:px-4 font-bold text-gray-900">
                  Jumlah
                </th>
                <th className="text-center py-3 px-3 sm:px-4 font-bold text-gray-900">
                  Persentase
                </th>
              </tr>
            </thead>
            <tbody>
              {dataDesa.education.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b transition-colors ${
                    index % 2 === 0
                      ? "bg-gray-50 hover:bg-gray-100"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-3 sm:px-4 text-gray-700">
                    {item.tingkat_pendidikan}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center font-semibold text-gray-900">
                    {formatNumber(item.jumlah)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-semibold">
                    {item.persentase}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Religion Distribution */}
      <div className="section-box-blue mb-12">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
          Distribusi Agama
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-blue-600 bg-blue-100">
                <th className="text-left py-3 px-3 sm:px-4 font-bold text-gray-900">
                  Agama
                </th>
                <th className="text-center py-3 px-3 sm:px-4 font-bold text-gray-900">
                  Jumlah
                </th>
                <th className="text-center py-3 px-3 sm:px-4 font-bold text-gray-900">
                  Persentase
                </th>
              </tr>
            </thead>
            <tbody>
              {dataDesa.religion.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b transition-colors ${
                    index % 2 === 0
                      ? "bg-gray-50 hover:bg-gray-100"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-3 sm:px-4 text-gray-700">
                    {item.agama}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center font-semibold text-gray-900">
                    {formatNumber(item.jumlah)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center text-blue-600 font-semibold">
                    {item.persentase}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        <div className="section-box-emerald">
          <h4 className="text-base sm:text-lg font-bold text-emerald-900 mb-3">
            📊 Catatan Penting
          </h4>
          <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
            Data statistik di atas adalah data terakhir yang diperbarui dan
            dapat berubah sesuai dengan perkembangan Desa Timbukar.
          </p>
        </div>

        <div className="section-box-blue">
          <h4 className="text-base sm:text-lg font-bold text-blue-900 mb-3">
            📋 Sumber Data
          </h4>
          <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
            Data diperoleh dari Pencatatan Sipil dan Sistem Informasi Desa
            (SISDES) Desa Timbukar.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
