import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { tahun: string } }
) {
  try {
    const { tahun } = params;
    const response = await fetch(`${API_BASE_URL}/apbdes/tahun/${tahun}`, {
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
    console.error("Error fetching APBDES by tahun:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data APBDES" },
      { status: 500 }
    );
  }
}
