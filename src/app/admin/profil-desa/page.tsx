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
import {
  getProfilDesa,
  updateProfilDesa,
  parseProfilDesaFromBackend,
} from "@/services/profilDesaService";

interface Misi {
  no: string;
  title: string;
  description: string;
}

interface ProfileData {
  id?: number;
  visi: string;
  misi: Misi[];
  tujuan?: string[];
  sejarah: string;
  updated_at?: string;
}

interface NotificationState {
  type: "success" | "error" | "info";
  message: string;
}

export default function EditProfilDesaPage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const [editingMisiIndex, setEditingMisiIndex] = useState<number | null>(null);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getProfilDesa();
        if (result.success && result.data) {
          setData(result.data);
        } else {
          showNotification(
            "error",
            result.error || "Gagal memuat data profil desa"
          );
        }
      } catch (error) {
        showNotification("error", "Gagal memuat data profil desa");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleVisiChange = (value: string) => {
    if (data) {
      setData({ ...data, visi: value });
    }
  };

  const handleSejarahChange = (value: string) => {
    if (data) {
      setData({ ...data, sejarah: value });
    }
  };

  const handleMisiTitleChange = (index: number, value: string) => {
    if (data) {
      const newMisi = [...data.misi];
      newMisi[index].title = value;
      setData({ ...data, misi: newMisi });
    }
  };

  const handleMisiDescriptionChange = (index: number, value: string) => {
    if (data) {
      const newMisi = [...data.misi];
      newMisi[index].description = value;
      setData({ ...data, misi: newMisi });
    }
  };

  const handleAddMisi = () => {
    if (data) {
      const newMisi: Misi = {
        no: String(data.misi.length + 1),
        title: "Misi Baru",
        description: "Deskripsi misi baru...",
      };
      setData({ ...data, misi: [...data.misi, newMisi] });
      setEditingMisiIndex(data.misi.length);
    }
  };

  const handleDeleteMisi = (index: number) => {
    if (data) {
      const newMisi = data.misi.filter((_, i) => i !== index);
      // Update nomor urut
      const updatedMisi = newMisi.map((m, i) => ({
        ...m,
        no: String(i + 1),
      }));
      setData({ ...data, misi: updatedMisi });
      setEditingMisiIndex(null);
    }
  };

  const handleTujuanChange = (index: number, value: string) => {
    if (data && data.tujuan) {
      const newTujuan = [...data.tujuan];
      newTujuan[index] = value;
      setData({ ...data, tujuan: newTujuan });
    }
  };

  const handleAddTujuan = () => {
    if (data) {
      setData({
        ...data,
        tujuan: [...(data.tujuan || []), "Target/tujuan baru..."],
      });
    }
  };

  const handleDeleteTujuan = (index: number) => {
    if (data && data.tujuan) {
      const newTujuan = data.tujuan.filter((_, i) => i !== index);
      setData({ ...data, tujuan: newTujuan });
    }
  };

  const handleSave = async () => {
    if (!data) return;

    // Validasi data
    if (!data.visi.trim()) {
      showNotification("error", "Visi tidak boleh kosong");
      return;
    }

    if (data.misi.length === 0) {
      showNotification("error", "Minimal harus ada satu misi");
      return;
    }

    if (!data.sejarah.trim()) {
      showNotification("error", "Sejarah tidak boleh kosong");
      return;
    }

    // Validasi setiap misi
    for (const misi of data.misi) {
      if (!misi.title.trim()) {
        showNotification("error", "Judul misi tidak boleh kosong");
        return;
      }
      if (!misi.description.trim()) {
        showNotification("error", "Deskripsi misi tidak boleh kosong");
        return;
      }
    }

    setSaving(true);
    try {
      const result = await updateProfilDesa(data);

      if (result.success) {
        showNotification("success", "Data profil desa berhasil disimpan!");
      } else {
        showNotification("error", result.error || "Gagal menyimpan data");
      }
    } catch (error) {
      showNotification("error", "Gagal menyimpan data profil desa");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center pt-16 md:pt-0 bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-sm md:text-base text-gray-600">
            Memuat data...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center pt-16 md:pt-0 bg-gray-50">
        <div className="text-center text-red-600">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <p className="text-sm md:text-base">Gagal memuat data profil desa</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen pt-16 md:pt-0">
      {/* Head Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto px-3 md:px-8 py-4 md:py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Edit Profil Desa
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Kelola visi, misi, dan sejarah singkat desa Timbukar
          </p>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="sticky top-14 md:top-0 z-30 bg-white border-b border-gray-200">
          <div className="mx-auto px-3 md:px-8 py-3 md:py-4">
            <div
              className={`p-3 md:p-4 rounded-lg flex items-start gap-3 ${
                notification.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : notification.type === "error"
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-blue-50 text-blue-800 border border-blue-200"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle
                  size={16}
                  className="mt-0.5 flex-shrink-0 md:size-5"
                />
              ) : (
                <AlertCircle
                  size={16}
                  className="mt-0.5 flex-shrink-0 md:size-5"
                />
              )}
              <p className="font-medium text-xs md:text-sm">
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto px-3 md:px-8 py-4 md:py-8">
        <div className="space-y-4 md:space-y-6">
          {/* Visi Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              Visi Desa
            </h2>
            <textarea
              value={data.visi}
              onChange={(e) => handleVisiChange(e.target.value)}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent resize-none text-sm md:text-base"
              rows={4}
              placeholder="Masukkan visi desa..."
            />
          </div>

          {/* Misi Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-4 mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                Misi Desa
              </h2>
              <button
                onClick={handleAddMisi}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 md:px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm md:text-base flex-shrink-0 w-full sm:w-auto"
              >
                <Plus size={16} className="md:hidden" />
                <Plus size={18} className="hidden md:block" />
                <span>Tambah Misi</span>
              </button>
            </div>

            <div className="space-y-3 md:space-y-4">
              {data.misi.map((misi, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3 md:p-4 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3 md:mb-4 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 md:w-8 md:h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xs md:text-sm flex-shrink-0">
                        {misi.no}
                      </div>
                      <button
                        onClick={() =>
                          setEditingMisiIndex(
                            editingMisiIndex === index ? null : index
                          )
                        }
                        className="text-gray-600 hover:text-emerald-600 transition-colors flex-shrink-0 p-1"
                        title="Edit"
                      >
                        <Edit2 size={16} className="md:size-5" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteMisi(index)}
                      className="text-red-600 hover:text-red-700 transition-colors flex-shrink-0 p-1"
                      title="Hapus"
                    >
                      <Trash2 size={16} className="md:size-5" />
                    </button>
                  </div>

                  {editingMisiIndex === index ? (
                    <div className="space-y-2 md:space-y-3">
                      <input
                        type="text"
                        value={misi.title}
                        onChange={(e) =>
                          handleMisiTitleChange(index, e.target.value)
                        }
                        className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm md:text-base"
                        placeholder="Judul misi..."
                      />
                      <textarea
                        value={misi.description}
                        onChange={(e) =>
                          handleMisiDescriptionChange(index, e.target.value)
                        }
                        className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none text-sm md:text-base"
                        rows={3}
                        placeholder="Deskripsi misi..."
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">
                        {misi.title}
                      </h3>
                      <p className="text-gray-700 text-xs md:text-sm line-clamp-2">
                        {misi.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sejarah Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              Sejarah Singkat Desa
            </h2>
            <textarea
              value={data.sejarah}
              onChange={(e) => handleSejarahChange(e.target.value)}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent resize-none text-sm md:text-base"
              rows={6}
              placeholder="Masukkan sejarah desa..."
            />
            <p className="text-xs md:text-sm text-gray-500 mt-3">
              Gunakan enter untuk membuat paragraf baru
            </p>
          </div>

          {/* Save Button Bottom */}
          <div className="flex justify-end gap-3 pb-4 md:pb-0">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm md:text-base"
            >
              <Save size={16} className="md:hidden" />
              <Save size={18} className="hidden md:block" />
              <span className="hidden sm:inline">
                {saving ? "Menyimpan..." : "Simpan Semua"}
              </span>
              <span className="sm:hidden">
                {saving ? "Simpan..." : "Simpan"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
