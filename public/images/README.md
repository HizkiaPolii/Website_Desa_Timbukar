# Folder Penyimpanan Foto Desa Timbukar

Folder ini digunakan untuk menyimpan semua foto yang akan ditampilkan di website Desa Timbukar.

## Cara Menggunakan

1. **Letakkan foto Anda di sini** - Simpan file foto dengan format `.jpg`, `.png`, atau `.webp`

2. **Referensi foto di kode** - Gunakan path relatif dari folder `public/`:
   ```jsx
   <Image
     src="/images/nama-foto-anda.jpg"
     alt="Deskripsi foto"
     fill
     className="object-cover"
   />
   ```

## Foto yang Dibutuhkan

### 1. **Hero Background Image** (Wajib)

- **Filename:** `headerweb.jpg`
- **Ukuran Rekomendasi:** 1920x1080 px atau lebih besar
- **Deskripsi:** Foto pemandangan indah Desa Timbukar (landscape/panorama)
- **Lokasi di Code:** `src/app/page.tsx` - Hero Section (background hero)

### 2. **Foto Hukum Tua Desa** (Wajib)

- **Filename:** `hukum-tua-desa.jpg`
- **Ukuran Rekomendasi:** 400x500 px (portrait)
- **Deskripsi:** Foto hukum tua/kepala desa
- **Lokasi di Code:** `src/app/page.tsx` - Sambutan Hukum Tua Section
- **Tips:** Gunakan foto formal, background netral, dan wajah jelas

### 3. Foto Tambahan (Opsional)

Anda bisa menambahkan foto lain untuk:

- Galeri wisata
- Galeri homestay
- Galeri air terjun
- Galeri arung jeram
- Profil desa
- Dll

## Tips Mengoptimalkan Foto

1. **Ukuran File:** Gunakan foto berukuran tidak lebih dari 500KB untuk performa lebih cepat
2. **Format:** Gunakan `.jpg` untuk foto natural, `.webp` untuk ukuran lebih kecil, `.png` untuk transparansi
3. **Resolusi:** Minimal 1920x1080 px untuk foto hero/background
4. **Aspect Ratio:** Gunakan perbandingan 16:9 untuk hero section

## Cara Mengompresi Foto

Jika foto terlalu besar, gunakan tool online:

- https://tinypng.com (PNG & JPG)
- https://compressor.io (Berbagai format)
- https://squoosh.app (Google, offline-friendly)

## Struktur File yang Disarankan

```
public/
├── images/
│   ├── hero-desa-timbukar.jpg (WAJIB)
│   ├── air-terjun-1.jpg
│   ├── air-terjun-2.jpg
│   ├── homestay-1.jpg
│   ├── arung-jeram-1.jpg
│   └── README.md (file ini)
```

## Contoh Penggunaan di Code

```jsx
import Image from "next/image";

export default function Home() {
  return (
    <Image
      src="/images/hero-desa-timbukar.jpg"
      alt="Desa Timbukar"
      width={1920}
      height={1080}
      className="w-full h-auto"
    />
  );
}
```

---

**Catatan:** Pastikan Anda memiliki hak cipta atau izin untuk menggunakan foto-foto tersebut.
