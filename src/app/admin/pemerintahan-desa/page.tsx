"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import ImageUploadField from "@/components/ImageUploadField";
import {
  pemerintahanDesaService,
  type Pegawai,
} from "@/services/pemerintahanDesaService";

interface NotificationState {
  type: "success" | "error" | "info";
  message: string;
}

export default function EditPemerintahanDesaPage() {
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<Pegawai>>({
    nama: "",
    jabatan: "",
    nip: "",
    noTelepon: "",
    alamat: "",
    foto: "",
    kategori: "perangkat_desa",
  });

  useEffect(() => {
    fetchPegawai();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if token exists, redirect if not
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
      }
    }
  }, []);

  const fetchPegawai = async () => {
    try {
      setLoading(true);
      const data = await pemerintahanDesaService.getAllPemerintahan();
      setPegawaiList(data);
    } catch (error) {
      showNotification(
        "error",
        "Gagal memuat data. Pastikan backend server running di http://localhost:5000"
      );
      console.error("Fetch error:", error);
      setPegawaiList([]);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleInputChange = (field: keyof Pegawai, value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      jabatan: "",
      nip: "",
      noTelepon: "",
      alamat: "",
      foto: "",
      kategori: "perangkat_desa",
    });
    setEditingId(null);
    setIsAddingNew(false);
  };

  const startEditing = (pegawai: Pegawai) => {
    setFormData({
      id: pegawai.id,
      nama: pegawai.nama,
      jabatan: pegawai.jabatan,
      nip: pegawai.nip,
      noTelepon: pegawai.noTelepon,
      alamat: pegawai.alamat,
      foto: pegawai.foto,
      kategori: pegawai.kategori || "perangkat_desa",
    });
    setEditingId(pegawai.id);
  };

  const startAddNew = () => {
    resetForm();
    setIsAddingNew(true);
  };

  const validateForm = (): boolean => {
    if (!formData.nama?.trim()) {
      showNotification("error", "Nama harus diisi");
      return false;
    }
    if (!formData.jabatan?.trim()) {
      showNotification("error", "Jabatan harus diisi");
      return false;
    }
    if (!formData.nip?.trim()) {
      showNotification("error", "NIP harus diisi");
      return false;
    }
    if (!formData.noTelepon?.trim()) {
      showNotification("error", "Nomor telepon harus diisi");
      return false;
    }
    if (!formData.alamat?.trim()) {
      showNotification("error", "Alamat harus diisi");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (editingId) {
        console.log("Updating pegawai:", { editingId, formData });
        await pemerintahanDesaService.updatePemerintahan(editingId, {
          nama: formData.nama!,
          jabatan: formData.jabatan!,
          nip: formData.nip!,
          noTelepon: formData.noTelepon!,
          alamat: formData.alamat!,
          foto: formData.foto || null,
          kategori: (formData.kategori || "perangkat_desa") as
            | "pemimpin_desa"
            | "perangkat_desa"
            | "perangkat_penunjang",
        });
        showNotification("success", "Data pemerintahan berhasil diperbarui!");
      } else {
        console.log("Creating pegawai:", { formData });
        await pemerintahanDesaService.createPemerintahan({
          nama: formData.nama!,
          jabatan: formData.jabatan!,
          nip: formData.nip!,
          noTelepon: formData.noTelepon!,
          alamat: formData.alamat!,
          foto: formData.foto || null,
          kategori: (formData.kategori || "perangkat_desa") as
            | "pemimpin_desa"
            | "perangkat_desa"
            | "perangkat_penunjang",
        });
        showNotification("success", "Data pemerintahan berhasil ditambahkan!");
      }
      resetForm();
      await fetchPegawai();
    } catch (error: any) {
      const errorMessage = error?.message || "Gagal menyimpan data";
      console.error("Save error:", error);

      // Jika error karena sesi expired (401)
      if (
        error?.message?.includes("berakhir") ||
        error?.message?.includes("401")
      ) {
        showNotification(
          "error",
          "Sesi Anda telah berakhir. Silakan login kembali."
        );
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        showNotification("error", errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      await pemerintahanDesaService.deletePemerintahan(id);
      showNotification("success", "Data pemerintahan berhasil dihapus!");
      await fetchPegawai();
    } catch (error: any) {
      const errorMessage = error?.message || "Gagal menghapus data";

      // Jika error karena sesi expired
      if (errorMessage?.includes("berakhir") || errorMessage?.includes("401")) {
        showNotification(
          "error",
          "Sesi Anda telah berakhir. Silakan login kembali."
        );
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        showNotification("error", errorMessage);
      }
      console.error(error);
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 md:ml-64 bg-gray-50 min-h-screen p-4 md:p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              <p className="mt-4 text-gray-600">Memuat data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-gray-200 p-4 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Kelola Pemerintahan Desa
              </h1>
              <p className="text-gray-600 mt-1">
                Tambah, edit, atau hapus data pegawai pemerintahan desa
              </p>
            </div>
            {!isAddingNew && !editingId && (
              <button
                onClick={startAddNew}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus size={18} />
                Tambah Pegawai
              </button>
            )}
          </div>
        </div>

        {notification && (
          <div
            className={`mx-4 mt-4 md:mx-8 md:mt-8 p-4 rounded-lg flex items-start gap-3 ${
              notification.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : notification.type === "error"
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-blue-50 text-blue-800 border border-blue-200"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle size={20} className="mt-1 flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="mt-1 flex-shrink-0" />
            )}
            <div>
              <p className="font-medium">{notification.message}</p>
            </div>
          </div>
        )}

        <div className="p-4 md:p-8 space-y-8">
          {(isAddingNew || editingId) && (
            <div className="bg-white rounded-lg shadow p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingId ? "Edit Pegawai" : "Tambah Pegawai Baru"}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nama || ""}
                      onChange={(e) =>
                        handleInputChange("nama", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jabatan <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.jabatan || ""}
                      onChange={(e) =>
                        handleInputChange("jabatan", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      placeholder="Contoh: Kepala Desa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIP <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nip || ""}
                      onChange={(e) => handleInputChange("nip", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      placeholder="15-20 digit"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formData.kategori || "perangkat_desa"}
                      onChange={(e) =>
                        handleInputChange("kategori", e.target.value as any)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="pemimpin_desa">
                        Pemimpin Desa (Kepala Desa)
                      </option>
                      <option value="perangkat_desa">Perangkat Desa</option>
                      <option value="perangkat_penunjang">
                        Perangkat Penunjang
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.noTelepon || ""}
                      onChange={(e) =>
                        handleInputChange("noTelepon", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      placeholder="081234567890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={formData.alamat || ""}
                    onChange={(e) =>
                      handleInputChange("alamat", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
                    rows={3}
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>

                <div>
                  <ImageUploadField
                    value={formData.foto}
                    onChange={(value) => handleInputChange("foto", value)}
                    label="Foto (Opsional)"
                    placeholder="Drag and drop foto atau klik untuk pilih"
                  />
                </div>

                <div className="flex gap-4 justify-end pt-4">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                  >
                    <Save size={18} />
                    {saving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Daftar Pegawai ({pegawaiList.length})
              </h2>
            </div>

            {pegawaiList.length === 0 ? (
              <div className="p-6 md:p-8 text-center text-gray-500">
                <p>
                  Belum ada data pegawai. Tambahkan data baru untuk memulai.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Nama
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Jabatan
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        NIP
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Telepon
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pegawaiList.map((pegawai, idx) => (
                      <tr
                        key={pegawai.id}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {pegawai.nama}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {pegawai.jabatan}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              pegawai.kategori === "pemimpin_desa"
                                ? "bg-amber-100 text-amber-800"
                                : pegawai.kategori === "perangkat_desa"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {pegawai.kategori === "pemimpin_desa"
                              ? "Pemimpin Desa"
                              : pegawai.kategori === "perangkat_desa"
                              ? "Perangkat Desa"
                              : "Perangkat Penunjang"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {pegawai.nip}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {pegawai.noTelepon}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => startEditing(pegawai)}
                              disabled={editingId !== null || isAddingNew}
                              className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 p-2"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(pegawai.id)}
                              disabled={editingId !== null || isAddingNew}
                              className="text-red-600 hover:text-red-700 disabled:text-gray-400 p-2"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
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
