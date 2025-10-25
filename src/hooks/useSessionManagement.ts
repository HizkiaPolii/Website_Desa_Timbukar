"use client";

import { useEffect } from "react";

/**
 * Hook untuk mengelola session management
 * - Auto logout saat tab ditutup
 * - Sync logout antar tab
 * - Session timeout (optional)
 */
export function useSessionManagement() {
  useEffect(() => {
    // Handle window beforeunload - logout ketika tab ditutup
    const handleBeforeUnload = () => {
      // Clear localStorage saat tab ditutup
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    };

    // Handle visibility change - detect ketika tab di-minimize/maximize
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab sedang hidden/tidak aktif
        console.log("Tab sedang tidak aktif");
      } else {
        // Tab sedang aktif kembali
        console.log("Tab aktif kembali");
      }
    };

    // Handle storage change - sync logout antar tab
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" && e.newValue === null) {
        // Token dihapus di tab lain, lakukan refresh
        window.location.reload();
      }
    };

    // Handle page unload - ketika meninggalkan halaman atau menutup tab
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
}
