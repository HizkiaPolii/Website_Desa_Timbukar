/**
 * Session Management Configuration
 * File ini berisi konfigurasi untuk idle timeout dan session management
 */

export const SESSION_CONFIG = {
  // Waktu idle sebelum logout (dalam milliseconds)
  IDLE_TIMEOUT: 15 * 60 * 1000, // 15 menit

  // Waktu sebelum warning ditampilkan (dalam milliseconds)
  // Warning ditampilkan 2 menit sebelum logout
  IDLE_WARNING_TIME: 13 * 60 * 1000, // 13 menit

  // Delay sebelum redirect ke login page setelah logout
  LOGOUT_REDIRECT_DELAY: 1000, // 1 detik

  // Aktivitas yang akan mereset timer idle
  TRACKED_ACTIVITIES: [
    "mousedown",
    "mousemove",
    "keypress",
    "scroll",
    "touchstart",
    "wheel",
    "click",
  ],
};

// Opsional: Buat fungsi untuk mendapatkan remaining time
export function getRemainingIdleTime(): number {
  // Bisa digunakan untuk menampilkan countdown di UI
  return SESSION_CONFIG.IDLE_TIMEOUT - SESSION_CONFIG.IDLE_WARNING_TIME;
}

// Opsional: Buat fungsi untuk mendapatkan pesan warning
export function getIdleWarningMessage(): string {
  const minutes = (SESSION_CONFIG.IDLE_TIMEOUT - SESSION_CONFIG.IDLE_WARNING_TIME) / 60 / 1000;
  return `Sesi Anda akan berakhir dalam ${minutes} menit karena inaktivitas`;
}
