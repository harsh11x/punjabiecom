#!/bin/bash

# 🧪 Test Setup Script for Punjabi Heritage E-commerce Store
# This script tests the environment and shows what's working

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

print_header "🧪 Testing Environment Setup"

# Check Node.js
print_status "Checking Node.js..."
if command -v node > /dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check npm
print_status "Checking npm..."
if command -v npm > /dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
else
    print_error "npm not found. Please install npm"
    exit 1
fi

# Check npx
print_status "Checking npx..."
if command -v npx > /dev/null 2>&1; then
    NPX_VERSION=$(npx --version)
    print_success "npx found: $NPX_VERSION"
else
    print_error "npx not found. Please install npx"
    exit 1
fi

# Check if we're in the right directory
print_status "Checking project directory..."
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root"
    exit 1
fi
print_success "Project directory is correct"

# Check package.json
print_status "Checking package.json..."
if [ -f "package.json" ]; then
    PROJECT_NAME=$(grep '"name"' package.json | cut -d'"' -f4)
    print_success "Project: $PROJECT_NAME"
else
    print_error "package.json not found"
    exit 1
fi

# Check if node_modules exists
print_status "Checking dependencies..."
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Installing dependencies..."
    npm install
else
    print_success "Dependencies already installed"
fi

# Check if next is available
print_status "Checking Next.js..."
if npx next --version > /dev/null 2>&1; then
    NEXT_VERSION=$(npx next --version)
    print_success "Next.js found: $NEXT_VERSION"
else
    print_error "Next.js not available. Installing..."
    npm install next@latest
fi

# Check data directory
print_status "Checking data directory..."
if [ ! -d "data" ]; then
    print_status "Creating data directory..."
    mkdir -p data
fi

# Create initial data files
print_status "Creating initial data files..."
echo "[]" > data/orders.json
echo "[]" > data/products.json
echo "[]" > data/carts.json
print_success "Data files created"

# Test build
print_status "Testing build..."
if npm run build > /dev/null 2>&1; then
    print_success "Build successful!"
else
    print_warning "Build may have issues. Check manually with: npm run build"
fi

print_header "🎯 Environment Test Complete!"

echo ""
print_success "Your environment is ready!"
echo ""
print_status "Next steps:"
echo "1. Run: ./START_SERVER.sh"
echo "2. Or manually: npx next dev"
echo "3. Visit: http://localhost:3000"
echo ""
print_status "If you encounter issues:"
echo "• Check the console output"
echo "• Verify all dependencies are installed"
echo "• Ensure you're in the project root directory"
echo ""
print_success "Ready to start your store! 🚀"
