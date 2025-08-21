#!/bin/bash

echo "🔍 PM2 Server Diagnostics"
echo "=========================="

# Check PM2 status
echo "📊 PM2 Status:"
pm2 list

echo ""
echo "📋 PM2 Logs (last 20 lines):"
pm2 logs punjabiecom --lines 20

echo ""
echo "❌ PM2 Error Logs:"
pm2 logs punjabiecom --err --lines 10

echo ""
echo "🔧 Environment Check:"
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"

echo ""
echo "📁 File Check:"
ls -la simple-server-no-deps.js
ls -la data/ 2>/dev/null || echo "Data directory not found"

echo ""
echo "📦 Dependencies Check:"
if [ -f "package.json" ]; then
    echo "Package.json exists"
    npm list express 2>/dev/null || echo "Express not installed"
else
    echo "No package.json found"
fi

echo ""
echo "🔍 Manual Test:"
echo "To test manually, run:"
echo "pm2 stop punjabiecom"
echo "NODE_OPTIONS='--max-old-space-size=64' node simple-server-no-deps.js"
