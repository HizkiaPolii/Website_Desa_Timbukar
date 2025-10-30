/**
 * API Client untuk Desa Timbukar Backend
 * Menggunakan Express + PostgreSQL
 * Backend URL: http://localhost:3000/api
 */

import {
  API_BASE_URL,
  REQUEST_CONFIG,
  HTTP_STATUS,
  ERROR_MESSAGES,
} from "@/config/apiConfig";

const API_URL = API_BASE_URL;

// ==================== TYPES ====================

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  token?: string;
  user?: UserData;
  error?: string;
  status?: string;
}

export interface UserData {
  id: string;
  username: string;
  role: "admin" | "user";
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get token dari localStorage
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/**
 * Set token ke localStorage
 */
export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
}

/**
 * Remove token dari localStorage
 */
export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// ==================== ERROR HANDLING ====================

export interface ApiError extends Error {
  status?: number;
  code?: string;
  response?: any;
}

/**
 * Parse error response dari API
 */
export function parseApiError(error: any): ApiError {
  const apiError: ApiError = new Error();

  if (error.response?.data) {
    // Error dari server
    const data = error.response.data;
    apiError.message =
      data.message || data.error || "Terjadi kesalahan pada server";
    apiError.status = error.response.status;
    apiError.code = data.code;
    apiError.response = data;
  } else if (error.message === "Network Error") {
    // Network error
    apiError.message = ERROR_MESSAGES.NETWORK_ERROR;
    apiError.code = "NETWORK_ERROR";
  } else if (error.code === "ECONNABORTED") {
    // Timeout
    apiError.message = ERROR_MESSAGES.TIMEOUT_ERROR;
    apiError.code = "TIMEOUT_ERROR";
  } else {
    // Other errors
    apiError.message = error.message || "Terjadi kesalahan";
    apiError.code = "UNKNOWN_ERROR";
  }

  return apiError;
}

/**
 * Handle specific HTTP status errors
 */
export function handleHttpError(status: number, data?: any): string {
  switch (status) {
    case HTTP_STATUS.UNAUTHORIZED:
      removeToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return ERROR_MESSAGES.UNAUTHORIZED_ERROR;

    case HTTP_STATUS.FORBIDDEN:
      return ERROR_MESSAGES.FORBIDDEN_ERROR;

    case HTTP_STATUS.NOT_FOUND:
      return ERROR_MESSAGES.NOT_FOUND_ERROR;

    case HTTP_STATUS.CONFLICT:
      return data?.message || "Data sudah ada";

    case HTTP_STATUS.BAD_REQUEST:
      return data?.message || ERROR_MESSAGES.VALIDATION_ERROR;

    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return ERROR_MESSAGES.SERVER_ERROR;

    default:
      return "Terjadi kesalahan";
  }
}

// ==================== FETCH WRAPPER ====================

interface FetchOptions extends RequestInit {
  retry?: number;
  timeout?: number;
}

/**
 * Generic API call function dengan retry dan timeout
 */
async function apiCall<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const {
    retry = 0,
    timeout = REQUEST_CONFIG.TIMEOUT,
    ...fetchOptions
  } = options;

  const url = `${API_URL}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Setup request dengan timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    console.log(`📡 ${fetchOptions.method || "GET"} ${endpoint}`);

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response
    const contentType = response.headers.get("content-type");
    let data: any = null;

    if (contentType?.includes("application/json")) {
      data = (await response.json()) as ApiResponse<T>;
    } else {
      data = await response.text();
    }

    // Handle error responses
    if (!response.ok) {
      const errorMessage = handleHttpError(response.status, data);
      const error: ApiError = new Error(errorMessage);
      error.status = response.status;
      error.response = data;

      console.error(`❌ Error ${response.status}:`, errorMessage);
      throw error;
    }

    console.log(`✅ Success:`, data);

    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);

    // Retry logic
    if (retry < REQUEST_CONFIG.RETRY_ATTEMPTS && !error.status) {
      console.warn(
        `⚠️ Retrying (${retry + 1}/${REQUEST_CONFIG.RETRY_ATTEMPTS})...`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, REQUEST_CONFIG.RETRY_DELAY * (retry + 1))
      );
      return apiCall(endpoint, { ...options, retry: retry + 1 });
    }

    console.error(`API Call Error [${endpoint}]:`, error);
    throw parseApiError(error);
  }
}

// ==================== AUTHENTICATION API ====================

export const authApi = {
  /**
   * Login dengan username dan password
   */
  async login(username: string, password: string) {
    const response = await apiCall<{ user: UserData; token: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }
    );

    if (response.token) {
      setToken(response.token);
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }
    }

    return response;
  },

  /**
   * Register user baru
   */
  async register(username: string, email: string, password: string) {
    return apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
  },

  /**
   * Get profile user saat ini
   */
  async getMe() {
    return apiCall<UserData>("/auth/me");
  },

  /**
   * Logout
   */
  async logout() {
    const response = await apiCall("/auth/logout", {
      method: "POST",
    });
    removeToken();
    return response;
  },
};

// ==================== PROFIL DESA API ====================

export interface ProfilDesa {
  id?: number;
  namaDesa: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  luasWilayah: string;
  jumlahPenduduk: number;
  deskripsi: string;
  website: string;
  telepon: string;
  email: string;
  alamat: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const profilApi = {
  /**
   * Get profil desa
   */
  async get() {
    return apiCall<ProfilDesa>("/profil");
  },

  /**
   * Create profil desa (admin only)
   */
  async create(data: ProfilDesa) {
    return apiCall("/profil", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update profil desa (admin only)
   */
  async update(id: string | number, data: Partial<ProfilDesa>) {
    return apiCall(`/profil/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// ==================== PEMERINTAHAN API ====================

export interface Pemerintahan {
  id?: number;
  nama: string;
  jabatan: string;
  nip?: string;
  periode?: string;
  alamat?: string;
  telepon?: string;
  email?: string;
  pendidikan?: string;
  agama?: string;
  jenisKelamin?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const pemerintahanApi = {
  /**
   * Get semua data pemerintahan
   */
  async getAll() {
    return apiCall<Pemerintahan[]>("/pemerintahan");
  },

  /**
   * Get pemerintahan by ID
   */
  async getById(id: string | number) {
    return apiCall<Pemerintahan>(`/pemerintahan/${id}`);
  },

  /**
   * Create pemerintahan (admin only)
   */
  async create(data: Pemerintahan) {
    return apiCall("/pemerintahan", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update pemerintahan (admin only)
   */
  async update(id: string | number, data: Partial<Pemerintahan>) {
    return apiCall(`/pemerintahan/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete pemerintahan (admin only)
   */
  async delete(id: string | number) {
    return apiCall(`/pemerintahan/${id}`, {
      method: "DELETE",
    });
  },
};

// ==================== BUMDES API ====================

export interface Bumdes {
  id?: number;
  nama: string;
  deskripsi: string;
  bidangUsaha?: string;
  nomorLegalitas?: string;
  tanggalDibentuk?: string;
  modal?: number;
  pengurus?: string;
  kontakPerson?: string;
  alamat?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const bumdesApi = {
  /**
   * Get semua BUMDES
   */
  async getAll() {
    return apiCall<Bumdes[]>("/bumdes");
  },

  /**
   * Get BUMDES by ID
   */
  async getById(id: string | number) {
    return apiCall<Bumdes>(`/bumdes/${id}`);
  },

  /**
   * Create BUMDES (admin only)
   */
  async create(data: Bumdes) {
    return apiCall("/bumdes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update BUMDES (admin only)
   */
  async update(id: string | number, data: Partial<Bumdes>) {
    return apiCall(`/bumdes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete BUMDES (admin only)
   */
  async delete(id: string | number) {
    return apiCall(`/bumdes/${id}`, {
      method: "DELETE",
    });
  },
};

// ==================== LEMBAGA MASYARAKAT API ====================

export interface LembagaMasyarakat {
  id?: number;
  nama: string;
  deskripsi?: string;
  jenisLembaga?: string;
  ketua?: string;
  visi?: string;
  misi?: string;
  kontakPerson?: string;
  email?: string;
  alamat?: string;
  tahunBerdiri?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const lembagaApi = {
  /**
   * Get semua lembaga masyarakat
   */
  async getAll() {
    return apiCall<LembagaMasyarakat[]>("/lembaga-masyarakat");
  },

  /**
   * Get lembaga by ID
   */
  async getById(id: string | number) {
    return apiCall<LembagaMasyarakat>(`/lembaga-masyarakat/${id}`);
  },

  /**
   * Create lembaga (admin only)
   */
  async create(data: LembagaMasyarakat) {
    return apiCall("/lembaga-masyarakat", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update lembaga (admin only)
   */
  async update(id: string | number, data: Partial<LembagaMasyarakat>) {
    return apiCall(`/lembaga-masyarakat/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete lembaga (admin only)
   */
  async delete(id: string | number) {
    return apiCall(`/lembaga-masyarakat/${id}`, {
      method: "DELETE",
    });
  },
};

// ==================== DATA DESA API ====================

export interface DataDesa {
  id?: number;
  kategori: string;
  jumlahPenduduk?: number;
  jumlahKepalaKeluarga?: number;
  laki_laki?: number;
  perempuan?: number;
  totalSekolah?: number;
  tingkatTamat?: string;
  [key: string]: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export const dataDesaApi = {
  /**
   * Get semua data desa
   */
  async getAll() {
    return apiCall<DataDesa[]>("/data-desa");
  },

  /**
   * Get data desa by ID
   */
  async getById(id: string | number) {
    return apiCall<DataDesa>(`/data-desa/${id}`);
  },

  /**
   * Create data desa (admin only)
   */
  async create(data: DataDesa) {
    return apiCall("/data-desa", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update data desa (admin only)
   */
  async update(id: string | number, data: Partial<DataDesa>) {
    return apiCall(`/data-desa/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete data desa (admin only)
   */
  async delete(id: string | number) {
    return apiCall(`/data-desa/${id}`, {
      method: "DELETE",
    });
  },
};

// ==================== HEALTH CHECK ====================

export const healthApi = {
  /**
   * Check if backend is running
   */
  async check() {
    return apiCall("/health");
  },
};
