"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

async function getAllLembagaMasyarakat(): Promise<LembagaMasyarakat[]> {
  try {
    const response = await fetch(`${API_URL}/lembaga-masyarakat`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch lembaga masyarakat");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching lembaga masyarakat:", error);
    throw error;
  }
}

async function deleteLembagaMasyarakat(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/lembaga-masyarakat/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete lembaga masyarakat");
    }
  } catch (error) {
    console.error("Error deleting lembaga masyarakat:", error);
    throw error;
  }
}

export default function LembagaMasyarakatPage() {
  const [lembagaList, setLembagaList] = useState<LembagaMasyarakat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchLembaga();
  }, []);

  const fetchLembaga = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllLembagaMasyarakat();
      setLembagaList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      setIsDeleting(true);
      await deleteLembagaMasyarakat(deleteId);
      setLembagaList(lembagaList.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Memuat data...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Daftar Lembaga Masyarakat</h1>
        <Link href="/admin/lembaga-masyarakat/tambah">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            + Tambah Lembaga
          </button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Nama Lembaga
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Ketua
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                No. Telepon
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Alamat
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {lembagaList.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  Belum ada data lembaga masyarakat
                </td>
              </tr>
            ) : (
              lembagaList.map((lembaga, index) => (
                <tr key={lembaga.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {lembaga.nama}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {lembaga.ketua || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {lembaga.noTelepon || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {lembaga.alamat || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <Link href={`/admin/lembaga-masyarakat/edit/${lembaga.id}`}>
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm mr-2">
                        Edit
                      </button>
                    </Link>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      onClick={() => setDeleteId(lembaga.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-lg font-bold mb-4">Hapus Lembaga</h2>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus lembaga ini? Tindakan ini tidak
              dapat dibatalkan.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
