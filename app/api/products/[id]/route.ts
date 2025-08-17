import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/simple-product-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    console.log(`🔍 Fetching product with ID: ${resolvedParams.id}`)
    
    const products = await getAllProducts()
    const product = products.find((p: any) => p.id === resolvedParams.id)
    
    if (!product) {
      console.log(`❌ Product not found: ${resolvedParams.id}`)
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    console.log(`✅ Product found: ${product.name}`)
    return NextResponse.json({
      success: true,
      product: product
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
