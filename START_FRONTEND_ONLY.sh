#!/bin/bash

# 🚀 Start Frontend Only (Next.js)
# Since your backend is working, just start the frontend

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

print_header "🚀 Starting Frontend Only (Next.js)"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root"
    exit 1
fi

# Kill existing processes on port 3000
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
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js found: $NODE_VERSION"

# Check if Next.js is available
print_status "Checking Next.js availability..."
if ! npx next --version > /dev/null 2>&1; then
    print_warning "Next.js not available. Installing..."
    npm install next@latest
fi

# Start Next.js server
print_status "Starting Next.js development server..."
print_status "Using: npm run dev"
npm run dev &

# Wait for server to start
sleep 10

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    print_success "🎉 Frontend server started successfully!"
    echo ""
    print_status "Your frontend is now running at:"
    echo "• Frontend: http://localhost:3000"
    echo "• Checkout: http://localhost:3000/checkout"
    echo "• Cart: http://localhost:3000/cart"
    echo "• Products: http://localhost:3000/products"
    echo ""
    print_status "🔗 Backend Connection:"
    echo "• Make sure your backend is running on port 3001"
    echo "• Checkout will use: http://localhost:3001/api/orders"
    echo "• Health check: http://localhost:3001/health"
    echo ""
    print_status "Features working:"
    echo "✅ Product browsing and search"
    echo "✅ Shopping cart functionality"
    echo "✅ Checkout with COD and Razorpay"
    echo "✅ Order management (via backend)"
    echo "✅ Admin panel for orders"
    echo "✅ User order tracking"
    echo ""
    print_success "Happy selling! 🎉"
    echo ""
    print_status "Press Ctrl+C to stop the frontend server"
    
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
