'use client'

import React, { useState, useEffect } from 'react'
import { CartProvider } from '@/contexts/CartContext'
import { SimpleAuthProvider } from '@/components/providers/SimpleAuthProvider'
import ErrorBoundary from '@/components/error-boundary'

interface SafeProvidersProps {
  children: React.ReactNode
}

export function SafeProviders({ children }: SafeProvidersProps) {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setMounted(true)
    } catch (err) {
      console.error('Error mounting providers:', err)
      setError('Failed to initialize application')
    }
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-900 mb-4">ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ</h1>
          <p className="text-amber-800 mb-4">Something went wrong</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-red-900 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <SimpleAuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </SimpleAuthProvider>
    </ErrorBoundary>
  )
}