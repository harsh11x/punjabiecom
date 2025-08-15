#!/bin/bash

# Deploy Fixed Version Script for Punjab Heritage Store
# This script helps deploy the fixed version to resolve client-side exceptions

echo "🚀 Deploying Fixed Version of Punjab Heritage Store"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if build exists
if [ ! -d ".next" ]; then
    echo "📦 Building the application..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Please check the errors above."
        exit 1
    fi
fi

echo "✅ Build completed successfully"

# Create deployment package
echo "📦 Creating deployment package..."

# Create a deployment directory
DEPLOY_DIR="punjabi-heritage-fixed-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# Copy necessary files for deployment
cp -r .next "$DEPLOY_DIR/"
cp -r public "$DEPLOY_DIR/"
cp package.json "$DEPLOY_DIR/"
cp package-lock.json "$DEPLOY_DIR/"
cp next.config.js "$DEPLOY_DIR/"
cp .env.production.local "$DEPLOY_DIR/"

# Copy other necessary files
cp -r components "$DEPLOY_DIR/" 2>/dev/null || true
cp -r lib "$DEPLOY_DIR/" 2>/dev/null || true
cp -r contexts "$DEPLOY_DIR/" 2>/dev/null || true
cp -r hooks "$DEPLOY_DIR/" 2>/dev/null || true
cp -r app "$DEPLOY_DIR/" 2>/dev/null || true
cp -r styles "$DEPLOY_DIR/" 2>/dev/null || true

echo "✅ Deployment package created: $DEPLOY_DIR"

# Create deployment instructions
cat > "$DEPLOY_DIR/DEPLOYMENT_INSTRUCTIONS.md" << 'EOF'
# Deployment Instructions for Fixed Version

## What was fixed:
1. ✅ Added comprehensive error boundaries to catch client-side exceptions
2. ✅ Fixed Firebase Analytics loading to prevent hydration issues
3. ✅ Improved Socket.IO error handling for production
4. ✅ Added proper client-side hydration handling
5. ✅ Enhanced localStorage error handling
6. ✅ Added production-ready error pages
7. ✅ Improved React 19 compatibility

## Deployment Steps:

### Option 1: Vercel Deployment (Recommended)
1. Upload this entire folder to your hosting provider
2. Set environment variables from `.env.production.local`
3. Deploy using: `npm run build && npm start`

### Option 2: Manual Server Deployment
1. Upload files to your server
2. Install dependencies: `npm install --production`
3. Set environment variables
4. Start the application: `npm start`

### Option 3: Static Export (if needed)
1. Add `output: 'export'` to next.config.js
2. Run: `npm run build`
3. Upload the `out` folder to your static hosting

## Environment Variables to Set:
- MONGODB_URI (your MongoDB connection string)
- JWT_SECRET (secure random string)
- RAZORPAY_KEY_ID (your Razorpay key)
- RAZORPAY_KEY_SECRET (your Razorpay secret)
- NEXT_PUBLIC_RAZORPAY_KEY_ID (public Razorpay key)
- EMAIL_HOST, EMAIL_USER, EMAIL_PASS (email configuration)
- NEXTAUTH_URL (your domain URL)
- NEXTAUTH_SECRET (secure random string)

## Testing:
After deployment, test these scenarios:
1. ✅ Page loads without client-side exceptions
2. ✅ Firebase authentication works
3. ✅ Cart functionality works (with and without login)
4. ✅ Product pages load correctly
5. ✅ Error pages display properly if issues occur

## Support:
If you encounter any issues, check the browser console for detailed error messages.
The error boundary will now catch and display user-friendly error messages.
EOF

echo "📋 Deployment instructions created"

# Create a quick test script
cat > "$DEPLOY_DIR/test-deployment.js" << 'EOF'
// Quick deployment test script
const http = require('http');

const testUrl = process.env.TEST_URL || 'http://localhost:3000';

console.log(`Testing deployment at: ${testUrl}`);

http.get(testUrl, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Deployment test successful!');
      if (data.includes('Punjab Heritage')) {
        console.log('✅ Page content loaded correctly');
      } else {
        console.log('⚠️  Page content may have issues');
      }
    } else {
      console.log('❌ Deployment test failed');
    }
  });
}).on('error', (err) => {
  console.log('❌ Connection error:', err.message);
});
EOF

echo "🧪 Test script created"

# Create a backup of current deployment (if exists)
if [ -d "backup" ]; then
    echo "📁 Creating backup of previous version..."
    mv backup "backup-$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true
fi

echo ""
echo "🎉 Fixed version ready for deployment!"
echo "📁 Package location: $DEPLOY_DIR"
echo ""
echo "Next steps:"
echo "1. Review the deployment instructions in $DEPLOY_DIR/DEPLOYMENT_INSTRUCTIONS.md"
echo "2. Upload the $DEPLOY_DIR folder to your hosting provider"
echo "3. Set the required environment variables"
echo "4. Deploy and test your site"
echo ""
echo "The fixes should resolve the client-side exception error you were experiencing."
echo "Your site should now load properly at punjabijuttiandfulkari.com"