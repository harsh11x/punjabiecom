#!/bin/bash

echo "🐳 Docker Deployment on Port 3000"
echo "=================================="

# Stop and remove existing containers
echo "🛑 Cleaning up existing containers..."
docker stop punjabi-heritage 2>/dev/null || true
docker rm punjabi-heritage 2>/dev/null || true

# Remove old images
docker rmi punjabi-heritage-simple 2>/dev/null || true

# Check if port 3000 is free
echo "🔍 Checking if port 3000 is available..."
if sudo lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️ Port 3000 is in use, attempting to free it..."
    sudo lsof -ti:3000 | xargs sudo kill -9 2>/dev/null || true
    sleep 2
fi

# Build image
echo "🔨 Building Docker image..."
docker build -f Dockerfile.simple -t punjabi-heritage-simple .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

# Run container on port 3000
echo "🚀 Starting container on port 3000..."
docker run -d \
  --name punjabi-heritage \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e AWS_SYNC_SECRET=punjabi-heritage-sync-secret-2024 \
  -e WEBSITE_SYNC_TOKEN=punjabi-heritage-website-sync-token-2024 \
  -v $(pwd)/sync-data:/app/sync-data \
  punjabi-heritage-simple

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 5

# Check if container is running
if docker ps | grep -q punjabi-heritage; then
    echo "✅ Container is running on port 3000!"
    
    # Show container info
    echo "📊 Container info:"
    docker ps | grep punjabi-heritage
    
    # Test health endpoint
    echo "🧪 Testing health endpoint..."
    sleep 2
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✅ Server health check passed!"
        echo ""
        echo "🎉 DEPLOYMENT SUCCESSFUL!"
        echo "🌐 Server URL: http://3.111.208.77:3000"
        echo "🔗 Health check: http://3.111.208.77:3000/api/health"
        echo "📊 Admin sync endpoint: http://3.111.208.77:3000/api/sync/products"
        echo "🔄 Website pull endpoint: http://3.111.208.77:3000/api/sync/pull/products"
        echo ""
        echo "✅ Your AWS sync system is now running on port 3000!"
        echo "✅ Admin panel will automatically sync to this server"
        echo "✅ Website will automatically pull from this server"
    else
        echo "❌ Health check failed"
        echo "📋 Container logs:"
        docker logs punjabi-heritage --tail 20
    fi
else
    echo "❌ Container failed to start"
    echo "📋 Container logs:"
    docker logs punjabi-heritage 2>/dev/null || echo "No logs available"
fi

echo ""
echo "📋 Management commands:"
echo "View logs:    docker logs punjabi-heritage -f"
echo "Stop:         docker stop punjabi-heritage"
echo "Start:        docker start punjabi-heritage"
echo "Restart:      docker restart punjabi-heritage"
echo "Health check: curl http://localhost:3000/api/health"
echo "Test sync:    curl http://3.111.208.77:3000/api/health"
