'use client'

import { useEffect, useState } from 'react'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'

interface NonBlockingAuthProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function NonBlockingAuth({ children, fallback }: NonBlockingAuthProps) {
  const { loading } = useFirebaseAuth()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Show content immediately, don't wait for auth
    setShowContent(true)
  }, [])

  // Always show content - don't block on auth loading
  return <>{children}</>
}
