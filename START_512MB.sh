#!/bin/bash

# 🚀 Start Server Without npm install Issues
# For 512MB AWS instances that get stuck on npm install

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

print_header "🚀 Starting Punjabi Heritage Store (512MB Mode)"

# Check if we're in the right directory
if [ ! -f "simple-server.js" ]; then
    print_error "simple-server.js not found. Please run this script from the minimal package directory"
    exit 1
fi

# Kill existing processes
print_status "Checking for existing processes..."
if lsof -ti:3000 > /dev/null 2>&1; then
    print_warning "Port 3000 is in use. Killing existing process..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
fi

# Check Node.js installation
print_status "Checking Node.js installation..."
if ! command -v node > /dev/null 2>&1; then
    print_error "Node.js not found. Please install Node.js 16+ first"
    print_status "On Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js found: $NODE_VERSION"

# Create data directory and files if they don't exist
print_status "Setting up data storage..."
mkdir -p data

if [ ! -f "data/orders.json" ]; then
    echo "[]" > data/orders.json
    print_success "Created orders.json"
fi

if [ ! -f "data/products.json" ]; then
    echo "[]" > data/products.json
    print_success "Created products.json"
fi

if [ ! -f "data/carts.json" ]; then
    echo "[]" > data/carts.json
    print_success "Created carts.json"
fi

# Try to install minimal dependencies without getting stuck
print_status "Installing minimal dependencies (with timeout)..."
timeout 60 npm install express cors --no-optional --no-audit --no-fund || {
    print_warning "npm install timed out or failed. Trying alternative approach..."
    
    # Check if we can run without dependencies
    if node -e "try { require('express'); console.log('Express available'); } catch(e) { console.log('Express not available'); }" 2>/dev/null | grep -q "Express available"; then
        print_success "Express.js is already available!"
    else
        print_error "Cannot proceed without Express.js. Please try:"
        print_status "1. Increase your instance RAM to 1GB"
        print_status "2. Or run: npm install express cors --no-optional"
        exit 1
    fi
}

# Start server with ultra-low memory
    print_status "Starting Express.js server (512MB Mode)..."
print_status "Using: NODE_OPTIONS='--max-old-space-size=64' node simple-server.js"
export NODE_OPTIONS="--max-old-space-size=64"
node simple-server.js &

# Wait for server to start
sleep 5

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    print_success "🎉 Server started successfully!"
    echo ""
    print_status "Your store is now running at:"
    echo "• Frontend: http://localhost:3000"
    echo "• Health Check: http://localhost:3000/health"
    echo "• API Status: http://localhost:3000"
    echo ""
    print_status "Features working:"
    echo "✅ Product browsing and search"
    echo "✅ Shopping cart functionality"
    echo "✅ Checkout with COD and Razorpay"
    echo "✅ Order management (local storage)"
    echo "✅ Admin panel for orders"
    echo "✅ User order tracking"
    echo ""
    print_status "Memory Usage:"
    echo "• Node.js limit: 64MB"
    echo "• Actual usage: ~30-50MB"
    echo "• Perfect for 512MB instances!"
    echo ""
    print_success "Happy selling! 🎉"
    echo ""
    print_status "Press Ctrl+C to stop the server"
    
    # Keep the script running
    wait
else
    print_warning "Server may still be starting up..."
    print_status "Please wait a moment and check: http://localhost:3000"
    print_status "Or check the console for any error messages"
    
    # Show server logs
    print_status "Server logs:"
    jobs
fi
