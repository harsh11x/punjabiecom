import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import jwt from 'jsonwebtoken'

// Helper function to verify user token
function verifyUserToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw new Error('No authentication token provided')
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'punjab-admin-secret-key')
  return decoded
}

// GET - Get specific order details
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const orderId = params.id
    
    await connectDB()
    
    const order = await Order.findById(orderId).lean()
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Add tracking information
    const trackingInfo = generateTrackingInfo(order as any)
    
    return NextResponse.json({
      success: true,
      data: {
        ...order,
        _id: (order as any)._id.toString(),
        tracking: trackingInfo
      }
    })
    
  } catch (error: any) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

// PUT - Update order (cancel, return request, etc.)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const orderId = params.id
    
    await connectDB()
    
    const body = await request.json()
    const { action, reason, returnItems } = body
    
    const order = await Order.findById(orderId)
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    let updateData: any = {}
    let message = ''
    
    switch (action) {
      case 'cancel':
        if (!['pending', 'confirmed'].includes(order.status)) {
          return NextResponse.json(
            { success: false, error: 'Order cannot be cancelled at this stage' },
            { status: 400 }
          )
        }
        
        updateData = {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancellationReason: reason,
          paymentStatus: order.paymentStatus === 'paid' ? 'refund_pending' : 'cancelled'
        }
        message = 'Order cancelled successfully'
        break
        
      case 'return_request':
        if (!['delivered'].includes(order.status)) {
          return NextResponse.json(
            { success: false, error: 'Returns can only be requested for delivered orders' },
            { status: 400 }
          )
        }
        
        // Check if return window is still open (30 days)
        const deliveredDate = order.deliveredAt || order.updatedAt
        const daysSinceDelivery = Math.floor((Date.now() - new Date(deliveredDate).getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysSinceDelivery > 30) {
          return NextResponse.json(
            { success: false, error: 'Return window has expired (30 days)' },
            { status: 400 }
          )
        }
        
        updateData = {
          status: 'return_requested',
          returnRequestedAt: new Date(),
          returnReason: reason,
          returnItems: returnItems || order.items,
          returnStatus: 'pending'
        }
        message = 'Return request submitted successfully'
        break
        
      case 'track':
        // Just return current tracking info
        const trackingInfo = generateTrackingInfo(order)
        return NextResponse.json({
          success: true,
          data: { tracking: trackingInfo },
          message: 'Tracking information retrieved'
        })
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).lean()
    
    return NextResponse.json({
      success: true,
      data: {
        ...updatedOrder,
        _id: (updatedOrder as any)._id.toString()
      },
      message
    })
    
  } catch (error: any) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: 500 }
    )
  }
}

// Generate tracking information based on order status
function generateTrackingInfo(order: any) {
  const baseTracking = [
    {
      status: 'Order Placed',
      description: 'Your order has been placed successfully',
      timestamp: order.createdAt,
      completed: true,
      icon: '📝'
    }
  ]
  
  if (order.paymentStatus === 'paid') {
    baseTracking.push({
      status: 'Payment Confirmed',
      description: 'Payment has been confirmed',
      timestamp: order.updatedAt,
      completed: true,
      icon: '💳'
    })
  }
  
  if (['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)) {
    baseTracking.push({
      status: 'Order Confirmed',
      description: 'Your order has been confirmed and is being prepared',
      timestamp: order.updatedAt,
      completed: true,
      icon: '✅'
    })
  }
  
  if (['processing', 'shipped', 'delivered'].includes(order.status)) {
    baseTracking.push({
      status: 'Processing',
      description: 'Your order is being processed and packed',
      timestamp: order.updatedAt,
      completed: true,
      icon: '📦'
    })
  }
  
  if (['shipped', 'delivered'].includes(order.status)) {
    baseTracking.push({
      status: 'Shipped',
      description: `Your order has been shipped${order.trackingNumber ? ` (Tracking: ${order.trackingNumber})` : ''}`,
      timestamp: order.updatedAt,
      completed: true,
      icon: '🚚'
    })
  }
  
  if (order.status === 'delivered') {
    baseTracking.push({
      status: 'Delivered',
      description: 'Your order has been delivered successfully',
      timestamp: order.deliveredAt || order.updatedAt,
      completed: true,
      icon: '🎉'
    })
  }
  
  // Add future steps if not completed
  if (!['delivered', 'cancelled', 'refunded'].includes(order.status)) {
    const futureSteps = []
    
    if (!['processing', 'shipped', 'delivered'].includes(order.status)) {
      futureSteps.push({
        status: 'Processing',
        description: 'Order will be processed and packed',
        timestamp: null,
        completed: false,
        icon: '📦'
      })
    }
    
    if (!['shipped', 'delivered'].includes(order.status)) {
      futureSteps.push({
        status: 'Shipped',
        description: 'Order will be shipped to your address',
        timestamp: null,
        completed: false,
        icon: '🚚'
      })
    }
    
    if (order.status !== 'delivered') {
      futureSteps.push({
        status: 'Delivered',
        description: 'Order will be delivered to your doorstep',
        timestamp: order.estimatedDelivery || null,
        completed: false,
        icon: '🎉'
      })
    }
    
    baseTracking.push(...futureSteps)
  }
  
  // Handle special statuses
  if (order.status === 'cancelled') {
    baseTracking.push({
      status: 'Cancelled',
      description: `Order cancelled${order.cancellationReason ? `: ${order.cancellationReason}` : ''}`,
      timestamp: order.cancelledAt || order.updatedAt,
      completed: true,
      icon: '❌'
    })
  }
  
  if (order.status === 'return_requested') {
    baseTracking.push({
      status: 'Return Requested',
      description: `Return request submitted${order.returnReason ? `: ${order.returnReason}` : ''}`,
      timestamp: order.returnRequestedAt || order.updatedAt,
      completed: true,
      icon: '↩️'
    })
  }
  
  return {
    currentStatus: order.status,
    estimatedDelivery: order.estimatedDelivery,
    trackingNumber: order.trackingNumber,
    steps: baseTracking,
    canCancel: ['pending', 'confirmed'].includes(order.status),
    canReturn: order.status === 'delivered' && 
               (!order.deliveredAt || 
                Math.floor((Date.now() - new Date(order.deliveredAt).getTime()) / (1000 * 60 * 60 * 24)) <= 30)
  }
}
