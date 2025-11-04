import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.desatimbukar.id/api";

// Helper function untuk detect environment
// Gunakan Backend API jika URL bukan localhost
const shouldUseBackendAPI = (): boolean => {
  const isLocalhost =
    API_BASE_URL.includes("localhost") ||
    API_BASE_URL.includes("127.0.0.1") ||
    API_BASE_URL.includes("0.0.0.0");

  // Jika bukan localhost, gunakan backend API
  return !isLocalhost;
};

// Upload ke Backend API (VPS)
async function uploadToBackendAPI(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "rkpdesa");

  try {
    console.log(`📤 Uploading PDF to Backend API: ${API_BASE_URL}/upload/pdf`);
    console.log(`   File: ${file.name}, Size: ${file.size} bytes`);

    const response = await fetch(`${API_BASE_URL}/upload/pdf`, {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    console.log(`📡 Backend response status: ${response.status}`);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error(`❌ Backend error response:`, errorData);
      } catch (e) {
        const text = await response.text();
        console.error(`❌ Backend error (text):`, text);
        errorMessage = text || errorMessage;
      }
      throw new Error(`Backend API error: ${errorMessage}`);
    }

    const data = await response.json();
    console.log(`✅ Backend PDF upload raw response:`, data);

    // Try multiple response format patterns
    let filePath: string | undefined;

    if (data.data?.url) {
      filePath = data.data.url;
      console.log(`✅ Extracted from data.data.url: ${filePath}`);
    } else if (data.url) {
      filePath = data.url;
      console.log(`✅ Extracted from data.url: ${filePath}`);
    } else if (data.filePath) {
      filePath = data.filePath;
      console.log(`✅ Extracted from data.filePath: ${filePath}`);
    } else if (data.path) {
      filePath = data.path;
      console.log(`✅ Extracted from data.path: ${filePath}`);
    } else if (data.file) {
      filePath = data.file;
      console.log(`✅ Extracted from data.file: ${filePath}`);
    }

    if (!filePath) {
      console.error(
        `❌ Could not extract URL from backend response. Available keys: ${Object.keys(
          data
        ).join(", ")}`
      );
      throw new Error(
        `Backend response format tidak sesuai. Response: ${JSON.stringify(
          data
        )}`
      );
    }

    // Handle relative URL dari backend
    // Jika backend return relative path (/uploads/...), convert ke full URL
    let finalPath = filePath;
    if (filePath.startsWith("/uploads/")) {
      // Backend return relative path, convert to full URL
      const baseUrl = API_BASE_URL.endsWith("/api")
        ? API_BASE_URL.slice(0, -4) // Remove last 4 chars (/api)
        : API_BASE_URL;
      finalPath = `${baseUrl}${filePath}`;
      console.log(`🔄 Converted relative path to full URL: ${finalPath}`);
    } else if (!filePath.startsWith("http")) {
      // Path tidak relative dan bukan http, assume relative
      const baseUrl = API_BASE_URL.endsWith("/api")
        ? API_BASE_URL.slice(0, -4) // Remove last 4 chars (/api)
        : API_BASE_URL;
      finalPath = `${baseUrl}${filePath}`;
      console.log(`🔄 Converted non-http path to full URL: ${finalPath}`);
    }

    console.log(`✅ Final backend file URL: ${finalPath}`);
    return finalPath;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Backend API PDF upload error: ${errorMessage}`);
    throw new Error(`Backend upload gagal: ${errorMessage}`);
  }
}

// Upload ke local filesystem (hanya untuk development)
async function uploadToLocal(file: File, filename: string): Promise<string> {
  // Path untuk menyimpan file
  const uploadDir = join(process.cwd(), "public", "uploads", "rkpdesa");
  const filepath = join(uploadDir, filename);

  // Buat direktori jika belum ada
  await mkdir(uploadDir, { recursive: true });

  // Konversi file ke buffer dan simpan
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  // Return URL file yang bisa diakses
  const fileUrl = `/uploads/rkpdesa/${filename}`;
  console.log(`✅ Local PDF uploaded: ${fileUrl}`);

  return fileUrl;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    // Validasi tipe file - hanya PDF
    if (!file.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Format file harus PDF" },
        { status: 400 }
      );
    }

    // Validasi ukuran file (10MB max untuk PDF)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Ukuran file tidak boleh lebih dari 10MB" },
        { status: 400 }
      );
    }

    // Generate nama file unik
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const filename = `rkpdesa-${timestamp}-${random}.pdf`;

    let fileUrl: string;

    // Pilih upload method berdasarkan API URL
    if (shouldUseBackendAPI()) {
      console.log("📤 PDF upload to Backend API");
      fileUrl = await uploadToBackendAPI(file);
    } else {
      console.log("📤 PDF upload to local filesystem");
      fileUrl = await uploadToLocal(file, filename);
    }

    return NextResponse.json(
      {
        success: true,
        message: "File berhasil diunggah",
        data: {
          url: fileUrl,
          filename: filename,
          originalName: file.name,
          size: file.size,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah file" },
      { status: 500 }
    );
  }
}
