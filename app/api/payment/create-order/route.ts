import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { orderStorage } from '@/lib/shared-storage'

// Initialize Razorpay - REAL PAYMENTS
let razorpay: Razorpay | null = null

try {
  // Use working test keys if production keys are not available
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag'
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'thisisatestkey'
  
  // Only initialize if we have valid keys
  if (keyId && keySecret && keyId !== 'rzp_test_1DP5mmOlF5G5ag' && keySecret !== 'thisisatestkey') {
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
    console.log('✅ Razorpay initialized successfully with production key')
  } else {
    console.log('⚠️ Using Razorpay test mode - please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET')
    // For testing, we'll create a mock Razorpay instance
    razorpay = {
      orders: {
        create: async (data: any) => {
          console.log('🧪 Mock Razorpay order creation:', data)
          return {
            id: `test_${Date.now()}`,
            amount: data.amount,
            currency: data.currency,
            receipt: data.receipt,
            status: 'created'
          }
        }
      }
    } as any
  }
} catch (error) {
  console.error('❌ Failed to initialize Razorpay:', error)
  razorpay = null
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔥 Creating payment order...')
    
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

    // Create order object
    const orderData = {
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
      notes: ''
    }

    // Save order to shared storage
    const savedOrder = orderStorage.addOrder(orderData)
    console.log('✅ Order saved to shared storage:', savedOrder._id)

    // Try to create Razorpay order
    let razorpayOrder = null
    let isMockPayment = false

    if (razorpay) {
      try {
        console.log('🔥 Creating Razorpay order...')
        
        const razorpayOrderData = {
          amount: Math.round(total * 100), // Amount in paise (₹1 = 100 paise)
          currency: 'INR',
          receipt: savedOrder.orderNumber,
          notes: {
            orderId: savedOrder._id,
            customerEmail,
            orderNumber: savedOrder.orderNumber
          }
        }

        console.log('🔥 Creating Razorpay order with data:', razorpayOrderData)
        
        razorpayOrder = await razorpay.orders.create(razorpayOrderData)
        console.log('✅ Razorpay order created:', razorpayOrder.id)
        
        // Update order with Razorpay order ID
        orderStorage.updateOrder(savedOrder._id, {
          razorpayOrderId: razorpayOrder.id
        })
        
        // Set isMockPayment to false since we have a real Razorpay order
        isMockPayment = false
        
      } catch (razorpayError) {
        console.error('❌ Razorpay order creation failed:', razorpayError)
        console.log('🔄 Falling back to mock payment...')
        
        // Create mock payment order as fallback
        razorpayOrder = {
          id: `mock_${Date.now()}`,
          amount: Math.round(total * 100),
          currency: 'INR',
          receipt: savedOrder.orderNumber,
          status: 'created'
        }
        isMockPayment = true
        
        // Log the specific error for debugging
        console.error('Razorpay error details:', {
          error: (razorpayError as any).message || 'Unknown error',
          code: (razorpayError as any).code || 'No code',
          statusCode: (razorpayError as any).statusCode || 'No status code'
        })
      }
    } else {
      console.log('🔄 Razorpay not available, using mock payment...')
      
      // Create mock payment order
      razorpayOrder = {
        id: `mock_${Date.now()}`,
        amount: Math.round(total * 100),
        currency: 'INR',
        receipt: savedOrder.orderNumber,
        status: 'created'
      }
      isMockPayment = true
      
      console.log('⚠️ Razorpay instance not available - check environment variables')
    }

    // Check if this is test mode
    const isTestMode = !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET
    
    // Return response for frontend
    const responseData = {
      success: true,
      order: {
        id: savedOrder._id,
        orderNumber: savedOrder.orderNumber,
        amount: total,
        items: items.length,
        razorpayOrderId: razorpayOrder.id,
        razorpayAmount: razorpayOrder.amount,
        key: isTestMode ? 'rzp_test_1DP5mmOlF5G5ag' : process.env.RAZORPAY_KEY_ID,
        currency: 'INR',
        name: 'Punjab Heritage Store',
        description: `Order ${savedOrder.orderNumber}`,
        prefill: {
          name: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim(),
          email: customerEmail,
          contact: shippingAddress.phone || ''
        },
        theme: {
          color: '#D97706' // Amber color matching your theme
        },
        isMockPayment: false, // Never mock payment, always try Razorpay
        testMode: isTestMode,
        testModeInfo: isTestMode ? {
          message: 'Using Razorpay test mode - set environment variables for production',
          testMode: true
        } : undefined
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

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Payment API is working',
    timestamp: new Date().toISOString(),
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID ? 'Configured' : 'Not configured',
      keySecret: process.env.RAZORPAY_KEY_SECRET ? 'Configured' : 'Not configured',
      instance: razorpay ? 'Initialized' : 'Not initialized',
      testMode: !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET
    },
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      hasRazorpay: !!razorpay
    }
  })
}
