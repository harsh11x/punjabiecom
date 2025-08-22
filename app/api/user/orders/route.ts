import { NextRequest, NextResponse } from 'next/server'

// Simple user authentication (you can enhance this later)
const verifyUser = (request: NextRequest) => {
  const userEmail = request.headers.get('x-user-email')
  return userEmail // For now, just check if email is present
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
      return NextResponse.json(
        { success: false, error: 'User email not found' },
        { status: 400 }
      )
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
