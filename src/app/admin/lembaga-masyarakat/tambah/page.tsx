"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

async function createLembagaMasyarakat(payload: any) {
  try {
    const response = await fetch(`${API_URL}/lembaga-masyarakat`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create lembaga masyarakat");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error creating lembaga masyarakat:", error);
    throw error;
  }
}

export default function TambahLembagaPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    ketua: "",
    noTelepon: "",
    alamat: "",
    gambar: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama.trim()) {
      setError("Nama lembaga tidak boleh kosong");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await createLembagaMasyarakat({
        nama: formData.nama,
        deskripsi: formData.deskripsi || undefined,
        ketua: formData.ketua || undefined,
        noTelepon: formData.noTelepon || undefined,
        alamat: formData.alamat || undefined,
        gambar: formData.gambar || undefined,
      });

      router.push("/admin/lembaga-masyarakat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat data");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tambah Lembaga Masyarakat</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Lembaga *
          </label>
          <input
            id="nama"
            name="nama"
            value={formData.nama}
            onChange={handleInputChange}
            placeholder="Masukkan nama lembaga"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Deskripsi
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleInputChange}
            placeholder="Deskripsi lembaga"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Ketua
          </label>
          <input
            id="ketua"
            name="ketua"
            value={formData.ketua}
            onChange={handleInputChange}
            placeholder="Nama ketua lembaga"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            No. Telepon
          </label>
          <input
            id="noTelepon"
            name="noTelepon"
            value={formData.noTelepon}
            onChange={handleInputChange}
            placeholder="Nomor telepon"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Alamat
          </label>
          <textarea
            id="alamat"
            name="alamat"
            value={formData.alamat}
            onChange={handleInputChange}
            placeholder="Alamat lembaga"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            URL Gambar
          </label>
          <input
            id="gambar"
            name="gambar"
            type="url"
            value={formData.gambar}
            onChange={handleInputChange}
            placeholder="URL gambar lembaga"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded font-semibold"
          >
            {submitting ? "Menyimpan..." : "Simpan Lembaga"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={submitting}
            className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white px-6 py-2 rounded font-semibold"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
