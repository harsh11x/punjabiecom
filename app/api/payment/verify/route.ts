import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { PAYMENT_CONFIG, PAYMENT_STATUS, ORDER_STATUS } from '@/lib/payment-config'
import { orders, getOrder, setOrder } from '@/lib/shared-storage'

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentId, signature, paymentMethod, bankTransferDetails, upiDetails } = await request.json()
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Get order from storage (in production, fetch from database)
    const order = orders.get(orderId)
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    let verificationResult = false
    let paymentStatus = PAYMENT_STATUS.FAILED
    let orderStatus = order.orderStatus

    // Handle different payment methods
    switch (paymentMethod || order.paymentMethod) {
      case 'razorpay':
        verificationResult = await verifyRazorpayPayment(
          order.razorpayOrderId,
          paymentId,
          signature
        )
        if (verificationResult) {
          paymentStatus = PAYMENT_STATUS.COMPLETED
          orderStatus = ORDER_STATUS.CONFIRMED
          order.razorpayPaymentId = paymentId
          order.razorpaySignature = signature
        }
        break

      case 'cod':
        // COD is automatically confirmed when order is placed
        paymentStatus = PAYMENT_STATUS.PENDING // Will be completed on delivery
        orderStatus = ORDER_STATUS.CONFIRMED
        verificationResult = true
        break

      case 'upi':
        // UPI payment verification
        if (upiDetails?.transactionId || paymentId) {
          // For UPI via Razorpay, we get payment ID and signature
          if (paymentId && signature) {
            verificationResult = await verifyRazorpayPayment(
              order.razorpayOrderId,
              paymentId,
              signature
            )
          } else if (upiDetails?.transactionId) {
            // Direct UPI payment with transaction ID
            verificationResult = true
          }
          
          if (verificationResult) {
            paymentStatus = PAYMENT_STATUS.COMPLETED
            orderStatus = ORDER_STATUS.CONFIRMED
            order.paymentId = paymentId || upiDetails?.transactionId
            order.upiTransactionId = upiDetails?.transactionId
            order.notes = `UPI Payment: ${upiDetails?.transactionId || paymentId}`
          }
        }
        break

      case 'bank_transfer':
        // Bank transfer verification (in real app, this would be manual or webhook-based)
        if (bankTransferDetails?.transactionId) {
          paymentStatus = PAYMENT_STATUS.PROCESSING // Pending manual verification
          orderStatus = ORDER_STATUS.CREATED
          order.paymentId = bankTransferDetails.transactionId
          order.notes = `Bank transfer: ${bankTransferDetails.transactionId}`
          verificationResult = true
        }
        break

      default:
        return NextResponse.json(
          { error: 'Unsupported payment method' },
          { status: 400 }
        )
    }

    // Update order
    order.paymentStatus = paymentStatus
    order.orderStatus = orderStatus
    order.updatedAt = new Date().toISOString()
    
    if (paymentId) {
      order.paymentId = paymentId
    }

    // Save updated order
    orders.set(orderId, order)

    if (verificationResult) {
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          total: order.total,
          paymentMethod: order.paymentMethod
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed', details: error.message },
      { status: 500 }
    )
  }
}

// Verify Razorpay payment signature
async function verifyRazorpayPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<boolean> {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET || PAYMENT_CONFIG.razorpay.keySecret
    
    if (keySecret.includes('test') || keySecret === 'your_secret_key') {
      // Mock verification for demo/testing
      console.log('Mock Razorpay verification - assuming success')
      return true
    }
    
    // Real Razorpay signature verification
    const body = razorpayOrderId + '|' + razorpayPaymentId
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex')
    
    return expectedSignature === razorpaySignature
  } catch (error) {
    console.error('Razorpay verification error:', error)
    return false
  }
}

// GET endpoint to check payment status
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
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      total: order.total,
      paymentMethod: order.paymentMethod
    }
  })
}
