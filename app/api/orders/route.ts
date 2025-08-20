import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Local file storage
const DATA_DIR = path.resolve(process.cwd(), 'data')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

function getOrdersFromFile() {
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf8')
    return []
  }
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading orders from file:', error)
    return []
  }
}

function saveOrdersToFile(orders: any[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8')
  } catch (error) {
    console.error('Error saving orders to file:', error)
    throw error
  }
}

// GET - Fetch user's orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    const orderNumber = searchParams.get('orderNumber')
    const customerEmail = searchParams.get('email') || 
                         request.headers.get('x-user-email')
    
    const orders = getOrdersFromFile()
    let filteredOrders = orders
    
    if (orderId) {
      filteredOrders = orders.filter((order: any) => order._id === orderId)
    } else if (orderNumber) {
      filteredOrders = orders.filter((order: any) => order.orderNumber === orderNumber)
    } else if (customerEmail) {
      filteredOrders = orders.filter((order: any) => 
        order.customerEmail.toLowerCase() === customerEmail.toLowerCase()
      )
    }
    
    console.log(`✅ Retrieved ${filteredOrders.length} orders from local storage`)
    
    return NextResponse.json({
      success: true,
      data: filteredOrders
    })
    
  } catch (error: any) {
    console.error('❌ Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    console.log('🔥 Creating new order...')
    const orderData = await request.json()
    console.log('Order data received:', JSON.stringify(orderData, null, 2))
    
    // Validate required fields
    if (!orderData.customerEmail || !orderData.items || !orderData.shippingAddress) {
      console.error('❌ Missing required fields:', {
        customerEmail: !!orderData.customerEmail,
        items: !!orderData.items,
        shippingAddress: !!orderData.shippingAddress
      })
      return NextResponse.json(
        { success: false, error: 'Missing required fields: customerEmail, items, shippingAddress' },
        { status: 400 }
      )
    }
    
    console.log('✅ Required fields validation passed')
    
    // Use local file storage
    try {
      console.log('🔄 Saving order to local file storage...')
      
      // Create order object
      const newOrder = {
        _id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        orderNumber: `PH${Date.now()}${Math.random().toString(36).substring(2, 4).toUpperCase()}`,
        customerEmail: orderData.customerEmail,
        items: orderData.items,
        subtotal: orderData.subtotal || 0,
        shippingCost: orderData.shippingCost || 0,
        tax: orderData.tax || 0,
        total: orderData.total || orderData.subtotal || 0,
        status: orderData.status || 'pending',
        paymentStatus: orderData.paymentStatus || 'pending',
        paymentMethod: orderData.paymentMethod || 'razorpay',
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress || orderData.shippingAddress,
        notes: orderData.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Save to local file
      const orders = getOrdersFromFile()
      orders.push(newOrder)
      saveOrdersToFile(orders)
      
      console.log('✅ Order saved to local file storage successfully:', newOrder._id)
      
      return NextResponse.json({
        success: true,
        data: newOrder
      })
      
    } catch (fileError) {
      console.error('❌ Failed to save to local file storage:', fileError)
      throw new Error('Failed to save order to local storage system')
    }
    
  } catch (error: any) {
    console.error('❌ Error creating order:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}

// PUT - Update order status
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    const updateData = await request.json()
    const orders = getOrdersFromFile()
    const orderIndex = orders.findIndex((order: any) => order._id === orderId)
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Update order
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    saveOrdersToFile(orders)
    
    console.log('✅ Order updated successfully:', orderId)
    
    return NextResponse.json({
      success: true,
      data: orders[orderIndex]
    })
    
  } catch (error: any) {
    console.error('❌ Error updating order:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: 500 }
    )
  }
}
