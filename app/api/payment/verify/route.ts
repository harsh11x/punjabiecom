import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log('🔥 Verifying payment...')
    
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

    // Check if this is a mock payment
    if (razorpay_order_id && razorpay_order_id.startsWith('mock_')) {
      console.log('🔄 Verifying mock payment...')
      
      // For mock payments, we can skip signature verification
      // and just update the order status
      
      // Update order status
      const ordersDir = path.join(process.cwd(), 'data', 'orders')
      const orderFilePath = path.join(ordersDir, `${orderId}.json`)
      
      if (!fs.existsSync(orderFilePath)) {
        console.error('❌ Order not found:', orderId)
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        )
      }

      const orderData = JSON.parse(fs.readFileSync(orderFilePath, 'utf8'))
      
      // Update order with payment details
      const updatedOrder = {
        ...orderData,
        paymentStatus: 'completed',
        status: 'confirmed',
        razorpayPaymentId: razorpay_payment_id || 'mock_payment_id',
        razorpaySignature: razorpay_signature || 'mock_signature',
        paidAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      fs.writeFileSync(orderFilePath, JSON.stringify(updatedOrder, null, 2))
      console.log('✅ Mock payment verified and order updated:', orderId)

      // Send success response
      return NextResponse.json({
        success: true,
        message: 'Mock payment verified successfully',
        order: {
          id: orderId,
          orderNumber: updatedOrder.orderNumber,
          status: updatedOrder.status,
          paymentStatus: updatedOrder.paymentStatus,
          total: updatedOrder.total
        }
      })
    }

    // Verify Razorpay signature for real payments
    const key_secret = process.env.RAZORPAY_KEY_SECRET
    if (!key_secret) {
      throw new Error('Razorpay key secret not configured')
    }

    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    console.log('Signature verification:', {
      generated: generated_signature,
      received: razorpay_signature,
      match: generated_signature === razorpay_signature
    })

    if (generated_signature !== razorpay_signature) {
      console.error('❌ Payment signature verification failed')
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    // Update order status
    const ordersDir = path.join(process.cwd(), 'data', 'orders')
    const orderFilePath = path.join(ordersDir, `${orderId}.json`)
    
    if (!fs.existsSync(orderFilePath)) {
      console.error('❌ Order not found:', orderId)
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    const orderData = JSON.parse(fs.readFileSync(orderFilePath, 'utf8'))
    
    // Update order with payment details
    const updatedOrder = {
      ...orderData,
      paymentStatus: 'completed',
      status: 'confirmed',
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paidAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    fs.writeFileSync(orderFilePath, JSON.stringify(updatedOrder, null, 2))
    console.log('✅ Order updated with payment details:', orderId)

    // Send success response
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order: {
        id: orderId,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
        total: updatedOrder.total
      }
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
