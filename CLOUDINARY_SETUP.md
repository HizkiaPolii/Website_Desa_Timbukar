# 🚀 Setup Cloudinary untuk Upload Foto di Vercel

## Masalah

Upload foto gagal di Vercel karena Vercel memiliki **read-only filesystem**. Anda tidak bisa menyimpan file menggunakan `fs.writeFile()` di environment Vercel.

## Solusi

Gunakan **Cloudinary** (cloud storage untuk image) untuk production (Vercel), dan tetap gunakan local filesystem untuk development.

---

## ✅ Step-by-Step Setup

### 1️⃣ Daftar di Cloudinary

1. Buka [cloudinary.com](https://cloudinary.com)
2. Klik "Sign Up" dan daftar gratis
3. Selesaikan verifikasi email
4. Dashboard akan membuka - salin **Cloud Name** dari dashboard

### 2️⃣ Generate API Key dan API Secret

1. Di Cloudinary Dashboard, pergi ke **Settings** (gear icon)
2. Tab **API Keys**
3. Salin:
   - **Cloud Name** (dari URL atau dashboard)
   - **API Key**
   - **API Secret**

### 3️⃣ Buat Upload Preset

1. Di Cloudinary Dashboard, pergi ke **Settings → Upload**
2. Scroll ke **Upload presets**
3. Klik **Create new** → **Add** → **Basic**
4. Nama: `desa_timbukar`
5. **Signing Mode**: Unsigned
6. Klik **Save**

### 4️⃣ Setup Environment Variables

**Untuk Development (.env.local):**

```bash
# Gunakan LOCAL untuk localhost
UPLOAD_METHOD=LOCAL_FILE_SYSTEM
```

**Untuk Vercel (Console Environment Variables):**

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Cara tambah di Vercel:**

1. Buka project di [vercel.com](https://vercel.com)
2. Settings → Environment Variables
3. Tambahkan 3 variabel di atas
4. Redeploy project: `Deployments → Latest → Redeploy`

### 5️⃣ Testing

**Test di localhost:**

```bash
npm run dev
# Upload seharusnya berhasil dan file disimpan di public/images/
```

**Test di Vercel:**

1. Redeploy setelah set environment variables
2. Upload foto - seharusnya berhasil dan disimpan di Cloudinary
3. Verifikasi foto di Cloudinary Dashboard → Media Library

---

## 📊 Architecture

```
Upload Flow:
├─ Local (Development)
│  └─ File → /api/upload → fs.writeFile() → /public/images/{folder}/ → return /images/{folder}/filename
│
└─ Vercel (Production)
   └─ File → /api/upload → Cloudinary API → https://res.cloudinary.com/... → return URL
```

---

## 🔧 Testing Upload

Gunakan Postman atau curl untuk test:

```bash
# Test Local
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/image.jpg" \
  -F "folder=apbdes"

# Response (Local):
{
  "success": true,
  "filePath": "/images/apbdes/image-1761813274085-81674125.jpg"
}

# Response (Vercel/Cloudinary):
{
  "success": true,
  "filePath": "https://res.cloudinary.com/.../desa-timbukar/apbdes/image.jpg"
}
```

---

## 🐛 Troubleshooting

### Upload masih gagal di Vercel

- ✅ Pastikan environment variables sudah di-set di Vercel
- ✅ Pastikan upload preset `desa_timbukar` sudah dibuat
- ✅ Redeploy project setelah set variables
- ✅ Cek console logs di Vercel: Deployment → View Build Logs

### Error: "Cloudinary credentials tidak dikonfigurasi"

- Pastikan 3 environment variables sudah di-set dengan benar:
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

### Upload terlalu lambat

- Cloudinary free tier memiliki upload limit
- Semakin besar file, semakin lambat (optimize ukuran image)
- Pertimbangkan upgrade plan jika traffic tinggi

---

## 📝 File yang diubah

- ✅ `src/app/api/upload/route.ts` - Support Cloudinary & Local
- ✅ `src/utils/uploadHandler.ts` - Helper untuk detect environment
- ✅ `src/components/ImageUploadField.tsx` - Already supports both methods

---

## 🎯 Checklist

- [ ] Daftar Cloudinary
- [ ] Buat Upload Preset `desa_timbukar`
- [ ] Salin Cloud Name, API Key, API Secret
- [ ] Set environment variables di .env.local (local) dan Vercel (production)
- [ ] Test upload di localhost
- [ ] Deploy ke Vercel
- [ ] Test upload di Vercel
- [ ] Verifikasi file di Cloudinary Media Library

Selesai! ✨
