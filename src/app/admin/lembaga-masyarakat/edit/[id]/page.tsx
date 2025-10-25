"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Lembaga {
  id: string;
  nama: string;
  pengertian: string;
  fungsi: string[];
  tugas: string[];
  wewenang: string[];
  susunanKeanggotaan: string;
  masaJabatan: string;
  prinsipKerja: {
    musyawarah: string;
    transparan: string;
    akuntabel: string;
    demokratis: string;
  };
}

export default function EditLembagaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState<Lembaga>({
    id: "",
    nama: "",
    pengertian: "",
    fungsi: [],
    tugas: [],
    wewenang: [],
    susunanKeanggotaan: "",
    masaJabatan: "",
    prinsipKerja: {
      musyawarah: "",
      transparan: "",
      akuntabel: "",
      demokratis: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchLembaga = async () => {
      try {
        const response = await fetch(`/api/lembaga-masyarakat?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError("Gagal memuat data lembaga");
      } finally {
        setLoading(false);
      }
    };

    fetchLembaga();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrinsipChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      prinsipKerja: {
        ...prev.prinsipKerja,
        [key]: value,
      },
    }));
  };

  const handleArrayChange = (
    field: "fungsi" | "tugas" | "wewenang",
    index: number,
    value: string
  ) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const addArrayItem = (field: "fungsi" | "tugas" | "wewenang") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (
    field: "fungsi" | "tugas" | "wewenang",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/lembaga-masyarakat?id=${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update");

      setSuccess("Data lembaga berhasil diperbarui!");
      setTimeout(() => {
        router.push("/admin/lembaga-masyarakat");
      }, 1500);
    } catch (err) {
      setError("Gagal menyimpan data lembaga");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/lembaga-masyarakat"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Lembaga Masyarakat
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded shadow-lg p-6">
        {/* Nama Lembaga */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Lembaga
          </label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Pengertian */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pengertian
          </label>
          <textarea
            name="pengertian"
            value={formData.pengertian}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Fungsi */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fungsi
          </label>
          <div className="space-y-2">
            {formData.fungsi.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayChange("fungsi", index, e.target.value)
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("fungsi", index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
                >
                  Hapus
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("fungsi")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              + Tambah Fungsi
            </button>
          </div>
        </div>

        {/* Tugas */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tugas
          </label>
          <div className="space-y-2">
            {formData.tugas.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayChange("tugas", index, e.target.value)
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("tugas", index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
                >
                  Hapus
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("tugas")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              + Tambah Tugas
            </button>
          </div>
        </div>

        {/* Wewenang */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Wewenang
          </label>
          <div className="space-y-2">
            {formData.wewenang.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayChange("wewenang", index, e.target.value)
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("wewenang", index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
                >
                  Hapus
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("wewenang")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              + Tambah Wewenang
            </button>
          </div>
        </div>

        {/* Susunan Keanggotaan */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Susunan Keanggotaan
          </label>
          <textarea
            name="susunanKeanggotaan"
            value={formData.susunanKeanggotaan}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Masa Jabatan */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Masa Jabatan
          </label>
          <textarea
            name="masaJabatan"
            value={formData.masaJabatan}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Prinsip Kerja */}
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Prinsip Kerja
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Musyawarah
              </label>
              <textarea
                value={formData.prinsipKerja.musyawarah}
                onChange={(e) =>
                  handlePrinsipChange("musyawarah", e.target.value)
                }
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Transparan
              </label>
              <textarea
                value={formData.prinsipKerja.transparan}
                onChange={(e) =>
                  handlePrinsipChange("transparan", e.target.value)
                }
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Akuntabel
              </label>
              <textarea
                value={formData.prinsipKerja.akuntabel}
                onChange={(e) =>
                  handlePrinsipChange("akuntabel", e.target.value)
                }
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Demokratis
              </label>
              <textarea
                value={formData.prinsipKerja.demokratis}
                onChange={(e) =>
                  handlePrinsipChange("demokratis", e.target.value)
                }
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded font-semibold"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <Link
            href="/admin/lembaga-masyarakat"
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded font-semibold"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
