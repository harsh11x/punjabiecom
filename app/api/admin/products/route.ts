import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

// Auth middleware
function verifyAdminToken(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value
  if (!token) {
    throw new Error('No token provided')
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'punjab-admin-secret-key')
  return decoded
}

// Data file paths
const DATA_DIR = path.resolve(process.cwd(), 'data')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

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

function saveProducts(products: any[]) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8')
  } catch (error) {
    console.error('Error saving products:', error)
    throw error
  }
}

// GET - Fetch all products for admin
export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request)
    
    const products = getProducts()
    
    return NextResponse.json({
      success: true,
      products: products,
      total: products.length
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
    const products = getProducts()
    
    // Validate required fields
    if (!productData.name || !productData.description || !productData.price || 
        !productData.category || !productData.productType || !productData.sizes || 
        productData.sizes.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, description, price, category, productType, and sizes are required' },
        { status: 400 }
      )
    }

    const newProduct = {
      id: Date.now().toString(),
      name: productData.name,
      punjabiName: productData.punjabiName || '',
      description: productData.description,
      punjabiDescription: productData.punjabiDescription || '',
      price: parseFloat(productData.price),
      originalPrice: parseFloat(productData.originalPrice || 0),
      category: productData.category, // men, women, kids
      productType: productData.productType, // jutti or fulkari
      images: productData.images || [],
      sizes: productData.sizes || [],
      stock: parseInt(productData.stock) || 0,
      isActive: productData.isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    products.push(newProduct)
    saveProducts(products)
    
    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
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
    const { _id, ...productData } = updateData
    
    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    const products = getProducts()
    const productIndex = products.findIndex((p: any) => p.id === _id)
    
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    const updatedProduct = {
      ...products[productIndex],
      ...productData,
      price: parseFloat(productData.price),
      originalPrice: parseFloat(productData.originalPrice || productData.price),
      stock: parseInt(productData.stock) || 0,
      rating: parseFloat(productData.rating) || products[productIndex].rating,
      reviews: parseInt(productData.reviews) || products[productIndex].reviews,
      updatedAt: new Date().toISOString()
    }
    
    products[productIndex] = updatedProduct
    saveProducts(products)
    
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
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
    
    const products = getProducts()
    const filteredProducts = products.filter((p: any) => p.id !== productId)
    
    if (filteredProducts.length === products.length) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    saveProducts(filteredProducts)
    
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
