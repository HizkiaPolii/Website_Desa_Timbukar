"use client";

import { useEffect, useState } from "react";
import { getAdminUser } from "@/utils/auth";
import {
  BarChart3,
  Users,
  FileText,
  ImageIcon,
  TrendingUp,
  Calendar,
} from "lucide-react";

interface AdminUser {
  email: string;
  name: string;
  role: "admin";
}

interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const adminUser = getAdminUser();
    setUser(adminUser);
  }, []);

  const stats: StatCard[] = [
    {
      icon: <Users size={32} />,
      label: "Total Pengguna",
      value: "1,250",
      color: "bg-blue-500",
    },
    {
      icon: <FileText size={32} />,
      label: "Dokumen",
      value: "48",
      color: "bg-green-500",
    },
    {
      icon: <ImageIcon size={32} />,
      label: "Galeri",
      value: "156",
      color: "bg-purple-500",
    },
    {
      icon: <TrendingUp size={32} />,
      label: "Kunjungan Bulan Ini",
      value: "3,842",
      color: "bg-orange-500",
    },
  ];

  if (!isClient) {
    return null;
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Dashboard Admin
        </h1>
        <p className="text-gray-600">
          Selamat datang, {user?.name}! Kelola website Desa Timbukar dari sini.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div
              className={`${stat.color} text-white w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
            >
              {stat.icon}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              {stat.label}
            </h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Aktivitas Terbaru
          </h2>
          <div className="space-y-4">
            {[
              {
                action: "Update Profil Desa",
                time: "2 jam yang lalu",
                icon: "📝",
              },
              {
                action: "Tambah Galeri Baru",
                time: "5 jam yang lalu",
                icon: "🖼️",
              },
              {
                action: "Update Data Pemerintahan",
                time: "1 hari yang lalu",
                icon: "👥",
              },
              {
                action: "Publish RKPDESA",
                time: "3 hari yang lalu",
                icon: "📊",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0"
              >
                <div className="text-2xl">{item.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.action}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="space-y-3">
            <a
              href="/admin/profil-desa"
              className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center"
            >
              Edit Profil Desa
            </a>
            <a
              href="/admin/galeri"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center"
            >
              Kelola Galeri
            </a>
            <a
              href="/admin/pemerintahan-desa"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center"
            >
              Kelola Pemerintahan
            </a>
            <a
              href="/admin/data-desa"
              className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center"
            >
              Data Desa
            </a>
            <a
              href="/admin/bumdes"
              className="block w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center"
            >
              Kelola BUMDes
            </a>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg shadow-md p-6 text-white">
          <Calendar size={32} className="mb-4" />
          <h3 className="text-xl font-bold mb-2">Jadwal Pembaruan</h3>
          <p className="text-emerald-100 text-sm">
            Pastikan untuk memperbarui data desa secara berkala agar informasi
            tetap akurat dan terkini.
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-md p-6 text-white">
          <BarChart3 size={32} className="mb-4" />
          <h3 className="text-xl font-bold mb-2">Laporan & Analitik</h3>
          <p className="text-blue-100 text-sm">
            Pantau performa website dan lihat statistik kunjungan terbaru untuk
            mengoptimalkan konten.
          </p>
        </div>
      </div>
    </div>
  );
}
