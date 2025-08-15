import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function GET(request: NextRequest) {
  try {
    // Check if environment variables are set
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    const publicKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

    if (!keyId || !keySecret) {
      return NextResponse.json({
        success: false,
        error: 'Razorpay credentials not configured',
        details: {
          keyId: keyId ? 'Set' : 'Missing',
          keySecret: keySecret ? 'Set' : 'Missing',
          publicKeyId: publicKeyId ? 'Set' : 'Missing'
        }
      }, { status: 500 })
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    // Test creating a small order
    const testOrder = await razorpay.orders.create({
      amount: 100, // ₹1 in paise
      currency: 'INR',
      receipt: `test_${Date.now()}`,
      notes: {
        test: 'true'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Razorpay configuration is working',
      testOrder: {
        id: testOrder.id,
        amount: testOrder.amount,
        currency: testOrder.currency,
        status: testOrder.status
      },
      config: {
        keyId: keyId.substring(0, 8) + '...',
        publicKeyId: publicKeyId?.substring(0, 8) + '...' || 'Not set'
      }
    })

  } catch (error: any) {
    console.error('Razorpay test error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Razorpay test failed',
      details: error.message,
      errorCode: error.error?.code,
      errorDescription: error.error?.description
    }, { status: 500 })
  }
}
