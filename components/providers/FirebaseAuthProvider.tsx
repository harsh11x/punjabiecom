'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// Firebase Auth Context
interface FirebaseAuthContextType {
  user: any | null
  loading: boolean
  isAuthenticated: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  login: (email: string, password: string) => Promise<any>
  signup: (email: string, password: string) => Promise<any>
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
    // Simulate auth check
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    setError(null)
    try {
      // Mock sign in - replace with actual Firebase auth
      console.log('Sign in:', email)
      const mockUser = { email, uid: 'mock-uid', displayName: email.split('@')[0] }
      setUser(mockUser)
      return { user: mockUser }
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const signUp = async (email: string, password: string) => {
    setError(null)
    try {
      // Mock sign up - replace with actual Firebase auth
      console.log('Sign up:', email)
      const mockUser = { email, uid: 'mock-uid', displayName: email.split('@')[0] }
      setUser(mockUser)
      return { user: mockUser }
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const signOut = async () => {
    setError(null)
    try {
      // Mock sign out - replace with actual Firebase auth
      console.log('Sign out')
      setUser(null)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const loginWithGoogle = async () => {
    setError(null)
    try {
      // Mock Google login
      console.log('Google login')
      const mockUser = { email: 'user@gmail.com', uid: 'google-uid', displayName: 'Google User' }
      setUser(mockUser)
      return { user: mockUser }
    } catch (err: any) {
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
