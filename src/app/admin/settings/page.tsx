"use client";

import { useState, useEffect } from "react";
import { getAdminUser } from "@/utils/auth";
import { Save, AlertCircle } from "lucide-react";

interface AdminUser {
  email: string;
  name: string;
  role: "admin";
}

export default function AdminSettings() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    siteName: "Desa Timbukar",
    siteDescription: "Website resmi Desa Timbukar, Kabupaten Minahasa",
    contactEmail: "admin@timbukar.com",
    contactPhone: "+62 XXX-XXXX-XXXX",
    address: "Jln. Desa Timbukar, Kabupaten Minahasa",
    maintenanceMode: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setIsClient(true);
    const adminUser = getAdminUser();
    setUser(adminUser);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess("");

    try {
      // Simulasi penyimpanan
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simpan ke localStorage
      localStorage.setItem("siteSettings", JSON.stringify(formData));

      setSuccess("Pengaturan berhasil disimpan!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Pengaturan Admin
        </h1>
        <p className="text-gray-600">Kelola pengaturan website Desa Timbukar</p>
      </div>

      {/* Settings Form */}
      <div className="max-w-2xl bg-white rounded-lg shadow-md p-6 md:p-8">
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium flex items-start gap-3">
            <span className="text-lg mt-0.5">✓</span>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informasi Admin */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Login sebagai:</span> {user?.name}{" "}
              ({user?.email})
            </p>
          </div>

          {/* Site Name */}
          <div>
            <label
              htmlFor="siteName"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Nama Website
            </label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={formData.siteName}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
              disabled={isSaving}
            />
          </div>

          {/* Site Description */}
          <div>
            <label
              htmlFor="siteDescription"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Deskripsi Website
            </label>
            <textarea
              id="siteDescription"
              name="siteDescription"
              value={formData.siteDescription}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all resize-none"
              disabled={isSaving}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informasi Kontak
            </h3>
          </div>

          {/* Contact Email */}
          <div>
            <label
              htmlFor="contactEmail"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Kontak
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
              disabled={isSaving}
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label
              htmlFor="contactPhone"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Nomor Telepon
            </label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
              disabled={isSaving}
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Alamat
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all resize-none"
              disabled={isSaving}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem</h3>
          </div>

          {/* Maintenance Mode */}
          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div>
              <label
                htmlFor="maintenanceMode"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Mode Pemeliharaan
              </label>
              <p className="text-xs text-gray-600">
                Aktifkan untuk menutup sementara website untuk pemeliharaan
              </p>
            </div>
            <input
              type="checkbox"
              id="maintenanceMode"
              name="maintenanceMode"
              checked={formData.maintenanceMode}
              onChange={handleChange}
              className="w-6 h-6 text-emerald-600 rounded border-gray-300"
              disabled={isSaving}
            />
          </div>

          {/* Warning */}
          {formData.maintenanceMode && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Peringatan</p>
                <p>
                  Website akan tidak dapat diakses oleh pengunjung saat mode
                  pemeliharaan aktif.
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
            >
              <Save size={20} />
              {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
          </div>
        </form>
      </div>

      {/* Additional Information */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Versi Website</h3>
          <p className="text-sm text-blue-800">v1.0.0</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-2">Status Database</h3>
          <p className="text-sm text-green-800">✓ Terhubung dengan baik</p>
        </div>
      </div>
    </div>
  );
}
