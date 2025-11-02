"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut } from "lucide-react";

interface NavProps {
  currentPage?:
    | "home"
    | "profil"
    | "apb"
    | "kontak"
    | "aparatur"
    | "galeri"
    | "pemerintahan-desa"
    | "lembaga-masyarakat"
    | "data-desa"
    | "metadata"
    | "bumdes"
    | "apbdes"
    | "apbdesa"
    | "rkpdesa"
    | "login";
}

interface NavItem {
  href: string;
  label: string;
  page: string;
}

export default function Navigation({ currentPage = "home" }: NavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{
    email: string;
    name: string;
    role?: string;
  } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }

    // Custom event listener untuk sync state antar tab dan dalam tab yang sama
    const handleUserUpdate = (event: any) => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user data:", e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleUserUpdate);
    window.addEventListener("user-changed", handleUserUpdate);

    return () => {
      window.removeEventListener("storage", handleUserUpdate);
      window.removeEventListener("user-changed", handleUserUpdate);
    };
  }, []);

  const isAdmin = user?.role === "admin";

  // Debug log
  useEffect(() => {
    console.log("Navigation Debug:", { user, isAdmin });
  }, [user, isAdmin]);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsMenuOpen(false);
    // Trigger custom event untuk update Navigation component
    window.dispatchEvent(new Event("user-changed"));

    // Refresh page setelah logout
    setTimeout(() => {
      window.location.href = "/";
    }, 300);
  };

  const isCurrentPage = (page: string) => currentPage === page;

  const navItems: NavItem[] = [
    { href: "/", label: "BERANDA", page: "home" },
    { href: "/profil", label: "PROFIL DESA", page: "profil" },
    {
      href: "/pemerintahan-desa",
      label: "PEMERINTAHAN DESA",
      page: "pemerintahan-desa",
    },
    {
      href: "/lembaga-masyarakat",
      label: "LEMBAGA MASYARAKAT",
      page: "lembaga-masyarakat",
    },
    {
      href: "/data-desa",
      label: "DATA DESA",
      page: "data-desa",
    },
    { href: "/rkpdesa", label: "RKPDESA", page: "rkpdesa" },
    { href: "/bumdes", label: "BUMDES", page: "bumdes" },
    { href: "/apbdes", label: "APBDES", page: "apbdes" },
    { href: "/galeri", label: "GALERI", page: "galeri" },
    { href: "/kontak", label: "KONTAK", page: "kontak" },
  ];

  const renderNavItem = (item: NavItem, isMobile = false) => {
    const isActive = isCurrentPage(item.page);

    return (
      <Link
        key={item.page}
        href={item.href}
        onClick={() => isMobile && setIsMenuOpen(false)}
        className={`transition-all duration-200 text-xs sm:text-sm font-medium ${
          isMobile
            ? "block px-4 py-2 hover:bg-emerald-50"
            : "px-2 sm:px-3 py-2 hover:bg-gray-100 rounded"
        } ${
          isActive
            ? "text-emerald-600 font-semibold bg-emerald-50"
            : "text-gray-700"
        }`}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      {/* Top Bar - Logo */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-700 border-b border-emerald-800">
        <div className="max-w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 sm:py-3">
            <Link href="/" className="flex items-center gap-2 lg:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="Logo Desa Timbukar"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xs sm:text-base md:text-lg font-bold text-white leading-tight">
                  DESA TIMBUKAR
                </h1>
                <p className="text-xs text-emerald-100">Kabupaten Minahasa</p>
              </div>
            </Link>

            {/* Right Section - Dashboard & Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Mobile Menu Button - Top Right */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-emerald-500 text-white transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Navigation Menu */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-full px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-between py-2 md:py-2 flex-wrap gap-2">
            {/* Left Side - Navigation Items */}
            <div className="flex items-center gap-0.5 flex-wrap">
              {navItems.map((item) => renderNavItem(item))}
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex items-center gap-1 lg:gap-2 flex-wrap justify-end">
              {/* Dashboard Button - Show for Admin Only (Desktop) */}
              {isClient && isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="px-2.5 lg:px-3 py-1.5 rounded-md font-semibold text-xs lg:text-sm text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200 whitespace-nowrap"
                >
                  DASHBOARD
                </Link>
              )}

              {/* Login/User Button */}
              {isClient && !user ? (
                <Link
                  href="/login"
                  className="px-2.5 lg:px-3 py-1.5 rounded-md font-semibold text-xs lg:text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 whitespace-nowrap"
                >
                  LOGIN
                </Link>
              ) : isClient && user ? (
                <div className="flex items-center gap-1.5 lg:gap-2">
                  <span className="text-xs lg:text-sm text-gray-700 px-2 py-1.5 rounded-md bg-gray-50 font-medium whitespace-nowrap text-center">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-2.5 lg:px-3 py-1.5 rounded-md font-semibold text-xs lg:text-sm text-white bg-red-500 hover:bg-red-600 transition-all duration-200 whitespace-nowrap flex items-center gap-1"
                  >
                    <LogOut size={14} />
                    <span className="hidden sm:inline">LOGOUT</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-2 border-t border-gray-200 max-h-80 overflow-y-auto">
              <div className="flex flex-col gap-0">
                {navItems
                  .filter((item) => !(isAdmin && item.page === "kontak"))
                  .map((item) => renderNavItem(item, true))}

                {/* Action Buttons - Mobile */}
                <div className="px-4 py-2 border-t border-gray-200 mt-2 pt-4 space-y-2">
                  {/* Dashboard Button - Show for Admin Only (Mobile) */}
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 font-semibold text-sm text-center transition-all duration-200"
                    >
                      DASHBOARD
                    </Link>
                  )}
                </div>

                {/* Mobile Login Button */}
                <div className="px-4 py-2 border-t border-gray-200 mt-2 pt-4">
                  {isClient && !user ? (
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-2 rounded-md font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-center"
                    >
                      LOGIN
                    </Link>
                  ) : isClient && user ? (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-700 px-3 py-2 rounded-md bg-gray-50 font-medium">
                        Halo, {user.name}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 rounded-md font-semibold text-sm text-white bg-red-500 hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <LogOut size={16} />
                        LOGOUT
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
