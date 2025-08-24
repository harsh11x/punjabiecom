'use client'

import { useEffect, useState } from 'react'

interface AutoSyncProps {
  interval?: number // Sync interval in milliseconds (default: 30 seconds)
  enabled?: boolean // Enable/disable auto sync (default: true)
  showStatus?: boolean // Show sync status indicator (default: false)
}

interface SyncStatus {
  lastSync: Date | null
  isLoading: boolean
  error: string | null
  successCount: number
  errorCount: number
}

export default function AutoSync({ 
  interval = 30000, // 30 seconds
  enabled = false, // DISABLED - Using local products only
  showStatus = false 
}: AutoSyncProps) {
  const [status, setStatus] = useState<SyncStatus>({
    lastSync: null,
    isLoading: false,
    error: null,
    successCount: 0,
    errorCount: 0
  })

  const syncFromAWS = async () => {
    if (!enabled) return

    setStatus(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      console.log('🔄 Auto-syncing from AWS server...')
      
      const response = await fetch('/api/sync-from-aws', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Auto-sync successful:', result)
        
        setStatus(prev => ({
          ...prev,
          lastSync: new Date(),
          isLoading: false,
          error: null,
          successCount: prev.successCount + 1
        }))

        // Trigger page refresh if products were updated
        if (result.count > 0) {
          console.log(`🔄 ${result.count} products updated, refreshing page...`)
          // Use router refresh or window reload based on your setup
          if (typeof window !== 'undefined') {
            window.location.reload()
          }
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
    } catch (error: any) {
      console.error('❌ Auto-sync failed:', error.message)
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
        errorCount: prev.errorCount + 1
      }))
    }
  }

  useEffect(() => {
    if (!enabled) return

    // Initial sync after 5 seconds
    const initialTimer = setTimeout(() => {
      syncFromAWS()
    }, 5000)

    // Regular sync interval
    const syncTimer = setInterval(() => {
      syncFromAWS()
    }, interval)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(syncTimer)
    }
  }, [enabled, interval])

  // Manual sync function (can be called from parent components)
  const manualSync = () => {
    syncFromAWS()
  }

  // Expose manual sync to window for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).manualSync = manualSync
    }
  }, [])

  if (!showStatus) {
    return null // Hidden component
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Auto Sync
          </span>
          <div className={`w-2 h-2 rounded-full ${
            status.isLoading 
              ? 'bg-yellow-500 animate-pulse' 
              : status.error 
                ? 'bg-red-500' 
                : 'bg-green-500'
          }`} />
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          {status.lastSync && (
            <div>Last: {status.lastSync.toLocaleTimeString()}</div>
          )}
          <div>✅ {status.successCount} | ❌ {status.errorCount}</div>
          {status.error && (
            <div className="text-red-500 truncate" title={status.error}>
              Error: {status.error}
            </div>
          )}
        </div>

        <button
          onClick={manualSync}
          disabled={status.isLoading}
          className="mt-2 w-full text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-2 py-1 rounded"
        >
          {status.isLoading ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>
    </div>
  )
}
