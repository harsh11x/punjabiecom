import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // For now, we'll allow admin access without strict authentication
    // This is for development - in production you'd want proper auth
    
    console.log('🔐 Admin auth verify called')
    
    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: 'admin',
        email: 'admin@punjabi-heritage.com',
        role: 'admin',
        name: 'Admin User'
      }
    })
  } catch (error: any) {
    console.error('❌ Admin auth verify error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request) // Same logic for POST requests
}
