const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  punjabiName: {
    type: String,
    required: [true, 'Punjabi name is required'],
    trim: true,
    maxlength: [100, 'Punjabi name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  punjabiDescription: {
    type: String,
    required: [true, 'Punjabi description is required'],
    maxlength: [1000, 'Punjabi description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    required: [true, 'Original price is required'],
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
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
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: {
    type: Number,
    default: 0,
    min: [0, 'Reviews count cannot be negative']
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

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

const sampleProducts = [
  // Men's Products
  {
    name: "Royal Punjabi Jutti",
    punjabiName: "ਸ਼ਾਹੀ ਪੰਜਾਬੀ ਜੁੱਤੀ",
    description: "Handcrafted traditional Punjabi jutti made with premium leather and intricate embroidery work.",
    punjabiDescription: "ਪ੍ਰੀਮੀਅਮ ਚਮੜੇ ਨਾਲ ਬਣੀ ਹੱਥ ਦੀ ਕਢਾਈ ਵਾਲੀ ਪਰੰਪਰਾਗਤ ਪੰਜਾਬੀ ਜੁੱਤੀ।",
    price: 2499,
    originalPrice: 3199,
    category: "men",
    subcategory: "jutti",
    images: ["/mens-punjabi-jutti-leather-brown-traditional.png"],
    colors: ["Brown", "Black", "Tan"],
    sizes: ["6", "7", "8", "9", "10", "11"],
    stock: 25,
    rating: 4.8,
    reviews: 124,
    badge: "ਸਭ ਤੋਂ ਵਧੀਆ",
    badgeEn: "Best Seller",
    isActive: true
  },
  {
    name: "Traditional Khussa",
    punjabiName: "ਪਰੰਪਰਾਗਤ ਖੁੱਸਾ",
    description: "Elegant traditional khussa with authentic Punjabi craftsmanship and comfortable fit.",
    punjabiDescription: "ਅਸਲੀ ਪੰਜਾਬੀ ਕਾਰੀਗਰੀ ਅਤੇ ਆਰਾਮਦਾਇਕ ਫਿੱਟ ਵਾਲਾ ਸੁੰਦਰ ਪਰੰਪਰਾਗਤ ਖੁੱਸਾ।",
    price: 2799,
    originalPrice: 3599,
    category: "men",
    subcategory: "jutti",
    images: ["/mens-traditional-khussa.png"],
    colors: ["Black", "Brown", "Maroon"],
    sizes: ["6", "7", "8", "9", "10", "11"],
    stock: 18,
    rating: 4.6,
    reviews: 203,
    badge: "ਨਵਾਂ",
    badgeEn: "New",
    isActive: true
  },
  {
    name: "Men's Punjabi Kurta",
    punjabiName: "ਮਰਦਾਂ ਦਾ ਪੰਜਾਬੀ ਕੁੜਤਾ",
    description: "Premium cotton kurta with traditional Punjabi design and comfortable fit for all occasions.",
    punjabiDescription: "ਸਾਰੇ ਮੌਕਿਆਂ ਲਈ ਪਰੰਪਰਾਗਤ ਪੰਜਾਬੀ ਡਿਜ਼ਾਈਨ ਅਤੇ ਆਰਾਮਦਾਇਕ ਫਿੱਟ ਵਾਲਾ ਪ੍ਰੀਮੀਅਮ ਕਪਾਹ ਕੁੜਤਾ।",
    price: 1899,
    originalPrice: 2499,
    category: "men",
    subcategory: "kurta",
    images: ["/placeholder.jpg"],
    colors: ["White", "Cream", "Light Blue"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 30,
    rating: 4.5,
    reviews: 89,
    badge: "ਪਸੰਦੀਦਾ",
    badgeEn: "Popular",
    isActive: true
  },

  // Women's Products
  {
    name: "Bridal Gold Jutti",
    punjabiName: "ਦੁਲਹਨ ਸੋਨੇ ਦੀ ਜੁੱਤੀ",
    description: "Exquisite bridal jutti with gold embroidery and traditional craftsmanship for special occasions.",
    punjabiDescription: "ਵਿਸ਼ੇਸ਼ ਮੌਕਿਆਂ ਲਈ ਸੋਨੇ ਦੀ ਕਢਾਈ ਅਤੇ ਪਰੰਪਰਾਗਤ ਕਾਰੀਗਰੀ ਵਾਲੀ ਸ਼ਾਨਦਾਰ ਦੁਲਹਨ ਜੁੱਤੀ।",
    price: 3299,
    originalPrice: 4199,
    category: "women",
    subcategory: "jutti",
    images: ["/womens-bridal-jutti-gold.png"],
    colors: ["Gold", "Red", "Pink"],
    sizes: ["5", "6", "7", "8", "9"],
    stock: 15,
    rating: 4.9,
    reviews: 89,
    badge: "ਦੁਲਹਨ ਸਪੈਸ਼ਲ",
    badgeEn: "Bridal Special",
    isActive: true
  },
  {
    name: "Embroidered Jutti",
    punjabiName: "ਕਢਾਈ ਵਾਲੀ ਜੁੱਤੀ",
    description: "Beautiful embroidered jutti with intricate threadwork and comfortable sole for daily wear.",
    punjabiDescription: "ਰੋਜ਼ਾਨਾ ਪਹਿਨਣ ਲਈ ਗੁੰਝਲਦਾਰ ਧਾਗੇ ਦਾ ਕੰਮ ਅਤੇ ਆਰਾਮਦਾਇਕ ਤਲੇ ਵਾਲੀ ਸੁੰਦਰ ਕਢਾਈ ਵਾਲੀ ਜੁੱਤੀ।",
    price: 2899,
    originalPrice: 3699,
    category: "women",
    subcategory: "jutti",
    images: ["/womens-embroidered-jutti.png"],
    colors: ["Red", "Green", "Blue"],
    sizes: ["5", "6", "7", "8", "9"],
    stock: 22,
    rating: 4.8,
    reviews: 167,
    badge: "ਸਭ ਤੋਂ ਵਧੀਆ",
    badgeEn: "Best Seller",
    isActive: true
  },
  {
    name: "Designer Punjabi Suit",
    punjabiName: "ਡਿਜ਼ਾਈਨਰ ਪੰਜਾਬੀ ਸੂਟ",
    description: "Elegant designer Punjabi suit with beautiful embroidery and premium fabric quality.",
    punjabiDescription: "ਸੁੰਦਰ ਕਢਾਈ ਅਤੇ ਪ੍ਰੀਮੀਅਮ ਫੈਬਰਿਕ ਗੁਣਵੱਤਾ ਵਾਲਾ ਸ਼ਾਨਦਾਰ ਡਿਜ਼ਾਈਨਰ ਪੰਜਾਬੀ ਸੂਟ।",
    price: 4599,
    originalPrice: 5999,
    category: "women",
    subcategory: "suit",
    images: ["/placeholder.jpg"],
    colors: ["Pink", "Blue", "Green"],
    sizes: ["S", "M", "L", "XL"],
    stock: 12,
    rating: 4.7,
    reviews: 78,
    badge: "ਨਵਾਂ",
    badgeEn: "New",
    isActive: true
  },

  // Kids Products
  {
    name: "Colorful Kids Jutti",
    punjabiName: "ਬੱਚਿਆਂ ਦੀ ਰੰਗੀਨ ਜੁੱਤੀ",
    description: "Vibrant and comfortable jutti designed specially for kids with soft sole and playful colors.",
    punjabiDescription: "ਨਰਮ ਤਲੇ ਅਤੇ ਖੇਡ ਭਰਪੂਰ ਰੰਗਾਂ ਨਾਲ ਬੱਚਿਆਂ ਲਈ ਵਿਸ਼ੇਸ਼ ਤੌਰ 'ਤੇ ਡਿਜ਼ਾਈਨ ਕੀਤੀ ਗਈ ਜੀਵੰਤ ਅਤੇ ਆਰਾਮਦਾਇਕ ਜੁੱਤੀ।",
    price: 1299,
    originalPrice: 1699,
    category: "kids",
    subcategory: "jutti",
    images: ["/colorful-kids-jutti.png"],
    colors: ["Multi", "Blue", "Pink"],
    sizes: ["1", "2", "3", "4", "5"],
    stock: 35,
    rating: 4.7,
    reviews: 156,
    badge: "ਸਭ ਤੋਂ ਵਧੀਆ",
    badgeEn: "Best Seller",
    isActive: true
  },
  {
    name: "Baby Soft Jutti",
    punjabiName: "ਬੇਬੀ ਨਰਮ ਜੁੱਤੀ",
    description: "Ultra-soft jutti for babies and toddlers with gentle materials and secure fit.",
    punjabiDescription: "ਨਰਮ ਸਮੱਗਰੀ ਅਤੇ ਸੁਰੱਖਿਤ ਫਿੱਟ ਨਾਲ ਬੱਚਿਆਂ ਅਤੇ ਛੋਟੇ ਬੱਚਿਆਂ ਲਈ ਅਤਿ-ਨਰਮ ਜੁੱਤੀ।",
    price: 999,
    originalPrice: 1299,
    category: "kids",
    subcategory: "jutti",
    images: ["/placeholder.jpg"],
    colors: ["Pink", "Blue", "Yellow"],
    sizes: ["0", "1", "2"],
    stock: 28,
    rating: 4.8,
    reviews: 89,
    badge: "ਨਵਾਂ",
    badgeEn: "New",
    isActive: true
  },
  {
    name: "Kids Punjabi Kurta",
    punjabiName: "ਬੱਚਿਆਂ ਦਾ ਪੰਜਾਬੀ ਕੁੜਤਾ",
    description: "Traditional Punjabi kurta for kids made with soft cotton and vibrant colors.",
    punjabiDescription: "ਨਰਮ ਕਪਾਹ ਅਤੇ ਜੀਵੰਤ ਰੰਗਾਂ ਨਾਲ ਬਣਿਆ ਬੱਚਿਆਂ ਲਈ ਪਰੰਪਰਾਗਤ ਪੰਜਾਬੀ ਕੁੜਤਾ।",
    price: 1199,
    originalPrice: 1599,
    category: "kids",
    subcategory: "kurta",
    images: ["/placeholder.jpg"],
    colors: ["White", "Yellow", "Light Blue"],
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
    stock: 20,
    rating: 4.6,
    reviews: 67,
    badge: "ਪਸੰਦੀਦਾ",
    badgeEn: "Popular",
    isActive: true
  },

  // Phulkari Products
  {
    name: "Bridal Phulkari Dupatta",
    punjabiName: "ਦੁਲਹਨ ਫੁਲਕਾਰੀ ਦੁਪੱਟਾ",
    description: "Exquisite bridal phulkari dupatta with traditional hand embroidery and premium silk fabric.",
    punjabiDescription: "ਪਰੰਪਰਾਗਤ ਹੱਥ ਦੀ ਕਢਾਈ ਅਤੇ ਪ੍ਰੀਮੀਅਮ ਰੇਸ਼ਮ ਫੈਬਰਿਕ ਨਾਲ ਸ਼ਾਨਦਾਰ ਦੁਲਹਨ ਫੁਲਕਾਰੀ ਦੁਪੱਟਾ।",
    price: 4999,
    originalPrice: 6499,
    category: "phulkari",
    subcategory: "dupatta",
    images: ["/bridal-phulkari-dupatta.png"],
    colors: ["Red", "Gold", "Maroon"],
    sizes: ["2.5m"],
    stock: 8,
    rating: 4.9,
    reviews: 89,
    badge: "ਹੱਥ ਦੀ ਕਢਾਈ",
    badgeEn: "Hand Embroidered",
    isActive: true
  },
  {
    name: "Traditional Bagh Phulkari",
    punjabiName: "ਪਰੰਪਰਾਗਤ ਬਾਗ਼ ਫੁਲਕਾਰੀ",
    description: "Authentic bagh phulkari with intricate geometric patterns and vibrant thread work.",
    punjabiDescription: "ਗੁੰਝਲਦਾਰ ਜਿਓਮੈਟ੍ਰਿਕ ਪੈਟਰਨ ਅਤੇ ਜੀਵੰਤ ਧਾਗੇ ਦੇ ਕੰਮ ਨਾਲ ਅਸਲੀ ਬਾਗ਼ ਫੁਲਕਾਰੀ।",
    price: 3799,
    originalPrice: 4999,
    category: "phulkari",
    subcategory: "bagh",
    images: ["/traditional-bagh-phulkari-embroidery.png"],
    colors: ["Yellow", "Orange", "Red"],
    sizes: ["2.5m"],
    stock: 12,
    rating: 4.8,
    reviews: 203,
    badge: "ਪਰੰਪਰਾਗਤ",
    badgeEn: "Traditional",
    isActive: true
  },
  {
    name: "Chope Phulkari Suit",
    punjabiName: "ਚੋਪੇ ਫੁਲਕਾਰੀ ਸੂਟ",
    description: "Complete chope phulkari suit set with matching dupatta and intricate embroidery work.",
    punjabiDescription: "ਮੇਲ ਖਾਂਦੇ ਦੁਪੱਟੇ ਅਤੇ ਗੁੰਝਲਦਾਰ ਕਢਾਈ ਦੇ ਕੰਮ ਨਾਲ ਪੂਰਾ ਚੋਪੇ ਫੁਲਕਾਰੀ ਸੂਟ ਸੈੱਟ।",
    price: 6999,
    originalPrice: 8999,
    category: "phulkari",
    subcategory: "suit",
    images: ["/placeholder.jpg"],
    colors: ["Pink", "Green", "Blue"],
    sizes: ["S", "M", "L", "XL"],
    stock: 6,
    rating: 4.9,
    reviews: 156,
    badge: "ਵਿਸ਼ੇਸ਼",
    badgeEn: "Special",
    isActive: true
  }
]

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing products
    await Product.deleteMany({})
    console.log('Cleared existing products')

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts)
    console.log(`Inserted ${insertedProducts.length} sample products`)

    // Log the products by category
    const menProducts = insertedProducts.filter(p => p.category === 'men')
    const womenProducts = insertedProducts.filter(p => p.category === 'women')
    const kidsProducts = insertedProducts.filter(p => p.category === 'kids')
    const phulkariProducts = insertedProducts.filter(p => p.category === 'phulkari')

    console.log(`\nProducts by category:`)
    console.log(`Men's: ${menProducts.length}`)
    console.log(`Women's: ${womenProducts.length}`)
    console.log(`Kids: ${kidsProducts.length}`)
    console.log(`Phulkari: ${phulkariProducts.length}`)

    console.log('\nSample products seeded successfully!')
    
  } catch (error) {
    console.error('Error seeding products:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

seedProducts()