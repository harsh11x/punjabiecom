import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyAdminAuth } from '@/lib/admin-auth'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    await connectDB()

    const params = await context.params
    const order = await Order.findById(params.id).lean()
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Transform order for frontend
    const orderData = order as any
    const transformedOrder = {
      _id: orderData._id?.toString() || orderData.id?.toString() || '',
      orderNumber: orderData.orderNumber || '',
      customerEmail: orderData.customerEmail || '',
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      shippingCost: orderData.shippingCost || 0,
      tax: orderData.tax || 0,
      total: orderData.total || 0,
      status: orderData.status || 'pending',
      paymentStatus: orderData.paymentStatus || 'pending',
      paymentMethod: orderData.paymentMethod || 'razorpay',
      paymentId: orderData.paymentId || '',
      razorpayOrderId: orderData.razorpayOrderId || '',
      razorpayPaymentId: orderData.razorpayPaymentId || '',
      shippingAddress: orderData.shippingAddress || {},
      billingAddress: orderData.billingAddress || {},
      trackingNumber: orderData.trackingNumber || '',
      estimatedDelivery: orderData.estimatedDelivery,
      deliveredAt: orderData.deliveredAt,
      notes: orderData.notes || '',
      createdAt: orderData.createdAt,
      updatedAt: orderData.updatedAt
    }

    return NextResponse.json({
      success: true,
      data: transformedOrder
    })

  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    await connectDB()

    const params = await context.params
    const body = await request.json()
    
    // Update order
    const order = await Order.findByIdAndUpdate(
      params.id,
      { 
        ...body,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).lean()

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // If status is updated to delivered, set deliveredAt
    const orderData = order as any
    if (body.status === 'delivered' && !orderData.deliveredAt) {
      await Order.findByIdAndUpdate(params.id, {
        deliveredAt: new Date()
      })
    }

    return NextResponse.json({
      success: true,
      data: orderData,
      message: 'Order updated successfully'
    })

  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    await connectDB()

    const params = await context.params
    const order = await Order.findByIdAndDelete(params.id)
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}