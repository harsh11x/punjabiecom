import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { generateAdminToken, DEFAULT_ADMIN } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // For now, use default admin credentials
    // In production, you'd check against database
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      const adminUser = {
        id: 'admin-1',
        email: DEFAULT_ADMIN.email,
        role: DEFAULT_ADMIN.role,
        isActive: true
      }

      const token = generateAdminToken(adminUser)

      return NextResponse.json({
        success: true,
        data: {
          user: adminUser,
          token
        },
        message: 'Login successful'
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}