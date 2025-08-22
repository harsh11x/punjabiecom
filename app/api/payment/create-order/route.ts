import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { orderStorage } from '@/lib/shared-storage'

// Initialize Razorpay - REAL PAYMENTS
let razorpay: Razorpay | null = null

try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret',
  })
  console.log('✅ Razorpay initialized successfully')
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
    }

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
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key',
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
        isMockPayment,
        mockPaymentInfo: isMockPayment ? {
          message: 'This is a mock payment for testing or when Razorpay is unavailable',
          testMode: true,
          autoSuccess: true
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
      keySecret: process.env.RAZORPAY_KEY_SECRET ? 'Configured' : 'Not configured'
    }
  })
}
