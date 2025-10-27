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
import Link from "next/link";
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
import { showToast } from "@/utils/toast";

interface StatisticsData {
  populasi: string;
  kepala_keluarga: string;
  luas_wilayah: string;
  angka_pertumbuhan: string;
  jumlah_bayi: string;
  angka_harapan_hidup: string;
}

interface DemographicsItem {
  kategori_usia: string;
  persentase: string;
  jumlah: string;
}

interface GenderItem {
  jenis_kelamin: string;
  jumlah: string;
  persentase: string;
}

interface EducationItem {
  tingkat_pendidikan: string;
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
      kepala_keluarga: "625",
      luas_wilayah: "45.5 km²",
      angka_pertumbuhan: "2.5%",
      jumlah_bayi: "180",
      angka_harapan_hidup: "72 Tahun",
    },
    demographics: [
      { kategori_usia: "Usia 0-5 Tahun", persentase: "8%", jumlah: "200" },
      { kategori_usia: "Usia 5-15 Tahun", persentase: "15%", jumlah: "375" },
      { kategori_usia: "Usia 15-65 Tahun", persentase: "68%", jumlah: "1,700" },
      { kategori_usia: "Usia 65+ Tahun", persentase: "9%", jumlah: "225" },
    ],
    gender: [
      { jenis_kelamin: "Laki-laki", jumlah: "1,275", persentase: "51%" },
      { jenis_kelamin: "Perempuan", jumlah: "1,225", persentase: "49%" },
    ],
    education: [
      { tingkat_pendidikan: "Tidak Sekolah", jumlah: "125", persentase: "5%" },
      { tingkat_pendidikan: "SD/Sederajat", jumlah: "625", persentase: "25%" },
      { tingkat_pendidikan: "SMP/Sederajat", jumlah: "750", persentase: "30%" },
      { tingkat_pendidikan: "SMA/Sederajat", jumlah: "700", persentase: "28%" },
      { tingkat_pendidikan: "D1/D2/D3", jumlah: "150", persentase: "6%" },
      { tingkat_pendidikan: "S1/S2/S3", jumlah: "175", persentase: "7%" },
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
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${API_BASE_URL}/data-desa`);
      if (!response.ok) throw new Error("Failed to fetch");
      const result = await response.json();

      // Backend sudah transform data sesuai format frontend
      // Gunakan data langsung dari API seperti di homepage
      const mappedData: DataDesaFormData = {
        statistics: result.data.statistics,
        demographics: result.data.demographics,
        gender: result.data.gender,
        education: result.data.education,
        religion: result.data.religion,
      };

      setFormData(mappedData);
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

      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      // Simpan setiap kategori dengan individual POST calls
      // Format: POST /data-desa dengan { kategori: "...", ...data }

      const savePromises = [];

      // Save Statistics (single record)
      savePromises.push(
        fetch(`${API_BASE_URL}/data-desa`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kategori: "statistics",
            populasi: formData.statistics.populasi,
            kepala_keluarga: formData.statistics.kepala_keluarga,
            luas_wilayah: formData.statistics.luas_wilayah,
            angka_pertumbuhan: formData.statistics.angka_pertumbuhan,
            jumlah_bayi: formData.statistics.jumlah_bayi,
            angka_harapan_hidup: formData.statistics.angka_harapan_hidup,
          }),
        })
      );

      // Save Demographics
      formData.demographics.forEach((item) => {
        savePromises.push(
          fetch(`${API_BASE_URL}/data-desa`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kategori: "demographics",
              kategori_usia: item.kategori_usia,
              jumlah: parseInt(item.jumlah.replace(/\D/g, "")) || 0,
              persentase: item.persentase,
            }),
          })
        );
      });

      // Save Gender
      formData.gender.forEach((item) => {
        savePromises.push(
          fetch(`${API_BASE_URL}/data-desa`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kategori: "gender",
              jenis_kelamin: item.jenis_kelamin,
              jumlah: parseInt(item.jumlah.replace(/\D/g, "")) || 0,
              persentase: item.persentase,
            }),
          })
        );
      });

      // Save Education
      formData.education.forEach((item) => {
        savePromises.push(
          fetch(`${API_BASE_URL}/data-desa`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kategori: "education",
              tingkat_pendidikan: item.tingkat_pendidikan,
              jumlah: parseInt(item.jumlah.replace(/\D/g, "")) || 0,
              persentase: item.persentase,
            }),
          })
        );
      });

      // Save Religion
      formData.religion.forEach((item) => {
        savePromises.push(
          fetch(`${API_BASE_URL}/data-desa`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kategori: "religion",
              agama: item.agama,
              jumlah: parseInt(item.jumlah.replace(/\D/g, "")) || 0,
              persentase: item.persentase,
            }),
          })
        );
      });

      // Wait semua requests
      const responses = await Promise.all(savePromises);

      // Check if any failed
      const failedResponses = responses.filter((r) => !r.ok);
      if (failedResponses.length > 0) {
        throw new Error(
          `${failedResponses.length} data gagal disimpan. Status: ${failedResponses[0].status}`
        );
      }

      setSuccess("Data berhasil disimpan");
      showToast.success("Data desa berhasil diperbarui!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving data:", err);
      setError(err instanceof Error ? err.message : "Gagal menyimpan data");
      showToast.error(
        err instanceof Error ? err.message : "Gagal menyimpan data"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    showToast.confirm(
      "Yakin ingin mereset data ke nilai awal?",
      () => {
        loadData();
        showToast.success("Data berhasil direset!");
      },
      { title: "Konfirmasi Reset", confirmText: "Reset", cancelText: "Batal" }
    );
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Statistik Utama</h2>
          <Link
            href="/admin/data-desa/edit-statistik-utama"
            className="text-sm px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit Statistik Utama
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4">Nama Statistik</th>
                <th className="text-left py-3 px-4">Nilai</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Jumlah Penduduk</td>
                <td className="py-3 px-4">{formData.statistics.populasi}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Kepala Keluarga</td>
                <td className="py-3 px-4">
                  {formData.statistics.kepala_keluarga}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Luas Wilayah</td>
                <td className="py-3 px-4">
                  {formData.statistics.luas_wilayah}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Angka Pertumbuhan</td>
                <td className="py-3 px-4">
                  {formData.statistics.angka_pertumbuhan}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Jumlah Bayi</td>
                <td className="py-3 px-4">{formData.statistics.jumlah_bayi}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Angka Harapan Hidup</td>
                <td className="py-3 px-4">
                  {formData.statistics.angka_harapan_hidup}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Demographics Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Distribusi Usia (Demografi)
          </h2>
          <Link
            href="/admin/data-desa/edit-distribusi-usia"
            className="text-sm px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit Distribusi Usia
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4">Kategori Usia</th>
                <th className="text-left py-3 px-4">Jumlah</th>
                <th className="text-left py-3 px-4">Persentase</th>
              </tr>
            </thead>
            <tbody>
              {formData.demographics.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">{item.kategori_usia}</td>
                  <td className="py-3 px-4">{item.jumlah}</td>
                  <td className="py-3 px-4">{item.persentase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gender Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Distribusi Jenis Kelamin
          </h2>
          <Link
            href="/admin/data-desa/edit-jenis-kelamin"
            className="text-sm px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit Jenis Kelamin
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4">Jenis Kelamin</th>
                <th className="text-left py-3 px-4">Jumlah</th>
                <th className="text-left py-3 px-4">Persentase</th>
              </tr>
            </thead>
            <tbody>
              {formData.gender.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">{item.jenis_kelamin}</td>
                  <td className="py-3 px-4">{item.jumlah}</td>
                  <td className="py-3 px-4">{item.persentase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Education Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Distribusi Pendidikan
          </h2>
          <Link
            href="/admin/data-desa/edit-pendidikan"
            className="text-sm px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit Pendidikan
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4">Tingkat Pendidikan</th>
                <th className="text-left py-3 px-4">Jumlah</th>
                <th className="text-left py-3 px-4">Persentase</th>
              </tr>
            </thead>
            <tbody>
              {formData.education.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">{item.tingkat_pendidikan}</td>
                  <td className="py-3 px-4">{item.jumlah}</td>
                  <td className="py-3 px-4">{item.persentase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Religion Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Distribusi Agama</h2>
          <Link
            href="/admin/data-desa/edit-agama"
            className="text-sm px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit Agama
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4">Agama</th>
                <th className="text-left py-3 px-4">Jumlah</th>
                <th className="text-left py-3 px-4">Persentase</th>
              </tr>
            </thead>
            <tbody>
              {formData.religion.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">{item.agama}</td>
                  <td className="py-3 px-4">{item.jumlah}</td>
                  <td className="py-3 px-4">{item.persentase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                    {formData.statistics.kepala_keluarga}
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
                    {formData.statistics.luas_wilayah}
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
                    {formData.statistics.angka_pertumbuhan}
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
                    {formData.statistics.jumlah_bayi}
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
                    {formData.statistics.angka_harapan_hidup}
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
                    <span className="text-gray-600">{item.kategori_usia}</span>
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
                    <span className="text-gray-600">{item.jenis_kelamin}</span>
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
                    <span className="text-gray-600">
                      {item.tingkat_pendidikan}
                    </span>
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
