import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

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
