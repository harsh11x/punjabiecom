import { NextRequest, NextResponse } from 'next/server'
import { orderStorage } from '@/lib/shared-storage'

export async function POST(request: NextRequest) {
  try {
    console.log('🔥 Creating new order...')
    const orderData = await request.json()
    console.log('Order data received:', JSON.stringify(orderData, null, 2))
    
    // Validate required fields
    if (!orderData.customerEmail || !orderData.items || !orderData.shippingAddress) {
      console.error('❌ Missing required fields:', {
        customerEmail: !!orderData.customerEmail,
        items: !!orderData.items,
        shippingAddress: !!orderData.shippingAddress
      })
      return NextResponse.json(
        { success: false, error: 'Missing required fields: customerEmail, items, shippingAddress' },
        { status: 400 }
      )
    }
    
    console.log('✅ Required fields validation passed')
    
                    // Create order object
                const newOrder = {
                  customerEmail: orderData.customerEmail,
                  items: orderData.items,
                  subtotal: orderData.subtotal || 0,
                  shippingCost: orderData.shippingCost || 0,
                  tax: orderData.tax || 0,
                  total: orderData.total || orderData.subtotal || 0,
                  status: orderData.status || 'pending',
                  paymentStatus: orderData.paymentStatus || 'pending',
                  paymentMethod: orderData.paymentMethod || 'razorpay',
                  shippingAddress: orderData.shippingAddress,
                  billingAddress: orderData.billingAddress || orderData.shippingAddress,
                  notes: orderData.notes || ''
                }

                // Save to shared storage
                const savedOrder = orderStorage.addOrder(newOrder)
    
                    console.log('✅ Order created successfully:', savedOrder._id)
                console.log('📊 Total orders in shared storage:', orderStorage.getOrderCount())
    
                    return NextResponse.json({
                  success: true,
                  data: savedOrder
                })
    
  } catch (error: any) {
    console.error('❌ Error creating order:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    const orderNumber = searchParams.get('orderNumber')
    const customerEmail = searchParams.get('email') || 
                         request.headers.get('x-user-email')
    
    let filteredOrders = orderStorage.getAllOrders()
    
    if (orderId) {
      filteredOrders = filteredOrders.filter((order: any) => order._id === orderId)
    } else if (orderNumber) {
      filteredOrders = filteredOrders.filter((order: any) => order.orderNumber === orderNumber)
    } else if (customerEmail) {
      filteredOrders = filteredOrders.filter((order: any) => 
        order.customerEmail.toLowerCase() === customerEmail.toLowerCase()
      )
    }
    
    console.log(`✅ Retrieved ${filteredOrders.length} orders from memory`)
    
    return NextResponse.json({
      success: true,
      data: filteredOrders
    })
    
  } catch (error: any) {
    console.error('❌ Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    const updateData = await request.json()
    // Update order using shared storage
    const updatedOrder = orderStorage.updateOrder(orderId, updateData)
    
    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    console.log('✅ Order updated successfully:', orderId)
    
    return NextResponse.json({
      success: true,
      data: updatedOrder
    })
    
  } catch (error: any) {
    console.error('❌ Error updating order:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function HEAD() {
  return NextResponse.json({ 
    status: 'healthy', 
    ordersCount: orderStorage.getOrderCount(),
    timestamp: new Date().toISOString()
  })
}
