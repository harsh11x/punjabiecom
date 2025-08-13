const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

const ProductSchema = new mongoose.Schema({
  name: String,
  punjabiName: String,
  description: String,
  punjabiDescription: String,
  price: Number,
  originalPrice: Number,
  category: String,
  subcategory: String,
  images: [String],
  colors: [String],
  sizes: [String],
  stock: Number,
  rating: Number,
  reviews: Number,
  badge: String,
  badgeEn: String,
  isActive: Boolean
}, {
  timestamps: true
})

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

async function clearProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    // Delete all products
    const result = await Product.deleteMany({})
    console.log(`✅ Deleted ${result.deletedCount} products from database`)
    
    console.log('✅ Database cleared successfully')
  } catch (error) {
    console.error('❌ Error clearing products:', error)
  } finally {
    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
  }
}

clearProducts()
