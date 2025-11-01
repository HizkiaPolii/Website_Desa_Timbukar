"use client";

import { useState, useRef } from "react";
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
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      console.log("📤 Upload request to /api/upload with folder:", uploadFolder);

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
      
      const filePath = data.filePath || data.publicPath || data.path || data.filename;

      if (!filePath) {
        throw new Error("Upload response tidak mengandung filePath. Response: " + JSON.stringify(data));
      }

      // Jika filePath hanya nama file, tambahkan path lengkap
      let finalPath = filePath;
      if (filePath && !filePath.startsWith("/")) {
        finalPath = `/images/${uploadFolder}/${filePath}`;
        console.log("⚠️  Added folder prefix ->" , finalPath);
      }

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
    // Jika sudah full URL, kembalikan as-is
    if (imagePath.startsWith("http")) return imagePath;
    // Jika path absolut (dari Next.js API)
    if (imagePath.startsWith("/images/")) return imagePath;
    // Jika data URL
    if (imagePath.startsWith("data:")) return imagePath;
    // Jika hanya nama file (dari backend database), transform to /images/galeri/...
    return `/images/galeri/${imagePath}`;
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

      {preview ? (
        <div className="space-y-3">
          <div className="relative w-full aspect-square max-w-xs mx-auto rounded-lg overflow-hidden border-2 border-emerald-200 bg-gray-50">
            <Image
              src={getPreviewUrl(preview)}
              alt="Preview"
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/placeholder.svg";
              }}
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
          </div>

          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={handleClearAndReupload}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Upload size={16} />
              Ubah Foto
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <X size={16} />
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-emerald-600 bg-emerald-50"
              : "border-gray-300 hover:border-emerald-500 hover:bg-gray-50"
          } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Upload
            size={32}
            className={`mx-auto mb-3 ${
              isDragging ? "text-emerald-600" : "text-gray-400"
            }`}
          />
          <p className="text-sm font-medium text-gray-700 mb-1">
            {isUploading ? "Mengunggah..." : placeholder}
          </p>
          <p className="text-xs text-gray-500">
            {isUploading
              ? "Mohon tunggu..."
              : "JPG, PNG, GIF atau WebP (max 5MB)"}
          </p>
        </div>
      )}

      {uploadError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{uploadError}</p>
        </div>
      )}

      {preview && !uploadError && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <Check size={16} className="text-green-600" />
          <p className="text-sm text-green-800">Foto berhasil diunggah</p>
        </div>
      )}
    </div>
  );
}
