import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for orders (resets on Vercel function restart, but works for demo)
let orders: any[] = []

// Generate unique order ID
const generateOrderId = () => `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

// Generate unique order number
const generateOrderNumber = () => `PH${Date.now()}${Math.random().toString(36).substring(2, 4).toUpperCase()}`

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
    
    // Create order object
    const newOrder = {
      _id: generateOrderId(),
      orderNumber: generateOrderNumber(),
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
    
    // Save to in-memory array
    orders.push(newOrder)
    
    console.log('✅ Order created successfully:', newOrder._id)
    console.log('📊 Total orders in memory:', orders.length)
    
    return NextResponse.json({
      success: true,
      data: newOrder
    })
    
  } catch (error: any) {
    console.error('❌ Error creating order:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    const orderNumber = searchParams.get('orderNumber')
    const customerEmail = searchParams.get('email') || 
                         request.headers.get('x-user-email')
    
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
    
    console.log(`✅ Retrieved ${filteredOrders.length} orders from memory`)
    
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

// Health check endpoint
export async function HEAD() {
  return NextResponse.json({ 
    status: 'healthy', 
    ordersCount: orders.length,
    timestamp: new Date().toISOString()
  })
}
