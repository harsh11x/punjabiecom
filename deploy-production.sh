#!/bin/bash

# Punjab Heritage Production Deployment Script
# Simple deployment for AWS server running on punjabijuttiandfulkari.com

echo "🚀 Starting Punjab Heritage Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AWS_IP="3.111.208.77"
AWS_USER="ubuntu"
DOMAIN="punjabijuttiandfulkari.com"
APP_DIR="punjab-heritage"

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo "Domain: $DOMAIN"
echo "Server: $AWS_IP"
echo "User: $AWS_USER"
echo "App Directory: $APP_DIR"
echo ""

# Check if we can connect to the server
echo -e "${YELLOW}🔍 Testing server connection...${NC}"
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes $AWS_USER@$AWS_IP exit 2>/dev/null; then
    echo -e "${RED}❌ Cannot connect to server. Please check your SSH configuration.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Server connection successful${NC}"

# Create deployment package
echo -e "${YELLOW}📦 Creating deployment package...${NC}"
tar -czf punjab-heritage-production.tar.gz \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=.git \
    --exclude=*.log \
    --exclude=.env.local \
    --exclude=backend-server.js \
    --exclude=deploy-aws.sh \
    --exclude=vercel.json \
    --exclude=SPLIT_DEPLOYMENT_GUIDE.md \
    .

echo -e "${GREEN}✅ Deployment package created${NC}"

# Upload to server
echo -e "${YELLOW}📤 Uploading to server...${NC}"
scp punjab-heritage-production.tar.gz $AWS_USER@$AWS_IP:~/

# Deploy on server
echo -e "${YELLOW}🚀 Deploying on server...${NC}"
ssh $AWS_USER@$AWS_IP << ENDSSH
    # Colors for remote output
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    NC='\033[0m'

    echo -e "\${BLUE}🔧 Setting up deployment...${NC}"
    
    # Create app directory
    mkdir -p ~/$APP_DIR
    cd ~/$APP_DIR

    # Stop existing process if running
    echo -e "\${YELLOW}🛑 Stopping existing application...${NC}"
    pkill -f "node server.js" 2>/dev/null || true
    sleep 2

    # Extract new files
    echo -e "\${YELLOW}📦 Extracting application files...${NC}"
    tar -xzf ~/punjab-heritage-production.tar.gz

    # Install Node.js if not installed
    if ! command -v node &> /dev/null; then
        echo -e "\${YELLOW}📥 Installing Node.js...${NC}"
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi

    # Install PM2 if not installed
    if ! command -v pm2 &> /dev/null; then
        echo -e "\${YELLOW}📥 Installing PM2...${NC}"
        sudo npm install -g pm2
    fi

    # Copy production environment
    if [ -f .env.production ]; then
        cp .env.production .env
        echo -e "\${GREEN}✅ Production environment configured${NC}"
    else
        echo -e "\${RED}⚠️  .env.production not found, using defaults${NC}"
    fi

    # Install dependencies
    echo -e "\${YELLOW}📥 Installing dependencies...${NC}"
    npm install --production

    # Build the application
    echo -e "\${YELLOW}🔨 Building application...${NC}"
    npm run build

    # Start with PM2
    echo -e "\${YELLOW}🚀 Starting Punjab Heritage...${NC}"
    pm2 stop punjab-heritage 2>/dev/null || true
    pm2 delete punjab-heritage 2>/dev/null || true
    
    NODE_ENV=production pm2 start server.js --name punjab-heritage

    # Save PM2 configuration
    pm2 save
    pm2 startup

    # Show status
    echo -e "\${GREEN}✅ Deployment completed!${NC}"
    pm2 status

    # Show recent logs
    echo -e "\${BLUE}📋 Application logs:${NC}"
    pm2 logs punjab-heritage --lines 10

    # Cleanup
    rm ~/punjab-heritage-production.tar.gz

    echo -e "\${GREEN}🎉 Punjab Heritage is now running!${NC}"
    echo -e "\${BLUE}🌐 Website: https://$DOMAIN${NC}"
    echo -e "\${BLUE}🔍 Server: http://$AWS_IP:3001${NC}"

ENDSSH

# Cleanup local files
rm punjab-heritage-production.tar.gz

# Test the deployment
echo -e "${YELLOW}🧪 Testing deployment...${NC}"
sleep 5

# Test server response
if curl -f -s "http://$AWS_IP:3001" > /dev/null; then
    echo -e "${GREEN}✅ Server is responding!${NC}"
else
    echo -e "${RED}❌ Server test failed${NC}"
    echo -e "${YELLOW}📋 Checking server logs...${NC}"
    ssh $AWS_USER@$AWS_IP "pm2 logs punjab-heritage --lines 20"
fi

echo ""
echo -e "${GREEN}🎉 Production Deployment Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Your Punjab Heritage website is now live:${NC}"
echo -e "${GREEN}🌐 Website: https://$DOMAIN${NC}"
echo -e "${GREEN}🛒 Shop: https://$DOMAIN/jutti${NC}"
echo -e "${GREEN}👨‍💼 Admin: https://$DOMAIN/admin${NC}"
echo ""
echo -e "${YELLOW}🔧 Server Management Commands:${NC}"
echo "• Check status: ssh $AWS_USER@$AWS_IP 'pm2 status'"
echo "• View logs: ssh $AWS_USER@$AWS_IP 'pm2 logs punjab-heritage'"
echo "• Restart: ssh $AWS_USER@$AWS_IP 'pm2 restart punjab-heritage'"
echo "• Stop: ssh $AWS_USER@$AWS_IP 'pm2 stop punjab-heritage'"
echo ""
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo "1. Point your domain DNS to: $AWS_IP"
echo "2. Set up SSL certificate for HTTPS"
echo "3. Configure MongoDB Atlas connection"
echo "4. Update Razorpay to live keys"
echo "5. Test all functionality"
echo ""
echo -e "${GREEN}✨ Your Punjab Heritage e-commerce platform is ready for customers!${NC}"