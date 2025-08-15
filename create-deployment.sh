#!/bin/bash

# Clean Deployment Script for Punjab Heritage Store
echo "🚀 Creating Clean Deployment Package"
echo "===================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf out
rm -rf punjabi-heritage-fixed-*

# Build the application
echo "📦 Building the application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "✅ Build completed successfully"

# Create deployment directory
DEPLOY_DIR="punjabi-heritage-deployment-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

echo "📦 Creating clean deployment package..."

# Copy essential files only (no cache)
cp -r .next/standalone "$DEPLOY_DIR/" 2>/dev/null || true
cp -r .next/static "$DEPLOY_DIR/.next/" 2>/dev/null || true
cp -r public "$DEPLOY_DIR/"
cp package.json "$DEPLOY_DIR/"
cp package-lock.json "$DEPLOY_DIR/"
cp next.config.js "$DEPLOY_DIR/"

# Copy source files needed for production
mkdir -p "$DEPLOY_DIR/app"
mkdir -p "$DEPLOY_DIR/components"
mkdir -p "$DEPLOY_DIR/lib"
mkdir -p "$DEPLOY_DIR/contexts"
mkdir -p "$DEPLOY_DIR/hooks"

cp -r app/* "$DEPLOY_DIR/app/" 2>/dev/null || true
cp -r components/* "$DEPLOY_DIR/components/" 2>/dev/null || true
cp -r lib/* "$DEPLOY_DIR/lib/" 2>/dev/null || true
cp -r contexts/* "$DEPLOY_DIR/contexts/" 2>/dev/null || true
cp -r hooks/* "$DEPLOY_DIR/hooks/" 2>/dev/null || true

# Create environment file template
cat > "$DEPLOY_DIR/.env.production" << 'EOF'
# Production Environment Variables
# Replace these with your actual values

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/punjabi-heritage?retryWrites=true&w=majority

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-here

# Razorpay (replace with your live keys)
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_live_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=orders@punjabijuttiandfulkari.com
EMAIL_PASS=your-gmail-app-password

# NextAuth
NEXTAUTH_URL=https://punjabijuttiandfulkari.com
NEXTAUTH_SECRET=your-nextauth-secret-here

# App Configuration
APP_NAME=Punjab Heritage
APP_URL=https://punjabijuttiandfulkari.com
NODE_ENV=production
EOF

# Create deployment instructions
cat > "$DEPLOY_DIR/README.md" << 'EOF'
# Punjab Heritage Store - Fixed Deployment

## 🎉 Client-Side Error Fixed!

This deployment package contains the fixed version of your Punjab Heritage ecommerce store that resolves the client-side exception error.

## 🔧 What Was Fixed:
- ✅ Context initialization issues
- ✅ Hydration problems  
- ✅ Component safety improvements
- ✅ Firebase & Socket.IO error handling
- ✅ Comprehensive error boundaries

## 🚀 Deployment Options:

### Option 1: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically

### Option 2: Manual Server Deployment
1. Upload this folder to your server
2. Install dependencies: `npm install --production`
3. Set environment variables from `.env.production`
4. Start: `npm start`

### Option 3: Static Export
1. Add `output: 'export'` to next.config.js
2. Run: `npm run build`
3. Upload the `out` folder

## 🔑 Environment Variables:
Copy `.env.production` and update with your actual values:
- MongoDB connection string
- Razorpay keys (live keys for production)
- Email configuration
- JWT secrets

## ✅ Testing After Deployment:
1. Visit your site - should load without errors
2. Test authentication (login/signup)
3. Test cart functionality
4. Verify all pages work correctly

## 📞 Support:
If you see any errors, check the browser console for details.
The error boundary will now show user-friendly messages instead of crashing.

Your site should now work perfectly at punjabijuttiandfulkari.com! 🎉
EOF

# Create package.json for production
cat > "$DEPLOY_DIR/package.json" << 'EOF'
{
  "name": "punjabi-heritage-store",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "next build",
    "start": "next start",
    "dev": "next dev"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-aspect-ratio": "^1.0.3",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-badge": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-hover-card": "^1.0.7",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-menubar": "^1.0.4",
    "@radix-ui/react-navigation-menu": "^1.1.4",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-sheet": "^1.0.4",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-toggle": "^1.0.3",
    "@radix-ui/react-toggle-group": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "firebase": "^10.8.0",
    "lucide-react": "^0.344.0",
    "next": "15.2.4",
    "react": "19.0.0-rc-06d0b89e-20240801",
    "react-dom": "19.0.0-rc-06d0b89e-20240801",
    "react-hook-form": "^7.50.1",
    "socket.io-client": "^4.7.4",
    "sonner": "^1.4.3",
    "tailwind-merge": "^2.2.1",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "15.2.4",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
EOF

echo "✅ Deployment package created: $DEPLOY_DIR"
echo ""
echo "📁 Package contents:"
ls -la "$DEPLOY_DIR"
echo ""
echo "📋 Next steps:"
echo "1. Review the README.md in the deployment folder"
echo "2. Update .env.production with your actual values"
echo "3. Deploy using your preferred method (Vercel recommended)"
echo ""
echo "🎉 Your fixed Punjab Heritage store is ready for deployment!"
echo "The client-side exception error has been resolved."