#!/bin/bash

echo "🔧 Fixing all permissions for non-sudo operation..."

# Stop any running PM2 processes
echo "📍 Stopping PM2 processes..."
sudo pm2 stop all 2>/dev/null || echo "No PM2 processes to stop"
sudo pm2 delete all 2>/dev/null || echo "No PM2 processes to delete"

# Fix project directory ownership
echo "📁 Fixing project directory ownership..."
sudo chown -R ubuntu:ubuntu /home/punjabiecom/

# Fix PM2 directory ownership
echo "🔧 Fixing PM2 directory ownership..."
sudo chown -R ubuntu:ubuntu ~/.pm2/ 2>/dev/null || echo "PM2 directory doesn't exist yet"

# Fix permissions
echo "🔐 Setting correct permissions..."
sudo chmod -R 755 /home/punjabiecom/
sudo chmod -R 755 ~/.pm2/ 2>/dev/null || echo "PM2 directory doesn't exist yet"

# Create and fix data directory
echo "📊 Creating and fixing data directory..."
mkdir -p /home/punjabiecom/data
sudo chown -R ubuntu:ubuntu /home/punjabiecom/data/
chmod -R 755 /home/punjabiecom/data/

# Fix node_modules if it exists
if [ -d "/home/punjabiecom/node_modules" ]; then
    echo "📦 Fixing node_modules permissions..."
    sudo chown -R ubuntu:ubuntu /home/punjabiecom/node_modules/
    chmod -R 755 /home/punjabiecom/node_modules/
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd /home/punjabiecom
npm install cors dotenv mongoose

echo ""
echo "✅ All permissions fixed!"
echo "🚀 You can now run: pm2 start server.js --name punjabiecom"
echo "🎯 Without using sudo!"
