"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Edit2 } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import ImageUploadField from "@/components/ImageUploadField";
import { showToast } from "@/utils/toast";

interface BumdesData {
  id: number;
  nama_bumdes: string;
  deskripsi: string;
  jenis_usaha: string;
  alamat: string;
  no_telepon: string;
  pimpinan: string;
  gambar: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  message: string;
  data: BumdesData[] | BumdesData;
}

export default function EditBumdesPage() {
  const [bumdesData, setBumdesData] = useState<BumdesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<BumdesData>>({});
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/bumdes");

        if (!response.ok) {
          console.error("API Error:", response.status, response.statusText);
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`
          );
        }

        const result: ApiResponse = await response.json();
        console.log("Data berhasil dimuat:", result);
        setBumdesData(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Gagal memuat data BUMDES";
        console.error("Fetch error:", errorMessage);
        showToast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddNew = () => {
    setEditingId(-1);
    setEditFormData({
      nama_bumdes: "",
      deskripsi: "",
      jenis_usaha: "",
      alamat: "",
      no_telepon: "",
      pimpinan: "",
      gambar: "",
    });
  };

  const handleEdit = (bumdes: BumdesData) => {
    setEditingId(bumdes.id);
    setEditFormData({ ...bumdes });
  };

  const handleInputChange = (field: string, value: string) => {
    setEditFormData({
      ...editFormData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    if (!token) {
      showToast.error("Token tidak ditemukan. Silakan login ulang.");
      return;
    }

    if (
      !editFormData.nama_bumdes ||
      !editFormData.deskripsi ||
      !editFormData.jenis_usaha ||
      !editFormData.alamat
    ) {
      showToast.error("Silakan isi semua field yang wajib!");
      return;
    }

    setSaving(true);
    try {
      const isNewRecord = editingId === -1;
      const method = isNewRecord ? "POST" : "PUT";
      const url = isNewRecord
        ? "http://localhost:5000/api/bumdes"
        : `http://localhost:5000/api/bumdes/${editingId}`;

      console.log(`Saving BUMDES (${method})`, {
        url,
        isNewRecord,
        data: editFormData,
        dataSize: JSON.stringify(editFormData).length,
        hasGambar: !!editFormData.gambar,
        gambarLength: editFormData.gambar?.length || 0,
        token: token ? "present" : "missing",
      });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      console.log(
        "Save response status:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        let errorMessage = "Gagal menyimpan data";
        let fullErrorData: any = {};

        try {
          const errorData = await response.json();
          fullErrorData = errorData;
          errorMessage =
            errorData.message || errorData.error || JSON.stringify(errorData);
          console.error("Backend error response (JSON):", {
            status: response.status,
            statusText: response.statusText,
            body: errorData,
          });
        } catch (e) {
          try {
            const errorText = await response.text();
            console.error("Backend error response (TEXT):", {
              status: response.status,
              statusText: response.statusText,
              text: errorText,
            });
            errorMessage = errorText || `HTTP ${response.status}`;
          } catch (e2) {
            console.error("Could not parse error response");
          }
        }

        throw new Error(
          `${response.status} ${response.statusText}: ${errorMessage}`
        );
      }

      const result: ApiResponse = await response.json();

      if (isNewRecord) {
        setBumdesData([...bumdesData, result.data as BumdesData]);
      } else {
        setBumdesData(
          bumdesData.map((b) =>
            b.id === editingId ? (result.data as BumdesData) : b
          )
        );
      }

      showToast.success("Data BUMDES berhasil disimpan!");
      setEditingId(null);
      setEditFormData({});
    } catch (error) {
      showToast.error(
        error instanceof Error ? error.message : "Gagal menyimpan data"
      );
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    showToast.confirm(
      "Apakah Anda yakin ingin menghapus data ini?",
      async () => {
        if (!token) {
          showToast.error("Token tidak ditemukan");
          return;
        }

        try {
          const response = await fetch(
            `http://localhost:5000/api/bumdes/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) throw new Error("Gagal menghapus");

          setBumdesData(bumdesData.filter((b) => b.id !== id));
          showToast.success("Data berhasil dihapus!");
        } catch (error) {
          showToast.error("Gagal menghapus data");
          console.error(error);
        }
      },
      { title: "Konfirmasi Hapus", confirmText: "Hapus", cancelText: "Batal" }
    );
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Kelola BUMDES
            </h1>
            <p className="text-gray-600">
              Kelola data Badan Usaha Milik Desa Timbukar
            </p>
          </div>

          {editingId === null && bumdesData.length > 0 && (
            <button
              onClick={handleAddNew}
              className="mb-8 flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
            >
              <Plus size={20} />
              Tambah BUMDES Baru
            </button>
          )}

          {editingId === -1 && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama BUMDES <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.nama_bumdes || ""}
                    onChange={(e) =>
                      handleInputChange("nama_bumdes", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jenis Usaha <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.jenis_usaha || ""}
                    onChange={(e) =>
                      handleInputChange("jenis_usaha", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={editFormData.deskripsi || ""}
                    onChange={(e) =>
                      handleInputChange("deskripsi", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Alamat <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={editFormData.alamat || ""}
                    onChange={(e) =>
                      handleInputChange("alamat", e.target.value)
                    }
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pimpinan
                  </label>
                  <input
                    type="text"
                    value={editFormData.pimpinan || ""}
                    onChange={(e) =>
                      handleInputChange("pimpinan", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    No Telepon
                  </label>
                  <input
                    type="text"
                    value={editFormData.no_telepon || ""}
                    onChange={(e) =>
                      handleInputChange("no_telepon", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <ImageUploadField
                  value={editFormData.gambar}
                  onChange={(value) => handleInputChange("gambar", value || "")}
                  label="Foto BUMDES"
                  placeholder="Drag and drop foto atau klik untuk pilih"
                  uploadFolder="bumdes"
                />

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 transition-colors font-semibold"
                  >
                    <Save size={18} />
                    {saving ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors font-semibold"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {bumdesData.map((bumdes) => (
              <div
                key={bumdes.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
              >
                {editingId === bumdes.id ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama BUMDES <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editFormData.nama_bumdes || ""}
                        onChange={(e) =>
                          handleInputChange("nama_bumdes", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Jenis Usaha <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editFormData.jenis_usaha || ""}
                        onChange={(e) =>
                          handleInputChange("jenis_usaha", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Deskripsi <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={editFormData.deskripsi || ""}
                        onChange={(e) =>
                          handleInputChange("deskripsi", e.target.value)
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Alamat <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={editFormData.alamat || ""}
                        onChange={(e) =>
                          handleInputChange("alamat", e.target.value)
                        }
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pimpinan
                      </label>
                      <input
                        type="text"
                        value={editFormData.pimpinan || ""}
                        onChange={(e) =>
                          handleInputChange("pimpinan", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        No Telepon
                      </label>
                      <input
                        type="text"
                        value={editFormData.no_telepon || ""}
                        onChange={(e) =>
                          handleInputChange("no_telepon", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <ImageUploadField
                      value={editFormData.gambar}
                      onChange={(value) =>
                        handleInputChange("gambar", value || "")
                      }
                      label="Foto BUMDES"
                      placeholder="Drag and drop foto atau klik untuk pilih"
                      uploadFolder="bumdes"
                    />

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 transition-colors font-semibold"
                      >
                        <Save size={18} />
                        {saving ? "Menyimpan..." : "Simpan"}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors font-semibold"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {bumdes.nama_bumdes}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Jenis Usaha:</strong> {bumdes.jenis_usaha}
                      </p>
                      <p className="text-gray-700 mb-3 text-sm">
                        {bumdes.deskripsi}
                      </p>
                      <div className="text-sm text-gray-600 space-y-1">
                        {bumdes.pimpinan && (
                          <p>
                            <strong>Pimpinan:</strong> {bumdes.pimpinan}
                          </p>
                        )}
                        {bumdes.alamat && (
                          <p>
                            <strong>Alamat:</strong> {bumdes.alamat}
                          </p>
                        )}
                        {bumdes.no_telepon && (
                          <p>
                            <strong>Telepon:</strong> {bumdes.no_telepon}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(bumdes)}
                        disabled={editingId !== null}
                        className="p-2 text-emerald-600 hover:bg-emerald-100 disabled:text-gray-400 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(bumdes.id)}
                        disabled={editingId !== null}
                        className="p-2 text-red-600 hover:bg-red-100 disabled:text-gray-400 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {bumdesData.length === 0 && editingId === null && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Belum ada data BUMDES</p>
              <button
                onClick={handleAddNew}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold mx-auto"
              >
                <Plus size={20} />
                Buat BUMDES Pertama
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
