/**
 * Data Desa Update API Helper Functions
 * Utility functions untuk melakukan request PUT ke API data-desa
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Interface untuk Statistik Utama
 */
export interface StatisticsData {
  populasi: string;
  kepala_keluarga: string;
  luas_wilayah: string;
  angka_pertumbuhan: string;
  jumlah_bayi: string;
  angka_harapan_hidup: string;
}

/**
 * Interface untuk Distribusi (Pendidikan, Gender, Usia, Agama)
 */
export interface DistributionItem {
  [key: string]: string | number;
}

/**
 * Response type untuk API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Update Statistik Utama
 * @param data - Data statistik utama
 * @returns Promise dengan response dari API
 */
export async function updateStatistics(
  data: StatisticsData
): Promise<ApiResponse<StatisticsData>> {
  try {
    const res = await fetch(`${API_BASE_URL}/data-desa`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kategori: "statistics",
        data,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Gagal memperbarui statistik utama");
    }

    return res.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Update Distribusi Pendidikan
 * @param items - Array of education items
 * @returns Promise dengan response dari API
 */
export async function updateEducation(
  items: DistributionItem[]
): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/data-desa`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kategori: "education",
        items: items.map((item) => ({
          tingkat_pendidikan: item.tingkat_pendidikan,
          jumlah:
            typeof item.jumlah === "string"
              ? parseInt(item.jumlah.replace(/\D/g, "")) || 0
              : item.jumlah,
          persentase: item.persentase,
        })),
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.error || "Gagal memperbarui distribusi pendidikan"
      );
    }

    return res.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Update Distribusi Jenis Kelamin
 * @param items - Array of gender items
 * @returns Promise dengan response dari API
 */
export async function updateGender(
  items: DistributionItem[]
): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/data-desa`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kategori: "gender",
        items: items.map((item) => ({
          jenis_kelamin: item.jenis_kelamin,
          jumlah:
            typeof item.jumlah === "string"
              ? parseInt(item.jumlah.replace(/\D/g, "")) || 0
              : item.jumlah,
          persentase: item.persentase,
        })),
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.error || "Gagal memperbarui distribusi jenis kelamin"
      );
    }

    return res.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Update Distribusi Usia (Demographics)
 * @param items - Array of demographics items
 * @returns Promise dengan response dari API
 */
export async function updateDemographics(
  items: DistributionItem[]
): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/data-desa`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kategori: "demographics",
        items: items.map((item) => ({
          kategori_usia: item.kategori_usia,
          jumlah:
            typeof item.jumlah === "string"
              ? parseInt(item.jumlah.replace(/\D/g, "")) || 0
              : item.jumlah,
          persentase: item.persentase,
        })),
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Gagal memperbarui distribusi usia");
    }

    return res.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Update Distribusi Agama
 * @param items - Array of religion items
 * @returns Promise dengan response dari API
 */
export async function updateReligion(
  items: DistributionItem[]
): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/data-desa`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kategori: "religion",
        items: items.map((item) => ({
          agama: item.agama,
          jumlah:
            typeof item.jumlah === "string"
              ? parseInt(item.jumlah.replace(/\D/g, "")) || 0
              : item.jumlah,
          persentase: item.persentase,
        })),
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Gagal memperbarui distribusi agama");
    }

    return res.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Generic update function untuk distribusi data
 * @param kategori - Kategori data (education, gender, demographics, religion)
 * @param items - Array of items
 * @returns Promise dengan response dari API
 */
export async function updateDistribution(
  kategori: "education" | "gender" | "demographics" | "religion",
  items: DistributionItem[]
): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/data-desa`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kategori,
        items,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Gagal memperbarui ${kategori}`);
    }

    return res.json();
  } catch (error) {
    throw error;
  }
}
