import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import { auth } from '@/lib/firebase-admin'

// GET - Fetch orders for authenticated user
export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No authorization token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    
    // Verify the Firebase token
    let decodedToken
    try {
      decodedToken = await auth.verifyIdToken(token)
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid authorization token' },
        { status: 401 }
      )
    }

    const userEmail = decodedToken.email
    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: 'User email not found in token' },
        { status: 400 }
      )
    }

    await connectDB()
    
    // Fetch orders for the user
    const orders = await Order.find({ 
      customerEmail: userEmail.toLowerCase() 
    })
    .sort({ createdAt: -1 })
    .lean()

    // Transform orders to include tracking information
    const transformedOrders = orders.map((order: any) => ({
      _id: order._id.toString(),
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      total: order.total,
      items: order.items,
      shippingAddress: order.shippingAddress,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      deliveredAt: order.deliveredAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      // Add tracking status based on order status
      trackingStatus: getTrackingStatus(order.status),
      trackingColor: getTrackingColor(order.status)
    }))

    return NextResponse.json({
      success: true,
      orders: transformedOrders
    })

  } catch (error: any) {
    console.error('Error fetching user orders:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// Helper function to get tracking status
function getTrackingStatus(status: string): string {
  switch (status) {
    case 'pending':
      return 'Order Placed'
    case 'confirmed':
      return 'Order Confirmed'
    case 'processing':
      return 'Processing'
    case 'shipped':
      return 'Shipped'
    case 'delivered':
      return 'Delivered'
    case 'cancelled':
      return 'Cancelled'
    case 'refunded':
      return 'Refunded'
    case 'return_requested':
      return 'Return Requested'
    case 'return_approved':
      return 'Return Approved'
    case 'return_rejected':
      return 'Return Rejected'
    case 'returned':
      return 'Returned'
    default:
      return 'Unknown'
  }
}

// Helper function to get tracking color
function getTrackingColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'confirmed':
      return 'bg-blue-100 text-blue-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    case 'shipped':
      return 'bg-purple-100 text-purple-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'refunded':
      return 'bg-gray-100 text-gray-800'
    case 'return_requested':
      return 'bg-orange-100 text-orange-800'
    case 'return_approved':
      return 'bg-green-100 text-green-800'
    case 'return_rejected':
      return 'bg-red-100 text-red-800'
    case 'returned':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
