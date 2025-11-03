"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Phone, Mail, Users, AlertCircle } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import pemerintahanDesaData from "@/data/pemerintahanDesa.json";
import {
  pemerintahanDesaService,
  type Pegawai,
} from "@/services/pemerintahanDesaService";

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

export default function PemerintahanDesaPage() {
  const [struktur, setStruktur] = useState<Level[]>([]);
  const [bidang, setBidang] = useState<Bidang[]>([]);
  const [pegawaiBackend, setPegawaiBackend] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  const [useBackend, setUseBackend] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Try to fetch from backend
        const backendData = await pemerintahanDesaService.getAllPemerintahan();
        setPegawaiBackend(backendData);
        setUseBackend(true);
        setError(null);
      } catch (err) {
        console.warn("Backend not available, using local data:", err);
        setUseBackend(false);
        setError(
          "Koneksi backend tidak tersedia. Menampilkan data lokal sebagai pengganti."
        );
        // Fallback ke data lokal
        try {
          setStruktur(pemerintahanDesaData.struktur);
          setBidang(pemerintahanDesaData.bidang);
        } catch (localError) {
          console.error("Error loading local data:", localError);
          setError("Gagal memuat data pemerintahan");
        }
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
        heroSubtitle="Struktur dan Organisasi Desa Timbukar"
        currentPage="pemerintahan-desa"
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </PageLayout>
    );
  }

  // Convert backend pegawai to Posisi format, with kategori info
  interface PosisiWithKategori extends Posisi {
    kategori?: string;
  }

  const convertToPositions = (pegawaiList: Pegawai[]): PosisiWithKategori[] => {
    return pegawaiList.map((pegawai) => ({
      nama: pegawai.nama,
      jabatan: pegawai.jabatan,
      foto: pegawai.foto || "/images/placeholder.svg",
      kontak: pegawai.noTelepon,
      tugas: undefined,
      kategori: pegawai.kategori,
    }));
  };

  // Get data from either backend or local fallback
  let displayData: PosisiWithKategori[] = [];
  if (useBackend && pegawaiBackend.length > 0) {
    displayData = convertToPositions(pegawaiBackend);
  } else {
    // Use local data structure
    const hukumTua = struktur[0]?.posisi[0];
    const perangkatDesa = struktur[1]?.posisi || [];
    const perangkatPenunjang = struktur[2]?.posisi || [];
    displayData = [
      ...(hukumTua ? [{ ...hukumTua, kategori: "pemimpin_desa" }] : []),
      ...perangkatDesa.map((p) => ({ ...p, kategori: "perangkat_desa" })),
      ...perangkatPenunjang.map((p) => ({
        ...p,
        kategori: "perangkat_penunjang",
      })),
    ];
  }

  // Separate positions by kategori
  const hukumTuaList = displayData.filter(
    (p) => p.kategori === "pemimpin_desa"
  );
  const perangkatDesaList = displayData.filter(
    (p) => p.kategori === "perangkat_desa"
  );
  const perangkatPenunjangList = displayData.filter(
    (p) => p.kategori === "perangkat_penunjang"
  );

  // Get first as main for legacy compatibility
  const hukumTua = hukumTuaList[0] || null;
  const perangkatDesa = perangkatDesaList;
  const perangkatPenunjang = perangkatPenunjangList;

  const PegawaiCard = ({
    posisi,
    className = "",
    colorScheme = "blue",
  }: {
    posisi: Posisi;
    className?: string;
    colorScheme?: "blue" | "green";
  }) => {
    const colorConfig = {
      blue: {
        border: "border-blue-300",
        hoverBorder: "hover:border-blue-500",
        bg: "bg-blue-50",
        text: "text-blue-700",
        button: "bg-blue-600 hover:bg-blue-700",
      },
      green: {
        border: "border-green-300",
        hoverBorder: "hover:border-green-500",
        bg: "bg-green-50",
        text: "text-green-700",
        button: "bg-green-600 hover:bg-green-700",
      },
    };

    const config = colorConfig[colorScheme];

    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="mb-4 w-full">
          <div
            className={`relative w-32 h-32 rounded-full overflow-hidden border-4 ${config.border} bg-gray-200 shadow-lg mx-auto hover:shadow-xl transition-all ${config.hoverBorder}`}
          >
            <Image
              src={posisi.foto}
              alt={posisi.nama}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/placeholder.svg";
              }}
            />
          </div>
        </div>
        <div
          className={`bg-white rounded-xl border-2 ${config.border} shadow-md hover:shadow-lg transition-all duration-300 p-5 text-center w-full ${config.hoverBorder}`}
        >
          <h4 className="font-semibold text-gray-900 text-base mb-1">
            {posisi.nama}
          </h4>
          <p className={`text-sm font-bold ${config.text} mb-3`}>
            {posisi.jabatan}
          </p>
          {posisi.tugas && (
            <p
              className={`text-xs text-gray-600 mb-3 ${config.bg} rounded p-2`}
            >
              {posisi.tugas}
            </p>
          )}
          {posisi.kontak !== "-" && (
            <a
              href={`tel:${posisi.kontak}`}
              className={`inline-flex items-center justify-center gap-2 text-xs ${config.button} text-white px-4 py-2 rounded-lg transition-colors font-medium`}
            >
              <Phone className="w-4 h-4" />
              {posisi.kontak}
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <PageLayout
      heroTitle="Pemerintahan Desa"
      heroSubtitle="Struktur dan Organisasi Desa Timbukar"
      currentPage="pemerintahan-desa"
    >
      <div className="space-y-16">
        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">{error}</p>
              {useBackend === false && (
                <p className="text-xs text-amber-800 mt-1">
                  Pastikan backend server berjalan di
                  https://api.desatimbukar.id/api
                </p>
              )}
            </div>
          </div>
        )}
        {/* Organisasi Chart Section */}
        <section className="space-y-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Struktur Organisasi Pemerintahan Desa
            </h2>
            <p className="text-lg text-gray-600">
              Jajaran perangkat desa yang melayani masyarakat Desa Timbukar
            </p>
          </div>

          {/* Section 1: Pemimpin Desa */}
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-block px-6 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border-2 border-amber-400 mb-6">
                <h3 className="text-2xl font-bold text-amber-900">
                  🏛️ Pemimpin Desa
                </h3>
              </div>
              <p className="text-gray-600">
                Kepemimpinan tertinggi di tingkat desa
              </p>
            </div>

            {hukumTua ? (
              <div className="flex justify-center mb-20">
                <div className="w-full max-w-sm">
                  <div className="flex flex-col items-center">
                    {/* Circle decoration at top */}
                    <div className="mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mx-auto opacity-70"></div>
                    </div>

                    {/* Photo */}
                    <div className="mb-5">
                      <div className="relative w-40 h-40 rounded-full overflow-hidden border-6 border-amber-400 bg-gray-200 shadow-2xl mx-auto">
                        <Image
                          src={hukumTua.foto}
                          alt={hukumTua.nama}
                          fill
                          className="object-cover"
                          priority
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/placeholder.svg";
                          }}
                        />
                      </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl border-3 border-amber-400 shadow-2xl p-7 text-center w-full relative">
                      {/* Decorative corner elements */}
                      <div className="absolute top-3 right-3 w-3 h-3 bg-amber-300 rounded-full opacity-60"></div>
                      <div className="absolute bottom-3 left-3 w-3 h-3 bg-orange-300 rounded-full opacity-60"></div>

                      <h3 className="font-bold text-gray-900 text-2xl mb-2">
                        {hukumTua.nama}
                      </h3>
                      <p className="text-base font-bold text-amber-700 mb-3">
                        {hukumTua.jabatan}
                      </p>
                      {hukumTua.tugas && (
                        <p className="text-sm text-gray-700 mb-4 italic">
                          {hukumTua.tugas}
                        </p>
                      )}
                      {hukumTua.kontak !== "-" && (
                        <a
                          href={`tel:${hukumTua.kontak}`}
                          className="inline-flex items-center justify-center gap-2 text-base bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-bold shadow-md hover:shadow-lg"
                        >
                          <Phone className="w-5 h-5" />
                          {hukumTua.kontak}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Belum ada data pemimpin desa</p>
              </div>
            )}
          </div>

          {/* Divider Line - Connector from Hukum Tua to Perangkat Desa */}
          <div className="flex justify-center mb-16">
            <div className="w-1.5 h-16 bg-gradient-to-b from-amber-400 via-gray-300 to-blue-300 rounded-full"></div>
          </div>

          {/* Section 2: Perangkat Desa */}
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full border-2 border-blue-400 mb-6">
                <h3 className="text-2xl font-bold text-blue-900">
                  👥 Perangkat Desa
                </h3>
              </div>
              <p className="text-gray-600">
                Jajaran pendukung utama kepala desa
              </p>
            </div>
            {perangkatDesa.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {perangkatDesa.map((posisi, idx) => (
                  <PegawaiCard key={idx} posisi={posisi} colorScheme="blue" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 bg-blue-50 rounded-lg">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Belum ada data perangkat desa</p>
              </div>
            )}
          </div>

          {/* Divider Line */}
          <div className="flex justify-center my-16">
            <div className="w-1.5 h-16 bg-gradient-to-b from-blue-300 via-gray-300 to-green-300 rounded-full"></div>
          </div>

          {/* Section 3: Perangkat Penunjang */}
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-block px-6 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border-2 border-green-400 mb-6">
                <h3 className="text-2xl font-bold text-green-900">
                  🌿 Perangkat Penunjang
                </h3>
              </div>
              <p className="text-gray-600">
                Struktur pendukung di tingkat dusun dan RW
              </p>
            </div>
            {perangkatPenunjang.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {perangkatPenunjang.map((posisi, idx) => (
                  <PegawaiCard key={idx} posisi={posisi} colorScheme="green" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 bg-green-50 rounded-lg">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Belum ada data perangkat penunjang</p>
              </div>
            )}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-300"></div>

        {/* Bidang Section */}
        <section className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bidang-Bidang Pemerintahan Desa
            </h2>
            <p className="text-gray-600">
              Struktur bidang yang menangani berbagai aspek pembangunan dan
              kesejahteraan masyarakat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bidang.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.nama}
                </h3>
                <p className="text-gray-600 text-sm">{item.deskripsi}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Info Box */}
        <section className="bg-blue-600 rounded-lg shadow-md p-8 text-white">
          <div className="flex gap-6">
            <div className="flex-shrink-0 pt-1">
              <Mail className="w-6 h-6" />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-2">Hubungi Kami</h3>
              <p className="text-blue-100 mb-4">
                Untuk informasi lebih lanjut tentang struktur pemerintahan dan
                layanan desa, silahkan hubungi kantor desa kami.
              </p>
              <a
                href="/kontak"
                className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-semibold py-2 px-6 rounded transition-colors"
              >
                Lihat Kontak Desa
              </a>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
