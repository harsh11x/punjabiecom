import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import { requireAdmin } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    
    const dbConnection = await connectDB()
    if (!dbConnection) {
      return NextResponse.json(
        { success: false, error: 'Database connection not available' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const query: any = {}
    
    if (category) {
      query.category = category
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { punjabiName: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ])

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
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    await connectDB()
    
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'punjabiName', 'description', 'punjabiDescription', 'price', 'originalPrice', 'category', 'images', 'colors', 'sizes']
    for (const field of requiredFields) {
      if (!body[field] || (Array.isArray(body[field]) && body[field].length === 0)) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }
    
    // Set default values
    body.stock = body.stock || 0
    body.rating = body.rating || 0
    body.reviews = body.reviews || 0
    body.isActive = body.isActive !== undefined ? body.isActive : true
    
    const product = new Product(body)
    await product.save()
    
    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully'
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    
    if (error.message === 'Admin access required' || error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      )
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}