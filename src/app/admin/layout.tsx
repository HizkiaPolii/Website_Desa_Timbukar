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
    <>
      <AdminSidebar />
      <main className="ml-0 md:ml-64 w-full md:w-auto bg-gray-50 min-h-screen pt-16 md:pt-0 overflow-y-auto">
        {children}
      </main>
    </>
  );
}
