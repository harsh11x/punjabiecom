import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import { requireAdmin } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const subcategory = searchParams.get('subcategory')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sortBy = searchParams.get('sortBy') || searchParams.get('sort') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const priceRange = searchParams.get('priceRange')
    
    // Build query
    const query: any = { isActive: true }
    
    // Category filter - strict filtering
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
        { category: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } }
      ]
    }
    
    // Price range filter
    if (priceRange && priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''))
      if (max) {
        query.price = { $gte: parseInt(min), $lte: parseInt(max) }
      } else {
        query.price = { $gte: parseInt(min) }
      }
    }
    
    // Build sort object
    const sort: any = {}
    
    switch (sortBy) {
      case 'newest':
        sort.createdAt = -1
        break
      case 'price-low':
        sort.price = 1
        break
      case 'price-high':
        sort.price = -1
        break
      case 'rating':
        sort.rating = -1
        break
      case 'popular':
        sort.reviews = -1
        break
      default:
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit
    
    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
    
    // Get total count for pagination
    const total = await Product.countDocuments(query)
    
    return NextResponse.json({
      success: true,
      data: products,
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

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication for creating products
    await requireAdmin(request)
    await connectDB()
    
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'punjabiName', 'description', 'punjabiDescription', 'price', 'originalPrice', 'category', 'images', 'colors', 'sizes']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }
    
    const product = new Product(body)
    await product.save()
    
    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully'
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}