#!/bin/bash

# 🚀 AWS Production Server Startup Script
# For instances with limited RAM - uses production build

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

# Function to kill process on port
kill_port() {
    local port=$1
    if lsof -ti:$port > /dev/null 2>&1; then
        print_warning "Port $port is in use. Killing existing process..."
        lsof -ti:$port | xargs kill -9
        sleep 2
        print_success "Port $port freed"
    fi
}

print_header "🚀 Starting Punjabi Heritage E-commerce Store (Production Mode)"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root"
    exit 1
fi

# Kill existing processes
print_status "Checking for existing processes..."
kill_port 3000
kill_port 3001
kill_port 8080
kill_port 8000

# Kill any existing Node.js processes
if pgrep -f "node.*dev" > /dev/null; then
    print_warning "Killing existing Node.js development processes..."
    pkill -f "node.*dev"
    sleep 2
fi

# Check Node.js installation
print_status "Checking Node.js installation..."
if ! command -v node > /dev/null 2>&1; then
    print_error "Node.js not found. Please install Node.js 18+ first"
    print_status "On Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js found: $NODE_VERSION"

# Check npm installation
print_status "Checking npm installation..."
if ! command -v npm > /dev/null 2>&1; then
    print_error "npm not found. Please install npm"
    exit 1
fi

NPM_VERSION=$(npm --version)
print_success "npm found: $NPM_VERSION"

# Install dependencies
print_status "Installing/updating dependencies..."
npm install

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

# Build the application with memory optimization
print_status "Building application with memory optimization..."
export NODE_OPTIONS="--max-old-space-size=512"
if npm run build > /dev/null 2>&1; then
    print_success "Build successful with memory optimization!"
else
    print_error "Build failed. Please check the console for errors"
    exit 1
fi

# Start the production server with memory optimization
print_status "Starting Next.js production server (Low Memory Mode)..."
print_status "Using: NODE_OPTIONS='--max-old-space-size=512' npx next start"
export NODE_OPTIONS="--max-old-space-size=512"
npx next start &

# Wait for server to start
sleep 15

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    print_success "🎉 Production server started successfully in Low Memory Mode!"
    echo ""
    print_status "Your store is now running at:"
    echo "• Frontend: http://localhost:3000"
    echo "• Network: http://172.26.9.91:3000"
    echo "• Admin Panel: http://localhost:3000/admin"
    echo "• User Orders: http://localhost:3000/orders"
    echo "• Cart: http://localhost:3000/cart"
    echo "• Checkout: http://localhost:3000/checkout"
    echo ""
    print_status "Features working:"
    echo "✅ Product browsing and search"
    echo "✅ Shopping cart functionality"
    echo "✅ Checkout with COD and Razorpay"
    echo "✅ Order management (local storage)"
    echo "✅ Admin panel for orders"
    echo "✅ User order tracking"
    echo "✅ Responsive design"
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
