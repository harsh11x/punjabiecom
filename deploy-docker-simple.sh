#!/bin/bash

echo "🐳 Simple Docker Deployment"
echo "=========================="

# Stop and remove existing container
echo "🛑 Cleaning up existing container..."
docker stop punjabi-heritage 2>/dev/null || true
docker rm punjabi-heritage 2>/dev/null || true

# Remove old image
docker rmi punjabi-heritage-simple 2>/dev/null || true

# Build with simple Dockerfile
echo "🔨 Building simple Docker image..."
docker build -f Dockerfile.simple -t punjabi-heritage-simple .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

# Run container with simple setup
echo "🚀 Starting container..."
docker run -d \
  --name punjabi-heritage \
  --restart unless-stopped \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  -e AWS_SYNC_SECRET=punjabi-heritage-sync-secret-2024 \
  -e WEBSITE_SYNC_TOKEN=punjabi-heritage-website-sync-token-2024 \
  -v $(pwd)/sync-data:/app/sync-data \
  punjabi-heritage-simple

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 5

# Check if container is running
if docker ps | grep -q punjabi-heritage; then
    echo "✅ Container is running!"
    
    # Show container info
    echo "📊 Container info:"
    docker ps | grep punjabi-heritage
    
    # Test health endpoint
    echo "🧪 Testing health endpoint..."
    sleep 2
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        echo "✅ Server health check passed!"
        echo "🌐 Server is available at: http://localhost:3001"
        echo "🎉 Deployment successful!"
    else
        echo "❌ Health check failed, but container is running"
        echo "📋 Container logs:"
        docker logs punjabi-heritage --tail 20
    fi
else
    echo "❌ Container failed to start"
    echo "📋 Container logs:"
    docker logs punjabi-heritage 2>/dev/null || echo "No logs available"
    
    echo ""
    echo "🔧 Troubleshooting steps:"
    echo "1. Check Docker daemon: sudo systemctl status docker"
    echo "2. Check available space: df -h"
    echo "3. Check server.js syntax: node -c server.js"
    echo "4. Run debug script: ./debug-docker.sh"
fi

echo ""
echo "📋 Management commands:"
echo "View logs:    docker logs punjabi-heritage -f"
echo "Stop:         docker stop punjabi-heritage"
echo "Start:        docker start punjabi-heritage"
echo "Restart:      docker restart punjabi-heritage"
echo "Debug:        ./debug-docker.sh"
