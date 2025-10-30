"use client";

import React, { useRef, useState } from "react";
import { Upload, X, FileText, Loader } from "lucide-react";

interface PDFUploadFieldProps {
  label?: string;
  value?: string;
  onChange?: (url: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function PDFUploadField({
  label = "Upload PDF",
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}: PDFUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>(value || "");

  const handleFileSelect = async (file: File) => {
    // Validasi tipe file
    if (!file.type.includes("pdf")) {
      alert("Hanya file PDF yang diperbolehkan");
      return;
    }

    // Validasi ukuran file (maksimal 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("Ukuran file maksimal 10MB");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    
    // Upload file langsung ke server
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal upload file");
      }

      const data = await response.json();
      const fileUrl = data.data.url;
      
      setUploadedUrl(fileUrl);
      onChange?.(fileUrl);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal upload file";
      alert(errorMessage);
      setSelectedFile(null);
      setFileName("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleFileSelect(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setFileName("");
    setUploadedUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange?.("");
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative w-full border-2 border-dashed rounded-lg p-6
          transition-all duration-200 cursor-pointer
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50"
          }
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-blue-400 hover:bg-blue-50"
          }
          ${error ? "border-red-500" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        {!selectedFile && !uploadedUrl ? (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Drag and drop file PDF di sini
            </p>
            <p className="text-xs text-gray-500 mb-3">
              atau klik untuk memilih dari folder
            </p>
            <p className="text-xs text-gray-400">Maksimal ukuran file: 10MB</p>
          </div>
        ) : isUploading ? (
          <div className="flex items-center justify-center gap-3">
            <Loader className="h-5 w-5 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-700">Mengunggah file...</p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-10 w-10 text-red-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {fileName}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedFile ? (selectedFile.size / 1024).toFixed(2) : "0"} KB
                </p>
              </div>
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}
