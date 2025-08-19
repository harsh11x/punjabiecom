import { NextRequest, NextResponse } from 'next/server'
import { getAllOrders, getOrder, updateOrderStatus } from '@/lib/order-storage'
import { verifyAdminToken } from '@/lib/admin-auth'

// GET - Get all orders (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🔄 Admin fetching all orders...')
    
    // Get orders from AWS
    const orders = await getAllOrders()
    
    console.log(`✅ Retrieved ${orders.length} orders from AWS`)
    
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
    // Verify admin authentication
    const admin = await verifyAdminToken(request)
    if (!admin) {
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

    // Validate update fields
    const allowedUpdates = ['status', 'paymentStatus', 'trackingNumber', 'estimatedDelivery', 'notes']
    const validUpdates: any = {}
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedUpdates.includes(key)) {
        validUpdates[key] = value
      }
    }

    if (Object.keys(validUpdates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid update fields provided' },
        { status: 400 }
      )
    }

    // Update order in AWS
    const updatedOrder = await updateOrderStatus(orderId, validUpdates)
    
    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found or update failed' },
        { status: 404 }
      )
    }

    console.log('✅ Order updated successfully:', orderId)
    
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