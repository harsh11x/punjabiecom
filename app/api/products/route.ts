import { NextRequest, NextResponse } from 'next/server'
import { productStorage } from '@/lib/shared-storage'

export async function GET(request: NextRequest) {
  try {
    console.log('📦 Fetching products with filters...')
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const subcategory = searchParams.get('subcategory')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sortBy = searchParams.get('sortBy') || searchParams.get('sort') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const priceRange = searchParams.get('priceRange')
    
    // Get all products
    let products = await productStorage.getAllProducts()
    
    // If no products exist, seed some sample products
    if (products.length === 0) {
      console.log('🌱 No products found, seeding sample products...')
      try {
        // Seed sample products
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
            isActive: true,
            featured: true,
            images: ["/placeholder.jpg"],
            sizes: ["Free Size"],
            colors: ["Multicolor"],
            tags: ["phulkari", "hand-embroidered", "traditional"]
          }
        ]
        
        sampleProducts.forEach(productData => {
          productStorage.addProduct(productData)
        })
        
        console.log(`🌱 Seeded ${sampleProducts.length} sample products`)
        products = productStorage.getAllProducts()
      } catch (error) {
        console.error('❌ Failed to seed products:', error)
      }
    }
    
    // Filter by active products only
    products = products.filter((p: any) => p.isActive !== false)
    
    // Category filter
    if (category && category !== 'all') {
      products = products.filter((p: any) => p.category === category)
      console.log(`🔍 Filtered by category: ${category}, found ${products.length} products`)
    }
    
    // Subcategory filter
    if (subcategory && subcategory !== 'all') {
      products = products.filter((p: any) => p.subcategory === subcategory)
      console.log(`🔍 Filtered by subcategory: ${subcategory}, found ${products.length} products`)
    }
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter((p: any) => 
        p.name?.toLowerCase().includes(searchLower) ||
        p.punjabiName?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.punjabiDescription?.toLowerCase().includes(searchLower) ||
        p.category?.toLowerCase().includes(searchLower) ||
        p.subcategory?.toLowerCase().includes(searchLower)
      )
      console.log(`🔍 Filtered by search: "${search}", found ${products.length} products`)
    }
    
    // Price range filter
    if (priceRange && priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''))
      if (max) {
        products = products.filter((p: any) => p.price >= parseInt(min) && p.price <= parseInt(max))
      } else {
        products = products.filter((p: any) => p.price >= parseInt(min))
      }
      console.log(`🔍 Filtered by price range: ${priceRange}, found ${products.length} products`)
    }
    
    // Sort products
    products.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'popular':
          return (b.reviews || 0) - (a.reviews || 0)
        case 'createdAt':
          if (sortOrder === 'desc') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          } else {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          }
        default:
          if (sortOrder === 'desc') {
            return b[sortBy] > a[sortBy] ? 1 : -1
          } else {
            return a[sortBy] > b[sortBy] ? 1 : -1
          }
      }
    })
    
    // Get total before pagination
    const total = products.length
    
    // Paginate
    const skip = (page - 1) * limit
    const paginatedProducts = products.slice(skip, skip + limit)
    
    console.log(`✅ Retrieved ${paginatedProducts.length} products (page ${page} of ${Math.ceil(total / limit)})`)
    
    return NextResponse.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('❌ Error fetching products:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        data: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          pages: 0
        }
      },
      { status: 500 }
    )
  }
}
