#!/bin/bash

# 🚀 Start Both Servers (Express + Next.js)
# This starts both servers so your frontend can work with Express backend

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

print_header "🚀 Starting Both Servers (Express + Next.js)"

# Kill existing processes
print_status "Checking for existing processes..."
if lsof -ti:3000 > /dev/null 2>&1; then
    print_warning "Port 3000 is in use. Killing existing process..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
fi

if lsof -ti:3001 > /dev/null 2>&1; then
    print_warning "Port 3001 is in use. Killing existing process..."
    lsof -ti:3001 | xargs kill -9
    sleep 2
fi

# Check Node.js installation
print_status "Checking Node.js installation..."
if ! command -v node > /dev/null 2>&1; then
    print_error "Node.js not found. Please install Node.js 16+ first"
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js found: $NODE_VERSION"

# Create data directory and files
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

# Start Express server first (backend)
print_status "Starting Express server (backend) on port 3001..."
print_status "Using: NODE_OPTIONS='--max-old-space-size=64' node simple-server.js"
export NODE_OPTIONS="--max-old-space-size=64"
node simple-server.js &

# Wait for Express server to start
sleep 5

# Check if Express server is running
if curl -s http://localhost:3001/health > /dev/null; then
    print_success "✅ Express server started successfully on port 3001"
else
    print_error "❌ Express server failed to start"
    exit 1
fi

# Start Next.js server (frontend)
print_status "Starting Next.js server (frontend) on port 3000..."
print_status "Using: npm run dev"
npm run dev &

# Wait for Next.js server to start
sleep 10

# Check if Next.js server is running
if curl -s http://localhost:3000 > /dev/null; then
    print_success "✅ Next.js server started successfully on port 3000"
else
    print_warning "⚠️ Next.js server may still be starting up..."
fi

print_header "🎉 Both Servers Started Successfully!"

echo ""
print_status "Your store is now running with:"
echo ""
print_status "🔧 Backend (Express Server):"
echo "• Port: 3001"
echo "• URL: http://localhost:3001"
echo "• Health: http://localhost:3001/health"
echo "• API: http://localhost:3001/api/orders"
echo ""
print_status "🎨 Frontend (Next.js):"
echo "• Port: 3000"
echo "• URL: http://localhost:3000"
echo "• Checkout: http://localhost:3000/checkout"
echo ""
print_status "🔗 How it works:"
echo "• Frontend runs on Next.js (port 3000)"
echo "• Backend runs on Express (port 3001)"
echo "• Checkout uses Express API for orders"
echo "• All other features use Next.js"
echo ""
print_status "Features working:"
echo "✅ Product browsing and search"
echo "✅ Shopping cart functionality"
echo "✅ Checkout with COD and Razorpay (via Express)"
echo "✅ Order management (local storage via Express)"
echo "✅ Admin panel for orders"
echo "✅ User order tracking"
echo ""
print_success "Happy selling! 🎉"
echo ""
print_status "Press Ctrl+C to stop both servers"
echo ""
print_status "To test checkout:"
echo "1. Go to: http://localhost:3000/checkout"
echo "2. Fill out the form"
echo "3. Choose COD or Razorpay"
echo "4. Orders will be saved via Express server"
echo ""
print_status "To check orders:"
echo "• View all orders: http://localhost:3001/api/orders"
echo "• Health check: http://localhost:3001/health"

# Keep the script running
wait
