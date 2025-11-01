"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

async function getAllGaleri(): Promise<Galeri[]> {
  try {
    const response = await fetch(`${API_URL}/galeri`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch galeri");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching galeri:", error);
    throw error;
  }
}

async function deleteGaleri(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/galeri/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error || error.message || "Failed to delete galeri"
      );
    }
  } catch (error) {
    console.error("Error deleting galeri:", error);
    throw error;
  }
}

export default function GaleriPage() {
  const [galeriList, setGaleriList] = useState<Galeri[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchGaleri();
  }, []);

  const fetchGaleri = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllGaleri();
      setGaleriList(data);
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
      await deleteGaleri(deleteId);
      setGaleriList(galeriList.filter((item) => item.id !== deleteId));
      setDeleteId(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus data");
    } finally {
      setIsDeleting(false);
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Daftar Galeri</h1>
        <Link href="/admin/galeri/tambah">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded transition-colors">
            + Tambah Galeri
          </button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">No</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Gambar
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Judul
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Kategori
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Deskripsi
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {galeriList.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                  Belum ada data galeri
                </td>
              </tr>
            ) : (
              galeriList.map((galeri, index) => (
                <tr
                  key={galeri.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm">
                    {galeri.gambar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={galeri.gambar}
                        alt={galeri.judul}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {galeri.judul}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {galeri.kategori}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {galeri.deskripsi || "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <Link href={`/admin/galeri/edit/${galeri.id}`}>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs transition-colors">
                          Edit
                        </button>
                      </Link>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
                        onClick={() => setDeleteId(galeri.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {galeriList.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Belum ada data galeri
          </div>
        ) : (
          galeriList.map((galeri, index) => (
            <div
              key={galeri.id}
              className="bg-white rounded-lg shadow p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-gray-500">
                      #{index + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800">
                    {galeri.judul}
                  </h3>
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mt-2">
                    {galeri.kategori}
                  </span>
                </div>
                {galeri.gambar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={galeri.gambar}
                    alt={galeri.judul}
                    className="h-16 w-16 object-cover rounded ml-2"
                  />
                )}
              </div>
              <p className="text-sm text-gray-600">
                {galeri.deskripsi || "Tidak ada deskripsi"}
              </p>
              <div className="flex gap-2 pt-2">
                <Link
                  href={`/admin/galeri/edit/${galeri.id}`}
                  className="flex-1"
                >
                  <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm transition-colors">
                    Edit
                  </button>
                </Link>
                <button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors"
                  onClick={() => setDeleteId(galeri.id)}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-lg font-bold mb-4">Hapus Galeri</h2>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus galeri ini? Tindakan ini tidak
              dapat dibatalkan.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50 transition-colors"
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
