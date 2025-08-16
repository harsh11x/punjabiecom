import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyMockPayment } from '@/lib/mock-payment'

// Initialize Razorpay with fallback for missing credentials
let razorpay: Razorpay | null = null;
const MOCK_KEY_ID = 'rzp_test_mock_key_for_fallback';

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('Razorpay initialized successfully for payment verification');
  } else {
    console.log('Razorpay credentials missing, will use mock payment verification');
  }
} catch (error) {
  console.error('Failed to initialize Razorpay for payment verification:', error);
  console.log('Falling back to mock payment verification');
}

export async function POST(request: NextRequest) {
  try {
    console.log('Verifying payment...');
    const dbConnection = await connectDB();
    
    // Check if MongoDB connection was successful
    if (!dbConnection) {
      console.warn('MongoDB connection failed, using fallback verification method');
    }

    const body = await request.json();
    console.log('Payment verification request body:', JSON.stringify(body, null, 2));

    const { 
      razorpayOrderId, 
      razorpayPaymentId, 
      razorpaySignature,
      orderId 
    } = body;

    // Validate required fields
    if (!razorpayOrderId || !razorpayPaymentId) {
      console.error('Validation error: Order ID and Payment ID are required');
      return NextResponse.json(
        { success: false, error: 'Order ID and Payment ID are required' },
        { status: 400 }
      );
    }

    let isVerified = false;
    let order = null;

    // Check if this is a mock payment
    const isMockPayment = razorpayOrderId.startsWith('mock_');

    if (isMockPayment) {
      console.log('Verifying mock payment...');
      isVerified = await verifyMockPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature || '');
      console.log('Mock payment verification result:', isVerified);
    } else if (razorpay) {
      // Verify with Razorpay using crypto
      console.log('Verifying Razorpay payment...');
      const body = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(body.toString())
        .digest('hex');

      isVerified = expectedSignature === razorpaySignature;
      console.log('Razorpay payment verification result:', isVerified);
    } else {
      console.error('Cannot verify payment: Razorpay not initialized and not a mock payment');
      return NextResponse.json(
        { success: false, error: 'Payment verification system unavailable' },
        { status: 500 }
      );
    }

    if (!isVerified) {
      console.error('Payment verification failed');
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Update order status in database or file system
    if (dbConnection && orderId) {
      try {
        order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = 'paid';
          order.status = 'processing';
          order.razorpayPaymentId = razorpayPaymentId;
          await order.save();
          console.log('Order updated in database with payment information');
        } else {
          console.error('Order not found in database:', orderId);
        }
      } catch (dbError) {
        console.error('Failed to update order in database:', dbError);
        // Continue with fallback method
      }
    } else if (orderId) {
      // Update the file-based order if possible
      try {
        const fs = require('fs');
        const path = require('path');
        const orderFilePath = path.join(process.cwd(), 'data', 'orders', `${orderId}.json`);
        
        if (fs.existsSync(orderFilePath)) {
          const orderData = JSON.parse(fs.readFileSync(orderFilePath, 'utf-8'));
          orderData.paymentStatus = 'paid';
          orderData.status = 'processing';
          orderData.razorpayPaymentId = razorpayPaymentId;
          orderData.updatedAt = new Date();
          
          fs.writeFileSync(orderFilePath, JSON.stringify(orderData, null, 2));
          console.log('Updated fallback order file with payment information');
          order = orderData;
        } else {
          console.error('Order file not found:', orderFilePath);
        }
      } catch (fsError) {
        console.error('Failed to update fallback order file:', fsError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order: order ? {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus
      } : null
    });

  } catch (error: any) {
    console.error('Error verifying payment:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}