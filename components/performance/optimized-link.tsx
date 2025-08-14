'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'

interface OptimizedLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  prefetch?: boolean
}

export function OptimizedLink({ 
  href, 
  children, 
  className, 
  onClick, 
  prefetch = true 
}: OptimizedLinkProps) {
  const router = useRouter()
  const linkRef = useRef<HTMLAnchorElement>(null)

  // Prefetch on hover for instant navigation
  const handleMouseEnter = useCallback(() => {
    if (prefetch) {
      router.prefetch(href)
    }
  }, [router, href, prefetch])

  // Preload critical resources for the target page
  useEffect(() => {
    if (prefetch && linkRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              router.prefetch(href)
            }
          })
        },
        { threshold: 0.1 }
      )

      observer.observe(linkRef.current)

      return () => observer.disconnect()
    }
  }, [href, prefetch, router])

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick()
    }
  }, [onClick])

  return (
    <Link
      ref={linkRef}
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      prefetch={false} // We handle prefetching manually
    >
      {children}
    </Link>
  )
}
