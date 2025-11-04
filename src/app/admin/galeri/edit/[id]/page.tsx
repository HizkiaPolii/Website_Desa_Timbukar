"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { showToast } from "@/utils/toast";
import ImageUploadField from "@/components/ImageUploadField";

interface Galeri {
  id: number;
  judul: string;
  deskripsi: string | null;
  gambar: string | null;
  kategori: string;
  created_at: string;
  updated_at: string;
}

const API_URL = "/api";

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

async function getGaleriById(id: number) {
  try {
    const response = await fetch(`${API_URL}/galeri/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch galeri");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching galeri:", error);
    throw error;
  }
}

async function updateGaleri(id: number, payload: any) {
  try {
    const response = await fetch(`${API_URL}/galeri/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error || error.message || "Failed to update galeri"
      );
    }

    const data = await response.json();
    showToast.success("Galeri berhasil diperbarui");
    return data.data;
  } catch (error) {
    console.error("Error updating galeri:", error);
    const message =
      error instanceof Error ? error.message : "Gagal memperbarui galeri";
    showToast.error(message);
    throw error;
  }
}

export default function EditGaleriPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Galeri>>({});

  const kategoriOptions = [
    "Kegiatan",
    "Acara",
    "Fasilitas",
    "Lingkungan",
    "Pemerintahan",
    "KKT UNSRAT",
    "Lainnya",
  ];

  const fetchGaleri = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getGaleriById(parseInt(id));
      setFormData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchGaleri();
    }
  }, [id, fetchGaleri]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (imageUrl: string | null) => {
    setFormData((prev) => ({
      ...prev,
      gambar: imageUrl || null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.judul?.trim()) {
      setError("Judul galeri tidak boleh kosong");
      return;
    }

    if (!formData.gambar) {
      setError("Gambar tidak boleh kosong");
      return;
    }

    if (!formData.kategori) {
      setError("Kategori tidak boleh kosong");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await updateGaleri(parseInt(id), {
        judul: formData.judul,
        deskripsi: formData.deskripsi || null,
        gambar: formData.gambar,
        kategori: formData.kategori,
      });

      router.push("/admin/galeri");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui data");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-lg">Memuat data galeri...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Galeri</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Judul */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Judul Galeri <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="judul"
            value={formData.judul || ""}
            onChange={handleInputChange}
            placeholder="Masukkan judul galeri"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            disabled={submitting}
          />
        </div>

        {/* Kategori */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            name="kategori"
            value={formData.kategori || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
            disabled={submitting}
          >
            <option value="">Pilih Kategori</option>
            {kategoriOptions.map((kat) => (
              <option key={kat} value={kat}>
                {kat}
              </option>
            ))}
          </select>
        </div>

        {/* Deskripsi */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Deskripsi
          </label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi || ""}
            onChange={handleInputChange}
            placeholder="Masukkan deskripsi galeri (opsional)"
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition resize-none"
            disabled={submitting}
          />
        </div>

        {/* Gambar */}
        <div className="mb-6">
          <ImageUploadField
            value={formData.gambar || ""}
            onChange={handleImageChange}
            label="Gambar Galeri"
            placeholder="Drag and drop foto atau klik untuk pilih"
            required
            uploadFolder="galeri"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={submitting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50 transition font-semibold"
          >
            {submitting ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
