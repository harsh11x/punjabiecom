import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/firebase'
import { getAuth } from 'firebase-admin/auth'
import fs from 'fs'
import path from 'path'

// Initialize Firebase Admin if not already done
let adminAuth: any = null
try {
  const admin = require('firebase-admin')
  if (!admin.apps.length) {
    // For development, we'll use a simple file-based cart storage
    console.log('Using file-based cart storage for development')
  }
} catch (error) {
  console.log('Firebase Admin not available, using file-based storage')
}

const CART_DIR = path.join(process.cwd(), 'data', 'carts')

// Ensure cart directory exists
if (!fs.existsSync(CART_DIR)) {
  fs.mkdirSync(CART_DIR, { recursive: true })
}

function getUserIdFromRequest(request: NextRequest): string | null {
  try {
    // Get user ID from headers (sent by authenticated users)
    const userId = request.headers.get('x-user-id')
    const userEmail = request.headers.get('x-user-email')
    
    if (userId) {
      console.log('Using authenticated user ID:', userId, 'email:', userEmail)
      return userId
    }
    
    // Fallback to session-based approach for guests
    const sessionId = request.headers.get('x-session-id') || 'guest'
    console.log('Using guest session ID:', sessionId)
    return sessionId
  } catch (error) {
    console.error('Error getting user ID:', error)
    return 'guest'
  }
}

// GET - Get user's cart
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ items: [] })
    }

    const cartFile = path.join(CART_DIR, `${userId}.json`)
    
    if (!fs.existsSync(cartFile)) {
      return NextResponse.json({ items: [] })
    }

    const cartData = JSON.parse(fs.readFileSync(cartFile, 'utf8'))
    return NextResponse.json({ items: cartData.items || [] })
  } catch (error) {
    console.error('Error getting cart:', error)
    return NextResponse.json({ items: [] })
  }
}

// POST - Save user's cart
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const { items } = await request.json()
    const cartFile = path.join(CART_DIR, `${userId}.json`)
    
    const cartData = {
      userId,
      items: items || [],
      updatedAt: new Date().toISOString()
    }

    fs.writeFileSync(cartFile, JSON.stringify(cartData, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cart saved successfully',
      itemCount: items?.length || 0
    })
  } catch (error) {
    console.error('Error saving cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save cart' },
      { status: 500 }
    )
  }
}

// DELETE - Clear user's cart
export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const cartFile = path.join(CART_DIR, `${userId}.json`)
    
    if (fs.existsSync(cartFile)) {
      fs.unlinkSync(cartFile)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cart cleared successfully' 
    })
  } catch (error) {
    console.error('Error clearing cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to clear cart' },
      { status: 500 }
    )
  }
}
