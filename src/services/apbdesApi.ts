// APBDES API Service
// Dokumentasi: Backend Express + PostgreSQL
// Update API_BASE_URL sesuai dengan lokasi backend Anda

export interface ApbdesData {
  id: number;
  tahun: number;
  keterangan: string;
  pendapatan: number | string;
  belanja: number | string;
  pembiayaan: number | string;
  file_dokumen: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateApbdesInput {
  tahun: number;
  keterangan: string;
  pendapatan: number | string;
  belanja: number | string;
  pembiayaan: number | string;
  file_dokumen?: string;
}

export interface UpdateApbdesInput {
  tahun?: number;
  keterangan?: string;
  pendapatan?: number | string;
  belanja?: number | string;
  pembiayaan?: number | string;
  file_dokumen?: string;
}

/**
 * API Base URL Configuration
 *
 * Ubah sesuai dengan lokasi backend Anda di .env.local:
 * NEXT_PUBLIC_API_URL=http://localhost:5000/api
 *
 * Maka API_BASE_URL akan menjadi: http://localhost:5000/api/apbdes
 */
const getApiBaseUrl = (): string => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  return `${baseUrl}/apbdes`;
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Get auth token from localStorage
 */
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || null;
  }
  return null;
};

/**
 * Fetch dengan auth header
 */
const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

export const apbdesApi = {
  /**
   * Ambil semua data APBDES dari backend
   */
  async getAll(): Promise<ApbdesData[]> {
    try {
      console.log("🔄 Fetching: GET", API_BASE_URL);
      const response = await fetchWithAuth(API_BASE_URL);

      if (!response.ok) {
        console.warn(`⚠️ Response: ${response.status}`, response.statusText);
        if (response.status === 404) {
          console.warn("Database kosong atau endpoint tidak ditemukan");
          return [];
        }
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("✅ Response:", result);
      return result.data || [];
    } catch (error) {
      console.error("❌ Error fetching all APBDES:", error);
      return [];
    }
  },

  /**
   * Ambil APBDES berdasarkan ID
   */
  async getById(id: number): Promise<ApbdesData | null> {
    try {
      console.log("🔄 Fetching: GET", `${API_BASE_URL}/${id}`);
      const response = await fetchWithAuth(`${API_BASE_URL}/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`APBDES ID ${id} tidak ditemukan`);
          return null;
        }
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("✅ Response:", result);
      return result.data || null;
    } catch (error) {
      console.error(`❌ Error fetching APBDES by ID ${id}:`, error);
      return null;
    }
  },

  /**
   * Ambil APBDES berdasarkan tahun
   */
  async getByTahun(tahun: number): Promise<ApbdesData | null> {
    try {
      console.log("🔄 Fetching: GET", `${API_BASE_URL}/tahun/${tahun}`);
      const response = await fetchWithAuth(`${API_BASE_URL}/tahun/${tahun}`);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`APBDES tahun ${tahun} tidak ditemukan`);
          return null;
        }
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("✅ Response:", result);
      return result.data || null;
    } catch (error) {
      console.error(`❌ Error fetching APBDES by tahun ${tahun}:`, error);
      return null;
    }
  },

  /**
   * Buat APBDES baru (Admin only)
   */
  async create(input: CreateApbdesInput): Promise<ApbdesData> {
    try {
      console.log("🔄 Creating: POST", API_BASE_URL, input);
      const response = await fetchWithAuth(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Error response:", errorData);
        throw new Error(
          errorData.error || `Failed to create: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("✅ Created:", result);
      return result.data;
    } catch (error) {
      console.error("❌ Error creating APBDES:", error);
      throw error;
    }
  },

  /**
   * Update APBDES (Admin only)
   */
  async update(id: number, input: UpdateApbdesInput): Promise<ApbdesData> {
    try {
      console.log("🔄 Updating: PUT", `${API_BASE_URL}/${id}`, input);
      const response = await fetchWithAuth(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Error response:", errorData);
        throw new Error(
          errorData.error || `Failed to update: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("✅ Updated:", result);
      return result.data;
    } catch (error) {
      console.error(`❌ Error updating APBDES ${id}:`, error);
      throw error;
    }
  },

  /**
   * Hapus APBDES (Admin only)
   */
  async delete(id: number): Promise<void> {
    try {
      console.log("🔄 Deleting: DELETE", `${API_BASE_URL}/${id}`);
      const response = await fetchWithAuth(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Error response:", errorData);
        throw new Error(
          errorData.error || `Failed to delete: ${response.statusText}`
        );
      }

      console.log("✅ Deleted successfully");
    } catch (error) {
      console.error(`❌ Error deleting APBDES ${id}:`, error);
      throw error;
    }
  },
};
