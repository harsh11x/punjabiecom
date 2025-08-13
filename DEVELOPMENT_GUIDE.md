# 🛠️ Punjab Heritage - Development Guide

## 🏗️ **Development Architecture**

Your Punjab Heritage platform now runs with a **split development setup**:

```
Frontend (Next.js)          Backend (Server.js)
http://localhost:3000   ←→   http://localhost:3001
     ↓                           ↓
   Website UI              API + Socket.IO
     ↓                           ↓
     └─────── MongoDB ──────────┘
```

---

## 🚀 **Development Setup**

### **Quick Start**
```bash
# Install dependencies
npm install

# Start both frontend and backend
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000 (Next.js website)
- **Backend**: http://localhost:3001 (API + Socket.IO server)

### **Individual Commands**
```bash
# Start only frontend
npm run dev:frontend

# Start only backend  
npm run dev:backend
```

---

## 🔧 **Environment Configuration**

### **Development Environment (`.env.local`)**
```env
# Frontend runs on port 3000
PORT=3000

# Backend APIs point to port 3001
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Database
MONGODB_URI=mongodb://localhost:27017/punjab-heritage-dev
# OR use MongoDB Atlas for development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/punjab-heritage-dev

# Razorpay Test Keys
RAZORPAY_KEY_ID=rzp_test_your_test_key
RAZORPAY_KEY_SECRET=your_test_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_test_key

# Email (for testing)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## 🌐 **How It Works**

### **Frontend (Port 3000)**
- Next.js application serving the website
- All pages and UI components
- Makes API calls to backend on port 3001
- Connects to Socket.IO on port 3001

### **Backend (Port 3001)**
- Express server with Next.js integration
- API routes (`/api/*`)
- Socket.IO for real-time features
- Database connections
- File uploads and processing

### **Communication Flow**
```
User Browser → Frontend (3000) → Backend (3001) → Database
                    ↑                    ↓
                    └── Socket.IO ←──────┘
```

---

## 🔍 **Testing Your Setup**

### **Frontend Test**
```bash
curl http://localhost:3000
# Should return the homepage HTML
```

### **Backend API Test**
```bash
curl http://localhost:3001/api/products
# Should return products JSON
```

### **Socket.IO Test**
Open browser console on http://localhost:3000 and check for:
```
Client connected: [socket-id]
```

---

## 🛠️ **Development Workflow**

### **Making Changes**

#### **Frontend Changes**
- Edit files in `app/`, `components/`, `contexts/`
- Changes auto-reload on http://localhost:3000
- No restart needed

#### **Backend Changes**
- Edit `server.js` or API routes in `app/api/`
- Restart backend: `Ctrl+C` then `npm run dev:backend`
- Or restart both: `Ctrl+C` then `npm run dev`

#### **Database Changes**
- Edit models in `models/`
- Run seeding: `npm run seed`
- Restart backend to apply schema changes

---

## 📊 **Debugging**

### **Frontend Issues**
```bash
# Check Next.js logs
npm run dev:frontend

# Check browser console for errors
# Check Network tab for API call failures
```

### **Backend Issues**
```bash
# Check server logs
npm run dev:backend

# Test API endpoints directly
curl http://localhost:3001/api/products
curl http://localhost:3001/api/orders
```

### **Database Issues**
```bash
# Test MongoDB connection
node -e "
const mongoose = require('mongoose');
mongoose.connect('your-connection-string')
  .then(() => console.log('✅ Connected'))
  .catch(err => console.log('❌ Error:', err))
"
```

### **Socket.IO Issues**
```bash
# Check browser console for Socket.IO connection
# Look for: "Client connected" in backend logs
# Verify CORS settings in server.js
```

---

## 🔧 **Common Development Tasks**

### **Add New Product**
1. Use admin panel: http://localhost:3000/admin
2. Or seed database: `npm run seed`

### **Test Payments**
1. Use Razorpay test keys in `.env.local`
2. Test card: 4111 1111 1111 1111
3. Any CVV and future date

### **Test Emails**
1. Configure Gmail app password in `.env.local`
2. Place test order
3. Check email delivery

### **Add New API Route**
1. Create file in `app/api/your-route/route.ts`
2. Export GET, POST, etc. functions
3. Test with curl or frontend

### **Add New Page**
1. Create file in `app/your-page/page.tsx`
2. Add navigation link if needed
3. Test at http://localhost:3000/your-page

---

## 🚀 **Building for Production**

### **Test Production Build**
```bash
# Build the application
npm run build

# Test production locally
NODE_ENV=production node server.js
# Visit http://localhost:3001
```

### **Deploy to Production**
```bash
# Deploy to AWS server
./deploy-production.sh
```

---

## 📋 **Development Checklist**

### **Before Starting Development**
- [ ] Node.js installed (v18+)
- [ ] MongoDB running (local or Atlas)
- [ ] Environment variables configured
- [ ] Dependencies installed (`npm install`)

### **Daily Development**
- [ ] Start dev servers (`npm run dev`)
- [ ] Check both frontend and backend are running
- [ ] Test new features on both ports
- [ ] Check browser console for errors
- [ ] Test API endpoints with curl

### **Before Committing**
- [ ] Test production build (`npm run build`)
- [ ] Check all features work
- [ ] No console errors
- [ ] Database operations work
- [ ] Socket.IO connections work

---

## 🎯 **Development URLs**

### **Frontend (Port 3000)**
- **Website**: http://localhost:3000
- **Shop Jutti**: http://localhost:3000/jutti
- **Shop Phulkari**: http://localhost:3000/phulkari
- **Admin Panel**: http://localhost:3000/admin
- **Cart**: http://localhost:3000/cart
- **Checkout**: http://localhost:3000/checkout

### **Backend (Port 3001)**
- **API Base**: http://localhost:3001/api
- **Products API**: http://localhost:3001/api/products
- **Orders API**: http://localhost:3001/api/orders
- **Socket.IO**: http://localhost:3001 (WebSocket)

---

## 🔍 **Troubleshooting**

### **Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### **API Calls Failing**
- Check backend is running on port 3001
- Verify CORS settings in server.js
- Check API URL in frontend code

### **Socket.IO Not Connecting**
- Check Socket.IO server running on port 3001
- Verify CORS origins include localhost:3000
- Check browser console for connection errors

### **Database Connection Failed**
- Check MongoDB is running
- Verify connection string in .env.local
- Test connection with MongoDB Compass

---

## 🎉 **Happy Development!**

Your Punjab Heritage platform is now set up for efficient development:

- ✅ **Frontend**: Beautiful UI on port 3000
- ✅ **Backend**: Powerful API on port 3001
- ✅ **Real-time**: Socket.IO notifications
- ✅ **Database**: MongoDB integration
- ✅ **Payments**: Razorpay test mode
- ✅ **Email**: Order notifications
- ✅ **Admin**: Management panel

**Start developing with:** `npm run dev`

**Happy coding!** 🚀