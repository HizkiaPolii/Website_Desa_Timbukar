import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

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
  formData.append("folder", "rkpdesa");

  try {
    console.log(`📤 Uploading PDF to Backend API: ${API_BASE_URL}/upload/pdf`);

    const response = await fetch(`${API_BASE_URL}/upload/pdf`, {
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
    console.log(`✅ Backend PDF upload success:`, data);

    // Backend biasanya return URL atau path
    const filePath = data.data?.url || data.url || data.filePath || data.path;

    if (!filePath) {
      throw new Error("Backend tidak mengembalikan URL file");
    }

    return filePath;
  } catch (error) {
    console.error("❌ Backend API PDF upload error:", error);
    throw error;
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

    // Pilih upload method berdasarkan environment
    if (isVercelEnvironment()) {
      console.log("📤 PDF upload to Backend API (Vercel environment detected)");
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
