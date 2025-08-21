import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage for carts (resets on Vercel function restart, but works for demo)
let carts: any[] = []

// Generate unique cart ID
const generateCartId = () => `cart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email')
    
    if (!userEmail) {
      return NextResponse.json({ items: [] }, { status: 200 })
    }
    
    console.log(`🔄 Fetching cart for user: ${userEmail}`)
    
    // Find user's cart
    const userCart = carts.find(cart => cart.userEmail === userEmail)
    
    if (!userCart) {
      console.log(`✅ No cart found for user: ${userEmail}`)
      return NextResponse.json({ items: [] }, { status: 200 })
    }
    
    console.log(`✅ Retrieved cart with ${userCart.items?.length || 0} items`)
    return NextResponse.json({ items: userCart.items || [] }, { status: 200 })
    
  } catch (error: any) {
    console.error('❌ Error fetching cart:', error)
    return NextResponse.json({ items: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userEmail = request.headers.get('x-user-email')
    
    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: 'User email required' },
        { status: 400 }
      )
    }
    
    console.log(`🔄 Updating cart for user: ${userEmail}`)
    
    // Find existing cart or create new one
    let userCart = carts.find(cart => cart.userEmail === userEmail)
    
    if (!userCart) {
      userCart = {
        _id: generateCartId(),
        userEmail,
        items: [],
        updatedAt: new Date().toISOString()
      }
      carts.push(userCart)
    }
    
    // Update cart items
    userCart.items = body.items || []
    userCart.updatedAt = new Date().toISOString()
    
    console.log(`✅ Cart updated successfully with ${userCart.items.length} items`)
    
    return NextResponse.json({
      success: true,
      message: 'Cart updated successfully',
      itemCount: userCart.items.length
    }, { status: 200 })
    
  } catch (error: any) {
    console.error('❌ Error updating cart:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update cart' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const userEmail = request.headers.get('x-user-email')
    
    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: 'User email required' },
        { status: 400 }
      )
    }
    
    console.log(`🔄 Updating cart item for user: ${userEmail}`)
    
    // Find user's cart
    let userCart = carts.find(cart => cart.userEmail === userEmail)
    
    if (!userCart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      )
    }
    
    // Update specific item
    const { itemId, updates } = body
    const itemIndex = userCart.items.findIndex((item: any) => item.id === itemId)
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      )
    }
    
    userCart.items[itemIndex] = { ...userCart.items[itemIndex], ...updates }
    userCart.updatedAt = new Date().toISOString()
    
    console.log(`✅ Cart item updated successfully`)
    
    return NextResponse.json({
      success: true,
      message: 'Cart item updated successfully'
    }, { status: 200 })
    
  } catch (error: any) {
    console.error('❌ Error updating cart item:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const userEmail = request.headers.get('x-user-email')
    
    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: 'User email required' },
        { status: 400 }
      )
    }
    
    console.log(`🔄 Processing cart deletion for user: ${userEmail}`)
    
    // Find user's cart
    const userCart = carts.find(cart => cart.userEmail === userEmail)
    
    if (!userCart) {
      return NextResponse.json(
        { success: true, message: 'Cart already empty' },
        { status: 200 }
      )
    }
    
    // Clear cart items
    userCart.items = []
    userCart.updatedAt = new Date().toISOString()
    
    console.log(`✅ Cart cleared successfully for user: ${userEmail}`)
    
    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully'
    }, { status: 200 })
    
  } catch (error: any) {
    console.error('❌ Error clearing cart:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to clear cart' },
      { status: 500 }
    )
  }
}
