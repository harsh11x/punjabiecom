# 🚀 Vercel + Backend Server Setup Guide

## 🌐 **How to Connect Your Vercel Frontend with Backend Server**

### **Current Setup:**
- **Frontend:** Hosted on Vercel (your website)
- **Backend:** Your Express server (needs to be accessible from internet)

### **Option 1: Deploy Backend to Vercel (Recommended)**

#### **Step 1: Create Backend API Routes in Vercel**
Create these files in your Vercel project:

```
app/api/orders/route.ts
app/api/products/route.ts
app/api/admin/orders/route.ts
```

#### **Step 2: Use Vercel's Built-in API Routes**
Your checkout will automatically use Vercel's API routes instead of external server.

### **Option 2: Deploy Backend to Cloud Server**

#### **Step 1: Deploy Express Server to Cloud**
Deploy your `simple-server-no-deps.js` to:
- AWS EC2
- DigitalOcean Droplet
- Heroku
- Railway
- Render

#### **Step 2: Update Environment Configuration**
In `config/environment.ts`, update the production backend URL:

```typescript
export const ENV_CONFIG = {
  // ... other config
  BACKEND_URL: {
    development: 'http://localhost:3001',
    production: 'https://your-actual-backend-domain.com' // Your deployed backend
  },
  // ... other config
};
```

#### **Step 3: Update CORS in Backend**
In your deployed backend, update the allowed origins:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://your-project.vercel.app', // Your actual Vercel domain
  'https://your-custom-domain.com'   // Your custom domain if any
];
```

### **Option 3: Use Vercel Functions (Serverless)**

#### **Step 1: Create Vercel Functions**
Create `api/orders.js` in your project root:

```javascript
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'POST') {
    try {
      // Your order creation logic here
      const orderData = req.body;
      
      // Save to database or file system
      // For now, just return success
      res.status(200).json({
        success: true,
        data: {
          _id: `order_${Date.now()}`,
          orderNumber: `PH${Date.now()}`,
          ...orderData
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

## 🔧 **Quick Fix for Your Current Issue**

### **Step 1: Find Your Vercel Domain**
1. Go to [vercel.com](https://vercel.com)
2. Sign in to your account
3. Find your project
4. Copy the deployment URL (e.g., `https://your-project.vercel.app`)

### **Step 2: Update Backend CORS**
In your `simple-server-no-deps.js`, replace the placeholder domains:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://your-actual-project.vercel.app', // Replace this
  'https://your-custom-domain.com'          // Replace this if you have one
];
```

### **Step 3: Deploy Backend**
Deploy your Express server to a cloud service so it's accessible from the internet.

### **Step 4: Update Frontend Config**
In `config/environment.ts`, update the production backend URL:

```typescript
production: 'https://your-deployed-backend-domain.com' // Your actual backend
```

## 🎯 **Recommended Solution**

**Use Vercel's built-in API routes** - it's the simplest and most reliable:

1. **No external server needed**
2. **Automatic CORS handling**
3. **Built-in scaling**
4. **Same domain for frontend and API**

## 📝 **Next Steps**

1. **Choose your approach** (Vercel API routes or external backend)
2. **Update the configuration files** with your actual domains
3. **Test the connection** between frontend and backend
4. **Deploy and test** your checkout functionality

## 🔍 **Test Your Setup**

After setup, test your checkout:
1. Go to your Vercel website
2. Navigate to checkout
3. Fill out the form
4. Submit order
5. Check if it's saved to your backend

**Your checkout should now work on both localhost and Vercel!** 🚀
