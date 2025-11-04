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

  const shouldUse = !isLocalhost;
  console.log(`🔍 API_BASE_URL: ${API_BASE_URL}`);
  console.log(`🔍 isLocalhost: ${isLocalhost}`);
  console.log(`🔍 shouldUseBackendAPI: ${shouldUse}`);

  // Jika bukan localhost, gunakan backend API
  return shouldUse;
};

// Upload ke Backend API (VPS)
async function uploadToBackendAPI(file: File, folder: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  try {
    console.log(`📤 Uploading to Backend API: ${API_BASE_URL}/upload`);
    console.log(
      `   File: ${file.name}, Folder: ${folder}, Size: ${file.size} bytes`
    );

    // Prepare fetch options with auth token if available
    const fetchOptions: RequestInit = {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(30000), // 30 second timeout
    };

    // Try to get auth token from localStorage (in browser context)
    // Note: This is running in server context, so no localStorage
    // But we can pass token from headers if needed
    const headers: Record<string, string> = {};

    // Optional: Add auth headers if backend requires authentication
    // const token = process.env.BACKEND_AUTH_TOKEN;
    // if (token) {
    //   headers["Authorization"] = `Bearer ${token}`;
    // }

    if (Object.keys(headers).length > 0) {
      fetchOptions.headers = headers;
    }

    // Build URL dengan query parameter folder
    const url = new URL(`${API_BASE_URL}/upload`);
    url.searchParams.append("folder", folder);
    console.log(`📍 Full URL with query: ${url.toString()}`);

    const response = await fetch(url.toString(), fetchOptions);

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
    console.log(`✅ Backend upload raw response:`, data);

    // Try multiple response format patterns
    let filePath: string | undefined;

    // Pattern 1: data.data.url
    if (data.data?.url) {
      filePath = data.data.url;
      console.log(`✅ Extracted from data.data.url: ${filePath}`);
    }
    // Pattern 2: data.url
    else if (data.url) {
      filePath = data.url;
      console.log(`✅ Extracted from data.url: ${filePath}`);
    }
    // Pattern 3: data.filePath
    else if (data.filePath) {
      filePath = data.filePath;
      console.log(`✅ Extracted from data.filePath: ${filePath}`);
    }
    // Pattern 4: data.path
    else if (data.path) {
      filePath = data.path;
      console.log(`✅ Extracted from data.path: ${filePath}`);
    }
    // Pattern 5: data.file
    else if (data.file) {
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
      // Remove "/api" suffix from API_BASE_URL safely
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
    console.error(`❌ Backend API upload error: ${errorMessage}`);
    throw new Error(`Backend upload gagal: ${errorMessage}`);
  }
}

// Upload ke local filesystem (hanya untuk development)
async function uploadToLocal(
  file: File,
  folder: string,
  filename: string
): Promise<string> {
  // Path untuk menyimpan file (dinamis berdasarkan folder)
  const uploadDir = join(process.cwd(), "public", "images", folder);
  const filepath = join(uploadDir, filename);

  // Buat direktori jika belum ada
  await mkdir(uploadDir, { recursive: true });

  // Konversi file ke buffer dan simpan
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filepath, buffer);

  // Return full path dengan format: /images/{folder}/{filename}
  const publicPath = `/images/${folder}/${filename}`;
  console.log(`✅ Local file uploaded: ${publicPath}`);

  return publicPath;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    // Validasi folder (security: hanya izinkan folder tertentu)
    const allowedFolders = [
      "pemerintahan",
      "bumdes",
      "galeri",
      "apbdes",
      "general",
    ];
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json(
        { error: `Folder tidak valid. Hanya: ${allowedFolders.join(", ")}` },
        { status: 400 }
      );
    }

    // Validasi tipe file
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Format file harus JPG, PNG, GIF, atau WebP" },
        { status: 400 }
      );
    }

    // Validasi ukuran file (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Ukuran file tidak boleh lebih dari 5MB" },
        { status: 400 }
      );
    }

    // Generate nama file unik
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const extension = file.name.split(".").pop() || "jpg";
    const basename = file.name.split(".").slice(0, -1).join(".") || "file";
    const filename = `${basename}-${timestamp}-${random}.${extension}`;

    let filePath: string;

    // Pilih upload method berdasarkan API URL
    if (shouldUseBackendAPI()) {
      console.log("📤 Uploading to Backend API");
      filePath = await uploadToBackendAPI(file, folder);
    } else {
      console.log("📤 Uploading to local filesystem");
      filePath = await uploadToLocal(file, folder, filename);
    }

    return NextResponse.json(
      {
        success: true,
        filePath: filePath,
        path: filePath,
        filename: filename,
        folder: folder,
        publicPath: filePath,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal mengupload file";

    console.error(
      `❌ Upload endpoint error: ${errorMessage}`,
      error instanceof Error ? error.stack : ""
    );

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
