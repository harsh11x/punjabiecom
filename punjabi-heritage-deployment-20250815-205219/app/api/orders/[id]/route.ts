import { NextRequest, NextResponse } from 'next/server'
import { orders } from '@/lib/shared-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const order = orders.get(resolvedParams.id)
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Convert order to the format expected by the frontend
    const formattedOrder = {
      _id: order.id,
      orderNumber: order.orderNumber,
      customer: {
        fullName: order.shippingAddress.fullName,
        email: order.shippingAddress.email,
        phone: order.shippingAddress.phone,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        pincode: order.shippingAddress.pincode
      },
      items: order.items.map((item: any) => ({
        name: item.name,
        punjabiName: item.punjabiName || item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image
      })),
      totalAmount: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      trackingId: (order as any).trackingId,
      shippingProvider: (order as any).shippingProvider,
      estimatedDelivery: (order as any).estimatedDelivery,
      notes: order.notes,
      createdAt: order.createdAt
    }
    
    return NextResponse.json({
      success: true,
      data: formattedOrder
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

// PUT and DELETE endpoints can be added later if needed for admin order management
