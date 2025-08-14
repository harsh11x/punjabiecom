import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Data file paths
const DATA_DIR = path.resolve(process.cwd(), 'data')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

function getOrders() {
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf8')
    return []
  }
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading orders:', error)
    return []
  }
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

function saveOrders(orders: any[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8')
  } catch (error) {
    console.error('Error saving orders:', error)
    throw error
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

function generateOrderNumber() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const time = String(now.getTime()).slice(-6) // Last 6 digits of timestamp
  return `PH-${year}${month}${day}-${time}`
}

function generateOrderId() {
  return `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// GET - Fetch orders (for customer)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    const orderNumber = searchParams.get('orderNumber')
    
    const orders = getOrders()
    
    // If fetching specific order
    if (orderId || orderNumber) {
      const order = orders.find((o: any) => 
        o._id === orderId || o.orderNumber === orderNumber
      )
      
      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        order
      })
    }
    
    // Return all orders (sorted by newest first)
    const sortedOrders = orders.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    return NextResponse.json({
      success: true,
      orders: sortedOrders
    })
    
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST - Create new order from customer checkout
export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    
    // Validate required fields
    const requiredFields = ['customerInfo', 'items', 'total', 'paymentMethod']
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate customer info
    const { customerInfo } = orderData
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      return NextResponse.json(
        { success: false, error: 'Complete customer information is required' },
        { status: 400 }
      )
    }

    // Validate items
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one item is required' },
        { status: 400 }
      )
    }

    const orders = getOrders()
    const products = getProducts()
    
    // Check stock availability and update products
    for (const item of orderData.items) {
      const productIndex = products.findIndex((p: any) => p.id === item.productId)
      if (productIndex === -1) {
        return NextResponse.json(
          { success: false, error: `Product ${item.name} not found` },
          { status: 400 }
        )
      }
      
      const product = products[productIndex]
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${item.name}. Only ${product.stock} available.` },
          { status: 400 }
        )
      }
      
      // Reduce stock
      products[productIndex].stock -= item.quantity
      products[productIndex].updatedAt = new Date().toISOString()
    }
    
    // Save updated products
    saveProducts(products)
    
    // Create new order
    const newOrder = {
      _id: generateOrderId(),
      orderNumber: generateOrderNumber(),
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: {
          street: customerInfo.address.street,
          city: customerInfo.address.city,
          state: customerInfo.address.state,
          pincode: customerInfo.address.pincode,
          country: customerInfo.address.country || 'India'
        }
      },
      items: orderData.items.map((item: any) => ({
        productId: item.productId,
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        size: item.size || '',
        color: item.color || '',
        image: item.image || ''
      })),
      total: parseFloat(orderData.total),
      subtotal: parseFloat(orderData.subtotal || orderData.total),
      tax: parseFloat(orderData.tax || 0),
      shipping: parseFloat(orderData.shipping || 0),
      discount: parseFloat(orderData.discount || 0),
      status: 'pending',
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'COD' ? 'pending' : orderData.paymentStatus || 'pending',
      trackingNumber: '',
      notes: orderData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add to orders array
    orders.push(newOrder)
    saveOrders(orders)

    // Return success with order details
    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}
