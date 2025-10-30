/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Base URL dari backend (sesuaikan dengan environment)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

// API Endpoints
export const API_ENDPOINTS = {
  // APBDES
  APBDES: "/apbdes",
  APBDES_BY_ID: (id: number) => `/apbdes/${id}`,
  APBDES_BY_TAHUN: (tahun: number) => `/apbdes/tahun/${tahun}`,

  // Authentication
  AUTH_LOGIN: "/auth/login",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_REGISTER: "/auth/register",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_PROFILE: "/auth/profile",

  // Data Desa
  DATA_DESA: "/data-desa",
  DATA_DESA_BY_ID: (id: number) => `/data-desa/${id}`,

  // Pemerintahan
  PEMERINTAHAN: "/pemerintahan",
  PEMERINTAHAN_BY_ID: (id: number) => `/pemerintahan/${id}`,

  // Lembaga Masyarakat
  LEMBAGA: "/lembaga-masyarakat",
  LEMBAGA_BY_ID: (id: number) => `/lembaga-masyarakat/${id}`,

  // Upload
  UPLOAD: "/upload",
  UPLOAD_PDF: "/upload/pdf",
};

// Request Configuration
export const REQUEST_CONFIG = {
  TIMEOUT: 15000, // 15 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  HEADERS: {
    "Content-Type": "application/json",
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Kesalahan jaringan. Pastikan backend server berjalan.",
  TIMEOUT_ERROR:
    "Request timeout. Server tidak merespons dalam waktu yang ditentukan.",
  UNAUTHORIZED_ERROR: "Anda tidak memiliki akses. Silakan login kembali.",
  FORBIDDEN_ERROR: "Anda tidak memiliki izin untuk mengakses resource ini.",
  NOT_FOUND_ERROR: "Data tidak ditemukan.",
  SERVER_ERROR: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
  VALIDATION_ERROR: "Data tidak valid. Silakan periksa kembali input Anda.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  FETCH_SUCCESS: "Data berhasil diambil",
  CREATE_SUCCESS: "Data berhasil dibuat",
  UPDATE_SUCCESS: "Data berhasil diperbarui",
  DELETE_SUCCESS: "Data berhasil dihapus",
  LOGIN_SUCCESS: "Login berhasil",
  LOGOUT_SUCCESS: "Logout berhasil",
  UPLOAD_SUCCESS: "File berhasil diunggah",
};
