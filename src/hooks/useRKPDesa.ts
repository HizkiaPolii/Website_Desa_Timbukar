import { useCallback, useState } from "react";

interface RKPDesaItem {
  id: number;
  tahun: number;
  judul: string;
  deskripsi: string;
  anggaran: number;
  status: string;
  fileDokumen: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CreateRKPDesaPayload {
  tahun: number;
  judul: string;
  deskripsi?: string;
  anggaran: number;
  status: string;
  fileDokumen?: string;
}

interface UpdateRKPDesaPayload {
  tahun?: number;
  judul?: string;
  deskripsi?: string;
  anggaran?: number;
  status?: string;
  fileDokumen?: string;
}

interface RKPDesaResponse {
  message: string;
  data: RKPDesaItem | RKPDesaItem[];
}

interface RKPDesaError {
  error: string;
  details?: string | Record<string, string>;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const useRKPDesa = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<RKPDesaError | null>(null);

  const getToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }, []);

  const fetchRKPDesaList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/rkpdesa`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData: RKPDesaError = await response.json();
        throw new Error(errorData.error || "Gagal mengambil data");
      }

      const data: RKPDesaResponse = await response.json();
      return Array.isArray(data.data) ? data.data : [data.data];
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setError({ error: errorMessage });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRKPDesaById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/rkpdesa/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData: RKPDesaError = await response.json();
        throw new Error(errorData.error || "Gagal mengambil data");
      }

      const data: RKPDesaResponse = await response.json();
      return Array.isArray(data.data) ? data.data[0] : data.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setError({ error: errorMessage });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRKPDesaByTahun = useCallback(async (tahun: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/rkpdesa/tahun/${tahun}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData: RKPDesaError = await response.json();
        throw new Error(errorData.error || "Gagal mengambil data");
      }

      const data: RKPDesaResponse = await response.json();
      return Array.isArray(data.data) ? data.data : [data.data];
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setError({ error: errorMessage });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRKPDesa = useCallback(
    async (payload: CreateRKPDesaPayload) => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) {
          throw new Error(
            "Token tidak ditemukan. Silakan login terlebih dahulu."
          );
        }

        const response = await fetch(`${API_BASE_URL}/rkpdesa`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData: RKPDesaError = await response.json();
          throw new Error(
            typeof errorData.details === "string"
              ? errorData.details
              : errorData.error || "Gagal menambahkan data"
          );
        }

        const data: RKPDesaResponse = await response.json();
        return Array.isArray(data.data) ? data.data[0] : data.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Terjadi kesalahan";
        setError({ error: errorMessage });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const updateRKPDesa = useCallback(
    async (id: number, payload: UpdateRKPDesaPayload) => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) {
          throw new Error(
            "Token tidak ditemukan. Silakan login terlebih dahulu."
          );
        }

        const response = await fetch(`${API_BASE_URL}/rkpdesa/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData: RKPDesaError = await response.json();
          throw new Error(
            typeof errorData.details === "string"
              ? errorData.details
              : errorData.error || "Gagal memperbarui data"
          );
        }

        const data: RKPDesaResponse = await response.json();
        return Array.isArray(data.data) ? data.data[0] : data.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Terjadi kesalahan";
        setError({ error: errorMessage });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const deleteRKPDesa = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) {
          throw new Error(
            "Token tidak ditemukan. Silakan login terlebih dahulu."
          );
        }

        const response = await fetch(`${API_BASE_URL}/rkpdesa/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData: RKPDesaError = await response.json();
          throw new Error(errorData.error || "Gagal menghapus data");
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Terjadi kesalahan";
        setError({ error: errorMessage });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  return {
    loading,
    error,
    fetchRKPDesaList,
    fetchRKPDesaById,
    fetchRKPDesaByTahun,
    createRKPDesa,
    updateRKPDesa,
    deleteRKPDesa,
  };
};

export type { RKPDesaItem, CreateRKPDesaPayload, UpdateRKPDesaPayload };
