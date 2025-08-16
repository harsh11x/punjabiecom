#!/bin/bash

echo "📦 Installing Server Dependencies"
echo "================================="

echo "1. 🧹 Cleaning everything..."
rm -rf node_modules package-lock.json
echo "✅ Cleaned node_modules"

echo ""
echo "2. 📝 Installing required dependencies..."
npm install express cors mongoose dotenv --save

echo ""
echo "3. 📋 Verifying installation..."
echo "Checking if modules exist:"
echo "express: $([ -d node_modules/express ] && echo 'Yes' || echo 'No')"
echo "cors: $([ -d node_modules/cors ] && echo 'Yes' || echo 'No')"
echo "mongoose: $([ -d node_modules/mongoose ] && echo 'Yes' || echo 'No')"
echo "dotenv: $([ -d node_modules/dotenv ] && echo 'Yes' || echo 'No')"

echo ""
echo "4. 🧪 Testing server..."
timeout 8 node server.js &
SERVER_PID=$!
sleep 5

if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Server is running!"
    
    # Test health endpoint
    sleep 2
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✅ Health check passed!"
        echo "🎉 Server is working perfectly!"
    else
        echo "⚠️ Server running but health check failed"
    fi
    
    kill $SERVER_PID 2>/dev/null
else
    echo "❌ Server failed to start"
    echo "Let's see the error:"
    node server.js 2>&1 | head -10
fi

echo ""
echo "🚀 If server is working, deploy with:"
echo "./deploy-docker-fixed.sh"
