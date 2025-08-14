const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const dev = process.env.NODE_ENV !== 'production'
const hostname = dev ? 'localhost' : '0.0.0.0'
const port = process.env.SOCKET_PORT || 3003

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/punjabi-heritage?authSource=admin'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12)
  }
  next()
})

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)

// Cart Schema for server-side cart management
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    punjabiName: String,
    price: Number,
    image: String,
    size: String,
    color: String,
    quantity: Number,
    stock: Number
  }],
  total: { type: Number, default: 0 },
  itemCount: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
})

const Cart = mongoose.model('Cart', cartSchema)

// Create Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Initialize Socket.IO for real-time features
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ["https://punjabijuttiandfulkari.com", "https://www.punjabijuttiandfulkari.com", "https://your-vercel-domain.vercel.app"]
        : ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
      methods: ["GET", "POST"],
      credentials: true
    }
  })

  // Store connected users
  const connectedUsers = new Map()

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Authentication middleware
    socket.use(async (packet, next) => {
      const token = packet[1]?.token || socket.handshake.auth.token
      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET)
          socket.userId = decoded.userId
          socket.user = decoded
        } catch (error) {
          console.log('Invalid token:', error.message)
        }
      }
      next()
    })

    // Join admin room for order notifications
    socket.on('join-admin', () => {
      if (socket.user?.role === 'admin') {
        socket.join('admin-room')
        console.log('Admin joined room:', socket.id)
      }
    })

    // User authentication
    socket.on('authenticate', async (data) => {
      try {
        const { token } = data
        if (token) {
          const decoded = jwt.verify(token, JWT_SECRET)
          socket.userId = decoded.userId
          socket.user = decoded
          connectedUsers.set(socket.userId, socket.id)
          
          // Load user's cart
          const userCart = await Cart.findOne({ userId: decoded.userId })
          if (userCart) {
            socket.emit('cart-loaded', userCart)
          }
        }
      } catch (error) {
        console.error('Authentication error:', error)
      }
    })

    // Cart management
    socket.on('add-to-cart', async (item) => {
      if (!socket.userId) {
        socket.emit('auth-required', { message: 'Please login to add items to cart' })
        return
      }

      try {
        let cart = await Cart.findOne({ userId: socket.userId })
        
        if (!cart) {
          cart = new Cart({ userId: socket.userId, items: [] })
        }

        // Check if item already exists
        const existingItemIndex = cart.items.findIndex(
          cartItem => cartItem.productId.toString() === item.productId &&
                      cartItem.size === item.size &&
                      cartItem.color === item.color
        )

        if (existingItemIndex > -1) {
          cart.items[existingItemIndex].quantity = Math.min(
            cart.items[existingItemIndex].quantity + (item.quantity || 1),
            cart.items[existingItemIndex].stock
          )
        } else {
          cart.items.push({
            ...item,
            quantity: item.quantity || 1
          })
        }

        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)
        cart.updatedAt = new Date()

        await cart.save()
        socket.emit('cart-updated', cart)
      } catch (error) {
        console.error('Add to cart error:', error)
        socket.emit('cart-error', { message: 'Failed to add item to cart' })
      }
    })

    socket.on('update-cart-item', async (data) => {
      if (!socket.userId) {
        socket.emit('auth-required', { message: 'Please login to update cart' })
        return
      }

      try {
        const cart = await Cart.findOne({ userId: socket.userId })
        if (!cart) return

        const { productId, size, color, quantity } = data
        const itemIndex = cart.items.findIndex(
          item => item.productId.toString() === productId &&
                  item.size === size &&
                  item.color === color
        )

        if (itemIndex > -1) {
          if (quantity <= 0) {
            cart.items.splice(itemIndex, 1)
          } else {
            cart.items[itemIndex].quantity = Math.min(quantity, cart.items[itemIndex].stock)
          }
        }

        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)
        cart.updatedAt = new Date()

        await cart.save()
        socket.emit('cart-updated', cart)
      } catch (error) {
        console.error('Update cart error:', error)
        socket.emit('cart-error', { message: 'Failed to update cart' })
      }
    })

    socket.on('remove-from-cart', async (data) => {
      if (!socket.userId) {
        socket.emit('auth-required', { message: 'Please login to remove items from cart' })
        return
      }

      try {
        const cart = await Cart.findOne({ userId: socket.userId })
        if (!cart) return

        const { productId, size, color } = data
        cart.items = cart.items.filter(
          item => !(item.productId.toString() === productId &&
                    item.size === size &&
                    item.color === color)
        )

        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)
        cart.updatedAt = new Date()

        await cart.save()
        socket.emit('cart-updated', cart)
      } catch (error) {
        console.error('Remove from cart error:', error)
        socket.emit('cart-error', { message: 'Failed to remove item from cart' })
      }
    })

    socket.on('clear-cart', async () => {
      if (!socket.userId) {
        socket.emit('auth-required', { message: 'Please login to clear cart' })
        return
      }

      try {
        await Cart.findOneAndUpdate(
          { userId: socket.userId },
          { items: [], total: 0, itemCount: 0, updatedAt: new Date() }
        )
        socket.emit('cart-cleared')
      } catch (error) {
        console.error('Clear cart error:', error)
        socket.emit('cart-error', { message: 'Failed to clear cart' })
      }
    })

    // Handle new order notifications
    socket.on('new-order', (orderData) => {
      // Broadcast to all admin users
      socket.to('admin-room').emit('order-notification', {
        type: 'new-order',
        message: `New order received: ${orderData.orderNumber}`,
        order: orderData,
        timestamp: new Date()
      })
    })

    // Handle order status updates
    socket.on('order-status-update', (updateData) => {
      // Broadcast to specific customer or all customers
      io.emit('order-update', {
        orderId: updateData.orderId,
        status: updateData.status,
        trackingId: updateData.trackingId,
        message: updateData.message,
        timestamp: new Date()
      })
    })

    // Handle inventory updates
    socket.on('inventory-update', (productData) => {
      // Broadcast inventory changes to all clients
      io.emit('product-update', {
        productId: productData.productId,
        stock: productData.stock,
        isActive: productData.isActive,
        timestamp: new Date()
      })
    })

    // User profile updates
    socket.on('profile-updated', (userData) => {
      // Broadcast to specific user
      const userSocketId = connectedUsers.get(userData.userId)
      if (userSocketId) {
        io.to(userSocketId).emit('profile-update-success', userData)
      }
    })

    socket.on('disconnect', () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId)
      }
      console.log('Client disconnected:', socket.id)
    })
  })

  // Start server
  server.listen(port, (err) => {
    if (err) throw err
    console.log(`🚀 Server ready on http://${hostname}:${port}`)
    console.log(`📡 Socket.IO server ready for real-time features`)
    console.log(`🌐 AWS Server IP: 3.111.208.77`)
    console.log(`🔗 Connect to AWS server for production deployment`)
  })
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')  
  process.exit(0)
})