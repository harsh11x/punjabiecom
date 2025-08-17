import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/simple-product-storage'

export async function GET(request: NextRequest) {
  try {
    console.log('📦 Fetching all products for products page...')
    
    const products = await getAllProducts()
    
    console.log(`✅ Retrieved ${products.length} products`)
    
    return NextResponse.json({
      success: true,
      products,
      total: products.length
    })
  } catch (error) {
    console.error('❌ Error fetching products:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        products: [],
        total: 0
      },
      { status: 500 }
    )
  }
}
