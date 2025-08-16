#!/bin/bash

echo "🔍 Diagnosing PM2 Server Issues"
echo "================================"

echo "📋 System Information:"
echo "Node.js version: $(node --version 2>/dev/null || echo 'Not installed')"
echo "NPM version: $(npm --version 2>/dev/null || echo 'Not installed')"
echo "PM2 version: $(pm2 --version 2>/dev/null || echo 'Not installed')"
echo "Current directory: $(pwd)"
echo "User: $(whoami)"
echo ""

echo "📁 File Check:"
echo "server.js exists: $([ -f server.js ] && echo 'Yes' || echo 'No')"
echo "package.json exists: $([ -f package.json ] && echo 'Yes' || echo 'No')"
echo "ecosystem.config.js exists: $([ -f ecosystem.config.js ] && echo 'Yes' || echo 'No')"
echo ".env exists: $([ -f .env ] && echo 'Yes' || echo 'No')"
echo "node_modules exists: $([ -d node_modules ] && echo 'Yes' || echo 'No')"
echo ""

echo "🔐 File Permissions:"
ls -la server.js package.json ecosystem.config.js .env 2>/dev/null
echo ""

echo "📦 Dependencies Check:"
if [ -f package.json ]; then
    echo "package.json content:"
    cat package.json
else
    echo "❌ package.json missing!"
fi
echo ""

echo "🌍 Environment Variables:"
if [ -f .env ]; then
    echo ".env file content (sensitive values hidden):"
    sed 's/=.*/=***/' .env
else
    echo "❌ .env file missing!"
fi
echo ""

echo "🚀 PM2 Status:"
pm2 status 2>/dev/null || echo "❌ PM2 not responding or not installed"
echo ""

echo "📊 Port Usage:"
echo "Processes using port 3001:"
sudo lsof -i :3001 2>/dev/null || echo "Port 3001 is free"
echo ""

echo "🔍 Recent PM2 Logs:"
pm2 logs punjabi-sync-server --lines 10 2>/dev/null || echo "No logs available"
echo ""

echo "🧪 Manual Server Test:"
echo "Testing server startup..."
timeout 5 node server.js 2>&1 || echo "Server failed to start manually"
echo ""

echo "🔧 Suggested Actions:"
echo "1. Run: npm install"
echo "2. Run: pm2 delete punjabi-sync-server"
echo "3. Run: pm2 start ecosystem.config.js"
echo "4. Run: pm2 logs punjabi-sync-server"
