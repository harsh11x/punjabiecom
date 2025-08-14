import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// Admin credentials - In production, this should be stored securely in a database
const ADMIN_CREDENTIALS = {
  email: 'harshdevsingh2004@gmail.com',
  password: '$2a$12$Wo7PMONkArpkhjW8zNJ8eOf/5gPQ.eaf2/wNxePoDi43hCPcEXmSC', // hashed '2004@Singh'
  id: 'admin_harsh_001',
  name: 'Harsh Dev Singh',
  role: 'super_admin'
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check credentials
    if (email !== ADMIN_CREDENTIALS.email) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, ADMIN_CREDENTIALS.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: ADMIN_CREDENTIALS.id, 
        email: ADMIN_CREDENTIALS.email,
        role: ADMIN_CREDENTIALS.role 
      },
      process.env.JWT_SECRET || 'punjab-admin-secret-key',
      { expiresIn: '7d' }
    )

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: {
        id: ADMIN_CREDENTIALS.id,
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role
      }
    })

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}
