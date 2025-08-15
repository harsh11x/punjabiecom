'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface PageLoaderProps {
  children: React.ReactNode
}

export function PageLoader({ children }: PageLoaderProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Preload critical images
    const criticalImages = [
      '/punjabi-jutti-shoes.png',
      '/colorful-punjabi-jutti.png', 
      '/punjabi-phulkari-dupatta.png'
    ]

    criticalImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })

    // Listen for navigation events
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    // Add navigation loading indicator
    const originalPush = router.push
    router.push = (href: any, options?: any) => {
      setLoading(true)
      const result = originalPush(href, options)
      // Since router.push is void, we'll use a timeout to hide loader
      setTimeout(() => setLoading(false), 500)
      return result
    }

    return () => {
      router.push = originalPush
    }
  }, [router])

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-red-600 z-50">
          <div className="h-full bg-white/30 animate-pulse" />
        </div>
      )}
      {children}
    </>
  )
}
