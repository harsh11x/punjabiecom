# 🌟 Punjab Heritage E-commerce Platform

A modern, full-featured e-commerce platform showcasing authentic Punjabi products including Jutti (traditional footwear) and Phulkari (embroidered textiles).

## 🏗️ **Architecture**

```
Frontend (Next.js)          Backend (Server.js)
http://localhost:3000   ←→   http://localhost:3001
     ↓                           ↓
   Website UI              API + Socket.IO
     ↓                           ↓
     └─────── MongoDB ──────────┘
```

**Development**: Split servers for optimal development experience  
**Production**: Single server deployment on AWS

---

## 🚀 **Quick Start**

### **Development**
```bash
# Install dependencies
npm install

# Start both frontend and backend
npm run dev
```

**URLs:**
- **Frontend**: http://localhost:3000 (Website)
- **Backend**: http://localhost:3001 (API + Socket.IO)

### **Production**
```bash
# Deploy to AWS server
./deploy-production.sh
```

**Live URL**: https://punjabijuttiandfulkari.com

---

## 🌟 **Features**

### **✅ Customer Experience**
- 🛒 **Product Browsing**: Beautiful Jutti & Phulkari collections
- 🛍️ **Shopping Cart**: Add, remove, update quantities
- 💳 **Secure Checkout**: Customer details, shipping info
- 💰 **Multiple Payments**: Razorpay (cards, UPI, wallets) + Cash on Delivery
- 📧 **Order Confirmation**: Email notifications
- 📱 **Mobile Responsive**: Perfect on all devices
- 🔍 **Product Search**: Find products easily
- 📏 **Size Guide**: Comprehensive sizing information

### **✅ Admin Management**
- 👨‍💼 **Admin Panel**: Secure dashboard
- 📊 **Analytics**: Orders, revenue, statistics
- 📦 **Order Management**: Real-time order tracking
- 🏷️ **Product Management**: Add, edit, delete products
- 🔔 **Live Notifications**: Socket.IO real-time alerts
- 📈 **Sales Insights**: Performance analytics

### **✅ Technical Excellence**
- ⚡ **Real-time**: Socket.IO for live features
- 🔒 **Secure**: JWT authentication, secure payments
- 🚀 **Fast**: Optimized Next.js performance
- 🔍 **SEO**: Search engine optimized
- 📧 **Email**: Automated notifications
- 🗄️ **Database**: MongoDB with proper schemas

---

## 🛠️ **Tech Stack**

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Node.js, Express, Socket.IO  
- **Database**: MongoDB with Mongoose
- **Payments**: Razorpay integration
- **Authentication**: NextAuth.js with JWT
- **Email**: Nodemailer with Gmail
- **Styling**: Tailwind CSS
- **UI**: Radix UI components
- **Real-time**: Socket.IO

---

## 📁 **Project Structure**

```
punjabi-ecom-storeV4/
├── app/                    # Next.js 13+ app directory
│   ├── (pages)/           # Website pages
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/            # UI components
├── contexts/              # React contexts
├── hooks/                 # Custom hooks
├── lib/                   # Utilities
├── models/                # MongoDB models
├── public/                # Static assets
├── scripts/               # Database scripts
├── server.js              # Main server
├── .env.local             # Development config
├── .env.production        # Production config
└── deploy-production.sh   # Deployment script
```

---

## 🔧 **Configuration**

### **Development (`.env.local`)**
```env
# Frontend: Port 3000, Backend: Port 3001
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Database
MONGODB_URI=your-mongodb-connection

# Razorpay Test Keys
RAZORPAY_KEY_ID=rzp_test_your_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### **Production (`.env.production`)**
```env
# Production server
NEXT_PUBLIC_API_URL=http://3.111.208.77:3001/api
NEXT_PUBLIC_SOCKET_URL=http://3.111.208.77:3001

# Live Razorpay Keys
RAZORPAY_KEY_ID=rzp_live_your_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key

# Production database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/punjab-heritage
```

---

## 🎯 **Development Workflow**

### **Start Development**
```bash
npm run dev
# Starts both frontend (3000) and backend (3001)
```

### **Individual Services**
```bash
npm run dev:frontend    # Only Next.js frontend
npm run dev:backend     # Only backend server
```

### **Testing**
```bash
# Frontend
curl http://localhost:3000

# Backend API
curl http://localhost:3001/api/products

# Socket.IO (check browser console)
```

---

## 🌐 **URLs**

### **Development**
- **Website**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **API**: http://localhost:3001/api
- **Socket.IO**: http://localhost:3001

### **Production**
- **Website**: https://punjabijuttiandfulkari.com
- **Admin**: https://punjabijuttiandfulkari.com/admin
- **Server**: http://3.111.208.77:3001

---

## 👨‍💼 **Admin Panel**

**Access**: `/admin`  
**Default Login**:
- Email: admin@punjabijuttiandfulkari.com
- Password: admin123

**Features**:
- 📊 Dashboard with analytics
- 📦 Order management
- 🏷️ Product management
- 🔔 Real-time notifications
- 📈 Sales reports

---

## 🛒 **Product Collections**

### **Jutti Collection**
- Traditional Punjabi footwear
- Handcrafted designs
- Multiple sizes and colors
- Authentic patterns

### **Phulkari Collection**
- Embroidered textiles
- Dupattas and scarves
- Traditional patterns
- Vibrant colors

---

## 💳 **Payment Methods**

- **Cards**: Visa, Mastercard, RuPay
- **Digital Wallets**: Paytm, PhonePe, Google Pay
- **UPI**: All UPI apps
- **Net Banking**: Major banks
- **Cash on Delivery**: Select locations

---

## 📧 **Email System**

**Automated emails for**:
- Order confirmations
- Order status updates
- Admin new order alerts

**Configuration**: Gmail with app passwords

---

## 🚀 **Deployment**

### **Automated Deployment**
```bash
chmod +x deploy-production.sh
./deploy-production.sh
```

### **Manual Deployment**
```bash
# Build application
npm run build

# Start production server
NODE_ENV=production node server.js
```

**Server**: AWS (3.111.208.77:3001)  
**Domain**: punjabijuttiandfulkari.com

---

## 📊 **Real-time Features**

- **Live Order Notifications**: Admin gets instant alerts
- **Socket.IO Integration**: Real-time communication
- **Order Status Updates**: Live status changes
- **Admin Dashboard**: Real-time statistics

---

## 🔒 **Security**

- JWT authentication
- Secure payment processing
- Input validation
- CORS protection
- Environment variables
- SQL injection protection

---

## 📱 **Mobile Responsive**

- Mobile-first design
- Touch-friendly interface
- Optimized for all screen sizes
- Fast mobile performance

---

## 🔍 **SEO Optimized**

- Meta tags for all pages
- Open Graph for social sharing
- Structured data
- Fast loading times
- Search engine friendly URLs

---

## 📚 **Documentation**

- **`DEVELOPMENT_GUIDE.md`**: Complete development setup
- **`PRODUCTION_DEPLOYMENT.md`**: Deployment instructions
- **`FINAL_PRODUCTION_SETUP.md`**: Production overview

---

## 🎉 **Ready for Business!**

Your Punjab Heritage platform includes:

### **✅ Complete E-commerce**
- Product catalog
- Shopping cart
- Secure checkout
- Payment processing
- Order management

### **✅ Admin Tools**
- Dashboard analytics
- Order management
- Product management
- Real-time notifications

### **✅ Customer Support**
- About us page
- Contact information
- Shipping policies
- Return policies
- Size guide

### **✅ Production Ready**
- AWS deployment
- Domain configuration
- SSL ready
- Performance optimized
- Scalable architecture

---

## 🚀 **Get Started**

1. **Development**: `npm run dev`
2. **Production**: `./deploy-production.sh`
3. **Visit**: https://punjabijuttiandfulkari.com

**Your authentic Punjabi heritage store is ready to serve customers worldwide!** 🌟

---

*For detailed guides, see the documentation files in the project root.*