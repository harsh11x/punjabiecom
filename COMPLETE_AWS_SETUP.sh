#!/bin/bash

# 🚀 Complete AWS Setup Script for Punjabi Heritage E-commerce Store
# This script sets up everything automatically including AWS services

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
    
    # Check AWS CLI
    if ! command_exists aws; then
        print_warning "AWS CLI is not installed. Installing..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command_exists brew; then
                brew install awscli
            else
                print_error "Homebrew not found. Please install AWS CLI manually:"
                print_status "https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
                exit 1
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
            unzip awscliv2.zip
            sudo ./aws/install
            rm -rf aws awscliv2.zip
        else
            print_error "Unsupported OS. Please install AWS CLI manually."
            exit 1
        fi
    fi
    
    # Check jq (JSON processor)
    if ! command_exists jq; then
        print_warning "jq is not installed. Installing..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command_exists brew; then
                brew install jq
            else
                print_error "Homebrew not found. Please install jq manually:"
                print_status "https://jqlang.github.io/jq/download/"
                exit 1
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            if command_exists apt-get; then
                sudo apt-get update && sudo apt-get install -y jq
            elif command_exists yum; then
                sudo yum install -y jq
            else
                print_error "Package manager not found. Please install jq manually."
                exit 1
            fi
        else
            print_error "Unsupported OS. Please install jq manually."
            exit 1
        fi
    fi
    
    print_success "All dependencies are installed"
}

# Function to setup AWS services
setup_aws() {
    print_header "Setting up AWS Services"
    
    # Check if AWS is configured
    if ! aws sts get-caller-identity >/dev/null 2>&1; then
        print_warning "AWS CLI not configured. Please configure it first:"
        print_status "Run: aws configure"
        print_status "You'll need your AWS Access Key ID and Secret Access Key"
        print_status "Visit: https://console.aws.amazon.com/iam/ for credentials"
        
        read -p "Press Enter after configuring AWS CLI..."
        
        if ! aws sts get-caller-identity >/dev/null 2>&1; then
            print_error "AWS CLI still not configured. Exiting."
            exit 1
        fi
    fi
    
    # Get AWS account ID
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    AWS_REGION=${AWS_REGION:-"us-east-1"}
    BUCKET_NAME="punjabi-heritage-orders-${AWS_ACCOUNT_ID}"
    TABLE_NAME="punjabi-heritage-orders"
    
    print_status "Using AWS Account: $AWS_ACCOUNT_ID"
    print_status "Using AWS Region: $AWS_REGION"
    print_status "Bucket Name: $BUCKET_NAME"
    print_status "Table Name: $TABLE_NAME"
    
    # Create S3 bucket
    print_status "Creating S3 bucket..."
    if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
        aws s3 mb "s3://$BUCKET_NAME" --region "$AWS_REGION"
        print_success "S3 bucket created: $BUCKET_NAME"
    else
        print_success "S3 bucket already exists: $BUCKET_NAME"
    fi
    
    # Create DynamoDB table
    print_status "Creating DynamoDB table..."
    if ! aws dynamodb describe-table --table-name "$TABLE_NAME" --region "$AWS_REGION" >/dev/null 2>&1; then
        aws dynamodb create-table \
            --table-name "$TABLE_NAME" \
            --attribute-definitions AttributeName=_id,AttributeType=S \
            --key-schema AttributeName=_id,KeyType=HASH \
            --billing-mode PAY_PER_REQUEST \
            --region "$AWS_REGION"
        
        print_success "DynamoDB table created: $TABLE_NAME"
        
        # Wait for table to be active
        print_status "Waiting for table to be active..."
        aws dynamodb wait table-exists --table-name "$TABLE_NAME" --region "$AWS_REGION"
        
        # Create GSI for order number
        print_status "Creating Global Secondary Indexes..."
        aws dynamodb update-table \
            --table-name "$TABLE_NAME" \
            --attribute-definitions AttributeName=orderNumber,AttributeType=S \
            --global-secondary-index-updates \
                "[{\"Create\":{\"IndexName\":\"orderNumber-index\",\"KeySchema\":[{\"AttributeName\":\"orderNumber\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}}]" \
            --region "$AWS_REGION"
        
        # Create GSI for customer email
        aws dynamodb update-table \
            --table-name "$TABLE_NAME" \
            --attribute-definitions AttributeName=customerEmail,AttributeType=S \
            --global-secondary-index-updates \
                "[{\"Create\":{\"IndexName\":\"customerEmail-index\",\"KeySchema\":[{\"AttributeName\":\"customerEmail\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}}]" \
            --region "$AWS_REGION"
        
        print_success "Global Secondary Indexes created"
    else
        print_success "DynamoDB table already exists: $TABLE_NAME"
    fi
    
    # Create IAM user for application
    print_status "Creating IAM user for application..."
    IAM_USERNAME="punjabi-heritage-orders-user"
    
    if ! aws iam get-user --user-name "$IAM_USERNAME" >/dev/null 2>&1; then
        # Create user
        aws iam create-user --user-name "$IAM_USERNAME"
        
        # Create access key
        ACCESS_KEY_OUTPUT=$(aws iam create-access-key --user-name "$IAM_USERNAME")
        ACCESS_KEY_ID=$(echo "$ACCESS_KEY_OUTPUT" | jq -r '.AccessKey.AccessKeyId')
        SECRET_ACCESS_KEY=$(echo "$ACCESS_KEY_OUTPUT" | jq -r '.AccessKey.SecretAccessKey')
        
        # Create policy
        POLICY_ARN=$(aws iam create-policy \
            --policy-name "PunjabiHeritageOrdersPolicy" \
            --policy-document "{
                \"Version\": \"2012-10-17\",
                \"Statement\": [
                    {
                        \"Effect\": \"Allow\",
                        \"Action\": [
                            \"s3:GetObject\",
                            \"s3:PutObject\",
                            \"s3:DeleteObject\",
                            \"s3:ListBucket\"
                        ],
                        \"Resource\": [
                            \"arn:aws:s3:::$BUCKET_NAME\",
                            \"arn:aws:s3:::$BUCKET_NAME/*\"
                        ]
                    },
                    {
                        \"Effect\": \"Allow\",
                        \"Action\": [
                            \"dynamodb:GetItem\",
                            \"dynamodb:PutItem\",
                            \"dynamodb:UpdateItem\",
                            \"dynamodb:DeleteItem\",
                            \"dynamodb:Query\",
                            \"dynamodb:Scan\"
                        ],
                        \"Resource\": [
                            \"arn:aws:dynamodb:$AWS_REGION:$AWS_ACCOUNT_ID:table/$TABLE_NAME\",
                            \"arn:aws:dynamodb:$AWS_REGION:$AWS_ACCOUNT_ID:table/$TABLE_NAME/index/*\"
                        ]
                    }
                ]
            }" | jq -r '.Policy.Arn')
        
        # Attach policy to user
        aws iam attach-user-policy --user-name "$IAM_USERNAME" --policy-arn "$POLICY_ARN"
        
        print_success "IAM user created: $IAM_USERNAME"
        print_warning "IMPORTANT: Save these credentials:"
        echo "AWS_ACCESS_KEY_ID=$ACCESS_KEY_ID"
        echo "AWS_SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY"
        echo ""
        print_status "These will be added to your .env.local file"
        
        # Save credentials to .env.local
        echo "" >> .env.local
        echo "# AWS Configuration for Order Storage" >> .env.local
        echo "AWS_ACCESS_KEY_ID=$ACCESS_KEY_ID" >> .env.local
        echo "AWS_SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY" >> .env.local
        echo "AWS_REGION=$AWS_REGION" >> .env.local
        echo "AWS_S3_BUCKET=$BUCKET_NAME" >> .env.local
        echo "AWS_DYNAMODB_TABLE=$TABLE_NAME" >> .env.local
        
        print_success "AWS credentials added to .env.local"
    else
        print_success "IAM user already exists: $IAM_USERNAME"
        
        # Get existing access key
        ACCESS_KEY_OUTPUT=$(aws iam list-access-keys --user-name "$IAM_USERNAME")
        ACCESS_KEY_ID=$(echo "$ACCESS_KEY_OUTPUT" | jq -r '.AccessKeyMetadata[0].AccessKeyId')
        
        if [ "$ACCESS_KEY_ID" != "null" ]; then
            print_status "Using existing access key: $ACCESS_KEY_ID"
            
            # Update .env.local with existing credentials
            if ! grep -q "AWS_ACCESS_KEY_ID" .env.local; then
                echo "" >> .env.local
                echo "# AWS Configuration for Order Storage" >> .env.local
                echo "AWS_ACCESS_KEY_ID=$ACCESS_KEY_ID" >> .env.local
                echo "AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY_HERE" >> .env.local
                echo "AWS_REGION=$AWS_REGION" >> .env.local
                echo "AWS_S3_BUCKET=$BUCKET_NAME" >> .env.local
                echo "AWS_DYNAMODB_TABLE=$TABLE_NAME" >> .env.local
                
                print_warning "Please add your AWS_SECRET_ACCESS_KEY to .env.local"
            fi
        fi
    fi
}

# Function to install npm dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    print_status "Installing npm packages..."
    npm install
    
    print_success "Dependencies installed"
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
    
    # Check if required environment variables are set
    if ! grep -q "RAZORPAY_KEY_ID" .env.local || grep -q "your-razorpay-key-id" .env.local; then
        print_warning "Please configure Razorpay keys in .env.local"
    fi
    
    if ! grep -q "MONGODB_URI" .env.local || grep -q "your-mongodb-uri" .env.local; then
        print_warning "Please configure MongoDB URI in .env.local"
    fi
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

# Function to test AWS integration
test_aws_integration() {
    print_header "Testing AWS Integration"
    
    print_status "Testing order creation..."
    
    # Wait a bit more for server to be fully ready
    sleep 10
    
    # Test order creation
    TEST_RESPONSE=$(curl -s -X POST http://localhost:3000/api/orders \
        -H "Content-Type: application/json" \
        -d '{
            "customerEmail": "test@example.com",
            "items": [{"productId": "test", "name": "Test Product", "price": 100, "quantity": 1}],
            "shippingAddress": {"fullName": "Test User", "addressLine1": "Test Address", "city": "Test City", "state": "Test State", "pincode": "12345", "phone": "1234567890"},
            "subtotal": 100,
            "shippingCost": 0,
            "tax": 0
        }')
    
    if echo "$TEST_RESPONSE" | grep -q "success.*true"; then
        print_success "AWS integration test passed!"
        print_status "Order created and saved to AWS"
    else
        print_warning "AWS integration test failed or incomplete"
        print_status "Response: $TEST_RESPONSE"
    fi
}

# Function to show final instructions
show_final_instructions() {
    print_header "Setup Complete!"
    
    echo ""
    print_success "Your Punjabi Heritage E-commerce Store is now running with AWS order storage!"
    echo ""
    print_status "Next Steps:"
    echo "1. Visit http://localhost:3000 to see your store"
    echo "2. Go to http://localhost:3000/admin to manage orders"
    echo "3. Test placing an order to verify AWS storage"
    echo "4. Check your AWS S3 bucket and DynamoDB table for orders"
    echo ""
    print_status "Important URLs:"
    echo "• Store Frontend: http://localhost:3000"
    echo "• Admin Panel: http://localhost:3000/admin"
    echo "• User Orders: http://localhost:3000/orders"
    echo "• API Endpoints: http://localhost:3000/api/*"
    echo ""
    print_status "AWS Resources Created:"
    echo "• S3 Bucket: $BUCKET_NAME"
    echo "• DynamoDB Table: $TABLE_NAME"
    echo "• IAM User: punjabi-heritage-orders-user"
    echo ""
    print_warning "Remember to:"
    echo "• Keep your AWS credentials secure"
    echo "• Monitor your AWS usage and costs"
    echo "• Set up proper backup and monitoring in production"
    echo ""
    print_success "Happy selling! 🎉"
}

# Main execution
main() {
    print_header "🚀 Punjabi Heritage E-commerce Store - Complete AWS Setup"
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -f "next.config.js" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
    
    # Check dependencies
    check_dependencies
    
    # Setup environment
    setup_environment
    
    # Setup AWS services
    setup_aws
    
    # Install dependencies
    install_dependencies
    
    # Kill existing processes
    kill_existing_processes
    
    # Start application
    start_application
    
    # Test AWS integration
    test_aws_integration
    
    # Show final instructions
    show_final_instructions
}

# Run main function
main "$@"
