"use client";

import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toast";
import ImageUploadField from "@/components/ImageUploadField";

interface FormData {
  tahun: string;
  pendapatan: string;
  belanja: string;
  pembiayaan: string;
  keterangan: string;
  file_dokumen?: string;
}

const formatCurrency = (value: string): string => {
  const numValue = parseFloat(value) || 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numValue);
};

export default function TambahApbdesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    tahun: new Date().getFullYear().toString(),
    pendapatan: "",
    belanja: "",
    pembiayaan: "",
    keterangan: "",
    file_dokumen: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (url: string | null) => {
    setFormData((prev) => ({
      ...prev,
      file_dokumen: url || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi
    if (!formData.tahun) {
      showToast.error("Tahun harus diisi");
      return;
    }
    if (!formData.pendapatan) {
      showToast.error("Pendapatan harus diisi");
      return;
    }
    if (!formData.belanja) {
      showToast.error("Belanja harus diisi");
      return;
    }
    if (!formData.pembiayaan) {
      showToast.error("Pembiayaan harus diisi");
      return;
    }
    if (!formData.file_dokumen) {
      showToast.error("Gambar APBDES harus diupload");
      return;
    }

    try {
      setIsLoading(true);

      // Buat object data (bukan FormData, karena gambar sudah di-upload)
      const data = {
        tahun: formData.tahun,
        pendapatan: formData.pendapatan,
        belanja: formData.belanja,
        pembiayaan: formData.pembiayaan,
        keterangan: formData.keterangan,
        file_dokumen: formData.file_dokumen, // Ini sudah berupa URL dari ImageUploadField
      };

      // Ambil token dari localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        showToast.error("Session expired. Silakan login kembali");
        router.push("/login");
        return;
      }

      // Upload ke API
      const response = await fetch("/api/apbdes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = "Gagal menambahkan data APBDES";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error("Gagal parse error response:", e);
        }
        console.error("API Response Error:", {
          status: response.status,
          message: errorMessage,
        });
        throw new Error(errorMessage);
      }

      const result = await response.json();

      showToast.success(
        `Data APBDES tahun ${formData.tahun} berhasil ditambahkan!`
      );
      router.push("/admin/apbdes");
    } catch (error: any) {
      console.error("Error:", error);
      showToast.error(error.message || "Gagal menambahkan data APBDES");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/apbdes"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Kembali
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Tambah Data APBDES
          </h1>
          <p className="text-gray-600 mt-2">
            Tambahkan data APBDES terbaru untuk desa Timbukar
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tahun */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tahun <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="tahun"
                value={formData.tahun}
                onChange={handleInputChange}
                min="2000"
                max="2100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Pendapatan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pendapatan (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="pendapatan"
                value={formData.pendapatan}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.pendapatan && (
                <p className="text-sm text-gray-600 mt-1">
                  {formatCurrency(formData.pendapatan)}
                </p>
              )}
            </div>

            {/* Belanja */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Belanja (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="belanja"
                value={formData.belanja}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.belanja && (
                <p className="text-sm text-gray-600 mt-1">
                  {formatCurrency(formData.belanja)}
                </p>
              )}
            </div>

            {/* Pembiayaan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pembiayaan (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="pembiayaan"
                value={formData.pembiayaan}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.pembiayaan && (
                <p className="text-sm text-gray-600 mt-1">
                  {formatCurrency(formData.pembiayaan)}
                </p>
              )}
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keterangan
              </label>
              <textarea
                name="keterangan"
                value={formData.keterangan}
                onChange={handleInputChange}
                placeholder="Tambahkan keterangan (opsional)"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Upload File PDF */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gambar APBDES <span className="text-red-500">*</span>
              </label>
              <ImageUploadField
                value={formData.file_dokumen}
                onChange={handleFileChange}
                label="Upload Gambar"
                placeholder="Drag and drop gambar atau klik untuk memilih"
                uploadFolder="apbdes"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                <Save size={20} />
                {isLoading ? "Menyimpan..." : "Simpan"}
              </button>
              <Link
                href="/admin/apbdes"
                className="flex-1 flex items-center justify-center gap-2 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Batal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
