import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '@/lib/product-manager'
import { revalidatePath } from 'next/cache'

// AWS Sync Configuration
const AWS_SYNC_SERVER_URL = process.env.AWS_SYNC_SERVER_URL || 'http://3.111.208.77:3001'
const AWS_SYNC_SECRET = process.env.AWS_SYNC_SECRET || 'punjabi-heritage-sync-secret-2024'

// Function to sync with AWS server
async function syncToAWS(action: 'add' | 'update' | 'delete', productData: any) {
  try {
    console.log(`🔄 Syncing to AWS: ${action}`, productData.name || productData.id)
    
    const response = await fetch(`${AWS_SYNC_SERVER_URL}/api/sync/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AWS_SYNC_SECRET}`
      },
      body: JSON.stringify({
        action: action,
        product: productData
      })
    })

    if (response.ok) {
      const result = await response.json()
      if (result.success) {
        console.log(`✅ AWS sync successful: ${action}`)
        return true
      } else {
        console.error(`❌ AWS sync failed: ${result.error}`)
        return false
      }
    } else {
      console.error(`❌ AWS sync HTTP error: ${response.status}`)
      return false
    }
  } catch (error) {
    console.error('❌ AWS sync error:', error)
    return false
  }
}

// Auth middleware
function verifyAdminToken(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value
  if (!token) {
    throw new Error('No token provided')
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'punjab-admin-secret-key')
  return decoded
}

// GET - Fetch all products for admin
export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request)
    
    console.log('🔍 Admin fetching all products...')
    const products = await getAllProducts()
    
    // Include inactive products for admin
    const allProducts = products // Admin should see all products
    
    console.log(`✅ Admin retrieved ${allProducts.length} products`)
    
    return NextResponse.json({
      success: true,
      products: allProducts,
      total: allProducts.length
    })
  } catch (error: any) {
    console.error('❌ Error fetching products for admin:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    )
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    verifyAdminToken(request)
    
    const productData = await request.json()
    console.log('📝 Admin creating new product:', productData.name)
    
    // Validate required fields
    if (!productData.name || !productData.description || !productData.price || 
        !productData.category || !productData.sizes || 
        productData.sizes.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, description, price, category, and sizes are required' },
        { status: 400 }
      )
    }

    // Map category and productType to the correct format
    let category = productData.category
    let subcategory = productData.subcategory || ''
    
    // Handle legacy productType field
    if (productData.productType) {
      if (productData.productType === 'phulkari') {
        category = 'phulkari'
      } else if (productData.productType === 'jutti') {
        subcategory = 'jutti'
      }
    }

    const newProductData = {
      name: productData.name,
      punjabiName: productData.punjabiName || productData.name,
      description: productData.description,
      punjabiDescription: productData.punjabiDescription || productData.description,
      price: parseFloat(productData.price),
      originalPrice: parseFloat(productData.originalPrice || productData.price),
      category: category as 'men' | 'women' | 'kids' | 'phulkari',
      subcategory: subcategory,
      images: productData.images || ['/placeholder.svg'],
      colors: productData.colors || ['Default'],
      sizes: productData.sizes || ['One Size'],
      stock: parseInt(productData.stock) || 0,
      rating: parseFloat(productData.rating) || 4.5,
      reviews: parseInt(productData.reviews) || 0,
      badge: productData.badge || '',
      badgeEn: productData.badgeEn || '',
      isActive: productData.isActive !== false
    }
    
    const savedProduct = await addProduct(newProductData)
    console.log('✅ Product created successfully:', savedProduct.name)
    
    // Sync to AWS server
    const awsSyncSuccess = await syncToAWS('add', savedProduct)
    if (!awsSyncSuccess) {
      console.warn('⚠️ AWS sync failed, but product was saved locally')
    }
    
    // Revalidate product pages to clear cache
    try {
      revalidatePath('/')
      revalidatePath('/products')
      revalidatePath(`/${category}`)
      if (subcategory) {
        revalidatePath(`/${category}/${subcategory}`)
      }
      console.log('🔄 Cache revalidated for product pages')
    } catch (revalidateError) {
      console.warn('⚠️ Failed to revalidate paths:', revalidateError)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: savedProduct,
      awsSync: awsSyncSuccess
    })
  } catch (error: any) {
    console.error('❌ Error creating product:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    )
  }
}

// PUT - Update product
export async function PUT(request: NextRequest) {
  try {
    verifyAdminToken(request)
    
    const updateData = await request.json()
    const { _id, id, ...productData } = updateData
    
    const productId = _id || id
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    console.log('📝 Admin updating product:', productId)
    
    // Map category and productType to the correct format
    if (productData.productType) {
      if (productData.productType === 'phulkari') {
        productData.category = 'phulkari'
        delete productData.productType
      } else if (productData.productType === 'jutti') {
        productData.subcategory = 'jutti'
        delete productData.productType
      }
    }

    // Ensure numeric fields are properly converted
    if (productData.price) productData.price = parseFloat(productData.price)
    if (productData.originalPrice) productData.originalPrice = parseFloat(productData.originalPrice)
    if (productData.stock) productData.stock = parseInt(productData.stock)
    if (productData.rating) productData.rating = parseFloat(productData.rating)
    if (productData.reviews) productData.reviews = parseInt(productData.reviews)
    
    const updatedProduct = await updateProduct(productId, productData)
    console.log('✅ Product updated successfully:', updatedProduct.name)
    
    // Sync to AWS server
    const awsSyncSuccess = await syncToAWS('update', updatedProduct)
    if (!awsSyncSuccess) {
      console.warn('⚠️ AWS sync failed, but product was updated locally')
    }
    
    // Revalidate product pages to clear cache
    try {
      revalidatePath('/')
      revalidatePath('/products')
      const category = (updatedProduct as any).category
      const subcategory = (updatedProduct as any).subcategory
      if (category) {
        revalidatePath(`/${category}`)
        if (subcategory) {
          revalidatePath(`/${category}/${subcategory}`)
        }
      }
      console.log('🔄 Cache revalidated for product pages')
    } catch (revalidateError) {
      console.warn('⚠️ Failed to revalidate paths:', revalidateError)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
      awsSync: awsSyncSuccess
    })
  } catch (error: any) {
    console.error('❌ Error updating product:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update product' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    )
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  try {
    verifyAdminToken(request)
    
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    console.log('🗑️ Admin deleting product:', productId)
    
    await deleteProduct(productId)
    console.log('✅ Product deleted successfully')
    
    // Sync to AWS server
    const awsSyncSuccess = await syncToAWS('delete', { id: productId })
    if (!awsSyncSuccess) {
      console.warn('⚠️ AWS sync failed, but product was deleted locally')
    }
    
    // Revalidate product pages to clear cache
    try {
      revalidatePath('/')
      revalidatePath('/products')
      revalidatePath('/men')
      revalidatePath('/women')
      revalidatePath('/kids')
      revalidatePath('/phulkari')
      console.log('🔄 Cache revalidated for all product pages')
    } catch (revalidateError) {
      console.warn('⚠️ Failed to revalidate paths:', revalidateError)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      awsSync: awsSyncSuccess
    })
  } catch (error: any) {
    console.error('❌ Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete product' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    )
  }
}
