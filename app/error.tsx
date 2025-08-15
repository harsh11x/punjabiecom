'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application error:', error)
    }
    
    // In production, you could send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      console.error('Production error occurred:', {
        message: error.message,
        digest: error.digest,
        timestamp: new Date().toISOString()
      })
    }
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-900">
            ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ
          </CardTitle>
          <p className="text-lg text-amber-800 font-medium">
            Something went wrong
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-gray-700">
              ਸਾਨੂੰ ਮਾਫ਼ ਕਰੋ, ਪਰ ਕੁਝ ਅਣਕਿਆਸੀ ਹੋਇਆ ਹੈ।
            </p>
            <p className="text-gray-600 text-sm">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left bg-gray-100 p-3 rounded text-sm">
              <summary className="cursor-pointer font-medium text-red-700 mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="whitespace-pre-wrap text-xs text-gray-700 overflow-auto max-h-32">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={reset}
              className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:from-red-800 hover:via-red-700 hover:to-amber-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ • Try Again
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="border-amber-600 text-red-800 hover:bg-amber-50"
            >
              <Home className="w-4 h-4 mr-2" />
              ਘਰ ਜਾਓ • Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}