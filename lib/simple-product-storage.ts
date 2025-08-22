// Simple in-memory product storage for Vercel serverless functions
// In production, you'd use a database like MongoDB or PostgreSQL

import fs from 'fs'
import path from 'path'

// File paths
const DATA_DIR = path.resolve(process.cwd(), 'data')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

interface SimpleProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  images: string[]
  sizes: string[]
  colors: string[]
  inStock: boolean
  isActive: boolean
  stockQuantity: number
  featured: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

// In-memory storage (will be populated from file)
let products: SimpleProduct[] = []

// Save products to file
function saveProductsToFile() {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2))
    console.log(`💾 Saved ${products.length} products to file`)
  } catch (error) {
    console.error('❌ Failed to save products to file:', error)
  }
}

// Load products from file and map to correct structure
function loadProductsFromFile() {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf8')
      const fileProducts = JSON.parse(data)
      if (Array.isArray(fileProducts) && fileProducts.length > 0) {
        // Map the existing data structure to our expected interface
        const mappedProducts = fileProducts.map((p: any) => ({
          id: p.id || p._id || `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: p.name || '',
          description: p.description || '',
          price: p.price || 0,
          originalPrice: p.originalPrice,
          category: p.category || 'general',
          subcategory: p.subcategory,
          images: Array.isArray(p.images) ? p.images : [],
          sizes: Array.isArray(p.sizes) ? p.sizes : [],
          colors: Array.isArray(p.colors) ? p.colors : [],
          inStock: p.stock ? p.stock > 0 : (p.inStock !== false), // Map stock to inStock
          isActive: p.isActive !== false, // Default to true (active)
          stockQuantity: p.stock || p.stockQuantity || 1, // Map stock to stockQuantity
          featured: p.featured === true,
          tags: Array.isArray(p.tags) ? p.tags : [],
          createdAt: p.createdAt || new Date().toISOString(),
          updatedAt: p.updatedAt || new Date().toISOString()
        }))
        
        products.splice(0, products.length, ...mappedProducts)
        console.log(`📁 Loaded ${products.length} products from file with proper mapping`)
        console.log('📁 Sample mapped products:', mappedProducts.slice(0, 2).map(p => ({ 
          id: p.id, 
          name: p.name, 
          category: p.category, 
          subcategory: p.subcategory 
        })))
        return true
      }
    }
  } catch (error) {
    console.error('❌ Failed to load products from file:', error)
  }
  return false
}

let isInitialized = false

// Load products from AWS on startup
async function initializeFromAWS() {
  if (isInitialized) return
  
  try {
    console.log('🔄 Loading products from AWS...')
    
    // Check if AWS environment variables are available
    if (!process.env.AWS_SYNC_SERVER_URL || !process.env.AWS_SYNC_SECRET) {
      console.log('⚠️ AWS environment variables not set, keeping file products')
      isInitialized = true
      return
    }
    
    const response = await fetch(`${process.env.AWS_SYNC_SERVER_URL}/api/sync/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AWS_SYNC_SECRET}`
      },
      body: JSON.stringify({ action: 'get' }),
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.success && data.products && data.products.length > 0) {
        // Map AWS products to our interface
        const mappedProducts = data.products.map((p: any) => ({
          id: p.id || p._id || generateId(),
          name: p.name || '',
          description: p.description || '',
          price: p.price || 0,
          originalPrice: p.originalPrice,
          category: p.category || 'general',
          subcategory: p.subcategory,
          images: Array.isArray(p.images) ? p.images : [],
          sizes: Array.isArray(p.sizes) ? p.sizes : [],
          colors: Array.isArray(p.colors) ? p.colors : [],
          inStock: p.stock ? p.stock > 0 : (p.inStock !== false),
          isActive: p.isActive !== false,
          stockQuantity: p.stock || p.stockQuantity || 1,
          featured: p.featured === true,
          tags: Array.isArray(p.tags) ? p.tags : [],
          createdAt: p.createdAt || new Date().toISOString(),
          updatedAt: p.updatedAt || new Date().toISOString()
        }))
        
        // Only replace products if we got actual products from AWS
        if (mappedProducts.length > 0) {
          products = mappedProducts
          console.log(`✅ Loaded ${products.length} products from AWS with proper mapping`)
        } else {
          console.log('⚠️ No products returned from AWS, keeping file products')
        }
      } else {
        console.log('⚠️ No products returned from AWS, keeping file products')
      }
    } else {
      console.log('⚠️ Could not load from AWS, keeping file products')
    }
  } catch (error) {
    console.log('⚠️ AWS not available, keeping file products:', error)
  }
  
  isInitialized = true
}

// Generate unique ID
function generateId(): string {
  return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Get all products
export async function getAllProducts(): Promise<SimpleProduct[]> {
  // Always try to load from file first
  const loaded = loadProductsFromFile()
  if (!loaded) {
    console.log('📦 No products found in file, products array is empty')
    // Don't add any demo products - keep array empty
  }
  
  await initializeFromAWS()
  console.log(`📦 Retrieved ${products.length} products from memory`)
  console.log('📦 Products in memory:', products.map(p => ({ 
    id: p.id, 
    name: p.name, 
    category: p.category, 
    subcategory: p.subcategory 
  })))
  return [...products]
}

// Add product
export function addProduct(productData: Omit<SimpleProduct, 'id' | 'createdAt' | 'updatedAt'>): SimpleProduct {
  const newProduct: SimpleProduct = {
    name: productData.name || '',
    description: productData.description || '',
    price: productData.price || 0,
    originalPrice: productData.originalPrice,
    category: productData.category || 'general',
    subcategory: productData.subcategory,
    images: Array.isArray(productData.images) ? productData.images : [],
    sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
    colors: Array.isArray(productData.colors) ? productData.colors : [],
    inStock: productData.inStock !== false,
    isActive: productData.isActive !== false, // Default to true (active)
    stockQuantity: productData.stockQuantity || 1,
    featured: productData.featured === true,
    tags: Array.isArray(productData.tags) ? productData.tags : [],
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  products.push(newProduct)
  console.log(`✅ Added product to memory: ${newProduct.name} (ID: ${newProduct.id})`)
  console.log(`📊 Total products in memory: ${products.length}`)
  
  // Save to file
  saveProductsToFile()
  
  return newProduct
}

// Update product
export function updateProduct(id: string, updates: Partial<Omit<SimpleProduct, 'id' | 'createdAt'>>): SimpleProduct | null {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) {
    throw new Error('Product not found')
  }
  
  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  console.log(`✅ Updated product in memory: ${products[index].name} (ID: ${id})`)
  
  // Save to file
  saveProductsToFile()
  
  return products[index]
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {
  await initializeFromAWS() // Ensure we have latest data
  const index = products.findIndex(p => p.id === id)
  if (index === -1) {
    throw new Error('Product not found')
  }
  
  const deletedProduct = products[index]
  products.splice(index, 1)
  console.log(`✅ Deleted product from memory: ${deletedProduct.name} (ID: ${id})`)
  console.log(`📊 Total products remaining: ${products.length}`)
  
  // Save to file
  saveProductsToFile()
}

// Get product by ID
export function getProductById(id: string): SimpleProduct | null {
  return products.find(p => p.id === id) || null
}

// Search products
export async function searchProducts(query: string): Promise<SimpleProduct[]> {
  await initializeFromAWS()
  const searchTerm = query.toLowerCase()
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<SimpleProduct[]> {
  await initializeFromAWS()
  return products.filter(p => p.category.toLowerCase() === category.toLowerCase())
}

// Get featured products
export function getFeaturedProducts(): SimpleProduct[] {
  return products.filter(p => p.featured === true)
}

// Get product stats
export function getProductStats() {
  return {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length,
    inStock: products.filter(p => p.inStock).length,
    outOfStock: products.filter(p => !p.inStock).length,
    featured: products.filter(p => p.featured).length,
    categories: [...new Set(products.map(p => p.category))].length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0)
  }
}
