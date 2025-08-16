#!/bin/bash

echo "🔧 Fixing Permissions"
echo "====================="

echo "1. 📁 Creating sync-data directory with correct permissions..."
mkdir -p sync-data
chmod 755 sync-data
echo "✅ sync-data directory created"

echo ""
echo "2. 🔧 Setting ownership..."
sudo chown -R $USER:$USER sync-data
echo "✅ Ownership set to $USER"

echo ""
echo "3. 📝 Creating initial files..."
touch sync-data/products.json
touch sync-data/sync.log
echo '[]' > sync-data/products.json
echo "$(date): Sync system initialized" > sync-data/sync.log
echo "✅ Initial files created"

echo ""
echo "4. 🔧 Setting file permissions..."
chmod 644 sync-data/products.json
chmod 644 sync-data/sync.log
echo "✅ File permissions set"

echo ""
echo "5. 📊 Checking permissions..."
ls -la sync-data/
echo ""

echo "6. 🧪 Testing server again..."
timeout 5 node server.js &
SERVER_PID=$!
sleep 3

if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Server starts successfully!"
    kill $SERVER_PID 2>/dev/null
    echo ""
    echo "🎉 Ready to deploy!"
    echo "Run: ./deploy-docker-fixed.sh"
else
    echo "❌ Server still has issues"
    echo "Let's check what's wrong..."
fi
