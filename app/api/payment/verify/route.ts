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
      orderId,
      paymentId,
      signature,
      paymentMethod
    } = body

    // Handle both parameter formats for backward compatibility
    const orderIdToUse = orderId
    const paymentIdToUse = razorpay_payment_id || paymentId
    const signatureToUse = razorpay_signature || signature
    const orderIdFromRazorpay = razorpay_order_id

    console.log('Payment verification request:', {
      orderIdToUse,
      paymentIdToUse,
      signatureToUse,
      orderIdFromRazorpay,
      paymentMethod
    })

    // Validate required fields
    if (!orderIdFromRazorpay || !paymentIdToUse || !signatureToUse || !orderIdToUse) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment parameters' },
        { status: 400 }
      )
    }

    // Verify signature
    const sign = orderIdFromRazorpay + '|' + paymentIdToUse
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex')

    console.log('Signature verification:', {
      received: signatureToUse,
      expected: expectedSign,
      isValid: signatureToUse === expectedSign
    })

    if (signatureToUse !== expectedSign) {
      // Update order as failed
      await Order.findByIdAndUpdate(orderIdToUse, {
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
      orderIdToUse,
      {
        paymentStatus: 'paid',
        status: 'confirmed',
        razorpayPaymentId: paymentIdToUse,
        razorpaySignature: signatureToUse,
        paymentId: paymentIdToUse
      },
      { new: true }
    ).lean()

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    console.log('Payment verified successfully for order:', orderIdToUse)

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