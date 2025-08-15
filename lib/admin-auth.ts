import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { connectDB } from './mongodb'

export interface AdminUser {
  id: string
  email: string
  role: 'super_admin' | 'admin' | 'manager'
  isActive: boolean
}

export interface AuthResult {
  success: boolean
  user?: AdminUser
  error?: string
}

export async function verifyAdminAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'No authorization token provided' }
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    if (!decoded || !decoded.id || !decoded.email) {
      return { success: false, error: 'Invalid token' }
    }

    // For now, we'll use a simple check. In production, you'd verify against database
    const adminUser: AdminUser = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'admin',
      isActive: true
    }

    return { success: true, user: adminUser }

  } catch (error) {
    console.error('Admin auth error:', error)
    return { success: false, error: 'Authentication failed' }
  }
}

export function generateAdminToken(user: AdminUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  )
}

// Default admin credentials for initial setup
export const DEFAULT_ADMIN = {
  email: 'harshdevsingh2004@gmail.com',
  password: 'admin123', // Change this in production
  role: 'super_admin' as const
}