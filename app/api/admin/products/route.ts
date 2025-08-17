import { NextRequest, NextResponse } from 'next/server'
import { 
  getAllProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from '@/lib/simple-product-storage'

// AWS Sync Configuration
const AWS_SYNC_SERVER_URL = process.env.AWS_SYNC_SERVER_URL || 'http://3.111.208.77:3000'
const AWS_SYNC_SECRET = process.env.AWS_SYNC_SECRET || 'punjabi-heritage-sync-secret-2024'

// AWS Sync Function
async function syncToAWS(action: string, product: any, productId?: string) {
  try {
    console.log(`🔄 Syncing to AWS: ${action}`, { productId, productName: product?.name })
    
    const syncData = {
      action,
      product,
      productId,
      timestamp: new Date().toISOString(),
      source: 'admin-panel'
    }

    const response = await fetch(`${AWS_SYNC_SERVER_URL}/api/sync/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AWS_SYNC_SECRET}`,
        'User-Agent': 'Punjabi-Heritage-Admin/1.0'
      },
      body: JSON.stringify(syncData),
      // Add timeout
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })

    if (response.ok) {
      const result = await response.json()
      console.log('✅ AWS sync successful:', action, result)
      return { success: true, result }
    } else {
      const errorText = await response.text()
      console.error('❌ AWS sync failed:', response.status, errorText)
      return { success: false, error: `HTTP ${response.status}: ${errorText}` }
    }
  } catch (error: any) {
    console.error('❌ AWS sync error:', error.message)
    return { success: false, error: error.message }
  }
}

// GET - Fetch all products
export async function GET() {
  try {
    console.log('📋 Fetching all products...')
    
    // Get products from local storage (primary)
    const products = await getAllProducts()
    
    console.log(`✅ Retrieved ${products.length} products`)
    
    return NextResponse.json({
      success: true,
      products,
      count: products.length,
      source: 'local-storage'
    })
  } catch (error: any) {
    console.error('❌ Error fetching products:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// POST - Add new product
export async function POST(request: NextRequest) {
  try {
    console.log('➕ Adding new product...')
    
    const productData = await request.json()
    console.log('Product data received:', productData)

    // Validate required fields
    if (!productData.name || !productData.price) {
      console.log('❌ Validation failed - missing name or price')
      return NextResponse.json(
        { success: false, error: 'Name and price are required' },
        { status: 400 }
      )
    }

    // Simple product object for testing
    const simpleProduct = {
      name: String(productData.name),
      description: String(productData.description || ''),
      price: Number(productData.price),
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
      category: String(productData.category || 'general'),
      subcategory: productData.subcategory ? String(productData.subcategory) : undefined,
      images: Array.isArray(productData.images) ? productData.images : [],
      sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
      colors: Array.isArray(productData.colors) ? productData.colors : [],
      inStock: productData.inStock !== false,
      isActive: productData.isActive !== false, // Default to true (active)
      stockQuantity: Number(productData.stockQuantity) || 1,
      featured: productData.featured === true,
      tags: Array.isArray(productData.tags) ? productData.tags : []
    }

    console.log('Simple product data:', simpleProduct)

    // Try to add product to local storage
    console.log('📁 Attempting to add product to local storage...')
    const newProduct = await addProduct(simpleProduct)
    console.log('✅ Product added to local storage:', newProduct.id)

    // Sync to AWS (secondary)
    console.log('🔄 Syncing to AWS...')
    const syncResult = await syncToAWS('add', newProduct)
    console.log('📡 AWS sync result:', syncResult)
    
    return NextResponse.json({
      success: true,
      product: newProduct,
      message: 'Product added successfully',
      awsSync: syncResult
    })
  } catch (error: any) {
    console.error('❌ Error adding product:', error)
    console.error('❌ Error message:', error.message)
    console.error('❌ Error stack:', error.stack)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add product',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    )
  }
}

// PUT - Update existing product
export async function PUT(request: NextRequest) {
  try {
    console.log('✏️ Updating product...')
    
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const updateData = await request.json()
    console.log('Update data received:', { id: productId, name: updateData.name })

    // Update product in local storage (primary)
    const updatedProduct = await updateProduct(productId, updateData)
    console.log('✅ Product updated in local storage:', productId)

    // Sync to AWS (secondary)
    const syncResult = await syncToAWS('update', updatedProduct, productId)
    
    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully',
      awsSync: syncResult
    })
  } catch (error: any) {
    console.error('❌ Error updating product:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update product',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// DELETE - Remove product
export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ Deleting product...')
    
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    console.log('Deleting product:', productId)

    // Delete from local storage (primary)
    await deleteProduct(productId)
    console.log('✅ Product deleted from local storage:', productId)

    // Sync to AWS (secondary)
    const syncResult = await syncToAWS('delete', null, productId)
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      productId,
      awsSync: syncResult
    })
  } catch (error: any) {
    console.error('❌ Error deleting product:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete product',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
