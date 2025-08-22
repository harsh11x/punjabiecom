import { NextRequest, NextResponse } from 'next/server'

// Simple user authentication (you can enhance this later)
const verifyUser = (request: NextRequest) => {
  // Method 1: Check x-user-email header
  const userEmail = request.headers.get('x-user-email')
  if (userEmail) {
    return true
  }
  
  // Method 2: Check Authorization header (Bearer token)
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // For now, accept any Bearer token for user access
    // You can enhance this with proper JWT verification later
    return true
  }
  
  // Method 3: Check cookies (if using session-based auth)
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader && cookieHeader.includes('user')) {
    return true
  }
  
  return false
}

// GET - Get user's orders
export async function GET(request: NextRequest) {
  try {
    // Simple user verification
    if (!verifyUser(request)) {
      console.log('❌ User access denied - no email provided')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')
    const customerEmail = request.headers.get('x-user-email')

    if (!customerEmail) {
      console.log('⚠️ No customer email provided, returning empty orders')
      return NextResponse.json({
        success: true,
        data: [],
        total: 0
      })
    }

    console.log('🔄 User fetching orders for:', customerEmail)

    // Get orders from shared storage
    const { orderStorage } = await import('@/lib/shared-storage')
    const orders = orderStorage.getOrdersByUser(customerEmail)

    console.log(`✅ Retrieved ${orders.length} orders for user`)

    return NextResponse.json({
      success: true,
      data: orders,
      total: orders.length
    })

  } catch (error: any) {
    console.error('❌ Error fetching user orders:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
