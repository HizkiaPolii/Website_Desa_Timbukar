"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { showToast } from "@/utils/toast";
import ImageUploadField from "@/components/ImageUploadField";

interface LembagaMasyarakat {
  id: number;
  nama: string;
  deskripsi: string | null;
  ketua: string | null;
  noTelepon: string | null;
  alamat: string | null;
  gambar: string | null;
  createdAt: string;
  updatedAt: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.desatimbukar.id/api";

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

async function getLembagaMasyarakatById(id: number) {
  try {
    const response = await fetch(`${API_URL}/lembaga-masyarakat/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch lembaga masyarakat");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching lembaga masyarakat:", error);
    throw error;
  }
}

async function updateLembagaMasyarakat(id: number, payload: any) {
  try {
    const response = await fetch(`${API_URL}/lembaga-masyarakat/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update lembaga masyarakat");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error updating lembaga masyarakat:", error);
    throw error;
  }
}

export default function EditLembagaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<LembagaMasyarakat>>({});

  const fetchLembaga = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLembagaMasyarakatById(parseInt(id));
      setFormData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchLembaga();
    }
  }, [id, fetchLembaga]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || null,
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

    if (!formData.nama || formData.nama.trim() === "") {
      setError("Nama lembaga tidak boleh kosong");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await updateLembagaMasyarakat(parseInt(id), {
        nama: formData.nama!,
        deskripsi: formData.deskripsi || undefined,
        ketua: formData.ketua || undefined,
        noTelepon: formData.noTelepon || undefined,
        alamat: formData.alamat || undefined,
        gambar: formData.gambar || undefined,
      });

      showToast.success("Lembaga masyarakat berhasil diperbarui");
      router.push("/admin/lembaga-masyarakat");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal memperbarui data";
      setError(message);
      showToast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Memuat data...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Lembaga Masyarakat</h1>

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
            value={formData.nama || ""}
            onChange={handleInputChange}
            placeholder="Masukkan nama lembaga"
            required
            disabled={submitting}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Deskripsi
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            value={formData.deskripsi || ""}
            onChange={handleInputChange}
            placeholder="Deskripsi lembaga"
            rows={4}
            disabled={submitting}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Ketua
          </label>
          <input
            id="ketua"
            name="ketua"
            value={formData.ketua || ""}
            onChange={handleInputChange}
            placeholder="Nama ketua lembaga"
            disabled={submitting}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            No. Telepon
          </label>
          <input
            id="noTelepon"
            name="noTelepon"
            value={formData.noTelepon || ""}
            onChange={handleInputChange}
            placeholder="Nomor telepon"
            disabled={submitting}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Alamat
          </label>
          <textarea
            id="alamat"
            name="alamat"
            value={formData.alamat || ""}
            onChange={handleInputChange}
            placeholder="Alamat lembaga"
            rows={3}
            disabled={submitting}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
        </div>

        <div>
          <ImageUploadField
            value={formData.gambar || ""}
            onChange={handleImageChange}
            label="Foto Lembaga"
            placeholder="Drag and drop foto atau klik untuk pilih"
            uploadFolder="lembaga"
          />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded font-semibold"
          >
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
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
