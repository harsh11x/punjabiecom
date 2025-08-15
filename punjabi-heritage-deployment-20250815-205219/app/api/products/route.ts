import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/storage'

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
    
    // Get all products from file storage
    const allProducts = await getProducts()
    
    // Filter products
    let filteredProducts = allProducts.filter((product: any) => {
      // Only show active products
      if (product.isActive !== true && product.isActive !== undefined) return false
      
      // Category filter
      if (category && category !== 'all') {
        if (product.category !== category) return false
      }
      
      // Subcategory filter (productType)
      if (subcategory && subcategory !== 'all') {
        if (product.productType !== subcategory && product.subcategory !== subcategory) return false
      }
      
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const nameMatch = product.name?.toLowerCase().includes(searchLower)
        const punjabiNameMatch = product.punjabiName?.toLowerCase().includes(searchLower)
        const descriptionMatch = product.description?.toLowerCase().includes(searchLower)
        const categoryMatch = product.category?.toLowerCase().includes(searchLower)
        const productTypeMatch = product.productType?.toLowerCase().includes(searchLower)
        
        if (!nameMatch && !punjabiNameMatch && !descriptionMatch && !categoryMatch && !productTypeMatch) {
          return false
        }
      }
      
      // Price range filter
      if (priceRange && priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(p => parseInt(p.replace('+', '')))
        const price = parseFloat(product.price)
        if (max) {
          if (price < min || price > max) return false
        } else {
          if (price < min) return false
        }
      }
      
      return true
    })
    
    // Sort products
    filteredProducts.sort((a: any, b: any) => {
      let aVal, bVal
      
      switch (sortBy) {
        case 'newest':
        case 'createdAt':
          aVal = new Date(a.createdAt || a.updatedAt || 0)
          bVal = new Date(b.createdAt || b.updatedAt || 0)
          break
        case 'price-low':
        case 'price':
          aVal = parseFloat(a.price) || 0
          bVal = parseFloat(b.price) || 0
          return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
        case 'price-high':
          aVal = parseFloat(a.price) || 0
          bVal = parseFloat(b.price) || 0
          return bVal - aVal
        case 'rating':
          aVal = parseFloat(a.rating) || 0
          bVal = parseFloat(b.rating) || 0
          break
        case 'popular':
        case 'reviews':
          aVal = parseInt(a.reviews) || 0
          bVal = parseInt(b.reviews) || 0
          break
        case 'name':
          aVal = a.name || ''
          bVal = b.name || ''
          break
        default:
          aVal = a[sortBy]
          bVal = b[sortBy]
      }
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal)
      }
      
      if (aVal instanceof Date && bVal instanceof Date) {
        return sortOrder === 'desc' ? bVal.getTime() - aVal.getTime() : aVal.getTime() - bVal.getTime()
      }
      
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
    })
    
    // Calculate pagination
    const total = filteredProducts.length
    const skip = (page - 1) * limit
    const paginatedProducts = filteredProducts.slice(skip, skip + limit)
    
    // Ensure products have _id field for compatibility
    const formattedProducts = paginatedProducts.map((product: any) => ({
      _id: product.id || product._id,
      id: product.id || product._id,
      ...product,
      // Ensure required fields have defaults
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      colors: product.colors || ['Default'],
      sizes: product.sizes || ['One Size'],
      images: product.images || ['/placeholder.svg']
    }))
    
    return NextResponse.json({
      success: true,
      data: formattedProducts,
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
