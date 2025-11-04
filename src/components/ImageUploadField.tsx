"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Check } from "lucide-react";
import Image from "next/image";

interface ImageUploadFieldProps {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  uploadFolder?: string; // 'pemerintahan', 'bumdes', 'galeri', dll
}

export default function ImageUploadField({
  value,
  onChange,
  label = "Foto",
  placeholder = "Drag and drop foto atau klik untuk pilih",
  required = false,
  uploadFolder = "general", // Default folder
}: ImageUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Validate value sebelum set preview
  const isValidValue = (val: string | null | undefined): boolean => {
    if (!val) return false;
    // Valid jika full URL dari backend (http/https)
    if (val.startsWith("http")) return true;
    // Valid jika path dari uploads folder (yang sebenarnya ada)
    if (val.startsWith("/uploads/")) return true;
    // Jika path /images/... dari database lama, invalid (file tidak ada di disk)
    // Jika hanya nama file tanpa path, invalid
    return false;
  };

  const [preview, setPreview] = useState<string | null>(() => {
    return isValidValue(value) && value ? value : null;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview saat value prop berubah
  useEffect(() => {
    if (isValidValue(value) && value) {
      setPreview(value);
    }
  }, [value]);

  const isValidImageFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setUploadError("Format file harus JPG, PNG, GIF, atau WebP");
      return false;
    }

    if (file.size > maxSize) {
      setUploadError("Ukuran file tidak boleh lebih dari 5MB");
      return false;
    }

    return true;
  };

  const handleFileUpload = async (file: File) => {
    console.log("🔵 handleFileUpload start, file:", {
      name: file.name,
      type: file.type,
      size: file.size,
      uploadFolder: uploadFolder,
    });

    if (!isValidImageFile(file)) {
      console.error("❌ File validation failed");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", uploadFolder); // Kirim folder ke backend

      // Get token untuk authorization
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      console.log(
        "📤 Upload request to /api/upload with folder:",
        uploadFolder
      );

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers,
      });

      console.log("📡 Upload response status:", response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ Upload error response:", error);
        throw new Error(error.message || "Upload gagal");
      }

      const data = await response.json();
      console.log("✅ Upload response received:", data);

      // Extract filePath dari berbagai format response backend
      let filePath: string | undefined;

      // Try multiple patterns
      if (data.data?.url) {
        filePath = data.data.url;
        console.log("✅ Extracted from data.data.url:", filePath);
      } else if (data.filePath) {
        filePath = data.filePath;
        console.log("✅ Extracted from data.filePath:", filePath);
      } else if (data.publicPath) {
        filePath = data.publicPath;
        console.log("✅ Extracted from data.publicPath:", filePath);
      } else if (data.path) {
        filePath = data.path;
        console.log("✅ Extracted from data.path:", filePath);
      } else if (data.filename) {
        filePath = data.filename;
        console.log("✅ Extracted from data.filename:", filePath);
      }

      if (!filePath) {
        throw new Error(
          "Upload response tidak mengandung filePath. Response: " +
            JSON.stringify(data)
        );
      }

      // Jika filePath adalah path relatif dari uploads (dari backend), convert ke full URL
      let finalPath = filePath;

      if (filePath.startsWith("/uploads/")) {
        // Backend return relative path /uploads/... convert to full URL
        const apiUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://api.desatimbukar.id/api";
        const baseUrl = apiUrl.replace("/api", "");
        finalPath = `${baseUrl}${filePath}`;
        console.log("🔄 Converted relative path to full URL:", finalPath);
      } else if (
        filePath &&
        !filePath.startsWith("/") &&
        !filePath.startsWith("http")
      ) {
        // Jika hanya nama file, tambahkan path lengkap
        finalPath = `/images/${uploadFolder}/${filePath}`;
        console.log("⚠️  Added folder prefix ->", finalPath);
      }
      // Jika sudah full URL atau absolute path, gunakan as-is

      console.log("🟢 Final image path:", finalPath);

      // Set preview dengan full path untuk menampilkan gambar
      setPreview(finalPath);
      onChange(finalPath); // Kirim full path ke parent component
      console.log("🟢 onChange callback triggered with:", finalPath);
      setUploadError(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal upload foto";
      setUploadError(errorMessage);
      console.error("🔴 Upload error:", error);
      console.error("Error message:", errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onChange(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClearAndReupload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getPreviewUrl = (imagePath: string | null): string => {
    if (!imagePath) return "/images/placeholder.svg";

    // Jika sudah full URL (dari backend), gunakan langsung
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Jika dari /uploads/ folder (yang sebenarnya ada di backend)
    if (imagePath.startsWith("/uploads/")) {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://api.desatimbukar.id/api";
      const baseUrl = apiUrl.replace("/api", "");
      return `${baseUrl}${imagePath}`;
    }

    // Data URL
    if (imagePath.startsWith("data:")) {
      return imagePath;
    }

    // Path lain (seperti /images/pemerintahan/... dari DB lama) tidak valid
    // Return placeholder untuk trigger onError
    return "/images/placeholder.svg";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-emerald-600 bg-emerald-50"
            : "border-gray-300 hover:border-emerald-500 hover:bg-gray-50"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Upload
          size={28}
          className={`mx-auto mb-3 sm:mb-4 ${
            isDragging ? "text-emerald-600" : "text-gray-400"
          }`}
        />
        <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {isUploading ? "Mengunggah..." : placeholder}
        </p>
        <p className="text-xs text-gray-500">
          {isUploading
            ? "Mohon tunggu..."
            : "JPG, PNG, GIF atau WebP (max 5MB)"}
        </p>
      </div>

      {uploadError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{uploadError}</p>
        </div>
      )}

      {preview && !uploadError && (
        <div className="mt-3">
          <div className="relative w-full h-64 rounded-lg overflow-hidden border border-green-200 bg-green-50">
            <Image
              src={getPreviewUrl(preview)}
              alt="Preview"
              fill
              className="object-contain"
              onError={(e) => {
                console.error("❌ Image preview failed to load:", preview);
                setPreview(null);
                onChange(null);
              }}
            />
          </div>
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-600" />
              <p className="text-sm text-green-800">Foto berhasil diunggah</p>
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-green-600 hover:text-red-600 transition-colors"
              title="Hapus foto"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
