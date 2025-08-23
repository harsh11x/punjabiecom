import { NextRequest, NextResponse } from 'next/server'
import { productStorage } from '@/lib/shared-storage'

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Seeding products...')
    
    // Sample products data
    const sampleProducts = [
      {
        name: "Traditional Punjabi Jutti",
        punjabiName: "ਪਰੰਪਰਾਗਤ ਪੰਜਾਬੀ ਜੁੱਤੀ",
        description: "Handcrafted traditional Punjabi jutti with intricate embroidery",
        punjabiDescription: "ਹੱਥ ਨਾਲ ਬਣੀ ਪਰੰਪਰਾਗਤ ਪੰਜਾਬੀ ਜੁੱਤੀ ਜਿਸ ਵਿੱਚ ਸੁੰਦਰ ਕਢਾਈ ਹੈ",
        price: 1299,
        originalPrice: 1599,
        category: "men",
        subcategory: "jutti",
        stock: 25,
        rating: 4.5,
        reviews: 23,
        isActive: true,
        featured: true,
        images: ["/placeholder.jpg"],
        sizes: ["7", "8", "9", "10"],
        colors: ["Brown", "Black"],
        tags: ["traditional", "handcrafted", "embroidery"]
      },
      {
        name: "Women's Bridal Jutti",
        punjabiName: "ਔਰਤਾਂ ਦੀ ਵਿਆਹੁਣੀ ਜੁੱਤੀ",
        description: "Elegant bridal jutti perfect for special occasions",
        punjabiDescription: "ਖਾਸ ਮੌਕਿਆਂ ਲਈ ਸੁੰਦਰ ਵਿਆਹੁਣੀ ਜੁੱਤੀ",
        price: 1899,
        originalPrice: 2299,
        category: "women",
        subcategory: "jutti",
        stock: 15,
        rating: 4.8,
        reviews: 18,
        isActive: true,
        featured: true,
        images: ["/placeholder.jpg"],
        sizes: ["5", "6", "7", "8"],
        colors: ["Gold", "Silver"],
        tags: ["bridal", "elegant", "special-occasion"]
      },
      {
        name: "Kids Colorful Jutti",
        punjabiName: "ਬੱਚਿਆਂ ਦੀ ਰੰਗੀਨ ਜੁੱਤੀ",
        description: "Colorful and comfortable jutti for kids",
        punjabiDescription: "ਬੱਚਿਆਂ ਲਈ ਰੰਗੀਨ ਅਤੇ ਆਰਾਮਦਾਇਕ ਜੁੱਤੀ",
        price: 799,
        originalPrice: 999,
        category: "kids",
        subcategory: "jutti",
        stock: 30,
        rating: 4.2,
        reviews: 12,
        isActive: true,
        featured: false,
        images: ["/placeholder.jpg"],
        sizes: ["1", "2", "3", "4"],
        colors: ["Red", "Blue", "Green"],
        tags: ["kids", "colorful", "comfortable"]
      },
      {
        name: "Phulkari Dupatta",
        punjabiName: "ਫੁਲਕਾਰੀ ਦੁਪੱਟਾ",
        description: "Beautiful hand-embroidered Phulkari dupatta",
        punjabiDescription: "ਸੁੰਦਰ ਹੱਥ ਨਾਲ ਕਢਾਈ ਵਾਲਾ ਫੁਲਕਾਰੀ ਦੁਪੱਟਾ",
        price: 2499,
        originalPrice: 2999,
        category: "fulkari",
        subcategory: "fulkari",
        stock: 10,
        rating: 4.9,
        reviews: 8,
        isActive: true,
        featured: true,
        images: ["/placeholder.jpg"],
        sizes: ["Free Size"],
        colors: ["Multicolor"],
        tags: ["phulkari", "hand-embroidered", "traditional"]
      }
    ]
    
    // Add each sample product
    const addedProducts = []
    for (const productData of sampleProducts) {
      const newProduct = productStorage.addProduct(productData)
      addedProducts.push(newProduct)
      console.log(`✅ Added sample product: ${newProduct.name}`)
    }
    
    console.log(`🌱 Successfully seeded ${addedProducts.length} products`)
    
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${addedProducts.length} products`,
      products: addedProducts
    })
    
  } catch (error: any) {
    console.error('❌ Error seeding products:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed products',
        details: error.message 
      },
      { status: 500 }
    )
  }
}