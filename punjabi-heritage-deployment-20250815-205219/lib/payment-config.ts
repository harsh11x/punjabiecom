// Payment Gateway Configuration
export const PAYMENT_CONFIG = {
  razorpay: {
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_your_key',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'your_secret_key',
    currency: 'INR',
    companyName: 'Punjab Heritage Store',
    description: 'Traditional Punjabi Products',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret',
  },
  
  upi: {
    enabled: true,
    upiId: 'punjabheritageg@paytm',
    merchantVpa: 'punjabheritage@okaxis',
    qrCodeEnabled: true,
    description: 'Pay instantly using any UPI app'
  },
  
  bankTransfer: {
    accountName: 'Punjab Heritage Store',
    accountNumber: '1234567890',
    ifscCode: 'HDFC0000123',
    bankName: 'HDFC Bank',
    branch: 'Main Branch',
    upiId: 'punjabheritageg@paytm'
  },
  
  cod: {
    enabled: true,
    minAmount: 0,
    maxAmount: 50000, // 50k INR
    serviceFee: 0, // No service fee for COD
    description: 'Pay when your order is delivered to your doorstep'
  },
  
  general: {
    currency: 'INR',
    currencySymbol: '₹',
    taxRate: 0, // 0% tax for now
    shippingFee: 0, // Free shipping
    minOrderAmount: 1
  }
}

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
} as const

export const ORDER_STATUS = {
  CREATED: 'created',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
} as const

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS]
export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS]

export interface PaymentMethod {
  id: string
  name: string
  type: 'card' | 'wallet' | 'bank_transfer' | 'cod' | 'upi'
  enabled: boolean
  description: string
  icon?: string
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'razorpay',
    name: 'Card Payment',
    type: 'card',
    enabled: true,
    description: 'Credit/Debit Cards, Net Banking',
    icon: '💳'
  },
  {
    id: 'upi',
    name: 'UPI Payment',
    type: 'upi',
    enabled: true,
    description: 'Pay with PhonePe, GPay, Paytm',
    icon: '📱'
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    type: 'cod',
    enabled: true,
    description: 'Pay when your order arrives',
    icon: '📦'
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    type: 'bank_transfer',
    enabled: true,
    description: 'Direct bank transfer',
    icon: '🏦'
  }
]
