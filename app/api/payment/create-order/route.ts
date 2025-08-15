import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { 
      items, 
      shippingAddress, 
      billingAddress, 
      customerEmail,
      subtotal,
      shippingCost = 0,
      tax = 0
    } = body

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Items are required' },
        { status: 400 }
      )
    }

    if (!shippingAddress || !customerEmail) {
      return NextResponse.json(
        { success: false, error: 'Shipping address and email are required' },
        { status: 400 }
      )
    }

    // Calculate total
    const total = subtotal + shippingCost + tax

    // Create order in database first
    const order = new Order({
      customerEmail,
      items,
      subtotal,
      shippingCost,
      tax,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'razorpay',
      shippingAddress,
      billingAddress: billingAddress || shippingAddress
    })

    await order.save()

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // Amount in paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        customerEmail,
        orderNumber: order.orderNumber
      }
    })

    // Update order with Razorpay order ID
    await Order.findByIdAndUpdate(order._id, {
      razorpayOrderId: razorpayOrder.id
    })

    return NextResponse.json({
      success: true,
      data: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      }
    })

  } catch (error) {
    console.error('Error creating payment order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}