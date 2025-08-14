import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

// Auth middleware
function verifyAdminToken(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value
  if (!token) {
    throw new Error('No token provided')
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'punjab-admin-secret-key')
  return decoded
}

// Data file paths
const DATA_DIR = path.resolve(process.cwd(), 'data')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

function getOrders() {
  if (!fs.existsSync(ORDERS_FILE)) {
    // Create initial demo orders
    const demoOrders = [
      {
        _id: 'order_001',
        orderNumber: 'PH-2024-001',
        customerInfo: {
          name: 'Simran Kaur',
          email: 'simran@example.com',
          phone: '+91-98765-43210',
          address: {
            street: '123 Punjab Street',
            city: 'Chandigarh',
            state: 'Punjab',
            pincode: '160001'
          }
        },
        items: [
          {
            productId: 'prod_001',
            name: 'Traditional Punjabi Jutti',
            price: 1500,
            quantity: 2,
            size: 'UK 7',
            color: 'Red'
          }
        ],
        total: 3000,
        status: 'pending',
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        trackingNumber: '',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'order_002',
        orderNumber: 'PH-2024-002',
        customerInfo: {
          name: 'Rajveer Singh',
          email: 'rajveer@example.com',
          phone: '+91-87654-32109',
          address: {
            street: '456 Heritage Lane',
            city: 'Amritsar',
            state: 'Punjab',
            pincode: '143001'
          }
        },
        items: [
          {
            productId: 'prod_002',
            name: 'Phulkari Dupatta',
            price: 2500,
            quantity: 1,
            size: 'One Size',
            color: 'Pink'
          }
        ],
        total: 2500,
        status: 'processing',
        paymentMethod: 'online',
        paymentStatus: 'paid',
        trackingNumber: 'TN123456789',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
    
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(demoOrders, null, 2), 'utf8')
    return demoOrders
  }
  
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading orders:', error)
    return []
  }
}

function saveOrders(orders: any[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8')
  } catch (error) {
    console.error('Error saving orders:', error)
    throw error
  }
}

// GET - Fetch all orders
export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request)
    
    const orders = getOrders()
    
    // Sort by creation date (newest first)
    orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    // Calculate statistics
    const stats = {
      total: orders.length,
      pending: orders.filter((o: any) => o.status === 'pending').length,
      processing: orders.filter((o: any) => o.status === 'processing').length,
      shipped: orders.filter((o: any) => o.status === 'shipped').length,
      delivered: orders.filter((o: any) => o.status === 'delivered').length,
      cancelled: orders.filter((o: any) => o.status === 'cancelled').length,
      totalRevenue: orders.reduce((sum: number, order: any) => sum + order.total, 0),
      codOrders: orders.filter((o: any) => o.paymentMethod === 'COD').length,
      onlineOrders: orders.filter((o: any) => o.paymentMethod === 'online').length
    }
    
    return NextResponse.json({
      success: true,
      orders,
      stats
    })
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    )
  }
}

// PUT - Update order status or tracking
export async function PUT(request: NextRequest) {
  try {
    verifyAdminToken(request)
    
    const updateData = await request.json()
    const { orderId, status, trackingNumber, paymentStatus } = updateData
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    const orders = getOrders()
    const orderIndex = orders.findIndex((o: any) => o._id === orderId)
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Update order fields
    if (status) orders[orderIndex].status = status
    if (trackingNumber !== undefined) orders[orderIndex].trackingNumber = trackingNumber
    if (paymentStatus) orders[orderIndex].paymentStatus = paymentStatus
    orders[orderIndex].updatedAt = new Date().toISOString()
    
    saveOrders(orders)
    
    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: orders[orderIndex]
    })
  } catch (error: any) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    )
  }
}

// DELETE - Cancel/Delete order
export async function DELETE(request: NextRequest) {
  try {
    verifyAdminToken(request)
    
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    const orders = getOrders()
    const orderIndex = orders.findIndex((o: any) => o._id === orderId)
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Mark as cancelled instead of deleting
    orders[orderIndex].status = 'cancelled'
    orders[orderIndex].updatedAt = new Date().toISOString()
    
    saveOrders(orders)
    
    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully'
    })
  } catch (error: any) {
    console.error('Error cancelling order:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to cancel order' },
      { status: error.message === 'No token provided' ? 401 : 500 }
    )
  }
}
