import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(request: NextRequest) {
  try {
    // Try to connect to database with timeout
    const dbConnection = await Promise.race([
      connectDB(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 3000))
    ])
    
    if (!dbConnection) {
      // Return empty array for build time or when DB is unavailable
      return NextResponse.json({
        success: true,
        data: []
      })
    }
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '8')
    
    // Single optimized query - just get the products we need, no counting
    const products = await Product.find(
      { isActive: true }, 
      { 
        // Only select fields we need for display
        name: 1,
        punjabiName: 1, 
        price: 1,
        originalPrice: 1,
        images: 1,
        rating: 1,
        reviews: 1,
        category: 1,
        subcategory: 1,
        colors: 1,
        sizes: 1
      }
    )
      .sort({ rating: -1, reviews: -1, createdAt: -1 }) // Best rated first
      .limit(limit)
      .lean() // Better performance - returns plain objects
      .exec() // Execute immediately
    
    // Set cache headers for better performance
    const response = NextResponse.json({
      success: true,
      data: products
    })
    
    // Cache for 5 minutes on client, 1 hour on CDN
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=3600')
    
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
