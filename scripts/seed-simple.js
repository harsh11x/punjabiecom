const fs = require('fs')
const path = require('path')

const DATA_DIR = path.resolve(process.cwd(), 'data')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')

// Sample products data
const sampleProducts = [
  {
    id: "1",
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
    badgeEn: "Bridal Special",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
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
    badgeEn: "Best Seller",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
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
    badgeEn: "Traditional",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
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
    badgeEn: "New",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "5",
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
    badgeEn: "Kids Favorite",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "6",
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
    badgeEn: "Handmade",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "7",
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
    badgeEn: "Bridal Special",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

function seedProducts() {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    // Write products to file
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(sampleProducts, null, 2), 'utf8')

    console.log('✅ Database seeded successfully!')
    console.log('📦 Sample products created:', sampleProducts.length)
    console.log('🏪 Categories: Women, Men, Kids, Phulkari')
    console.log('\nYour products are ready! Start your server and access:')
    console.log('- Website: http://localhost:3000')
    console.log('- Admin Panel: http://localhost:3000/admin')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  }
}

seedProducts()
