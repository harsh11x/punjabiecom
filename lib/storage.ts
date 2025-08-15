// Storage adapter to handle different storage backends
// This will work in serverless environments where filesystem is read-only

interface StorageAdapter {
  get(key: string): Promise<any[]>
  set(key: string, data: any[]): Promise<void>
}

// Simple in-memory storage (resets on server restart, but works for development)
class MemoryStorage implements StorageAdapter {
  private store: Map<string, any[]> = new Map()

  async get(key: string): Promise<any[]> {
    return this.store.get(key) || []
  }

  async set(key: string, data: any[]): Promise<void> {
    this.store.set(key, data)
  }
}

// You can extend this with other storage options like:
// - Vercel KV
// - Supabase
// - MongoDB
// - Firebase
// - etc.

class FileStorage implements StorageAdapter {
  private fs = require('fs')
  private path = require('path')
  private dataDir: string

  constructor() {
    this.dataDir = this.path.resolve(process.cwd(), 'data')
  }

  async get(key: string): Promise<any[]> {
    try {
      const filePath = this.path.join(this.dataDir, `${key}.json`)
      if (!this.fs.existsSync(filePath)) {
        return []
      }
      const data = this.fs.readFileSync(filePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error(`Error reading ${key}:`, error)
      return []
    }
  }

  async set(key: string, data: any[]): Promise<void> {
    try {
      if (!this.fs.existsSync(this.dataDir)) {
        this.fs.mkdirSync(this.dataDir, { recursive: true })
      }
      const filePath = this.path.join(this.dataDir, `${key}.json`)
      this.fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
    } catch (error) {
      console.error(`Error writing ${key}:`, error)
      throw error
    }
  }
}

// Storage factory - automatically chooses the best available storage
function createStorage(): StorageAdapter {
  // Check if we're in a serverless environment or filesystem is read-only
  if (process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    console.log('Using memory storage for serverless environment')
    return new MemoryStorage()
  }

  // Try to use file storage, fall back to memory if it fails
  try {
    const fs = require('fs')
    const path = require('path')
    const testDir = path.join(process.cwd(), 'data')
    
    // Test if we can write to the filesystem
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true })
    }
    
    const testFile = path.join(testDir, 'test.json')
    fs.writeFileSync(testFile, '[]')
    fs.unlinkSync(testFile)
    
    console.log('Using file storage')
    return new FileStorage()
  } catch (error) {
    console.log('Filesystem is read-only, using memory storage')
    return new MemoryStorage()
  }
}

// Global storage instance
const storage = createStorage()

// Helper functions for common operations
export async function getProducts(): Promise<any[]> {
  return storage.get('products')
}

export async function saveProducts(products: any[]): Promise<void> {
  return storage.set('products', products)
}

export async function getOrders(): Promise<any[]> {
  return storage.get('orders')
}

export async function saveOrders(orders: any[]): Promise<void> {
  return storage.set('orders', orders)
}

export async function getUsers(): Promise<any[]> {
  return storage.get('users')
}

export async function saveUsers(users: any[]): Promise<void> {
  return storage.set('users', users)
}

// Initialize with existing data if available
async function initializeStorage() {
  try {
    // Try to load existing data from files if they exist
    const fs = require('fs')
    const path = require('path')
    const dataDir = path.resolve(process.cwd(), 'data')
    
    if (fs.existsSync(dataDir)) {
      // Load products
      const productsFile = path.join(dataDir, 'products.json')
      if (fs.existsSync(productsFile)) {
        const productsData = JSON.parse(fs.readFileSync(productsFile, 'utf8'))
        await storage.set('products', productsData)
        console.log(`Loaded ${productsData.length} products from file`)
      }
      
      // Load orders
      const ordersFile = path.join(dataDir, 'orders.json')
      if (fs.existsSync(ordersFile)) {
        const ordersData = JSON.parse(fs.readFileSync(ordersFile, 'utf8'))
        await storage.set('orders', ordersData)
        console.log(`Loaded ${ordersData.length} orders from file`)
      }
      
      // Load users
      const usersFile = path.join(dataDir, 'users.json')
      if (fs.existsSync(usersFile)) {
        const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8'))
        await storage.set('users', usersData)
        console.log(`Loaded ${usersData.length} users from file`)
      }
    }
  } catch (error) {
    console.log('Could not load existing data, starting with empty storage')
  }
}

// Initialize storage when the module is loaded
initializeStorage()

export { storage }
