#!/bin/bash

echo "🔧 Fixing Server Files"
echo "======================"

echo "1. 📝 Copying correct package.json..."
if [ -f "server-package.json" ]; then
    cp server-package.json package.json
    echo "✅ Copied server-package.json to package.json"
else
    echo "❌ server-package.json not found!"
    echo "Creating basic package.json..."
    cat > package.json << 'EOF'
{
  "name": "punjabi-heritage-sync-server",
  "version": "1.0.0",
  "description": "Sync server for Punjabi Heritage Store",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "mongoose": "^8.0.0",
    "dotenv": "^16.3.1"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
EOF
    echo "✅ Created basic package.json"
fi

echo ""
echo "2. 📝 Copying .env file..."
if [ -f "server.env" ]; then
    cp server.env .env
    echo "✅ Copied server.env to .env"
else
    echo "❌ server.env not found!"
    echo "Creating basic .env..."
    cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
AWS_SYNC_SECRET=punjabi-heritage-sync-secret-2024
WEBSITE_SYNC_TOKEN=punjabi-heritage-website-sync-token-2024
EOF
    echo "✅ Created basic .env"
fi

echo ""
echo "3. 🧹 Cleaning corrupted node_modules..."
rm -rf node_modules package-lock.json
echo "✅ Removed corrupted node_modules"

echo ""
echo "4. 📦 Installing fresh dependencies..."
npm install --production --no-optional
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "5. 🧪 Testing server manually..."
timeout 5 node server.js &
SERVER_PID=$!
sleep 3

if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Server starts successfully!"
    kill $SERVER_PID 2>/dev/null
else
    echo "❌ Server failed to start"
    echo "Check server.js for errors"
fi

echo ""
echo "🎉 Files fixed! Now you can:"
echo "1. Run Docker: ./deploy-docker-fixed.sh"
echo "2. Or run directly: node server.js"
echo "3. Or use systemd: ./create-systemd-service.sh"
