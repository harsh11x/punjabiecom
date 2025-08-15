import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import fs from 'fs'
import path from 'path'

// Fallback file storage
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
    
    let orders: any[] = []
    
    // Try MongoDB first
    try {
      await connectDB()
      
      let query: any = {}
      
      if (orderId) {
        query._id = orderId
      } else if (orderNumber) {
        query.orderNumber = orderNumber
      } else if (customerEmail) {
        query.customerEmail = customerEmail.toLowerCase()
      }
      
      const mongoOrders = await Order.find(query)
        .sort({ createdAt: -1 })
        .lean()
      
      orders = mongoOrders.map((order: any) => ({
        _id: order._id.toString(),
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail,
        items: order.items,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        tax: order.tax,
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery,
        deliveredAt: order.deliveredAt,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        cancelledAt: order.cancelledAt,
        cancellationReason: order.cancellationReason,
        returnRequestedAt: order.returnRequestedAt,
        returnReason: order.returnReason,
        returnStatus: order.returnStatus
      }))
      
      console.log(`✅ Retrieved ${orders.length} orders from MongoDB`)
      
    } catch (error) {
      console.warn('⚠️ MongoDB not available, falling back to file storage:', error)
      
      // Fallback to file storage
      const fileOrders = getOrdersFromFile()
      
      if (orderId || orderNumber) {
        const order = fileOrders.find((o: any) => 
          o._id === orderId || o.orderNumber === orderNumber
        )
        orders = order ? [order] : []
      } else if (customerEmail) {
        orders = fileOrders.filter((o: any) => 
          o.customerInfo?.email?.toLowerCase() === customerEmail.toLowerCase()
        )
      } else {
        orders = fileOrders
      }
      
      console.log(`📁 Retrieved ${orders.length} orders from file storage`)
    }
    
    // If fetching specific order
    if (orderId || orderNumber) {
      const order = orders[0]
      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        data: order
      })
    }
    
    // Return orders
    return NextResponse.json({
      success: true,
      data: orders,
      total: orders.length
    })
    
  } catch (error: any) {
    console.error('❌ Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST - Create new order (used by payment system)
export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    
    // Validate required fields
    if (!orderData.customerEmail || !orderData.items || !orderData.shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: customerEmail, items, shippingAddress' },
        { status: 400 }
      )
    }
    
    let savedOrder: any = null
    
    // Try to save to MongoDB first
    try {
      await connectDB()
      
      const order = new Order({
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
        notes: orderData.notes || ''
      })
      
      const mongoOrder = await order.save()
      savedOrder = {
        _id: mongoOrder._id.toString(),
        orderNumber: mongoOrder.orderNumber,
        ...mongoOrder.toObject()
      }
      
      console.log('✅ Order saved to MongoDB:', savedOrder.orderNumber)
      
    } catch (error) {
      console.warn('⚠️ Failed to save to MongoDB:', error)
    }
    
    // Save to file storage as backup
    try {
      const fileOrders = getOrdersFromFile()
      
      const fileOrder = savedOrder || {
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
      
      fileOrders.push(fileOrder)
      saveOrdersToFile(fileOrders)
      
      console.log('✅ Order saved to file storage')
      
      return NextResponse.json({
        success: true,
        data: savedOrder || fileOrder
      })
      
    } catch (error) {
      console.error('❌ Failed to save to file storage:', error)
      
      if (savedOrder) {
        return NextResponse.json({
          success: true,
          data: savedOrder
        })
      }
      
      throw new Error('Failed to save order to any storage')
    }
    
  } catch (error: any) {
    console.error('❌ Error creating order:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}
