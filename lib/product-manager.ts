import fs from 'fs'
import path from 'path'
import { connectDB } from './mongodb'
import Product from '@/models/Product'

/**
 * Robust Product Management System
 * Primary: File Storage (always works)
 * Secondary: MongoDB (when available)
 * This ensures products are always accessible and synced
 */

export interface ProductData {
  _id?: string
  id: string
  name: string
  punjabiName: string
  description: string
  punjabiDescription?: string
  price: number
  originalPrice: number
  category: 'men' | 'women' | 'kids' | 'phulkari'
  subcategory?: string
  images: string[]
  colors: string[]
  sizes: string[]
  stock: number
  rating?: number
  reviews?: number
  badge?: string
  badgeEn?: string
  isActive: boolean
  createdAt?: string | Date
  updatedAt?: string | Date
}

// File paths
const DATA_DIR = path.resolve(process.cwd(), 'data')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

/**
 * Get all products (File Storage Primary)
 */
export async function getAllProducts(): Promise<ProductData[]> {
  let products: ProductData[] = []

  // Always try file storage first (most reliable)
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf8')
      products = JSON.parse(data)
      console.log(`📁 Loaded ${products.length} products from file storage`)
    } else {
      // Create empty products file if it doesn't exist
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2), 'utf8')
      products = []
    }
  } catch (error) {
    console.error('❌ Error reading from file storage:', error)
    products = []
  }

  // Try to sync with MongoDB in background (non-blocking)
  syncWithMongoDB(products).catch(error => {
    console.warn('⚠️ MongoDB sync failed (running in file-only mode):', error.message)
  })

  return products.filter(p => p.isActive !== false)
}

/**
 * Add a new product (File Storage Primary)
 */
export async function addProduct(productData: Omit<ProductData, 'id' | '_id'>): Promise<ProductData> {
  const newProduct: ProductData = {
    id: generateProductId(),
    ...productData,
    punjabiDescription: productData.punjabiDescription || productData.description,
    rating: productData.rating || 4.5,
    reviews: productData.reviews || 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // Save to file storage (primary)
  try {
    const products = await getAllProductsFromFile()
    products.push(newProduct)
    saveProductsToFile(products)
    console.log('✅ Product saved to file storage:', newProduct.name)
  } catch (error) {
    console.error('❌ Failed to save to file storage:', error)
    throw new Error('Failed to save product')
  }

  // Try to save to MongoDB (secondary, non-blocking)
  saveToMongoDB(newProduct).catch(error => {
    console.warn('⚠️ MongoDB save failed (product saved to file storage):', error.message)
  })

  return newProduct
}

/**
 * Update a product (File Storage Primary)
 */
export async function updateProduct(productId: string, updateData: Partial<ProductData>): Promise<ProductData> {
  // Update in file storage (primary)
  const products = await getAllProductsFromFile()
  const productIndex = products.findIndex(p => p.id === productId || p._id === productId)
  
  if (productIndex === -1) {
    throw new Error('Product not found')
  }

  const updatedProduct = {
    ...products[productIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  }

  products[productIndex] = updatedProduct
  saveProductsToFile(products)
  console.log('✅ Product updated in file storage:', updatedProduct.name)

  // Try to update in MongoDB (secondary, non-blocking)
  updateInMongoDB(productId, updateData).catch(error => {
    console.warn('⚠️ MongoDB update failed (product updated in file storage):', error.message)
  })

  return updatedProduct
}

/**
 * Delete a product (File Storage Primary)
 */
export async function deleteProduct(productId: string): Promise<void> {
  // Delete from file storage (primary)
  const products = await getAllProductsFromFile()
  const filteredProducts = products.filter(p => p.id !== productId && p._id !== productId)
  
  if (filteredProducts.length === products.length) {
    throw new Error('Product not found')
  }

  saveProductsToFile(filteredProducts)
  console.log('✅ Product deleted from file storage')

  // Try to delete from MongoDB (secondary, non-blocking)
  deleteFromMongoDB(productId).catch(error => {
    console.warn('⚠️ MongoDB delete failed (product deleted from file storage):', error.message)
  })
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string): Promise<ProductData[]> {
  const allProducts = await getAllProducts()
  
  if (category === 'all') {
    return allProducts
  }
  
  if (category === 'jutti') {
    return allProducts.filter(p => 
      p.subcategory === 'jutti' || 
      (p.category !== 'phulkari' && !p.subcategory)
    )
  }
  
  return allProducts.filter(p => p.category === category)
}

/**
 * Search products
 */
export async function searchProducts(query: string): Promise<ProductData[]> {
  const allProducts = await getAllProducts()
  const searchLower = query.toLowerCase()
  
  return allProducts.filter(product =>
    product.name.toLowerCase().includes(searchLower) ||
    product.punjabiName?.toLowerCase().includes(searchLower) ||
    product.description.toLowerCase().includes(searchLower) ||
    product.category.toLowerCase().includes(searchLower)
  )
}

// Helper functions
function generateProductId(): string {
  return `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

async function getAllProductsFromFile(): Promise<ProductData[]> {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf8')
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error('Error reading products from file:', error)
    return []
  }
}

function saveProductsToFile(products: ProductData[]): void {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8')
  } catch (error) {
    console.error('Error saving products to file:', error)
    throw error
  }
}

// MongoDB helper functions (non-blocking)
async function syncWithMongoDB(fileProducts: ProductData[]): Promise<void> {
  try {
    await connectDB()
    
    // Get products from MongoDB
    const mongoProducts = await Product.find({}).lean()
    
    // If MongoDB has more recent products, update file storage
    if (mongoProducts.length > fileProducts.length) {
      const formattedProducts = mongoProducts.map((product: any) => ({
        ...product,
        _id: product._id.toString(),
        id: product._id.toString()
      }))
      saveProductsToFile(formattedProducts)
      console.log('🔄 Synced MongoDB products to file storage')
    }
    // If file storage has more products, sync to MongoDB
    else if (fileProducts.length > mongoProducts.length) {
      for (const product of fileProducts) {
        const exists = await Product.findOne({ 
          $or: [{ name: product.name }, { _id: product._id || product.id }] 
        })
        
        if (!exists) {
          await new Product(product).save()
        }
      }
      console.log('🔄 Synced file products to MongoDB')
    }
  } catch (error) {
    // MongoDB not available, continue with file storage
    throw error
  }
}

async function saveToMongoDB(product: ProductData): Promise<void> {
  try {
    await connectDB()
    await new Product(product).save()
    console.log('✅ Product synced to MongoDB:', product.name)
  } catch (error) {
    throw error
  }
}

async function updateInMongoDB(productId: string, updateData: Partial<ProductData>): Promise<void> {
  try {
    await connectDB()
    await Product.findByIdAndUpdate(productId, updateData)
    console.log('✅ Product updated in MongoDB')
  } catch (error) {
    throw error
  }
}

async function deleteFromMongoDB(productId: string): Promise<void> {
  try {
    await connectDB()
    await Product.findByIdAndDelete(productId)
    console.log('✅ Product deleted from MongoDB')
  } catch (error) {
    throw error
  }
}

/**
 * Force sync between file storage and MongoDB
 */
export async function forceSyncProducts(): Promise<{ fileCount: number; mongoCount: number; synced: boolean }> {
  const fileProducts = await getAllProductsFromFile()
  let mongoCount = 0
  let synced = false

  try {
    await connectDB()
    const mongoProducts = await Product.find({}).lean()
    mongoCount = mongoProducts.length

    // Always prioritize file storage as source of truth
    if (fileProducts.length > 0) {
      // Clear MongoDB and resync from file storage
      await Product.deleteMany({})
      
      for (const product of fileProducts) {
        await new Product(product).save()
      }
      
      synced = true
      console.log('✅ Force synced file storage to MongoDB')
    }
  } catch (error) {
    console.warn('⚠️ MongoDB not available for sync')
  }

  return {
    fileCount: fileProducts.length,
    mongoCount,
    synced
  }
}
