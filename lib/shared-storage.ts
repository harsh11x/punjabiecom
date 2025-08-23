// Shared In-Memory Storage for Vercel API Routes
// This allows different API routes to share data

// Global storage objects
let sharedOrders: any[] = []
let sharedCarts: any[] = []
let sharedProducts: any[] = []

// Initialize storage from file system
function initializeFromFiles() {
  if (typeof window !== 'undefined') return // Skip on client side
  
  try {
    const fs = require('fs')
    const path = require('path')
    
    // Load individual order files from data/orders/
    const ordersDir = path.join(process.cwd(), 'data', 'orders')
    if (fs.existsSync(ordersDir)) {
      const orderFiles = fs.readdirSync(ordersDir).filter((file: string) => file.endsWith('.json'))
      let loadedOrders = 0
      
      orderFiles.forEach((file: string) => {
        try {
          const orderData = JSON.parse(fs.readFileSync(path.join(ordersDir, file), 'utf8'))
          if (orderData._id) {
            sharedOrders.push(orderData)
            loadedOrders++
          }
        } catch (err) {
          console.warn(`⚠️ Failed to load order file ${file}:`, err)
        }
      })
      
      if (loadedOrders > 0) {
        console.log(`📁 Loaded ${loadedOrders} orders from files into shared storage`)
      }
    }
    
    // Load orders from orders.json if it exists
    const ordersFile = path.join(process.cwd(), 'data', 'orders.json')
    if (fs.existsSync(ordersFile)) {
      try {
        const ordersData = JSON.parse(fs.readFileSync(ordersFile, 'utf8'))
        if (Array.isArray(ordersData)) {
          // Add orders that aren't already loaded
          ordersData.forEach((order: any) => {
            if (!sharedOrders.find(o => o._id === order._id)) {
              sharedOrders.push(order)
            }
          })
          console.log(`📁 Loaded additional orders from orders.json`)
        }
      } catch (err) {
        console.warn('⚠️ Failed to load orders.json:', err)
      }
    }
    
  } catch (error) {
    console.warn('⚠️ Failed to initialize from files:', error)
  }
}

// Initialize on module load
initializeFromFiles()

// Product Management
export const productStorage = {
  // Add new product
  addProduct: (productData: any) => {
    const newProduct = {
      ...productData,
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    sharedProducts.push(newProduct)
    console.log(`✅ Product added to shared storage: ${newProduct.name} (ID: ${newProduct.id})`)
    return newProduct
  },

  // Get all products
  getAllProducts: () => {
    return [...sharedProducts]
  },

  // Get product by ID
  getProductById: (id: string) => {
    return sharedProducts.find(product => product.id === id)
  },

  // Update product
  updateProduct: (id: string, updates: any) => {
    const productIndex = sharedProducts.findIndex(product => product.id === id)
    if (productIndex !== -1) {
      sharedProducts[productIndex] = {
        ...sharedProducts[productIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      console.log(`✅ Product updated in shared storage: ${id}`)
      return sharedProducts[productIndex]
    }
    return null
  },

  // Delete product
  deleteProduct: (id: string) => {
    const productIndex = sharedProducts.findIndex(product => product.id === id)
    if (productIndex !== -1) {
      const deletedProduct = sharedProducts.splice(productIndex, 1)[0]
      console.log(`✅ Product deleted from shared storage: ${id}`)
      return deletedProduct
    }
    return null
  },

  // Get product count
  getProductCount: () => sharedProducts.length,

  // Get product statistics
  getProductStats: () => {
    const totalProducts = sharedProducts.length
    const activeProducts = sharedProducts.filter(p => p.isActive !== false).length
    const featuredProducts = sharedProducts.filter(p => p.featured === true).length
    const lowStockProducts = sharedProducts.filter(p => (p.stock || 0) < 10).length
    const inStockProducts = sharedProducts.filter(p => (p.stock || 0) > 0).length
    
    const categoryCounts = sharedProducts.reduce((acc: any, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    }, {})
    
    const totalValue = sharedProducts.reduce((sum, product) => sum + (product.price * (product.stock || 0)), 0)
    
    return {
      total: totalProducts,
      active: activeProducts,
      featured: featuredProducts,
      lowStock: lowStockProducts,
      inStock: inStockProducts,
      categories: categoryCounts,
      totalValue: Math.round(totalValue * 100) / 100
    }
  }
}

// Order Management
export const orderStorage = {
  // Add new order
  addOrder: (order: any) => {
    const newOrder = {
      ...order,
      _id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      orderNumber: `PH${Date.now()}${Math.random().toString(36).substring(2, 4).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    sharedOrders.push(newOrder)
    
    // Save to file system for persistence
    try {
      if (typeof window === 'undefined') {
        const fs = require('fs')
        const path = require('path')
        const ordersDir = path.join(process.cwd(), 'data', 'orders')
        
        // Ensure directory exists
        if (!fs.existsSync(ordersDir)) {
          fs.mkdirSync(ordersDir, { recursive: true })
        }
        
        // Save individual order file
        const orderFilePath = path.join(ordersDir, `${newOrder._id}.json`)
        fs.writeFileSync(orderFilePath, JSON.stringify(newOrder, null, 2))
        
        // Also update orders.json with all orders
        const ordersFile = path.join(process.cwd(), 'data', 'orders.json')
        fs.writeFileSync(ordersFile, JSON.stringify(sharedOrders, null, 2))
        
        console.log(`💾 Order saved to file system: ${newOrder._id}`)
      }
    } catch (error) {
      console.warn('⚠️ Failed to save order to file system:', error)
    }
    
    console.log(`✅ Order added to shared storage: ${newOrder._id}`)
    return newOrder
  },

  // Get all orders
  getAllOrders: () => {
    return [...sharedOrders]
  },

  // Get orders by user email
  getOrdersByUser: (email: string) => {
    return sharedOrders.filter(order => order.customerEmail === email)
  },

  // Update order
  updateOrder: (orderId: string, updates: any) => {
    const orderIndex = sharedOrders.findIndex(order => order._id === orderId)
    if (orderIndex !== -1) {
      // Handle special fields
      const processedUpdates: any = { ...updates }
      
      // Convert date strings to proper format if provided
      if (updates.estimatedDelivery) {
        processedUpdates.estimatedDelivery = new Date(updates.estimatedDelivery).toISOString()
      }
      
      // Update the order
      sharedOrders[orderIndex] = {
        ...sharedOrders[orderIndex],
        ...processedUpdates,
        updatedAt: new Date().toISOString()
      }
      
      // Save to file system for persistence
      try {
        if (typeof window === 'undefined') {
          const fs = require('fs')
          const path = require('path')
          const ordersDir = path.join(process.cwd(), 'data', 'orders')
          
          // Ensure directory exists
          if (!fs.existsSync(ordersDir)) {
            fs.mkdirSync(ordersDir, { recursive: true })
          }
          
          // Save individual order file
          const orderFilePath = path.join(ordersDir, `${orderId}.json`)
          fs.writeFileSync(orderFilePath, JSON.stringify(sharedOrders[orderIndex], null, 2))
          
          // Also update orders.json with all orders
          const ordersFile = path.join(process.cwd(), 'data', 'orders.json')
          fs.writeFileSync(ordersFile, JSON.stringify(sharedOrders, null, 2))
          
          console.log(`💾 Order saved to file system: ${orderId}`)
        }
      } catch (error) {
        console.warn('⚠️ Failed to save order to file system:', error)
      }
      
      console.log(`✅ Order updated in shared storage: ${orderId}`, processedUpdates)
      return sharedOrders[orderIndex]
    }
    return null
  },

  // Cancel order (within 24 hours)
  cancelOrder: (orderId: string) => {
    const orderIndex = sharedOrders.findIndex(order => order._id === orderId)
    if (orderIndex !== -1) {
      const order = sharedOrders[orderIndex]
      const orderDate = new Date(order.createdAt)
      const now = new Date()
      const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60)
      
      if (hoursDiff > 24) {
        return { success: false, error: 'Orders can only be cancelled within 24 hours of ordering' }
      }
      
      if (order.status === 'cancelled') {
        return { success: false, error: 'Order is already cancelled' }
      }
      
      if (order.status === 'delivered') {
        return { success: false, error: 'Cannot cancel delivered orders' }
      }
      
      // Update order status to cancelled
      sharedOrders[orderIndex] = {
        ...order,
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      console.log(`✅ Order cancelled in shared storage: ${orderId}`)
      return { success: true, order: sharedOrders[orderIndex] }
    }
    return { success: false, error: 'Order not found' }
  },

  // Get order count
  getOrderCount: () => sharedOrders.length
}

// Cart Management
export const cartStorage = {
  // Get or create cart for user
  getOrCreateCart: (userEmail: string) => {
    let userCart = sharedCarts.find(cart => cart.userEmail === userEmail)
    
    if (!userCart) {
      userCart = {
        userEmail,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      sharedCarts.push(userCart)
      console.log(`✅ New cart created for user: ${userEmail}`)
    }
    
    return userCart
  },

  // Update cart items
  updateCartItems: (userEmail: string, items: any[]) => {
    const userCart = cartStorage.getOrCreateCart(userEmail)
    userCart.items = items
    userCart.updatedAt = new Date().toISOString()
    console.log(`✅ Cart updated for user: ${userEmail}, ${items.length} items`)
    return userCart
  },

  // Clear cart
  clearCart: (userEmail: string) => {
    const userCart = sharedCarts.find(cart => cart.userEmail === userEmail)
    if (userCart) {
      userCart.items = []
      userCart.updatedAt = new Date().toISOString()
      console.log(`✅ Cart cleared for user: ${userEmail}`)
      return true
    }
    return false
  },

  // Get cart count
  getCartCount: () => sharedCarts.length
}

// Health check
export const getStorageStats = () => ({
  orders: sharedOrders.length,
  carts: sharedCarts.length,
  products: sharedProducts.length,
  timestamp: new Date().toISOString()
})

console.log('🚀 Shared storage initialized')
