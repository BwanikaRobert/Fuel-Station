#!/bin/bash

# Deployment script for Fuel Station Web App
# Run this script on your VPS server

set -e

echo "🚀 Starting deployment process..."

# Variables
APP_DIR="/var/www/Fuel-Station"
CLIENT_DIR="$APP_DIR/client/retta-web-app"
REPO_URL="https://github.com/BwanikaRobert/Fuel-Station.git"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Checking if repository exists...${NC}"
if [ ! -d "$APP_DIR" ]; then
    echo -e "${YELLOW}Cloning repository...${NC}"
    cd /var/www
    git clone $REPO_URL
else
    echo -e "${GREEN}Repository exists. Pulling latest changes...${NC}"
    cd $APP_DIR
    git pull origin master
fi

echo -e "${YELLOW}📂 Navigating to client directory...${NC}"
cd $CLIENT_DIR

echo -e "${YELLOW}📥 Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

echo -e "${YELLOW}🔄 Restarting PM2 process...${NC}"
if pm2 describe fuel-station > /dev/null 2>&1; then
    pm2 restart fuel-station
    echo -e "${GREEN}✅ Application restarted${NC}"
else
    pm2 start ecosystem.config.js
    pm2 save
    echo -e "${GREEN}✅ Application started${NC}"
fi

echo -e "${YELLOW}🔍 Checking application status...${NC}"
pm2 status fuel-station

echo -e "${GREEN}✨ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Application is running at: http://64.227.168.211${NC}"

echo -e "\n${YELLOW}📊 Useful commands:${NC}"
echo -e "  View logs:    ${GREEN}pm2 logs fuel-station${NC}"
echo -e "  Monitor:      ${GREEN}pm2 monit${NC}"
echo -e "  Restart:      ${GREEN}pm2 restart fuel-station${NC}"
echo -e "  Stop:         ${GREEN}pm2 stop fuel-station${NC}"
