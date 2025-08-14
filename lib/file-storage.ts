import fs from 'fs'
import path from 'path'

const DATA_DIR = path.resolve(process.cwd(), 'data')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

export interface Product {
  id: string
  name: string
  punjabiName: string
  description: string
  punjabiDescription: string
  price: number
  originalPrice: number
  category: 'men' | 'women' | 'kids' | 'phulkari'
  subcategory?: string
  images: string[]
  colors: string[]
  sizes: string[]
  stock: number
  rating: number
  reviews: number
  badge?: string
  badgeEn?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Admin {
  id: string
  username: string
  email: string
  password: string
  role: 'super_admin' | 'admin' | 'manager'
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
    size: string
    color: string
  }>
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  customerInfo: {
    name: string
    email: string
    phone: string
    address: {
      street: string
      city: string
      state: string
      pincode: string
    }
  }
  createdAt: string
  updatedAt: string
}

class FileStorage {
  private getFilePath(collection: string): string {
    return path.join(DATA_DIR, `${collection}.json`)
  }

  private readData<T>(collection: string): T[] {
    const filePath = this.getFilePath(collection)
    if (!fs.existsSync(filePath)) {
      return []
    }
    try {
      const data = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      console.error(`Error reading ${collection}:`, error)
      return []
    }
  }

  private writeData<T>(collection: string, data: T[]): void {
    const filePath = this.getFilePath(collection)
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
    } catch (error) {
      console.error(`Error writing ${collection}:`, error)
      throw error
    }
  }

  // Generic CRUD operations
  async find<T extends { id: string }>(collection: string, query?: Partial<T>): Promise<T[]> {
    const data = this.readData<T>(collection)
    if (!query) return data

    return data.filter(item => {
      return Object.entries(query).every(([key, value]) => {
        return item[key as keyof T] === value
      })
    })
  }

  async findById<T extends { id: string }>(collection: string, id: string): Promise<T | null> {
    const data = this.readData<T>(collection)
    return data.find(item => item.id === id) || null
  }

  async create<T extends { id: string }>(collection: string, item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const data = this.readData<T>(collection)
    const now = new Date().toISOString()
    const newItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    } as T

    data.push(newItem)
    this.writeData(collection, data)
    return newItem
  }

  async update<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): Promise<T | null> {
    const data = this.readData<T>(collection)
    const index = data.findIndex(item => item.id === id)
    
    if (index === -1) return null

    const updatedItem = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    } as T

    data[index] = updatedItem
    this.writeData(collection, data)
    return updatedItem
  }

  async delete<T extends { id: string }>(collection: string, id: string): Promise<boolean> {
    const data = this.readData<T>(collection)
    const initialLength = data.length
    const filteredData = data.filter(item => item.id !== id)
    
    if (filteredData.length === initialLength) return false
    
    this.writeData(collection, filteredData)
    return true
  }

  async deleteMany<T extends { id: string }>(collection: string, query?: Partial<T>): Promise<number> {
    const data = this.readData<T>(collection)
    let filteredData = data

    if (query) {
      filteredData = data.filter(item => {
        return !Object.entries(query).every(([key, value]) => {
          return item[key as keyof T] === value
        })
      })
    } else {
      filteredData = []
    }

    const deletedCount = data.length - filteredData.length
    this.writeData(collection, filteredData)
    return deletedCount
  }

  // Specialized methods
  async getProducts(category?: string, limit?: number): Promise<Product[]> {
    let products = await this.find<Product>('products', { isActive: true } as Partial<Product>)
    
    if (category) {
      products = products.filter(p => p.category === category)
    }
    
    if (limit) {
      products = products.slice(0, limit)
    }
    
    return products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const products = await this.find<Product>('products', { isActive: true } as Partial<Product>)
    return products
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    const products = await this.find<Product>('products', { isActive: true } as Partial<Product>)
    const term = searchTerm.toLowerCase()
    
    return products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.punjabiName.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    )
  }
}

export const fileStorage = new FileStorage()
