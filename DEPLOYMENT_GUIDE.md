# 🚀 Punjab Heritage - Complete Deployment Guide

## 📋 **Server Architecture Overview**

### **Next.js Built-in Server (Default)**
- **Location**: Built into Next.js framework
- **Usage**: `npm run dev:next` (development) or `npm run start:next` (production)
- **Features**: Basic API routes, SSR, static file serving

### **Custom Server with Socket.IO (Enhanced)**
- **Location**: `/server.js`
- **Usage**: `npm run dev` (development) or `npm run start` (production)
- **Features**: All Next.js features + real-time Socket.IO functionality

## 🔧 **Server Files Structure**

```
punjabi-ecom-storeV4/
├── server.js                 # Custom server with Socket.IO
├── app/api/                  # API endpoints (server logic)
│   ├── products/route.ts     # Product CRUD operations
│   ├── orders/route.ts       # Order management
│   ├── payment/              # Payment processing
│   └── admin/                # Admin authentication & dashboard
├── lib/
│   ├── mongodb.ts           # Database connection
│   ├── auth.ts              # Authentication utilities
│   └── email.ts             # Email notifications
└── hooks/useSocket.ts       # Client-side Socket.IO hook
```

## 🌐 **Real-time Features**

### **Socket.IO Server Events**
- `new-order`: Broadcast new orders to admin
- `order-status-update`: Update customers on order status
- `inventory-update`: Real-time stock updates

### **Client-side Integration**
- Admin panel receives instant order notifications
- Customers get real-time order status updates
- Live inventory updates across all clients

## 🚀 **Quick Start Guide**

### **1. Environment Setup**
```bash
# Clone and install
git clone <repository>
cd punjabi-ecom-storeV4
npm install --legacy-peer-deps
```

### **2. Configure Environment Variables**
Update `.env.local`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/punjabi-heritage

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### **3. Database Setup**
```bash
# Start MongoDB
mongod

# Seed database with sample data
npm run seed
```

### **4. Start the Application**
```bash
# Development with real-time features
npm run dev

# OR basic Next.js development
npm run dev:next
```

### **5. Access the Platform**
- **Customer Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Admin Credentials**: 
  - Email: `admin@punjabheritage.com`
  - Password: `admin123`

## 📦 **Production Deployment**

### **Build for Production**
```bash
npm run build
npm run start
```

### **Deploy to Vercel**
1. Connect repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy (Socket.IO features may need additional configuration)

### **Deploy to VPS/Cloud**
```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start server.js --name "punjab-heritage"
pm2 startup
pm2 save
```

## 🔐 **Security Features**

- ✅ JWT-based admin authentication
- ✅ Password hashing with bcryptjs
- ✅ CORS configuration for Socket.IO
- ✅ Input validation with Zod
- ✅ Secure payment processing with Razorpay
- ✅ Environment variable protection

## 📧 **Email Configuration**

### **Gmail Setup**
1. Enable 2-factor authentication
2. Generate app password
3. Use app password in `EMAIL_PASS`

### **Other Providers**
- SendGrid
- Mailgun
- AWS SES
- Any SMTP provider

## 💳 **Payment Integration**

### **Razorpay Setup**
1. Create account at https://razorpay.com
2. Get API keys from dashboard
3. Add to environment variables
4. Test with test keys first

### **Supported Payment Methods**
- Credit/Debit Cards
- UPI
- Net Banking
- Wallets
- Cash on Delivery

## 📊 **Database Schema**

### **Collections**
- `products`: Product catalog
- `orders`: Customer orders
- `admins`: Admin users

### **Key Features**
- Automatic timestamps
- Data validation
- Indexing for performance
- Relationship management

## 🔄 **Real-time Updates**

### **Admin Notifications**
- Instant new order alerts
- Order status changes
- Low stock warnings

### **Customer Updates**
- Order confirmation
- Shipping updates
- Delivery notifications

## 📱 **Mobile Responsiveness**

- ✅ Mobile-first design
- ✅ Touch-friendly interface
- ✅ Responsive admin panel
- ✅ Progressive Web App ready

## 🌍 **Internationalization**

- ✅ English & Punjabi support
- ✅ Bilingual product names
- ✅ Cultural design elements
- ✅ Regional payment methods

## 🔧 **Troubleshooting**

### **Common Issues**

1. **MongoDB Connection Error**
   ```bash
   # Check if MongoDB is running
   mongod --version
   # Start MongoDB service
   brew services start mongodb/brew/mongodb-community
   ```

2. **Socket.IO Connection Issues**
   ```bash
   # Check if port 3000 is available
   lsof -i :3000
   # Kill process if needed
   kill -9 <PID>
   ```

3. **Payment Gateway Errors**
   - Verify Razorpay keys
   - Check network connectivity
   - Ensure HTTPS in production

4. **Email Delivery Issues**
   - Verify SMTP credentials
   - Check spam folder
   - Test with different email provider

## 📈 **Performance Optimization**

- ✅ Image optimization with Next.js
- ✅ Database indexing
- ✅ Lazy loading components
- ✅ Caching strategies
- ✅ Bundle optimization

## 🔍 **Monitoring & Analytics**

### **Recommended Tools**
- Vercel Analytics
- Google Analytics
- Sentry for error tracking
- MongoDB Atlas monitoring

## 🚀 **Scaling Considerations**

### **Horizontal Scaling**
- Load balancer configuration
- Database clustering
- CDN for static assets
- Redis for session management

### **Vertical Scaling**
- Increase server resources
- Database optimization
- Caching implementation
- Code splitting

## 📞 **Support & Maintenance**

### **Regular Tasks**
- Database backups
- Security updates
- Performance monitoring
- User feedback analysis

### **Emergency Procedures**
- Server restart commands
- Database recovery
- Payment gateway fallback
- Customer communication

---

## 🎉 **Congratulations!**

You now have a complete, production-ready e-commerce platform with:

- ✅ **Full-stack application** with Next.js 15 & React 19
- ✅ **Real-time features** with Socket.IO
- ✅ **Secure payments** with Razorpay
- ✅ **Admin dashboard** with analytics
- ✅ **Email notifications** for orders
- ✅ **Mobile responsive** design
- ✅ **Bilingual support** (English/Punjabi)
- ✅ **Production ready** with proper error handling

The platform is ready to handle real customers, real payments, and real orders! 🚀