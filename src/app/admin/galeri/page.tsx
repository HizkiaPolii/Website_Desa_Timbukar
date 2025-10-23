"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, X, Upload } from "lucide-react";

interface GaleriItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  date: string;
}

export default function AdminGaleriPage() {
  const [galeriData, setGaleriData] = useState<GaleriItem[]>([
    {
      id: 1,
      title: "Air Terjun 3 Tingkat",
      category: "wisata",
      description: "Keindahan air terjun bertingkat di Desa Timbukar",
      image: "/images/placeholder.svg",
      date: "2025-01-15",
    },
    {
      id: 2,
      title: "Homestay Timbukar",
      category: "wisata",
      description: "Penginapan nyaman dengan pemandangan alam asri",
      image: "/images/placeholder.svg",
      date: "2025-01-14",
    },
    {
      id: 3,
      title: "Arung Jeram Sungai Timbukar",
      category: "wisata",
      description: "Petualangan seru di sungai dengan pemandangan indah",
      image: "/images/placeholder.svg",
      date: "2025-01-13",
    },
    {
      id: 4,
      title: "Acara Gotong Royong",
      category: "acara",
      description:
        "Kebersamaan masyarakat dalam kegiatan pembersihan jalan desa",
      image: "/images/placeholder.svg",
      date: "2025-01-12",
    },
    {
      id: 5,
      title: "Pelatihan UMKM",
      category: "kegiatan",
      description: "Program pemberdayaan usaha kecil menengah desa",
      image: "/images/placeholder.svg",
      date: "2025-01-11",
    },
    {
      id: 6,
      title: "Pembangunan Jalan",
      category: "infrastruktur",
      description: "Progres pembangunan infrastruktur jalan desa",
      image: "/images/placeholder.svg",
      date: "2025-01-10",
    },
    {
      id: 7,
      title: "Perayaan HUT Desa",
      category: "acara",
      description: "Meriah perayaan hari ulang tahun Desa Timbukar",
      image: "/images/placeholder.svg",
      date: "2025-01-09",
    },
    {
      id: 8,
      title: "Pemeliharaan Jembatan",
      category: "infrastruktur",
      description: "Tim maintenance melakukan perbaikan jembatan desa",
      image: "/images/placeholder.svg",
      date: "2025-01-08",
    },
    {
      id: 9,
      title: "Pelatihan Pariwisata",
      category: "kegiatan",
      description: "Sosialisasi pengembangan desa wisata untuk masyarakat",
      image: "/images/placeholder.svg",
      date: "2025-01-07",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Omit<GaleriItem, "id">>({
    title: "",
    category: "wisata",
    description: "",
    image: "/images/placeholder.svg",
    date: new Date().toISOString().split("T")[0],
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const categories = [
    { id: "wisata", label: "Wisata", icon: "🏞️" },
    { id: "acara", label: "Acara", icon: "🎉" },
    { id: "kegiatan", label: "Kegiatan", icon: "🤝" },
    { id: "infrastruktur", label: "Infrastruktur", icon: "🏗️" },
    { id: "kkt", label: "KKT", icon: "🎓" },
  ];

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData({
          ...formData,
          image: result,
        });
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Silakan pilih file gambar (JPG, PNG, GIF, WebP)");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleOpenModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setImagePreview(null);
    setFormData({
      title: "",
      category: "wisata",
      description: "",
      image: "/images/placeholder.svg",
      date: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleEditItem = (item: GaleriItem) => {
    setIsEditing(true);
    setEditingId(item.id);
    setImagePreview(item.image);
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description,
      image: item.image,
      date: item.date,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setImagePreview(null);
    setFormData({
      title: "",
      category: "wisata",
      description: "",
      image: "/images/placeholder.svg",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && editingId !== null) {
      // Update item
      setGaleriData(
        galeriData.map((item) =>
          item.id === editingId ? { ...item, ...formData } : item
        )
      );
      alert("Galeri berhasil diperbarui!");
    } else {
      // Add new item
      const newItem: GaleriItem = {
        id: Math.max(...galeriData.map((item) => item.id), 0) + 1,
        ...formData,
      };
      setGaleriData([newItem, ...galeriData]);
      alert("Galeri baru berhasil ditambahkan!");
    }

    handleCloseModal();
  };

  const handleDeleteItem = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus galeri ini?")) {
      setGaleriData(galeriData.filter((item) => item.id !== id));
      alert("Galeri berhasil dihapus!");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Kelola Galeri Desa
        </h1>
        <p className="text-gray-600">
          Tambahkan, ubah, atau hapus foto galeri Desa Timbukar
        </p>
      </div>

      {/* Action Button */}
      <div className="mb-8">
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <Plus size={20} />
          Tambah Galeri Baru
        </button>
      </div>

      {/* Galeri Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Gambar
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Judul
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Deskripsi
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {galeriData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 truncate">
                      {item.title}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      {categories.find((c) => c.id === item.category)?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600 truncate text-sm">
                      {item.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(item.date).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
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

        {galeriData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Tidak ada galeri saat ini</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing ? "Edit Galeri" : "Tambah Galeri Baru"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Judul *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Masukkan judul galeri"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Kategori *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Deskripsi *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Masukkan deskripsi galeri"
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Gambar *
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative w-full border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                    isDragging
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Drag and drop or click to select"
                  />
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Upload
                      size={40}
                      className={`${
                        isDragging
                          ? "text-emerald-600"
                          : "text-gray-400"
                      }`}
                    />
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        Drag gambar ke sini
                      </p>
                      <p className="text-sm text-gray-600">
                        atau klik untuk memilih file dari komputer
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Format: JPG, PNG, GIF, WebP (Max: 5MB)
                    </p>
                  </div>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600 font-semibold">
                        Preview Gambar:
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData({
                            ...formData,
                            image: "/images/placeholder.svg",
                          });
                        }}
                        className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                      >
                        Hapus Gambar
                      </button>
                    </div>
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tanggal *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {isEditing ? "Perbarui" : "Tambahkan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
