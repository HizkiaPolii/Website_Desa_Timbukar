"use client";

import { useState, useEffect } from "react";
import { Plus, Save } from "lucide-react";
import Link from "next/link";
import { showToast } from "@/utils/toast";
import { apbdesApi } from "@/services/apbdesApi";

interface ApbdesData {
  id?: number;
  tahun: number;
  keterangan: string;
  pendapatan: number | string;
  belanja: number | string;
  pembiayaan: number | string;
}

const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numValue);
};

export default function AdminApbdesPage() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [apbdesData, setApbdesData] = useState<ApbdesData | null>(null);
  const [isLoadingYears, setIsLoadingYears] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    pendapatan: "",
    belanja: "",
    pembiayaan: "",
    keterangan: "",
  });
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const loadAvailableYears = async () => {
      try {
        setIsLoadingYears(true);
        setApiError(null);
        const allData = await apbdesApi.getAll();
        const years = allData
          .map((item: any) => item.tahun)
          .sort((a: number, b: number) => b - a);
        setAvailableYears(years);

        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      } catch (error: any) {
        console.warn("Gagal memuat daftar tahun:", error);
        setAvailableYears([]);
        setApiError(null); // Don't show error if getAll gracefully handled 404
      } finally {
        setIsLoadingYears(false);
      }
    };

    loadAvailableYears();
  }, []);

  useEffect(() => {
    if (!selectedYear) return;

    const loadApbdesData = async () => {
      try {
        setIsLoading(true);
        const data = await apbdesApi.getByTahun(selectedYear);

        if (data) {
          setApbdesData(data);
          setFormData({
            pendapatan: String(data.pendapatan),
            belanja: String(data.belanja),
            pembiayaan: String(data.pembiayaan),
            keterangan: data.keterangan || "",
          });

          console.log("Loaded APBDES tahun", selectedYear, ":", data);
          showToast.success(`Data APBDES tahun ${data.tahun} berhasil dimuat!`);
        }
      } catch (error) {
        console.warn(
          `Data tidak ditemukan untuk tahun ${selectedYear}:`,
          error
        );
        setApbdesData(null);
        setFormData({
          pendapatan: "",
          belanja: "",
          pembiayaan: "",
          keterangan: "",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadApbdesData();
  }, [selectedYear]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!selectedYear) {
      showToast.error("Pilih tahun terlebih dahulu");
      return;
    }

    if (!formData.pendapatan || !formData.belanja) {
      showToast.error("Pendapatan dan Belanja harus diisi");
      return;
    }

    try {
      setIsSaving(true);
      const pendapatanAmount = parseFloat(formData.pendapatan);
      const belanjaAmount = parseFloat(formData.belanja);
      const pembiayaanAmount = parseFloat(formData.pembiayaan) || 0;

      const saveData = {
        tahun: selectedYear,
        keterangan: formData.keterangan || "Laporan Keuangan Desa",
        pendapatan: pendapatanAmount,
        belanja: belanjaAmount,
        pembiayaan: pembiayaanAmount,
      };

      if (apbdesData?.id) {
        await apbdesApi.update(apbdesData.id, saveData);
        showToast.success(
          `Data APBDES tahun ${selectedYear} berhasil diperbarui!`
        );
      } else {
        await apbdesApi.create(saveData);
        showToast.success(
          `Data APBDES tahun ${selectedYear} berhasil ditambahkan!`
        );
      }

      const updatedData = await apbdesApi.getByTahun(selectedYear);
      setApbdesData(updatedData);
    } catch (error: any) {
      console.error("Error saving APBDES:", error);
      showToast.error(error.message || "Gagal menyimpan data APBDES");
    } finally {
      setIsSaving(false);
    }
  };

  const calculateSurplus = () => {
    const pendapatan = parseFloat(formData.pendapatan) || 0;
    const belanja = parseFloat(formData.belanja) || 0;
    const pembiayaan = parseFloat(formData.pembiayaan) || 0;
    return pendapatan - belanja - pembiayaan;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit APBDES</h1>
            <p className="text-gray-600 mt-2">
              Kelola Anggaran Pendapatan dan Belanja Desa
            </p>
          </div>
          <Link
            href="/admin/apbdes/tambah"
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
          >
            <Plus size={20} />
            Tambah APBDES Baru
          </Link>
        </div>

        {apiError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded">
            <p className="text-red-700 font-semibold">
              ⚠️ Koneksi Backend Error
            </p>
            <p className="text-red-600 text-sm mt-1">{apiError}</p>
            <p className="text-red-600 text-sm mt-2">
              Pastikan backend running di http://localhost:3000
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Pilih Tahun APBDES untuk Diedit
          </label>
          {isLoadingYears ? (
            <div className="text-gray-500">Memuat data...</div>
          ) : availableYears.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Belum ada data APBDES. Buat yang baru untuk memulai.
              </p>
              <Link
                href="/admin/apbdes/tambah"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                <Plus size={18} />
                Buat APBDES Pertama
              </Link>
            </div>
          ) : (
            <select
              value={selectedYear || ""}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  Tahun {year}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedYear && (
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4" />
                  <p className="text-gray-600 font-semibold">Memuat data...</p>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Keterangan
                  </label>
                  <textarea
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleInputChange}
                    placeholder="Contoh: Laporan Keuangan Desa Timbukar Tahun 2025"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pendapatan (Rp)
                  </label>
                  <input
                    type="number"
                    name="pendapatan"
                    value={formData.pendapatan}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {formData.pendapatan && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formatCurrency(formData.pendapatan)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Belanja (Rp)
                  </label>
                  <input
                    type="number"
                    name="belanja"
                    value={formData.belanja}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {formData.belanja && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formatCurrency(formData.belanja)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pembiayaan (Rp)
                  </label>
                  <input
                    type="number"
                    name="pembiayaan"
                    value={formData.pembiayaan}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {formData.pembiayaan && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formatCurrency(formData.pembiayaan)}
                    </p>
                  )}
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Ringkasan
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pendapatan</p>
                      <p className="text-xl font-bold text-emerald-600">
                        {formatCurrency(parseFloat(formData.pendapatan) || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Belanja</p>
                      <p className="text-xl font-bold text-red-600">
                        {formatCurrency(parseFloat(formData.belanja) || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Surplus/Defisit
                      </p>
                      <p
                        className={`text-xl font-bold ${
                          calculateSurplus() >= 0
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatCurrency(calculateSurplus())}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition font-semibold"
                  >
                    <Save size={20} />
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                  <button
                    onClick={() => window.history.back()}
                    className="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition font-semibold"
                  >
                    Kembali
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
