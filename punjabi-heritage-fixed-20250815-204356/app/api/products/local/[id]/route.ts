import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Data file paths
const DATA_DIR = path.resolve(process.cwd(), 'data')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')

function getProducts() {
  if (!fs.existsSync(PRODUCTS_FILE)) {
    return []
  }
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading products:', error)
    return []
  }
}

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
    
    const products = getProducts()
    const product = products.find((p: any) => p.id === id && p.isActive !== false)
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Get related products from same category
    const relatedProducts = products
      .filter((p: any) => 
        p.id !== id && 
        p.category === product.category && 
        p.isActive !== false
      )
      .slice(0, 4) // Limit to 4 related products
    
    return NextResponse.json({
      success: true,
      data: product,
      relatedProducts: relatedProducts
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
