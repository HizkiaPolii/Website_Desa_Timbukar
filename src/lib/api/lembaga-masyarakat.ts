const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface LembagaMasyarakat {
  id: number;
  nama: string;
  deskripsi: string | null;
  ketua: string | null;
  noTelepon: string | null;
  alamat: string | null;
  gambar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLembagaMasyarakatDto {
  nama: string;
  deskripsi?: string;
  ketua?: string;
  noTelepon?: string;
  alamat?: string;
  gambar?: string;
}

export interface UpdateLembagaMasyarakatDto
  extends CreateLembagaMasyarakatDto {}

// Get token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Get headers with auth token
const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Get all lembaga masyarakat
export async function getAllLembagaMasyarakat(): Promise<LembagaMasyarakat[]> {
  try {
    const response = await fetch(`${API_URL}/lembaga-masyarakat`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch lembaga masyarakat");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching lembaga masyarakat:", error);
    throw error;
  }
}

// Get lembaga masyarakat by ID
export async function getLembagaMasyarakatById(
  id: number
): Promise<LembagaMasyarakat> {
  try {
    const response = await fetch(`${API_URL}/lembaga-masyarakat/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch lembaga masyarakat");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching lembaga masyarakat:", error);
    throw error;
  }
}

// Create lembaga masyarakat
export async function createLembagaMasyarakat(
  payload: CreateLembagaMasyarakatDto
): Promise<LembagaMasyarakat> {
  try {
    const response = await fetch(`${API_URL}/lembaga-masyarakat`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create lembaga masyarakat");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error creating lembaga masyarakat:", error);
    throw error;
  }
}

// Update lembaga masyarakat
export async function updateLembagaMasyarakat(
  id: number,
  payload: UpdateLembagaMasyarakatDto
): Promise<LembagaMasyarakat> {
  try {
    const response = await fetch(`${API_URL}/lembaga-masyarakat/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update lembaga masyarakat");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error updating lembaga masyarakat:", error);
    throw error;
  }
}

// Delete lembaga masyarakat
export async function deleteLembagaMasyarakat(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/lembaga-masyarakat/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete lembaga masyarakat");
    }
  } catch (error) {
    console.error("Error deleting lembaga masyarakat:", error);
    throw error;
  }
}
