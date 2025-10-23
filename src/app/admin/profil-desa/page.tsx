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

interface Misi {
  no: string;
  title: string;
  description: string;
}

interface ProfileData {
  visi: string;
  misi: Misi[];
  tujuan: string[];
  sejarah: string;
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
        const response = await fetch("/api/profil");
        if (!response.ok) throw new Error("Gagal mengambil data");
        const result = await response.json();
        setData(result);
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
    if (data) {
      const newTujuan = [...data.tujuan];
      newTujuan[index] = value;
      setData({ ...data, tujuan: newTujuan });
    }
  };

  const handleAddTujuan = () => {
    if (data) {
      setData({
        ...data,
        tujuan: [...data.tujuan, "Target/tujuan baru..."],
      });
    }
  };

  const handleDeleteTujuan = (index: number) => {
    if (data) {
      const newTujuan = data.tujuan.filter((_, i) => i !== index);
      setData({ ...data, tujuan: newTujuan });
    }
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    try {
      const response = await fetch("/api/profil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Gagal menyimpan data");

      showNotification("success", "Data profil desa berhasil disimpan!");
    } catch (error) {
      showNotification("error", "Gagal menyimpan data profil desa");
      console.error(error);
    } finally {
      setSaving(false);
    }
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

  if (!data) {
    return (
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 md:ml-64 bg-gray-50 min-h-screen p-4 md:p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center text-red-600">
              <AlertCircle size={48} className="mx-auto mb-4" />
              <p>Gagal memuat data profil desa</p>
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
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Edit Profil Desa
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola visi, misi, tujuan, dan sejarah Desa Timbukar
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Save size={18} />
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>

        {/* Notification */}
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

        {/* Content */}
        <div className="p-4 md:p-8 space-y-8">
          {/* Visi Section */}
          <div className="bg-white rounded-lg shadow p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Visi Desa</h2>
            <textarea
              value={data.visi}
              onChange={(e) => handleVisiChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent resize-none"
              rows={4}
              placeholder="Masukkan visi desa..."
            />
          </div>

          {/* Misi Section */}
          <div className="bg-white rounded-lg shadow p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Misi Desa</h2>
              <button
                onClick={handleAddMisi}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus size={18} />
                Tambah Misi
              </button>
            </div>

            <div className="space-y-4">
              {data.misi.map((misi, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {misi.no}
                      </div>
                      <button
                        onClick={() =>
                          setEditingMisiIndex(
                            editingMisiIndex === index ? null : index
                          )
                        }
                        className="text-gray-600 hover:text-emerald-600 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteMisi(index)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {editingMisiIndex === index ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={misi.title}
                        onChange={(e) =>
                          handleMisiTitleChange(index, e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        placeholder="Judul misi..."
                      />
                      <textarea
                        value={misi.description}
                        onChange={(e) =>
                          handleMisiDescriptionChange(index, e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
                        rows={3}
                        placeholder="Deskripsi misi..."
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {misi.title}
                      </h3>
                      <p className="text-gray-700">{misi.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tujuan Section */}
          <div className="bg-white rounded-lg shadow p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Target & Tujuan
              </h2>
              <button
                onClick={handleAddTujuan}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus size={18} />
                Tambah Tujuan
              </button>
            </div>

            <div className="space-y-3">
              {data.tujuan.map((tujuan, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors group"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={tujuan}
                      onChange={(e) =>
                        handleTujuanChange(index, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      placeholder="Masukkan tujuan..."
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteTujuan(index)}
                    className="text-red-600 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sejarah Section */}
          <div className="bg-white rounded-lg shadow p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sejarah Singkat Desa
            </h2>
            <textarea
              value={data.sejarah}
              onChange={(e) => handleSejarahChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent resize-none"
              rows={6}
              placeholder="Masukkan sejarah desa..."
            />
            <p className="text-sm text-gray-500 mt-2">
              Gunakan enter untuk membuat paragraf baru
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Save size={20} />
              {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
