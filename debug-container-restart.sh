#!/bin/bash

echo "🔍 Debugging Container Restart Loop"
echo "=================================="

echo "1. 📋 Container status:"
docker ps -a | grep punjabi-heritage

echo ""
echo "2. 📋 Container logs (last 50 lines):"
docker logs punjabi-heritage --tail 50

echo ""
echo "3. 🛑 Stopping the container to prevent restart loop..."
docker stop punjabi-heritage

echo ""
echo "4. 🧪 Testing server.js syntax:"
node -c server.js && echo "✅ server.js syntax is valid" || echo "❌ server.js has syntax errors"

echo ""
echo "5. 🧪 Testing manual server start:"
echo "Starting server manually to see errors..."
timeout 10 node server.js 2>&1 || echo "Server failed to start manually"

echo ""
echo "6. 📁 Checking required files:"
echo "server.js exists: $([ -f server.js ] && echo 'Yes' || echo 'No')"
echo "package.json exists: $([ -f package.json ] && echo 'Yes' || echo 'No')"
echo ".env exists: $([ -f .env ] && echo 'Yes' || echo 'No')"
echo "node_modules exists: $([ -d node_modules ] && echo 'Yes' || echo 'No')"

echo ""
echo "7. 📦 Checking dependencies:"
if [ -f package.json ]; then
    echo "package.json content:"
    cat package.json
else
    echo "❌ package.json missing!"
fi

echo ""
echo "8. 🔧 Environment variables:"
if [ -f .env ]; then
    echo ".env content (sensitive values hidden):"
    sed 's/=.*/=***/' .env
else
    echo "❌ .env file missing!"
fi

echo ""
echo "9. 🐳 Docker image inspection:"
docker inspect punjabi-heritage-simple | grep -A 5 -B 5 "Cmd\|Entrypoint" || echo "Cannot inspect image"

echo ""
echo "10. 🧪 Testing container with interactive mode:"
echo "Running container interactively to see startup errors..."
docker run --rm -it punjabi-heritage-simple sh -c "ls -la && node --version && npm --version && node server.js" 2>&1 | head -20

echo ""
echo "🔧 Suggested fixes:"
echo "1. Check server.js for syntax errors"
echo "2. Ensure all dependencies are installed"
echo "3. Check if .env file has correct format"
echo "4. Try running: npm install express cors mongoose dotenv"
echo "5. Test manual start: node server.js"
