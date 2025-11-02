# Vercel Deployment Setup

## Environment Variables yang diperlukan di Vercel

Untuk deploy di Vercel, Anda perlu set environment variables di Vercel Project Settings. Berikut adalah variable yang harus dikonfigurasi:

### Production Environment Variables

```
NEXT_PUBLIC_API_BASE_URL=http://82.153.226.232:5000/api
```

### Cara Mengatur di Vercel Dashboard:

1. Pergi ke **Project Settings** → **Environment Variables**
2. Pilih **Environment**: Production (atau All jika ingin sama untuk semua)
3. Tambahkan variable:
   - **Name**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: `http://82.153.226.232:5000/api`
4. Klik **Save**
5. **Redeploy** project Anda untuk apply changes

### Penting:
- Pastikan backend API (`http://82.153.226.232:5000`) sudah online
- Pastikan backend sudah enable CORS untuk domain Vercel Anda
- Jika masih error, check backend logs untuk melihat apakah ada koneksi yang ditolak

## API Endpoints yang digunakan:

- `/api/apbdes` - Get/Create APBDES
- `/api/apbdes/[id]` - Get/Update/Delete APBDES by ID
- `/api/apbdes/tahun/[tahun]` - Get APBDES by year
- `/api/galeri` - Gallery endpoints
- `/api/kontak` - Contact form endpoints
- `/api/data-desa` - Village data endpoints
- `/api/rkpdesa` - RKP Desa endpoints

Semua endpoints akan menggunakan `NEXT_PUBLIC_API_BASE_URL` untuk base URL.
