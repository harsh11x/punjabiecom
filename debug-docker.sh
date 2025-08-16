#!/bin/bash

echo "🐳 Docker Troubleshooting for Punjabi Heritage Server"
echo "===================================================="

echo "1. 📋 Container logs:"
docker logs punjabi-heritage 2>&1 || echo "No logs available"

echo ""
echo "2. 🔍 Container status:"
docker ps -a | grep punjabi-heritage || echo "No container found"

echo ""
echo "3. 📁 Checking required files:"
echo "server.js exists: $([ -f server.js ] && echo 'Yes' || echo 'No')"
echo "server-package.json exists: $([ -f server-package.json ] && echo 'Yes' || echo 'No')"
echo "server.env exists: $([ -f server.env ] && echo 'Yes' || echo 'No')"
echo "Dockerfile exists: $([ -f Dockerfile ] && echo 'Yes' || echo 'No')"

echo ""
echo "4. 📦 Docker images:"
docker images | grep punjabi-heritage || echo "No images found"

echo ""
echo "5. 🔧 System info:"
echo "Docker version: $(docker --version)"
echo "Available space: $(df -h . | tail -1 | awk '{print $4}')"
echo "Memory: $(free -h | grep Mem | awk '{print $7}')"

echo ""
echo "6. 🧪 Testing manual build:"
echo "Building image step by step..."

# Test if we can build the image
if docker build -t punjabi-heritage-test . 2>&1; then
    echo "✅ Image builds successfully"
    
    # Try to run it manually
    echo "🚀 Testing container run..."
    docker run --rm -d --name punjabi-heritage-test -p 3002:3001 punjabi-heritage-test
    
    sleep 3
    
    if docker ps | grep punjabi-heritage-test; then
        echo "✅ Container runs successfully on port 3002"
        echo "🧪 Testing health check..."
        if curl -f http://localhost:3002/api/health 2>/dev/null; then
            echo "✅ Health check passed!"
        else
            echo "❌ Health check failed"
            echo "Container logs:"
            docker logs punjabi-heritage-test
        fi
        
        # Cleanup
        docker stop punjabi-heritage-test
    else
        echo "❌ Container failed to start"
        echo "Container logs:"
        docker logs punjabi-heritage-test 2>/dev/null || echo "No logs"
    fi
else
    echo "❌ Image build failed"
fi

echo ""
echo "7. 🔧 Suggested fixes:"
echo "- Check if all required files exist"
echo "- Verify server.js syntax: node -c server.js"
echo "- Check Docker daemon: sudo systemctl status docker"
echo "- Free up space if needed: docker system prune"
echo "- Try manual run: docker run -it --rm punjabi-heritage-server node server.js"
