"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { loginUser, logoutUser } from "@/utils/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Validasi input
      if (!email || !password) {
        setError("Email dan password harus diisi");
        setIsLoading(false);
        return;
      }

      if (!email.includes("@")) {
        setError("Format email tidak valid");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password minimal 6 karakter");
        setIsLoading(false);
        return;
      }

      // Panggil backend API
      const response = await loginUser(email, password);

      if (response.success && response.token) {
        // Simpan token dan user data
        localStorage.setItem("token", response.token);
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }

        let redirectUrl = "/";
        // Jika user adalah admin, redirect ke dashboard admin
        if (response.user?.role === "admin") {
          redirectUrl = "/admin/dashboard";
        }

        setSuccess("Login berhasil! Mengalihkan...");

        // Trigger custom event untuk update Navigation component
        setTimeout(() => {
          window.dispatchEvent(new Event("user-changed"));
        }, 100);

        setEmail("");
        setPassword("");

        // Redirect setelah 2 detik
        setTimeout(() => {
          router.push(redirectUrl);
        }, 2000);
      } else {
        setError(response.message || "Login gagal");
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(
        err.message ||
          "Terjadi kesalahan saat login. Pastikan server backend sudah berjalan."
      );
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-8 md:py-12">
      <div className="max-w-md mx-auto px-4">
        {/* Back Button - Simple Top Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100"
          >
            <ArrowLeft size={20} />
            Kembali
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Login
            </h1>
            <p className="text-emerald-100">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium flex items-start gap-3">
                <span className="text-lg mt-0.5">⚠️</span>
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium flex items-start gap-3">
                <span className="text-lg mt-0.5">✓</span>
                {success}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@example.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password Anda"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:shadow-lg disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Memproses...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🔒</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Aman</h3>
            <p className="text-sm text-gray-600">Data Anda terlindungi</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Cepat</h3>
            <p className="text-sm text-gray-600">Akses instan</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">✨</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Mudah</h3>
            <p className="text-sm text-gray-600">Antarmuka sederhana</p>
          </div>
        </div>
      </div>
    </main>
  );
}
