#!/bin/bash

echo "🚀 COMPLETE PUNJABI HERITAGE SYNC SETUP"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}This script will set up your complete sync system:${NC}"
echo "1. 🐳 Deploy AWS server with Docker"
echo "2. 🔧 Configure all environment variables"
echo "3. 🧪 Test complete sync flow"
echo "4. 📊 Verify everything is working"
echo ""

read -p "Continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Setup cancelled."
    exit 1
fi

echo ""
echo -e "${YELLOW}STEP 1: Setting up AWS Server${NC}"
echo "================================"

# Check if we're on the server
if [[ $(hostname) == *"ip-"* ]] || [[ $(whoami) == "ubuntu" ]]; then
    echo "✅ Running on AWS server"
    
    # Fix server files
    echo "🔧 Fixing server files..."
    ./fix-server-files.sh
    
    # Fix permissions
    echo "🔧 Fixing permissions..."
    ./fix-permissions.sh
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    ./install-server-deps.sh
    
    # Deploy with Docker
    echo "🐳 Deploying with Docker..."
    ./deploy-docker-fixed.sh
    
    # Test server
    echo "🧪 Testing server..."
    sleep 5
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ AWS Server is running successfully!${NC}"
        echo "🌐 Server URL: http://3.111.208.77:3000"
    else
        echo -e "${RED}❌ AWS Server failed to start${NC}"
        echo "Check Docker logs: docker logs punjabi-heritage -f"
        exit 1
    fi
    
else
    echo "⚠️ Not on AWS server. Please run this on your AWS server first."
    echo "SSH command: ssh -i ~/.ssh/your-key.pem ubuntu@3.111.208.77"
    echo "Then run: ./COMPLETE_SETUP.sh"
    exit 1
fi

echo ""
echo -e "${YELLOW}STEP 2: Environment Variables Setup${NC}"
echo "===================================="

echo "📋 Required Vercel Environment Variables:"
echo ""
echo -e "${BLUE}Copy these to your Vercel Dashboard:${NC}"
echo "AWS_SYNC_SERVER_URL=http://3.111.208.77:3000"
echo "AWS_SYNC_SECRET=punjabi-heritage-sync-secret-2024"
echo "WEBSITE_SYNC_TOKEN=punjabi-heritage-website-sync-token-2024"
echo "SYNC_INTERVAL=30000"
echo ""

read -p "Have you added these to Vercel? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️ Please add environment variables to Vercel first${NC}"
    echo "1. Go to Vercel Dashboard"
    echo "2. Select your project"
    echo "3. Go to Settings -> Environment Variables"
    echo "4. Add the variables shown above"
    echo "5. Redeploy your project"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo ""
echo -e "${YELLOW}STEP 3: Testing Complete Sync Flow${NC}"
echo "=================================="

echo "🧪 Testing AWS server endpoints..."

# Test health
echo "1. Testing health endpoint..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    exit 1
fi

# Test sync endpoint
echo "2. Testing sync endpoint..."
SYNC_TEST=$(curl -s -X POST http://localhost:3000/api/sync/products \
  -H "Authorization: Bearer punjabi-heritage-sync-secret-2024" \
  -H "Content-Type: application/json" \
  -d '{"action":"test","product":{"name":"Test Product","price":100}}')

if [[ $SYNC_TEST == *"success"* ]]; then
    echo -e "${GREEN}✅ Sync endpoint working${NC}"
else
    echo -e "${RED}❌ Sync endpoint failed${NC}"
    echo "Response: $SYNC_TEST"
    exit 1
fi

# Test pull endpoint
echo "3. Testing pull endpoint..."
PULL_TEST=$(curl -s http://localhost:3000/api/sync/pull/products \
  -H "X-Sync-Token: punjabi-heritage-website-sync-token-2024")

if [[ $PULL_TEST == *"products"* ]]; then
    echo -e "${GREEN}✅ Pull endpoint working${NC}"
else
    echo -e "${RED}❌ Pull endpoint failed${NC}"
    echo "Response: $PULL_TEST"
    exit 1
fi

echo ""
echo -e "${YELLOW}STEP 4: Final Verification${NC}"
echo "=========================="

echo "📊 System Status:"
echo "✅ AWS Server: Running on port 3000"
echo "✅ Docker Container: punjabi-heritage"
echo "✅ Health Endpoint: Working"
echo "✅ Sync Endpoint: Working"
echo "✅ Pull Endpoint: Working"
echo ""

echo -e "${GREEN}🎉 SETUP COMPLETE!${NC}"
echo ""
echo -e "${BLUE}Your sync system is now ready:${NC}"
echo "1. 📱 Admin Panel → Automatically syncs to AWS server"
echo "2. 🌐 AWS Server → Stores all products securely"
echo "3. 🔄 Website → Auto-syncs every 30 seconds"
echo ""

echo -e "${BLUE}Next Steps:${NC}"
echo "1. 🚀 Deploy your website to Vercel (if not already done)"
echo "2. 🧪 Test by adding a product in your admin panel"
echo "3. 📊 Check Docker logs: docker logs punjabi-heritage -f"
echo "4. 🌐 Verify product appears on your website within 30 seconds"
echo ""

echo -e "${BLUE}Management Commands:${NC}"
echo "View logs:    docker logs punjabi-heritage -f"
echo "Restart:      docker restart punjabi-heritage"
echo "Stop:         docker stop punjabi-heritage"
echo "Health check: curl http://3.111.208.77:3000/api/health"
echo ""

echo -e "${GREEN}🎯 Your Punjabi Heritage Store sync system is now fully operational!${NC}"
