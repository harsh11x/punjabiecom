import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import { requireAdmin } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const status = searchParams.get('status') // 'active', 'inactive', 'all'
    
    // Build query
    const query: any = {}
    
    if (status === 'active') {
      query.isActive = true
    } else if (status === 'inactive') {
      query.isActive = false
    }
    
    if (category && category !== 'all') {
      query.category = category
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { punjabiName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit
    
    // Execute query with population
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    // Get total count for pagination
    const total = await Product.countDocuments(query)
    
    // Get statistics
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: { $sum: { $cond: ['$isActive', 1, 0] } },
          inactiveProducts: { $sum: { $cond: ['$isActive', 0, 1] } },
          totalStock: { $sum: '$stock' },
          lowStockProducts: { $sum: { $cond: [{ $lte: ['$stock', 5] }, 1, 0] } }
        }
      }
    ])
    
    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: stats[0] || {
        totalProducts: 0,
        activeProducts: 0,
        inactiveProducts: 0,
        totalStock: 0,
        lowStockProducts: 0
      }
    })
  } catch (error: any) {
    console.error('Error fetching admin products:', error)
    
    if (error.message === 'Admin access required' || error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
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