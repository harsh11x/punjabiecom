import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { requireAuth } from '@/lib/auth-middleware'

export async function POST(request: NextRequest) {
  try {
    // Check if Razorpay credentials are available
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    
    if (!keyId || !keySecret) {
      return NextResponse.json(
        { success: false, error: 'Payment gateway configuration not available' },
        { status: 503 }
      )
    }
    
    // Initialize Razorpay only when needed
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
    
    // Require authentication for payment creation
    const user = await requireAuth(request)
    
    const { amount, currency = 'INR', receipt, orderData } = await request.json()
    
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      )
    }
    
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
    }
    
    const order = await razorpay.orders.create(options)
    
    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      }
    })
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}