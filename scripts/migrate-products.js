#!/usr/bin/env node

/**
 * Migration script to move products from JSON file to MongoDB
 * Usage: node scripts/migrate-products.js
 */

const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

// Product Schema (same as in models/Product.ts)
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  punjabiName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  punjabiDescription: {
    type: String,
    required: true,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['men', 'women', 'kids', 'phulkari']
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    required: true
  }],
  colors: [{
    type: String,
    required: true
  }],
  sizes: [{
    type: String,
    required: true
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0
  },
  badge: {
    type: String,
    trim: true
  },
  badgeEn: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const Product = mongoose.model('Product', ProductSchema)

async function migrateProducts() {
  try {
    console.log('🚀 Starting product migration...')
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment variables')
    }
    
    console.log('📡 Connecting to MongoDB...')
    await mongoose.connect(mongoUri, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      family: 4,
      authSource: 'admin'
    })
    console.log('✅ Connected to MongoDB')
    
    // Read products from JSON file
    const productsFilePath = path.join(process.cwd(), 'data', 'products.json')
    if (!fs.existsSync(productsFilePath)) {
      console.log('❌ Products file not found:', productsFilePath)
      return
    }
    
    const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'))
    console.log(`📦 Found ${productsData.length} products in JSON file`)
    
    // Check existing products in MongoDB
    const existingProducts = await Product.find({})
    console.log(`🗄️  Found ${existingProducts.length} existing products in MongoDB`)
    
    // Clear existing products (optional - comment out if you want to keep them)
    if (existingProducts.length > 0) {
      console.log('🧹 Clearing existing products...')
      await Product.deleteMany({})
      console.log('✅ Cleared existing products')
    }
    
    // Migrate products
    let migratedCount = 0
    let errorCount = 0
    
    for (const productData of productsData) {
      try {
        // Transform the data to match MongoDB schema
        const transformedProduct = {
          name: productData.name,
          punjabiName: productData.punjabiName || productData.name,
          description: productData.description,
          punjabiDescription: productData.punjabiDescription || productData.description,
          price: productData.price,
          originalPrice: productData.originalPrice || productData.price,
          category: productData.category,
          subcategory: productData.subcategory || (productData.category === 'phulkari' ? '' : 'jutti'),
          images: productData.images || ['/placeholder.svg'],
          colors: productData.colors || ['Default'],
          sizes: productData.sizes || ['One Size'],
          stock: productData.stock || 0,
          rating: productData.rating || 4.5,
          reviews: productData.reviews || 0,
          badge: productData.badge || '',
          badgeEn: productData.badgeEn || '',
          isActive: productData.isActive !== false
        }
        
        const product = new Product(transformedProduct)
        await product.save()
        migratedCount++
        console.log(`✅ Migrated: ${product.name}`)
        
      } catch (error) {
        errorCount++
        console.error(`❌ Error migrating product ${productData.name}:`, error.message)
      }
    }
    
    console.log('\n🎉 Migration completed!')
    console.log(`✅ Successfully migrated: ${migratedCount} products`)
    console.log(`❌ Errors: ${errorCount} products`)
    
    // Verify migration
    const finalCount = await Product.countDocuments()
    console.log(`🔍 Final product count in MongoDB: ${finalCount}`)
    
  } catch (error) {
    console.error('💥 Migration failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('👋 Disconnected from MongoDB')
  }
}

// Run migration
migrateProducts()
