# 🚀 Fuel Station - VPS Deployment

Your Next.js application is now ready to deploy to your VPS at **64.227.168.211**

## ⚡ Quick Start (Easiest Method)

### Step 1: Connect to your VPS
```bash
ssh root@64.227.168.211
```

### Step 2: Run the setup script (first time only)
```bash
curl -o- https://raw.githubusercontent.com/BwanikaRobert/Fuel-Station/master/setup-vps.sh | bash
```

### Step 3: Deploy the application
```bash
curl -o- https://raw.githubusercontent.com/BwanikaRobert/Fuel-Station/master/deploy.sh | bash
```

### Step 4: Configure Nginx
```bash
cd /var/www/Fuel-Station/client/retta-web-app
cp nginx.conf /etc/nginx/sites-available/fuel-station
ln -s /etc/nginx/sites-available/fuel-station /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 5: Access your application
Open in browser: **http://64.227.168.211**

---

## 📁 Files Created

1. **DEPLOYMENT.md** - Complete deployment guide
2. **QUICK-DEPLOY.md** - Quick reference commands
3. **setup-vps.sh** - VPS initial setup script
4. **deploy.sh** - Application deployment script
5. **ecosystem.config.js** - PM2 configuration
6. **nginx.conf** - Nginx reverse proxy config
7. **.github/workflows/deploy.yml** - Auto-deployment (optional)

---

## 🎯 What Gets Installed

- ✅ Node.js 20.x
- ✅ PM2 (Process Manager)
- ✅ Nginx (Web Server)
- ✅ Git
- ✅ Firewall Configuration

---

## 🔄 Update Your Application

After pushing new code to GitHub:

```bash
ssh root@64.227.168.211
cd /var/www/Fuel-Station
git pull origin master
cd client/retta-web-app
npm install
npm run build
pm2 restart fuel-station
```

---

## 📊 Monitor Your Application

```bash
# View application logs
pm2 logs fuel-station

# Monitor resources
pm2 monit

# Check status
pm2 status
```

---

## 🔐 Optional: Setup Auto-Deployment with GitHub Actions

1. Generate SSH key on your VPS:
```bash
ssh-keygen -t rsa -b 4096 -C "github-actions"
cat ~/.ssh/id_rsa      # Copy private key
cat ~/.ssh/id_rsa.pub  # Add to authorized_keys
```

2. Add secrets to your GitHub repository:
   - Go to: Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VPS_HOST`: 64.227.168.211
     - `VPS_USERNAME`: root
     - `VPS_SSH_KEY`: (paste private key)

3. Push to master branch - automatic deployment! 🎉

---

## 🌐 Access Points

- **Main Application**: http://64.227.168.211
- **Admin Dashboard**: http://64.227.168.211/admin/dashboard
- **Manager Dashboard**: http://64.227.168.211/manager/dashboard

---

## ⚠️ Important Notes

1. **First commit your changes**:
```bash
git add .
git commit -m "Add deployment configuration"
git push origin master
```

2. **Firewall**: Ports 80 and 22 must be open
3. **Memory**: Minimum 1GB RAM recommended
4. **Storage**: Minimum 10GB free space

---

## 🆘 Need Help?

Check these files:
- **DEPLOYMENT.md** - Detailed step-by-step guide
- **QUICK-DEPLOY.md** - Quick command reference

Monitor logs:
```bash
pm2 logs fuel-station --lines 100
tail -f /var/log/nginx/fuel-station-error.log
```

---

## ✅ Deployment Checklist

- [ ] Commit and push deployment files to GitHub
- [ ] SSH into VPS (ssh root@64.227.168.211)
- [ ] Run setup-vps.sh script
- [ ] Run deploy.sh script
- [ ] Configure Nginx
- [ ] Test application in browser
- [ ] Set up SSL certificate (optional, for HTTPS)
- [ ] Configure auto-deployment (optional)

---

**Ready to deploy? Start with Step 1 above!** 🚀
