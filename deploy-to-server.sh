#!/bin/bash

# Quick deployment script for AWS server: 3.111.208.77
# Make sure you have your SSH key ready

SERVER_IP="3.111.208.77"
SSH_KEY="${SSH_KEY:-~/.ssh/your-aws-key.pem}"
SSH_USER="${SSH_USER:-ubuntu}"

echo "🚀 Deploying to AWS Server: $SERVER_IP"

# Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ SSH key not found at: $SSH_KEY"
    echo "Please set SSH_KEY environment variable or place your key at ~/.ssh/your-aws-key.pem"
    exit 1
fi

echo "📤 Uploading files to server..."

# Upload server files
scp -i "$SSH_KEY" server.js "$SSH_USER@$SERVER_IP:~/"
scp -i "$SSH_KEY" server-package.json "$SSH_USER@$SERVER_IP:~/package.json"
scp -i "$SSH_KEY" ecosystem.config.js "$SSH_USER@$SERVER_IP:~/"
scp -i "$SSH_KEY" .env.production "$SSH_USER@$SERVER_IP:~/.env"

echo "🔧 Setting up server..."

# Run setup commands on server
ssh -i "$SSH_KEY" "$SSH_USER@$SERVER_IP" << 'EOF'
# Update system
sudo apt update

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create logs directory
mkdir -p logs

# Stop existing server if running
pm2 stop punjabi-sync-server 2>/dev/null || true

# Start server
echo "Starting server with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot (run this manually if needed)
echo "To set PM2 to start on boot, run: pm2 startup"

echo "✅ Server setup complete!"
EOF

echo "🧪 Testing server..."
sleep 3

# Test health endpoint
if curl -f "http://$SERVER_IP:3001/api/health" > /dev/null 2>&1; then
    echo "✅ Server is running successfully!"
    echo "🌐 Health check: http://$SERVER_IP:3001/api/health"
else
    echo "❌ Server health check failed"
    echo "Check server logs with: ssh -i $SSH_KEY $SSH_USER@$SERVER_IP 'pm2 logs punjabi-sync-server'"
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Add these to your Vercel environment variables:"
echo "   - AWS_SYNC_SERVER_URL=http://$SERVER_IP:3001"
echo "   - AWS_SYNC_SECRET=punjabi-heritage-sync-secret-2024"
echo "   - WEBSITE_SYNC_TOKEN=punjabi-heritage-website-sync-token-2024"
echo ""
echo "2. Test sync in your admin panel"
echo ""
echo "3. Monitor server: ssh -i $SSH_KEY $SSH_USER@$SERVER_IP 'pm2 monit'"
