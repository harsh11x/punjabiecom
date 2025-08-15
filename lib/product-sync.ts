import { connectDB } from './mongodb'
import Product from '@/models/Product'
import { getProducts, saveProducts } from './storage'
import fs from 'fs'
import path from 'path'

/**
 * Hybrid product management system that syncs between MongoDB and file storage
 * This ensures products are available even if MongoDB connection fails
 */

export interface ProductData {
  _id?: string
  id?: string
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

/**
 * Get all products from both MongoDB and file storage
 */
export async function getAllProducts(): Promise<ProductData[]> {
  let mongoProducts: ProductData[] = []
  let fileProducts: ProductData[] = []

  // Try to get products from MongoDB first
  try {
    await connectDB()
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 }).lean()
    mongoProducts = products.map((product: any) => ({
      ...product,
      _id: product._id.toString(),
      id: product._id.toString()
    }))
    console.log(`✅ Loaded ${mongoProducts.length} products from MongoDB`)
  } catch (error) {
    console.warn('⚠️ MongoDB not available, falling back to file storage:', error)
  }

  // Get products from file storage as backup
  try {
    fileProducts = await getProducts()
    console.log(`📁 Loaded ${fileProducts.length} products from file storage`)
  } catch (error) {
    console.warn('⚠️ File storage not available:', error)
  }

  // If MongoDB has products, use those; otherwise use file products
  if (mongoProducts.length > 0) {
    // Sync file storage with MongoDB data
    try {
      await saveProducts(mongoProducts)
      console.log('🔄 Synced MongoDB products to file storage')
    } catch (error) {
      console.warn('⚠️ Failed to sync to file storage:', error)
    }
    return mongoProducts
  } else if (fileProducts.length > 0) {
    // Try to sync file products to MongoDB
    try {
      await syncFileProductsToMongoDB(fileProducts)
      console.log('🔄 Synced file products to MongoDB')
      return fileProducts
    } catch (error) {
      console.warn('⚠️ Failed to sync to MongoDB:', error)
      return fileProducts
    }
  }

  return []
}

/**
 * Add a new product to both MongoDB and file storage
 */
export async function addProduct(productData: Omit<ProductData, '_id' | 'id'>): Promise<ProductData> {
  let savedProduct: ProductData | null = null

  // Try to save to MongoDB first
  try {
    await connectDB()
    const product = new Product({
      ...productData,
      punjabiDescription: productData.punjabiDescription || productData.description,
      rating: productData.rating || 4.5,
      reviews: productData.reviews || 0
    })
    
    const mongoProduct = await product.save()
    savedProduct = {
      ...mongoProduct.toObject(),
      _id: mongoProduct._id.toString(),
      id: mongoProduct._id.toString()
    }
    console.log('✅ Product saved to MongoDB:', savedProduct?.name)
  } catch (error) {
    console.warn('⚠️ Failed to save to MongoDB:', error)
  }

  // Save to file storage as backup
  try {
    const fileProducts = await getProducts()
    const newProduct: ProductData = savedProduct || {
      id: Date.now().toString(),
      ...productData,
      punjabiDescription: productData.punjabiDescription || productData.description,
      rating: productData.rating || 4.5,
      reviews: productData.reviews || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    fileProducts.push(newProduct)
    await saveProducts(fileProducts)
    console.log('✅ Product saved to file storage:', newProduct.name)
    
    return savedProduct || newProduct
  } catch (error) {
    console.error('❌ Failed to save to file storage:', error)
    if (savedProduct) {
      return savedProduct
    }
    throw new Error('Failed to save product to any storage')
  }
}

/**
 * Update a product in both MongoDB and file storage
 */
export async function updateProduct(productId: string, updateData: Partial<ProductData>): Promise<ProductData> {
  let updatedProduct: ProductData | null = null

  // Try to update in MongoDB first
  try {
    await connectDB()
    const product = await Product.findByIdAndUpdate(
      productId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean()
    
    if (product) {
      updatedProduct = {
        ...(product as any),
        _id: (product as any)._id.toString(),
        id: (product as any)._id.toString()
      }
      console.log('✅ Product updated in MongoDB:', updatedProduct?.name)
    }
  } catch (error) {
    console.warn('⚠️ Failed to update in MongoDB:', error)
  }

  // Update in file storage
  try {
    const fileProducts = await getProducts()
    const productIndex = fileProducts.findIndex(p => p.id === productId || p._id === productId)
    
    if (productIndex !== -1) {
      fileProducts[productIndex] = {
        ...fileProducts[productIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      }
      await saveProducts(fileProducts)
      console.log('✅ Product updated in file storage')
      
      return updatedProduct || fileProducts[productIndex]
    }
  } catch (error) {
    console.warn('⚠️ Failed to update in file storage:', error)
  }

  if (updatedProduct) {
    return updatedProduct
  }
  
  throw new Error('Product not found or failed to update')
}

/**
 * Delete a product from both MongoDB and file storage
 */
export async function deleteProduct(productId: string): Promise<void> {
  // Try to delete from MongoDB
  try {
    await connectDB()
    await Product.findByIdAndDelete(productId)
    console.log('✅ Product deleted from MongoDB')
  } catch (error) {
    console.warn('⚠️ Failed to delete from MongoDB:', error)
  }

  // Delete from file storage
  try {
    const fileProducts = await getProducts()
    const filteredProducts = fileProducts.filter(p => p.id !== productId && p._id !== productId)
    await saveProducts(filteredProducts)
    console.log('✅ Product deleted from file storage')
  } catch (error) {
    console.warn('⚠️ Failed to delete from file storage:', error)
  }
}

/**
 * Sync file products to MongoDB
 */
async function syncFileProductsToMongoDB(fileProducts: ProductData[]): Promise<void> {
  await connectDB()
  
  for (const productData of fileProducts) {
    try {
      // Check if product already exists
      const existingProduct = await Product.findOne({
        $or: [
          { name: productData.name },
          { _id: productData._id || productData.id }
        ]
      })
      
      if (!existingProduct) {
        const product = new Product({
          ...productData,
          punjabiDescription: productData.punjabiDescription || productData.description,
          rating: productData.rating || 4.5,
          reviews: productData.reviews || 0
        })
        await product.save()
        console.log('✅ Synced product to MongoDB:', product.name)
      }
    } catch (error) {
      console.warn('⚠️ Failed to sync product:', productData.name, error)
    }
  }
}

/**
 * Force sync between MongoDB and file storage
 */
export async function forceSyncProducts(): Promise<{ mongoCount: number; fileCount: number; synced: boolean }> {
  let mongoProducts: ProductData[] = []
  let fileProducts: ProductData[] = []
  let synced = false

  try {
    await connectDB()
    const products = await Product.find({}).sort({ createdAt: -1 }).lean()
    mongoProducts = products.map((product: any) => ({
      ...product,
      _id: product._id.toString(),
      id: product._id.toString()
    }))
  } catch (error) {
    console.warn('MongoDB not available for sync')
  }

  try {
    fileProducts = await getProducts()
  } catch (error) {
    console.warn('File storage not available for sync')
  }

  // If MongoDB has more recent data, sync to file
  if (mongoProducts.length >= fileProducts.length) {
    try {
      await saveProducts(mongoProducts)
      synced = true
      console.log('✅ Synced MongoDB to file storage')
    } catch (error) {
      console.warn('Failed to sync MongoDB to file storage')
    }
  }
  // If file has more data, sync to MongoDB
  else if (fileProducts.length > mongoProducts.length) {
    try {
      await syncFileProductsToMongoDB(fileProducts)
      synced = true
      console.log('✅ Synced file storage to MongoDB')
    } catch (error) {
      console.warn('Failed to sync file storage to MongoDB')
    }
  }

  return {
    mongoCount: mongoProducts.length,
    fileCount: fileProducts.length,
    synced
  }
}
