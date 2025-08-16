import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import { createMockPaymentOrder, createMockPaymentResponse } from '@/lib/mock-payment'

// Initialize Razorpay with fallback for missing credentials
let razorpay: Razorpay | null = null;
const MOCK_KEY_ID = 'rzp_test_mock_key_for_fallback';

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('Razorpay initialized successfully');
  } else {
    console.log('Razorpay credentials missing, using mock payment gateway');
  }
} catch (error) {
  console.error('Failed to initialize Razorpay:', error);
  console.log('Falling back to mock payment gateway');
}

export async function POST(request: NextRequest) {
  try {
    console.log('Creating payment order...')
    const dbConnection = await connectDB()
    
    // Check if MongoDB connection was successful
    if (!dbConnection) {
      console.warn('MongoDB connection failed, using fallback order creation method')
    }

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

    // Check if Razorpay credentials are available, but don't block the flow
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.warn('Razorpay credentials not configured, will use mock payment gateway')
      // Continue with mock payment gateway instead of returning an error
      razorpay = null; // Ensure razorpay is null to force using mock payment
    }

    // Calculate total
    const total = subtotal + shippingCost + tax
    console.log('Order totals:', { subtotal, shippingCost, tax, total })

    // Create order object with all required data
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
      billingAddress: billingAddress || shippingAddress
    }
    
    let savedOrder: any = null
    let orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    // Try to save to MongoDB if connection is available
    if (dbConnection) {
      try {
        const order = new Order(orderData)
        savedOrder = await order.save()
        orderNumber = savedOrder.orderNumber
        console.log('Order saved to database:', orderNumber)
      } catch (dbError) {
        console.error('Failed to save order to MongoDB:', dbError)
        // Continue with fallback method
      }
    }
    
    // If MongoDB save failed, use fallback method (in-memory or file-based)
    if (!savedOrder) {
      // Create a fallback order with generated ID and order number
      const fallbackOrderId = `fallback-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      savedOrder = {
        _id: fallbackOrderId,
        orderNumber,
        ...orderData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      console.log('Using fallback order creation:', orderNumber)
      
      // Optionally save to file system as backup
      try {
        const fs = require('fs')
        const path = require('path')
        const ordersDir = path.join(process.cwd(), 'data', 'orders')
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(ordersDir)) {
          fs.mkdirSync(ordersDir, { recursive: true })
        }
        
        fs.writeFileSync(
          path.join(ordersDir, `${fallbackOrderId}.json`),
          JSON.stringify(savedOrder, null, 2)
        )
        console.log('Order saved to file system as fallback')
      } catch (fsError) {
        console.error('Failed to save order to file system:', fsError)
        // Continue anyway - we still have the order in memory
      }
    }

    // Create Razorpay order if available
    let razorpayOrder = null;
    
    // Prepare order data for payment gateway
    const paymentOrderData = {
      amount: Math.round(total * 100), // Amount in paise
      currency: 'INR',
      receipt: savedOrder.orderNumber,
      notes: {
        orderId: savedOrder._id.toString(),
        customerEmail,
        orderNumber: savedOrder.orderNumber
      }
    }

    // Try to use Razorpay if available, otherwise use mock payment
    if (razorpay) {
      console.log('Creating Razorpay order with data:', paymentOrderData)

      try {
        razorpayOrder = await razorpay.orders.create(paymentOrderData)
        console.log('Razorpay order created:', razorpayOrder.id)
      } catch (razorpayError) {
        console.error('Failed to create Razorpay order:', razorpayError)
        console.log('Falling back to mock payment gateway')
        
        // Use mock payment gateway as fallback
        try {
          razorpayOrder = await createMockPaymentOrder(paymentOrderData)
          console.log('Created mock payment order as fallback:', razorpayOrder.id)
        } catch (mockError) {
          console.error('Failed to create mock payment order:', mockError)
          return NextResponse.json(
            { 
              success: false, 
              error: 'Failed to create payment order. Please try again later.'
            },
            { status: 500 }
          )
        }
      }
    } else {
      // Razorpay is not available, use mock payment gateway instead
      console.log('Using mock payment gateway instead of Razorpay')
      try {
        razorpayOrder = await createMockPaymentOrder(paymentOrderData)
        console.log('Created mock payment order:', razorpayOrder.id)
      } catch (mockError) {
        console.error('Failed to create mock payment order:', mockError)
        return NextResponse.json(
          { 
            success: false, 
            error: 'Payment system is currently unavailable. Please try again later.'
          },
          { status: 500 }
        )
      }
    }

    // Update order with Razorpay order ID
    if (dbConnection && !savedOrder._id.toString().startsWith('fallback-')) {
      try {
        await Order.findByIdAndUpdate(savedOrder._id, {
          razorpayOrderId: razorpayOrder.id
        })
        console.log('Order updated in MongoDB with Razorpay order ID')
      } catch (updateError) {
        console.error('Failed to update order in MongoDB:', updateError)
        // Continue anyway - we have the Razorpay order ID in memory
      }
    } else if (savedOrder._id.toString().startsWith('fallback-')) {
      // Update the in-memory order
      savedOrder.razorpayOrderId = razorpayOrder.id
      
      // Update the file-based order if possible
      try {
        const fs = require('fs')
        const path = require('path')
        const orderFilePath = path.join(process.cwd(), 'data', 'orders', `${savedOrder._id}.json`)
        
        if (fs.existsSync(orderFilePath)) {
          fs.writeFileSync(
            orderFilePath,
            JSON.stringify({...savedOrder, razorpayOrderId: razorpayOrder.id}, null, 2)
          )
          console.log('Updated fallback order file with Razorpay order ID')
        }
      } catch (fsError) {
        console.error('Failed to update fallback order file:', fsError)
        // Continue anyway - we have the Razorpay order ID in memory
      }
    }

    // Determine if this is a mock payment
    const isMockPayment = !razorpay || razorpayOrder.id.startsWith('mock_');
    
    // Create response data
    let responseData;
    if (isMockPayment) {
      // Use mock payment response
      responseData = createMockPaymentResponse(savedOrder, razorpayOrder);
    } else {
      // Use regular Razorpay response
      responseData = {
        success: true,
        order: {
          id: savedOrder._id.toString(),
          orderNumber: savedOrder.orderNumber,
          amount: total,
          items: items.length,
          razorpayOrderId: razorpayOrder.id,
          razorpayAmount: razorpayOrder.amount,
          key: process.env.RAZORPAY_KEY_ID,
          isMockPayment: false
        }
      };
    }

    console.log('Sending response:', responseData)
    return NextResponse.json(responseData)

  } catch (error: any) {
    console.error('Error creating payment order:', error)
    
    // Log specific error details
    if (error.error) {
      console.error('Razorpay error details:', error.error)
    }
    
    // Provide more user-friendly error messages
    let errorMessage = 'Failed to create payment order';
    let statusCode = 500;
    
    if (error.message && error.message.includes('querySrv ENOTFOUND')) {
      errorMessage = 'We are experiencing temporary connectivity issues with our payment system. Please try again in a few minutes.';
    } else if (error.message && error.message.includes('Authentication failed')) {
      errorMessage = 'Payment system authentication error. Please contact customer support.';
    } else if (error.message && error.message.includes('Server selection timed out')) {
      errorMessage = 'Our payment system is currently experiencing high traffic. Please try again in a few minutes.';
    } else if (error.code === 'BAD_REQUEST_ERROR') {
      errorMessage = 'Invalid payment information provided. Please check your details and try again.';
      statusCode = 400;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: statusCode }
    )
  }
}