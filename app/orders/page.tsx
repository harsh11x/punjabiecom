'use client'

import { useState, useEffect } from 'react'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import { User } from 'firebase/auth'
import { getApiUrl } from '@/config/environment'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Package, Truck, CheckCircle, Clock, AlertCircle, Search } from 'lucide-react'

interface OrderItem {
  productId: string
  name: string
  punjabiName: string
  price: number
  quantity: number
  size: string
  color: string
  image: string
}

interface Order {
  _id: string
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: 'razorpay' | 'cod' | 'bank_transfer'
  shippingAddress: {
    fullName: string
    addressLine1: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
  deliveredAt?: string
  createdAt: string
  updatedAt: string
}

export default function OrdersPage() {
  const { user: firebaseUser, loading: authLoading } = useFirebaseAuth()
  const user = firebaseUser as User | null
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [searchOrderNumber, setSearchOrderNumber] = useState('')
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null)

  // Fetch user's orders
  const fetchUserOrders = async () => {
    if (!user?.email || authLoading) return

    try {
      setLoading(true)
      const response = await fetch(getApiUrl('/api/user/orders'), {
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`,
          'x-user-email': user.email || ''
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const result = await response.json()
      if (result.success) {
        setOrders(result.data)
        toast.success(`Found ${result.data.length} orders`)
      } else {
        throw new Error(result.error || 'Failed to fetch orders')
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error)
      toast.error(error.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  // Search for specific order
  const searchOrder = async () => {
    if (!searchOrderNumber.trim() || !user?.email || authLoading) {
      toast.error('Please enter an order number and ensure you are logged in')
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${getApiUrl('/api/user/orders')}?orderNumber=${searchOrderNumber.trim()}`, {
        headers: {
          'Authorization': `Bearer ${await user?.getIdToken()}`,
          'x-user-email': user?.email || ''
        }
      })

      if (!response.ok) {
        throw new Error('Failed to search order')
      }

      const result = await response.json()
      if (result.success && result.data.length > 0) {
        setSearchedOrder(result.data[0])
        toast.success('Order found!')
      } else {
        setSearchedOrder(null)
        toast.error('Order not found')
      }
    } catch (error: any) {
      console.error('Error searching order:', error)
      toast.error(error.message || 'Failed to search order')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.email && !authLoading) {
      fetchUserOrders()
    }
  }, [user, authLoading])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5" />
      case 'confirmed': return <Package className="h-5 w-5" />
      case 'processing': return <Package className="h-5 w-5" />
      case 'shipped': return <Truck className="h-5 w-5" />
      case 'delivered': return <CheckCircle className="h-5 w-5" />
      case 'cancelled': return <AlertCircle className="h-5 w-5" />
      default: return <Clock className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-indigo-100 text-indigo-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const getTrackingSteps = (status: string) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', completed: ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].includes(status) },
      { key: 'confirmed', label: 'Order Confirmed', completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(status) },
      { key: 'processing', label: 'Processing', completed: ['processing', 'shipped', 'delivered'].includes(status) },
      { key: 'shipped', label: 'Shipped', completed: ['shipped', 'delivered'].includes(status) },
      { key: 'delivered', label: 'Delivered', completed: ['delivered'].includes(status) }
    ]

    if (status === 'cancelled') {
      return steps.map(step => ({ ...step, completed: false }))
    }

    return steps
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to view your orders.</p>
        </div>
      </div>
    )
  }

  const displayOrders = searchedOrder ? [searchedOrder] : orders

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600">Track your orders and view order history</p>
      </div>

      {/* Order Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter order number (e.g., PH1234567890)"
              value={searchOrderNumber}
              onChange={(e) => setSearchOrderNumber(e.target.value)}
              className="flex-1"
            />
            <Button onClick={searchOrder} disabled={loading || !searchOrderNumber.trim()}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
            {searchedOrder && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchedOrder(null)
                  setSearchOrderNumber('')
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      ) : displayOrders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              {searchedOrder ? 'No order found with that number' : 'No orders found'}
            </p>
            {!searchedOrder && (
              <p className="text-sm text-gray-500 mt-2">
                Start shopping to see your orders here!
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {displayOrders.map((order) => (
            <Card key={order._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order.orderNumber}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </Badge>
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                            ) : (
                              <Package className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-gray-600 text-xs">
                              Qty: {item.quantity} • Size: {item.size} • Color: {item.color}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold mb-3">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>{formatCurrency(order.shippingCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>{formatCurrency(order.tax)}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Total:</span>
                        <span>{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Shipping Details</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Name:</strong> {order.shippingAddress.fullName}</p>
                      <p><strong>Address:</strong> {order.shippingAddress.addressLine1}</p>
                      <p><strong>City:</strong> {order.shippingAddress.city}, {order.shippingAddress.state}</p>
                      <p><strong>PIN:</strong> {order.shippingAddress.pincode}</p>
                      <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
                      <p><strong>Payment:</strong> {order.paymentMethod.toUpperCase()}</p>
                    </div>
                  </div>
                </div>

                {/* Tracking Information */}
                {order.trackingNumber && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-900">Tracking Information</h4>
                    <div className="text-sm text-blue-800">
                      <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
                      {order.estimatedDelivery && (
                        <p><strong>Estimated Delivery:</strong> {formatDate(order.estimatedDelivery)}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Progress */}
                <div>
                  <h4 className="font-semibold mb-3">Order Progress</h4>
                  <div className="space-y-3">
                    {getTrackingSteps(order.status).map((step, index) => (
                      <div key={step.key} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <span className={`text-sm ${step.completed ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-6 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    Download Invoice
                  </Button>
                  <Button variant="outline" size="sm">
                    Contact Support
                  </Button>
                  {order.status === 'delivered' && (
                    <Button variant="outline" size="sm">
                      Rate & Review
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
