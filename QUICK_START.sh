#!/bin/bash

# 🚀 Quick Start Script for Punjabi Heritage E-commerce Store
# This script quickly starts the application without AWS setup

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

print_status "🚀 Quick Starting Punjabi Heritage E-commerce Store..."

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

# Start the application
print_status "Starting Next.js development server..."
npm run dev &

# Wait for server to start
sleep 8

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    print_success "Application started successfully!"
    echo ""
    print_status "Your store is now running at:"
    echo "• Frontend: http://localhost:3000"
    echo "• Admin Panel: http://localhost:3000/admin"
    echo "• Orders Page: http://localhost:3000/orders"
    echo ""
    print_warning "Note: This is a quick start without AWS setup."
    print_warning "For full AWS order storage, run: ./COMPLETE_AWS_SETUP.sh"
    echo ""
    print_success "Happy selling! 🎉"
else
    print_warning "Server may still be starting up..."
    print_status "Please wait a moment and check: http://localhost:3000"
fi
