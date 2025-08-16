'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// Firebase Auth Context
interface FirebaseAuthContextType {
  user: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
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

  useEffect(() => {
    // Simulate auth check
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Mock sign in - replace with actual Firebase auth
    console.log('Sign in:', email)
    return { user: { email } }
  }

  const signUp = async (email: string, password: string) => {
    // Mock sign up - replace with actual Firebase auth
    console.log('Sign up:', email)
    return { user: { email } }
  }

  const signOut = async () => {
    // Mock sign out - replace with actual Firebase auth
    console.log('Sign out')
    setUser(null)
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  }

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}
