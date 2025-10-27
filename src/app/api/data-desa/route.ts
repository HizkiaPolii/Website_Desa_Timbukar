import { NextRequest, NextResponse } from "next/server";

// Tipe data untuk setiap kategori
interface StatisticsData {
  populasi: string;
  kepala_keluarga: string;
  luas_wilayah: string;
  angka_pertumbuhan: string;
  jumlah_bayi: string;
  angka_harapan_hidup: string;
}

interface EducationItem {
  tingkat_pendidikan: string;
  jumlah: number;
  persentase: string;
}

interface GenderItem {
  jenis_kelamin: string;
  jumlah: number;
  persentase: string;
}

interface DemographicsItem {
  kategori_usia: string;
  jumlah: number;
  persentase: string;
}

interface ReligionItem {
  agama: string;
  jumlah: number;
  persentase: string;
}

// Fungsi untuk validasi data statistik utama
function validateStatistics(data: any): { valid: boolean; error?: string } {
  if (!data.populasi || typeof data.populasi !== "string") {
    return { valid: false, error: "Populasi harus diisi" };
  }
  if (!data.kepala_keluarga || typeof data.kepala_keluarga !== "string") {
    return { valid: false, error: "Kepala keluarga harus diisi" };
  }
  if (!data.luas_wilayah || typeof data.luas_wilayah !== "string") {
    return { valid: false, error: "Luas wilayah harus diisi" };
  }
  if (!data.angka_pertumbuhan || typeof data.angka_pertumbuhan !== "string") {
    return { valid: false, error: "Angka pertumbuhan harus diisi" };
  }
  if (!data.jumlah_bayi || typeof data.jumlah_bayi !== "string") {
    return { valid: false, error: "Jumlah bayi harus diisi" };
  }
  if (!data.angka_harapan_hidup || typeof data.angka_harapan_hidup !== "string") {
    return { valid: false, error: "Angka harapan hidup harus diisi" };
  }
  return { valid: true };
}

// Fungsi untuk validasi data distribusi (pendidikan, gender, usia, agama)
function validateDistributionItem(data: any, type: string): { valid: boolean; error?: string } {
  const fieldNames = {
    education: "tingkat_pendidikan",
    gender: "jenis_kelamin",
    demographics: "kategori_usia",
    religion: "agama",
  };

  const fieldName = fieldNames[type as keyof typeof fieldNames] || "";

  if (!data[fieldName] || typeof data[fieldName] !== "string") {
    return { valid: false, error: `${fieldName} harus diisi` };
  }
  if (data.jumlah === undefined || typeof data.jumlah !== "number" || data.jumlah < 0) {
    return { valid: false, error: "Jumlah harus berupa angka positif" };
  }
  if (!data.persentase || typeof data.persentase !== "string") {
    return { valid: false, error: "Persentase harus diisi" };
  }
  return { valid: true };
}

// Handler PUT untuk update statistik utama
async function updateStatistics(data: StatisticsData) {
  try {
    // Implementasi update database
    // Untuk saat ini, return mock response
    return {
      success: true,
      message: "Statistik utama berhasil diperbarui",
      data: data,
    };
  } catch (error) {
    throw new Error("Gagal memperbarui statistik utama");
  }
}

// Handler PUT untuk update education
async function updateEducation(items: EducationItem[]) {
  try {
    // Implementasi update database
    // Untuk saat ini, return mock response
    return {
      success: true,
      message: "Distribusi pendidikan berhasil diperbarui",
      data: items,
    };
  } catch (error) {
    throw new Error("Gagal memperbarui distribusi pendidikan");
  }
}

// Handler PUT untuk update gender
async function updateGender(items: GenderItem[]) {
  try {
    // Implementasi update database
    // Untuk saat ini, return mock response
    return {
      success: true,
      message: "Distribusi jenis kelamin berhasil diperbarui",
      data: items,
    };
  } catch (error) {
    throw new Error("Gagal memperbarui distribusi jenis kelamin");
  }
}

// Handler PUT untuk update demographics
async function updateDemographics(items: DemographicsItem[]) {
  try {
    // Implementasi update database
    // Untuk saat ini, return mock response
    return {
      success: true,
      message: "Distribusi usia berhasil diperbarui",
      data: items,
    };
  } catch (error) {
    throw new Error("Gagal memperbarui distribusi usia");
  }
}

// Handler PUT untuk update religion
async function updateReligion(items: ReligionItem[]) {
  try {
    // Implementasi update database
    // Untuk saat ini, return mock response
    return {
      success: true,
      message: "Distribusi agama berhasil diperbarui",
      data: items,
    };
  } catch (error) {
    throw new Error("Gagal memperbarui distribusi agama");
  }
}

// Main PUT handler
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { kategori, data, items } = body;

    if (!kategori) {
      return NextResponse.json(
        { error: "Kategori harus ditentukan" },
        { status: 400 }
      );
    }

    switch (kategori) {
      case "statistics": {
        const validation = validateStatistics(data);
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error },
            { status: 400 }
          );
        }
        const result = await updateStatistics(data as StatisticsData);
        return NextResponse.json(result);
      }

      case "education": {
        if (!Array.isArray(items)) {
          return NextResponse.json(
            { error: "Items harus berupa array" },
            { status: 400 }
          );
        }
        for (const item of items) {
          const validation = validateDistributionItem(item, "education");
          if (!validation.valid) {
            return NextResponse.json(
              { error: validation.error },
              { status: 400 }
            );
          }
        }
        const result = await updateEducation(items as EducationItem[]);
        return NextResponse.json(result);
      }

      case "gender": {
        if (!Array.isArray(items)) {
          return NextResponse.json(
            { error: "Items harus berupa array" },
            { status: 400 }
          );
        }
        for (const item of items) {
          const validation = validateDistributionItem(item, "gender");
          if (!validation.valid) {
            return NextResponse.json(
              { error: validation.error },
              { status: 400 }
            );
          }
        }
        const result = await updateGender(items as GenderItem[]);
        return NextResponse.json(result);
      }

      case "demographics": {
        if (!Array.isArray(items)) {
          return NextResponse.json(
            { error: "Items harus berupa array" },
            { status: 400 }
          );
        }
        for (const item of items) {
          const validation = validateDistributionItem(item, "demographics");
          if (!validation.valid) {
            return NextResponse.json(
              { error: validation.error },
              { status: 400 }
            );
          }
        }
        const result = await updateDemographics(items as DemographicsItem[]);
        return NextResponse.json(result);
      }

      case "religion": {
        if (!Array.isArray(items)) {
          return NextResponse.json(
            { error: "Items harus berupa array" },
            { status: 400 }
          );
        }
        for (const item of items) {
          const validation = validateDistributionItem(item, "religion");
          if (!validation.valid) {
            return NextResponse.json(
              { error: validation.error },
              { status: 400 }
            );
          }
        }
        const result = await updateReligion(items as ReligionItem[]);
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json(
          { error: "Kategori tidak dikenali" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
