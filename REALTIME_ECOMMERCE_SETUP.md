# Real-Time E-commerce Setup Guide

## Overview
This guide explains how to set up a real-time e-commerce website with user authentication, cart management, payment integration, and profile management. The system uses a Next.js frontend hosted on Vercel and a Node.js backend server hosted on AWS.

## 🏗️ Architecture

### Frontend (Vercel)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context (Auth, Cart)
- **Real-time**: Socket.IO client
- **Payment**: Razorpay integration

### Backend (AWS Server)
- **Server**: Node.js with Express
- **Real-time**: Socket.IO server
- **Database**: MongoDB
- **Authentication**: JWT tokens
- **Hosting**: AWS EC2 (IP: 3.111.208.77)

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in your project root:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/punjabi-heritage

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Razorpay (Payment Gateway)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret_key

# Server Configuration
SOCKET_PORT=3003
NODE_ENV=development
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies (in server directory)
cd server
npm install
```

### 3. Start Development Servers

```bash
# Terminal 1: Start Next.js frontend
npm run dev

# Terminal 2: Start Socket.IO server
npm run server
```

## 🔧 Configuration

### API Configuration (`lib/api-config.ts`)

The system automatically switches between development and production configurations:

```typescript
// Development: Local servers
SOCKET_URL: 'http://localhost:3003'
API_BASE_URL: 'http://localhost:3000/api'

// Production: AWS + Vercel
SOCKET_URL: 'http://3.111.208.77:3003'
API_BASE_URL: 'https://your-vercel-domain.vercel.app/api'
```

### Socket.IO Configuration

```typescript
const SOCKET_CONFIG = {
  url: isProduction 
    ? `http://3.111.208.77:3003`
    : `http://localhost:3003`,
  
  options: {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
    forceNew: true
  }
}
```

## 👤 User Authentication

### Features
- **Login/Signup**: Email and password authentication
- **JWT Tokens**: Secure session management
- **Profile Management**: Edit personal information and address
- **Real-time Updates**: Profile changes sync across sessions

### Authentication Flow

1. **User Registration**:
   ```typescript
   const { signup } = useAuth()
   await signup(name, email, password, phone, gender)
   ```

2. **User Login**:
   ```typescript
   const { login } = useAuth()
   await login(email, password)
   ```

3. **Profile Updates**:
   ```typescript
   const { updateProfile } = useAuth()
   await updateProfile({ name, email, phone, address })
   ```

### Protected Routes

```typescript
// Redirect to login if not authenticated
if (!isAuthenticated) {
  router.push('/login?redirect=' + router.asPath)
  return null
}
```

## 🛒 Cart Management

### Features
- **Real-time Cart**: Server-side cart for authenticated users
- **Local Storage**: Cart persistence for non-authenticated users
- **Sync on Login**: Local cart merges with server cart
- **Stock Validation**: Real-time stock checking

### Cart Operations

```typescript
const { addItem, removeItem, updateQuantity, clearCart } = useCart()

// Add item to cart
addItem({
  productId: 'product_id',
  name: 'Product Name',
  price: 1000,
  size: 'M',
  color: 'Red',
  quantity: 1
})

// Update quantity
updateQuantity('product_id', 'M', 'Red', 2)

// Remove item
removeItem('product_id', 'M', 'Red')

// Clear cart
clearCart()
```

### Real-time Cart Updates

```typescript
// Listen for cart updates
socket.on('cart-updated', (cartData) => {
  // Update local cart state
  dispatch({ type: 'LOAD_CART', payload: cartData.items })
})

// Listen for auth requirements
socket.on('auth-required', (data) => {
  toast.error('Please login to manage cart')
})
```

## 💳 Payment Integration

### Razorpay Setup

1. **Create Razorpay Account**:
   - Sign up at [razorpay.com](https://razorpay.com)
   - Get API keys from dashboard

2. **Configure Environment**:
   ```bash
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key
   RAZORPAY_KEY_SECRET=your_secret_key
   ```

3. **Payment Flow**:
   ```typescript
   // 1. Create order
   const orderResponse = await fetch('/api/orders', {
     method: 'POST',
     body: JSON.stringify(orderData)
   })

   // 2. Initialize payment
   const paymentResponse = await fetch('/api/payment/create-order', {
     method: 'POST',
     body: JSON.stringify(paymentData)
   })

   // 3. Open Razorpay modal
   const rzp = new Razorpay(options)
   rzp.open()

   // 4. Verify payment
   const verifyResponse = await fetch('/api/payment/verify', {
     method: 'POST',
     body: JSON.stringify(verificationData)
   })
   ```

## 📱 Real-time Features

### Socket.IO Events

#### Client to Server
```typescript
// Authentication
socket.emit('authenticate', { token })

// Cart management
socket.emit('add-to-cart', item)
socket.emit('update-cart-item', { productId, size, color, quantity })
socket.emit('remove-from-cart', { productId, size, color })
socket.emit('clear-cart')

// Admin features
socket.emit('join-admin')
socket.emit('new-order', orderData)
socket.emit('order-status-update', updateData)
socket.emit('inventory-update', productData)
```

#### Server to Client
```typescript
// Cart updates
socket.on('cart-loaded', cartData)
socket.on('cart-updated', cartData)
socket.on('cart-cleared')
socket.on('cart-error', error)

// Authentication
socket.on('auth-required', data)

// Order notifications
socket.on('order-notification', orderData)
socket.on('order-update', updateData)

// Product updates
socket.on('product-update', productData)
```

### Real-time Notifications

```typescript
// Admin notifications
socket.on('order-notification', (data) => {
  toast.success(`New order: ${data.order.orderNumber}`)
})

// Cart updates
socket.on('cart-updated', (data) => {
  toast.success('Cart updated')
})

// Auth requirements
socket.on('auth-required', (data) => {
  toast.error('Please login to continue')
})
```

## 🗄️ Database Models

### User Model
```typescript
interface User {
  name: string
  email: string
  password: string
  phone?: string
  gender?: 'male' | 'female' | 'other'
  address?: {
    street: string
    city: string
    state: string
    pincode: string
  }
  role: 'user' | 'admin'
  isVerified: boolean
}
```

### Cart Model
```typescript
interface Cart {
  userId: ObjectId
  items: CartItem[]
  total: number
  itemCount: number
  updatedAt: Date
}

interface CartItem {
  productId: ObjectId
  name: string
  price: number
  size: string
  color: string
  quantity: number
  stock: number
}
```

### Order Model
```typescript
interface Order {
  orderNumber: string
  customer: ShippingAddress
  items: OrderItem[]
  totalAmount: number
  paymentMethod: 'razorpay' | 'cod' | 'bank_transfer'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  trackingId?: string
  shippingProvider?: string
  estimatedDelivery?: Date
  deliveredAt?: Date
}
```

## 🚀 Deployment

### Frontend (Vercel)

1. **Connect Repository**:
   - Push code to GitHub
   - Connect repository to Vercel

2. **Environment Variables**:
   ```bash
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key
   RAZORPAY_KEY_SECRET=your_live_secret
   NODE_ENV=production
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Backend (AWS)

1. **EC2 Setup**:
   ```bash
   # Connect to AWS server
   ssh -i your-key.pem ubuntu@3.111.208.77

   # Install Node.js and MongoDB
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Deploy Server**:
   ```bash
   # Clone repository
   git clone your-repo.git
   cd your-repo

   # Install dependencies
   npm install

   # Set environment variables
   export MONGODB_URI=your_mongodb_uri
   export JWT_SECRET=your_jwt_secret
   export NODE_ENV=production

   # Start server with PM2
   pm2 start server.js --name "punjabi-ecommerce"
   pm2 save
   pm2 startup
   ```

3. **Configure Firewall**:
   ```bash
   # Allow port 3003
   sudo ufw allow 3003
   sudo ufw enable
   ```

## 🔒 Security

### Authentication
- JWT tokens with expiration
- Password hashing with bcrypt
- Protected API routes
- CORS configuration

### Payment Security
- Razorpay signature verification
- Server-side payment validation
- Secure API key management

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

## 📊 Monitoring

### Health Checks
```typescript
// Check server status
const isServerOnline = await checkServerStatus()

// Validate environment
const isEnvValid = validateEnvironment()
```

### Logging
```typescript
// Server logs
console.log('Server started on port 3003')
console.log('Socket.IO server ready')

// Error logging
console.error('Payment failed:', error)
console.error('Database connection error:', error)
```

## 🧪 Testing

### Manual Testing
1. **User Registration**: Create new account
2. **Login**: Authenticate user
3. **Cart Operations**: Add/remove items
4. **Checkout**: Complete purchase flow
5. **Profile Management**: Update user information
6. **Real-time Features**: Test live updates

### Automated Testing
```bash
# Run tests
npm test

# Run specific test suites
npm run test:auth
npm run test:cart
npm run test:payment
```

## 🐛 Troubleshooting

### Common Issues

1. **Socket Connection Failed**:
   - Check server is running
   - Verify port 3003 is open
   - Check firewall settings

2. **Payment Failed**:
   - Verify Razorpay keys
   - Check network connectivity
   - Validate payment data

3. **Cart Not Syncing**:
   - Check authentication status
   - Verify socket connection
   - Clear browser cache

4. **Database Connection Error**:
   - Check MongoDB URI
   - Verify network connectivity
   - Check database permissions

### Debug Mode
```typescript
// Enable debug logging
localStorage.setItem('debug', 'socket.io-client:*')

// Check connection status
console.log('Socket connected:', socket.connected)
console.log('Auth status:', isAuthenticated)
```

## 📈 Performance

### Optimization
- **Lazy Loading**: Components and routes
- **Image Optimization**: Next.js Image component
- **Caching**: API responses and static assets
- **Compression**: Gzip compression
- **CDN**: Static asset delivery

### Monitoring
- **Real-time Metrics**: Socket connections, API calls
- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Vercel Analytics

## 🔄 Updates and Maintenance

### Regular Tasks
1. **Security Updates**: Keep dependencies updated
2. **Database Backups**: Regular MongoDB backups
3. **Log Rotation**: Manage server logs
4. **Performance Monitoring**: Track metrics

### Deployment Process
1. **Test Changes**: Local development
2. **Staging Deployment**: Test environment
3. **Production Deployment**: Live environment
4. **Monitoring**: Post-deployment checks

---

This setup provides a complete real-time e-commerce solution with user authentication, cart management, payment processing, and profile management. The system is scalable and can handle production traffic with proper monitoring and maintenance.
