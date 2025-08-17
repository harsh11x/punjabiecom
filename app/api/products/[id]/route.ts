import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/simple-product-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const { id } = resolvedParams
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    console.log(`🔍 Looking for product with ID: ${id}`)
    
    const products = await getAllProducts()
    console.log(`📦 Total products available: ${products.length}`)
    
    const product = products.find((p: any) => p.id === id)
    
    if (!product) {
      console.log(`❌ Product not found with ID: ${id}`)
      console.log(`Available product IDs: ${products.map(p => p.id).join(', ')}`)
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    console.log(`✅ Found product: ${product.name}`)
    
    // Get related products from same category
    const relatedProducts = products
      .filter((p: any) => 
        p.id !== id && 
        p.category === product.category
      )
      .slice(0, 4) // Limit to 4 related products
    
    return NextResponse.json({
      success: true,
      data: product,
      relatedProducts: relatedProducts
    })
  } catch (error) {
    console.error('❌ Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
