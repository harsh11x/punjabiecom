#!/bin/bash

echo "🧪 Testing Simple Docker Deployment"
echo "==================================="

# Stop existing container
echo "🛑 Stopping existing container..."
docker stop punjabi-heritage 2>/dev/null || true
docker rm punjabi-heritage 2>/dev/null || true

# Create simple test Dockerfile
echo "📝 Creating test Dockerfile..."
cat > Dockerfile.test << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Install basic dependencies
RUN npm install express

# Copy test server
COPY test-server.js server.js

EXPOSE 3000

CMD ["node", "server.js"]
EOF

# Build test image
echo "🔨 Building test image..."
docker build -f Dockerfile.test -t punjabi-test-server .

if [ $? -ne 0 ]; then
    echo "❌ Test image build failed"
    exit 1
fi

# Run test container
echo "🚀 Starting test container..."
docker run -d \
  --name punjabi-heritage \
  --restart unless-stopped \
  -p 3000:3000 \
  punjabi-test-server

# Wait and check
echo "⏳ Waiting for test container..."
sleep 5

if docker ps | grep -q punjabi-heritage; then
    echo "✅ Test container is running!"
    
    # Test health
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✅ Test server health check passed!"
        echo "🎉 Basic Docker setup is working!"
        
        echo ""
        echo "📋 Test results:"
        curl -s http://localhost:3000/api/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:3000/api/health
        
        echo ""
        echo "🔧 Now let's try the full server..."
        echo "Run: ./deploy-full-server-docker.sh"
    else
        echo "❌ Test server health check failed"
        echo "📋 Container logs:"
        docker logs punjabi-heritage
    fi
else
    echo "❌ Test container failed to start"
    echo "📋 Container logs:"
    docker logs punjabi-heritage 2>/dev/null || echo "No logs available"
fi

# Cleanup test files
rm -f Dockerfile.test
