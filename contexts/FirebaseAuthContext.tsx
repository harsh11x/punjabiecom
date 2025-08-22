'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

interface FirebaseUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  phoneNumber: string | null
  metadata: {
    creationTime: string
    lastSignInTime: string
  }
  getIdToken: () => Promise<string>
}

interface FirebaseAuthContextType {
  user: FirebaseUser | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>
  isAuthenticated: boolean
  clearError: () => void
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined)

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Convert Firebase User to our FirebaseUser interface
  const convertUser = (firebaseUser: User): FirebaseUser => ({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    phoneNumber: firebaseUser.phoneNumber,
    metadata: {
      creationTime: firebaseUser.metadata.creationTime || new Date().toISOString(),
      lastSignInTime: firebaseUser.metadata.lastSignInTime || new Date().toISOString()
    },
    getIdToken: () => firebaseUser.getIdToken()
  })

  // Listen for authentication state changes
  useEffect(() => {
    let unsubscribe: (() => void) | null = null
    
    try {
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        try {
          if (firebaseUser) {
            setUser(convertUser(firebaseUser))
          } else {
            setUser(null)
          }
          setLoading(false)
        } catch (error) {
          console.error('Error processing auth state change:', error)
          setError('Authentication error occurred')
          setLoading(false)
        }
      }, (error) => {
        console.error('Firebase auth state change error:', error)
        setError('Authentication service error')
        setLoading(false)
      })
    } catch (error) {
      console.error('Error setting up auth listener:', error)
      setError('Failed to initialize authentication')
      setLoading(false)
    }

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe()
        } catch (error) {
          console.error('Error cleaning up auth listener:', error)
        }
      }
    }
  }, [])

  const clearError = () => setError(null)

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await signInWithEmailAndPassword(auth, email, password)
      setUser(convertUser(result.user))
    } catch (error: any) {
      setError(error.message || 'Failed to log in')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update the user's display name
      await updateProfile(result.user, {
        displayName: name
      })
      
      setUser(convertUser(result.user))
    } catch (error: any) {
      setError(error.message || 'Failed to create account')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    console.log('Google login clicked')
    try {
      setLoading(true)
      setError(null)
      console.log('About to call signInWithPopup')
      const result = await signInWithPopup(auth, googleProvider)
      console.log('Google login successful:', result.user.email)
      setUser(convertUser(result.user))
    } catch (error: any) {
      console.error('Google login error:', error)
      setError(error.message || 'Failed to sign in with Google')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      setError(null)
      await signOut(auth)
      setUser(null)
    } catch (error: any) {
      setError(error.message || 'Failed to log out')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (!auth.currentUser) {
      throw new Error('No authenticated user')
    }

    try {
      setLoading(true)
      setError(null)
      await updateProfile(auth.currentUser, data)
      
      // Update local user state
      if (user) {
        setUser({
          ...user,
          displayName: data.displayName || user.displayName,
          photoURL: data.photoURL || user.photoURL
        })
      }
    } catch (error: any) {
      setError(error.message || 'Failed to update profile')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateUserProfile,
    isAuthenticated: !!user,
    clearError
  }

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext)
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider')
  }
  return context
}