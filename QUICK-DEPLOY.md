# Fuel Station - Quick Deployment Commands

## 📋 Prerequisites Check
```bash
node --version    # Should be v18+
npm --version     # Should be 9+
pm2 --version     # Should be installed
nginx -v          # Should be installed
```

## 🚀 One-Command Deployment

### First Time Setup
```bash
ssh root@64.227.168.211
cd ~ && wget https://raw.githubusercontent.com/BwanikaRobert/Fuel-Station/master/setup-vps.sh
chmod +x setup-vps.sh
./setup-vps.sh
```

### Deploy Application
```bash
ssh root@64.227.168.211
cd ~ && wget https://raw.githubusercontent.com/BwanikaRobert/Fuel-Station/master/deploy.sh
chmod +x deploy.sh
./deploy.sh
```

## 🔄 Update Deployment (after code changes)
```bash
ssh root@64.227.168.211
cd /var/www/Fuel-Station
git pull origin master
cd client/retta-web-app
npm install
npm run build
pm2 restart fuel-station
```

## 🛠️ Manual Step-by-Step Deployment

### 1. Connect to VPS
```bash
ssh root@64.227.168.211
```

### 2. Clone Repository
```bash
cd /var/www
git clone https://github.com/BwanikaRobert/Fuel-Station.git
cd Fuel-Station/client/retta-web-app
```

### 3. Install & Build
```bash
npm install
npm run build
```

### 4. Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Configure Nginx
```bash
sudo cp nginx.conf /etc/nginx/sites-available/fuel-station
sudo ln -s /etc/nginx/sites-available/fuel-station /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔍 Monitoring & Logs

### PM2 Commands
```bash
pm2 status                  # Check status
pm2 logs fuel-station       # View logs
pm2 logs fuel-station --lines 100   # Last 100 lines
pm2 monit                   # Real-time monitoring
pm2 restart fuel-station    # Restart app
pm2 stop fuel-station       # Stop app
pm2 delete fuel-station     # Delete app
```

### Nginx Commands
```bash
sudo systemctl status nginx    # Check Nginx status
sudo nginx -t                  # Test configuration
sudo systemctl restart nginx   # Restart Nginx
tail -f /var/log/nginx/fuel-station-access.log   # Access logs
tail -f /var/log/nginx/fuel-station-error.log    # Error logs
```

### System Commands
```bash
htop                # Monitor system resources
df -h               # Check disk space
free -h             # Check memory
netstat -tulpn      # Check ports
```

## 🌐 Access Points

- **Application**: http://64.227.168.211
- **Direct Port**: http://64.227.168.211:3000 (if Nginx not configured)

## 🔐 Environment Variables

Create/Edit environment file:
```bash
nano /var/www/Fuel-Station/client/retta-web-app/.env.local
```

Add variables:
```env
NEXT_PUBLIC_API_URL=http://64.227.168.211/api
# Add more as needed
```

Then restart:
```bash
pm2 restart fuel-station
```

## 🆘 Troubleshooting

### Application won't start
```bash
pm2 logs fuel-station --lines 50
cd /var/www/Fuel-Station/client/retta-web-app
npm run build
pm2 restart fuel-station
```

### Port 3000 already in use
```bash
lsof -i :3000
kill -9 <PID>
pm2 restart fuel-station
```

### Nginx not serving
```bash
sudo nginx -t
sudo systemctl restart nginx
curl http://localhost:3000  # Test if app is running
curl http://localhost       # Test if Nginx is working
```

### Out of memory
```bash
free -h
pm2 restart fuel-station
```

## 📊 Performance Optimization

### Enable Nginx Gzip
Add to nginx.conf:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
gzip_min_length 1000;
```

### PM2 Cluster Mode (if needed)
```bash
pm2 start ecosystem.config.js -i max
```

## 🔄 Backup & Restore

### Backup
```bash
tar -czf fuel-station-backup-$(date +%Y%m%d).tar.gz /var/www/Fuel-Station
```

### Restore
```bash
tar -xzf fuel-station-backup-YYYYMMDD.tar.gz -C /
```

## 🎯 Health Check

```bash
curl http://64.227.168.211
# Should return HTML content
```

## 📱 Mobile Access

Make sure your VPS firewall allows HTTP (port 80):
```bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp  # For HTTPS later
```
