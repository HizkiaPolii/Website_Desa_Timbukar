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
async function uploadToBackendAPI(file: File, folder: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  try {
    console.log(`📤 Uploading to Backend API: ${API_BASE_URL}/upload`);

    const response = await fetch(`${API_BASE_URL}/upload`, {
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
    console.log(`✅ Backend upload success:`, data);

    // Backend biasanya return URL atau path
    const filePath = data.data?.url || data.url || data.filePath || data.path;

    if (!filePath) {
      throw new Error("Backend tidak mengembalikan URL file");
    }

    return filePath;
  } catch (error) {
    console.error("❌ Backend API upload error:", error);
    throw error;
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

    // Pilih upload method berdasarkan environment
    if (isVercelEnvironment()) {
      console.log("📤 Uploading to Backend API (Vercel environment detected)");
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
    console.error("Upload error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Gagal mengupload file";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
