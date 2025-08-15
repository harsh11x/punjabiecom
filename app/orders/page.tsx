'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Eye, 
  IndianRupee,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'

interface Order {
  _id: string
  orderNumber: string
  items: any[]
  total: number
  status: string
  paymentStatus: string
  paymentMethod: string
  createdAt: string
  estimatedDelivery?: string
  trackingNumber?: string
  shippingAddress: any
  tracking?: any
}

export default function OrdersPage() {
  const { user, isAuthenticated, loading: authLoading } = useFirebaseAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [returnReason, setReturnReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders')
      return
    }

    if (isAuthenticated && user) {
      fetchOrders()
    }
  }, [authLoading, isAuthenticated, user, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?email=${user?.email}`, {
        headers: {
          'x-user-email': user?.email || ''
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const result = await response.json()
      setOrders(result.data || [])
    } catch (error: any) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'x-user-email': user?.email || ''
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch order details')
      }

      const result = await response.json()
      return result.data
    } catch (error: any) {
      console.error('Error fetching order details:', error)
      toast.error('Failed to load order details')
      return null
    }
  }

  const handleTrackOrder = async (order: Order) => {
    const orderDetails = await fetchOrderDetails(order._id)
    if (orderDetails) {
      setSelectedOrder(orderDetails)
      setShowTrackingModal(true)
    }
  }

  const handleCancelOrder = async () => {
    if (!selectedOrder || !cancelReason.trim()) {
      toast.error('Please provide a cancellation reason')
      return
    }

    setActionLoading(true)
    try {
      const response = await fetch(`/api/orders/${selectedOrder._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user?.email || ''
        },
        body: JSON.stringify({
          action: 'cancel',
          reason: cancelReason
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to cancel order')
      }

      toast.success('Order cancelled successfully')
      setShowCancelModal(false)
      setCancelReason('')
      fetchOrders() // Refresh orders
    } catch (error: any) {
      console.error('Error cancelling order:', error)
      toast.error(error.message || 'Failed to cancel order')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReturnRequest = async () => {
    if (!selectedOrder || !returnReason.trim()) {
      toast.error('Please provide a return reason')
      return
    }

    setActionLoading(true)
    try {
      const response = await fetch(`/api/orders/${selectedOrder._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user?.email || ''
        },
        body: JSON.stringify({
          action: 'return_request',
          reason: returnReason
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit return request')
      }

      toast.success('Return request submitted successfully')
      setShowReturnModal(false)
      setReturnReason('')
      fetchOrders() // Refresh orders
    } catch (error: any) {
      console.error('Error submitting return request:', error)
      toast.error(error.message || 'Failed to submit return request')
    } finally {
      setActionLoading(false)
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
      case 'return_requested': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refund_pending': return 'bg-orange-100 text-orange-800'
      case 'refunded': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/" className="text-red-600 hover:text-red-700">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
              <Link href="/products">
                <Button className="bg-red-600 hover:bg-red-700">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          {order.total.toLocaleString()}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Image
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-600">
                        +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTrackOrder(order)}
                      className="flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Track Order</span>
                    </Button>

                    {['pending', 'confirmed'].includes(order.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowCancelModal(true)
                        }}
                        className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Cancel Order</span>
                      </Button>
                    )}

                    {order.status === 'delivered' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowReturnModal(true)
                        }}
                        className="flex items-center space-x-2 text-orange-600 border-orange-200 hover:bg-orange-50"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Return</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Order Tracking Modal */}
        <Dialog open={showTrackingModal} onOpenChange={setShowTrackingModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Tracking</DialogTitle>
              <DialogDescription>
                Track your order #{selectedOrder?.orderNumber}
              </DialogDescription>
            </DialogHeader>

            {selectedOrder?.tracking && (
              <div className="space-y-6">
                {/* Current Status */}
                <div className="bg-gradient-to-r from-red-50 to-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Current Status</h3>
                  <Badge className={getStatusColor(selectedOrder.tracking.currentStatus)}>
                    {selectedOrder.tracking.currentStatus.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {selectedOrder.tracking.estimatedDelivery && (
                    <p className="text-sm text-gray-600 mt-2">
                      Estimated Delivery: {new Date(selectedOrder.tracking.estimatedDelivery).toLocaleDateString()}
                    </p>
                  )}
                  {selectedOrder.tracking.trackingNumber && (
                    <p className="text-sm text-gray-600">
                      Tracking Number: {selectedOrder.tracking.trackingNumber}
                    </p>
                  )}
                </div>

                {/* Tracking Steps */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Order Progress</h3>
                  <div className="space-y-4">
                    {selectedOrder.tracking.steps.map((step: any, index: number) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          step.completed 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {step.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                            {step.status}
                          </h4>
                          <p className={`text-sm ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                            {step.description}
                          </p>
                          {step.timestamp && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(step.timestamp).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Shipping Address
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p>{selectedOrder.shippingAddress.fullName}</p>
                    <p>{selectedOrder.shippingAddress.addressLine1}</p>
                    {selectedOrder.shippingAddress.addressLine2 && (
                      <p>{selectedOrder.shippingAddress.addressLine2}</p>
                    )}
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}</p>
                    <p className="flex items-center mt-1">
                      <Phone className="h-3 w-3 mr-1" />
                      {selectedOrder.shippingAddress.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Cancel Order Modal */}
        <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel order #{selectedOrder?.orderNumber}?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="cancelReason">Reason for cancellation</Label>
                <Textarea
                  id="cancelReason"
                  placeholder="Please tell us why you're cancelling this order..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelModal(false)}
                  disabled={actionLoading}
                >
                  Keep Order
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelOrder}
                  disabled={actionLoading || !cancelReason.trim()}
                >
                  {actionLoading ? 'Cancelling...' : 'Cancel Order'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Return Request Modal */}
        <Dialog open={showReturnModal} onOpenChange={setShowReturnModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Return Request</DialogTitle>
              <DialogDescription>
                Request a return for order #{selectedOrder?.orderNumber}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Returns are accepted within 30 days of delivery. Items must be in original condition.
                </p>
              </div>

              <div>
                <Label htmlFor="returnReason">Reason for return</Label>
                <Textarea
                  id="returnReason"
                  placeholder="Please tell us why you want to return this order..."
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowReturnModal(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReturnRequest}
                  disabled={actionLoading || !returnReason.trim()}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {actionLoading ? 'Submitting...' : 'Submit Return Request'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
