#!/bin/bash

echo "🧪 Testing AWS Sync Server"
echo "=========================="

# Test 1: Health check
echo "1. Testing health endpoint..."
curl -s http://localhost:3000/api/health | jq '.' || echo "Health check failed"

echo ""
echo "2. Testing sync endpoint with different formats..."

# Test 2: Simple test action
echo "Format 1: Simple test action"
curl -s -X POST http://localhost:3000/api/sync/products \
  -H "Content-Type: application/json" \
  -d '{"action":"test"}' | jq '.' || echo "Failed"

echo ""
echo "Format 2: With authorization header"
curl -s -X POST http://localhost:3000/api/sync/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer punjabi-heritage-sync-secret-2024" \
  -d '{"action":"test"}' | jq '.' || echo "Failed"

echo ""
echo "Format 3: Check what endpoints exist"
curl -s http://localhost:3000/api/ | jq '.' || echo "No API info"

echo ""
echo "Format 4: Check server logs"
docker logs punjabi-heritage --tail 20

echo ""
echo "Format 5: Check if server is actually running"
docker ps | grep punjabi

echo ""
echo "Format 6: Test different endpoint"
curl -s http://localhost:3000/ || echo "Root endpoint failed"

echo ""
echo "🔍 Debugging complete!"
