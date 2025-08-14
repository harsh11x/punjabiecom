#!/usr/bin/env node

/**
 * Emergency Performance Mode
 * 
 * This script temporarily disables slow features to dramatically improve page load speed
 * Use this when you need instant navigation while fixing underlying performance issues
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Enabling Emergency Performance Mode...');

// 1. Create a simplified version of NavigationProgress that does nothing
const fastNavigationProgress = `'use client'

export function NavigationProgress() {
  // Disabled for performance - instant loading
  return null
}`;

// 2. Create a minimal FirebaseAuthContext that doesn't block
const fastFirebaseAuth = `'use client'

import React, { createContext, useContext, useState } from 'react'

interface FirebaseUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  phoneNumber: string | null
}

interface FirebaseAuthContextType {
  user: FirebaseUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>
  isAuthenticated: boolean
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined)

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<FirebaseUser | null>(null)
  const [loading] = useState(false) // Never loading in performance mode

  const noop = async () => {}

  return (
    <FirebaseAuthContext.Provider value={{
      user,
      loading,
      login: noop,
      signup: noop,
      loginWithGoogle: noop,
      logout: noop,
      updateUserProfile: noop,
      isAuthenticated: false
    }}>
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
}`;

// Write the performance optimized files
fs.writeFileSync(
  path.join(__dirname, 'components/performance/navigation-progress.tsx'),
  fastNavigationProgress
);

fs.writeFileSync(
  path.join(__dirname, 'contexts/FirebaseAuthContext.tsx'),
  fastFirebaseAuth
);

console.log('✅ Performance mode enabled!');
console.log('📝 Features temporarily disabled:');
console.log('   - Firebase Authentication (auth features will not work)');
console.log('   - Navigation progress bars');
console.log('   - Database calls on page load');
console.log('');
console.log('🔄 Run "npm run build && npm start" to test the lightning-fast navigation!');
console.log('⚠️  Remember to restore features when done testing with: git checkout .');
