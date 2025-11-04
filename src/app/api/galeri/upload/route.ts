import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.desatimbukar.id/api";

// Helper function untuk detect environment
const isVercelEnvironment = (): boolean => {
  return process.env.VERCEL === "1" || process.env.VERCEL_ENV === "production";
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

    const response = await fetch(`${API_BASE_URL}/galeri/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Backend error: ${error.message || error.error || "Upload gagal"}`
      );
    }

    const data = await response.json();
    console.log(`✅ Backend Galeri upload success:`, data);

    // Backend biasanya return URL atau path
    const publicPath = data.url || data.data?.url || data.filePath || data.path;

    if (!publicPath) {
      throw new Error("Backend tidak mengembalikan URL file");
    }

    return publicPath;
  } catch (error) {
    console.error("❌ Backend API Galeri upload error:", error);
    throw error;
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

    // Pilih upload method berdasarkan environment
    if (isVercelEnvironment()) {
      console.log(
        "📤 Galeri upload to Backend API (Vercel environment detected)"
      );
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
