'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function NavigationProgress() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const handleStart = () => {
      setLoading(true)
      setProgress(10)
    }

    const handleComplete = () => {
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 200)
    }

    // Simulate loading progress
    let interval: NodeJS.Timeout
    if (loading) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) {
            return prev + Math.random() * 10
          }
          return prev
        })
      }, 100)
    }

    // Cleanup on pathname change
    if (pathname) {
      handleComplete()
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [loading, pathname])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50">
      <div
        className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 transition-all duration-200 ease-out shadow-lg"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute right-0 top-0 h-full w-3 bg-white/30 rounded-r-full animate-pulse" />
      </div>
    </div>
  )
}
