#!/bin/bash

echo "🔧 Fixed Docker Deployment"
echo "=========================="

# Stop and remove existing containers
echo "🛑 Cleaning up..."
docker stop punjabi-heritage 2>/dev/null || true
docker rm punjabi-heritage 2>/dev/null || true
docker rmi punjabi-heritage-fixed 2>/dev/null || true

# Fix the files first
echo "📝 Fixing required files..."

# 1. Copy server package.json
if [ -f "server-package.json" ]; then
    cp server-package.json package.json
    echo "✅ Copied server-package.json to package.json"
else
    echo "❌ server-package.json not found!"
    exit 1
fi

# 2. Copy server .env
if [ -f "server.env" ]; then
    cp server.env .env
    echo "✅ Copied server.env to .env"
else
    echo "❌ server.env not found!"
    exit 1
fi

# 3. Clean node_modules
echo "🧹 Cleaning corrupted node_modules..."
rm -rf node_modules package-lock.json

# Create fixed Dockerfile
echo "📝 Creating fixed Dockerfile..."
cat > Dockerfile.fixed << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY package.json .
COPY .env .

# Install dependencies with clean cache
RUN npm cache clean --force
RUN npm install --production --no-optional

# Copy server file
COPY server.js .

# Create sync data directory
RUN mkdir -p sync-data

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
EOF

# Build fixed image
echo "🔨 Building fixed Docker image..."
docker build -f Dockerfile.fixed -t punjabi-heritage-fixed .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

# Run container
echo "🚀 Starting fixed container..."
docker run -d \
  --name punjabi-heritage \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -v $(pwd)/sync-data:/app/sync-data \
  punjabi-heritage-fixed

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 8

# Check if container is running
if docker ps | grep -q punjabi-heritage; then
    echo "✅ Container is running!"
    
    # Test health endpoint
    echo "🧪 Testing health endpoint..."
    sleep 3
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✅ Server health check passed!"
        echo ""
        echo "🎉 DEPLOYMENT SUCCESSFUL!"
        echo "🌐 Server URL: http://3.111.208.77:3000"
        echo "🔗 Health check: http://3.111.208.77:3000/api/health"
        echo ""
        echo "📋 Test the endpoints:"
        echo "curl http://3.111.208.77:3000/api/health"
        echo ""
        echo "✅ Your AWS sync system is now running!"
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

# Cleanup
rm -f Dockerfile.fixed

echo ""
echo "📋 Management commands:"
echo "View logs:    docker logs punjabi-heritage -f"
echo "Stop:         docker stop punjabi-heritage"
echo "Restart:      docker restart punjabi-heritage"
echo "Health:       curl http://localhost:3000/api/health"
