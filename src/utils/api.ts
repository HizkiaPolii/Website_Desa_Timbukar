const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://82.153.226.232:5000/api";

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    role: "admin" | "user";
  };
}

interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

/**
 * Login user dengan username dan password
 * @param username - Username pengguna
 * @param password - Password pengguna
 * @returns Login response dengan token dan user data
 */
export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Login gagal",
      };
    }

    return {
      success: true,
      message: data.message || "Login berhasil",
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Terjadi kesalahan saat login",
    };
  }
}

/**
 * Register user baru
 * @param username - Username baru
 * @param email - Email pengguna
 * @param password - Password pengguna
 * @returns Register response
 */
export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Registrasi gagal",
      };
    }

    return {
      success: true,
      message: data.message || "Registrasi berhasil",
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat registrasi",
    };
  }
}

/**
 * Logout user
 * @returns Logout response
 */
export async function logoutUser(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Logout gagal",
      };
    }

    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return {
      success: true,
      message: data.message || "Logout berhasil",
    };
  } catch (error) {
    // Force clear local storage anyway
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat logout",
    };
  }
}

/**
 * Get current user profile (protected endpoint)
 * @returns User profile response
 */
export async function getCurrentUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        message: "Token tidak ditemukan",
      };
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Gagal mengambil profil",
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Terjadi kesalahan",
    };
  }
}

/**
 * Make authenticated API call
 * @param endpoint - API endpoint path (without base URL)
 * @param options - Fetch options
 * @returns API response
 */
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API call failed");
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Terjadi kesalahan",
    };
  }
}
