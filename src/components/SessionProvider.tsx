"use client";

import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useIdleLogout } from "@/hooks/useIdleLogout";
import { SESSION_CONFIG } from "@/config/sessionConfig";

/**
 * Client-side wrapper untuk session management dan toast notifications
 * - Auto logout saat tab ditutup
 * - Idle timeout (15 menit)
 * - Sync logout antar tab
 * - Activity detection
 */
function SessionProviderContent({ children }: { children: React.ReactNode }) {
  // Setup idle logout hook dengan timeout yang bisa dikonfigurasi
  useIdleLogout({
    idleTime: SESSION_CONFIG.IDLE_TIMEOUT,
    warningTime: SESSION_CONFIG.IDLE_WARNING_TIME,
  });

  useEffect(() => {
    // Handler untuk logout otomatis saat tab ditutup
    const handleBeforeUnload = () => {
      // Jangan clear localStorage saat tab ditutup
      // Biarkan session tetap valid di tab lain
      console.log("Tab ditutup");
    };

    // Handler untuk sync logout antar tab
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" && e.newValue === null) {
        // Token dihapus di tab lain, lakukan refresh
        console.log("Token dihapus di tab lain, melakukan refresh");
        window.location.reload();
      }
    };

    // Tambahkan event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {children}
    </>
  );
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProviderContent>{children}</SessionProviderContent>;
}
