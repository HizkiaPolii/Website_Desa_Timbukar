"use client";

import { useEffect, useState } from "react";
import { getAdminUser } from "@/utils/auth";
import {
  FileText,
  ImageIcon,
  Users,
  Building2,
  Home,
  BookOpen,
  Phone,
  Zap,
} from "lucide-react";

interface AdminUser {
  email: string;
  name: string;
  role: "admin";
}

interface MenuLink {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
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

  const menuLinks: MenuLink[] = [
    {
      href: "/admin/profil-desa",
      label: "Profil Desa",
      description: "Kelola informasi umum dan profil Desa Timbukar",
      icon: <Home size={32} />,
      color: "bg-blue-500",
    },
    {
      href: "/admin/pemerintahan-desa",
      label: "Pemerintahan Desa",
      description: "Kelola data perangkat dan struktur pemerintahan desa",
      icon: <Building2 size={32} />,
      color: "bg-green-500",
    },
    {
      href: "/admin/data-desa",
      label: "Data Desa",
      description: "Kelola statistik dan data demografis desa",
      icon: <Zap size={32} />,
      color: "bg-yellow-500",
    },
    {
      href: "/admin/galeri",
      label: "Galeri",
      description: "Kelola foto dan gambar di galeri website",
      icon: <ImageIcon size={32} />,
      color: "bg-purple-500",
    },
    {
      href: "/admin/lembaga-masyarakat",
      label: "Lembaga Masyarakat",
      description: "Kelola organisasi dan lembaga masyarakat di desa",
      icon: <Users size={32} />,
      color: "bg-indigo-500",
    },
    {
      href: "/admin/kontak",
      label: "Kontak Desa",
      description: "Kelola informasi kontak pemerintahan desa",
      icon: <Phone size={32} />,
      color: "bg-red-500",
    },
    {
      href: "/admin/apbdes",
      label: "APBDES",
      description: "Kelola anggaran pendapatan dan belanja desa",
      icon: <FileText size={32} />,
      color: "bg-orange-500",
    },
    {
      href: "/admin/rkpdesa",
      label: "RKP Desa",
      description: "Kelola rencana kerja pemerintah desa",
      icon: <BookOpen size={32} />,
      color: "bg-cyan-500",
    },
    {
      href: "/admin/bumdes",
      label: "BUMDes",
      description: "Kelola badan usaha milik desa",
      icon: <Building2 size={32} />,
      color: "bg-pink-500",
    },
  ];

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Dashboard Admin
            </h1>
            <p className="text-gray-600 text-lg">
              Selamat datang kembali,{" "}
              <span className="font-bold text-indigo-600">{user?.name}</span>!
              👋
            </p>
          </div>
          <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-2xl">
            ⚙️
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Kelola semua aspek website Desa Timbukar dari sini. Pilih menu di
          bawah untuk memulai.
        </p>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
        {menuLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 p-6 flex flex-col items-center text-center border border-gray-100 hover:border-indigo-300"
          >
            {/* Background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

            {/* Icon Container */}
            <div
              className={`${link.color} text-white w-20 h-20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-125 transition-transform duration-300 shadow-lg`}
            >
              {link.icon}
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
              {link.label}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
              {link.description}
            </p>

            {/* Hover indicator */}
            <div className="mt-4 w-8 h-0.5 bg-gradient-to-r from-transparent via-indigo-600 to-transparent group-hover:w-12 transition-all duration-300" />
          </a>
        ))}
      </div>

      {/* Bottom Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info Card 1 */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-xl p-8 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-2xl font-bold mb-3">Kelola Konten</h3>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Update informasi desa, galeri foto, profil pemerintahan, dan
              dokumen penting dengan mudah melalui menu yang tersedia.
            </p>
          </div>
        </div>

        {/* Info Card 2 */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="text-4xl mb-3">�</div>
            <h3 className="text-2xl font-bold mb-3">Tingkatkan Website</h3>
            <p className="text-purple-100 text-sm leading-relaxed">
              Optimalkan konten, tambahkan media, dan kelola data untuk membuat
              website desa semakin menarik dan informatif.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Tip */}
      <div className="mt-12 p-6 bg-white rounded-2xl shadow-md border-l-4 border-indigo-500">
        <div className="flex items-start gap-4">
          <div className="text-3xl">💡</div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Tip Penggunaan</h4>
            <p className="text-sm text-gray-600">
              Gunakan breadcrumb navigation di setiap halaman untuk kembali ke
              dashboard. Pastikan semua perubahan data disimpan sebelum
              meninggalkan halaman. Hubungi administrator jika mengalami
              kesulitan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
