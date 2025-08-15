# 🚀 Punjab Heritage - Production Deployment Guide

## 🎯 **Simple Production Setup**

Your Punjab Heritage e-commerce platform is configured for **single-server deployment** on AWS with domain `punjabijuttiandfulkari.com`.

### **🏗️ Architecture:**
```
punjabijuttiandfulkari.com (Domain)
    ↓
AWS Server (3.111.208.77:3001)
    ↓
Next.js + Socket.IO + API Routes
    ↓
MongoDB Atlas Database
```

---

## 🚀 **Quick Deployment**

### **Option 1: Automated Deployment**
```bash
# Make script executable
chmod +x deploy-production.sh

# Deploy to production
./deploy-production.sh
```

### **Option 2: Manual Deployment**
```bash
# 1. Upload files to server
scp -r . ubuntu@3.111.208.77:~/punjab-heritage/

# 2. SSH into server
ssh ubuntu@3.111.208.77

# 3. Navigate to app directory
cd ~/punjab-heritage

# 4. Install dependencies
npm install --production

# 5. Copy production environment
cp .env.production .env

# 6. Build application
npm run build

# 7. Start with PM2
pm2 start server.js --name punjab-heritage --env production
pm2 save
pm2 startup
```

---

## 🔧 **Environment Configuration**

### **Production Environment (`.env.production`)**
Update these values for your production setup:

```env
# File Storage (Production Ready)
USE_FILE_STORAGE=true

# Razorpay Live Keys (CONFIGURED)
RAZORPAY_KEY_SECRET=iY6iexEtWn8fO6RfFU06DBld
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_R5YvT9frcbHI4Z

# Email Configuration
EMAIL_USER=orders@punjabijuttiandfulkari.com
EMAIL_PASS=your-gmail-app-password

# Production URLs
NEXTAUTH_URL=https://punjabijuttiandfulkari.com
APP_URL=https://punjabijuttiandfulkari.com
```

---

## 🌐 **Domain Setup**

### **DNS Configuration**
Point your domain to your AWS server:

```
Type: A Record
Name: @
Value: 3.111.208.77
TTL: 300

Type: A Record  
Name: www
Value: 3.111.208.77
TTL: 300
```

### **SSL Certificate (Optional but Recommended)**
```bash
# Install Certbot
sudo apt install certbot nginx

# Get SSL certificate
sudo certbot --nginx -d punjabijuttiandfulkari.com -d www.punjabijuttiandfulkari.com
```

---

## 🗄️ **Database Setup**

### **MongoDB Atlas**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create new cluster
3. Create database user
4. Get connection string
5. Update `MONGODB_URI` in `.env.production`

### **Seed Database**
```bash
# SSH into server
ssh ubuntu@3.111.208.77

# Navigate to app directory
cd ~/punjab-heritage

# Run database seeding
npm run seed
```

---

## 💳 **Payment Setup**

### **Razorpay Live Mode**
1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Switch to "Live Mode"
3. Go to Settings → API Keys
4. Generate live API keys
5. Update `.env.production` with live keys

---

## 📧 **Email Setup**

### **Gmail Configuration**
1. Enable 2-factor authentication on Gmail
2. Generate App Password:
   - Google Account → Security → App passwords
   - Select "Mail" and generate password
3. Update `EMAIL_USER` and `EMAIL_PASS` in `.env.production`

---

## 🔍 **Testing Your Deployment**

### **Server Health Check**
```bash
curl http://3.111.208.77:3001
```

### **API Test**
```bash
curl http://3.111.208.77:3001/api/products
```

### **Domain Test**
```bash
curl https://punjabijuttiandfulkari.com
```

---

## 📊 **Server Management**

### **PM2 Commands**
```bash
# Check application status
pm2 status

# View logs
pm2 logs punjab-heritage

# Restart application
pm2 restart punjab-heritage

# Stop application
pm2 stop punjab-heritage

# Monitor in real-time
pm2 monit
```

### **Server Resources**
```bash
# Check memory usage
free -h

# Check disk space
df -h

# Check CPU usage
htop
```

---

## 🔒 **Security Setup**

### **AWS Security Group**
Configure these ports in your AWS Security Group:

```
Port 22 (SSH): Your IP only
Port 80 (HTTP): 0.0.0.0/0
Port 443 (HTTPS): 0.0.0.0/0
Port 3001 (App): 0.0.0.0/0
```

### **Firewall (Optional)**
```bash
# Install UFW
sudo apt install ufw

# Configure firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3001
sudo ufw enable
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Application Won't Start**
```bash
# Check logs
pm2 logs punjab-heritage

# Check if port is in use
sudo netstat -tulpn | grep :3001

# Restart application
pm2 restart punjab-heritage
```

#### **Database Connection Failed**
```bash
# Check MongoDB Atlas network access
# Ensure 0.0.0.0/0 is allowed or add your server IP

# Test connection string
node -e "const mongoose = require('mongoose'); mongoose.connect('your-connection-string').then(() => console.log('Connected')).catch(err => console.log('Error:', err))"
```

#### **Payment Issues**
```bash
# Verify Razorpay keys are live keys (start with rzp_live_)
# Check webhook URL in Razorpay dashboard
# Test with small amount first
```

#### **Email Not Working**
```bash
# Verify Gmail app password is correct
# Check if 2FA is enabled on Gmail account
# Test email configuration
```

---

## 📋 **Production Checklist**

### **Before Going Live**
- [ ] Domain DNS pointing to server IP
- [ ] SSL certificate installed (recommended)
- [ ] MongoDB Atlas configured with production data
- [ ] Razorpay live keys configured and tested
- [ ] Email service configured and tested
- [ ] Environment variables updated for production
- [ ] Application built and running with PM2
- [ ] All functionality tested end-to-end

### **Post-Launch**
- [ ] Monitor application logs regularly
- [ ] Set up automated backups for database
- [ ] Monitor server resources (CPU, memory, disk)
- [ ] Test from different devices and locations
- [ ] Set up monitoring alerts (optional)

---

## 🎉 **Success!**

Your Punjab Heritage e-commerce platform is now running in production:

### **✅ Live URLs:**
- **🌐 Website**: https://punjabijuttiandfulkari.com
- **🛒 Shop Jutti**: https://punjabijuttiandfulkari.com/jutti
- **🎨 Shop Phulkari**: https://punjabijuttiandfulkari.com/phulkari
- **👨‍💼 Admin Panel**: https://punjabijuttiandfulkari.com/admin
- **📞 Contact**: https://punjabijuttiandfulkari.com/contact

### **✅ Features Working:**
- ✅ **Product Browsing**: All categories and products
- ✅ **Shopping Cart**: Add, remove, update quantities
- ✅ **Checkout Process**: Customer details, payment options
- ✅ **Payment Processing**: Razorpay + Cash on Delivery
- ✅ **Order Management**: Real-time admin notifications
- ✅ **Email Notifications**: Order confirmations
- ✅ **Admin Panel**: Order management, product management
- ✅ **Real-time Features**: Socket.IO notifications
- ✅ **Mobile Responsive**: Works on all devices
- ✅ **SEO Optimized**: All pages with proper meta tags

### **🚀 Ready for Customers:**
Your platform can now handle:
- Real customer orders
- Live payment processing
- Order confirmations via email
- Admin order management
- Real-time notifications
- Mobile shopping experience

**Your Punjab Heritage e-commerce platform is live and ready for business!** 🎊

---

## 📞 **Support**

If you need help:
1. Check the logs: `pm2 logs punjab-heritage`
2. Restart the application: `pm2 restart punjab-heritage`
3. Check server resources: `htop` and `free -h`
4. Test individual components (database, email, payments)

**Congratulations on launching your Punjab Heritage e-commerce platform!** 🚀