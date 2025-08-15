import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Create a test order to verify the system works
    const testOrder = {
      customerInfo: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+91-9876543210',
        address: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'Punjab',
          pincode: '123456'
        }
      },
      items: [
        {
          productId: '1', // Bridal Gold Jutti
          name: 'Bridal Gold Jutti',
          price: 3299,
          quantity: 1,
          size: '7',
          color: 'Gold'
        }
      ],
      total: 3299,
      paymentMethod: 'COD',
      notes: 'Test order to verify system functionality'
    }

    // Call the orders API to create the test order
    const orderResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3002'}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder)
    })

    const orderData = await orderResponse.json()

    if (orderData.success) {
      return NextResponse.json({
        success: true,
        message: 'Test order created successfully!',
        order: orderData.order
      })
    } else {
      return NextResponse.json({
        success: false,
        error: orderData.error || 'Failed to create test order'
      }, { status: 400 })
    }

  } catch (error: any) {
    console.error('Error creating test order:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create test order'
    }, { status: 500 })
  }
}
