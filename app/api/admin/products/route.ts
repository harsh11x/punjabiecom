import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import { revalidatePath } from 'next/cache'

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
    
    await connectDB()
    const products = await Product.find({}).sort({ createdAt: -1 }).lean()
    
    // Transform MongoDB documents to match admin interface
    const formattedProducts = products.map((product: any) => ({
      _id: product._id?.toString(),
      id: product._id?.toString(),
      name: product.name,
      punjabiName: product.punjabiName,
      description: product.description,
      punjabiDescription: product.punjabiDescription,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      subcategory: product.subcategory,
      images: product.images,
      colors: product.colors,
      sizes: product.sizes,
      stock: product.stock,
      rating: product.rating,
      reviews: product.reviews,
      badge: product.badge,
      badgeEn: product.badgeEn,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }))
    
    return NextResponse.json({
      success: true,
      products: formattedProducts,
      total: formattedProducts.length
    })
  } catch (error: any) {
    console.error('Error fetching products:', error)
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
    
    // Validate required fields
    if (!productData.name || !productData.description || !productData.price || 
        !productData.category || !productData.sizes || 
        productData.sizes.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, description, price, category, and sizes are required' },
        { status: 400 }
      )
    }

    await connectDB()

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

    const newProduct = new Product({
      name: productData.name,
      punjabiName: productData.punjabiName || productData.name,
      description: productData.description,
      punjabiDescription: productData.punjabiDescription || productData.description,
      price: parseFloat(productData.price),
      originalPrice: parseFloat(productData.originalPrice || productData.price),
      category: category,
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
    })
    
    const savedProduct = await newProduct.save()
    
    // Revalidate product pages to clear cache
    try {
      revalidatePath('/')
      revalidatePath('/products')
      revalidatePath(`/${category}`)
      if (subcategory) {
        revalidatePath(`/${category}/${subcategory}`)
      }
    } catch (revalidateError) {
      console.warn('Failed to revalidate paths:', revalidateError)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: {
        _id: savedProduct._id.toString(),
        id: savedProduct._id.toString(),
        ...savedProduct.toObject()
      }
    })
  } catch (error: any) {
    console.error('Error creating product:', error)
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
    
    await connectDB()
    
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
    
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { ...productData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean()
    
    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
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
    } catch (revalidateError) {
      console.warn('Failed to revalidate paths:', revalidateError)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: {
        _id: (updatedProduct as any)._id.toString(),
        id: (updatedProduct as any)._id.toString(),
        ...updatedProduct
      }
    })
  } catch (error: any) {
    console.error('Error updating product:', error)
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
    
    await connectDB()
    
    const deletedProduct = await Product.findByIdAndDelete(productId)
    
    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Revalidate product pages to clear cache
    try {
      revalidatePath('/')
      revalidatePath('/products')
      const category = (deletedProduct as any).category
      const subcategory = (deletedProduct as any).subcategory
      if (category) {
        revalidatePath(`/${category}`)
        if (subcategory) {
          revalidatePath(`/${category}/${subcategory}`)
        }
      }
    } catch (revalidateError) {
      console.warn('Failed to revalidate paths:', revalidateError)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete product' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    )
  }
}
