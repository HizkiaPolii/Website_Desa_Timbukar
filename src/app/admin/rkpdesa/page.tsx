"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, X, AlertCircle } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import PDFUploadField from "@/components/PDFUploadField";
import {
  useRKPDesa,
  type RKPDesaItem,
  type CreateRKPDesaPayload,
} from "@/hooks/useRKPDesa";

export default function AdminRKPDESA() {
  const [data, setData] = useState<RKPDesaItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState<CreateRKPDesaPayload>({
    tahun: new Date().getFullYear(),
    judul: "",
    deskripsi: "",
    anggaran: 0,
    status: "draft",
    fileDokumen: "",
  });

  const {
    loading,
    error,
    fetchRKPDesaList,
    createRKPDesa,
    updateRKPDesa,
    deleteRKPDesa,
  } = useRKPDesa();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const result = await fetchRKPDesaList();
        setData(result);
      } catch (err) {
        setMessage({
          type: "error",
          text: "Gagal memuat data RKPDESA",
        });
      }
    };

    loadInitialData();
  }, [fetchRKPDesaList]);

  const loadData = async () => {
    try {
      const result = await fetchRKPDesaList();
      setData(result);
    } catch (err) {
      setMessage({
        type: "error",
        text: "Gagal memuat data RKPDESA",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "anggaran") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else if (name === "tahun") {
      setFormData({
        ...formData,
        [name]: parseInt(value) || new Date().getFullYear(),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.judul.trim()) {
      setMessage({
        type: "error",
        text: "Judul tidak boleh kosong",
      });
      return;
    }

    try {
      if (editingId) {
        await updateRKPDesa(editingId, formData);
        setMessage({
          type: "success",
          text: "Data RKPDESA berhasil diperbarui",
        });
      } else {
        await createRKPDesa(formData);
        setMessage({
          type: "success",
          text: "Data RKPDESA berhasil ditambahkan",
        });
      }

      resetForm();
      await loadData();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Gagal menyimpan data",
      });
    }
  };

  const handleEdit = (item: RKPDesaItem) => {
    setFormData({
      tahun: item.tahun,
      judul: item.judul,
      deskripsi: item.deskripsi,
      anggaran: item.anggaran,
      status: item.status,
      fileDokumen: item.fileDokumen || "",
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      return;
    }

    try {
      await deleteRKPDesa(id);
      setMessage({
        type: "success",
        text: "Data RKPDESA berhasil dihapus",
      });
      await loadData();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Gagal menghapus data",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      tahun: new Date().getFullYear(),
      judul: "",
      deskripsi: "",
      anggaran: 0,
      status: "draft",
      fileDokumen: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 md:ml-64 pt-20 md:pt-0 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Kelola RKPDESA
            </h1>
            <p className="text-gray-600">
              Manage Rencana Kerja Pembangunan Desa
            </p>
          </div>

          {/* Message Alert */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              <AlertCircle size={20} />
              <span>{message.text}</span>
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="mb-8 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? "Edit RKPDESA" : "Tambah RKPDESA Baru"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tahun *
                    </label>
                    <input
                      type="number"
                      name="tahun"
                      value={formData.tahun}
                      onChange={handleInputChange}
                      min="1900"
                      max="2100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="draft">Draft</option>
                      <option value="aktif">Aktif</option>
                      <option value="selesai">Selesai</option>
                      <option value="tertunda">Tertunda</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul *
                  </label>
                  <input
                    type="text"
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    maxLength={200}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    placeholder="Masukkan judul RKPDESA"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
                    placeholder="Masukkan deskripsi RKPDESA"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Anggaran (Rp) *
                    </label>
                    <input
                      type="number"
                      name="anggaran"
                      value={formData.anggaran}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      placeholder="0"
                      required
                    />
                  </div>

                  <div>
                    <PDFUploadField
                      label="File Dokumen RKPDESA"
                      value={formData.fileDokumen}
                      onChange={(url) =>
                        setFormData({
                          ...formData,
                          fileDokumen: url,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    <Save size={18} />
                    {loading ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Data RKPDESA</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus size={18} />
                Tambah Data
              </button>
            </div>

            {loading ? (
              <div className="p-6 text-center text-gray-500">
                Memuat data...
              </div>
            ) : data.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Tidak ada data RKPDESA
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Tahun
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Judul
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Anggaran
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-3 text-sm text-gray-900">
                          {item.id}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-900">
                          {item.tahun}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-900">
                          {item.judul}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-900">
                          Rp. {item.anggaran.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              item.status === "aktif"
                                ? "bg-green-100 text-green-800"
                                : item.status === "selesai"
                                ? "bg-blue-100 text-blue-800"
                                : item.status === "tertunda"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
