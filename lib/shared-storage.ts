// Shared In-Memory Storage for Vercel API Routes
// This allows different API routes to share data

// Global storage objects
let sharedOrders: any[] = []
let sharedCarts: any[] = []

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
      sharedOrders[orderIndex] = {
        ...sharedOrders[orderIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      console.log(`✅ Order updated in shared storage: ${orderId}`)
      return sharedOrders[orderIndex]
    }
    return null
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
  timestamp: new Date().toISOString()
})

console.log('🚀 Shared storage initialized')
