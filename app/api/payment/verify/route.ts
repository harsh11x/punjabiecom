import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { orderStorage } from '@/lib/shared-storage'

export async function POST(request: NextRequest) {
  try {
    console.log('🔥 Verifying payment (legacy endpoint)...')
    
    const body = await request.json()
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId 
    } = body

    console.log('Payment verification data:', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    })

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id) {
      console.error('❌ Validation error: Order ID and Payment ID are required')
      return NextResponse.json(
        { success: false, error: 'Order ID and Payment ID are required' },
        { status: 400 }
      )
    }

    let isVerified = false

    // Check if this is a mock payment (for test mode)
    if (razorpay_order_id.startsWith('mock_')) {
      console.log('🧪 Verifying mock payment...')
      isVerified = true // For mock payments, we'll accept them
    } else if (razorpay_signature) {
      // Verify Razorpay signature for real payments
      const key_secret = process.env.RAZORPAY_KEY_SECRET || 'thisisatestkey'
      
      const generated_signature = crypto
        .createHmac('sha256', key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')

      console.log('🔐 Signature verification:', {
        generated: generated_signature,
        received: razorpay_signature,
        match: generated_signature === razorpay_signature
      })

      isVerified = generated_signature === razorpay_signature
    } else {
      // For test payments without signature, verify by checking if order exists
      console.log('🧪 Test payment without signature - verifying order existence')
      const allOrders = orderStorage.getAllOrders()
      const orderExists = allOrders.some(order => order.razorpayOrderId === razorpay_order_id)
      isVerified = orderExists
    }

    if (!isVerified) {
      console.error('❌ Payment signature verification failed')
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    // Find and update order in shared storage
    let order = null
    const allOrders = orderStorage.getAllOrders()
    
    // Find order by orderId or razorpayOrderId
    order = allOrders.find(o => o._id === orderId || o.razorpayOrderId === razorpay_order_id)
    
    if (order) {
      // Update order with payment information
      const updatedOrder = orderStorage.updateOrder(order._id, {
        paymentStatus: 'paid',
        status: 'confirmed',
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date().toISOString()
      })
      
      console.log('✅ Order updated in shared storage with payment information:', updatedOrder?._id)
      order = updatedOrder
    } else {
      console.error('❌ Order not found in shared storage for:', { orderId, razorpay_order_id })
    }

    // Send success response
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order: order ? {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total
      } : null
    })

  } catch (error: any) {
    console.error('❌ Error verifying payment:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Payment verification failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
