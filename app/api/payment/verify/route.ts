import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'

export async function POST(request: NextRequest) {
  try {
    // Check if Razorpay credentials are available
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: 'Payment gateway configuration not available' },
        { status: 503 }
      )
    }
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = await request.json()
    
    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex')
    
    const isAuthentic = expectedSignature === razorpay_signature
    
    if (!isAuthentic) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      )
    }
    
    // Update order payment status
    const dbConnection = await dbConnect()
    if (!dbConnection) {
      return NextResponse.json(
        { success: false, error: 'Database connection not available' },
        { status: 503 }
      )
    }
    
    const order = await Order.findByIdAndUpdate(
      order_id,
      {
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        orderStatus: 'confirmed'
      },
      { new: true }
    )
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      data: order
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}