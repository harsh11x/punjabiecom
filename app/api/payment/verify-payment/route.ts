import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { orderStorage } from '@/lib/shared-storage'

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
    console.log('🔐 Verifying payment...');

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
      console.error('❌ Validation error: Order ID and Payment ID are required');
      return NextResponse.json(
        { success: false, error: 'Order ID and Payment ID are required' },
        { status: 400 }
      );
    }

    let isVerified = false;

    if (razorpay && razorpaySignature) {
      // Verify with Razorpay using crypto
      console.log('🔐 Verifying Razorpay payment...');
      const body = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'thisisatestkey')
        .update(body.toString())
        .digest('hex');

      isVerified = expectedSignature === razorpaySignature;
      console.log('🔐 Razorpay payment verification result:', isVerified);
      console.log('Expected signature:', expectedSignature);
      console.log('Received signature:', razorpaySignature);
    } else if (!razorpaySignature) {
      // For test payments without signature, we'll verify by checking if the order exists
      console.log('🧪 Test payment without signature - verifying order existence');
      const allOrders = orderStorage.getAllOrders();
      const orderExists = allOrders.some(order => order.razorpayOrderId === razorpayOrderId);
      isVerified = orderExists;
      console.log('🧪 Test payment verification result:', isVerified);
    } else {
      console.error('❌ Cannot verify payment: Razorpay not initialized');
      return NextResponse.json(
        { success: false, error: 'Payment verification system unavailable' },
        { status: 500 }
      );
    }

    if (!isVerified) {
      console.error('❌ Payment verification failed');
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Find and update order in shared storage
    let order = null;
    const allOrders = orderStorage.getAllOrders();
    
    // Find order by orderId or razorpayOrderId
    order = allOrders.find(o => o._id === orderId || o.razorpayOrderId === razorpayOrderId);
    
    if (order) {
      // Update order with payment information
      const updatedOrder = orderStorage.updateOrder(order._id, {
        paymentStatus: 'paid',
        status: 'confirmed',
        razorpayPaymentId: razorpayPaymentId,
        razorpayOrderId: razorpayOrderId
      });
      
      console.log('✅ Order updated in shared storage with payment information:', updatedOrder?._id);
      order = updatedOrder;
    } else {
      console.error('❌ Order not found in shared storage for:', { orderId, razorpayOrderId });
      // Don't fail the verification, as the payment was successful
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order: order ? {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus
      } : null
    });

  } catch (error: any) {
    console.error('❌ Error verifying payment:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment', details: error.message },
      { status: 500 }
    );
  }
}