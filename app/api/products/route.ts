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
    
    // No auto-seeding - only show products manually added by admin
    if (products.length === 0) {
      console.log('📁 No products found - admin must add products manually')
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
    
    // Handle pagination vs. limit requests
    let finalProducts = products
    let paginationInfo = null
    
    if (limit >= total) {
      // If limit is high enough to get all products, return all without pagination
      finalProducts = products
      console.log(`✅ Retrieved ALL ${finalProducts.length} products (limit ${limit} >= total ${total})`)
    } else {
      // Apply pagination for smaller limits
      const skip = (page - 1) * limit
      finalProducts = products.slice(skip, skip + limit)
      paginationInfo = {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
      console.log(`✅ Retrieved ${finalProducts.length} products (page ${page} of ${Math.ceil(total / limit)})`)
    }
    
    return NextResponse.json({
      success: true,
      data: finalProducts,
      pagination: paginationInfo
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
