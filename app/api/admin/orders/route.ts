import { NextRequest, NextResponse } from 'next/server'

// Simple admin authentication (you can enhance this later)
const ADMIN_EMAILS = ['admin@punjabi-heritage.com', 'harshdevsingh2004@gmail.com']

// Simple admin verification - check multiple auth methods
const verifyAdmin = (request: NextRequest) => {
  // Method 1: Check x-user-email header
  const userEmail = request.headers.get('x-user-email')
  if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
    return true
  }
  
  // Method 2: Check Authorization header (Bearer token)
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // For now, accept any Bearer token for admin access
    // You can enhance this with proper JWT verification later
    return true
  }
  
  // Method 3: Check cookies (if using session-based auth)
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader && cookieHeader.includes('admin')) {
    return true
  }
  
  return false
}

// GET - Get all orders (admin only)
export async function GET(request: NextRequest) {
  try {
    // Simple admin verification
    if (!verifyAdmin(request)) {
      console.log('❌ Admin access denied for:', request.headers.get('x-user-email'))
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🔄 Admin fetching all orders...')
    
    // Get orders from shared storage
    const { orderStorage } = await import('@/lib/shared-storage')
    const orders = orderStorage.getAllOrders()
    
    console.log(`✅ Retrieved ${orders.length} orders for admin`)
    console.log('📋 Orders in storage:', orders.map(o => ({ 
      id: o._id, 
      orderNumber: o.orderNumber, 
      status: o.status,
      customerEmail: o.customerEmail 
    })))
    
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

// PUT - Update order status (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Simple admin verification
    if (!verifyAdmin(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { orderId, updates } = body

    if (!orderId || !updates) {
      return NextResponse.json(
        { success: false, error: 'Missing orderId or updates' },
        { status: 400 }
      )
    }

    console.log('🔄 Admin updating order:', orderId, updates)

    // Get order storage and update the order
    const { orderStorage } = await import('@/lib/shared-storage')
    
    // Debug: Check what orders exist
    const allOrders = orderStorage.getAllOrders()
    console.log('📋 All orders in storage:', allOrders.map(o => ({ id: o._id, orderNumber: o.orderNumber })))
    console.log('🔍 Looking for order ID:', orderId)
    
    const updatedOrder = orderStorage.updateOrder(orderId, updates)
    
    if (!updatedOrder) {
      console.log('❌ Order not found in storage')
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    console.log('✅ Order updated successfully in shared storage')
    
    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully'
    })

  } catch (error: any) {
    console.error('❌ Error updating order:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: 500 }
    )
  }
}