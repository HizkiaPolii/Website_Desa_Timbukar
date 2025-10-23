"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { isAdminLoggedIn } from "@/utils/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // TODO: Uncomment this after testing
    // if (!isAdminLoggedIn()) {
    //   router.push("/login");
    // } else {
    //   setIsAuthorized(true);
    //   setIsLoading(false);
    // }

    // For testing - allow access without login
    setIsAuthorized(true);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-white text-lg">Memuat dashboard admin...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}
