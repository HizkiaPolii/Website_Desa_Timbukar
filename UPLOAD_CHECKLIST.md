# ✅ Checklist Setup Upload Backend API

## 📋 Sebelum Deploy ke Vercel

### 1. Backend API Configuration

- [ ] Backend API endpoint `/upload` sudah ready
- [ ] Backend API endpoint `/upload/pdf` sudah ready  
- [ ] Backend API endpoint `/galeri/upload` sudah ready
- [ ] Backend API bisa menerima multipart/form-data
- [ ] Backend API return response dengan URL file
- [ ] CORS configured untuk accept request dari Vercel domain
- [ ] Backend API bisa diakses dari internet (public endpoint)

### 2. Environment Variables

**Local (.env.local):**
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
# atau sesuaikan dengan backend local Anda
```

**Vercel:**
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.desatimbukar.id/api
# atau sesuaikan dengan backend VPS Anda
```

- [ ] Set environment variable di Vercel Console
- [ ] Variable name: `NEXT_PUBLIC_API_BASE_URL`
- [ ] Variable value: Backend API URL yang benar
- [ ] Redeploy setelah set variable

### 3. Frontend Code

- [ ] ✅ `src/app/api/upload/route.ts` sudah update
- [ ] ✅ `src/app/api/upload-pdf/route.ts` sudah update
- [ ] ✅ `src/app/api/galeri/upload/route.ts` sudah update
- [ ] Semua endpoint sudah auto-detect environment (local vs Vercel)

### 4. Test di Localhost

```bash
npm run dev
# Test upload di admin panel
# - Foto APBDES
# - Foto Galeri
# - PDF RKPDESA

# Cek file tersimpan di:
# - public/images/apbdes/
# - public/images/galeri/
# - public/uploads/rkpdesa/
```

- [ ] Upload gambar di localhost berhasil
- [ ] Upload PDF di localhost berhasil
- [ ] File tersimpan di public folder

### 5. Test di Staging/Production VPS Backend

```bash
curl -X POST https://api.desatimbukar.id/api/upload \
  -F "file=@test.jpg" \
  -F "folder=apbdes"

# Response should contain URL
```

- [ ] Backend API endpoint `/upload` respond OK
- [ ] Backend API endpoint `/upload/pdf` respond OK
- [ ] Backend API endpoint `/galeri/upload` respond OK
- [ ] Response include URL file yang bisa di-access

### 6. Deploy ke Vercel

```bash
git add .
git commit -m "Fix: Update upload endpoints to use backend API"
git push origin master
```

- [ ] Push code ke git
- [ ] Vercel auto-deploy
- [ ] Build success (check Deployments)
- [ ] Environment variables sudah set

### 7. Test di Vercel

1. Buka app di: `https://[project].vercel.app`
2. Login ke admin panel
3. Test upload di halaman:
   - [ ] Admin → APBDES → Upload foto
   - [ ] Admin → Galeri → Upload foto
   - [ ] Admin → RKPDESA → Upload PDF

4. Verifikasi:
   - [ ] Upload berhasil
   - [ ] Foto/PDF muncul di preview
   - [ ] Cek backend API VPS - file sudah tersimpan

### 8. Monitoring

- [ ] Cek Vercel logs: Deployments → View Build Logs
- [ ] Cek backend VPS logs: Upload berjalan normal
- [ ] Monitor storage VPS: Pastikan tidak penuh

---

## 🔧 Troubleshooting Checklist

Jika masih gagal upload di Vercel:

### Debugging Steps

1. **Check Vercel Logs:**
   ```bash
   # Di Vercel Console → Deployments → View Function Logs
   # Cari error message saat upload
   ```

2. **Test Backend API dari Vercel:**
   - Buka Vercel deployment page
   - Buka DevTools Console (F12)
   - Run: 
     ```javascript
     fetch('https://api.desatimbukar.id/api/upload')
     // See if accessible
     ```

3. **Check Backend API:**
   - Verifikasi endpoint: `curl https://api.desatimbukar.id/api/upload`
   - Cek CORS headers
   - Cek server logs

4. **Common Issues:**
   - [ ] CORS Error → Configure CORS di backend
   - [ ] 404 Not Found → Endpoint tidak ada atau URL salah
   - [ ] 500 Internal Error → Backend error, cek backend logs
   - [ ] Timeout → Network issue atau backend slow
   - [ ] ECONNREFUSED → Backend tidak bisa diakses

---

## 📞 Backend Integration Questions

Tanyakan ke tim backend:

1. **API Endpoints**
   - Endpoint `/upload` sudah ada?
   - Endpoint `/upload/pdf` sudah ada?
   - Endpoint `/galeri/upload` sudah ada?

2. **Response Format**
   ```json
   {
     "url": "...",
     // atau
     "data": { "url": "..." },
     // atau
     "filePath": "...",
     // atau
     "path": "..."
   }
   ```
   Mana format yang digunakan?

3. **File Storage**
   - File disimpan di mana? (path/folder)
   - URL file bisa diakses dari internet?
   - Retention policy? (berapa lama file disimpan)

4. **Security**
   - Need authentication? (Bearer token)
   - File type validation?
   - File size limit?

5. **CORS**
   - Sudah configure CORS?
   - Allow origin: `https://*.vercel.app`

---

## ✨ Success Criteria

Upload berhasil jika:

1. ✅ File terupload tanpa error
2. ✅ File tersimpan di VPS backend
3. ✅ URL file bisa diakses
4. ✅ Gambar/PDF muncul di preview
5. ✅ Data database update dengan URL file

Jika semua ✅, upload sudah sempurna! 🎉

---

Generated: 2025-11-04
