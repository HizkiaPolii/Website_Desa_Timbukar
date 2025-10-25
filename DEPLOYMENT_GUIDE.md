# 📋 Panduan Deployment Desa Timbukar Website

## 1. Pre-Deployment Checklist

### 1.1 Environment Variables

- [ ] Cek `.env` atau `.env.local` tidak di-commit ke Git
- [ ] Pastikan `.env.local` ada di `.gitignore`

```bash
# .gitignore harus berisi:
.env.local
.env.*.local
```

### 1.2 Production Environment Variables

Saat production, set variable berikut di platform hosting:

```bash
# Required
NEXT_PUBLIC_API_URL=https://api.domain-anda.com/api

# Optional (sesuaikan kebutuhan)
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_DEBUG=false
```

**Penting**: URL harus `https://` untuk production (secure)

---

## 2. Build & Testing Sebelum Deploy

### 2.1 Build Production

```bash
npm run build
```

### 2.2 Test Production Build Locally

```bash
npm run build
npm start
```

Cek di `http://localhost:3000` apakah semua berjalan lancar.

---

## 3. Platform Hosting

### Option A: Vercel (Recommended - Platform Next.js)

**Setup:**

1. Push code ke GitHub
2. Buka https://vercel.com
3. Login dengan GitHub
4. Import repository
5. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL` = URL API production

**Konfigurasi:**

- Framework: Next.js
- Root Directory: `/` (default)
- Build Command: `npm run build` (default)

**Deployment:**

- Otomatis deploy saat push ke `main` atau `master` branch

---

### Option B: Netlify

**Setup:**

1. Connect GitHub repository
2. Build Settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

**Issue dengan Netlify:**

- Netlify tidak sempurna untuk Next.js server functions
- Hanya bisa untuk static export (limited)

**Rekomendasi**: Gunakan Vercel untuk hasil terbaik

---

### Option C: Self-Hosting (VPS/Dedicated Server)

#### 3C.1 Setup Server (Ubuntu/Debian)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v20 LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx
```

#### 3C.2 Clone & Setup Project

```bash
# Buat user untuk aplikasi
sudo useradd -m -s /bin/bash desa-app

# Navigate ke home user
cd /home/desa-app

# Clone repository
git clone https://github.com/HizkiaPolii/Website_Desa_Timbukar.git
cd Website_Desa_Timbukar

# Install dependencies
npm install

# Buat .env.production
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://api.domain-anda.com/api
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_DEBUG=false
EOF

# Build
npm run build

# Start dengan PM2
pm2 start "npm start" --name "desa-timbukar"
pm2 startup
pm2 save
```

#### 3C.3 Setup Nginx Reverse Proxy

```bash
# Buat file konfigurasi Nginx
sudo nano /etc/nginx/sites-available/default
```

```nginx
upstream desa_app {
    server localhost:3000;
}

server {
    listen 80;
    server_name domain-anda.com www.domain-anda.com;

    location / {
        proxy_pass http://desa_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

#### 3C.4 Setup SSL Certificate (HTTPS)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate certificate (otomatis update nginx config)
sudo certbot --nginx -d domain-anda.com -d www.domain-anda.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

#### 3C.5 Update PM2 untuk Auto-Restart

```bash
# Cek status
pm2 status

# Lihat logs
pm2 logs desa-timbukar

# Restart app
pm2 restart desa-timbukar

# Monitor real-time
pm2 monit
```

---

## 4. API Backend Connection

### Important!

Pastikan backend API sudah running dan accessible sebelum frontend di-deploy.

**Development:**

```
Frontend: http://localhost:3000
Backend:  http://localhost:5000/api
```

**Production:**

```
Frontend: https://domain-anda.com
Backend:  https://api.domain-anda.com/api
```

### Checklist Backend:

- [ ] Backend API sudah di-deploy
- [ ] API endpoint accessible dari public
- [ ] CORS sudah dikonfigurasi dengan benar
- [ ] SSL Certificate aktif (HTTPS)
- [ ] Database connection test (jika pakai database)

---

## 5. Troubleshooting

### 5.1 "Token tidak ditemukan" Error

**Cause:** API tidak merespons atau token tidak valid

**Solution:**

```javascript
// Cek console browser (F12)
const token = localStorage.getItem("token");
console.log("Token:", token);

// Cek network tab apakah API call berhasil
```

### 5.2 CORS Error

**Cause:** Backend tidak allow request dari domain frontend

**Solution di Backend:**

```javascript
app.use(
  cors({
    origin: "https://domain-anda.com",
    credentials: true,
  })
);
```

### 5.3 SSL Certificate Error

**Cause:** URL menggunakan `http://` tapi browser require `https://`

**Solution:**

- Pastikan production URL pakai `https://`
- Update `.env.production` dengan URL yang benar
- Rebuild dan redeploy

### 5.4 Build Gagal dengan Memory Error

**Solution untuk self-hosting:**

```bash
# Increase Node memory
export NODE_OPTIONS=--max-old-space-size=2048
npm run build
```

---

## 6. Monitoring & Maintenance

### 6.1 Setup Monitoring

```bash
# Install pm2-web UI
pm2 web

# Akses di http://localhost:9615
```

### 6.2 Regular Backups

```bash
# Backup database (jika ada)
mysqldump -u user -p database > backup_$(date +%Y%m%d).sql

# Backup project code
git push origin master
```

### 6.3 Update Dependencies

```bash
# Check updates
npm outdated

# Update safely
npm update

# Or update specific package
npm install package-name@latest
```

---

## 7. Performance Optimization

### 7.1 Next.js Built-in Optimization

- Image optimization (sudah aktif di project)
- Code splitting (otomatis)
- CSS minification (otomatis)

### 7.2 Additional Optimization

```bash
# Analyze bundle size
npm install -g next-bundle-analyzer

# Generate report
npm run build
```

### 7.3 CDN Setup (Optional)

- Gunakan Cloudflare untuk DDoS protection & caching
- Setup image optimization di Cloudflare

---

## 8. Security Checklist

- [ ] HTTPS aktif (SSL certificate)
- [ ] `.env.local` tidak di-commit
- [ ] Input validation di frontend & backend
- [ ] JWT token expiry properly configured
- [ ] Password hashing di backend (bcrypt)
- [ ] Rate limiting di API
- [ ] CORS properly configured
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS protection (Next.js sudah handle)

---

## 9. Useful Commands

```bash
# Development
npm run dev

# Build production
npm run build

# Start production
npm start

# Lint
npm run lint

# Check bundle
npm run build -- --analyze

# Format code
npm run format
```

---

## 10. Quick Deployment Summary

### Vercel (Easiest)

1. Push ke GitHub
2. Connect ke Vercel
3. Set `NEXT_PUBLIC_API_URL`
4. Deploy! ✅

### Self-Hosting (Full Control)

1. Setup Node.js & Nginx
2. Clone repository
3. Build & start with PM2
4. Setup SSL with Certbot
5. Monitor dengan PM2 Web
6. Done! ✅

---

## Support & Troubleshooting

Jika ada error, cek:

1. Browser console (F12 → Console tab)
2. Network tab (lihat API responses)
3. Server logs (PM2 logs atau terminal)
4. Backend API status

**Debug Mode:**

```bash
# Enable debug
NEXT_PUBLIC_DEBUG=true npm start
```

---

**Last Updated:** October 25, 2025
**Version:** 1.0
