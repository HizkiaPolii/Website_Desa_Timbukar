interface Misi {
  no: string;
  title: string;
  description: string;
}

interface ProfileData {
  id?: number;
  visi: string;
  misi: Misi[];
  tujuan?: string[];
  sejarah: string;
  updated_at?: string;
}

interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  status?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getProfilDesa(): Promise<{
  success: boolean;
  data?: ProfileData;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_URL}/profil`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result: ApiResponse<ProfileData> = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Gagal mengambil data profil desa");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Error fetching profil desa:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Terjadi kesalahan saat fetch",
    };
  }
}

export async function updateProfilDesa(data: ProfileData): Promise<{
  success: boolean;
  data?: ProfileData;
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");
    }

    const formattedData = {
      visi: data.visi,
      misi: data.misi, // Kirim array langsung, bukan JSON string
      sejarah: data.sejarah,
      tujuan: data.tujuan || [], // Kirim array langsung
    };

    console.log("Sending data:", formattedData);

    const response = await fetch(`${API_URL}/profil`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formattedData),
    });

    const result: ApiResponse<ProfileData> = await response.json();

    console.log("Response status:", response.status);
    console.log("Response data:", result);

    if (!response.ok) {
      const errorMessage =
        result.error || result.message || "Gagal mengupdate profil desa";
      console.error("API Error Details:", {
        status: response.status,
        error: result.error,
        message: result.message,
        data: result.data,
      });
      throw new Error(errorMessage);
    }

    return {
      success: true,
      data: result.data ? parseProfilDesaFromBackend(result.data) : data,
    };
  } catch (error) {
    console.error("Error updating profil desa:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat update",
    };
  }
}

export async function createProfilDesa(data: ProfileData): Promise<{
  success: boolean;
  data?: ProfileData;
  error?: string;
}> {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");
    }

    const response = await fetch(`${API_URL}/profil`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<ProfileData> = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Gagal membuat profil desa");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Error creating profil desa:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat create",
    };
  }
}

export function formatProfilDesaForBackend(data: ProfileData): {
  visi: string;
  misi: string;
  sejarah: string;
} {
  return {
    visi: data.visi,
    misi: JSON.stringify(data.misi),
    sejarah: data.sejarah,
  };
}

export function parseProfilDesaFromBackend(data: any): ProfileData {
  // Helper function to parse misi
  const parseMisi = (misiData: any): Misi[] => {
    if (!misiData) return [];

    // Jika sudah array, return langsung
    if (Array.isArray(misiData)) {
      return misiData;
    }

    // Jika string, coba parse JSON
    if (typeof misiData === "string") {
      try {
        return JSON.parse(misiData);
      } catch (e) {
        console.error("Failed to parse misi:", e);
        return [];
      }
    }

    return [];
  };

  // Helper function to parse tujuan
  const parseTujuan = (tujuanData: any): string[] => {
    if (!tujuanData) return [];

    // Jika sudah array, return langsung
    if (Array.isArray(tujuanData)) {
      return tujuanData;
    }

    // Jika string, coba parse JSON
    if (typeof tujuanData === "string") {
      try {
        return JSON.parse(tujuanData);
      } catch (e) {
        console.error("Failed to parse tujuan:", e);
        return [];
      }
    }

    return [];
  };

  return {
    id: data.id,
    visi: data.visi || "",
    misi: parseMisi(data.misi),
    tujuan: parseTujuan(data.tujuan),
    sejarah: data.sejarah || "",
    updated_at: data.updated_at,
  };
}
