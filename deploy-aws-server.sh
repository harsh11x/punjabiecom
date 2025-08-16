#!/bin/bash

# AWS Server Deployment Script for Punjabi Heritage Store
# This script deploys the sync server to your AWS EC2 instance

set -e

echo "🚀 Deploying AWS Sync Server for Punjabi Heritage Store"

# Configuration
AWS_SERVER_IP="${AWS_SERVER_IP:-YOUR_AWS_SERVER_IP}"
AWS_KEY_PATH="${AWS_KEY_PATH:-~/.ssh/your-aws-key.pem}"
AWS_USER="${AWS_USER:-ubuntu}"
SERVER_PORT="${SERVER_PORT:-3001}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if AWS server IP is configured
if [ "$AWS_SERVER_IP" = "YOUR_AWS_SERVER_IP" ]; then
    echo -e "${RED}❌ Please set your AWS server IP address${NC}"
    echo "Usage: AWS_SERVER_IP=your.server.ip.address ./deploy-aws-server.sh"
    exit 1
fi

echo -e "${YELLOW}📋 Deployment Configuration:${NC}"
echo "  Server IP: $AWS_SERVER_IP"
echo "  SSH Key: $AWS_KEY_PATH"
echo "  User: $AWS_USER"
echo "  Port: $SERVER_PORT"
echo ""

# Create deployment package
echo -e "${YELLOW}📦 Creating deployment package...${NC}"
DEPLOY_DIR="aws-server-deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# Copy necessary files
cp aws-sync-server.js "$DEPLOY_DIR/"
cp package.json "$DEPLOY_DIR/"
cp .env.production "$DEPLOY_DIR/.env"

# Create package.json for server if it doesn't exist
if [ ! -f "$DEPLOY_DIR/package.json" ]; then
    cat > "$DEPLOY_DIR/package.json" << EOF
{
  "name": "punjabi-heritage-aws-sync-server",
  "version": "1.0.0",
  "description": "AWS Sync Server for Punjabi Heritage Store",
  "main": "aws-sync-server.js",
  "scripts": {
    "start": "node aws-sync-server.js",
    "dev": "nodemon aws-sync-server.js",
    "pm2:start": "pm2 start aws-sync-server.js --name punjabi-sync-server",
    "pm2:stop": "pm2 stop punjabi-sync-server",
    "pm2:restart": "pm2 restart punjabi-sync-server"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "mongoose": "^8.0.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOF
fi

# Create PM2 ecosystem file
cat > "$DEPLOY_DIR/ecosystem.config.js" << EOF
module.exports = {
  apps: [{
    name: 'punjabi-sync-server',
    script: 'aws-sync-server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: $SERVER_PORT
    }
  }]
};
EOF

# Create deployment script for server
cat > "$DEPLOY_DIR/server-setup.sh" << 'EOF'
#!/bin/bash

echo "🔧 Setting up Punjabi Heritage Sync Server on AWS..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install dependencies
npm install

# Create sync data directory
mkdir -p aws-sync-data

# Set up PM2 to start on boot
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME

# Start the server
pm2 start ecosystem.config.js
pm2 save

echo "✅ Server setup complete!"
echo "🌐 Server will be available at: http://$(curl -s ifconfig.me):3001"
echo "📊 Monitor with: pm2 monit"
echo "📋 View logs with: pm2 logs punjabi-sync-server"
EOF

chmod +x "$DEPLOY_DIR/server-setup.sh"

echo -e "${GREEN}✅ Deployment package created: $DEPLOY_DIR${NC}"

# Upload to AWS server
echo -e "${YELLOW}📤 Uploading to AWS server...${NC}"
scp -i "$AWS_KEY_PATH" -r "$DEPLOY_DIR" "$AWS_USER@$AWS_SERVER_IP:~/"

# Run setup on server
echo -e "${YELLOW}🔧 Running setup on AWS server...${NC}"
ssh -i "$AWS_KEY_PATH" "$AWS_USER@$AWS_SERVER_IP" << EOF
cd $DEPLOY_DIR
chmod +x server-setup.sh
./server-setup.sh
EOF

# Test server
echo -e "${YELLOW}🧪 Testing server connection...${NC}"
sleep 5
if curl -f "http://$AWS_SERVER_IP:$SERVER_PORT/api/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Server is running successfully!${NC}"
    echo -e "${GREEN}🌐 Health check: http://$AWS_SERVER_IP:$SERVER_PORT/api/health${NC}"
else
    echo -e "${RED}❌ Server health check failed${NC}"
    echo "Check server logs with: ssh -i $AWS_KEY_PATH $AWS_USER@$AWS_SERVER_IP 'pm2 logs punjabi-sync-server'"
fi

# Update local environment
echo -e "${YELLOW}🔧 Updating local environment configuration...${NC}"
sed -i.bak "s/YOUR_AWS_SERVER_IP/$AWS_SERVER_IP/g" .env.local
sed -i.bak "s/YOUR_AWS_SERVER_IP/$AWS_SERVER_IP/g" .env.production

echo -e "${GREEN}🎉 AWS Sync Server deployment complete!${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Update your Vercel environment variables:"
echo "   - AWS_SYNC_SERVER_URL=http://$AWS_SERVER_IP:$SERVER_PORT"
echo "   - AWS_SYNC_SECRET=punjabi-heritage-sync-secret-2024"
echo "   - WEBSITE_SYNC_TOKEN=punjabi-heritage-website-sync-token-2024"
echo ""
echo "2. Test the sync functionality in your admin panel"
echo ""
echo "3. Monitor server: ssh -i $AWS_KEY_PATH $AWS_USER@$AWS_SERVER_IP 'pm2 monit'"

# Cleanup
rm -rf "$DEPLOY_DIR"
EOF
