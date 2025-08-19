# 🚀 Punjabi Heritage E-commerce Store - Setup Guide

Welcome to your complete e-commerce solution with AWS order storage! This guide will help you get everything running quickly.

## 🎯 **What You Get**

✅ **Complete E-commerce Store** with Punjabi heritage products  
✅ **AWS Order Storage** - No more local storage issues  
✅ **Admin Panel** for order management and tracking  
✅ **User Order Tracking** with real-time status updates  
✅ **Payment Integration** (Razorpay + COD)  
✅ **Responsive Design** for all devices  

## 🚀 **Quick Start Options**

### Option 1: Quick Start (No AWS) - 2 minutes
```bash
./QUICK_START.sh
```
- Starts the application immediately
- Uses local storage for orders
- Good for testing and development

### Option 2: Complete Setup (With AWS) - 10 minutes
```bash
./COMPLETE_AWS_SETUP.sh
```
- Sets up AWS services automatically
- Creates S3 bucket, DynamoDB table, and IAM user
- Configures environment variables
- Starts the application with AWS order storage

## 📋 **Prerequisites**

### For Quick Start:
- Node.js 18+ 
- npm

### For Complete AWS Setup:
- Node.js 18+
- npm
- AWS CLI
- AWS Account
- jq (JSON processor)

## 🔧 **Detailed Setup Instructions**

### Step 1: Clone and Navigate
```bash
cd punjabi-ecom-storeV4
```

### Step 2: Choose Your Setup

#### Quick Start (Recommended for first-time users):
```bash
./QUICK_START.sh
```

#### Complete AWS Setup (For production):
```bash
./COMPLETE_AWS_SETUP.sh
```

### Step 3: Configure Environment Variables

The scripts will create `.env.local` for you, but you may need to add:

```bash
# Razorpay (for online payments)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# MongoDB (optional, falls back to file storage)
MONGODB_URI=your-mongodb-connection-string

# AWS (automatically added by complete setup script)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
AWS_DYNAMODB_TABLE=your-table-name
```

## 🌐 **Access Your Store**

Once running, visit:

- **Store Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **User Orders**: http://localhost:3000/orders
- **API Endpoints**: http://localhost:3000/api/*

## 🔍 **What Each Script Does**

### QUICK_START.sh
- ✅ Kills any existing processes on ports 3000, 3001, 8080, 8000
- ✅ Installs npm dependencies if needed
- ✅ Starts Next.js development server
- ✅ Shows you the URLs to access

### COMPLETE_AWS_SETUP.sh
- ✅ Checks and installs all dependencies (Node.js, npm, AWS CLI, jq)
- ✅ Creates AWS S3 bucket for order storage
- ✅ Creates DynamoDB table with proper indexes
- ✅ Creates IAM user with minimal permissions
- ✅ Configures environment variables automatically
- ✅ Installs npm dependencies
- ✅ Kills existing processes
- ✅ Starts the application
- ✅ Tests AWS integration
- ✅ Shows complete setup summary

## 🚨 **Troubleshooting**

### Port Already in Use
The scripts automatically handle this by killing existing processes.

### AWS Setup Issues
1. Make sure you have AWS CLI installed and configured
2. Run `aws configure` to set up your credentials
3. Ensure you have permissions to create S3, DynamoDB, and IAM resources

### Dependencies Missing
The scripts will automatically install missing dependencies where possible.

### Application Won't Start
1. Check if ports 3000-3001 are free
2. Ensure Node.js 18+ is installed
3. Check the console for error messages

## 📱 **Features Overview**

### Customer Features
- Browse products by category
- Add items to cart
- Secure checkout with multiple payment options
- Order tracking and history
- Responsive mobile design

### Admin Features
- Product management
- Order management with AWS storage
- Real-time order status updates
- Tracking number management
- Customer order history

### Technical Features
- AWS S3 + DynamoDB order storage
- Automatic fallback to local storage
- Real-time order synchronization
- Secure payment processing
- Responsive UI components

## 🔒 **Security Features**

- Firebase authentication
- Admin-only access to management panel
- Secure API endpoints
- AWS IAM with minimal permissions
- Environment variable protection

## 💰 **Costs**

### AWS Costs (Very Low)
- **S3**: ~$0.0001/month for 1,000 orders
- **DynamoDB**: Pay-per-request, very cost-effective
- **Total**: Usually under $1/month for small stores

### Local Development
- **Free**: No AWS costs during development
- **Local storage**: Orders saved to local files

## 🚀 **Production Deployment**

1. **Use IAM Roles** instead of access keys
2. **Enable CloudWatch** monitoring
3. **Set up CloudTrail** for audit logging
4. **Configure S3 lifecycle policies**
5. **Set up DynamoDB backup**

## 📞 **Support**

If you encounter issues:

1. Check the console output for error messages
2. Verify your environment variables
3. Ensure all dependencies are installed
4. Check AWS service status
5. Review the troubleshooting section above

## 🎉 **You're All Set!**

Your Punjabi Heritage E-commerce Store is now ready to:

- 🛍️ **Sell Products** with a beautiful, responsive store
- 📦 **Manage Orders** through the admin panel
- 🚚 **Track Shipments** with real-time updates
- 💳 **Process Payments** securely
- 📱 **Serve Customers** on any device

**Happy selling! 🎉**

---

*Need help? Check the troubleshooting section or run the setup scripts again.*
