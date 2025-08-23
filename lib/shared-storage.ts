// Shared In-Memory Storage for Vercel API Routes
// This allows different API routes to share data

// Global storage objects
let sharedOrders: any[] = []
let sharedCarts: any[] = []
let sharedProducts: any[] = []

// Function to identify fake/test orders
function isFakeOrder(order: any): boolean {
  if (!order) return true
  
  // Check for obvious test identifiers in order structure
  if (order._id?.includes('test') || order._id?.includes('fallback')) return true
  if (order.orderNumber?.includes('TEST')) return true
  if (order.status === 'test') return true
  
  // Check for test email addresses (primary indicator)
  if (order.customerEmail?.includes('test@') || order.customerEmail?.includes('@test.')) return true
  if (order.customerEmail === 'test@example.com') return true
  
  // If customer email is real (not test), consider it a real order even if other fields are test
  const realEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com']
  const isRealEmail = order.customerEmail && realEmailDomains.some(domain => order.customerEmail.includes(domain))
  
  if (isRealEmail) {
    // For real emails, only flag as fake if ALL indicators suggest it's test data
    let testIndicators = 0
    
    // Check for test products
    if (order.items?.some((item: any) => 
      item.name?.includes('Test Product') || item.name?.includes('Test Item')
    )) testIndicators++
    
    // Check for test addresses
    const addr = order.shippingAddress
    if (addr?.fullName?.includes('Test') || 
        addr?.firstName?.includes('Test') ||
        addr?.addressLine1?.includes('Test') ||
        addr?.address?.includes('Test') ||
        addr?.city?.includes('Test') ||
        addr?.state?.includes('Test')) testIndicators++
    
    // Check for test tracking numbers
    if (order.trackingNumber?.includes('TEST')) testIndicators++
    
    // Only consider fake if multiple test indicators (real customer wouldn't have real address + real email)
    return testIndicators >= 2
  }
  
  // For non-real emails, check for any test indicators
  // Check for test products
  if (order.items?.some((item: any) => 
    item.name?.includes('Test') || 
    item.productId === 'test' ||
    item.id === 'test' ||
    item.id?.includes('test-product')
  )) return true
  
  // Check for test addresses
  const addr = order.shippingAddress
  if (addr?.fullName?.includes('Test') || 
      addr?.firstName?.includes('Test') ||
      addr?.addressLine1?.includes('Test') ||
      addr?.address?.includes('Test') ||
      addr?.city?.includes('Test') ||
      addr?.state?.includes('Test')) return true
  
  // Check for test tracking numbers
  if (order.trackingNumber?.includes('TEST')) return true
  
  return false
}

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
      let skippedFakeOrders = 0
      
      orderFiles.forEach((file: string) => {
        try {
          const orderData = JSON.parse(fs.readFileSync(path.join(ordersDir, file), 'utf8'))
          if (orderData._id) {
            if (!isFakeOrder(orderData)) {
              sharedOrders.push(orderData)
              loadedOrders++
            } else {
              skippedFakeOrders++
              console.log(`🗑️ Skipped fake order: ${orderData.orderNumber || orderData._id}`)
            }
          }
        } catch (err) {
          console.warn(`⚠️ Failed to load order file ${file}:`, err)
        }
      })
      
      if (loadedOrders > 0) {
        console.log(`📁 Loaded ${loadedOrders} real orders from files into shared storage`)
      }
      if (skippedFakeOrders > 0) {
        console.log(`🗑️ Skipped ${skippedFakeOrders} fake/test orders`)
      }
    }
    
    // Load orders from orders.json if it exists
    const ordersFile = path.join(process.cwd(), 'data', 'orders.json')
    if (fs.existsSync(ordersFile)) {
      try {
        const ordersData = JSON.parse(fs.readFileSync(ordersFile, 'utf8'))
        if (Array.isArray(ordersData)) {
          let additionalOrders = 0
          let skippedAdditionalFake = 0
          
          // Add orders that aren't already loaded and aren't fake
          ordersData.forEach((order: any) => {
            if (!sharedOrders.find(o => o._id === order._id)) {
              if (!isFakeOrder(order)) {
                sharedOrders.push(order)
                additionalOrders++
              } else {
                skippedAdditionalFake++
              }
            }
          })
          
          if (additionalOrders > 0) {
            console.log(`📁 Loaded ${additionalOrders} additional real orders from orders.json`)
          }
          if (skippedAdditionalFake > 0) {
            console.log(`🗑️ Skipped ${skippedAdditionalFake} additional fake orders from orders.json`)
          }
        }
      } catch (err) {
        console.warn('⚠️ Failed to load orders.json:', err)
      }
    }
    
    // Load products from products.json if it exists
    const productsFile = path.join(process.cwd(), 'data', 'products.json')
    if (fs.existsSync(productsFile)) {
      try {
        const productsData = JSON.parse(fs.readFileSync(productsFile, 'utf8'))
        if (Array.isArray(productsData)) {
          sharedProducts = [...productsData]
          console.log(`📁 Loaded ${productsData.length} products from products.json`)
        }
      } catch (err) {
        console.warn('⚠️ Failed to load products.json:', err)
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
    // Ensure fresh data from files
    initializeFromFiles()
    
    const newProduct = {
      ...productData,
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    sharedProducts.push(newProduct)
    
    // Save to file system
    try {
      if (typeof window === 'undefined') {
        const fs = require('fs')
        const path = require('path')
        const productsFile = path.join(process.cwd(), 'data', 'products.json')
        fs.writeFileSync(productsFile, JSON.stringify(sharedProducts, null, 2))
        console.log(`💾 Products saved to file system`)
      }
    } catch (error) {
      console.warn('⚠️ Failed to save products to file system:', error)
    }
    
    console.log(`✅ Product added to shared storage: ${newProduct.name} (ID: ${newProduct.id})`)
    return newProduct
  },

  // Get all products
  getAllProducts: () => {
    // Always ensure fresh data from files
    initializeFromFiles()
    return [...sharedProducts]
  },

  // Get product by ID
  getProductById: (id: string) => {
    // Always ensure fresh data from files
    initializeFromFiles()
    return sharedProducts.find(product => product.id === id)
  },

  // Update product
  updateProduct: (id: string, updates: any) => {
    // Always ensure fresh data from files
    initializeFromFiles()
    
    const productIndex = sharedProducts.findIndex(product => product.id === id)
    if (productIndex !== -1) {
      sharedProducts[productIndex] = {
        ...sharedProducts[productIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      // Save to file system
      try {
        if (typeof window === 'undefined') {
          const fs = require('fs')
          const path = require('path')
          const productsFile = path.join(process.cwd(), 'data', 'products.json')
          fs.writeFileSync(productsFile, JSON.stringify(sharedProducts, null, 2))
          console.log(`💾 Products saved to file system`)
        }
      } catch (error) {
        console.warn('⚠️ Failed to save products to file system:', error)
      }
      
      console.log(`✅ Product updated in shared storage: ${id}`)
      return sharedProducts[productIndex]
    }
    return null
  },

  // Delete product
  deleteProduct: (id: string) => {
    // Always ensure fresh data from files
    initializeFromFiles()
    
    const productIndex = sharedProducts.findIndex(product => product.id === id)
    if (productIndex !== -1) {
      const deletedProduct = sharedProducts.splice(productIndex, 1)[0]
      
      // Save to file system
      try {
        if (typeof window === 'undefined') {
          const fs = require('fs')
          const path = require('path')
          const productsFile = path.join(process.cwd(), 'data', 'products.json')
          fs.writeFileSync(productsFile, JSON.stringify(sharedProducts, null, 2))
          console.log(`💾 Products saved to file system`)
        }
      } catch (error) {
        console.warn('⚠️ Failed to save products to file system:', error)
      }
      
      console.log(`✅ Product deleted from shared storage: ${id}`)
      return deletedProduct
    }
    return null
  },

  // Get product count
  getProductCount: () => {
    // Always ensure fresh data from files
    initializeFromFiles()
    return sharedProducts.length
  },

  // Get product statistics
  getProductStats: () => {
    // Always ensure fresh data from files
    initializeFromFiles()
    
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
  addOrder: (orderData: any) => {
    // Always ensure fresh data from files
    initializeFromFiles()
    
    const newOrder = {
      ...orderData,
      _id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
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
    // Always ensure fresh data from files
    initializeFromFiles()
    return [...sharedOrders]
  },

  // Get orders by user email
  getOrdersByUser: (email: string) => {
    // Always ensure fresh data from files
    initializeFromFiles()
    return sharedOrders.filter(order => order.customerEmail === email)
  },

  // Update order
  updateOrder: (orderId: string, updates: any) => {
    // Always ensure fresh data from files
    initializeFromFiles()
    
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
    // Always ensure fresh data from files
    initializeFromFiles()
    
    const orderIndex = sharedOrders.findIndex(order => order._id === orderId)
    if (orderIndex !== -1) {
      const order = sharedOrders[orderIndex]
      const orderDate = new Date(order.createdAt)
      const now = new Date()
      const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60)
      
      if (hoursDiff > 24) {
        throw new Error('Orders can only be cancelled within 24 hours of placement')
      }
      
      sharedOrders[orderIndex] = {
        ...order,
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      }
      
      // Save to file system
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
      
      console.log(`✅ Order cancelled: ${orderId}`)
      return sharedOrders[orderIndex]
    }
    return null
  },

  // Get order by ID
  getOrderById: (orderId: string) => {
    // Always ensure fresh data from files
    initializeFromFiles()
    return sharedOrders.find(order => order._id === orderId)
  },

  // Get order by Razorpay order ID
  getOrderByRazorpayId: (razorpayOrderId: string) => {
    // Always ensure fresh data from files
    initializeFromFiles()
    return sharedOrders.find(order => order.razorpayOrderId === razorpayOrderId)
  }
}

// Cart Management
export const cartStorage = {
  // Add item to cart
  addToCart: (userId: string, item: any) => {
    // Always ensure fresh data from files
    initializeFromFiles()
    
    let userCart = sharedCarts.find(cart => cart.userId === userId)
    if (!userCart) {
      userCart = { userId, items: [] }
      sharedCarts.push(userCart)
    }
    
    const existingItemIndex = userCart.items.findIndex(
      (cartItem: any) => cartItem.productId === item.productId && 
                         cartItem.size === item.size && 
                         cartItem.color === item.color
    )
    
    if (existingItemIndex !== -1) {
      userCart.items[existingItemIndex].quantity += item.quantity
    } else {
      userCart.items.push(item)
    }
    
    console.log(`✅ Item added to cart for user: ${userId}`)
    return userCart
  },

  // Get user cart
  getUserCart: (userId: string) => {
    // Always ensure fresh data from files
    initializeFromFiles()
    return sharedCarts.find(cart => cart.userId === userId) || { userId, items: [] }
  },

  // Update cart item quantity
  updateCartItemQuantity: (userId: string, productId: string, size: string, color: string, quantity: number) => {
    // Always ensure fresh data from files
    initializeFromFiles()
    
    const userCart = sharedCarts.find(cart => cart.userId === userId)
    if (userCart) {
      const itemIndex = userCart.items.findIndex(
        (item: any) => item.productId === productId && item.size === size && item.color === color
      )
      
      if (itemIndex !== -1) {
        if (quantity <= 0) {
          userCart.items.splice(itemIndex, 1)
        } else {
          userCart.items[itemIndex].quantity = quantity
        }
        console.log(`✅ Cart item quantity updated for user: ${userId}`)
      }
    }
    
    return userCart
  },

  // Remove item from cart
  removeFromCart: (userId: string, productId: string, size: string, color: string) => {
    // Always ensure fresh data from files
    initializeFromFiles()
    
    const userCart = sharedCarts.find(cart => cart.userId === userId)
    if (userCart) {
      const itemIndex = userCart.items.findIndex(
        (item: any) => item.productId === productId && item.size === size && item.color === color
      )
      
      if (itemIndex !== -1) {
        userCart.items.splice(itemIndex, 1)
        console.log(`✅ Item removed from cart for user: ${userId}`)
      }
    }
    
    return userCart
  },

  // Clear user cart
  clearUserCart: (userId: string) => {
    // Always ensure fresh data from files
    initializeFromFiles()
    
    const userCartIndex = sharedCarts.findIndex(cart => cart.userId === userId)
    if (userCartIndex !== -1) {
      sharedCarts.splice(userCartIndex, 1)
      console.log(`✅ Cart cleared for user: ${userId}`)
    }
    
    return { userId, items: [] }
  }
}

// Health check
export const getStorageStats = () => ({
  orders: sharedOrders.length,
  carts: sharedCarts.length,
  products: sharedProducts.length,
  timestamp: new Date().toISOString()
})

console.log('🚀 Shared storage initialized')
