import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface UseAutoLogoutProps {
  isAdmin?: boolean
  onLogout?: () => void
}

export function useAutoLogout({ isAdmin = false, onLogout }: UseAutoLogoutProps) {
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const activityRef = useRef<number>(Date.now())

  // Set timeout based on user type
  const TIMEOUT = isAdmin ? 5 * 60 * 1000 : 45 * 60 * 1000 // 5 min for admin, 45 min for users

  const resetTimer = () => {
    activityRef.current = Date.now()
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      console.log(`🔄 Auto-logout after ${isAdmin ? '5 minutes' : '45 minutes'} of inactivity`)
      
      // Clear any stored tokens
      if (isAdmin) {
        localStorage.removeItem('adminToken')
      } else {
        localStorage.removeItem('userToken')
      }
      
      // Call custom logout function if provided
      if (onLogout) {
        onLogout()
      }
      
      // Redirect to appropriate page
      if (isAdmin) {
        router.push('/admin/login')
      } else {
        router.push('/login')
      }
    }, TIMEOUT)
  }

  const handleActivity = () => {
    resetTimer()
  }

  useEffect(() => {
    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Initial timer
    resetTimer()

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isAdmin, onLogout, router])

  return {
    resetTimer,
    getTimeRemaining: () => {
      const timeElapsed = Date.now() - activityRef.current
      return Math.max(0, TIMEOUT - timeElapsed)
    }
  }
}
