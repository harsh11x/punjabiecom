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

// In-memory storage (will reset on each deployment)
let products: SimpleProduct[] = [
  // Sample product to prevent empty state
  {
    id: 'sample_1',
    name: 'Traditional Punjabi Jutti',
    description: 'Handcrafted leather jutti with traditional embroidery',
    price: 1500,
    originalPrice: 2000,
    category: 'men',
    subcategory: 'traditional',
    images: ['/placeholder.jpg'],
    sizes: ['7', '8', '9', '10'],
    colors: ['Brown', 'Black'],
    inStock: true,
    isActive: true,
    stockQuantity: 10,
    featured: true,
    tags: ['traditional', 'handmade'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Save products to file
function saveProductsToFile() {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2))
    console.log(`💾 Saved ${products.length} products to file`)
  } catch (error) {
    console.error('❌ Failed to save products to file:', error)
  }
}

// Load products from file
function loadProductsFromFile() {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf8')
      const fileProducts = JSON.parse(data)
      if (Array.isArray(fileProducts) && fileProducts.length > 0) {
        products.splice(0, products.length, ...fileProducts)
        console.log(`📁 Loaded ${products.length} products from file`)
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
      console.log('⚠️ AWS environment variables not set, skipping AWS sync')
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
        // Only replace products if we got actual products from AWS
        products = data.products.map((p: any) => ({
          ...p,
          id: p.id || p._id || generateId()
        }))
        console.log(`✅ Loaded ${products.length} products from AWS`)
      } else {
        console.log('⚠️ No products returned from AWS, keeping demo products')
      }
    } else {
      console.log('⚠️ Could not load from AWS, keeping demo products')
    }
  } catch (error) {
    console.log('⚠️ AWS not available, keeping demo products:', error)
  }
  
  // Ensure we always have at least demo products
  if (products.length === 0) {
    console.log('🔄 No products found, ensuring demo products are available')
    // Demo products should already be in the array from initialization
  }
  
  isInitialized = true
}

// Generate unique ID
function generateId(): string {
  return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Get all products
export async function getAllProducts(): Promise<SimpleProduct[]> {
  // First try to load from file if not already loaded
  if (products.length === 0) {
    loadProductsFromFile()
  }
  
  await initializeFromAWS()
  console.log(`📦 Retrieved ${products.length} products from memory`)
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
