import { NextRequest, NextResponse } from 'next/server'
import { productStorage } from '@/lib/shared-storage'

function getProducts() {
  try {
    return productStorage.getAllProducts()
  } catch (error) {
    console.error('Error reading products from shared storage:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
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
    let products = getProducts()
    
    // Filter by active products only
    products = products.filter((p: any) => p.isActive !== false)
    
    // Category filter
    if (category && category !== 'all') {
      products = products.filter((p: any) => p.category === category)
    }
    
    // Subcategory filter
    if (subcategory && subcategory !== 'all') {
      products = products.filter((p: any) => p.subcategory === subcategory)
    }
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter((p: any) => 
        p.name?.toLowerCase().includes(searchLower) ||
        p.punjabiName?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.category?.toLowerCase().includes(searchLower) ||
        p.subcategory?.toLowerCase().includes(searchLower)
      )
    }
    
    // Price range filter
    if (priceRange && priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''))
      if (max) {
        products = products.filter((p: any) => p.price >= parseInt(min) && p.price <= parseInt(max))
      } else {
        products = products.filter((p: any) => p.price >= parseInt(min))
      }
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
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
