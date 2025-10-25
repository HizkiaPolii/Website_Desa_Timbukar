# 🔧 Production Troubleshooting Guide

## Common Issues & Solutions

### ❌ Problem: "Token tidak ditemukan" Error

**Symptoms:**

- Error muncul saat login atau menghapus data
- Status code: 401 Unauthorized

**Causes:**

1. Backend API tidak running
2. Token tidak dikirim dengan header
3. Token sudah expired
4. CORS tidak configured

**Solutions:**

```bash
# 1. Check backend API status
curl https://api.domain-anda.com/api/health

# 2. Check browser localStorage
# Open DevTools (F12) → Console
localStorage.getItem("token")

# 3. Check network request
# Open DevTools → Network tab
# Look for Authorization header in request

# 4. Check backend logs
pm2 logs backend-app
```

---

### ❌ Problem: CORS Error

**Symptoms:**

```
Access to XMLHttpRequest at 'https://api...' from origin 'https://...'
has been blocked by CORS policy
```

**Solution di Backend:**

```javascript
// Add this ke Express backend
const cors = require("cors");

app.use(
  cors({
    origin: ["https://domain-anda.com", "https://www.domain-anda.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

---

### ❌ Problem: 502 Bad Gateway

**Symptoms:**

- Error message: "502 Bad Gateway"
- Website tidak bisa diakses

**Causes:**

1. Next.js app crashed
2. Nginx/reverse proxy error
3. Backend API down

**Solutions:**

```bash
# Check app status
pm2 status

# Restart app
pm2 restart desa-timbukar

# Check logs
pm2 logs desa-timbukar --lines 50

# Check Nginx status
sudo systemctl status nginx

# If needed, restart Nginx
sudo systemctl restart nginx

# Check if port 3000 is listening
lsof -i :3000
```

---

### ❌ Problem: Out of Memory Error

**Symptoms:**

```
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed
JavaScript heap out of memory
```

**Solutions:**

```bash
# Increase Node memory limit
export NODE_OPTIONS=--max-old-space-size=2048

# Restart app
pm2 restart desa-timbukar

# Or set permanent di PM2 config
pm2 start "node --max-old-space-size=2048 node_modules/.bin/next start" --name desa-timbukar
```

---

### ❌ Problem: Slow Loading / Timeout

**Symptoms:**

- Page load very slow
- API calls timeout

**Causes:**

1. Slow network/server
2. Database query slow
3. Large payload

**Solutions:**

```bash
# Check server CPU & memory
top
free -m

# Check disk space
df -h

# Monitor with PM2
pm2 monit

# Check API response time
curl -w "@curl-format.txt" https://api.domain-anda.com/api/endpoint

# Optimize backend queries (in your backend code)
# - Add database indexes
# - Use pagination
# - Implement caching
```

---

### ❌ Problem: SSL Certificate Expired

**Symptoms:**

- Browser warning: "Not Secure"
- ERR_CERT_DATE_INVALID

**Solutions:**

```bash
# Check certificate expiry
openssl s_client -connect domain-anda.com:443 -showcerts 2>/dev/null | openssl x509 -noout -dates

# Renew with Certbot
sudo certbot renew

# Or manual renew if auto-renewal failed
sudo certbot certonly --nginx -d domain-anda.com -d www.domain-anda.com --force-renewal

# Verify renewal worked
sudo systemctl restart nginx
```

---

### ❌ Problem: Database Connection Error

**Symptoms:**

```
Error: connect ECONNREFUSED 127.0.0.1:5432
Error: Access denied for user 'root'@'localhost'
```

**Solutions:**

```bash
# Check if database service running
sudo systemctl status mysql
# or
sudo systemctl status postgresql

# Start database if not running
sudo systemctl start mysql

# Check database credentials
# Verify in backend .env file
cat .env | grep DB_

# Test database connection
mysql -h localhost -u root -p

# If password wrong, reset it
sudo mysql -u root
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
```

---

### ❌ Problem: Static Files Not Loading (404)

**Symptoms:**

- Images/CSS/JS returning 404
- Styling looks broken

**Solutions:**

```bash
# Check public folder exists
ls -la public/

# Check Next.js cache
rm -rf .next
npm run build

# Restart app
pm2 restart desa-timbukar

# Check Nginx config
cat /etc/nginx/sites-available/default

# Should include:
location /_next/static/ {
    proxy_pass http://localhost:3000/_next/static/;
    proxy_cache_valid 30d;
}
```

---

### ❌ Problem: High CPU Usage

**Symptoms:**

- Server slow/unresponsive
- CPU usage 80-100%

**Causes:**

1. Memory leak in app
2. Infinite loop
3. Heavy computation
4. Too many requests

**Solutions:**

```bash
# Monitor CPU usage
watch -n 1 'top -b -n 1 | head -n 15'

# Check which process using CPU
ps aux --sort=-%cpu | head

# If it's Node app, check logs for errors
pm2 logs desa-timbukar --err

# If memory leak suspected, restart regularly
pm2 restart desa-timbukar
pm2 restart desa-timbukar --cron "0 */6 * * *"  # Restart every 6 hours

# Add monitoring alert
pm2 start app.js --max-memory-restart 200M  # Auto-restart if exceed 200MB
```

---

### ❌ Problem: Can't Login

**Symptoms:**

- Always show "Invalid credentials"
- Even correct password rejected

**Causes:**

1. Backend API not responding
2. Database connection error
3. Password hashing issue

**Solutions:**

```bash
# Test backend login endpoint
curl -X POST https://api.domain-anda.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Check backend logs
pm2 logs backend-app

# Verify database has user data
mysql> SELECT * FROM users;

# If password hash wrong, reset password in database
mysql> UPDATE users SET password = SHA2('newpassword', 256) WHERE username='admin';
```

---

### ❌ Problem: Data Not Saving

**Symptoms:**

- Form submitted tapi data tidak save
- No error message shown

**Causes:**

1. Backend validation error
2. Database permission issue
3. Unhandled API error

**Solutions:**

```bash
# Check browser DevTools Network tab
# Look for POST/PUT request
# Check response for error message

# Check backend logs
pm2 logs backend-app

# Test API endpoint with curl
curl -X POST https://api.domain-anda.com/api/endpoint \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nama":"test"}'

# Check database permissions
mysql> SHOW GRANTS FOR 'app_user'@'localhost';

# If needed, grant permissions
mysql> GRANT ALL PRIVILEGES ON database_name.* TO 'app_user'@'localhost';
```

---

### ❌ Problem: Mobile Site Not Working

**Symptoms:**

- Works on desktop tapi error di mobile
- Touch events not working

**Solutions:**

```bash
# Test responsive design
# Open DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M)
# Test di different screen sizes

# Check viewport meta tag di _document.tsx
<meta name="viewport" content="width=device-width, initial-scale=1" />

# Test touch events
# Install React DevTools extension

# Check mobile browser console
# Safari iOS: Settings → Safari → Advanced → Web Inspector
# Chrome Android: chrome://inspect

# Common mobile issues:
# - Slow network: add loading states
# - Large images: use Next.js Image optimization
# - Long forms: make responsive
```

---

### ❌ Problem: Build Fails in Production

**Symptoms:**

```
Build failed! Exit with code 1
Error: Cannot find module '@/components/...'
```

**Solutions:**

```bash
# Clear cache
rm -rf node_modules .next
npm install

# Rebuild
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Look at build output carefully
npm run build 2>&1 | tee build.log

# If ESLint error
npm run lint

# Fix all auto-fixable errors
npm run lint -- --fix
```

---

## Remote Debugging

### Setup SSH Access

```bash
# Connect ke server
ssh user@domain-anda.com

# Or dengan private key
ssh -i /path/to/key.pem user@domain-anda.com

# Useful SSH commands
ssh user@domain -L 3000:localhost:3000
# Now access http://localhost:3000 locally but connect to remote

# Copy files from server
scp user@domain:/home/app/logs.txt ./
```

### Real-time Monitoring

```bash
# Monitor logs real-time
pm2 logs desa-timbukar --follow

# Monitor CPU/Memory real-time
pm2 monit

# Watch specific process
watch -n 1 'pm2 status'
```

---

## Emergency Procedures

### Server Critical - Need Immediate Fix

```bash
# 1. Stop app to prevent data corruption
pm2 stop desa-timbukar

# 2. Back up current state
tar -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz /home/desa-app/

# 3. Check what's wrong
pm2 logs desa-timbukar --lines 100

# 4. Fix the issue (update code, env, etc)
cd /home/desa-app/Website_Desa_Timbukar
git pull origin master  # If pushing fix
npm install
npm run build

# 5. Start app again
pm2 start desa-timbukar

# 6. Verify it's working
curl https://domain-anda.com
```

### Database Corruption - Restore from Backup

```bash
# 1. Stop app
pm2 stop desa-timbukar

# 2. Find backup
ls -lah /backup/

# 3. Restore database
mysql -u root -p < /backup/db_20251025.sql

# 4. Verify restore
mysql> SELECT COUNT(*) FROM table_name;

# 5. Start app
pm2 start desa-timbukar
```

---

## Preventive Maintenance

### Weekly

- [ ] Check disk space: `df -h`
- [ ] Check logs for errors: `pm2 logs --err`
- [ ] Verify backups created

### Monthly

- [ ] Update dependencies: `npm update`
- [ ] Check security patches
- [ ] Test backup restore
- [ ] Review error logs for patterns

### Quarterly

- [ ] Performance audit
- [ ] Security scan
- [ ] Update SSL certificate before expiry
- [ ] Database maintenance

---

**Last Updated:** October 25, 2025
**Emergency Contact:** your-email@domain.com
