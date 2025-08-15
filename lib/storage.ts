// Simple in-memory storage for serverless environments
// This resets on server restart but works in read-only filesystems
const memoryStore = new Map<string, any[]>()

// Try to initialize from existing files if possible
let initialized = false

async function initializeFromFiles() {
  if (initialized || typeof window !== 'undefined') return
  
  try {
    const fs = require('fs')
    const path = require('path')
    const dataDir = path.resolve(process.cwd(), 'data')
    
    if (fs.existsSync(dataDir)) {
      // Load products
      const productsFile = path.join(dataDir, 'products.json')
      if (fs.existsSync(productsFile)) {
        const productsData = JSON.parse(fs.readFileSync(productsFile, 'utf8'))
        memoryStore.set('products', productsData)
        console.log(`Loaded ${productsData.length} products from file into memory`)
      }
      
      // Load orders
      const ordersFile = path.join(dataDir, 'orders.json')
      if (fs.existsSync(ordersFile)) {
        const ordersData = JSON.parse(fs.readFileSync(ordersFile, 'utf8'))
        memoryStore.set('orders', ordersData)
        console.log(`Loaded ${ordersData.length} orders from file into memory`)
      }
      
      // Load users
      const usersFile = path.join(dataDir, 'users.json')
      if (fs.existsSync(usersFile)) {
        const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8'))
        memoryStore.set('users', usersData)
        console.log(`Loaded ${usersData.length} users from file into memory`)
      }
    }
  } catch (error) {
    console.log('Using empty memory storage (could not load from files):', error.message)
  }
  
  initialized = true
}

// Helper functions for common operations
export async function getProducts(): Promise<any[]> {
  await initializeFromFiles()
  return memoryStore.get('products') || []
}

export async function saveProducts(products: any[]): Promise<void> {
  await initializeFromFiles()
  memoryStore.set('products', products)
  console.log(`Saved ${products.length} products to memory storage`)
}

export async function getOrders(): Promise<any[]> {
  await initializeFromFiles()
  return memoryStore.get('orders') || []
}

export async function saveOrders(orders: any[]): Promise<void> {
  await initializeFromFiles()
  memoryStore.set('orders', orders)
}

export async function getUsers(): Promise<any[]> {
  await initializeFromFiles()
  return memoryStore.get('users') || []
}

export async function saveUsers(users: any[]): Promise<void> {
  await initializeFromFiles()
  memoryStore.set('users', users)
}

// Export the memory store for advanced usage if needed
export { memoryStore }
