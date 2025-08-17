#!/bin/bash

echo "🔧 Fixing AWS Server Sync Endpoint"
echo "=================================="

# Test the current sync endpoint
echo "1. Testing current sync endpoint..."
SYNC_RESPONSE=$(curl -s -X POST http://localhost:3000/api/sync/products \
  -H "Authorization: Bearer punjabi-heritage-sync-secret-2024" \
  -H "Content-Type: application/json" \
  -d '{"action":"add","product":{"name":"Test Product","price":100,"category":"test","description":"Test","images":[],"inStock":true,"stockQuantity":10}}')

echo "Response: $SYNC_RESPONSE"

# If it fails, let's check what endpoints exist
echo ""
echo "2. Checking available endpoints..."
curl -s http://localhost:3000/api/health

echo ""
echo "3. Testing different sync format..."
SYNC_RESPONSE2=$(curl -s -X POST http://localhost:3000/api/sync/products \
  -H "Authorization: Bearer punjabi-heritage-sync-secret-2024" \
  -H "Content-Type: application/json" \
  -d '{"type":"add","data":{"name":"Test Product","price":100}}')

echo "Response 2: $SYNC_RESPONSE2"

echo ""
echo "4. Checking Docker logs for errors..."
docker logs punjabi-heritage --tail 20
