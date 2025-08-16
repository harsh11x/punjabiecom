#!/bin/bash

echo "🐳 Deploying with Docker"
echo "========================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "⚠️ Please log out and log back in for Docker permissions to take effect"
    echo "Then run this script again"
    exit 1
fi

# Stop any existing container
echo "🛑 Stopping existing container..."
docker stop punjabi-heritage 2>/dev/null || echo "No existing container to stop"
docker rm punjabi-heritage 2>/dev/null || echo "No existing container to remove"

# Build Docker image
echo "🔨 Building Docker image..."
docker build -t punjabi-heritage-server .

# Run container
echo "🚀 Starting container..."
docker run -d \
  --name punjabi-heritage \
  --restart unless-stopped \
  -p 3001:3001 \
  -v $(pwd)/sync-data:/app/sync-data \
  punjabi-heritage-server

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 5

# Check if container is running
if docker ps | grep -q punjabi-heritage; then
    echo "✅ Container is running!"
    
    # Test health endpoint
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        echo "✅ Server health check passed!"
        echo "🌐 Server is available at: http://localhost:3001"
    else
        echo "❌ Health check failed"
        echo "📋 Container logs:"
        docker logs punjabi-heritage
    fi
else
    echo "❌ Container failed to start"
    echo "📋 Container logs:"
    docker logs punjabi-heritage
fi

echo ""
echo "📋 Docker Management Commands:"
echo "View logs:    docker logs punjabi-heritage -f"
echo "Stop:         docker stop punjabi-heritage"
echo "Start:        docker start punjabi-heritage"
echo "Restart:      docker restart punjabi-heritage"
echo "Remove:       docker rm -f punjabi-heritage"
echo "Shell access: docker exec -it punjabi-heritage sh"
