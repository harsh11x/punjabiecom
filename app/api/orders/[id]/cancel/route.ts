import { NextRequest, NextResponse } from 'next/server'
import { orderStorage } from '@/lib/shared-storage'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }

    console.log(`🔄 Attempting to cancel order: ${orderId}`)

    // Cancel the order
    const result = orderStorage.cancelOrder(orderId)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    console.log(`✅ Order cancelled successfully: ${orderId}`)

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
      data: result.order
    })

  } catch (error: any) {
    console.error('❌ Error cancelling order:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to cancel order' },
      { status: 500 }
    )
  }
}
