import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '8')
    
    // Connect to MongoDB
    await connectDB()
    
    // Get featured products from MongoDB
    const products = await Product.find({ isActive: true })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit)
      .lean()
    
    // Transform MongoDB documents to match frontend interface
    const transformedProducts = products.map(product => ({
      _id: product._id.toString(),
      name: product.name,
      punjabiName: product.punjabiName,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      images: product.images || [],
      colors: product.colors || [],
      sizes: product.sizes || [],
      stock: product.stock,
      rating: product.rating,
      reviews: product.reviews,
      isActive: product.isActive,
      badge: product.badge
    }))
    
    // Set cache headers for better performance (reduced cache time for real-time updates)
    const response = NextResponse.json({
      success: true,
      data: transformedProducts
    })
    
    // Cache for 1 minute on client, 5 minutes on CDN (shorter for real-time updates)
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300')
    
    return response
    
  } catch (error) {
    console.error('Error fetching featured products:', error)
    
    // Return empty array instead of error for better user experience
    return NextResponse.json({
      success: true,
      data: []
    })
  }
}
