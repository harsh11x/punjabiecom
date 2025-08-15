import { PaymentStatus, OrderStatus } from './payment-config'

export interface OrderItem {
  productId: string
  name: string
  punjabiName: string
  price: number
  quantity: number
  size: string
  color: string
  image: string
}

export interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  customerEmail: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: string
  createdAt: string
  updatedAt: string
  paymentId?: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  notes?: string
}

export interface PaymentIntent {
  orderId: string
  amount: number
  currency: string
  paymentMethod: string
  customerId?: string
  description?: string
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  orderId: string
  status: PaymentStatus
  error?: string
  transactionId?: string
}

// Generate unique order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substr(2, 5).toUpperCase()
  return `ORD-${timestamp.slice(-8)}-${random}`
}

// Generate unique order ID
export function generateOrderId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Calculate order totals
export function calculateOrderTotals(items: OrderItem[], taxRate: number = 0, shippingFee: number = 0) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = Math.round(subtotal * taxRate)
  const total = subtotal + tax + shippingFee
  
  return {
    subtotal,
    tax,
    shipping: shippingFee,
    total
  }
}

// Validate order data
export function validateOrder(orderData: Partial<Order>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!orderData.items || orderData.items.length === 0) {
    errors.push('Order must contain at least one item')
  }

  if (!orderData.shippingAddress) {
    errors.push('Shipping address is required')
  } else {
    const { fullName, email, phone, address, city, state, pincode } = orderData.shippingAddress
    
    if (!fullName?.trim()) errors.push('Full name is required')
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Valid email is required')
    }
    if (!phone?.trim() || !/^[\d\s\-\+\(\)]{10,15}$/.test(phone)) {
      errors.push('Valid phone number is required')
    }
    if (!address?.trim()) errors.push('Address is required')
    if (!city?.trim()) errors.push('City is required')
    if (!state?.trim()) errors.push('State is required')
    if (!pincode?.trim() || !/^\d{6}$/.test(pincode)) {
      errors.push('Valid 6-digit pincode is required')
    }
  }

  if (!orderData.paymentMethod) {
    errors.push('Payment method is required')
  }

  if (!orderData.total || orderData.total <= 0) {
    errors.push('Order total must be greater than 0')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN')}`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

// Order status helpers
export function getOrderStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'created':
    case 'confirmed':
      return 'bg-blue-100 text-blue-800'
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'shipped':
      return 'bg-purple-100 text-purple-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
    case 'refunded':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'refunded':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
