'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'
import { Trash2, RefreshCw, Eye } from 'lucide-react'

export function CartDebugger() {
  const { state, clearCart } = useCart()
  const [localStorageData, setLocalStorageData] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const checkLocalStorage = () => {
    const data = localStorage.getItem('punjabi-heritage-cart')
    setLocalStorageData(data)
  }

  const clearLocalStorage = () => {
    localStorage.removeItem('punjabi-heritage-cart')
    setLocalStorageData(null)
    // Reload the page to reset state
    window.location.reload()
  }

  const clearCompleteCart = () => {
    clearCart()
    clearLocalStorage()
  }

  useEffect(() => {
    checkLocalStorage()
  }, [])

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-red-100 hover:bg-red-200 text-red-800 border-red-300"
      >
        <Eye className="h-4 w-4 mr-2" />
        Debug Cart
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 bg-white shadow-lg border-red-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-red-800">Cart Debugger</CardTitle>
        <CardDescription>Debug and manage cart state</CardDescription>
        <Button
          onClick={() => setIsVisible(false)}
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0"
        >
          ✕
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Current Cart State:</h4>
          <div className="space-y-1 text-sm">
            <div>Items: <Badge variant="outline">{state.items.length}</Badge></div>
            <div>Item Count: <Badge variant="outline">{state.itemCount}</Badge></div>
            <div>Total: <Badge variant="outline">₹{state.total.toLocaleString()}</Badge></div>
            <div>Loading: <Badge variant={state.loading ? "destructive" : "secondary"}>{state.loading ? "Yes" : "No"}</Badge></div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">LocalStorage Data:</h4>
          <div className="text-sm bg-gray-50 p-2 rounded max-h-20 overflow-auto">
            {localStorageData ? (
              <pre className="whitespace-pre-wrap text-xs">
                {JSON.stringify(JSON.parse(localStorageData), null, 2)}
              </pre>
            ) : (
              <span className="text-gray-500">No data found</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={checkLocalStorage}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh LocalStorage
          </Button>
          <Button
            onClick={clearLocalStorage}
            variant="destructive"
            size="sm"
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear LocalStorage & Reload
          </Button>
          <Button
            onClick={clearCompleteCart}
            variant="destructive"
            size="sm"
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Complete Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
