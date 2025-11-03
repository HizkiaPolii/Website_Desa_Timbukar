"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toast";

interface GenderItem {
  id?: number;
  jenis_kelamin: string;
  jumlah: string;
  persentase: string;
}

export default function EditJenisKelaminPage() {
  const [items, setItems] = useState<GenderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://api.desatimbukar.id/api";
      const res = await fetch(`${API_BASE_URL}/data-desa`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      if (json?.data?.gender) setItems(json.data.gender);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data jenis kelamin");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    index: number,
    field: keyof GenderItem,
    value: string
  ) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [field]: value } : it))
    );
  };

  const handleAdd = () =>
    setItems((prev) => [
      ...prev,
      { jenis_kelamin: "", jumlah: "", persentase: "" },
    ]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://api.desatimbukar.id/api";

      // Perbarui setiap item dengan ID-nya
      const promises = items.map((item) => {
        if (!item.id) {
          return Promise.reject(new Error("ID item tidak ditemukan"));
        }

        return fetch(`${API_BASE_URL}/data-desa/${item.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            kategori: "gender",
            jenis_kelamin: item.jenis_kelamin,
            jumlah: parseInt(item.jumlah.replace(/\D/g, "")) || 0,
            persentase: item.persentase,
          }),
        });
      });

      const results = await Promise.all(promises);
      const failedResult = results.find((r) => !r.ok);

      if (failedResult) {
        const errorData = await failedResult.json();
        throw new Error(errorData.error || "Beberapa item gagal disimpan");
      }

      showToast.success("Distribusi jenis kelamin berhasil diperbarui");
      router.push("/admin/data-desa");
    } catch (err) {
      console.error(err);
      const errorMsg = err instanceof Error ? err.message : "Gagal menyimpan";
      setError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Distribusi Jenis Kelamin</h1>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              Tambah Baris
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          {items.map((it, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kelamin
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  value={it.jenis_kelamin}
                  onChange={(e) =>
                    handleChange(idx, "jenis_kelamin", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  value={it.jumlah}
                  onChange={(e) => handleChange(idx, "jumlah", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Persentase
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  value={it.persentase}
                  onChange={(e) =>
                    handleChange(idx, "persentase", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={() => router.push("/admin/data-desa")}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              <Save size={16} /> {saving ? "Menyimpan..." : "Simpan Semua"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
