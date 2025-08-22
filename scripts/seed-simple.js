const fs = require('fs')
const path = require('path')

// Data file paths
const DATA_DIR = path.resolve(process.cwd(), 'data')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

const sampleProducts = [
  // Men's Products
  {
    id: 'men_jutti_1',
    name: "Royal Punjabi Jutti",
    punjabiName: "ਸ਼ਾਹੀ ਪੰਜਾਬੀ ਜੁੱਤੀ",
    description: "Handcrafted traditional Punjabi jutti made with premium leather and intricate embroidery work.",
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
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'men_jutti_2',
    name: "Traditional Khussa",
    punjabiName: "ਪਰੰਪਰਾਗਤ ਖੁੱਸਾ",
    description: "Elegant traditional khussa with authentic Punjabi craftsmanship and comfortable fit.",
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
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Women's Products
  {
    id: 'women_jutti_1',
    name: "Bridal Gold Jutti",
    punjabiName: "ਦੁਲਹਨ ਸੋਨੇ ਦੀ ਜੁੱਤੀ",
    description: "Exquisite bridal jutti with gold embroidery and traditional craftsmanship for special occasions.",
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
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'women_jutti_2',
    name: "Embroidered Jutti",
    punjabiName: "ਕਢਾਈ ਵਾਲੀ ਜੁੱਤੀ",
    description: "Beautiful embroidered jutti with intricate threadwork and comfortable sole for daily wear.",
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
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Kids Products
  {
    id: 'kids_jutti_1',
    name: "Colorful Kids Jutti",
    punjabiName: "ਬੱਚਿਆਂ ਦੀ ਰੰਗੀਨ ਜੁੱਤੀ",
    description: "Vibrant and comfortable jutti designed specially for kids with soft sole and playful colors.",
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
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'kids_jutti_2',
    name: "Baby Soft Jutti",
    punjabiName: "ਬੇਬੀ ਨਰਮ ਜੁੱਤੀ",
    description: "Ultra-soft jutti for babies and toddlers with gentle materials and secure fit.",
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
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Fulkari Products
  {
    id: 'fulkari_dupatta_1',
    name: "Bridal Phulkari Dupatta",
    punjabiName: "ਦੁਲਹਨ ਫੁਲਕਾਰੀ ਦੁਪੱਟਾ",
    description: "Exquisite bridal phulkari dupatta with traditional hand embroidery and premium silk fabric.",
    price: 4999,
    originalPrice: 6499,
    category: "fulkari",
    subcategory: "dupatta",
    images: ["/bridal-phulkari-dupatta.png"],
    colors: ["Red", "Gold", "Maroon"],
    sizes: ["2.5m"],
    stock: 8,
    rating: 4.9,
    reviews: 89,
    badge: "ਹੱਥ ਦੀ ਕਢਾਈ",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fulkari_bagh_1',
    name: "Traditional Bagh Phulkari",
    punjabiName: "ਪਰੰਪਰਾਗਤ ਬਾਗ਼ ਫੁਲਕਾਰੀ",
    description: "Authentic bagh phulkari with intricate geometric patterns and vibrant thread work.",
    price: 3799,
    originalPrice: 4999,
    category: "fulkari",
    subcategory: "bagh",
    images: ["/traditional-bagh-phulkari-embroidery.png"],
    colors: ["Yellow", "Orange", "Red"],
    sizes: ["2.5m"],
    stock: 12,
    rating: 4.8,
    reviews: 203,
    badge: "ਪਰੰਪਰਾਗਤ",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

function seedProducts() {
  try {
    // Write products to file
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(sampleProducts, null, 2))
    
    console.log(`✅ Successfully seeded ${sampleProducts.length} products!`)
    
    // Log products by category
    const menProducts = sampleProducts.filter(p => p.category === 'men')
    const womenProducts = sampleProducts.filter(p => p.category === 'women')
    const kidsProducts = sampleProducts.filter(p => p.category === 'kids')
    const fulkariProducts = sampleProducts.filter(p => p.category === 'fulkari')

    console.log(`\n📊 Products by category:`)
    console.log(`Men's: ${menProducts.length}`)
    console.log(`Women's: ${womenProducts.length}`)
    console.log(`Kids: ${kidsProducts.length}`)
    console.log(`Fulkari: ${fulkariProducts.length}`)
    
    console.log(`\n📁 Products saved to: ${PRODUCTS_FILE}`)
    
  } catch (error) {
    console.error('❌ Error seeding products:', error)
  }
}

seedProducts()
