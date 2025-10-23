"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, X, Upload } from "lucide-react";
import Image from "next/image";

interface BudgetItem {
  id: number;
  description: string;
  amount: number;
}

interface BudgetCategory {
  id: number;
  category: string;
  items: BudgetItem[];
  total: number;
}

interface ApbdesData {
  pendapatan: BudgetCategory[];
  belanja: BudgetCategory[];
  tahunAnggaran: number;
  photos: string[];
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function AdminApbdesPage() {
  const [apbdesData, setApbdesData] = useState<ApbdesData>({
    tahunAnggaran: 2024,
    pendapatan: [
      {
        id: 1,
        category: "Pendapatan Asli Desa (PAD)",
        items: [
          { id: 1, description: "Pajak Desa", amount: 50000000 },
          { id: 2, description: "Retribusi Desa", amount: 35000000 },
          { id: 3, description: "Hasil Usaha Desa", amount: 40000000 },
          { id: 4, description: "Hasil Kekayaan Desa", amount: 25000000 },
        ],
        total: 150000000,
      },
      {
        id: 2,
        category: "Dana Transfer",
        items: [
          { id: 5, description: "Dana Alokasi Umum (DAU)", amount: 800000000 },
          { id: 6, description: "Dana Alokasi Khusus (DAK)", amount: 300000000 },
          { id: 7, description: "Dana Desa", amount: 1200000000 },
          {
            id: 8,
            description: "Bagi Hasil Pajak & Retribusi",
            amount: 150000000,
          },
        ],
        total: 2450000000,
      },
      {
        id: 3,
        category: "Lain-lain Pendapatan",
        items: [
          { id: 9, description: "Hibah", amount: 100000000 },
          { id: 10, description: "Pinjaman", amount: 50000000 },
          { id: 11, description: "Pendapatan Bunga", amount: 25000000 },
        ],
        total: 175000000,
      },
    ],
    belanja: [
      {
        id: 1,
        category: "Belanja Aparatur Desa",
        items: [
          { id: 1, description: "Gaji & Tunjangan Kepala Desa", amount: 120000000 },
          { id: 2, description: "Gaji & Tunjangan Perangkat Desa", amount: 280000000 },
          { id: 3, description: "Asuransi Kesehatan Aparatur", amount: 60000000 },
          { id: 4, description: "Pelatihan Aparatur Desa", amount: 50000000 },
        ],
        total: 510000000,
      },
      {
        id: 2,
        category: "Belanja Pelayanan Publik",
        items: [
          { id: 5, description: "Pendidikan & Pelatihan Masyarakat", amount: 200000000 },
          { id: 6, description: "Kesehatan Masyarakat", amount: 250000000 },
          { id: 7, description: "Puskesmas/Polindes", amount: 150000000 },
          { id: 8, description: "Program Kesejahteraan Sosial", amount: 300000000 },
        ],
        total: 900000000,
      },
      {
        id: 3,
        category: "Belanja Pembangunan Infrastruktur",
        items: [
          { id: 9, description: "Pembangunan Jalan Desa", amount: 500000000 },
          { id: 10, description: "Pembangunan Irigasi", amount: 300000000 },
          { id: 11, description: "Pembangunan Gedung Pertemuan", amount: 250000000 },
          { id: 12, description: "Pembangunan Sanitasi & Air Bersih", amount: 200000000 },
          { id: 13, description: "Pembangunan Listrik Desa", amount: 150000000 },
        ],
        total: 1400000000,
      },
      {
        id: 4,
        category: "Belanja Pemberdayaan Masyarakat",
        items: [
          { id: 14, description: "Program Pemberdayaan Ekonomi", amount: 150000000 },
          { id: 15, description: "Pelatihan Keterampilan", amount: 120000000 },
          { id: 16, description: "Dukungan UMKM", amount: 180000000 },
          { id: 17, description: "Program Pertanian Modern", amount: 140000000 },
        ],
        total: 590000000,
      },
      {
        id: 5,
        category: "Belanja Penyelenggaraan Pemerintahan",
        items: [
          { id: 18, description: "Operasional Kantor Desa", amount: 80000000 },
          { id: 19, description: "Pemeliharaan Aset Desa", amount: 100000000 },
          { id: 20, description: "Perjalanan Dinas", amount: 60000000 },
          { id: 21, description: "Rapat & Pertemuan", amount: 40000000 },
        ],
        total: 280000000,
      },
      {
        id: 6,
        category: "Belanja Lain-lain",
        items: [
          { id: 22, description: "Cadangan Umum", amount: 150000000 },
          { id: 23, description: "Koreksi Kesalahan Tahun Sebelumnya", amount: 25000000 },
        ],
        total: 175000000,
      },
    ],
    photos: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"item" | "category">("item");
  const [editingData, setEditingData] = useState<{
    type: "pendapatan" | "belanja";
    categoryId?: number;
    itemId?: number;
  } | null>(null);

  const [itemForm, setItemForm] = useState({
    description: "",
    amount: "",
  });

  const [categoryForm, setCategoryForm] = useState({
    category: "",
  });

  const [isDragging, setIsDragging] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Handle tahun anggaran
  const handleTahunChange = (newTahun: number) => {
    setApbdesData((prev) => ({
      ...prev,
      tahunAnggaran: newTahun,
    }));
  };

  // Handle photo upload
  const handlePhotoSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setApbdesData((prev) => ({
          ...prev,
          photos: [...prev.photos, result],
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Silakan pilih file gambar (JPG, PNG, GIF, WebP)");
    }
  };

  const handlePhotoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handlePhotoDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handlePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handlePhotoSelect(files[0]);
    }
  };

  const handlePhotoFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handlePhotoSelect(files[0]);
    }
  };

  const removePhoto = (index: number) => {
    setApbdesData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  // Handle item operations
  const handleEditItem = (
    type: "pendapatan" | "belanja",
    categoryId: number,
    item: BudgetItem
  ) => {
    setEditingData({
      type,
      categoryId,
      itemId: item.id,
    });
    setItemForm({
      description: item.description,
      amount: item.amount.toString(),
    });
    setModalType("item");
    setIsModalOpen(true);
  };

  const handleAddItem = (type: "pendapatan" | "belanja", categoryId: number) => {
    setEditingData({
      type,
      categoryId,
    });
    setItemForm({
      description: "",
      amount: "",
    });
    setModalType("item");
    setIsModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!itemForm.description || !itemForm.amount || !editingData) return;

    const amount = parseInt(itemForm.amount);
    const isEditing = editingData.itemId !== undefined;

    if (editingData.type === "pendapatan") {
      setApbdesData((prev) => ({
        ...prev,
        pendapatan: prev.pendapatan.map((cat) => {
          if (cat.id === editingData.categoryId) {
            const updatedItems = isEditing
              ? cat.items.map((item) =>
                  item.id === editingData.itemId
                    ? { ...item, description: itemForm.description, amount }
                    : item
                )
              : [
                  ...cat.items,
                  {
                    id: Math.max(...cat.items.map((i) => i.id), 0) + 1,
                    description: itemForm.description,
                    amount,
                  },
                ];
            return {
              ...cat,
              items: updatedItems,
              total: updatedItems.reduce((sum, item) => sum + item.amount, 0),
            };
          }
          return cat;
        }),
      }));
    } else {
      setApbdesData((prev) => ({
        ...prev,
        belanja: prev.belanja.map((cat) => {
          if (cat.id === editingData.categoryId) {
            const updatedItems = isEditing
              ? cat.items.map((item) =>
                  item.id === editingData.itemId
                    ? { ...item, description: itemForm.description, amount }
                    : item
                )
              : [
                  ...cat.items,
                  {
                    id: Math.max(...cat.items.map((i) => i.id), 0) + 1,
                    description: itemForm.description,
                    amount,
                  },
                ];
            return {
              ...cat,
              items: updatedItems,
              total: updatedItems.reduce((sum, item) => sum + item.amount, 0),
            };
          }
          return cat;
        }),
      }));
    }

    setIsModalOpen(false);
    setEditingData(null);
  };

  const handleDeleteItem = (
    type: "pendapatan" | "belanja",
    categoryId: number,
    itemId: number
  ) => {
    if (confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      if (type === "pendapatan") {
        setApbdesData((prev) => ({
          ...prev,
          pendapatan: prev.pendapatan.map((cat) => {
            if (cat.id === categoryId) {
              const updatedItems = cat.items.filter((item) => item.id !== itemId);
              return {
                ...cat,
                items: updatedItems,
                total: updatedItems.reduce((sum, item) => sum + item.amount, 0),
              };
            }
            return cat;
          }),
        }));
      } else {
        setApbdesData((prev) => ({
          ...prev,
          belanja: prev.belanja.map((cat) => {
            if (cat.id === categoryId) {
              const updatedItems = cat.items.filter((item) => item.id !== itemId);
              return {
                ...cat,
                items: updatedItems,
                total: updatedItems.reduce((sum, item) => sum + item.amount, 0),
              };
            }
            return cat;
          }),
        }));
      }
    }
  };

  const totalPendapatan = apbdesData.pendapatan.reduce(
    (sum, cat) => sum + cat.total,
    0
  );
  const totalBelanja = apbdesData.belanja.reduce((sum, cat) => sum + cat.total, 0);
  const surplus = totalPendapatan - totalBelanja;

  const handleSave = () => {
    // TODO: Simpan ke database
    alert("Data APBDES berhasil disimpan!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit APBDES Desa Timbukar
          </h1>
          <p className="text-gray-600">
            Kelola Anggaran Pendapatan dan Belanja Desa
          </p>
        </div>

        {/* Tahun Anggaran */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-semibold">Tahun Anggaran:</label>
            <input
              type="number"
              value={apbdesData.tahunAnggaran}
              onChange={(e) => handleTahunChange(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              📊 Total Pendapatan
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(totalPendapatan)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              💰 Total Belanja
            </h3>
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(totalBelanja)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ✅ Surplus/Defisit
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(surplus)}
            </p>
          </div>
        </div>

        {/* PENDAPATAN Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📈 PENDAPATAN</h2>
          <div className="space-y-4">
            {apbdesData.pendapatan.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
                  <h3 className="text-lg font-bold text-white">
                    {category.category}
                  </h3>
                </div>
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-300">
                          <th className="text-left py-2 font-semibold text-gray-700">
                            Uraian
                          </th>
                          <th className="text-right py-2 font-semibold text-gray-700">
                            Jumlah
                          </th>
                          <th className="text-center py-2 font-semibold text-gray-700">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.items.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-200 hover:bg-gray-50"
                          >
                            <td className="py-3 text-gray-700">
                              {item.description}
                            </td>
                            <td className="py-3 text-right font-semibold text-gray-900">
                              {formatCurrency(item.amount)}
                            </td>
                            <td className="py-3 text-center flex justify-center gap-2">
                              <button
                                onClick={() =>
                                  handleEditItem("pendapatan", category.id, item)
                                }
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteItem("pendapatan", category.id, item.id)
                                }
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="border-t-2 border-gray-300 mt-3 pt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-900">
                      Total {category.category}:
                    </span>
                    <span className="font-bold text-green-600 text-lg">
                      {formatCurrency(category.total)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddItem("pendapatan", category.id)}
                    className="mt-3 w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Tambah Item
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">TOTAL PENDAPATAN</span>
                <span className="text-3xl font-bold">
                  {formatCurrency(totalPendapatan)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* BELANJA Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📉 BELANJA</h2>
          <div className="space-y-4">
            {apbdesData.belanja.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-4">
                  <h3 className="text-lg font-bold text-white">
                    {category.category}
                  </h3>
                </div>
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-300">
                          <th className="text-left py-2 font-semibold text-gray-700">
                            Uraian
                          </th>
                          <th className="text-right py-2 font-semibold text-gray-700">
                            Jumlah
                          </th>
                          <th className="text-center py-2 font-semibold text-gray-700">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.items.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-200 hover:bg-gray-50"
                          >
                            <td className="py-3 text-gray-700">
                              {item.description}
                            </td>
                            <td className="py-3 text-right font-semibold text-gray-900">
                              {formatCurrency(item.amount)}
                            </td>
                            <td className="py-3 text-center flex justify-center gap-2">
                              <button
                                onClick={() =>
                                  handleEditItem("belanja", category.id, item)
                                }
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteItem("belanja", category.id, item.id)
                                }
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="border-t-2 border-gray-300 mt-3 pt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-900">
                      Total {category.category}:
                    </span>
                    <span className="font-bold text-red-600 text-lg">
                      {formatCurrency(category.total)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddItem("belanja", category.id)}
                    className="mt-3 w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Tambah Item
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-white">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">TOTAL BELANJA</span>
                <span className="text-3xl font-bold">
                  {formatCurrency(totalBelanja)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Foto APBDES Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📸 FOTO APBDES</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-4">
              Unggah foto APBDES yang dicetak sebagai baliho atau bukti kegiatan
            </p>

            {/* Upload Area */}
            <div
              onDragOver={handlePhotoDragOver}
              onDragLeave={handlePhotoDragLeave}
              onDrop={handlePhotoDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                isDragging
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Upload className="mx-auto mb-3 text-gray-400" size={32} />
              <p className="text-gray-700 font-semibold mb-2">
                Drag & drop foto di sini
              </p>
              <p className="text-gray-500 text-sm mb-4">atau</p>
              <label className="inline-block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileInputChange}
                  className="hidden"
                />
                <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition cursor-pointer">
                  Pilih File
                </button>
              </label>
            </div>

            {/* Photos Grid */}
            {apbdesData.photos.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Foto yang Diupload ({apbdesData.photos.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {apbdesData.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative bg-gray-100 rounded-lg overflow-hidden group"
                    >
                      <div className="relative w-full h-48">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo}
                          alt={`APBDES Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={18} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                        Foto {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Save Button */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition"
          >
            ✅ Simpan Perubahan
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition"
          >
            Kembali
          </button>
        </div>
      </div>

      {/* Modal Edit/Add Item */}
      {isModalOpen && modalType === "item" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingData?.itemId ? "Edit" : "Tambah"} Item
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Uraian:
                </label>
                <input
                  type="text"
                  value={itemForm.description}
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Masukkan uraian item"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Jumlah (Rp):
                </label>
                <input
                  type="number"
                  value={itemForm.amount}
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      amount: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Masukkan jumlah"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveItem}
                className="flex-1 py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition font-semibold"
              >
                Simpan
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition font-semibold"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
