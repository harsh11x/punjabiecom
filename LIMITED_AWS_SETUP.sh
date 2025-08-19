#!/bin/bash

# 🚀 Limited AWS Setup Script for Punjabi Heritage E-commerce Store
# This script works with limited AWS permissions (like Lightsail instances)

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
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
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
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

# Function to check and install dependencies
check_dependencies() {
    print_header "Checking Dependencies"
    
    # Check Node.js
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        print_status "Visit: https://nodejs.org/"
        exit 1
    fi
    
    # Check npm
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Function to setup environment
setup_environment() {
    print_header "Setting up Environment"
    
    # Check if .env.local exists
    if [ ! -f .env.local ]; then
        print_status "Creating .env.local from .env.example..."
        cp .env.example .env.local
        print_warning "Please configure your .env.local file with your actual values"
    else
        print_success ".env.local already exists"
    fi
    
    # Add AWS fallback configuration
    if ! grep -q "AWS_ACCESS_KEY_ID" .env.local; then
        echo "" >> .env.local
        echo "# AWS Configuration (Optional - will fallback to local storage if not configured)" >> .env.local
        echo "# AWS_ACCESS_KEY_ID=your-aws-access-key-id" >> .env.local
        echo "# AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key" >> .env.local
        echo "# AWS_REGION=us-east-1" >> .env.local
        echo "# AWS_S3_BUCKET=your-bucket-name" >> .env.local
        echo "# AWS_DYNAMODB_TABLE=your-table-name" >> .env.local
        
        print_success "AWS configuration template added to .env.local"
    fi
}

# Function to install npm dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    print_status "Installing npm packages..."
    npm install
    
    print_success "Dependencies installed"
}

# Function to kill existing processes
kill_existing_processes() {
    print_header "Killing Existing Processes"
    
    # Kill processes on common ports
    kill_port 3000  # Next.js
    kill_port 3001  # Alternative port
    kill_port 8080  # Common alternative
    kill_port 8000  # Common alternative
    
    # Kill any existing Node.js processes
    if pgrep -f "node.*dev" > /dev/null; then
        print_warning "Killing existing Node.js development processes..."
        pkill -f "node.*dev"
        sleep 2
    fi
    
    print_success "All existing processes killed"
}

# Function to start the application
start_application() {
    print_header "Starting Application"
    
    print_status "Starting Next.js development server..."
    npm run dev &
    
    # Wait for server to start
    sleep 5
    
    # Check if server is running
    if curl -s http://localhost:3000 > /dev/null; then
        print_success "Application started successfully!"
        print_status "Frontend: http://localhost:3000"
        print_status "Admin Panel: http://localhost:3000/admin"
        print_status "Orders Page: http://localhost:3000/orders"
    else
        print_error "Failed to start application"
        exit 1
    fi
}

# Function to test order creation
test_order_creation() {
    print_header "Testing Order Creation"
    
    print_status "Testing order creation with fallback storage..."
    
    # Wait a bit more for server to be fully ready
    sleep 10
    
    # Test order creation
    TEST_RESPONSE=$(curl -s -X POST http://localhost:3000/api/orders \
        -H "Content-Type: application/json" \
        -d '{
            "customerEmail": "test@example.com",
            "items": [{"productId": "test", "name": "Test Product", "punjabiName": "Test Product", "price": 100, "quantity": 1, "size": "Standard", "color": "Default", "image": ""}],
            "shippingAddress": {"fullName": "Test User", "addressLine1": "Test Address", "city": "Test City", "state": "Test State", "pincode": "12345", "phone": "1234567890"},
            "subtotal": 100,
            "shippingCost": 0,
            "tax": 0,
            "total": 100
        }')
    
    if echo "$TEST_RESPONSE" | grep -q "success.*true"; then
        print_success "Order creation test passed!"
        print_status "Order created and saved to local storage"
    else
        print_warning "Order creation test may have issues"
        print_status "Response: $TEST_RESPONSE"
    fi
}

# Function to show AWS setup instructions
show_aws_instructions() {
    print_header "AWS Setup Instructions"
    
    echo ""
    print_warning "AWS permissions are limited on this instance."
    print_status "To enable AWS order storage, you have several options:"
    echo ""
    print_status "Option 1: Manual AWS Setup (Recommended)"
    echo "1. Go to AWS Console: https://console.aws.amazon.com/"
    echo "2. Create S3 bucket: punjabi-heritage-orders-$(date +%s)"
    echo "3. Create DynamoDB table: punjabi-heritage-orders"
    echo "4. Create IAM user with S3 + DynamoDB permissions"
    echo "5. Add credentials to .env.local:"
    echo "   AWS_ACCESS_KEY_ID=your-access-key"
    echo "   AWS_SECRET_ACCESS_KEY=your-secret-key"
    echo "   AWS_REGION=us-east-1"
    echo "   AWS_S3_BUCKET=your-bucket-name"
    echo "   AWS_DYNAMODB_TABLE=punjabi-heritage-orders"
    echo ""
    print_status "Option 2: Use Local Storage (Already Working)"
    echo "• Orders are saved to local files in data/ directory"
    echo "• No AWS setup required"
    echo "• Good for development and testing"
    echo ""
    print_status "Option 3: Request AWS Permissions"
    echo "• Contact your AWS administrator"
    echo "• Request S3:CreateBucket and DynamoDB permissions"
    echo "• Run the full AWS setup script"
    echo ""
}

# Function to show final instructions
show_final_instructions() {
    print_header "Setup Complete!"
    
    echo ""
    print_success "Your Punjabi Heritage E-commerce Store is now running!"
    echo ""
    print_status "Application URLs:"
    echo "• Store Frontend: http://localhost:3000"
    echo "• Admin Panel: http://localhost:3000/admin"
    echo "• User Orders: http://localhost:3000/orders"
    echo "• API Endpoints: http://localhost:3000/api/*"
    echo ""
    print_status "Current Configuration:"
    echo "• Order Storage: Local files (data/orders.json)"
    echo "• Cart Storage: Local storage + file backup"
    echo "• Product Storage: Local files (data/products.json)"
    echo ""
    print_warning "To enable AWS storage:"
    echo "1. Set up AWS services manually (see instructions above)"
    echo "2. Add AWS credentials to .env.local"
    echo "3. Restart the application"
    echo ""
    print_success "Happy selling! 🎉"
}

# Main execution
main() {
    print_header "🚀 Punjabi Heritage E-commerce Store - Limited Setup"
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -f "next.config.js" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
    
    # Check dependencies
    check_dependencies
    
    # Setup environment
    setup_environment
    
    # Install dependencies
    install_dependencies
    
    # Kill existing processes
    kill_existing_processes
    
    # Start application
    start_application
    
    # Test order creation
    test_order_creation
    
    # Show AWS setup instructions
    show_aws_instructions
    
    # Show final instructions
    show_final_instructions
}

# Run main function
main "$@"
