"use client";

import { useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { SESSION_CONFIG } from "@/config/sessionConfig";

interface UseIdleLogoutOptions {
  idleTime?: number; // milliseconds sebelum logout
  warningTime?: number; // milliseconds sebelum warning
  onLogout?: () => void;
  onWarning?: () => void;
}

/**
 * Hook untuk mengelola idle timeout dan auto logout
 * Logout otomatis terjadi setelah user tidak melakukan aktivitas selama waktu yang ditentukan
 * Aktivitas yang dideteksi: mouse move, mouse click, keyboard, scroll, touch, wheel
 */
export function useIdleLogout({
  idleTime = SESSION_CONFIG.IDLE_TIMEOUT,
  warningTime = SESSION_CONFIG.IDLE_WARNING_TIME,
  onLogout,
  onWarning,
}: UseIdleLogoutOptions = {}) {
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const warningShownRef = useRef<boolean>(false);

  // Fungsi untuk logout
  const handleLogout = useCallback(() => {
    try {
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Dispatch event untuk sinkronisasi antar tab
      window.dispatchEvent(new Event("user-changed"));

      // Tampilkan toast
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");

      // Callback
      onLogout?.();

      // Redirect ke login page setelah 1 detik
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [onLogout]);

  // Fungsi untuk reset timer ketika ada aktivitas
  const resetIdleTimer = useCallback(() => {
    // Hanya reset jika user sudah login
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    // Clear timer yang sebelumnya
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);

    warningShownRef.current = false;
    lastActivityRef.current = Date.now();

    // Set warning timer
    warningTimerRef.current = setTimeout(() => {
      if (!warningShownRef.current) {
        warningShownRef.current = true;
        console.warn("Session akan berakhir dalam 2 menit karena inaktivitas");
        toast.warning(
          "Sesi Anda akan berakhir dalam 2 menit karena inaktivitas"
        );
        onWarning?.();
      }
    }, warningTime);

    // Set logout timer
    idleTimerRef.current = setTimeout(() => {
      console.log("User logout karena timeout inaktivitas");
      handleLogout();
    }, idleTime);
  }, [idleTime, warningTime, handleLogout, onWarning]);

  useEffect(() => {
    // Aktivitas listener events - menggunakan config
    const events = SESSION_CONFIG.TRACKED_ACTIVITIES;

    const handleActivity = () => {
      resetIdleTimer();
    };

    // Tambahkan event listener
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Set initial timer
    resetIdleTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, [resetIdleTimer]);

  return {
    lastActivity: lastActivityRef.current,
    resetIdleTimer,
    handleLogout,
  };
}
