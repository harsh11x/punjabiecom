#!/bin/bash

echo "🚀 Deploying Simple Sync Server"
echo "==============================="

# Stop existing container
echo "🛑 Stopping existing container..."
docker stop punjabi-heritage 2>/dev/null || true
docker rm punjabi-heritage 2>/dev/null || true

# Create simple Dockerfile
echo "📝 Creating simple Dockerfile..."
cat > Dockerfile.simple << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY server-package.json package.json
RUN npm install --production

# Copy the simple server
COPY simple-sync-server.js server.js

# Create sync-data directory
RUN mkdir -p sync-data

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
EOF

# Build image
echo "🔨 Building simple Docker image..."
docker build -f Dockerfile.simple -t punjabi-heritage-simple .

# Run container
echo "🚀 Starting simple container..."
docker run -d \
  --name punjabi-heritage \
  -p 3000:3000 \
  --restart unless-stopped \
  punjabi-heritage-simple

# Wait for startup
echo "⏳ Waiting for server to start..."
sleep 5

# Test health
echo "🧪 Testing health endpoint..."
if curl -s http://localhost:3000/api/health | grep -q "healthy"; then
  echo "✅ Simple sync server is running!"
  echo "🌐 Server URL: http://3.111.208.77:3000"
  echo "📊 Health: http://3.111.208.77:3000/api/health"
  echo "🔄 Sync: http://3.111.208.77:3000/api/sync/products"
  
  echo ""
  echo "🧪 Testing sync endpoint..."
  curl -X POST http://localhost:3000/api/sync/products \
    -H "Content-Type: application/json" \
    -d '{"action":"test"}' | jq '.' || echo "Raw response"
    
else
  echo "❌ Server failed to start"
  echo "📋 Container logs:"
  docker logs punjabi-heritage
fi

echo ""
echo "🎉 Deployment complete!"
