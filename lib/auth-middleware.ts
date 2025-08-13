import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export interface AuthUser {
  id: string
  email: string
  role: 'user' | 'admin'
  name: string
}

export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return null
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    
    await connectDB()
    
    // Find user by ID
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return null
    }

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    }

  } catch (error) {
    console.error('Auth verification error:', error)
    return null
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await verifyAuth(request)
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export async function requireAdmin(request: NextRequest): Promise<AuthUser> {
  const user = await requireAuth(request)
  if (user.role !== 'admin') {
    throw new Error('Admin access required')
  }
  return user
}