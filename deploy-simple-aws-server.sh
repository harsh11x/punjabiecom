#!/bin/bash

echo "🚀 Deploying Simple AWS Server"
echo "=============================="

# Kill any existing process on port 3000
echo "🔧 Stopping any existing server on port 3000..."
sudo fuser -k 3000/tcp 2>/dev/null || true
sleep 2

# Copy the server files
echo "📁 Setting up server files..."
cp create-aws-sync-server.js server.js
cp aws-server-package.json package.json

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start the server
echo "🚀 Starting AWS sync server..."
nohup node server.js > server.log 2>&1 &

# Wait a moment for server to start
sleep 3

# Test the server
echo "🧪 Testing server..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ AWS Server is running successfully!"
    echo "🌐 Server URL: http://3.111.208.77:3000"
    echo "📊 Health: http://3.111.208.77:3000/api/health"
    echo "🔄 Sync: http://3.111.208.77:3000/api/sync/products"
    echo "📥 Pull: http://3.111.208.77:3000/api/sync/pull/products"
    echo ""
    echo "📋 Management commands:"
    echo "View logs: tail -f server.log"
    echo "Stop server: pkill -f 'node server.js'"
    echo "Restart: ./deploy-simple-aws-server.sh"
else
    echo "❌ Server failed to start"
    echo "Check logs: cat server.log"
    exit 1
fi
