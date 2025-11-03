"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, CheckCircle, Clock, Eye } from "lucide-react";
import { toast } from "react-toastify";

interface KontakPesan {
  id: number;
  nama: string;
  email: string;
  no_telepon: string | null;
  subjek: string;
  pesan: string;
  status: string;
  created_at: string;
}

export default function AdminKontak() {
  const [pesan, setPesan] = useState<KontakPesan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"semua" | "baru" | "dibaca">("semua");
  const [selectedPesan, setSelectedPesan] = useState<KontakPesan | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch pesan kontak
  const fetchPesan = useCallback(async () => {
    try {
      setLoading(true);
      const url =
        filter === "semua" ? "/api/kontak" : `/api/kontak?status=${filter}`;

      // Get token dari localStorage
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await response.json();

      if (data.success) {
        setPesan(data.data || []);
      } else {
        toast.error("Gagal mengambil data pesan");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchPesan();
  }, [fetchPesan]);

  const handleMarkAsRead = async (id: number) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(`/api/kontak/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ status: "dibaca" }),
      });

      if (response.ok) {
        setPesan(
          pesan.map((p) => (p.id === id ? { ...p, status: "dibaca" } : p))
        );
        toast.success("Status diperbarui");
      }
    } catch (error) {
      toast.error("Gagal memperbarui status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus pesan ini?")) return;

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(`/api/kontak/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        setPesan(pesan.filter((p) => p.id !== id));
        toast.success("Pesan dihapus");
      }
    } catch (error) {
      toast.error("Gagal menghapus pesan");
    }
  };

  const handleViewDetail = (item: KontakPesan) => {
    setSelectedPesan(item);
    setShowDetail(true);
    if (item.status === "baru") {
      handleMarkAsRead(item.id);
    }
  };

  const filteredPesan = pesan.filter(
    (p) =>
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subjek.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const newMessageCount = pesan.filter((p) => p.status === "baru").length;

  return (
    <main className="w-full bg-gray-50 min-h-screen pt-20 md:pt-0">
      <div className="p-3 md:p-8">
        <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-4 md:p-6 rounded-lg md:rounded-2xl">
            <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">
              Pesan Kontak
            </h1>
            <p className="text-xs md:text-base text-emerald-50">
              Kelola pesan yang dikirim melalui form kontak
            </p>
          </div>

          {/* Filter & Search */}
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter("semua")}
                className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-base rounded-lg font-medium transition-colors ${
                  filter === "semua"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilter("baru")}
                className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-base rounded-lg font-medium transition-colors relative ${
                  filter === "baru"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Baru
                {newMessageCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs font-bold">
                    {newMessageCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setFilter("dibaca")}
                className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-base rounded-lg font-medium transition-colors ${
                  filter === "dibaca"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Dibaca
              </button>
            </div>

            <div>
              <input
                type="text"
                placeholder="Cari nama, email, atau subjek..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 md:px-4 py-2 text-sm md:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Message List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-sm md:text-base text-gray-500">
                Memuat pesan...
              </p>
            </div>
          ) : filteredPesan.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 md:p-8 text-center">
              <p className="text-sm md:text-lg text-gray-500">
                Tidak ada pesan
              </p>
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {filteredPesan.map((item) => (
                <div
                  key={item.id}
                  className={`border-l-4 rounded-lg p-3 md:p-4 transition-all hover:shadow-md cursor-pointer ${
                    item.status === "baru"
                      ? "border-l-red-500 bg-red-50"
                      : "border-l-green-500 bg-green-50"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-2 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-xs md:text-base truncate">
                          {item.nama}
                        </h3>
                        {item.status === "baru" && (
                          <span className="inline-block w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 mb-1 truncate">
                        {item.email}
                      </p>
                      <p className="font-semibold text-xs md:text-sm text-gray-800 mb-1 line-clamp-1">
                        {item.subjek}
                      </p>
                      <p className="text-xs md:text-sm text-gray-700 line-clamp-2 mb-1">
                        {item.pesan}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(item.created_at)}
                      </p>
                    </div>

                    <div className="flex gap-1 md:gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleViewDetail(item)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Lihat detail"
                      >
                        <Eye size={16} />
                      </button>
                      {item.status === "baru" && (
                        <button
                          onClick={() => handleMarkAsRead(item.id)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          title="Tandai dibaca"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal Detail */}
          {showDetail && selectedPesan && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
              <div className="bg-white rounded-lg md:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-4 md:p-6 sticky top-0">
                  <h2 className="text-lg md:text-2xl font-bold">
                    {selectedPesan.subjek}
                  </h2>
                  <p className="text-xs md:text-sm text-emerald-50 mt-1">
                    Dari: {selectedPesan.nama} ({selectedPesan.email})
                  </p>
                </div>

                <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                      <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                        Nama
                      </p>
                      <p className="text-xs md:text-sm text-gray-900 font-semibold break-words">
                        {selectedPesan.nama}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                      <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                        Email
                      </p>
                      <p className="text-xs md:text-sm text-gray-900 font-semibold break-all">
                        {selectedPesan.email}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                      <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                        Telepon
                      </p>
                      <p className="text-xs md:text-sm text-gray-900 font-semibold">
                        {selectedPesan.no_telepon || "-"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                      <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                        Tanggal
                      </p>
                      <p className="text-xs md:text-sm text-gray-900 font-semibold">
                        {formatDate(selectedPesan.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Pesan */}
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-gray-900 mb-2 md:mb-3">
                      Isi Pesan
                    </h3>
                    <div className="bg-gray-50 p-3 md:p-4 rounded-lg border-l-4 border-emerald-600">
                      <p className="text-xs md:text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {selectedPesan.pesan}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="bg-blue-50 p-3 md:p-4 rounded-lg border-l-4 border-blue-600">
                    <p className="text-xs md:text-sm text-gray-600 mb-2">
                      Status:
                    </p>
                    <div className="flex items-center gap-2">
                      {selectedPesan.status === "baru" ? (
                        <>
                          <Clock
                            size={16}
                            className="text-yellow-600 flex-shrink-0"
                          />
                          <span className="font-semibold text-xs md:text-sm text-yellow-600">
                            Pesan Baru
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle
                            size={16}
                            className="text-green-600 flex-shrink-0"
                          />
                          <span className="font-semibold text-xs md:text-sm text-green-600">
                            Sudah Dibaca
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col-reverse sm:flex-row gap-2 md:gap-3 pt-3 md:pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowDetail(false)}
                      className="flex-1 bg-gray-300 text-gray-700 px-3 md:px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors text-sm md:text-base"
                    >
                      Tutup
                    </button>
                    {selectedPesan.status === "baru" && (
                      <button
                        onClick={() => {
                          handleMarkAsRead(selectedPesan.id);
                          setShowDetail(false);
                        }}
                        className="flex-1 bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                      >
                        <CheckCircle size={16} />
                        Tandai Dibaca
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleDelete(selectedPesan.id);
                        setShowDetail(false);
                      }}
                      className="flex-1 bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      <Trash2 size={16} />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
