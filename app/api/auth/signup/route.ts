import { NextRequest, NextResponse } from 'next/server'
import { createUser, signUserToken, addSession } from '@/lib/file-store'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Create new user
    const user = await createUser({ name, email, password, phone })

    // Generate JWT token
    const token = signUserToken(user)
    const expiresMs = 7 * 24 * 60 * 60 * 1000
    await addSession(token, user.id, Date.now() + expiresMs)

    // Create response
    const response = NextResponse.json(
      {
        message: 'User created successfully',
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }
      },
      { status: 201 }
    )

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    return response

  } catch (error: any) {
    console.error('Signup error:', error)
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}