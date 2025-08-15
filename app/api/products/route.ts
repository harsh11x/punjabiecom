import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'

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
    
    // Connect to MongoDB
    await connectDB()
    
    // Build MongoDB query
    const query: any = { isActive: true }
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category
    }
    
    // Subcategory filter
    if (subcategory && subcategory !== 'all') {
      query.subcategory = subcategory
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { punjabiName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ]
    }
    
    // Price range filter
    if (priceRange && priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => parseInt(p.replace('+', '')))
      if (max) {
        query.price = { $gte: min, $lte: max }
      } else {
        query.price = { $gte: min }
      }
    }
    
    // Build sort object
    const sortObj: any = {}
    switch (sortBy) {
      case 'newest':
      case 'createdAt':
        sortObj.createdAt = sortOrder === 'desc' ? -1 : 1
        break
      case 'price-low':
      case 'price':
        sortObj.price = sortOrder === 'desc' ? -1 : 1
        break
      case 'price-high':
        sortObj.price = -1
        break
      case 'rating':
        sortObj.rating = sortOrder === 'desc' ? -1 : 1
        break
      case 'popular':
      case 'reviews':
        sortObj.reviews = sortOrder === 'desc' ? -1 : 1
        break
      case 'name':
        sortObj.name = sortOrder === 'desc' ? -1 : 1
        break
      default:
        sortObj.createdAt = -1
    }
    
    // Get total count for pagination
    const total = await Product.countDocuments(query)
    
    // Get products from MongoDB with pagination
    const products = await Product.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
    
    // Transform MongoDB documents to match frontend interface
    const formattedProducts = products.map((product: any) => ({
      _id: product._id?.toString() || product.id?.toString() || '',
      id: product._id?.toString() || product.id?.toString() || '',
      name: product.name || '',
      punjabiName: product.punjabiName || product.name || '',
      description: product.description || '',
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
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }))
    
    // Set cache headers for better performance (reduced cache time for real-time updates)
    const response = NextResponse.json({
      success: true,
      data: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
    // Cache for 1 minute on client, 5 minutes on CDN (shorter for real-time updates)
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300')
    
    return response
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
