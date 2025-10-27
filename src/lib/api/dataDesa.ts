/**
 * API Service untuk Data Desa
 * Menghubungkan frontend dengan backend API
 */

// Types
export interface StatisticsData {
  id?: number;
  populasi?: string;
  kepala_keluarga?: string;
  luas_wilayah?: string;
  angka_pertumbuhan?: string;
  jumlah_bayi?: string;
  angka_harapan_hidup?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DemographicsItem {
  id?: number;
  kategori_usia: string;
  jumlah: number;
  persentase: string;
  created_at?: string;
  updated_at?: string;
}

export interface GenderItem {
  id?: number;
  jenis_kelamin: string;
  jumlah: number;
  persentase: string;
  created_at?: string;
  updated_at?: string;
}

export interface EducationItem {
  id?: number;
  tingkat_pendidikan: string;
  jumlah: number;
  persentase: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReligionItem {
  id?: number;
  agama: string;
  jumlah: number;
  persentase: string;
  created_at?: string;
  updated_at?: string;
}

export interface DataDesaFormData {
  statistics: StatisticsData;
  demographics: DemographicsItem[];
  gender: GenderItem[];
  education: EducationItem[];
  religion: ReligionItem[];
}

// API Base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Fetch semua data desa
 */
export const fetchAllDataDesa = async (): Promise<DataDesaFormData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/data-desa`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching all data desa:", error);
    throw error;
  }
};

/**
 * Fetch data berdasarkan kategori
 */
export const fetchDataByCategory = async (
  category: "demographics" | "gender" | "education" | "religion" | "statistics"
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/data-desa/${category}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${category}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching ${category}:`, error);
    throw error;
  }
};

/**
 * Tambah data statistik
 */
export const createStatistics = async (
  data: Omit<StatisticsData, "id" | "created_at" | "updated_at">
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/data-desa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kategori: "statistics",
        ...data,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create statistics: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error creating statistics:", error);
    throw error;
  }
};

/**
 * Tambah data demografi
 */
export const createDemographics = async (
  data: Omit<DemographicsItem, "id" | "created_at" | "updated_at">
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/data-desa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kategori: "demographics",
        ...data,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create demographics: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error creating demographics:", error);
    throw error;
  }
};

/**
 * Tambah data jenis kelamin
 */
export const createGender = async (
  data: Omit<GenderItem, "id" | "created_at" | "updated_at">
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/data-desa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kategori: "gender",
        ...data,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create gender data: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error creating gender data:", error);
    throw error;
  }
};

/**
 * Tambah data pendidikan
 */
export const createEducation = async (
  data: Omit<EducationItem, "id" | "created_at" | "updated_at">
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/data-desa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kategori: "education",
        ...data,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create education data: ${response.statusText}`
      );
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error creating education data:", error);
    throw error;
  }
};

/**
 * Tambah data agama
 */
export const createReligion = async (
  data: Omit<ReligionItem, "id" | "created_at" | "updated_at">
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/data-desa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kategori: "religion",
        ...data,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create religion data: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error creating religion data:", error);
    throw error;
  }
};

/**
 * Update data berdasarkan kategori dan ID
 */
export const updateDataDesa = async (
  id: number,
  category: "demographics" | "gender" | "education" | "religion" | "statistics",
  data: Record<string, any>
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/data-desa/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kategori: category,
        ...data,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update ${category}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error updating ${category}:`, error);
    throw error;
  }
};

/**
 * Update semua data desa sekaligus (multiple categories in one request)
 * @param allData - Object containing statistics, demographics, gender, education, religion
 */
export const updateAllDataDesa = async (allData: {
  statistics?: StatisticsData;
  demographics?: DemographicsItem[];
  gender?: GenderItem[];
  education?: EducationItem[];
  religion?: ReligionItem[];
}) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/data-desa/update-all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(allData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update all data: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error updating all data desa:", error);
    throw error;
  }
};

/**
 * Hapus data berdasarkan kategori dan ID
 */
export const deleteDataDesa = async (
  id: number,
  category: "demographics" | "gender" | "education" | "religion" | "statistics"
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/data-desa/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kategori: category,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete ${category}: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error deleting ${category}:`, error);
    throw error;
  }
};
