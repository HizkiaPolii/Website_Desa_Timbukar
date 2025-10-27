"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toast";

interface StatisticsData {
  id?: number;
  populasi: string;
  kepala_keluarga: string;
  luas_wilayah: string;
  angka_pertumbuhan: string;
  jumlah_bayi: string;
  angka_harapan_hidup: string;
}

export default function EditStatistikUtamaPage() {
  const [data, setData] = useState<StatisticsData>({
    populasi: "",
    kepala_keluarga: "",
    luas_wilayah: "",
    angka_pertumbuhan: "",
    jumlah_bayi: "",
    angka_harapan_hidup: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${API_BASE_URL}/data-desa`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      if (json?.data?.statistics) {
        setData({
          id: json.data.statistics.id,
          populasi: json.data.statistics.populasi,
          kepala_keluarga: json.data.statistics.kepala_keluarga,
          luas_wilayah: json.data.statistics.luas_wilayah,
          angka_pertumbuhan: json.data.statistics.angka_pertumbuhan,
          jumlah_bayi: json.data.statistics.jumlah_bayi,
          angka_harapan_hidup: json.data.statistics.angka_harapan_hidup,
        });
      }
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data statistik");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof StatisticsData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      // Validasi ID sebelum save
      if (!data.id) {
        setError("ID statistik tidak ditemukan");
        setSaving(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/data-desa/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          kategori: "statistics",
          populasi: data.populasi,
          kepala_keluarga: data.kepala_keluarga,
          luas_wilayah: data.luas_wilayah,
          angka_pertumbuhan: data.angka_pertumbuhan,
          jumlah_bayi: data.jumlah_bayi,
          angka_harapan_hidup: data.angka_harapan_hidup,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menyimpan statistik");
      }
      showToast.success("Statistik utama berhasil diperbarui");
      router.push("/admin/data-desa");
    } catch (err) {
      console.error(err);
      const errorMsg = err instanceof Error ? err.message : "Gagal menyimpan";
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Statistik Utama
          </h1>
          <p className="text-gray-600 mt-1">Kelola data statistik utama desa</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Penduduk
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={data.populasi}
                onChange={(e) => handleChange("populasi", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kepala Keluarga
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={data.kepala_keluarga}
                onChange={(e) =>
                  handleChange("kepala_keluarga", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Luas Wilayah
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={data.luas_wilayah}
                onChange={(e) => handleChange("luas_wilayah", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Angka Pertumbuhan
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={data.angka_pertumbuhan}
                onChange={(e) =>
                  handleChange("angka_pertumbuhan", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Bayi
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={data.jumlah_bayi}
                onChange={(e) => handleChange("jumlah_bayi", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Angka Harapan Hidup
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={data.angka_harapan_hidup}
                onChange={(e) =>
                  handleChange("angka_harapan_hidup", e.target.value)
                }
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-8">
            <button
              onClick={() => router.push("/admin/data-desa")}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              <Save size={16} /> {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
