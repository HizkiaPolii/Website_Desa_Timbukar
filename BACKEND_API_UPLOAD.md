# 🚀 Upload ke Backend API VPS

## ✅ Solusi Terbaik: Gunakan Backend API Existing

Sudah saya update semua 3 endpoint upload untuk **auto-detect environment** dan upload ke:

- **Local (Development)**: Simpan ke `/public/images/` atau `/public/uploads/` seperti sebelumnya ✓
- **Vercel (Production)**: Upload langsung ke **Backend API di VPS** ✓

---

## 📋 Arsitektur Upload

```
┌─────────────────────────────────────────┐
│        Vercel (Frontend)                │
│  - Upload Form (React Component)        │
│  - /api/upload (Proxy)                  │
│  - /api/upload-pdf (Proxy)              │
│  - /api/galeri/upload (Proxy)           │
└──────────────┬──────────────────────────┘
               │
        Auto-detect environment:
        - Localhost → simpan local
        - Vercel → forward ke backend API
               │
               ▼
┌─────────────────────────────────────────┐
│   Backend API (VPS)                     │
│   https://api.desatimbukar.id/api       │
│                                         │
│  POST /upload              (gambar)     │
│  POST /upload/pdf          (PDF)        │
│  POST /galeri/upload       (galeri)     │
│                                         │
│  → Simpan file di VPS                   │
│  → Return URL ke client                 │
└─────────────────────────────────────────┘
```

---

## ✅ Checklist Backend API Requirements

Pastikan backend API VPS Anda punya endpoint-endpoint ini:

### 1️⃣ **POST /upload** (General Images)

**Digunakan untuk**: APBDES, Pemerintahan, Bumdes, dll

**Request:**

```bash
POST https://api.desatimbukar.id/api/upload
Content-Type: multipart/form-data

- file: File (required)
- folder: string ("apbdes", "pemerintahan", "bumdes", "galeri", "general")
```

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "/images/apbdes/image-1761813274085-81674125.jpg",
    "filename": "image-1761813274085-81674125.jpg"
  }
  // OR simple return
  // "url": "/images/apbdes/image.jpg"
  // "filePath": "/images/apbdes/image.jpg"
  // "path": "/images/apbdes/image.jpg"
}
```

### 2️⃣ **POST /upload/pdf** (PDF Files)

**Digunakan untuk**: RKPDESA files

**Request:**

```bash
POST https://api.desatimbukar.id/api/upload/pdf
Content-Type: multipart/form-data

- file: File (required, PDF only)
```

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "/uploads/rkpdesa/rkpdesa-1761813274085-abc123.pdf",
    "filename": "rkpdesa-1761813274085-abc123.pdf"
  }
}
```

### 3️⃣ **POST /galeri/upload** (Galeri Images)

**Digunakan untuk**: Tambah/Edit Galeri

**Request:**

```bash
POST https://api.desatimbukar.id/api/galeri/upload
Content-Type: multipart/form-data

- file: File (required)
```

**Response:**

```json
{
  "url": "/uploads/galeri/galeri-1761813274085-xyz789.jpg",
  "filename": "galeri-1761813274085-xyz789.jpg"
}
```

---

## 🔍 Backend Response Format

Frontend mengharapkan salah satu format ini:

```typescript
// Format 1 (Recommended):
{
  "data": {
    "url": "...",
    "filename": "..."
  }
}

// Format 2:
{
  "url": "..."
}

// Format 3:
{
  "filePath": "..."
}

// Format 4:
{
  "path": "..."
}
```

**Kuncinya**: Response harus mengandung URL/path dari file yang di-upload!

---

## 🧪 Test Backend API

Sebelum deploy ke Vercel, test backend API Anda:

### Test Image Upload

```bash
curl -X POST https://api.desatimbukar.id/api/upload \
  -F "file=@/path/to/image.jpg" \
  -F "folder=apbdes"
```

### Test PDF Upload

```bash
curl -X POST https://api.desatimbukar.id/api/upload/pdf \
  -F "file=@/path/to/document.pdf"
```

### Test Galeri Upload

```bash
curl -X POST https://api.desatimbukar.id/api/upload/pdf \
  -F "file=@/path/to/galeri.jpg"
```

---

## 🛠️ Setup di Vercel

Pastikan environment variable sudah benar:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.desatimbukar.id/api
```

**Cara set di Vercel:**

1. Buka project di [vercel.com](https://vercel.com)
2. Settings → Environment Variables
3. Pastikan `NEXT_PUBLIC_API_BASE_URL` = Backend API URL Anda
4. Redeploy project

---

## 📝 File yang di-update

✅ `src/app/api/upload/route.ts` - Upload general images
✅ `src/app/api/upload-pdf/route.ts` - Upload PDF files
✅ `src/app/api/galeri/upload/route.ts` - Upload galeri images

Semua sudah support:

- ✅ Localhost → upload ke filesystem lokal
- ✅ Vercel → upload ke backend API VPS

---

## 🚀 Flow Upload di Vercel

```
1. User upload file di Vercel frontend
   ↓
2. Frontend POST /api/upload
   ↓
3. Vercel next.js API route mendeteksi environment = Vercel
   ↓
4. Forward file ke Backend API: https://api.desatimbukar.id/api/upload
   ↓
5. Backend API simpan file di VPS
   ↓
6. Backend return URL file
   ↓
7. Frontend terima URL dan display preview
   ✅ Selesai!
```

---

## 🐛 Troubleshooting

### Upload masih gagal di Vercel

- ✅ Pastikan Backend API bisa diakses dari Vercel
- ✅ Cek CORS setting di Backend API (allow origin dari Vercel)
- ✅ Test API manual dengan curl
- ✅ Cek console logs di Vercel: Deployments → View Build Logs

### Error: "Backend tidak mengembalikan URL file"

- Backend response format tidak sesuai ekspektasi
- Pastikan response return `url`, `filePath`, `path`, atau `data.url`

### Upload lambat

- Tergantung ukuran file dan kecepatan network VPS
- Pastikan VPS tidak overload
- Pertimbangkan optimize file size sebelum upload

---

## 📞 Support

Jika backend API Anda belum punya endpoint upload, minta ke tim backend untuk implement endpoint sesuai format di atas.

Backend harus handle:

1. ✅ Terima file multipart/form-data
2. ✅ Validasi file type & size
3. ✅ Simpan file di VPS storage
4. ✅ Return URL file yang bisa diakses

Semakin cepat ini selesai, semakin cepat upload di Vercel bisa jalan!
