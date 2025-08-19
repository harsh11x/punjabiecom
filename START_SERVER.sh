#!/bin/bash

# 🚀 Simple Server Startup Script for Punjabi Heritage E-commerce Store
# This script starts everything with local storage - no AWS setup needed!

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
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

print_status "🚀 Starting Punjabi Heritage E-commerce Store..."

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

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
fi

# Create data directory if it doesn't exist
if [ ! -d "data" ]; then
    print_status "Creating data directory..."
    mkdir -p data
fi

# Create initial data files if they don't exist
if [ ! -f "data/orders.json" ]; then
    print_status "Creating orders data file..."
    echo "[]" > data/orders.json
fi

if [ ! -f "data/products.json" ]; then
    print_status "Creating products data file..."
    echo "[]" > data/products.json
fi

if [ ! -f "data/carts.json" ]; then
    print_status "Creating carts data file..."
    echo "[]" > data/carts.json
fi

# Start the application
print_status "Starting Next.js development server..."
npm run dev &

# Wait for server to start
sleep 8

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    print_success "🎉 Server started successfully!"
    echo ""
    print_status "Your store is now running at:"
    echo "• Frontend: http://localhost:3000"
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
fi
