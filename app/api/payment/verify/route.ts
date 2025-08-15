import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId 
    } = body

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment parameters' },
        { status: 400 }
      )
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex')

    if (razorpay_signature !== expectedSign) {
      // Update order as failed
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'failed',
        status: 'cancelled'
      })

      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Payment is verified, update order
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'paid',
        status: 'confirmed',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentId: razorpay_payment_id
      },
      { new: true }
    ).lean()

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // TODO: Send confirmation email to customer
    // TODO: Update inventory
    // TODO: Create analytics entry

    const orderData = order as any
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: orderData._id?.toString() || orderData.id?.toString() || '',
        orderNumber: orderData.orderNumber || '',
        status: orderData.status || 'confirmed',
        paymentStatus: orderData.paymentStatus || 'paid',
        total: orderData.total || 0
      }
    })

  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}