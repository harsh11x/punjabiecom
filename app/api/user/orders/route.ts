import { NextRequest, NextResponse } from 'next/server'
import { getOrdersByEmail, getOrderByNumber, AWSOrder } from '@/lib/order-storage'
import { verifyFirebaseToken } from '@/lib/firebase-admin'

// Use AWSOrder type for consistency
type Order = AWSOrder

// GET - Get user's orders
export async function GET(request: NextRequest) {
  try {
    // Verify user authentication
    const user = await verifyFirebaseToken(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')
    const customerEmail = user.email

    if (!customerEmail) {
      return NextResponse.json(
        { success: false, error: 'User email not found' },
        { status: 400 }
      )
    }

    console.log('🔄 User fetching orders for:', customerEmail)

    let orders: Order[] = []

    if (orderNumber) {
      // Get specific order by order number
      const order = await getOrderByNumber(orderNumber)
      if (order && order.customerEmail === customerEmail) {
        orders = [order]
      }
    } else {
      // Get all orders for the user
      orders = await getOrdersByEmail(customerEmail)
    }

    console.log(`✅ Retrieved ${orders.length} orders for user`)

    // Transform orders for user view (remove sensitive info)
    const userOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
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
      updatedAt: order.updatedAt
    }))

    return NextResponse.json({
      success: true,
      data: userOrders,
      total: userOrders.length
    })

  } catch (error: any) {
    console.error('❌ Error fetching user orders:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
