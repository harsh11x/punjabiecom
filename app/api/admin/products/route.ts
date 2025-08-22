import { NextRequest, NextResponse } from 'next/server'
import { 
  getAllProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  refreshProductsFromFile
} from '@/lib/simple-product-storage'

// AWS Sync Function (Disabled for now - using local storage only)
async function syncToAWS(action: string, product: any, productId?: string) {
  console.log(`🔄 AWS sync disabled - using local storage only: ${action}`)
  return { success: true, result: 'Local storage only' }
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
    console.log('Mapping: category =', productData.category, 'productType =', productData.productType, 'subcategory =', productData.subcategory)

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
      subcategory: productData.subcategory || productData.productType, // Map productType to subcategory
      images: Array.isArray(productData.images) ? productData.images : [],
      sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
      colors: Array.isArray(productData.colors) ? productData.colors : [],
      inStock: productData.inStock !== false,
      isActive: productData.isActive !== false, // Default to true (active)
      stockQuantity: Number(productData.stockQuantity) || 1,
      featured: productData.featured === true,
      tags: Array.isArray(productData.tags) ? productData.tags : [],
      // Add missing fields to match existing product structure
      punjabiName: productData.punjabiName || productData.name,
      punjabiDescription: productData.punjabiDescription || productData.description || '',
      rating: productData.rating || 0,
      reviews: productData.reviews || 0,
      badge: productData.badge || '',
      stock: Number(productData.stockQuantity) || 1 // Map stockQuantity to stock for consistency
    }

    console.log('Simple product data:', simpleProduct)
    console.log('Final mapping: category =', simpleProduct.category, 'subcategory =', simpleProduct.subcategory)

    // Try to add product to local storage
    console.log('📁 Attempting to add product to local storage...')
    const newProduct = await addProduct(simpleProduct)
    console.log('✅ Product added to local storage:', newProduct.id)

    // Force refresh storage from file to ensure consistency
    refreshProductsFromFile()
    console.log('🔄 Storage refreshed from file after adding product')

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
    console.log('Update data received:', { id: productId, name: updateData.name, price: updateData.price })

    // Validate required fields
    if (!updateData.name || updateData.price === undefined || updateData.price < 0) {
      return NextResponse.json(
        { success: false, error: 'Name and valid price are required' },
        { status: 400 }
      )
    }

    // Clean the update data
    const cleanUpdateData = {
      name: String(updateData.name),
      description: String(updateData.description || ''),
      price: Number(updateData.price),
      originalPrice: updateData.originalPrice ? Number(updateData.originalPrice) : undefined,
      category: String(updateData.category || 'general'),
      subcategory: updateData.subcategory || updateData.productType, // Map productType to subcategory
      images: Array.isArray(updateData.images) ? updateData.images : [],
      sizes: Array.isArray(updateData.sizes) ? updateData.sizes : [],
      colors: Array.isArray(updateData.colors) ? updateData.colors : [],
      inStock: updateData.inStock !== false,
      isActive: updateData.isActive !== false,
      stockQuantity: Number(updateData.stockQuantity) || 1,
      featured: updateData.featured === true,
      tags: Array.isArray(updateData.tags) ? updateData.tags : [],
      // Add missing fields to match existing product structure
      punjabiName: updateData.punjabiName || updateData.name,
      punjabiDescription: updateData.punjabiDescription || updateData.description || '',
      rating: updateData.rating || 0,
      reviews: updateData.reviews || 0,
      badge: updateData.badge || '',
      stock: Number(updateData.stockQuantity) || 1 // Map stockQuantity to stock for consistency
    }

    // Update product in local storage (primary)
    const updatedProduct = await updateProduct(productId, cleanUpdateData)
    console.log('✅ Product updated in local storage:', productId)

    // Force refresh storage from file to ensure consistency
    refreshProductsFromFile()
    console.log('🔄 Storage refreshed from file after update')

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
    console.log('🗑️ DELETE request received for admin products')
    
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')
    
    if (!productId) {
      console.log('❌ No product ID provided in DELETE request')
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    console.log('🗑️ Deleting product with ID:', productId)

    // Get current products count before deletion
    const currentProducts = await getAllProducts()
    console.log(`📊 Current products count: ${currentProducts.length}`)

    // Delete from local storage (primary)
    await deleteProduct(productId)
    console.log('✅ Product deleted from local storage:', productId)

    // Force refresh storage from file to ensure consistency
    refreshProductsFromFile()
    console.log('🔄 Storage refreshed from file after deletion')

    // Verify deletion by getting products again
    const productsAfterDeletion = await getAllProducts()
    console.log(`📊 Products count after deletion: ${productsAfterDeletion.length}`)

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
      productId,
      productsCount: productsAfterDeletion.length
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
