# 🚀 Quick Deployment Guide - Desa Timbukar Website

## Pilih Platform Hosting Anda

### ⚡ **Vercel** (Recommended - Termudah)

Perfect untuk Next.js. Setup hanya 5 menit!

```bash
1. Push code ke GitHub
2. Buka https://vercel.com
3. Login & import repository
4. Set Environment Variable:
   - NEXT_PUBLIC_API_URL=https://api.domain-anda.com/api
5. Click Deploy ✅
```

**Pros:**

- Automatic deployment saat push
- Preview deployment untuk PR
- Serverless functions ready
- Free tier tersedia

**Cons:**

- Perlu GitHub account

---

### 🔧 **Self-Hosting (VPS)**

Kontrol penuh, lebih murah untuk jangka panjang

```bash
1. Sewa VPS (Linode, DigitalOcean, AWS, etc)
2. SSH ke server
3. Follow: DEPLOYMENT_GUIDE.md (bagian 3C)
4. Done!
```

**Pros:**

- Kontrol penuh
- Cheaper untuk production jangka panjang
- Custom configuration

**Cons:**

- Perlu manage server sendiri
- Setup lebih kompleks

---

### 🌐 **Netlify**

Alternatif Vercel (tapi less optimal untuk Next.js)

```bash
1. Connect GitHub repository
2. Build settings:
   - Build: npm run build
   - Deploy: .next
3. Set environment variables
4. Deploy
```

---

## ⚠️ Important Checklist

Sebelum deploy, pastikan:

- [ ] Backend API sudah running di production
- [ ] API URL benar di `.env.production`
- [ ] Build berhasil: `npm run build`
- [ ] Test locally: `npm start`
- [ ] Token authentication bekerja
- [ ] HTTPS aktif (untuk production)

---

## 🔐 Environment Variables

### Development (`.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_DEBUG=true
```

### Production

Set di platform hosting:

```bash
NEXT_PUBLIC_API_URL=https://api.domain-anda.com/api
NEXT_PUBLIC_DEBUG=false
```

**Important:** Jangan share `.env.local`! Sudah di `.gitignore` ✅

---

## 📝 Common Issues & Solutions

### "Token tidak ditemukan" Error

**Fix:** Pastikan backend API running dan accessible

### CORS Error

**Fix:** Backend perlu allow origin dari domain frontend

### Build Error

**Fix:**

```bash
npm install
npm run build
```

### SSL Certificate Error

**Fix:** Update URL ke HTTPS di production env

---

## 📞 Butuh Bantuan?

1. Baca `DEPLOYMENT_GUIDE.md` untuk details lengkap
2. Cek terminal logs: `pm2 logs` (jika self-hosting)
3. Cek browser console (F12 → Console)

---

**Selamat! Website Desa Timbukar siap di-deploy! 🎉**
