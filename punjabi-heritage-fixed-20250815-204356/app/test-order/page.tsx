'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Package, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function TestOrderPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [lastOrder, setLastOrder] = useState<any>(null)

  const createTestOrder = async () => {
    setIsCreating(true)
    try {
      const response = await fetch('/api/test-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (data.success) {
        setLastOrder(data.order)
        toast.success('Test order created successfully!')
      } else {
        toast.error(data.error || 'Failed to create test order')
      }
    } catch (error) {
      console.error('Error creating test order:', error)
      toast.error('Failed to create test order')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-900 mb-4">Order System Test</h1>
          <p className="text-amber-700">
            Test the real-time order creation system. This will create a sample order and update your inventory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Order Creation */}
          <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-red-900">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Create Test Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-900 mb-2">Test Order Details:</h3>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• Customer: Test Customer</li>
                    <li>• Product: Bridal Gold Jutti</li>
                    <li>• Quantity: 1</li>
                    <li>• Price: ₹3,299</li>
                    <li>• Payment: Cash on Delivery</li>
                  </ul>
                </div>
                <Button
                  onClick={createTestOrder}
                  disabled={isCreating}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <Package className="h-4 w-4 mr-2" />
                      Create Test Order
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Last Created Order */}
          <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-red-900">
                <CheckCircle className="h-5 w-5 mr-2" />
                Last Created Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lastOrder ? (
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-green-900">Order Number:</span>
                      <span className="text-green-800">{lastOrder.orderNumber}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-green-900">Customer:</span>
                      <span className="text-green-800">{lastOrder.customerInfo.name}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-green-900">Total:</span>
                      <span className="text-green-800">₹{lastOrder.total.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-green-900">Status:</span>
                      <span className="text-green-800 capitalize">{lastOrder.status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-green-900">Payment:</span>
                      <span className="text-green-800">{lastOrder.paymentMethod}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    ✅ Order created successfully and added to your orders list!
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No test orders created yet</p>
                  <p className="text-sm">Create a test order to see it here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">📋 What this test does:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>1. Creates a real order in your orders.json file</li>
            <li>2. Reduces inventory stock in products.json file</li>
            <li>3. Generates a unique order number and ID</li>
            <li>4. Updates admin dashboard statistics</li>
            <li>5. Shows in admin orders management page</li>
          </ul>
        </div>

        <div className="mt-4 text-center">
          <p className="text-amber-700 text-sm">
            After creating a test order, check your admin dashboard and orders page to see the live data!
          </p>
        </div>
      </div>
    </div>
  )
}
