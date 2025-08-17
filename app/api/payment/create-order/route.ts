import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import fs from 'fs'
import path from 'path'

// Initialize Razorpay - REAL PAYMENTS
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret',
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔥 Creating REAL Razorpay payment order...')
    
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
    console.log('Order totals:', { subtotal, shippingCost, tax, total })

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    // Create order object
    const orderData = {
      orderNumber,
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
      billingAddress: billingAddress || shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Save order to file system
    const ordersDir = path.join(process.cwd(), 'data', 'orders')
    if (!fs.existsSync(ordersDir)) {
      fs.mkdirSync(ordersDir, { recursive: true })
    }
    
    const orderId = `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const orderFilePath = path.join(ordersDir, `${orderId}.json`)
    
    const savedOrder = {
      _id: orderId,
      ...orderData
    }
    
    fs.writeFileSync(orderFilePath, JSON.stringify(savedOrder, null, 2))
    console.log('✅ Order saved to file system:', orderNumber)

    // Create Razorpay order
    const razorpayOrderData = {
      amount: Math.round(total * 100), // Amount in paise (₹1 = 100 paise)
      currency: 'INR',
      receipt: orderNumber,
      notes: {
        orderId: orderId,
        customerEmail,
        orderNumber: orderNumber
      }
    }

    console.log('🔥 Creating Razorpay order with data:', razorpayOrderData)
    
    const razorpayOrder = await razorpay.orders.create(razorpayOrderData)
    console.log('✅ Razorpay order created:', razorpayOrder.id)

    // Update order with Razorpay order ID
    const updatedOrder = {
      ...savedOrder,
      razorpayOrderId: razorpayOrder.id
    }
    fs.writeFileSync(orderFilePath, JSON.stringify(updatedOrder, null, 2))

    // Return response for frontend
    const responseData = {
      success: true,
      order: {
        id: orderId,
        orderNumber: orderNumber,
        amount: total,
        items: items.length,
        razorpayOrderId: razorpayOrder.id,
        razorpayAmount: razorpayOrder.amount,
        key: process.env.RAZORPAY_KEY_ID,
        currency: 'INR',
        name: 'Punjab Heritage Store',
        description: `Order ${orderNumber}`,
        prefill: {
          name: shippingAddress.name,
          email: customerEmail,
          contact: shippingAddress.phone
        },
        theme: {
          color: '#D97706' // Amber color matching your theme
        }
      }
    }

    console.log('✅ Sending response:', responseData)
    return NextResponse.json(responseData)

  } catch (error: any) {
    console.error('❌ Error creating payment order:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create payment order. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
