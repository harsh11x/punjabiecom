#!/bin/bash

echo "🐳 Docker Deployment with Alternative Port"
echo "=========================================="

# Find an available port
echo "🔍 Finding available port..."
for port in 3001 3002 3003 3004 3005; do
    if ! sudo lsof -i :$port > /dev/null 2>&1; then
        AVAILABLE_PORT=$port
        echo "✅ Found available port: $port"
        break
    else
        echo "❌ Port $port is in use"
    fi
done

if [ -z "$AVAILABLE_PORT" ]; then
    echo "❌ No available ports found in range 3001-3005"
    echo "🔧 Please manually free up port 3001 or choose a different port"
    exit 1
fi

# Stop and remove existing container
echo "🛑 Cleaning up existing container..."
docker stop punjabi-heritage 2>/dev/null || true
docker rm punjabi-heritage 2>/dev/null || true

# Remove old image
docker rmi punjabi-heritage-simple 2>/dev/null || true

# Build image
echo "🔨 Building Docker image..."
docker build -f Dockerfile.simple -t punjabi-heritage-simple .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

# Run container with available port
echo "🚀 Starting container on port $AVAILABLE_PORT..."
docker run -d \
  --name punjabi-heritage \
  --restart unless-stopped \
  -p $AVAILABLE_PORT:3001 \
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
    echo "✅ Container is running on port $AVAILABLE_PORT!"
    
    # Test health endpoint
    echo "🧪 Testing health endpoint..."
    sleep 2
    if curl -f http://localhost:$AVAILABLE_PORT/api/health > /dev/null 2>&1; then
        echo "✅ Server health check passed!"
        echo ""
        echo "🎉 DEPLOYMENT SUCCESSFUL!"
        echo "🌐 Server URL: http://3.111.208.77:$AVAILABLE_PORT"
        echo "🔗 Health check: http://3.111.208.77:$AVAILABLE_PORT/api/health"
        echo ""
        echo "⚠️  IMPORTANT: Update your environment variables!"
        echo "In Vercel, change AWS_SYNC_SERVER_URL to:"
        echo "AWS_SYNC_SERVER_URL=http://3.111.208.77:$AVAILABLE_PORT"
        echo ""
        echo "In your .env.local, change:"
        echo "AWS_SYNC_SERVER_URL=http://3.111.208.77:$AVAILABLE_PORT"
        echo "NEXT_PUBLIC_AWS_SYNC_SERVER_URL=http://3.111.208.77:$AVAILABLE_PORT"
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
echo "Restart:      docker restart punjabi-heritage"
echo "Health check: curl http://localhost:$AVAILABLE_PORT/api/health"
