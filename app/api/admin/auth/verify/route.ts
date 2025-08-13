import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Admin from '@/models/Admin'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    // Check if JWT secret is available
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      return NextResponse.json(
        { success: false, error: 'Authentication configuration not available' },
        { status: 503 }
      )
    }
    
    const dbConnection = await connectDB()
    if (!dbConnection) {
      return NextResponse.json(
        { success: false, error: 'Database connection not available' },
        { status: 503 }
      )
    }
    
    // Get token from cookies
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret) as any
    
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Check if admin exists and is active
    const admin = await Admin.findById(decoded.id).select('-password')
    
    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { success: false, error: 'Admin not found or inactive' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    })
  } catch (error: any) {
    console.error('Admin auth verify error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 401 }
    )
  }
}