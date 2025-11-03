"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Users,
  Building2,
  FileText,
  Map,
  Images,
  Database,
  DollarSign,
  BookOpen,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { logoutAdmin } from "@/utils/auth";

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  page: string;
}

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const sidebarItems: SidebarItem[] = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: <Home size={20} />,
      page: "dashboard",
    },
    {
      href: "/admin/profil-desa",
      label: "Edit Profil Desa",
      icon: <Building2 size={20} />,
      page: "profil-desa",
    },
    {
      href: "/admin/pemerintahan-desa",
      label: "Edit Pemerintahan Desa",
      icon: <Users size={20} />,
      page: "pemerintahan-desa",
    },
    {
      href: "/admin/lembaga-masyarakat",
      label: "Edit Lembaga Masyarakat",
      icon: <Users size={20} />,
      page: "lembaga-masyarakat",
    },
    {
      href: "/admin/data-desa",
      label: "Edit Data Desa",
      icon: <Database size={20} />,
      page: "data-desa",
    },
    {
      href: "/admin/rkpdesa",
      label: "Edit RKPDESA",
      icon: <FileText size={20} />,
      page: "rkpdesa",
    },
    {
      href: "/admin/galeri",
      label: "Kelola Galeri",
      icon: <Images size={20} />,
      page: "galeri",
    },
    {
      href: "/admin/bumdes",
      label: "Edit BUMDes",
      icon: <Building2 size={20} />,
      page: "bumdes",
    },
    {
      href: "/admin/apbdes",
      label: "Edit APBDes",
      icon: <DollarSign size={20} />,
      page: "apbdes",
    },
    {
      href: "/admin/kontak",
      label: "Pesan Kontak",
      icon: <FileText size={20} />,
      page: "kontak",
    },
  ];

  const handleLogout = () => {
    logoutAdmin();
    window.location.href = "/login";
  };

  const isActive = (page: string) => {
    return pathname.includes(page);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 md:hidden z-50 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 z-30 overflow-y-auto ${
          isOpen ? "w-64" : "w-0"
        } md:w-64`}
      >
        <div className="p-4 md:p-6">
          {/* Sidebar Header */}
          <div className="mb-8 mt-12 md:mt-0">
            <h2 className="text-xl font-bold text-emerald-400">Admin Panel</h2>
            <p className="text-xs text-gray-400 mt-1">Desa Timbukar</p>
          </div>

          {/* Button Kembali ke Homepage */}
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium text-sm"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Kembali ke Homepage</span>
            <span className="sm:hidden">Homepage</span>
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.page}
                href={item.href}
                onClick={() => {
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.page)
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="border-t border-gray-700 my-6" />

          {/* Logout */}
          <nav className="space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="text-sm">Logout</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}
