import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Optional: Verify auth token if needed
    // const token = request.headers.get("Authorization");
    // if (!token) {
    //   return NextResponse.json(
    //     { error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general"; // Ambil folder dari request

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    // Validasi folder (security: hanya izinkan folder tertentu)
    const allowedFolders = ["pemerintahan", "bumdes", "galeri", "general"];
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

    // Generate nama file unik dengan prefix folder
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `${folder}-${timestamp}-${random}.${extension}`;

    // Path untuk menyimpan file (dinamis berdasarkan folder)
    const uploadDir = join(process.cwd(), "public", "images", folder);
    const filepath = join(uploadDir, filename);

    // Buat direktori jika belum ada
    await mkdir(uploadDir, { recursive: true });

    // Konversi file ke buffer dan simpan
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return path relatif untuk digunakan di frontend
    const publicPath = `/images/${folder}/${filename}`;

    console.log(`File uploaded: ${publicPath}`);

    return NextResponse.json(
      {
        success: true,
        filePath: publicPath,
        filename: filename,
        folder: folder,
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
