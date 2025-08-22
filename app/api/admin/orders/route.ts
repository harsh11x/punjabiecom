import { NextRequest, NextResponse } from 'next/server'

// Simple admin authentication (you can enhance this later)
const ADMIN_EMAILS = ['admin@punjabi-heritage.com', 'harshdevsingh2004@gmail.com']

// Simple admin verification
const verifyAdmin = (request: NextRequest) => {
  const userEmail = request.headers.get('x-user-email')
  return userEmail && ADMIN_EMAILS.includes(userEmail)
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

    // For now, return success (you can enhance this later)
    console.log('✅ Order update request received (not yet implemented)')
    
    return NextResponse.json({
      success: true,
      data: { _id: orderId, ...updates },
      message: 'Order update request received'
    })

  } catch (error: any) {
    console.error('❌ Error updating order:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: 500 }
    )
  }
}