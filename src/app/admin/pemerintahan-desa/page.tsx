"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

interface Posisi {
  nama: string;
  jabatan: string;
  foto: string;
  kontak: string;
  tugas: string;
}

interface Level {
  level: string;
  posisi: Posisi[];
}

interface Bidang {
  nama: string;
  deskripsi: string;
  icon: string;
}

interface PemerintahanData {
  struktur: Level[];
  bidang: Bidang[];
}

interface NotificationState {
  type: "success" | "error" | "info";
  message: string;
}

export default function EditPemerintahanDesaPage() {
  const [data, setData] = useState<PemerintahanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(
    new Set([0, 1, 2])
  );
  const [editingPosisi, setEditingPosisi] = useState<{
    levelIdx: number;
    posIdx: number;
  } | null>(null);
  const [editingBidang, setEditingBidang] = useState<number | null>(null);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/pemerintahan");
        if (!response.ok) throw new Error("Gagal mengambil data");
        const result = await response.json();
        setData(result);
      } catch (error) {
        showNotification("error", "Gagal memuat data pemerintahan desa");
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

  const toggleLevel = (idx: number) => {
    const newExpanded = new Set(expandedLevels);
    if (newExpanded.has(idx)) {
      newExpanded.delete(idx);
    } else {
      newExpanded.add(idx);
    }
    setExpandedLevels(newExpanded);
  };

  // Struktur handlers
  const handleLevelNameChange = (levelIdx: number, value: string) => {
    if (data) {
      const newStruktur = [...data.struktur];
      newStruktur[levelIdx].level = value;
      setData({ ...data, struktur: newStruktur });
    }
  };

  const handlePosisiChange = (
    levelIdx: number,
    posIdx: number,
    field: keyof Posisi,
    value: string
  ) => {
    if (data) {
      const newStruktur = [...data.struktur];
      newStruktur[levelIdx].posisi[posIdx] = {
        ...newStruktur[levelIdx].posisi[posIdx],
        [field]: value,
      };
      setData({ ...data, struktur: newStruktur });
    }
  };

  const handleAddPosisi = (levelIdx: number) => {
    if (data) {
      const newStruktur = [...data.struktur];
      newStruktur[levelIdx].posisi.push({
        nama: "[Nama]",
        jabatan: "[Jabatan Baru]",
        foto: "/images/placeholder.svg",
        kontak: "-",
        tugas: "",
      });
      setData({ ...data, struktur: newStruktur });
      setEditingPosisi({
        levelIdx,
        posIdx: newStruktur[levelIdx].posisi.length - 1,
      });
    }
  };

  const handleDeletePosisi = (levelIdx: number, posIdx: number) => {
    if (data) {
      const newStruktur = [...data.struktur];
      newStruktur[levelIdx].posisi = newStruktur[levelIdx].posisi.filter(
        (_, i) => i !== posIdx
      );
      setData({ ...data, struktur: newStruktur });
      setEditingPosisi(null);
    }
  };

  const handleAddLevel = () => {
    if (data) {
      const newLevel: Level = {
        level: "Struktur Baru",
        posisi: [],
      };
      const newStruktur = [...data.struktur, newLevel];
      setData({ ...data, struktur: newStruktur });
      setExpandedLevels(new Set(expandedLevels).add(newStruktur.length - 1));
    }
  };

  const handleDeleteLevel = (levelIdx: number) => {
    if (data) {
      const newStruktur = data.struktur.filter((_, i) => i !== levelIdx);
      setData({ ...data, struktur: newStruktur });
      const newExpanded = new Set(expandedLevels);
      newExpanded.delete(levelIdx);
      setExpandedLevels(newExpanded);
    }
  };

  // Bidang handlers
  const handleBidangChange = (
    bidangIdx: number,
    field: keyof Bidang,
    value: string
  ) => {
    if (data) {
      const newBidang = [...data.bidang];
      newBidang[bidangIdx] = { ...newBidang[bidangIdx], [field]: value };
      setData({ ...data, bidang: newBidang });
    }
  };

  const handleAddBidang = () => {
    if (data) {
      const newBidang: Bidang = {
        nama: "Bidang Baru",
        deskripsi: "Deskripsi bidang...",
        icon: "📋",
      };
      setData({ ...data, bidang: [...data.bidang, newBidang] });
      setEditingBidang(data.bidang.length);
    }
  };

  const handleDeleteBidang = (bidangIdx: number) => {
    if (data) {
      const newBidang = data.bidang.filter((_, i) => i !== bidangIdx);
      setData({ ...data, bidang: newBidang });
      setEditingBidang(null);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    try {
      const response = await fetch("/api/pemerintahan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Gagal menyimpan data");

      showNotification("success", "Data pemerintahan desa berhasil disimpan!");
    } catch (error) {
      showNotification("error", "Gagal menyimpan data pemerintahan desa");
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
              <p>Gagal memuat data pemerintahan desa</p>
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
                Edit Pemerintahan Desa
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola struktur organisasi dan bidang-bidang pemerintahan
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
          {/* Struktur Organisasi */}
          <div className="bg-white rounded-lg shadow p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Struktur Organisasi
              </h2>
              <button
                onClick={handleAddLevel}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus size={18} />
                Tambah Level
              </button>
            </div>

            <div className="space-y-4">
              {data.struktur.map((level, levelIdx) => (
                <div
                  key={levelIdx}
                  className="border border-gray-200 rounded-lg"
                >
                  {/* Level Header */}
                  <button
                    onClick={() => toggleLevel(levelIdx)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {expandedLevels.has(levelIdx) ? (
                        <ChevronUp size={20} className="text-emerald-600" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                      <input
                        type="text"
                        value={level.level}
                        onChange={(e) =>
                          handleLevelNameChange(levelIdx, e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold text-gray-900"
                      />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLevel(levelIdx);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </button>

                  {/* Level Content */}
                  {expandedLevels.has(levelIdx) && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
                      {level.posisi.map((posisi, posIdx) => (
                        <div
                          key={posIdx}
                          className="bg-white border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <button
                              onClick={() =>
                                setEditingPosisi(
                                  editingPosisi?.levelIdx === levelIdx &&
                                    editingPosisi?.posIdx === posIdx
                                    ? null
                                    : { levelIdx, posIdx }
                                )
                              }
                              className="text-gray-600 hover:text-emerald-600 transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeletePosisi(levelIdx, posIdx)
                              }
                              className="text-red-600 hover:text-red-700 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          {editingPosisi?.levelIdx === levelIdx &&
                          editingPosisi?.posIdx === posIdx ? (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Nama
                                </label>
                                <input
                                  type="text"
                                  value={posisi.nama}
                                  onChange={(e) =>
                                    handlePosisiChange(
                                      levelIdx,
                                      posIdx,
                                      "nama",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Jabatan
                                </label>
                                <input
                                  type="text"
                                  value={posisi.jabatan}
                                  onChange={(e) =>
                                    handlePosisiChange(
                                      levelIdx,
                                      posIdx,
                                      "jabatan",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Foto (URL)
                                </label>
                                <input
                                  type="text"
                                  value={posisi.foto}
                                  onChange={(e) =>
                                    handlePosisiChange(
                                      levelIdx,
                                      posIdx,
                                      "foto",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Kontak
                                </label>
                                <input
                                  type="text"
                                  value={posisi.kontak}
                                  onChange={(e) =>
                                    handlePosisiChange(
                                      levelIdx,
                                      posIdx,
                                      "kontak",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Tugas (Opsional)
                                </label>
                                <textarea
                                  value={posisi.tugas}
                                  onChange={(e) =>
                                    handlePosisiChange(
                                      levelIdx,
                                      posIdx,
                                      "tugas",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
                                  rows={2}
                                />
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {posisi.nama}
                              </h4>
                              <p className="text-sm badge-primary mb-2">
                                {posisi.jabatan}
                              </p>
                              {posisi.tugas && (
                                <p className="text-sm text-gray-600 mb-2">
                                  {posisi.tugas}
                                </p>
                              )}
                              {posisi.kontak !== "-" && (
                                <p className="text-sm text-gray-700">
                                  📞 {posisi.kontak}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}

                      <button
                        onClick={() => handleAddPosisi(levelIdx)}
                        className="w-full py-2 border-2 border-dashed border-emerald-300 rounded-lg text-emerald-600 font-medium hover:bg-emerald-50 transition-colors"
                      >
                        <Plus size={18} className="inline mr-2" />
                        Tambah Posisi
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bidang-Bidang */}
          <div className="bg-white rounded-lg shadow p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Bidang-Bidang Pemerintahan
              </h2>
              <button
                onClick={handleAddBidang}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus size={18} />
                Tambah Bidang
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.bidang.map((bidang, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors"
                >
                  {editingBidang === idx ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icon (Emoji)
                        </label>
                        <input
                          type="text"
                          value={bidang.icon}
                          onChange={(e) =>
                            handleBidangChange(idx, "icon", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Bidang
                        </label>
                        <input
                          type="text"
                          value={bidang.nama}
                          onChange={(e) =>
                            handleBidangChange(idx, "nama", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Deskripsi
                        </label>
                        <textarea
                          value={bidang.deskripsi}
                          onChange={(e) =>
                            handleBidangChange(idx, "deskripsi", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingBidang(null)}
                          className="px-3 py-1 text-gray-600 hover:text-gray-900"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-3xl">{bidang.icon}</div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingBidang(idx)}
                            className="text-gray-600 hover:text-emerald-600"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteBidang(idx)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {bidang.nama}
                      </h3>
                      <p className="text-sm text-gray-700">
                        {bidang.deskripsi}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
