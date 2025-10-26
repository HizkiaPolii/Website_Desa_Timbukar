/**
 * API Client untuk Desa Timbukar Backend
 * Backend URL: http://localhost:5000/api
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

/**
 * Generic API call function
 */
async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
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

    const data = (await response.json()) as ApiResponse<T>;

    if (!response.ok) {
      const error = new Error(data.error || `API Error: ${response.status}`);
      console.error("API Error:", error, data);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`API Call Error [${endpoint}]:`, error);
    throw error;
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
