const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/punjabi-heritage'

// Admin Schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'admin', 'manager'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true })

AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  punjabiName: { type: String, required: true },
  description: { type: String, required: true },
  punjabiDescription: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  category: { type: String, enum: ['men', 'women', 'kids', 'phulkari'], required: true },
  subcategory: String,
  images: [{ type: String, required: true }],
  colors: [{ type: String, required: true }],
  sizes: [{ type: String, required: true }],
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  badge: String,
  badgeEn: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

// Sample data
const sampleProducts = [
  // Women's Products
  {
    name: "Bridal Gold Jutti",
    punjabiName: "ਦੁਲਹਨ ਸੋਨੇ ਦੀ ਜੁੱਤੀ",
    description: "Exquisite handcrafted bridal jutti with intricate gold embroidery and traditional Punjabi designs. Perfect for weddings and special occasions.",
    punjabiDescription: "ਸੋਨੇ ਦੀ ਕਢਾਈ ਨਾਲ ਸਜਾਈ ਗਈ ਸੁੰਦਰ ਦੁਲਹਨ ਜੁੱਤੀ। ਵਿਆਹ ਅਤੇ ਖਾਸ ਮੌਕਿਆਂ ਲਈ ਸੰਪੂਰਨ।",
    price: 3299,
    originalPrice: 4199,
    category: "women",
    images: ["/womens-bridal-jutti-gold.png"],
    colors: ["Gold", "Red", "Pink"],
    sizes: ["5", "6", "7", "8", "9"],
    stock: 25,
    rating: 4.9,
    reviews: 89,
    badge: "ਦੁਲਹਨ ਸਪੈਸ਼ਲ",
    badgeEn: "Bridal Special"
  },
  {
    name: "Embroidered Jutti",
    punjabiName: "ਕਢਾਈ ਵਾਲੀ ਜੁੱਤੀ",
    description: "Beautiful embroidered jutti with traditional Punjabi motifs. Comfortable and stylish for daily wear.",
    punjabiDescription: "ਪਰੰਪਰਾਗਤ ਪੰਜਾਬੀ ਨਕਸ਼ਿਆਂ ਨਾਲ ਸਜਾਈ ਗਈ ਸੁੰਦਰ ਕਢਾਈ ਵਾਲੀ ਜੁੱਤੀ।",
    price: 2899,
    originalPrice: 3699,
    category: "women",
    images: ["/womens-embroidered-jutti.png"],
    colors: ["Red", "Green", "Blue"],
    sizes: ["5", "6", "7", "8", "9"],
    stock: 40,
    rating: 4.8,
    reviews: 167,
    badge: "ਸਭ ਤੋਂ ਵਧੀਆ",
    badgeEn: "Best Seller"
  },
  // Men's Products
  {
    name: "Traditional Leather Jutti",
    punjabiName: "ਪਰੰਪਰਾਗਤ ਚਮੜੇ ਦੀ ਜੁੱਤੀ",
    description: "Handcrafted leather jutti for men with traditional Punjabi styling. Durable and comfortable for all occasions.",
    punjabiDescription: "ਮਰਦਾਂ ਲਈ ਹੱਥ ਨਾਲ ਬਣਾਈ ਗਈ ਚਮੜੇ ਦੀ ਜੁੱਤੀ। ਸਾਰੇ ਮੌਕਿਆਂ ਲਈ ਟਿਕਾਊ ਅਤੇ ਆਰਾਮਦਾਇਕ।",
    price: 2599,
    originalPrice: 3299,
    category: "men",
    images: ["/mens-punjabi-jutti-leather-brown-traditional.png"],
    colors: ["Brown", "Black", "Tan"],
    sizes: ["6", "7", "8", "9", "10", "11"],
    stock: 35,
    rating: 4.7,
    reviews: 134,
    badge: "ਪਰੰਪਰਾਗਤ",
    badgeEn: "Traditional"
  },
  {
    name: "Traditional Khussa",
    punjabiName: "ਪਰੰਪਰਾਗਤ ਖੁੱਸਾ",
    description: "Classic Punjabi khussa with pointed toe design. Perfect for traditional wear and cultural events.",
    punjabiDescription: "ਨੁਕੀਲੇ ਪੰਜੇ ਵਾਲਾ ਕਲਾਸਿਕ ਪੰਜਾਬੀ ਖੁੱਸਾ। ਪਰੰਪਰਾਗਤ ਪਹਿਰਾਵੇ ਅਤੇ ਸੱਭਿਆਚਾਰਕ ਸਮਾਗਮਾਂ ਲਈ ਸੰਪੂਰਨ।",
    price: 2299,
    originalPrice: 2999,
    category: "men",
    images: ["/mens-traditional-khussa.png"],
    colors: ["Maroon", "Navy", "Black"],
    sizes: ["6", "7", "8", "9", "10", "11"],
    stock: 30,
    rating: 4.6,
    reviews: 98,
    badge: "ਨਵਾਂ",
    badgeEn: "New"
  },
  // Kids Products
  {
    name: "Colorful Kids Jutti",
    punjabiName: "ਰੰਗ-ਬਿਰੰਗੀ ਬੱਚਿਆਂ ਦੀ ਜੁੱਤੀ",
    description: "Vibrant and comfortable jutti designed specially for kids. Soft sole and colorful designs.",
    punjabiDescription: "ਬੱਚਿਆਂ ਲਈ ਵਿਸ਼ੇਸ਼ ਤੌਰ 'ਤੇ ਤਿਆਰ ਕੀਤੀ ਗਈ ਚਮਕਦਾਰ ਅਤੇ ਆਰਾਮਦਾਇਕ ਜੁੱਤੀ।",
    price: 1599,
    originalPrice: 1999,
    category: "kids",
    images: ["/colorful-kids-jutti.png"],
    colors: ["Pink", "Blue", "Yellow", "Green"],
    sizes: ["1", "2", "3", "4", "5"],
    stock: 50,
    rating: 4.8,
    reviews: 76,
    badge: "ਬੱਚਿਆਂ ਦੀ ਪਸੰਦ",
    badgeEn: "Kids Favorite"
  },
  // Phulkari Products
  {
    name: "Traditional Phulkari Dupatta",
    punjabiName: "ਪਰੰਪਰਾਗਤ ਫੁਲਕਾਰੀ ਦੁਪੱਟਾ",
    description: "Authentic handwoven phulkari dupatta with traditional embroidery. A masterpiece of Punjabi craftsmanship.",
    punjabiDescription: "ਪਰੰਪਰਾਗਤ ਕਢਾਈ ਨਾਲ ਅਸਲੀ ਹੱਥ ਨਾਲ ਬੁਣਿਆ ਫੁਲਕਾਰੀ ਦੁਪੱਟਾ। ਪੰਜਾਬੀ ਕਾਰੀਗਰੀ ਦਾ ਸ਼ਾਹਕਾਰ।",
    price: 4599,
    originalPrice: 5999,
    category: "phulkari",
    images: ["/punjabi-phulkari-dupatta.png"],
    colors: ["Red", "Orange", "Pink", "Yellow"],
    sizes: ["Standard"],
    stock: 20,
    rating: 4.9,
    reviews: 45,
    badge: "ਹੱਥ ਨਾਲ ਬਣਿਆ",
    badgeEn: "Handmade"
  },
  {
    name: "Bridal Phulkari Dupatta",
    punjabiName: "ਦੁਲਹਨ ਫੁਲਕਾਰੀ ਦੁਪੱਟਾ",
    description: "Exquisite bridal phulkari dupatta with intricate golden thread work. Perfect for wedding ceremonies.",
    punjabiDescription: "ਸੋਨੇ ਦੇ ਧਾਗੇ ਨਾਲ ਬਣਿਆ ਸ਼ਾਨਦਾਰ ਦੁਲਹਨ ਫੁਲਕਾਰੀ ਦੁਪੱਟਾ। ਵਿਆਹ ਦੇ ਸਮਾਗਮਾਂ ਲਈ ਸੰਪੂਰਨ।",
    price: 7999,
    originalPrice: 9999,
    category: "phulkari",
    images: ["/bridal-phulkari-dupatta.png"],
    colors: ["Red", "Maroon", "Pink"],
    sizes: ["Standard"],
    stock: 15,
    rating: 5.0,
    reviews: 23,
    badge: "ਦੁਲਹਨ ਸਪੈਸ਼ਲ",
    badgeEn: "Bridal Special"
  }
]

const sampleAdmin = {
  username: 'admin',
  email: 'admin@punjabheritage.com',
  password: 'admin123', // This will be hashed automatically
  role: 'super_admin'
}

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    console.log('Clearing existing data...')
    await Admin.deleteMany({})
    await Product.deleteMany({})

    // Create admin user
    console.log('Creating admin user...')
    const admin = new Admin(sampleAdmin)
    await admin.save()
    console.log('Admin user created:', admin.email)

    // Create products
    console.log('Creating sample products...')
    for (const productData of sampleProducts) {
      const product = new Product(productData)
      await product.save()
      console.log('Product created:', product.name)
    }

    console.log('Database seeded successfully!')
    console.log('\nAdmin Login Credentials:')
    console.log('Email: admin@punjabheritage.com')
    console.log('Password: admin123')
    console.log('\nTotal Products Created:', sampleProducts.length)

  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the seed function
seedDatabase()