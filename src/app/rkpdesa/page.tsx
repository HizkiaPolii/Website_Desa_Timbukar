"use client";

import { FileText, Target, Calendar } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useState, useEffect } from "react";

interface Prioritas {
  no: string;
  judul: string;
  deskripsi: string;
  target: string;
}

interface RKPDesaData {
  pengertian: string;
  periode: {
    tahun: string;
    mulai: string;
    akhir: string;
  };
  prioritas: Prioritas[];
  indikator: string[];
}

const DEFAULT_DATA: RKPDesaData = {
  pengertian:
    "Rencana Kerja Pembangunan Desa (RKPDESA) adalah rencana jangka menengah pembangunan desa untuk periode 5 tahun yang disusun berdasarkan Visi dan Misi Desa Timbukar serta aspirasi masyarakat.",
  periode: {
    tahun: "2024-2029",
    mulai: "2024",
    akhir: "2029",
  },
  prioritas: [
    {
      no: "1",
      judul: "Pembangunan Infrastruktur Dasar",
      deskripsi:
        "Perbaikan dan pembangunan jalan desa, jembatan, sistem air bersih, dan listrik desa untuk meningkatkan konektivitas dan aksesibilitas.",
      target: "100% desa terlayani infrastruktur dasar",
    },
    {
      no: "2",
      judul: "Pengembangan Pariwisata Berkelanjutan",
      deskripsi:
        "Pengembangan objek wisata alam, pengadaan sarana pariwisata, dan pelatihan pemandu wisata lokal untuk meningkatkan kunjungan wisatawan.",
      target: "Peningkatan kunjungan wisatawan 25% per tahun",
    },
    {
      no: "3",
      judul: "Pemberdayaan Ekonomi Masyarakat",
      deskripsi:
        "Program pelatihan keterampilan, modal usaha mikro kecil menengah (UMKM), dan pengembangan produk lokal untuk meningkatkan kesejahteraan ekonomi.",
      target: "Minimal 50 UMKM baru dihasilkan",
    },
    {
      no: "4",
      judul: "Pelestarian Lingkungan & Sumber Daya Alam",
      deskripsi:
        "Program reboisasi, pengelolaan mata air, dan konservasi biodiversity untuk menjaga kelestarian lingkungan desa.",
      target: "Penanaman 5.000 pohon dalam 5 tahun",
    },
    {
      no: "5",
      judul: "Peningkatan Kualitas Sumber Daya Manusia",
      deskripsi:
        "Penyediaan beasiswa, pelatihan keterampilan, dan peningkatan akses pendidikan untuk meningkatkan kualitas SDM desa.",
      target: "80% masyarakat mengikuti program pelatihan",
    },
    {
      no: "6",
      judul: "Pemberdayaan Perempuan & Pemuda",
      deskripsi:
        "Program pelatihan usaha untuk perempuan, fasilitasi kepemudaan, dan pembentukan kelompok usaha produktif.",
      target: "Pembentukan minimal 10 kelompok usaha",
    },
  ],
  indikator: [
    "Pertumbuhan Pendapatan Asli Desa (PAD) minimal 15% per tahun",
    "Pengurangan tingkat pengangguran sebesar 10% dalam 5 tahun",
    "Peningkatan partisipasi masyarakat dalam program pembangunan mencapai 80%",
    "Perbaikan indeks pembangunan manusia (IPM) desa",
    "Peningkatan kepuasan masyarakat terhadap layanan desa",
    "Terwujudnya desa yang bersih, hijau, dan berkelanjutan",
  ],
};

export default function RKPDESA() {
  const [rkpdesaContent, setRkpdesaContent] =
    useState<RKPDesaData>(DEFAULT_DATA);

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem("rkpdesaData");
    if (savedData) {
      try {
        setRkpdesaContent(JSON.parse(savedData));
      } catch (error) {
        console.error("Error loading saved RKPDESA data:", error);
        setRkpdesaContent(DEFAULT_DATA);
      }
    }
  }, []);

  return (
    <PageLayout
      heroTitle="RKPDESA"
      heroSubtitle="Rencana Kerja Pembangunan Desa Timbukar Tahun 2024-2029"
      currentPage="rkpdesa"
    >
      {/* Pengertian RKPDESA */}
      <section className="mb-16 sm:mb-20">
        <div className="flex items-start gap-4 mb-8">
          <FileText
            size={32}
            className="text-emerald-600 flex-shrink-0 mt-2 hidden sm:block"
          />
          <div className="flex-1">
            <h2 className="section-title">Pengertian RKPDESA</h2>
            <div className="section-box-emerald">
              <p className="text-base sm:text-lg text-gray-900 leading-relaxed">
                {rkpdesaContent.pengertian}
              </p>
              <div className="mt-6 flex items-center gap-3 bg-white bg-opacity-50 p-4 rounded-lg">
                <Calendar
                  size={24}
                  className="text-emerald-600 flex-shrink-0"
                />
                <div>
                  <p className="font-semibold text-gray-900">Periode RKPDESA</p>
                  <p className="text-emerald-700 font-bold text-lg">
                    Tahun {rkpdesaContent.periode.tahun}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prioritas Pembangunan */}
      <section className="mb-16 sm:mb-20">
        <h2 className="section-title">Prioritas Pembangunan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {rkpdesaContent.prioritas.map((item, index) => (
            <div key={index} className="section-box-emerald">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  {item.no}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    {item.judul}
                  </h3>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4">
                {item.deskripsi}
              </p>
              <div className="bg-white bg-opacity-60 p-3 rounded border-l-4 border-emerald-600">
                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                  Target:{" "}
                  <span className="text-emerald-700">{item.target}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Indikator Keberhasilan */}
      <section className="mb-8">
        <h2 className="section-title">Indikator Keberhasilan RKPDESA</h2>
        <div className="section-box-purple">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {rkpdesaContent.indikator.map((indicator, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-600 mt-1"></div>
                <p className="text-gray-700 font-medium text-sm sm:text-base leading-relaxed">
                  {indicator}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proses Penyusunan */}
      <section className="mb-8">
        <h2 className="section-title">Proses Penyusunan RKPDESA</h2>
        <div className="section-box-blue">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                  Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes)
                </h4>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Mengumpulkan aspirasi dan masukan dari seluruh lapisan
                  masyarakat, tokoh masyarakat, dan lembaga desa.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                  Analisis & Prioritas
                </h4>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Menganalisis kebutuhan desa berdasarkan Visi Misi dan aspirasi
                  masyarakat, kemudian menetapkan prioritas pembangunan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                  Penetapan Target & Indikator
                </h4>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Menetapkan target pencapaian dan indikator keberhasilan untuk
                  setiap program pembangunan dalam jangka 5 tahun.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                  Persetujuan & Penetapan
                </h4>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  RKPDESA ditetapkan melalui Peraturan Desa setelah mendapat
                  persetujuan dari Badan Permusyawaratan Desa (BPD).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
