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
    console.log('Creating payment order...')
    await connectDB()

    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2))

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
      console.error('Validation error: Items are required')
      return NextResponse.json(
        { success: false, error: 'Items are required' },
        { status: 400 }
      )
    }

    if (!shippingAddress || !customerEmail) {
      console.error('Validation error: Shipping address and email are required')
      return NextResponse.json(
        { success: false, error: 'Shipping address and email are required' },
        { status: 400 }
      )
    }

    // Validate Razorpay credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay credentials not configured')
      return NextResponse.json(
        { success: false, error: 'Payment gateway not configured' },
        { status: 500 }
      )
    }

    // Calculate total
    const total = subtotal + shippingCost + tax
    console.log('Order totals:', { subtotal, shippingCost, tax, total })

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

    const savedOrder = await order.save()
    console.log('Order saved to database:', savedOrder.orderNumber)

    // Create Razorpay order
    const razorpayOrderData = {
      amount: Math.round(total * 100), // Amount in paise
      currency: 'INR',
      receipt: savedOrder.orderNumber,
      notes: {
        orderId: savedOrder._id.toString(),
        customerEmail,
        orderNumber: savedOrder.orderNumber
      }
    }

    console.log('Creating Razorpay order with data:', razorpayOrderData)

    const razorpayOrder = await razorpay.orders.create(razorpayOrderData)
    console.log('Razorpay order created:', razorpayOrder.id)

    // Update order with Razorpay order ID
    await Order.findByIdAndUpdate(savedOrder._id, {
      razorpayOrderId: razorpayOrder.id
    })

    const responseData = {
      success: true,
      data: {
        orderId: savedOrder._id.toString(),
        orderNumber: savedOrder.orderNumber,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      }
    }

    console.log('Sending response:', responseData)
    return NextResponse.json(responseData)

  } catch (error: any) {
    console.error('Error creating payment order:', error)
    
    // Log specific error details
    if (error.error) {
      console.error('Razorpay error details:', error.error)
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create payment order',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}