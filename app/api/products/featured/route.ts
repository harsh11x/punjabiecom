import { NextRequest, NextResponse } from 'next/server'
import { fileStorage } from '@/lib/file-storage'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '8')
    
    // Get featured products using file storage
    const products = await fileStorage.getFeaturedProducts(limit)
    
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
