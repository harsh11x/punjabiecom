'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { toast } from 'sonner'

// Firebase Auth Context
interface FirebaseAuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, name?: string) => Promise<any>
  signOut: () => Promise<void>
  login: (email: string, password: string) => Promise<any>
  signup: (email: string, password: string, name?: string) => Promise<any>
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
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user?.email || 'No user')
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setError(null)
    setLoading(true)
    try {
      console.log('Signing in with email:', email)
      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log('Sign in successful:', result.user.email)
      toast.success('Welcome back!')
      return { user: result.user }
    } catch (err: any) {
      console.error('Sign in error:', err)
      const errorMessage = getFirebaseErrorMessage(err.code)
      setError(errorMessage)
      toast.error(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    setError(null)
    setLoading(true)
    try {
      console.log('Creating account for:', email)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile with display name
      if (name && result.user) {
        await updateProfile(result.user, {
          displayName: name
        })
      }
      
      console.log('Account created successfully:', result.user.email)
      toast.success('Account created successfully!')
      return { user: result.user }
    } catch (err: any) {
      console.error('Sign up error:', err)
      const errorMessage = getFirebaseErrorMessage(err.code)
      setError(errorMessage)
      toast.error(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setError(null)
    try {
      await firebaseSignOut(auth)
      console.log('User signed out')
      toast.success('Signed out successfully')
    } catch (err: any) {
      console.error('Sign out error:', err)
      setError('Failed to sign out')
      toast.error('Failed to sign out')
      throw err
    }
  }

  const loginWithGoogle = async () => {
    setError(null)
    setLoading(true)
    try {
      console.log('Signing in with Google...')
      const result = await signInWithPopup(auth, googleProvider)
      console.log('Google sign in successful:', result.user.email)
      toast.success('Welcome!')
      return { user: result.user }
    } catch (err: any) {
      console.error('Google sign in error:', err)
      const errorMessage = getFirebaseErrorMessage(err.code)
      setError(errorMessage)
      toast.error(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (data: any) => {
    setError(null)
    try {
      if (user) {
        await updateProfile(user, data)
        console.log('Profile updated successfully')
        toast.success('Profile updated!')
      }
      return { success: true }
    } catch (err: any) {
      console.error('Profile update error:', err)
      setError('Failed to update profile')
      toast.error('Failed to update profile')
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

// Helper function to get user-friendly error messages
function getFirebaseErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address'
    case 'auth/wrong-password':
      return 'Incorrect password'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters'
    case 'auth/invalid-email':
      return 'Invalid email address'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later'
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed'
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled'
    default:
      return 'An error occurred. Please try again'
  }
}
