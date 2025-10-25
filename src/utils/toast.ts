import { toast } from "react-toastify";

/**
 * Utility untuk menampilkan toast notifications secara konsisten di seluruh aplikasi
 * Mengganti alert(), confirm(), dan manual alert boxes dengan react-toastify
 */

export const showToast = {
  /**
   * Menampilkan notifikasi sukses
   * @param message Pesan yang ditampilkan
   * @param autoClose Waktu tampil dalam ms (default: 3000ms)
   */
  success: (message: string, autoClose?: number) => {
    toast.success(message, {
      position: "top-right",
      autoClose: autoClose || 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  /**
   * Menampilkan notifikasi error
   * @param message Pesan yang ditampilkan
   * @param autoClose Waktu tampil dalam ms (default: 4000ms)
   */
  error: (message: string, autoClose?: number) => {
    toast.error(message, {
      position: "top-right",
      autoClose: autoClose || 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  /**
   * Menampilkan notifikasi warning
   * @param message Pesan yang ditampilkan
   * @param autoClose Waktu tampil dalam ms (default: 3500ms)
   */
  warning: (message: string, autoClose?: number) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: autoClose || 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  /**
   * Menampilkan notifikasi info
   * @param message Pesan yang ditampilkan
   * @param autoClose Waktu tampil dalam ms (default: 3000ms)
   */
  info: (message: string, autoClose?: number) => {
    toast.info(message, {
      position: "top-right",
      autoClose: autoClose || 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  /**
   * Menampilkan notifikasi loading/promise
   * Gunakan untuk async operations
   */
  loading: (message: string) => {
    return toast.loading(message, {
      position: "top-right",
    });
  },

  /**
   * Update toast yang sedang berjalan
   * @param toastId ID toast dari showToast.loading()
   * @param type Tipe notifikasi: 'success', 'error', 'warning', 'info'
   * @param message Pesan yang ditampilkan
   */
  update: (toastId: string | number, type: "success" | "error" | "warning" | "info", message: string) => {
    toast.update(toastId, {
      render: message,
      type: type,
      isLoading: false,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  /**
   * Dismiss/tutup semua toast notifications
   */
  dismissAll: () => {
    toast.dismiss();
  },

  /**
   * Dismiss toast tertentu
   * @param toastId ID dari toast yang ingin ditutup
   */
  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },

  /**
   * Menampilkan konfirmasi dialog yang elegan (mengganti window.confirm())
   * @param message Pesan konfirmasi
   * @param onConfirm Callback saat user mengklik "Ya"
   * @param title Title dari dialog (opsional)
   * @param cancelText Text tombol batal (default: "Batal")
   * @param confirmText Text tombol konfirmasi (default: "Ya")
   */
  confirm: (
    message: string,
    onConfirm: () => void | Promise<void>,
    options?: {
      title?: string;
      cancelText?: string;
      confirmText?: string;
    }
  ) => {
    const defaultOptions = {
      title: "Konfirmasi",
      cancelText: "Batal",
      confirmText: "Ya",
      ...options,
    };

    // Gunakan promise untuk async confirmation
    const confirmPromise = new Promise((resolve) => {
      // Simpan callback untuk di-trigger dari custom confirmation
      const confirmId = `confirm-${Date.now()}`;
      (window as any)[`__toast_confirm_${confirmId}`] = async () => {
        await onConfirm();
        resolve(true);
      };
      (window as any)[`__toast_cancel_${confirmId}`] = () => {
        resolve(false);
      };

      // Untuk sekarang, gunakan window.confirm sebagai fallback
      // Nanti bisa diganti dengan custom modal component
      if (window.confirm(message)) {
        onConfirm();
      }
    });

    return confirmPromise;
  },
};

export default showToast;
