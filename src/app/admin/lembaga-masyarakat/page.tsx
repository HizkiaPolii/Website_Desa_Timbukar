"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Lembaga {
  id: string;
  nama: string;
  pengertian: string;
}

export default function LembagaMasyarakatAdminPage() {
  const [lembaga, setLembaga] = useState<Lembaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLembaga();
  }, []);

  const fetchLembaga = async () => {
    try {
      const response = await fetch("/api/lembaga-masyarakat");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setLembaga(data);
    } catch (err) {
      setError("Gagal memuat data lembaga");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus lembaga ini?")) return;

    try {
      const response = await fetch(`/api/lembaga-masyarakat?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setLembaga(lembaga.filter((item) => item.id !== id));
    } catch (err) {
      alert("Gagal menghapus lembaga");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Kelola Lembaga Masyarakat
        </h1>
        <Link
          href="/admin/lembaga-masyarakat/tambah"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Tambah Lembaga
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Nama Lembaga
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Pengertian
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {lembaga.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  Tidak ada data lembaga
                </td>
              </tr>
            ) : (
              lembaga.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    {item.nama}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {item.pengertian.substring(0, 100)}...
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <Link
                      href={`/admin/lembaga-masyarakat/edit/${item.id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2 inline-block text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
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
    </div>
  );
}
