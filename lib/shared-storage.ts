// Shared In-Memory Storage for Vercel API Routes
// This allows different API routes to share data

// Global storage objects
let sharedOrders: any[] = []
let sharedCarts: any[] = []
let sharedProducts: any[] = []
let hasSeededProducts = false // Flag to prevent re-seeding

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
    
    // Load products from products.json
    const productsFile = path.join(process.cwd(), 'data', 'products.json')
    if (fs.existsSync(productsFile)) {
      try {
        const productsData = JSON.parse(fs.readFileSync(productsFile, 'utf8'))
        if (Array.isArray(productsData)) {
          sharedProducts.push(...productsData)
          console.log(`📁 Loaded ${productsData.length} products from products.json into shared storage`)
        }
      } catch (err) {
        console.warn('⚠️ Failed to load products.json:', err)
      }
    }
    
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
    
    // Save to file system for persistence
    try {
      if (typeof window === 'undefined') {
        const fs = require('fs')
        const path = require('path')
        const productsFile = path.join(process.cwd(), 'data', 'products.json')
        fs.writeFileSync(productsFile, JSON.stringify(sharedProducts, null, 2))
        console.log(`💾 Products saved to file system: ${sharedProducts.length} total`)
      }
    } catch (error) {
      console.warn('⚠️ Failed to save products to file system:', error)
    }
    
    console.log(`✅ Product added to shared storage: ${newProduct.name} (ID: ${newProduct.id})`)
    return newProduct
  },

  // Get all products
  getAllProducts: () => {
    return [...sharedProducts]
  },

  // Get product by ID (check both id and _id fields)
  getProductById: (id: string) => {
    return sharedProducts.find(product => product.id === id || product._id === id)
  },

  // Update product
  updateProduct: (id: string, updates: any) => {
    const productIndex = sharedProducts.findIndex(product => product.id === id || product._id === id)
    if (productIndex !== -1) {
      sharedProducts[productIndex] = {
        ...sharedProducts[productIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      // Save to file system for persistence
      try {
        if (typeof window === 'undefined') {
          const fs = require('fs')
          const path = require('path')
          const productsFile = path.join(process.cwd(), 'data', 'products.json')
          fs.writeFileSync(productsFile, JSON.stringify(sharedProducts, null, 2))
          console.log(`💾 Products saved to file system after update: ${sharedProducts.length} total`)
        }
      } catch (error) {
        console.warn('⚠️ Failed to save products to file system after update:', error)
      }
      
      console.log(`✅ Product updated in shared storage: ${id}`)
      return sharedProducts[productIndex]
    }
    return null
  },

  // Delete product
  deleteProduct: (id: string) => {
    const productIndex = sharedProducts.findIndex(product => product.id === id || product._id === id)
    if (productIndex !== -1) {
      const deletedProduct = sharedProducts.splice(productIndex, 1)[0]
      
      // Save to file system for persistence
      try {
        if (typeof window === 'undefined') {
          const fs = require('fs')
          const path = require('path')
          const productsFile = path.join(process.cwd(), 'data', 'products.json')
          fs.writeFileSync(productsFile, JSON.stringify(sharedProducts, null, 2))
          console.log(`💾 Products saved to file system after deletion: ${sharedProducts.length} total`)
        }
      } catch (error) {
        console.warn('⚠️ Failed to save products to file system after deletion:', error)
      }
      
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
  },

  // Save all products to file system
  saveAllProducts: () => {
    try {
      if (typeof window === 'undefined') {
        const fs = require('fs')
        const path = require('path')
        const productsFile = path.join(process.cwd(), 'data', 'products.json')
        fs.writeFileSync(productsFile, JSON.stringify(sharedProducts, null, 2))
        console.log(`💾 All ${sharedProducts.length} products saved to file system`)
        return true
      }
    } catch (error) {
      console.warn('⚠️ Failed to save all products to file system:', error)
      return false
    }
    return false
  },

  // Seed products if none exist
  seedProductsIfEmpty: () => {
    if (sharedProducts.length > 0 || hasSeededProducts) {
      console.log('🌱 Products already exist or already seeded, skipping seeding')
      return false
    }

    console.log('🌱 No products found, seeding sample products...')
    
    const sampleProducts = [
      {
        name: "Traditional Punjabi Jutti",
        punjabiName: "ਪਰੰਪਰਾਗਤ ਪੰਜਾਬੀ ਜੁੱਤੀ",
        description: "Handcrafted traditional Punjabi jutti with intricate embroidery",
        punjabiDescription: "ਹੱਥ ਨਾਲ ਬਣੀ ਪਰੰਪਰਾਗਤ ਪੰਜਾਬੀ ਜੁੱਤੀ ਜਿਸ ਵਿੱਚ ਸੁੰਦਰ ਕਢਾਈ ਹੈ",
        price: 1299,
        originalPrice: 1599,
        category: "men",
        subcategory: "jutti",
        stock: 25,
        isActive: true,
        featured: true,
        images: ["/placeholder.jpg"],
        sizes: ["7", "8", "9", "10"],
        colors: ["Brown", "Black"],
        tags: ["traditional", "handcrafted", "embroidery"],
        rating: 4.5,
        reviews: 23
      },
      {
        name: "Women's Bridal Jutti",
        punjabiName: "ਔਰਤਾਂ ਦੀ ਵਿਆਹੁਣੀ ਜੁੱਤੀ",
        description: "Elegant bridal jutti perfect for special occasions",
        punjabiDescription: "ਵਿਸ਼ੇਸ਼ ਮੌਕਿਆਂ ਲਈ ਸੁੰਦਰ ਵਿਆਹੁਣੀ ਜੁੱਤੀ",
        price: 1899,
        originalPrice: 2299,
        category: "women",
        subcategory: "jutti",
        stock: 15,
        isActive: true,
        featured: true,
        images: ["/placeholder.jpg"],
        sizes: ["6", "7", "8", "9"],
        colors: ["Red", "Gold", "Silver"],
        tags: ["bridal", "elegant", "special-occasion"],
        rating: 4.8,
        reviews: 18
      },
      {
        name: "Kids Colorful Jutti",
        punjabiName: "ਬੱਚਿਆਂ ਦੀ ਰੰਗੀਨ ਜੁੱਤੀ",
        description: "Colorful and comfortable jutti for kids",
        punjabiDescription: "ਬੱਚਿਆਂ ਲਈ ਰੰਗੀਨ ਅਤੇ ਆਰਾਮਦਾਇਕ ਜੁੱਤੀ",
        price: 899,
        originalPrice: 1199,
        category: "kids",
        subcategory: "jutti",
        stock: 30,
        isActive: true,
        featured: true,
        images: ["/placeholder.jpg"],
        sizes: ["1", "2", "3", "4", "5"],
        colors: ["Blue", "Pink", "Green", "Yellow"],
        tags: ["kids", "colorful", "comfortable"],
        rating: 4.2,
        reviews: 12
      },
      {
        name: "Phulkari Dupatta",
        punjabiName: "ਫੁਲਕਾਰੀ ਦੁਪੱਟਾ",
        description: "Beautiful handcrafted Phulkari dupatta with traditional embroidery",
        punjabiDescription: "ਪਰੰਪਰਾਗਤ ਕਢਾਈ ਨਾਲ ਸੁੰਦਰ ਹੱਥ ਨਾਲ ਬਣੀ ਫੁਲਕਾਰੀ ਦੁਪੱਟਾ",
        price: 2499,
        originalPrice: 2999,
        category: "fulkari",
        subcategory: "fulkari",
        stock: 20,
        isActive: true,
        featured: true,
        images: ["/placeholder.jpg"],
        sizes: ["Free Size"],
        colors: ["Red", "Pink", "Orange"],
        tags: ["phulkari", "handcrafted", "traditional", "dupatta"],
        rating: 4.9,
        reviews: 8
      }
    ]

    // Add each product
    sampleProducts.forEach(productData => {
      productStorage.addProduct(productData)
    })

    console.log(`🌱 Seeded ${sampleProducts.length} sample products`)
    hasSeededProducts = true
    return true
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

// Seed products if none exist after initialization
// Only seed if we're in development, no products exist, and we haven't seeded before
if (sharedProducts.length === 0 && process.env.NODE_ENV === 'development' && !hasSeededProducts) {
  console.log('🌱 Development mode: Seeding sample products...')
  productStorage.seedProductsIfEmpty()
} else if (sharedProducts.length === 0) {
  console.log('📁 No products found, but skipping auto-seeding in production')
}
