#!/bin/bash

# Initial VPS Setup Script
# Run this script once on a fresh VPS

set -e

echo "🔧 Setting up VPS for Fuel Station deployment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}1️⃣ Updating system packages...${NC}"
apt update && apt upgrade -y

echo -e "${YELLOW}2️⃣ Installing Node.js 20.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"
echo -e "${GREEN}✅ NPM version: $(npm --version)${NC}"

echo -e "${YELLOW}3️⃣ Installing PM2...${NC}"
npm install -g pm2
pm2 --version

echo -e "${YELLOW}4️⃣ Installing Nginx...${NC}"
apt install nginx -y
systemctl start nginx
systemctl enable nginx
echo -e "${GREEN}✅ Nginx installed and started${NC}"

echo -e "${YELLOW}5️⃣ Installing Git...${NC}"
apt install git -y
echo -e "${GREEN}✅ Git version: $(git --version)${NC}"

echo -e "${YELLOW}6️⃣ Creating application directory...${NC}"
mkdir -p /var/www
mkdir -p /var/log/pm2

echo -e "${YELLOW}7️⃣ Configuring firewall...${NC}"
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable
echo -e "${GREEN}✅ Firewall configured${NC}"

echo -e "${YELLOW}8️⃣ Setting up PM2 startup...${NC}"
pm2 startup systemd -u root --hp /root
echo -e "${GREEN}✅ PM2 configured to start on boot${NC}"

echo -e "${GREEN}✨ VPS setup completed successfully!${NC}"
echo -e "\n${YELLOW}📝 Next steps:${NC}"
echo -e "  1. Clone your repository to /var/www"
echo -e "  2. Configure nginx (copy nginx.conf)"
echo -e "  3. Run the deployment script"
echo -e "\n${YELLOW}Or simply run:${NC}"
echo -e "  ${GREEN}bash deploy.sh${NC}"
