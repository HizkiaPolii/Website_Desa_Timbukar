"use client";

import { useEffect, useState } from "react";
import {
  Users,
  MapPin,
  Home,
  TrendingUp,
  Baby,
  Heart,
  Save,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StatisticsData {
  populasi: string;
  kepalakeluarga: string;
  luasWilayah: string;
  angkaPertumbuhan: string;
  jumlahBayi: string;
  angkaHarapanHidup: string;
}

interface DemographicsItem {
  kategori: string;
  persentase: string;
  jumlah: string;
}

interface GenderItem {
  jenis: string;
  jumlah: string;
  persentase: string;
}

interface EducationItem {
  tingkat: string;
  jumlah: string;
  persentase: string;
}

interface ReligionItem {
  agama: string;
  jumlah: string;
  persentase: string;
}

interface DataDesaFormData {
  statistics: StatisticsData;
  demographics: DemographicsItem[];
  gender: GenderItem[];
  education: EducationItem[];
  religion: ReligionItem[];
}

export default function DataDesaAdminPage() {
  const [formData, setFormData] = useState<DataDesaFormData>({
    statistics: {
      populasi: "2,500",
      kepalakeluarga: "625",
      luasWilayah: "45.5 km²",
      angkaPertumbuhan: "2.5%",
      jumlahBayi: "180",
      angkaHarapanHidup: "72 Tahun",
    },
    demographics: [
      { kategori: "Usia 0-5 Tahun", persentase: "8%", jumlah: "200" },
      { kategori: "Usia 5-15 Tahun", persentase: "15%", jumlah: "375" },
      { kategori: "Usia 15-65 Tahun", persentase: "68%", jumlah: "1,700" },
      { kategori: "Usia 65+ Tahun", persentase: "9%", jumlah: "225" },
    ],
    gender: [
      { jenis: "Laki-laki", jumlah: "1,275", persentase: "51%" },
      { jenis: "Perempuan", jumlah: "1,225", persentase: "49%" },
    ],
    education: [
      { tingkat: "Tidak Sekolah", jumlah: "125", persentase: "5%" },
      { tingkat: "SD/Sederajat", jumlah: "625", persentase: "25%" },
      { tingkat: "SMP/Sederajat", jumlah: "750", persentase: "30%" },
      { tingkat: "SMA/Sederajat", jumlah: "700", persentase: "28%" },
      { tingkat: "D1/D2/D3", jumlah: "150", persentase: "6%" },
      { tingkat: "S1/S2/S3", jumlah: "175", persentase: "7%" },
    ],
    religion: [
      { agama: "Islam", jumlah: "2,000", persentase: "80%" },
      { agama: "Kristen", jumlah: "300", persentase: "12%" },
      { agama: "Katolik", jumlah: "100", persentase: "4%" },
      { agama: "Hindu", jumlah: "50", persentase: "2%" },
      { agama: "Buddha", jumlah: "30", persentase: "1.2%" },
      { agama: "Lainnya", jumlah: "20", persentase: "0.8%" },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/data-desa");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setFormData(data);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Gagal memuat data. Menggunakan data default.");
      // Tetap gunakan data default yang sudah ada
    } finally {
      setLoading(false);
    }
  };

  const handleStatisticsChange = (
    field: keyof StatisticsData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        [field]: value,
      },
    }));
  };

  const handleDemographicsChange = (
    index: number,
    field: keyof DemographicsItem,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      demographics: prev.demographics.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleGenderChange = (
    index: number,
    field: keyof GenderItem,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      gender: prev.gender.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleEducationChange = (
    index: number,
    field: keyof EducationItem,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleReligionChange = (
    index: number,
    field: keyof ReligionItem,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      religion: prev.religion.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Simpan data via API
      const response = await fetch("/api/data-desa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save");

      setSuccess("Data berhasil disimpan");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving data:", err);
      setError("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Yakin ingin mereset data ke nilai awal?")) {
      loadData();
    }
  };

  // Helper function to convert data for charts
  const convertGenderData = () => {
    return formData.gender.map((item) => ({
      ...item,
      jumlah: parseInt(item.jumlah.replace(/\D/g, "")) || 0,
    }));
  };

  const convertReligionData = () => {
    return formData.religion.map((item) => ({
      ...item,
      jumlah: parseInt(item.jumlah.replace(/\D/g, "")) || 0,
    }));
  };

  const convertEducationData = () => {
    return formData.education.map((item) => ({
      ...item,
      jumlah: parseInt(item.jumlah.replace(/\D/g, "")) || 0,
    }));
  };

  const convertDemographicsData = () => {
    return formData.demographics.map((item) => ({
      ...item,
      jumlah: parseInt(item.jumlah.replace(/\D/g, "")) || 0,
    }));
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Edit Data Desa
        </h1>
        <p className="text-gray-600">
          Kelola dan perbarui statistik serta data demografis Desa Timbukar
        </p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <X size={20} />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess("")}>
            <X size={20} />
          </button>
        </div>
      )}

      {/* Statistics Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Statistik Utama
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(formData.statistics).map(([key, value]) => {
            const labels: Record<string, string> = {
              populasi: "Jumlah Penduduk",
              kepalakeluarga: "Kepala Keluarga",
              luasWilayah: "Luas Wilayah",
              angkaPertumbuhan: "Angka Pertumbuhan",
              jumlahBayi: "Jumlah Bayi",
              angkaHarapanHidup: "Angka Harapan Hidup",
            };

            return (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {labels[key]}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    handleStatisticsChange(
                      key as keyof StatisticsData,
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Demographics Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Distribusi Usia (Demografi)
        </h2>
        <div className="space-y-6">
          {formData.demographics.map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori Usia
                  </label>
                  <input
                    type="text"
                    value={item.kategori}
                    onChange={(e) =>
                      handleDemographicsChange(
                        index,
                        "kategori",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah
                  </label>
                  <input
                    type="text"
                    value={item.jumlah}
                    onChange={(e) =>
                      handleDemographicsChange(index, "jumlah", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Persentase
                  </label>
                  <input
                    type="text"
                    value={item.persentase}
                    onChange={(e) =>
                      handleDemographicsChange(
                        index,
                        "persentase",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gender Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Distribusi Jenis Kelamin
        </h2>
        <div className="space-y-6">
          {formData.gender.map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Kelamin
                  </label>
                  <input
                    type="text"
                    value={item.jenis}
                    onChange={(e) =>
                      handleGenderChange(index, "jenis", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah
                  </label>
                  <input
                    type="text"
                    value={item.jumlah}
                    onChange={(e) =>
                      handleGenderChange(index, "jumlah", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Persentase
                  </label>
                  <input
                    type="text"
                    value={item.persentase}
                    onChange={(e) =>
                      handleGenderChange(index, "persentase", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Distribusi Pendidikan
        </h2>
        <div className="space-y-6">
          {formData.education.map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tingkat Pendidikan
                  </label>
                  <input
                    type="text"
                    value={item.tingkat}
                    onChange={(e) =>
                      handleEducationChange(index, "tingkat", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah
                  </label>
                  <input
                    type="text"
                    value={item.jumlah}
                    onChange={(e) =>
                      handleEducationChange(index, "jumlah", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Persentase
                  </label>
                  <input
                    type="text"
                    value={item.persentase}
                    onChange={(e) =>
                      handleEducationChange(index, "persentase", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Religion Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Distribusi Agama
        </h2>
        <div className="space-y-6">
          {formData.religion.map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agama
                  </label>
                  <input
                    type="text"
                    value={item.agama}
                    onChange={(e) =>
                      handleReligionChange(index, "agama", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah
                  </label>
                  <input
                    type="text"
                    value={item.jumlah}
                    onChange={(e) =>
                      handleReligionChange(index, "jumlah", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Persentase
                  </label>
                  <input
                    type="text"
                    value={item.persentase}
                    onChange={(e) =>
                      handleReligionChange(index, "persentase", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8 sticky top-0 bg-white p-6 rounded-lg shadow-md z-10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} />
          {saving ? "Menyimpan..." : "Simpan Data"}
        </button>
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Presentasi Data Desa Timbukar
          </h2>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-semibold mb-1">
                    Jumlah Penduduk
                  </p>
                  <p className="text-3xl font-bold">
                    {formData.statistics.populasi}
                  </p>
                </div>
                <Users size={40} className="opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-semibold mb-1">
                    Kepala Keluarga
                  </p>
                  <p className="text-3xl font-bold">
                    {formData.statistics.kepalakeluarga}
                  </p>
                </div>
                <Home size={40} className="opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-semibold mb-1">
                    Luas Wilayah
                  </p>
                  <p className="text-3xl font-bold">
                    {formData.statistics.luasWilayah}
                  </p>
                </div>
                <MapPin size={40} className="opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-lg text-white shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-semibold mb-1">
                    Angka Pertumbuhan
                  </p>
                  <p className="text-3xl font-bold">
                    {formData.statistics.angkaPertumbuhan}
                  </p>
                </div>
                <TrendingUp size={40} className="opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-6 rounded-lg text-white shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-semibold mb-1">
                    Jumlah Bayi
                  </p>
                  <p className="text-3xl font-bold">
                    {formData.statistics.jumlahBayi}
                  </p>
                </div>
                <Baby size={40} className="opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg text-white shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-semibold mb-1">
                    Angka Harapan Hidup
                  </p>
                  <p className="text-3xl font-bold">
                    {formData.statistics.angkaHarapanHidup}
                  </p>
                </div>
                <Heart size={40} className="opacity-80" />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Demographics Chart */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Distribusi Usia (Demografi)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={convertDemographicsData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="kategori"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="jumlah" fill="#3b82f6" name="Jumlah" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {formData.demographics.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.kategori}</span>
                    <span className="font-semibold">
                      {item.persentase} ({item.jumlah})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender Chart */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Distribusi Jenis Kelamin
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={convertGenderData()}
                    dataKey="jumlah"
                    nameKey="jenis"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#f43f5e" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {formData.gender.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.jenis}</span>
                    <span className="font-semibold">
                      {item.persentase} ({item.jumlah})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Chart */}
            <div className="bg-gray-50 p-6 rounded-lg lg:col-span-1">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Distribusi Pendidikan
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={convertEducationData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="tingkat"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="jumlah" fill="#10b981" name="Jumlah" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-1 text-sm">
                {formData.education.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-gray-600">{item.tingkat}</span>
                    <span className="font-semibold">{item.persentase}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Religion Chart */}
            <div className="bg-gray-50 p-6 rounded-lg lg:col-span-1">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Distribusi Agama
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={convertReligionData()}
                    dataKey="jumlah"
                    nameKey="agama"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    <Cell fill="#f59e0b" />
                    <Cell fill="#8b5cf6" />
                    <Cell fill="#06b6d4" />
                    <Cell fill="#ec4899" />
                    <Cell fill="#14b8a6" />
                    <Cell fill="#f97316" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-1 text-sm">
                {formData.religion.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-gray-600">{item.agama}</span>
                    <span className="font-semibold">
                      {item.persentase} ({item.jumlah})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons Bottom */}
    </div>
  );
}
