import fs from 'fs'
import path from 'path'

// Local file storage fallback
const DATA_DIR = path.resolve(process.cwd(), 'data')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Initialize orders file if it doesn't exist
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf8')
}

// Order interface
export interface AWSOrder {
  _id: string
  orderNumber: string
  customerEmail: string
  items: Array<{
    productId: string
    name: string
    punjabiName: string
    price: number
    quantity: number
    size: string
    color: string
    image: string
  }>
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: 'razorpay' | 'cod' | 'bank_transfer'
  shippingAddress: {
    fullName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  billingAddress?: {
    fullName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
  deliveredAt?: string
  cancelledAt?: string
  cancellationReason?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Create new order in local storage
export async function createOrder(orderData: Omit<AWSOrder, '_id' | 'createdAt' | 'updatedAt'>): Promise<AWSOrder> {
  try {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const timestamp = new Date().toISOString()
    
    const order: AWSOrder = {
      _id: orderId,
      ...orderData,
      createdAt: timestamp,
      updatedAt: timestamp
    }

    // Read existing orders
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'))
    
    // Add new order
    orders.push(order)
    
    // Save back to file
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8')

    console.log('✅ Order saved to local storage:', orderId)
    return order

  } catch (error) {
    console.error('❌ Failed to save order to local storage:', error)
    throw new Error('Failed to save order to local storage')
  }
}

// Get order by ID
export async function getOrder(orderId: string): Promise<AWSOrder | null> {
  try {
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'))
    return orders.find((order: AWSOrder) => order._id === orderId) || null
  } catch (error) {
    console.error('❌ Failed to get order from local storage:', error)
    return null
  }
}

// Get order by order number
export async function getOrderByNumber(orderNumber: string): Promise<AWSOrder | null> {
  try {
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'))
    return orders.find((order: AWSOrder) => order.orderNumber === orderNumber) || null
  } catch (error) {
    console.error('❌ Failed to get order by number from local storage:', error)
    return null
  }
}

// Get orders by customer email
export async function getOrdersByEmail(customerEmail: string): Promise<AWSOrder[]> {
  try {
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'))
    return orders.filter((order: AWSOrder) => order.customerEmail === customerEmail)
  } catch (error) {
    console.error('❌ Failed to get orders by email from local storage:', error)
    return []
  }
}

// Get all orders (for admin panel)
export async function getAllOrders(): Promise<AWSOrder[]> {
  try {
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'))
    return orders
  } catch (error) {
    console.error('❌ Failed to get all orders from local storage:', error)
    return []
  }
}

// Update order status and tracking
export async function updateOrderStatus(
  orderId: string, 
  updates: Partial<Pick<AWSOrder, 'status' | 'paymentStatus' | 'trackingNumber' | 'estimatedDelivery' | 'notes'>>
): Promise<AWSOrder | null> {
  try {
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'))
    const orderIndex = orders.findIndex((order: AWSOrder) => order._id === orderId)
    
    if (orderIndex === -1) {
      throw new Error('Order not found')
    }

    const updatedOrder: AWSOrder = {
      ...orders[orderIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    // Update the order in the array
    orders[orderIndex] = updatedOrder
    
    // Save back to file
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8')

    console.log('✅ Order updated in local storage:', orderId)
    return updatedOrder

  } catch (error) {
    console.error('❌ Failed to update order in local storage:', error)
    return null
  }
}

// Delete order (for admin use)
export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'))
    const filteredOrders = orders.filter((order: AWSOrder) => order._id !== orderId)
    
    // Save back to file
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(filteredOrders, null, 2), 'utf8')

    console.log('✅ Order deleted from local storage:', orderId)
    return true

  } catch (error) {
    console.error('❌ Failed to delete order from local storage:', error)
    return false
  }
}
