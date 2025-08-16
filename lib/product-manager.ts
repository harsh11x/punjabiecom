import fs from 'fs/promises'
import path from 'path'

// Product interface
export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  images: string[]
  sizes?: string[]
  colors?: string[]
  inStock: boolean
  stockQuantity: number
  featured?: boolean
  tags?: string[]
  createdAt: string
  updatedAt: string
}

// File paths
const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json')
const DATA_DIR = path.join(process.cwd(), 'data')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Initialize empty products file if it doesn't exist
async function initializeProductsFile() {
  try {
    await fs.access(PRODUCTS_FILE)
  } catch {
    await ensureDataDir()
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify([], null, 2))
    console.log('✅ Initialized empty products.json file')
  }
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  try {
    await initializeProductsFile()
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8')
    const products = JSON.parse(data)
    console.log(`📦 Retrieved ${products.length} products from storage`)
    return products
  } catch (error) {
    console.error('❌ Error reading products:', error)
    return []
  }
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const products = await getAllProducts()
    const product = products.find(p => p.id === id)
    return product || null
  } catch (error) {
    console.error('❌ Error getting product by ID:', error)
    return null
  }
}

// Add new product
export async function addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  try {
    const products = await getAllProducts()
    
    const newProduct: Product = {
      ...productData,
      id: generateProductId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    products.push(newProduct)
    await saveProducts(products)
    
    console.log(`✅ Added new product: ${newProduct.name} (ID: ${newProduct.id})`)
    return newProduct
  } catch (error) {
    console.error('❌ Error adding product:', error)
    throw new Error('Failed to add product')
  }
}

// Update existing product
export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product> {
  try {
    const products = await getAllProducts()
    const productIndex = products.findIndex(p => p.id === id)
    
    if (productIndex === -1) {
      throw new Error('Product not found')
    }
    
    const updatedProduct: Product = {
      ...products[productIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    products[productIndex] = updatedProduct
    await saveProducts(products)
    
    console.log(`✅ Updated product: ${updatedProduct.name} (ID: ${id})`)
    return updatedProduct
  } catch (error) {
    console.error('❌ Error updating product:', error)
    throw new Error('Failed to update product')
  }
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {
  try {
    const products = await getAllProducts()
    const productIndex = products.findIndex(p => p.id === id)
    
    if (productIndex === -1) {
      throw new Error('Product not found')
    }
    
    const deletedProduct = products[productIndex]
    products.splice(productIndex, 1)
    await saveProducts(products)
    
    console.log(`✅ Deleted product: ${deletedProduct.name} (ID: ${id})`)
  } catch (error) {
    console.error('❌ Error deleting product:', error)
    throw new Error('Failed to delete product')
  }
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const products = await getAllProducts()
    return products.filter(p => p.category.toLowerCase() === category.toLowerCase())
  } catch (error) {
    console.error('❌ Error getting products by category:', error)
    return []
  }
}

// Get featured products
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await getAllProducts()
    return products.filter(p => p.featured === true)
  } catch (error) {
    console.error('❌ Error getting featured products:', error)
    return []
  }
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const products = await getAllProducts()
    const searchTerm = query.toLowerCase()
    
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  } catch (error) {
    console.error('❌ Error searching products:', error)
    return []
  }
}

// Save products to file
async function saveProducts(products: Product[]): Promise<void> {
  try {
    await ensureDataDir()
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2))
  } catch (error) {
    console.error('❌ Error saving products:', error)
    throw new Error('Failed to save products')
  }
}

// Generate unique product ID
function generateProductId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `prod_${timestamp}_${random}`
}

// Get product statistics
export async function getProductStats() {
  try {
    const products = await getAllProducts()
    
    const stats = {
      total: products.length,
      inStock: products.filter(p => p.inStock).length,
      outOfStock: products.filter(p => !p.inStock).length,
      featured: products.filter(p => p.featured).length,
      categories: [...new Set(products.map(p => p.category))].length,
      totalValue: products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0)
    }
    
    return stats
  } catch (error) {
    console.error('❌ Error getting product stats:', error)
    return {
      total: 0,
      inStock: 0,
      outOfStock: 0,
      featured: 0,
      categories: 0,
      totalValue: 0
    }
  }
}

// Bulk import products
export async function bulkImportProducts(products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Product[]> {
  try {
    const existingProducts = await getAllProducts()
    const newProducts: Product[] = []
    
    for (const productData of products) {
      const newProduct: Product = {
        ...productData,
        id: generateProductId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      newProducts.push(newProduct)
    }
    
    const allProducts = [...existingProducts, ...newProducts]
    await saveProducts(allProducts)
    
    console.log(`✅ Bulk imported ${newProducts.length} products`)
    return newProducts
  } catch (error) {
    console.error('❌ Error bulk importing products:', error)
    throw new Error('Failed to bulk import products')
  }
}

// Clear all products (for fresh start)
export async function clearAllProducts(): Promise<void> {
  try {
    await saveProducts([])
    console.log('✅ Cleared all products - fresh start!')
  } catch (error) {
    console.error('❌ Error clearing products:', error)
    throw new Error('Failed to clear products')
  }
}
