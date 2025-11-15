# Deployment Guide for VPS Server (64.227.168.211)

## Prerequisites on VPS
1. Node.js (v18 or higher)
2. PM2 (Process Manager)
3. Nginx (Reverse Proxy)
4. Git

## Step 1: Connect to VPS
```bash
ssh root@64.227.168.211
```

## Step 2: Install Required Software

### Update system
```bash
apt update && apt upgrade -y
```

### Install Node.js 20.x
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
node --version
npm --version
```

### Install PM2
```bash
npm install -g pm2
```

### Install Nginx
```bash
apt install nginx -y
systemctl start nginx
systemctl enable nginx
```

### Install Git
```bash
apt install git -y
```

## Step 3: Clone Repository on VPS

```bash
cd /var/www
git clone https://github.com/BwanikaRobert/Fuel-Station.git
cd Fuel-Station/client/retta-web-app
```

## Step 4: Install Dependencies and Build

```bash
npm install
npm run build
```

## Step 5: Configure PM2

The ecosystem.config.js file will manage the application.

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 6: Configure Nginx

Copy the nginx configuration:
```bash
cp nginx.conf /etc/nginx/sites-available/fuel-station
ln -s /etc/nginx/sites-available/fuel-station /etc/nginx/sites-enabled/
```

Test and restart Nginx:
```bash
nginx -t
systemctl restart nginx
```

## Step 7: Configure Firewall

```bash
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw enable
```

## Step 8: Access Application

Your application will be available at:
- http://64.227.168.211

## Optional: Setup Domain and SSL

### If you have a domain (e.g., fuel-station.com):

1. Point your domain A record to: 64.227.168.211

2. Install Certbot for SSL:
```bash
apt install certbot python3-certbot-nginx -y
```

3. Get SSL certificate:
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

4. Update nginx.conf with your domain name

## Useful PM2 Commands

```bash
pm2 list                 # List all applications
pm2 logs fuel-station    # View logs
pm2 restart fuel-station # Restart app
pm2 stop fuel-station    # Stop app
pm2 delete fuel-station  # Delete app
pm2 monit                # Monitor resources
```

## Updating the Application

```bash
cd /var/www/Fuel-Station
git pull origin master
cd client/retta-web-app
npm install
npm run build
pm2 restart fuel-station
```

## Environment Variables

Create `.env.local` file in the project root:
```bash
nano /var/www/Fuel-Station/client/retta-web-app/.env.local
```

Add your environment variables:
```
NEXT_PUBLIC_API_URL=http://64.227.168.211:3001
# Add other environment variables
```

## Troubleshooting

### Check PM2 logs
```bash
pm2 logs fuel-station --lines 100
```

### Check Nginx logs
```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Check if port 3000 is in use
```bash
lsof -i :3000
```

### Restart all services
```bash
pm2 restart all
systemctl restart nginx
```
