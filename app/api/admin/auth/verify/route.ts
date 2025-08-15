import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request)
    
    if (authResult.success) {
      return NextResponse.json({
        success: true,
        user: authResult.user
      })
    } else {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Admin auth verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication verification failed' },
      { status: 500 }
    )
  }
}
