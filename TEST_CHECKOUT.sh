#!/bin/bash

# 🧪 Test Checkout Process
# This script tests if the order creation is working

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_header "🧪 Testing Checkout Process"

# Check if test server is running
print_status "Checking if test server is running..."
if ! curl -s http://localhost:3001/health > /dev/null; then
    print_warning "Test server not running. Starting it..."
    
    # Start test server
    print_status "Starting test server on port 3001..."
    export NODE_OPTIONS="--max-old-space-size=64"
    node test-express-server.js &
    
    # Wait for server to start
    sleep 5
    
    if ! curl -s http://localhost:3001/health > /dev/null; then
        print_error "Failed to start test server"
        exit 1
    fi
    print_success "Test server started"
else
    print_success "Test server is already running"
fi

# Test health endpoint
print_status "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:3001/health)
if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    print_success "Health check passed"
    echo "Response: $HEALTH_RESPONSE"
else
    print_error "Health check failed"
    echo "Response: $HEALTH_RESPONSE"
    exit 1
fi

# Test order creation
print_status "Testing order creation..."
TEST_ORDER='{
  "customerEmail": "test@example.com",
  "items": [
    {
      "id": "test-product-1",
      "name": "Test Product",
      "price": 1500,
      "quantity": 1,
      "size": "M",
      "color": "Red"
    }
  ],
  "subtotal": 1500,
  "shippingCost": 0,
  "tax": 0,
  "total": 1500,
  "paymentMethod": "cod",
  "shippingAddress": {
    "fullName": "Test User",
    "addressLine1": "123 Test Street",
    "city": "Test City",
    "state": "Test State",
    "pincode": "123456",
    "phone": "+1234567890"
  }
}'

ORDER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d "$TEST_ORDER")

if echo "$ORDER_RESPONSE" | grep -q "success.*true"; then
    print_success "Order creation test passed"
    echo "Response: $ORDER_RESPONSE"
else
    print_error "Order creation test failed"
    echo "Response: $ORDER_RESPONSE"
    exit 1
fi

# Test order retrieval
print_status "Testing order retrieval..."
ORDERS_RESPONSE=$(curl -s "http://localhost:3001/api/orders?email=test@example.com")
if echo "$ORDERS_RESPONSE" | grep -q "success.*true"; then
    print_success "Order retrieval test passed"
    echo "Response: $ORDERS_RESPONSE"
else
    print_error "Order retrieval test failed"
    echo "Response: $ORDERS_RESPONSE"
    exit 1
fi

# Check data files
print_status "Checking data files..."
if [ -f "data/orders.json" ]; then
    ORDERS_COUNT=$(cat data/orders.json | jq '. | length' 2>/dev/null || echo "0")
    print_success "Orders file exists with $ORDERS_COUNT orders"
else
    print_warning "Orders file not found"
fi

print_header "🎯 All Tests Passed!"

echo ""
print_success "Your checkout system is working correctly!"
echo ""
print_status "Next steps:"
echo "1. Make sure your frontend is pointing to the correct API endpoint"
echo "2. Check if you're using the Express server or Next.js API routes"
echo "3. Verify the data directory permissions on your AWS instance"
echo ""
print_status "Test URLs:"
echo "• Health: http://localhost:3001/health"
echo "• Test: http://localhost:3001/test"
echo "• Orders: http://localhost:3001/api/orders"
echo ""
print_status "To stop the test server:"
echo "• Press Ctrl+C or kill the process on port 3001"
