import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.desatimbukar.id/api";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/apbdes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching APBDES:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data APBDES" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validasi data
    if (
      !body.tahun ||
      !body.pendapatan ||
      !body.belanja ||
      !body.pembiayaan ||
      !body.file_dokumen
    ) {
      return NextResponse.json(
        {
          error:
            "Data tidak lengkap: tahun, pendapatan, belanja, pembiayaan, dan file_dokumen harus diisi",
        },
        { status: 400 }
      );
    }

    // Validasi tipe data
    if (!body.tahun || isNaN(parseInt(body.tahun))) {
      return NextResponse.json(
        { error: "Tahun harus berupa angka valid" },
        { status: 400 }
      );
    }

    if (!body.pendapatan || isNaN(parseFloat(body.pendapatan))) {
      return NextResponse.json(
        { error: "Pendapatan harus berupa angka valid" },
        { status: 400 }
      );
    }

    if (!body.belanja || isNaN(parseFloat(body.belanja))) {
      return NextResponse.json(
        { error: "Belanja harus berupa angka valid" },
        { status: 400 }
      );
    }

    if (!body.pembiayaan || isNaN(parseFloat(body.pembiayaan))) {
      return NextResponse.json(
        { error: "Pembiayaan harus berupa angka valid" },
        { status: 400 }
      );
    }

    // Validasi gambar (harus berupa URL/string)
    if (typeof body.file_dokumen !== "string" || !body.file_dokumen.trim()) {
      return NextResponse.json(
        { error: "File dokumen harus berupa URL yang valid" },
        { status: 400 }
      );
    }

    const token = request.headers.get("authorization");

    const response = await fetch(`${API_BASE_URL}/apbdes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { authorization: token }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      console.error("Backend API error:", errorResponse);
      throw new Error(
        `Backend API error: ${response.status} - ${errorResponse}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Error creating APBDES:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Gagal menambahkan data APBDES" },
      { status: 500 }
    );
  }
}
