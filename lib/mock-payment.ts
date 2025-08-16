/**
 * Mock payment gateway for testing when Razorpay is not available
 * This provides a fallback mechanism for the checkout process
 */

import fs from 'fs';
import path from 'path';

interface MockPaymentOrder {
  id: string;
  entity?: string;
  amount: number;
  amount_paid?: number;
  amount_due?: number;
  currency: string;
  receipt: string;
  status: string;
  attempts?: number;
  notes?: any;
  created_at?: number;
  payment_id?: string;
  signature?: string;
  paid_at?: number;
}

interface MockPaymentResponse {
  success: boolean;
  order?: {
    id: string;
    orderNumber: string;
    amount: number;
    items: number;
    razorpayOrderId: string;
    razorpayAmount: number;
    key: string;
    isMockPayment: boolean;
    mockPaymentInfo?: {
      message: string;
      testMode: boolean;
      autoSuccess: boolean;
    };
  };
  error?: string;
}

/**
 * Create a mock payment order when Razorpay is not available
 */
export const createMockPaymentOrder = async (orderData: any): Promise<MockPaymentOrder> => {
  const { amount, receipt, currency = 'INR', notes = {} } = orderData;
  
  const mockOrder: MockPaymentOrder = {
    id: `mock_${Date.now()}`,
    entity: 'order',
    amount,
    amount_paid: 0,
    amount_due: amount,
    currency,
    receipt,
    status: 'created',
    attempts: 0,
    notes,
    created_at: Math.floor(Date.now() / 1000)
  };
  
  // Save mock order to file system for persistence
  try {
    const mockOrdersDir = path.join(process.cwd(), 'data', 'mock-payments');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(mockOrdersDir)) {
      fs.mkdirSync(mockOrdersDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(mockOrdersDir, `${mockOrder.id}.json`),
      JSON.stringify(mockOrder, null, 2)
    );
    
    console.log('Saved mock payment order to file system:', mockOrder.id);
  } catch (error) {
    console.error('Failed to save mock payment order:', error);
  }
  
  return mockOrder;
};

/**
 * Create a mock payment response
 */
export const createMockPaymentResponse = (savedOrder: any, mockOrder: MockPaymentOrder): MockPaymentResponse => {
  return {
    success: true,
    order: {
      id: savedOrder._id.toString(),
      orderNumber: savedOrder.orderNumber,
      amount: savedOrder.total,
      items: savedOrder.items.length,
      razorpayOrderId: mockOrder.id,
      razorpayAmount: mockOrder.amount,
      key: 'rzp_test_mock_key_for_fallback',
      isMockPayment: true,
      mockPaymentInfo: {
        message: 'This is a mock payment for testing or when Razorpay is unavailable',
        testMode: true,
        autoSuccess: true
      }
    }
  };
};

/**
 * Verify a mock payment
 */
export const verifyMockPayment = async (orderId: string, paymentId: string, signature: string = ''): Promise<boolean> => {
  // Only verify mock payments
  if (!orderId.startsWith('mock_')) {
    console.log('Not a mock payment order, skipping mock verification');
    return false;
  }
  
  console.log(`Mock payment verification for order ${orderId} and payment ${paymentId}`);
  
  // Check if the mock order exists in our file system
  try {
    const mockOrdersDir = path.join(process.cwd(), 'data', 'mock-payments');
    const orderFilePath = path.join(mockOrdersDir, `${orderId}.json`);
    
    if (!fs.existsSync(orderFilePath)) {
      console.error('Mock order file not found:', orderFilePath);
      return false;
    }
    
    // Read the mock order
    const mockOrderStr = fs.readFileSync(orderFilePath, 'utf-8');
    const mockOrder: MockPaymentOrder = JSON.parse(mockOrderStr);
    
    // Update the mock order with payment details
    mockOrder.status = 'paid';
    mockOrder.amount_paid = mockOrder.amount;
    mockOrder.amount_due = 0;
    mockOrder.payment_id = paymentId;
    mockOrder.signature = signature;
    mockOrder.paid_at = Math.floor(Date.now() / 1000);
    
    // Save the updated mock order
    fs.writeFileSync(orderFilePath, JSON.stringify(mockOrder, null, 2));
    
    console.log('Mock payment verified and updated successfully');
    return true;
  } catch (error) {
    console.error('Error verifying mock payment:', error);
    return false;
  }
};

/**
 * Get a mock payment order
 */
export const getMockPaymentOrder = async (orderId: string): Promise<MockPaymentOrder | null> => {
  if (!orderId.startsWith('mock_')) {
    return null;
  }
  
  try {
    const mockOrdersDir = path.join(process.cwd(), 'data', 'mock-payments');
    const orderFilePath = path.join(mockOrdersDir, `${orderId}.json`);
    
    if (!fs.existsSync(orderFilePath)) {
      return null;
    }
    
    const mockOrderStr = fs.readFileSync(orderFilePath, 'utf-8');
    return JSON.parse(mockOrderStr);
  } catch (error) {
    console.error('Error getting mock payment order:', error);
    return null;
  }
};