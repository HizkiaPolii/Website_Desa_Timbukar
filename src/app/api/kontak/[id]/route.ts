import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const authHeader = request.headers.get("authorization");

    const response = await fetch(`${BACKEND_API_URL}/kontak/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error updating contact status:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui status" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("authorization");

    const response = await fetch(`${BACKEND_API_URL}/kontak/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { error: "Gagal menghapus pesan" },
      { status: 500 }
    );
  }
}
