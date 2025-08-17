'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// Simple Auth Context
interface SimpleAuthContextType {
  user: any | null
  loading: boolean
  isAuthenticated: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, name?: string, phone?: string) => Promise<any>
  signOut: () => Promise<void>
  login: (email: string, password: string) => Promise<any>
  signup: (email: string, password: string, name?: string, phone?: string) => Promise<any>
  loginWithGoogle: () => Promise<any>
  updateUserProfile: (data: any) => Promise<any>
  clearError: () => void
}

const SimpleAuthContext = createContext<SimpleAuthContextType | null>(null)

export function useFirebaseAuth() {
  const context = useContext(SimpleAuthContext)
  if (!context) {
    throw new Error('useFirebaseAuth must be used within a SimpleAuthProvider')
  }
  return context
}

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simple mock authentication
      if (email && password) {
        const mockUser = {
          id: 'user_' + Date.now(),
          email: email,
          displayName: email.split('@')[0],
          phone: '',
          address: ''
        }
        setUser(mockUser)
        localStorage.setItem('auth_user', JSON.stringify(mockUser))
        return mockUser
      } else {
        throw new Error('Email and password are required')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name?: string, phone?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simple mock registration
      if (email && password) {
        const mockUser = {
          id: 'user_' + Date.now(),
          email: email,
          displayName: name || email.split('@')[0],
          phone: phone || '',
          address: ''
        }
        setUser(mockUser)
        localStorage.setItem('auth_user', JSON.stringify(mockUser))
        return mockUser
      } else {
        throw new Error('Email and password are required')
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('auth_user')
  }

  const loginWithGoogle = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Mock Google login
      const mockUser = {
        id: 'google_user_' + Date.now(),
        email: 'user@gmail.com',
        displayName: 'Google User',
        phone: '',
        address: ''
      }
      setUser(mockUser)
      localStorage.setItem('auth_user', JSON.stringify(mockUser))
      return mockUser
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (data: any) => {
    try {
      if (user) {
        const updatedUser = { ...user, ...data }
        setUser(updatedUser)
        localStorage.setItem('auth_user', JSON.stringify(updatedUser))
        return { success: true }
      }
      throw new Error('No user logged in')
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  // Check for existing user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (err) {
        localStorage.removeItem('auth_user')
      }
    }
  }, [])

  const value: SimpleAuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    error,
    signIn,
    signUp,
    signOut,
    login: signIn, // Alias
    signup: signUp, // Alias
    loginWithGoogle,
    updateUserProfile,
    clearError
  }

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  )
}
