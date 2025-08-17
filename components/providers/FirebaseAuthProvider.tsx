'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// Firebase Auth Context
interface FirebaseAuthContextType {
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

const FirebaseAuthContext = createContext<FirebaseAuthContextType | null>(null)

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext)
  if (!context) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider')
  }
  return context
}

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', // Include cookies
        })

        if (response.ok) {
          const data = await response.json()
          const user = {
            uid: data.user.id,
            email: data.user.email,
            displayName: data.user.name,
            phone: data.user.phone,
            role: data.user.role
          }
          setUser(user)
        }
      } catch (error) {
        console.log('No existing session found')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    setError(null)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      const user = {
        uid: data.user.id,
        email: data.user.email,
        displayName: data.user.name,
        phone: data.user.phone,
        role: data.user.role
      }
      
      setUser(user)
      return { user }
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const signUp = async (email: string, password: string, name?: string, phone?: string) => {
    setError(null)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: name || email.split('@')[0], 
          email, 
          password, 
          phone 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      const user = {
        uid: data.user.id,
        email: data.user.email,
        displayName: data.user.name,
        phone: data.user.phone,
        role: data.user.role
      }
      
      setUser(user)
      return { user }
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const signOut = async () => {
    setError(null)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Clear user regardless of API response
      setUser(null)
      
      if (!response.ok) {
        console.warn('Logout API call failed, but user was logged out locally')
      }
    } catch (err: any) {
      // Still clear user locally even if API fails
      setUser(null)
      console.warn('Logout error:', err.message)
    }
  }

  const loginWithGoogle = async () => {
    setError(null)
    try {
      // Mock Google login - create a mock user
      console.log('Google login - creating mock user')
      const mockUser = { 
        uid: 'google-' + Date.now(), 
        email: 'user@gmail.com', 
        displayName: 'Google User',
        phone: '',
        role: 'user'
      }
      setUser(mockUser)
      console.log('Mock Google user created:', mockUser)
      return { user: mockUser }
    } catch (err: any) {
      console.error('Google login error:', err)
      setError(err.message)
      throw err
    }
  }

  const updateUserProfile = async (data: any) => {
    setError(null)
    try {
      // Mock profile update
      console.log('Update profile:', data)
      setUser((prev: any) => ({ ...prev, ...data }))
      return { success: true }
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
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
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}
