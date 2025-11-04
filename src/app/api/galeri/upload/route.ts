import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

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
  formData.append("folder", "galeri");

  try {
    console.log(
      `📤 Uploading Galeri to Backend API: ${API_BASE_URL}/galeri/upload`
    );
    console.log(`   File: ${file.name}, Size: ${file.size} bytes`);

    const response = await fetch(`${API_BASE_URL}/galeri/upload`, {
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
    console.log(`✅ Backend Galeri upload raw response:`, data);

    // Try multiple response format patterns
    let publicPath: string | undefined;

    if (data.url) {
      publicPath = data.url;
      console.log(`✅ Extracted from data.url: ${publicPath}`);
    } else if (data.data?.url) {
      publicPath = data.data.url;
      console.log(`✅ Extracted from data.data.url: ${publicPath}`);
    } else if (data.filePath) {
      publicPath = data.filePath;
      console.log(`✅ Extracted from data.filePath: ${publicPath}`);
    } else if (data.path) {
      publicPath = data.path;
      console.log(`✅ Extracted from data.path: ${publicPath}`);
    } else if (data.file) {
      publicPath = data.file;
      console.log(`✅ Extracted from data.file: ${publicPath}`);
    }

    if (!publicPath) {
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
    let finalPath = publicPath;
    if (publicPath.startsWith("/uploads/")) {
      // Backend return relative path, convert to full URL
      const baseUrl = API_BASE_URL.endsWith("/api")
        ? API_BASE_URL.slice(0, -4) // Remove last 4 chars (/api)
        : API_BASE_URL;
      finalPath = `${baseUrl}${publicPath}`;
      console.log(`🔄 Converted relative path to full URL: ${finalPath}`);
    } else if (!publicPath.startsWith("http")) {
      // Path tidak relative dan bukan http, assume relative
      const baseUrl = API_BASE_URL.endsWith("/api")
        ? API_BASE_URL.slice(0, -4) // Remove last 4 chars (/api)
        : API_BASE_URL;
      finalPath = `${baseUrl}${publicPath}`;
      console.log(`🔄 Converted non-http path to full URL: ${finalPath}`);
    }

    console.log(`✅ Final backend file URL: ${finalPath}`);
    return finalPath;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Backend API Galeri upload error: ${errorMessage}`);
    throw new Error(`Backend upload gagal: ${errorMessage}`);
  }
}

// Upload ke local filesystem (hanya untuk development)
async function uploadToLocal(file: File, filename: string): Promise<string> {
  // Save file to public/uploads/galeri
  const uploadDir = path.join(process.cwd(), "public", "uploads", "galeri");
  await fs.mkdir(uploadDir, { recursive: true });

  const filepath = path.join(uploadDir, filename);
  const buffer = await file.arrayBuffer();
  await fs.writeFile(filepath, Buffer.from(buffer));

  // Return the public path
  const publicPath = `/uploads/galeri/${filename}`;
  console.log(`✅ Local Galeri uploaded: ${publicPath}`);

  return publicPath;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed",
        },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const extension = path.extname(file.name);
    const filename = `galeri-${timestamp}-${random}${extension}`;

    let publicPath: string;

    // Pilih upload method berdasarkan API URL
    if (shouldUseBackendAPI()) {
      console.log("📤 Galeri upload to Backend API");
      publicPath = await uploadToBackendAPI(file);
    } else {
      console.log("📤 Galeri upload to local filesystem");
      publicPath = await uploadToLocal(file, filename);
    }

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        url: publicPath,
        filename: filename,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      {
        error: "Failed to upload file",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
