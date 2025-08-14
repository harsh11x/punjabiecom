import { NextRequest, NextResponse } from 'next/server'
import { PAYMENT_CONFIG, PAYMENT_STATUS, ORDER_STATUS } from '@/lib/payment-config'
import { generateOrderNumber, generateOrderId, calculateOrderTotals, validateOrder, type Order } from '@/lib/order-management'
import { orders, setOrder, getOrder } from '@/lib/shared-storage'

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    
    // Validate order data
    const validation = validateOrder(orderData)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid order data', details: validation.errors },
        { status: 400 }
      )
    }

    // Calculate totals
    const totals = calculateOrderTotals(
      orderData.items,
      PAYMENT_CONFIG.general.taxRate,
      PAYMENT_CONFIG.general.shippingFee
    )

    // Create order
    const order: Order = {
      id: generateOrderId(),
      orderNumber: generateOrderNumber(),
      userId: orderData.userId,
      customerEmail: orderData.shippingAddress.email,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: PAYMENT_STATUS.PENDING,
      orderStatus: ORDER_STATUS.CREATED,
      subtotal: totals.subtotal,
      tax: totals.tax,
      shipping: totals.shipping,
      total: totals.total,
      currency: PAYMENT_CONFIG.general.currency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: orderData.notes
    }

    // Handle different payment methods
    if (orderData.paymentMethod === 'razorpay') {
      // Create Razorpay order
      try {
        const razorpayOrder = await createRazorpayOrder(order)
        order.razorpayOrderId = razorpayOrder.id
      } catch (error) {
        console.error('Razorpay order creation failed:', error)
        return NextResponse.json(
          { error: 'Failed to create payment order' },
          { status: 500 }
        )
      }
    } else if (orderData.paymentMethod === 'upi') {
      // UPI Payment - can be handled via Razorpay or direct UPI
      try {
        const razorpayOrder = await createRazorpayOrder(order, { method: 'upi' })
        order.razorpayOrderId = razorpayOrder.id
        order.paymentStatus = PAYMENT_STATUS.PENDING
        order.orderStatus = ORDER_STATUS.CREATED
      } catch (error) {
        console.error('UPI order creation failed:', error)
        return NextResponse.json(
          { error: 'Failed to create UPI payment order' },
          { status: 500 }
        )
      }
    } else if (orderData.paymentMethod === 'cod') {
      // Cash on Delivery - mark as confirmed
      order.paymentStatus = PAYMENT_STATUS.PENDING
      order.orderStatus = ORDER_STATUS.CONFIRMED
    } else if (orderData.paymentMethod === 'bank_transfer') {
      // Bank transfer - mark as pending
      order.paymentStatus = PAYMENT_STATUS.PENDING
      order.orderStatus = ORDER_STATUS.CREATED
    }

    // Save order
    orders.set(order.id, order)

    // Return order with payment details
    const response = {
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        currency: order.currency,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        razorpayOrderId: order.razorpayOrderId
      }
    }

    // Add payment-specific data
    if (orderData.paymentMethod === 'razorpay') {
      response.order = {
        ...response.order,
        razorpayKey: PAYMENT_CONFIG.razorpay.keyId,
        amount: order.total * 100, // Razorpay expects amount in paise
        currency: order.currency,
        name: PAYMENT_CONFIG.razorpay.companyName,
        description: PAYMENT_CONFIG.razorpay.description,
        prefill: {
          name: order.shippingAddress.fullName,
          email: order.shippingAddress.email,
          contact: order.shippingAddress.phone
        }
      }
    } else if (orderData.paymentMethod === 'upi') {
      response.order = {
        ...response.order,
        razorpayKey: PAYMENT_CONFIG.razorpay.keyId,
        amount: order.total * 100, // Razorpay expects amount in paise
        currency: order.currency,
        name: PAYMENT_CONFIG.razorpay.companyName,
        description: PAYMENT_CONFIG.razorpay.description,
        prefill: {
          name: order.shippingAddress.fullName,
          email: order.shippingAddress.email,
          contact: order.shippingAddress.phone
        },
        upiConfig: {
          upiId: PAYMENT_CONFIG.upi.upiId,
          merchantVpa: PAYMENT_CONFIG.upi.merchantVpa,
          qrCodeEnabled: PAYMENT_CONFIG.upi.qrCodeEnabled
        }
      }
    } else if (orderData.paymentMethod === 'bank_transfer') {
      response.order = {
        ...response.order,
        bankDetails: PAYMENT_CONFIG.bankTransfer
      }
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    )
  }
}

// Create Razorpay order
async function createRazorpayOrder(order: Order, options?: { method?: string }) {
  // Check if we have Razorpay credentials
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || PAYMENT_CONFIG.razorpay.keyId
  const keySecret = process.env.RAZORPAY_KEY_SECRET || PAYMENT_CONFIG.razorpay.keySecret
  
  if (keyId.includes('test') || keySecret.includes('test')) {
    // Mock Razorpay order for demo/testing
    return {
      id: `rzp_order_${Date.now()}`,
      amount: order.total * 100,
      currency: order.currency,
      receipt: order.orderNumber,
      status: 'created'
    }
  }
  
  // In production with real Razorpay credentials:
  // const Razorpay = require('razorpay')
  // const rzp = new Razorpay({
  //   key_id: keyId,
  //   key_secret: keySecret
  // })
  
  // const options = {
  //   amount: order.total * 100,
  //   currency: order.currency,
  //   receipt: order.orderNumber,
  //   notes: {
  //     orderId: order.id,
  //     customerEmail: order.customerEmail
  //   }
  // }
  
  // return await rzp.orders.create(options)
  
  // For now, return mock order
  return {
    id: `rzp_order_${Date.now()}`,
    amount: order.total * 100,
    currency: order.currency,
    receipt: order.orderNumber,
    status: 'created'
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('orderId')

  if (!orderId) {
    return NextResponse.json(
      { error: 'Order ID is required' },
      { status: 400 }
    )
  }

  const order = orders.get(orderId)
  if (!order) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    order
  })
}
