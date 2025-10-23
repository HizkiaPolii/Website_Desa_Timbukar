"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, AlertCircle } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

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

export default function EditRKPDESA() {
  const [data, setData] = useState<RKPDesaData>(DEFAULT_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "pengertian" | "prioritas" | "indikator"
  >("pengertian");

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("rkpdesaData");
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simpan ke localStorage
      localStorage.setItem("rkpdesaData", JSON.stringify(data));

      setMessage({ type: "success", text: "Data RKPDESA berhasil disimpan!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Gagal menyimpan data. Silakan coba lagi.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePengertianChange = (value: string) => {
    setData({
      ...data,
      pengertian: value,
    });
  };

  const handlePeriodeChange = (key: string, value: string) => {
    setData({
      ...data,
      periode: {
        ...data.periode,
        [key]: value,
      },
    });
  };

  const handlePrioritasChange = (
    index: number,
    key: keyof Prioritas,
    value: string
  ) => {
    const newPrioritas = [...data.prioritas];
    newPrioritas[index] = {
      ...newPrioritas[index],
      [key]: value,
    };
    setData({
      ...data,
      prioritas: newPrioritas,
    });
  };

  const addPrioritas = () => {
    const newNo = Math.max(...data.prioritas.map((p) => parseInt(p.no)), 0) + 1;
    setData({
      ...data,
      prioritas: [
        ...data.prioritas,
        {
          no: newNo.toString(),
          judul: "",
          deskripsi: "",
          target: "",
        },
      ],
    });
  };

  const deletePrioritas = (index: number) => {
    setData({
      ...data,
      prioritas: data.prioritas.filter((_, i) => i !== index),
    });
  };

  const handleIndikatorChange = (index: number, value: string) => {
    const newIndikator = [...data.indikator];
    newIndikator[index] = value;
    setData({
      ...data,
      indikator: newIndikator,
    });
  };

  const addIndikator = () => {
    setData({
      ...data,
      indikator: [...data.indikator, ""],
    });
  };

  const deleteIndikator = (index: number) => {
    setData({
      ...data,
      indikator: data.indikator.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 md:ml-64 pt-20 md:pt-0 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit RKPDESA
            </h1>
            <p className="text-gray-600">
              Kelola data Rencana Kerja Pembangunan Desa Timbukar
            </p>
          </div>

          {/* Message Alert */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              <AlertCircle size={20} />
              <span>{message.text}</span>
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6 flex gap-2 flex-wrap">
            {(["pengertian", "prioritas", "indikator"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Tab: Pengertian */}
            {activeTab === "pengertian" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Pengertian RKPDESA
                  </label>
                  <textarea
                    value={data.pengertian}
                    onChange={(e) => handlePengertianChange(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Jelaskan pengertian RKPDESA dalam konteks Desa Timbukar
                  </p>
                </div>

                {/* Periode */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Periode (Format: 2024-2029)
                    </label>
                    <input
                      type="text"
                      value={data.periode.tahun}
                      onChange={(e) =>
                        handlePeriodeChange("tahun", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      placeholder="Contoh: 2024-2029"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Tahun Mulai
                    </label>
                    <input
                      type="number"
                      value={data.periode.mulai}
                      onChange={(e) =>
                        handlePeriodeChange("mulai", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      placeholder="Contoh: 2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Tahun Akhir
                    </label>
                    <input
                      type="number"
                      value={data.periode.akhir}
                      onChange={(e) =>
                        handlePeriodeChange("akhir", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      placeholder="Contoh: 2029"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Prioritas */}
            {activeTab === "prioritas" && (
              <div className="space-y-6">
                {data.prioritas.map((prioritas, index) => (
                  <div
                    key={index}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">
                        Prioritas {index + 1}
                      </h3>
                      <button
                        onClick={() => deletePrioritas(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          No
                        </label>
                        <input
                          type="number"
                          value={prioritas.no}
                          onChange={(e) =>
                            handlePrioritasChange(index, "no", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Judul
                        </label>
                        <input
                          type="text"
                          value={prioritas.judul}
                          onChange={(e) =>
                            handlePrioritasChange(
                              index,
                              "judul",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                          placeholder="Masukkan judul prioritas"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi
                      </label>
                      <textarea
                        value={prioritas.deskripsi}
                        onChange={(e) =>
                          handlePrioritasChange(
                            index,
                            "deskripsi",
                            e.target.value
                          )
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent resize-none"
                        placeholder="Masukkan deskripsi prioritas"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target
                      </label>
                      <input
                        type="text"
                        value={prioritas.target}
                        onChange={(e) =>
                          handlePrioritasChange(index, "target", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                        placeholder="Masukkan target prioritas"
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={addPrioritas}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-100 text-emerald-700 font-medium rounded-lg hover:bg-emerald-200 transition-colors border-2 border-dashed border-emerald-300"
                >
                  <Plus size={20} />
                  Tambah Prioritas
                </button>
              </div>
            )}

            {/* Tab: Indikator */}
            {activeTab === "indikator" && (
              <div className="space-y-4">
                {data.indikator.map((indikator, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <input
                      type="text"
                      value={indikator}
                      onChange={(e) =>
                        handleIndikatorChange(index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      placeholder="Masukkan indikator keberhasilan"
                    />
                    <button
                      onClick={() => deleteIndikator(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={addIndikator}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-100 text-emerald-700 font-medium rounded-lg hover:bg-emerald-200 transition-colors border-2 border-dashed border-emerald-300"
                >
                  <Plus size={20} />
                  Tambah Indikator
                </button>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="mt-8 flex gap-4 justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
