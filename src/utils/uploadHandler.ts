// src/utils/uploadHandler.ts
/**
 * Utility untuk mendeteksi environment dan mengatur upload handler
 * - Local: Gunakan filesystem lokal
 * - Vercel: Gunakan Cloudinary
 */

export const isVercelEnvironment = (): boolean => {
  // Deteksi Vercel dari environment variable
  return process.env.VERCEL === "1" || process.env.VERCEL_ENV === "production";
};

export const getUploadMethod = (): "LOCAL" | "CLOUDINARY" => {
  const method = process.env.UPLOAD_METHOD || "LOCAL_FILE_SYSTEM";

  // Override untuk Vercel - force gunakan Cloudinary
  if (isVercelEnvironment()) {
    return "CLOUDINARY";
  }

  return method === "CLOUDINARY" ? "CLOUDINARY" : "LOCAL";
};
