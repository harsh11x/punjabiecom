// Product utility functions for safe data access

interface Product {
  _id: string
  name: string
  punjabiName?: string
  price: number
  originalPrice: number
  images?: string[]
  colors?: string[]
  sizes?: string[]
  stock: number
  rating: number
  reviews: number
  badge?: string
  category?: string
  subcategory?: string
}

interface CartItem {
  productId: string
  name: string
  punjabiName: string
  price: number
  image: string
  size: string
  color: string
  stock: number
}

/**
 * Validates if a product object has all required fields
 */
export function isValidProduct(product: any): product is Product {
  if (!product || typeof product !== 'object') {
    return false
  }

  const requiredFields = ['_id', 'name', 'price', 'stock']
  const requiredCheck = requiredFields.every(field => product[field] !== undefined && product[field] !== null)
  
  // Ensure rating and reviews are numbers (default to 0 if missing)
  if (product.rating === undefined || product.rating === null) {
    product.rating = 0
  }
  if (product.reviews === undefined || product.reviews === null) {
    product.reviews = 0
  }
  
  return requiredCheck
}

/**
 * Safely gets the primary image for a product
 */
export function getProductImage(product: Product): string {
  if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
    return '/placeholder.svg'
  }
  return product.images[0] || '/placeholder.svg'
}

/**
 * Safely gets the first available size for a product
 */
export function getProductSize(product: Product): string {
  if (!product.sizes || !Array.isArray(product.sizes) || product.sizes.length === 0) {
    return ''
  }
  return product.sizes[0] || ''
}

/**
 * Safely gets the first available color for a product
 */
export function getProductColor(product: Product): string {
  if (!product.colors || !Array.isArray(product.colors) || product.colors.length === 0) {
    return ''
  }
  return product.colors[0] || ''
}

/**
 * Creates a cart item from product data with validation
 */
export function createCartItem(product: Product, selectedSize?: string, selectedColor?: string): CartItem {
  if (!isValidProduct(product)) {
    throw new Error('Invalid product data')
  }

  const size = selectedSize || getProductSize(product)
  const color = selectedColor || getProductColor(product)

  if (!size && product.sizes && product.sizes.length > 0) {
    throw new Error('Please select a size')
  }

  if (!color && product.colors && product.colors.length > 0) {
    throw new Error('Please select a color')
  }

  return {
    productId: product._id,
    name: product.name,
    punjabiName: product.punjabiName || product.name,
    price: product.price,
    image: getProductImage(product),
    size: size,
    color: color,
    stock: product.stock
  }
}

/**
 * Safely gets product rating as a number between 0-5
 */
export function getProductRating(product: Product): number {
  if (!product.rating || typeof product.rating !== 'number') {
    return 0
  }
  return Math.max(0, Math.min(5, product.rating))
}

/**
 * Safely gets product reviews count
 */
export function getProductReviews(product: Product): number {
  if (!product.reviews || typeof product.reviews !== 'number') {
    return 0
  }
  return Math.max(0, product.reviews)
}

/**
 * Checks if product has variants (sizes and colors)
 */
export function hasProductVariants(product: Product): boolean {
  const hasSizes = !!(product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0)
  const hasColors = !!(product.colors && Array.isArray(product.colors) && product.colors.length > 0)
  return hasSizes || hasColors
}

/**
 * Checks if product is in stock
 */
export function isProductInStock(product: Product): boolean {
  return product.stock > 0
}

/**
 * Calculates discount percentage
 */
export function getDiscountPercentage(product: Product): number {
  if (!product.originalPrice || product.originalPrice <= product.price) {
    return 0
  }
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
}

/**
 * Gets discount amount
 */
export function getDiscountAmount(product: Product): number {
  if (!product.originalPrice || product.originalPrice <= product.price) {
    return 0
  }
  return product.originalPrice - product.price
}

/**
 * Formats price with Indian currency formatting
 */
export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`
}

/**
 * Gets available sizes for display (limited to first few)
 */
export function getDisplaySizes(product: Product, limit: number = 3): string[] {
  if (!product.sizes || !Array.isArray(product.sizes)) {
    return []
  }
  return product.sizes.slice(0, limit)
}

/**
 * Gets available colors for display (limited to first few)
 */
export function getDisplayColors(product: Product, limit: number = 3): string[] {
  if (!product.colors || !Array.isArray(product.colors)) {
    return []
  }
  return product.colors.slice(0, limit)
}