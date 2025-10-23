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

interface BusinessUnit {
  id?: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  color: "blue" | "green" | "cyan" | "amber";
}

interface BumdesData {
  businessUnits: BusinessUnit[];
}

interface NotificationState {
  type: "success" | "error" | "info";
  message: string;
}

export default function EditBumdesPage() {
  const [data, setData] = useState<BumdesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(
    null
  );

  const emojiList = [
    "⛏️",
    "🚣",
    "💧",
    "🏠",
    "🌾",
    "🎨",
    "🛠️",
    "📚",
    "🍜",
    "🌳",
    "🎭",
    "🐔",
    "🐟",
    "🌺",
    "⚒️",
    "🏪",
  ];

  const colors = ["blue", "green", "cyan", "amber"] as const;

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/bumdes");
        if (!response.ok) throw new Error("Gagal mengambil data");
        const result = await response.json();
        setData(result);
      } catch (error) {
        showNotification("error", "Gagal memuat data BUMDes");
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

  const handleAddUnit = () => {
    if (data) {
      const newUnit: BusinessUnit = {
        id: Date.now().toString(),
        icon: "🏪",
        title: "Unit Usaha Baru",
        description: "Deskripsi unit usaha",
        features: ["Fitur 1", "Fitur 2", "Fitur 3"],
        color: "blue",
      };
      setData({
        ...data,
        businessUnits: [...data.businessUnits, newUnit],
      });
      setEditingIndex(data.businessUnits.length);
    }
  };

  const handleUpdateUnit = (index: number, field: string, value: any) => {
    if (data) {
      const updatedUnits = [...data.businessUnits];
      updatedUnits[index] = {
        ...updatedUnits[index],
        [field]: value,
      };
      setData({
        ...data,
        businessUnits: updatedUnits,
      });
    }
  };

  const handleAddFeature = (index: number) => {
    if (data) {
      const updatedUnits = [...data.businessUnits];
      updatedUnits[index].features.push("Fitur baru");
      setData({
        ...data,
        businessUnits: updatedUnits,
      });
    }
  };

  const handleUpdateFeature = (
    unitIndex: number,
    featureIndex: number,
    value: string
  ) => {
    if (data) {
      const updatedUnits = [...data.businessUnits];
      updatedUnits[unitIndex].features[featureIndex] = value;
      setData({
        ...data,
        businessUnits: updatedUnits,
      });
    }
  };

  const handleRemoveFeature = (unitIndex: number, featureIndex: number) => {
    if (data) {
      const updatedUnits = [...data.businessUnits];
      updatedUnits[unitIndex].features.splice(featureIndex, 1);
      setData({
        ...data,
        businessUnits: updatedUnits,
      });
    }
  };

  const handleDeleteUnit = (index: number) => {
    if (data && window.confirm("Apakah Anda yakin ingin menghapus unit ini?")) {
      const updatedUnits = data.businessUnits.filter((_, i) => i !== index);
      setData({
        ...data,
        businessUnits: updatedUnits,
      });
      showNotification("info", "Unit usaha dihapus");
    }
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    try {
      const response = await fetch("/api/bumdes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Gagal menyimpan data");

      showNotification("success", "Data BUMDes berhasil disimpan!");
      setEditingIndex(null);
      setEditingFeatureIndex(null);
    } catch (error) {
      showNotification("error", "Gagal menyimpan data BUMDes");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Gagal memuat data</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit BUMDes
            </h1>
            <p className="text-gray-600">
              Kelola unit usaha desa (BUMDes) Timbukar
            </p>
          </div>

          {/* Notification */}
          {notification && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                notification.type === "success"
                  ? "bg-green-100 text-green-800"
                  : notification.type === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          {/* Business Units */}
          <div className="space-y-6">
            {data.businessUnits.map((unit, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
              >
                {editingIndex === index ? (
                  <div className="space-y-6">
                    {/* Icon Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Icon Emoji
                      </label>
                      <div className="grid grid-cols-8 gap-2">
                        {emojiList.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() =>
                              handleUpdateUnit(index, "icon", emoji)
                            }
                            className={`text-2xl p-2 rounded-lg transition-all ${
                              unit.icon === emoji
                                ? "bg-emerald-600 scale-110"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Judul Unit
                      </label>
                      <input
                        type="text"
                        value={unit.title}
                        onChange={(e) =>
                          handleUpdateUnit(index, "title", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Deskripsi
                      </label>
                      <textarea
                        value={unit.description}
                        onChange={(e) =>
                          handleUpdateUnit(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    {/* Color Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Warna Box
                      </label>
                      <div className="flex gap-3">
                        {colors.map((color) => {
                          const colorMap: {
                            [key: string]: string;
                          } = {
                            blue: "bg-blue-200",
                            green: "bg-green-200",
                            cyan: "bg-cyan-200",
                            amber: "bg-amber-200",
                          };
                          return (
                            <button
                              key={color}
                              onClick={() =>
                                handleUpdateUnit(index, "color", color)
                              }
                              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                unit.color === color
                                  ? colorMap[color] + " ring-2 ring-gray-900"
                                  : colorMap[color]
                              }`}
                            >
                              {color}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-semibold text-gray-700">
                          Fitur-Fitur
                        </label>
                        <button
                          onClick={() => handleAddFeature(index)}
                          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-semibold"
                        >
                          <Plus size={16} />
                          Tambah Fitur
                        </button>
                      </div>

                      <div className="space-y-2">
                        {unit.features.map((feature, featureIdx) => (
                          <div key={featureIdx} className="flex gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) =>
                                handleUpdateFeature(
                                  index,
                                  featureIdx,
                                  e.target.value
                                )
                              }
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            />
                            <button
                              onClick={() =>
                                handleRemoveFeature(index, featureIdx)
                              }
                              className="text-red-600 hover:text-red-700 p-2"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-4xl">{unit.icon}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {unit.title}
                          </h3>
                          <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full mt-1">
                            {unit.color}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{unit.description}</p>
                      <div className="text-sm text-gray-600">
                        <strong>Fitur:</strong> {unit.features.join(", ")}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setEditingIndex(index)}
                        className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUnit(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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

          {/* Add New Unit Button */}
          <button
            onClick={handleAddUnit}
            className="mt-8 flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
          >
            <Plus size={20} />
            Tambah Unit Usaha Baru
          </button>

          {/* Save Button */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-semibold"
            >
              <Save size={20} />
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
