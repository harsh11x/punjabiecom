'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

interface AuthStatusProps {
  onAuthChange?: (isAuthenticated: boolean) => void
}

export default function AuthStatus({ onAuthChange }: AuthStatusProps) {
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'not-authenticated'>('checking')
  const [adminInfo, setAdminInfo] = useState<any>(null)

  const checkAuth = async () => {
    setAuthStatus('checking')
    try {
      const response = await fetch('/api/admin/auth/verify', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAuthStatus('authenticated')
          setAdminInfo(data.admin)
          onAuthChange?.(true)
        } else {
          setAuthStatus('not-authenticated')
          setAdminInfo(null)
          onAuthChange?.(false)
        }
      } else {
        setAuthStatus('not-authenticated')
        setAdminInfo(null)
        onAuthChange?.(false)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setAuthStatus('not-authenticated')
      setAdminInfo(null)
      onAuthChange?.(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const handleLogin = () => {
    window.location.href = '/admin/login'
  }

  if (authStatus === 'checking') {
    return (
      <Alert className="mb-4">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <AlertDescription>
          Checking authentication status...
        </AlertDescription>
      </Alert>
    )
  }

  if (authStatus === 'not-authenticated') {
    return (
      <Alert className="mb-4 border-red-200 bg-red-50">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span className="text-red-800">
              Not authenticated. Please login to access admin features.
            </span>
            <Button 
              onClick={handleLogin}
              size="sm"
              className="ml-4"
            >
              Login
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription>
        <div className="flex items-center justify-between">
          <span className="text-green-800">
            Authenticated as: {adminInfo?.email} ({adminInfo?.role})
          </span>
          <Button 
            onClick={checkAuth}
            size="sm"
            variant="outline"
            className="ml-4"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
