'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSocket } from '@/hooks/useSocket'
import { toast } from 'sonner'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  gender?: 'male' | 'female' | 'other'
  role: 'user' | 'admin'
  address?: {
    street: string
    city: string
    state: string
    pincode: string
  }
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, phone?: string, gender?: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const socket = useSocket()

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Socket authentication
  useEffect(() => {
    if (socket?.socket && user) {
      // Authenticate socket with user token
      const token = localStorage.getItem('auth-token')
      if (token) {
        socket.socket.emit('authenticate', { token })
      }
    }
  }, [socket, user])

  // Listen for profile updates
  useEffect(() => {
    if (socket?.socket) {
      socket.socket.on('profile-update-success', (userData) => {
        setUser(userData)
        toast.success('Profile updated successfully')
      })

      return () => {
        socket.socket.off('profile-update-success')
      }
    }
  }, [socket])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        localStorage.removeItem('auth-token')
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      localStorage.removeItem('auth-token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Login failed')
    }

    // Store token
    localStorage.setItem('auth-token', data.token)
    setUser(data.user)
    
    // Authenticate socket
    if (socket) {
      socket.emit('authenticate', { token: data.token })
    }

    toast.success('Login successful')
  }

  const signup = async (name: string, email: string, password: string, phone?: string, gender?: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, phone, gender }),
      credentials: 'include'
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Signup failed')
    }

    // Store token
    localStorage.setItem('auth-token', data.token)
    setUser(data.user)
    
    // Authenticate socket
    if (socket) {
      socket.emit('authenticate', { token: data.token })
    }

    toast.success('Account created successfully')
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('auth-token')
      setUser(null)
      
      // Disconnect socket
      if (socket) {
        socket.disconnect()
      }
      
      toast.success('Logged out successfully')
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    const token = localStorage.getItem('auth-token')
    if (!token) throw new Error('Not authenticated')

    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
      credentials: 'include'
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update profile')
    }

    setUser(result.user)
    
    // Emit profile update to socket
    if (socket) {
      socket.emit('profile-updated', { userId: user?.id, ...result.user })
    }

    return result.user
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}