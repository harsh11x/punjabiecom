// Simple in-memory product storage for Vercel serverless functions
// In production, you'd use a database like MongoDB or PostgreSQL

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
let products: SimpleProduct[] = []

// Generate unique ID
function generateId(): string {
  return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Get all products
export function getAllProducts(): SimpleProduct[] {
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
  return products[index]
}

// Delete product
export function deleteProduct(id: string): void {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) {
    throw new Error('Product not found')
  }
  
  const deletedProduct = products[index]
  products.splice(index, 1)
  console.log(`✅ Deleted product from memory: ${deletedProduct.name} (ID: ${id})`)
}

// Get product by ID
export function getProductById(id: string): SimpleProduct | null {
  return products.find(p => p.id === id) || null
}

// Search products
export function searchProducts(query: string): SimpleProduct[] {
  const searchTerm = query.toLowerCase()
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}

// Get products by category
export function getProductsByCategory(category: string): SimpleProduct[] {
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
