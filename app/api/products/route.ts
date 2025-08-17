import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, getProductsByCategory, searchProducts } from '@/lib/simple-product-storage'

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
    
    console.log('🔍 Fetching products with filters:', {
      category, subcategory, search, page, limit, sortBy, sortOrder, priceRange
    })
    
    // Get products using robust product manager
    let products = search ? 
      await searchProducts(search) : 
      category ? 
        await getProductsByCategory(category) : 
        await getAllProducts()
    
    console.log(`📦 Retrieved ${products.length} products`)
    
    // Apply additional filters
    let filteredProducts = products.filter(product => product.isActive !== false && product.inStock !== false)
    
    // Subcategory filter
    if (subcategory && subcategory !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.subcategory === subcategory)
    }
    
    // Price range filter
    if (priceRange && priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => parseInt(p.replace('+', '')))
      if (max) {
        filteredProducts = filteredProducts.filter(product => 
          product.price >= min && product.price <= max
        )
      } else {
        filteredProducts = filteredProducts.filter(product => product.price >= min)
      }
    }
    
    console.log(`🔍 Filtered to ${filteredProducts.length} products`)
    
    // Sort products
    filteredProducts.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'newest':
        case 'createdAt':
          aValue = new Date(a.createdAt || 0).getTime()
          bValue = new Date(b.createdAt || 0).getTime()
          break
        case 'price-low':
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'price-high':
          aValue = a.price
          bValue = b.price
          break
        case 'newest':
          aValue = new Date(b.createdAt).getTime()
          bValue = new Date(a.createdAt).getTime()
          break
        case 'popular':
          // Sort by featured first, then by stock
          aValue = (a.featured ? 1 : 0) + (a.inStock ? 1 : 0)
          bValue = (b.featured ? 1 : 0) + (b.inStock ? 1 : 0)
          break
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        default:
          aValue = new Date(a.createdAt || 0).getTime()
          bValue = new Date(b.createdAt || 0).getTime()
      }
      
      if (sortBy === 'price-high') {
        return bValue - aValue // Always descending for price-high
      }
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      }
    })
    
    // Pagination
    const total = filteredProducts.length
    const startIndex = (page - 1) * limit
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit)
    
    // Transform products to match frontend interface
    const formattedProducts = paginatedProducts.map((product: any) => ({
      _id: product._id || product.id || '',
      id: product._id || product.id || '',
      name: product.name || '',
      punjabiName: product.punjabiName || product.name || '',
      description: product.description || '',
      punjabiDescription: product.punjabiDescription || product.description || '',
      price: product.price || 0,
      originalPrice: product.originalPrice || product.price || 0,
      category: product.category || '',
      subcategory: product.subcategory || '',
      images: product.images || ['/placeholder.svg'],
      colors: product.colors || ['Default'],
      sizes: product.sizes || ['One Size'],
      stock: product.stock || 0,
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      isActive: product.isActive !== false,
      badge: product.badge || '',
      badgeEn: product.badgeEn || '',
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }))
    
    console.log(`✅ Returning ${formattedProducts.length} products (page ${page}/${Math.ceil(total / limit)})`)
    
    // Set cache headers for better performance
    const response = NextResponse.json({
      success: true,
      products: formattedProducts, // Changed from 'data' to 'products'
      data: formattedProducts, // Keep both for compatibility
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
    // Cache for 30 seconds to ensure real-time updates
    response.headers.set('Cache-Control', 'public, max-age=30, s-maxage=60')
    
    return response
  } catch (error) {
    console.error('❌ Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
