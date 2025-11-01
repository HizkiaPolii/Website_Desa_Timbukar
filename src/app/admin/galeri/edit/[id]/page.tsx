"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { showToast } from "@/utils/toast";

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

async function uploadImage(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/galeri/upload`, {
      method: "POST",
      body: formData,
      headers: {
        ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` }),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || "Failed to upload image");
    }

    const data = await response.json();
    showToast.success("Gambar berhasil diunggah");
    return data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    const message =
      error instanceof Error ? error.message : "Gagal mengunggah gambar";
    showToast.error(message);
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
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
      setPreviewImage(data.gambar);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.judul?.trim()) {
      setError("Judul galeri tidak boleh kosong");
      return;
    }

    if (!formData.gambar && !imageFile) {
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

      let gambarUrl = formData.gambar;

      // Upload new image if selected
      if (imageFile) {
        setUploading(true);
        gambarUrl = await uploadImage(imageFile);
        setUploading(false);
      }

      await updateGaleri(parseInt(id), {
        judul: formData.judul,
        deskripsi: formData.deskripsi || null,
        gambar: gambarUrl,
        kategori: formData.kategori,
      });

      router.push("/admin/galeri");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui data");
    } finally {
      setSubmitting(false);
      setUploading(false);
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Gambar <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="gambar-input"
              disabled={submitting || uploading}
            />
            <label htmlFor="gambar-input" className="cursor-pointer block">
              {previewImage ? (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded"
                  />
                  <p className="text-sm text-emerald-600 font-semibold">
                    Klik untuk mengubah gambar
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12l-3.172-3.172a4 4 0 00-5.656 0L9.172 15M33 5v6m0 0v6m0-6h6m0 0h6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-gray-600">Klik atau drag gambar ke sini</p>
                  <p className="text-xs text-gray-500">
                    Format yang didukung: JPG, PNG, GIF
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={submitting || uploading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting || uploading}
            className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50 transition font-semibold"
          >
            {uploading
              ? "Mengunggah gambar..."
              : submitting
              ? "Menyimpan..."
              : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
