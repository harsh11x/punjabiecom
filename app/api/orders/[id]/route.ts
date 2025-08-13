import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import { requireAuth } from '@/lib/auth-middleware'
import { requireAdmin } from '@/lib/auth-middleware'
import { NotificationService } from '@/lib/notifications'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request)
    await connectDB()
    
    const order = await Order.findById(params.id)
      .populate('items.product', 'name punjabiName images')
      .lean()
    
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
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin for order updates
    await requireAdmin(request)
    await connectDB()
    
    const body = await request.json()
    const { orderStatus, trackingId, shippingProvider, adminNotes, estimatedDelivery, deliveredAt } = body
    
    // Find the order
    const order = await Order.findById(params.id)
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Prepare update object
    const updates: any = {}
    
    if (orderStatus) {
      updates.orderStatus = orderStatus
      
      // Set deliveredAt when status changes to delivered
      if (orderStatus === 'delivered' && !order.deliveredAt) {
        updates.deliveredAt = new Date()
      }
    }
    
    if (trackingId !== undefined) {
      updates.trackingId = trackingId
    }
    
    if (shippingProvider !== undefined) {
      updates.shippingProvider = shippingProvider
    }
    
    if (adminNotes !== undefined) {
      updates.adminNotes = adminNotes
    }
    
    if (estimatedDelivery) {
      updates.estimatedDelivery = new Date(estimatedDelivery)
    }
    
    if (deliveredAt) {
      updates.deliveredAt = new Date(deliveredAt)
    }
    
    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('items.product', 'name punjabiName images')
    
    // Send notifications to customer
    const notificationData = {
      customerName: order.customer.fullName,
      customerEmail: order.customer.email,
      customerPhone: order.customer.phone,
      orderNumber: order.orderNumber,
      orderStatus: orderStatus || order.orderStatus,
      trackingId: trackingId || order.trackingId,
      shippingProvider: shippingProvider || order.shippingProvider,
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery).toLocaleDateString() : undefined
    }
    
    // Send notification when order status changes
    if (orderStatus && orderStatus !== order.orderStatus) {
      try {
        const notificationResult = await NotificationService.sendNotifications(notificationData)
        console.log('Order status notification sent:', notificationResult)
      } catch (error) {
        console.error('Failed to send order status notification:', error)
      }
    }
    
    // Send notification when tracking info is updated
    if (trackingId && trackingId !== order.trackingId) {
      try {
        const trackingResult = await NotificationService.sendTrackingUpdate(notificationData)
        console.log('Tracking update notification sent:', trackingResult)
      } catch (error) {
        console.error('Failed to send tracking update notification:', error)
      }
    }
    
    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating order:', error)
    
    if (error.message === 'Admin access required' || error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      )
    }
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(request)
    await connectDB()
    
    const order = await Order.findById(params.id)
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Only allow deletion of pending or cancelled orders
    if (!['pending', 'cancelled'].includes(order.orderStatus)) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete orders that are not pending or cancelled' },
        { status: 400 }
      )
    }
    
    await Order.findByIdAndDelete(params.id)
    
    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting order:', error)
    
    if (error.message === 'Admin access required' || error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}