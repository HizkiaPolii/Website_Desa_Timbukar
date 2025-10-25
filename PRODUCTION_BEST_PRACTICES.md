# 🛡️ Production Best Practices - Desa Timbukar

## 1. Environment Configuration

### ✅ DO

```bash
# .env.production (production only)
NEXT_PUBLIC_API_URL=https://api.domain-anda.com/api
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_API_TIMEOUT=10000
```

### ❌ DON'T

```bash
# Jangan expose secret keys di client-side
NEXT_PUBLIC_SECRET_KEY=xxxxx  ❌
NEXT_PUBLIC_PRIVATE_KEY=xxxx  ❌

# Jangan commit .env.local
git add .env.local  ❌
```

---

## 2. Security Checklist

### API Calls

- ✅ Selalu send token di header (sudah fixed)
- ✅ Use HTTPS everywhere
- ✅ Validate semua input sebelum send ke API
- ✅ Handle token expiry properly

### Data Storage

- ✅ Jangan simpan password di localStorage
- ✅ Token hanya di localStorage (OK)
- ✅ Sensitive data handling di server-side

### CORS & Headers

- ✅ Backend harus set CORS correctly
- ✅ Set Content-Security-Policy headers
- ✅ Use secure cookies (HttpOnly flag)

---

## 3. Performance Optimization

### Image Optimization

Next.js Image component sudah:

- ✅ Auto resize berdasarkan viewport
- ✅ Format conversion (WebP jika supported)
- ✅ Lazy loading

### Code Splitting

- ✅ Automatic per-page splitting
- ✅ Dynamic imports untuk large components

### Caching Strategy

```typescript
// Set cache headers di Next.js
export const revalidate = 3600; // ISR - revalidate every hour
```

---

## 4. Monitoring & Logging

### Production Logs

```bash
# Jika pakai PM2
pm2 logs desa-timbukar
pm2 logs desa-timbukar --lines 100  # Last 100 lines
pm2 flush  # Clear logs
```

### Error Tracking

Consider setup error tracking:

- Sentry (recommended)
- LogRocket
- Datadog

### Health Check

```bash
# Add health endpoint di backend
GET /api/health
# Response: { status: "ok" }
```

---

## 5. Database & API

### Connection Pooling

Jika menggunakan database, setup connection pool:

```javascript
// Backend: Setup pool untuk handle multiple connections
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
```

### API Rate Limiting

Setup rate limiting di backend:

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

app.use("/api/", limiter);
```

---

## 6. Backup Strategy

### Regular Backups

```bash
# Database backup (setiap hari)
0 2 * * * mysqldump -u root -p password dbname > /backup/db_$(date +\%Y\%m\%d).sql

# Code backup (git push)
# Already handled via Git

# Storage backup (jika ada file upload)
# Setup incremental backup
```

### Disaster Recovery Plan

- [ ] Document backup procedure
- [ ] Test restore process
- [ ] Keep backups off-site
- [ ] Monitor backup success

---

## 7. SSL/TLS Configuration

### Certificate Management

```bash
# Verify certificate valid
openssl s_client -connect domain-anda.com:443

# Check expiry date
echo | openssl s_client -servername domain-anda.com -connect domain-anda.com:443 2>/dev/null | openssl x509 -noout -dates
```

### Auto-Renewal

```bash
# Certbot auto-renewal (Nginx)
sudo certbot certonly --nginx -d domain-anda.com -d www.domain-anda.com --agree-tos --non-interactive --preferred-challenges=http
```

---

## 8. Performance Metrics

### Measure Core Web Vitals

```javascript
// Add to _document.tsx atau layout.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

export function reportWebVitals(metric) {
  console.log(metric);
  // Send ke analytics service
}
```

### Monitor di Browser

- Lighthouse (Chrome DevTools)
- WebPageTest
- PageSpeed Insights

---

## 9. Deployment Workflow

### Pre-Deployment Checklist

```bash
# 1. Update dependencies
npm install

# 2. Run linter
npm run lint

# 3. Build locally
npm run build

# 4. Test production build
npm start
# Test di http://localhost:3000

# 5. Commit & push
git add .
git commit -m "Production release v1.0"
git push origin master

# 6. Deploy ke hosting
# (Vercel auto-deploy via GitHub, atau manual SSH untuk VPS)
```

### Rollback Plan

```bash
# Jika deploy error:
git revert <commit-hash>
git push origin master
# Automatic redeploy atau manual trigger di hosting panel
```

---

## 10. Team Collaboration

### Environment Separation

```
Development  → http://localhost:5000 (dev server)
Staging      → https://staging.domain-anda.com (test sebelum production)
Production   → https://domain-anda.com (live)
```

### Git Workflow

```bash
# Feature branch
git checkout -b feature/new-feature
# ... make changes ...
git push origin feature/new-feature
# Create Pull Request untuk review

# After merge ke master
# Auto-deploy ke production
```

### Team Documentation

- [ ] Setup guide for new developers
- [ ] API documentation
- [ ] Deployment troubleshooting guide
- [ ] Emergency contacts list

---

## 11. Cost Optimization

### Vercel Pricing

- Free tier: Generous limits
- Pro: $20/month untuk high traffic
- Enterprise: Custom pricing

### Self-Hosting Costs

- VPS: $5-20/month (DigitalOcean, Linode)
- Domain: $10-15/year
- SSL: Free (Certbot)
- **Total: $5-20/month**

### Optimization Tips

- [ ] Use CDN untuk image delivery
- [ ] Gzip compression (automatic)
- [ ] Minify CSS/JS (automatic)
- [ ] Cache strategy optimization

---

## 12. Disaster Recovery Procedures

### Server Down Procedure

```bash
1. Check PM2 status: pm2 status
2. Restart app: pm2 restart desa-timbukar
3. Check logs: pm2 logs
4. If still error, redeploy dari latest code
```

### Database Corruption

```bash
1. Stop app: pm2 stop desa-timbukar
2. Restore from backup
3. Verify data integrity
4. Restart app: pm2 start desa-timbukar
```

### DDoS Attack

```bash
1. Enable Cloudflare protection
2. Set rate limiting rules
3. Block malicious IPs
4. Monitor traffic patterns
```

---

## Quick Checklist for Go-Live

- [ ] Backend API deployed & tested
- [ ] HTTPS certificate active
- [ ] Environment variables configured
- [ ] Build passes without errors
- [ ] Test login functionality
- [ ] Test CRUD operations (Create, Read, Update, Delete)
- [ ] Test on mobile devices
- [ ] Database backup setup
- [ ] Monitoring & logging configured
- [ ] Team trained on deployment process
- [ ] Emergency contacts documented
- [ ] Backup & recovery plan tested

---

**Last Updated:** October 25, 2025
**Status:** Production Ready ✅
