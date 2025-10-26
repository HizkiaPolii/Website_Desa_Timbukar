const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface Pegawai {
  id: number;
  nama: string;
  jabatan: string;
  nip: string;
  noTelepon: string;
  alamat: string;
  foto: string | null;
  kategori: "pemimpin_desa" | "perangkat_desa" | "perangkat_penunjang";
  createdAt: string;
  updatedAt: string;
}

export interface Posisi {
  nama: string;
  jabatan: string;
  foto: string;
  kontak: string;
  tugas?: string;
}

export interface Level {
  level: string;
  posisi: Posisi[];
}

export interface Bidang {
  nama: string;
  deskripsi: string;
  icon: string;
}

export interface PemerintahanData {
  struktur: Level[];
  bidang: Bidang[];
}

/**
 * Get token dari localStorage
 */
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/**
 * Generic API call function
 */
async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Fallback ke default error message
      }

      if (response.status === 401) {
        // Clear token jika session expired
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          // Redirect ke login
          window.location.href = "/login";
        }
        errorMessage = "Sesi Anda telah berakhir. Silakan login kembali.";
      }

      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Gagal berkomunikasi dengan server");
  }
}

class PemerintahanDesaService {
  /**
   * Get all pemerintahan/pegawai data
   */
  async getAllPemerintahan(): Promise<Pegawai[]> {
    try {
      const response = await apiCall<{ data: Pegawai[] }>("/pemerintahan");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching pemerintahan data:", error);
      throw error;
    }
  }

  /**
   * Get pemerintahan data by ID
   */
  async getPemerintahanById(id: number): Promise<Pegawai> {
    try {
      const response = await apiCall<{ data: Pegawai }>(`/pemerintahan/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching pemerintahan by id:", error);
      throw error;
    }
  }

  /**
   * Create new pemerintahan data
   */
  async createPemerintahan(
    data: Omit<Pegawai, "id" | "createdAt" | "updatedAt">
  ): Promise<Pegawai> {
    try {
      const response = await apiCall<{ data: Pegawai }>("/pemerintahan", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response.data;
    } catch (error) {
      console.error("Error creating pemerintahan:", error);
      throw error;
    }
  }

  /**
   * Update pemerintahan data
   */
  async updatePemerintahan(
    id: number,
    data: Partial<Omit<Pegawai, "id" | "createdAt" | "updatedAt">>
  ): Promise<Pegawai> {
    try {
      const response = await apiCall<{ data: Pegawai }>(`/pemerintahan/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return response.data;
    } catch (error) {
      console.error("Error updating pemerintahan:", error);
      throw error;
    }
  }

  /**
   * Delete pemerintahan data
   */
  async deletePemerintahan(id: number): Promise<void> {
    try {
      await apiCall(`/pemerintahan/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting pemerintahan:", error);
      throw error;
    }
  }

  /**
   * Format pemerintahan data untuk struktur organisasi
   * Mengelompokkan berdasarkan jabatan
   */
  formatToStruktur(pegawaiList: Pegawai[]): PemerintahanData {
    // Grouping by jabatan (organizational structure)
    const strukturMap = new Map<string, Posisi[]>();

    pegawaiList.forEach((pegawai) => {
      const posisi: Posisi = {
        nama: pegawai.nama,
        jabatan: pegawai.jabatan,
        foto: pegawai.foto || "/images/placeholder.svg",
        kontak: pegawai.noTelepon,
        tugas: "",
      };

      if (!strukturMap.has(pegawai.jabatan)) {
        strukturMap.set(pegawai.jabatan, []);
      }
      strukturMap.get(pegawai.jabatan)!.push(posisi);
    });

    const struktur: Level[] = Array.from(strukturMap.entries()).map(
      ([level, posisi]) => ({
        level,
        posisi,
      })
    );

    // Default bidang-bidang pemerintahan
    const bidang: Bidang[] = [
      {
        nama: "Pembangunan",
        deskripsi: "Bidang pembangunan infrastruktur desa",
        icon: "🏗️",
      },
      {
        nama: "Pendidikan",
        deskripsi: "Bidang pendidikan dan pelatihan masyarakat",
        icon: "📚",
      },
      {
        nama: "Kesehatan",
        deskripsi: "Bidang kesehatan dan kesejahteraan masyarakat",
        icon: "⚕️",
      },
      {
        nama: "Pertanian",
        deskripsi: "Bidang pertanian dan perikanan",
        icon: "🌾",
      },
    ];

    return { struktur, bidang };
  }

  /**
   * Get formatted pemerintahan display data
   */
  async getPemerintahanDisplay(): Promise<PemerintahanData> {
    try {
      const pegawaiList = await this.getAllPemerintahan();
      return this.formatToStruktur(pegawaiList);
    } catch (error) {
      console.error("Error getting pemerintahan display:", error);
      return { struktur: [], bidang: [] };
    }
  }
}

export const pemerintahanDesaService = new PemerintahanDesaService();
