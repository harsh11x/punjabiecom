import { NextRequest, NextResponse } from 'next/server'
import { cartStorage } from '@/lib/shared-storage'

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email')
    
    if (!userEmail) {
      return NextResponse.json({ items: [] }, { status: 200 })
    }
    
    console.log(`🔄 Fetching cart for user: ${userEmail}`)
    
    // Get user's cart from shared storage
    const userCart = cartStorage.getOrCreateCart(userEmail)
    
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
    
    // Update cart items using shared storage
    const userCart = cartStorage.updateCartItems(userEmail, body.items || [])
    
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
    
    // Get user's cart from shared storage
    const userCart = cartStorage.getOrCreateCart(userEmail)
    
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
    const userEmail = request.headers.get('x-user-email')
    
    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: 'User email required' },
        { status: 400 }
      )
    }
    
    console.log(`🔄 Processing cart deletion for user: ${userEmail}`)
    
    // Clear cart using shared storage
    const cleared = cartStorage.clearCart(userEmail)
    
    if (!cleared) {
      return NextResponse.json(
        { success: true, message: 'Cart already empty' },
        { status: 200 }
      )
    }
    
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
