import { NextRequest, NextResponse } from 'next/server'
import { 
  productStorage
} from '@/lib/shared-storage'

// AWS Sync Function (Disabled for now - using local storage only)
async function syncToAWS(action: string, product: any, productId?: string) {
  console.log(`🔄 AWS sync disabled - using shared storage only: ${action}`)
  return { success: true, result: 'Shared storage only' }
}

// GET - Fetch all products
export async function GET() {
  try {
    console.log('📋 Fetching all products...')
    
    // Get products from local storage (primary)
    const products = await productStorage.getAllProducts()
    
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
    if (!productData.name || !productData.price || !productData.category) {
      console.log('❌ Validation failed - missing name, price, or category')
      return NextResponse.json(
        { success: false, error: 'Name, price, and category are required' },
        { status: 400 }
      )
    }

    // Create product object with proper field mapping
    const simpleProduct = {
      name: String(productData.name),
      punjabiName: String(productData.punjabiName || ''),
      description: String(productData.description || ''),
      punjabiDescription: String(productData.punjabiDescription || ''),
      price: Number(productData.price),
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
      category: String(productData.category), // 'men', 'women', or 'kids'
      subcategory: productData.subcategory ? String(productData.subcategory) : undefined, // 'jutti' or 'fulkari'
      images: Array.isArray(productData.images) ? productData.images : [],
      sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
      colors: Array.isArray(productData.colors) ? productData.colors : [],
      stock: Number(productData.stock) || 0,
      stockQuantity: Number(productData.stock) || 0, // For compatibility
      inStock: (productData.stock || 0) > 0,
      isActive: productData.isActive !== false, // Default to true (active)
      featured: productData.featured === true,
      tags: Array.isArray(productData.tags) ? productData.tags : []
    }

    console.log('Simple product data:', simpleProduct)

    // Try to add product to local storage
    console.log('📁 Attempting to add product to local storage...')
    const newProduct = await productStorage.addProduct(simpleProduct)
    console.log('✅ Product added to local storage:', newProduct.id)

    // Try to sync to AWS (optional - don't fail if it doesn't work)
    try {
      console.log('🔄 Attempting to sync to AWS...')
      const syncResult = await syncToAWS('add', newProduct)
      console.log('📡 AWS sync result:', syncResult)
    } catch (syncError) {
      console.log('⚠️ AWS sync failed, but product saved locally:', syncError)
    }
    
    return NextResponse.json({
      success: true,
      product: newProduct,
      message: 'Product added successfully'
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
    console.log('Update data received:', { id: productId, name: updateData.name, price: updateData.price, category: updateData.category })

    // Validate required fields
    if (!updateData.name || updateData.price === undefined || updateData.price < 0) {
      return NextResponse.json(
        { success: false, error: 'Name and valid price are required' },
        { status: 400 }
      )
    }

    // Clean the update data with proper field mapping
    const cleanUpdateData = {
      name: String(updateData.name),
      punjabiName: String(updateData.punjabiName || ''),
      description: String(updateData.description || ''),
      punjabiDescription: String(updateData.punjabiDescription || ''),
      price: Number(updateData.price),
      originalPrice: updateData.originalPrice ? Number(updateData.originalPrice) : undefined,
      category: String(updateData.category), // 'men', 'women', or 'kids'
      subcategory: updateData.subcategory ? String(updateData.subcategory) : undefined, // 'jutti' or 'fulkari'
      images: Array.isArray(updateData.images) ? updateData.images : [],
      sizes: Array.isArray(updateData.sizes) ? updateData.sizes : [],
      colors: Array.isArray(updateData.colors) ? updateData.colors : [],
      stock: Number(updateData.stock) || 0,
      stockQuantity: Number(updateData.stock) || 0, // For compatibility
      inStock: (updateData.stock || 0) > 0,
      isActive: updateData.isActive !== false,
      featured: updateData.featured === true,
      tags: Array.isArray(updateData.tags) ? updateData.tags : []
    }

    // Update product in local storage (primary)
    const updatedProduct = await productStorage.updateProduct(productId, cleanUpdateData)
    console.log('✅ Product updated in local storage:', productId)

    // Try to sync to AWS (optional)
    try {
      console.log('🔄 Attempting to sync to AWS...')
      const syncResult = await syncToAWS('update', updatedProduct, productId)
      console.log('📡 AWS sync result:', syncResult)
    } catch (syncError) {
      console.log('⚠️ AWS sync failed, but product updated locally:', syncError)
    }
    
    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully'
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
    await productStorage.deleteProduct(productId)
    console.log('✅ Product deleted from local storage:', productId)

    // Try to sync to AWS (optional)
    try {
      console.log('🔄 Attempting to sync delete to AWS...')
      const syncResult = await syncToAWS('delete', null, productId)
      console.log('📡 AWS delete sync result:', syncResult)
    } catch (syncError) {
      console.log('⚠️ AWS delete sync failed, but product deleted locally:', syncError)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      productId
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
