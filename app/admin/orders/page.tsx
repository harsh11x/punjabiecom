'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { getApiUrl } from '@/config/environment'
import { Package } from 'lucide-react'
import { useAutoLogout } from '@/hooks/useAutoLogout'


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

interface ShippingAddress {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  phone: string
}

interface Order {
  _id: string
  orderNumber: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: 'razorpay' | 'cod' | 'bank_transfer'
  shippingAddress: ShippingAddress
  trackingNumber?: string
  estimatedDelivery?: string
  deliveredAt?: string
  cancelledAt?: string
  cancellationReason?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function AdminOrdersPage() {
  const { isAuthenticated, logout } = useAdminAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [updateData, setUpdateData] = useState({
    status: '',
    paymentStatus: '',
    trackingNumber: '',
    estimatedDelivery: '',
    notes: ''
  })

  // Auto-logout after 5 minutes of inactivity
  useAutoLogout({ 
    isAdmin: true, 
    onLogout: logout 
  })

  // Fetch orders from AWS
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'x-user-email': 'admin@punjabi-heritage.com' // Add user email header
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const result = await response.json()
      if (result.success) {
        setOrders(result.data)
        toast.success(`Loaded ${result.data.length} orders`)
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

  // Update order status
  const updateOrder = async () => {
    if (!selectedOrder) return

    console.log('🔄 Updating order:', selectedOrder._id)
    console.log('📝 Update data:', updateData)

    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'x-user-email': 'admin@punjabi-heritage.com'
        },
        body: JSON.stringify({
          orderId: selectedOrder._id,
          updates: updateData
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update order')
      }

      const result = await response.json()
      if (result.success) {
        toast.success('Order updated successfully')
        setIsUpdateDialogOpen(false)
        setSelectedOrder(null)
        setUpdateData({
          status: '',
          paymentStatus: '',
          trackingNumber: '',
          estimatedDelivery: '',
          notes: ''
        })
        fetchOrders() // Refresh orders
      } else {
        throw new Error(result.error || 'Failed to update order')
      }
    } catch (error: any) {
      console.error('Error updating order:', error)
      toast.error(error.message || 'Failed to update order')
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])

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

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access the admin panel.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <Button onClick={fetchOrders} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Orders'}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              When customers place orders, they will appear here for you to manage.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => window.location.href = '/admin/products'} 
                className="bg-red-600 hover:bg-red-700"
              >
                Manage Products
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/admin'}
              >
                Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order.orderNumber}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {order.customerEmail} • {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold mb-2">Customer Details</h4>
                    <p className="text-sm">
                      <strong>Name:</strong> {order.shippingAddress.fullName}<br />
                      <strong>Phone:</strong> {order.shippingAddress.phone}<br />
                      <strong>Address:</strong> {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Order Summary</h4>
                    <p className="text-sm">
                      <strong>Items:</strong> {order.items.length}<br />
                      <strong>Subtotal:</strong> {formatCurrency(order.subtotal)}<br />
                      <strong>Shipping:</strong> {formatCurrency(order.shippingCost)}<br />
                      <strong>Total:</strong> {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                        <span>{item.name} (Qty: {item.quantity})</span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}
                    {order.trackingNumber && (
                      <>
                        <br />
                        <strong>Tracking:</strong> {order.trackingNumber}
                      </>
                    )}
                    {order.estimatedDelivery && (
                      <>
                        <br />
                        <strong>Est. Delivery:</strong> {formatDate(order.estimatedDelivery)}
                      </>
                    )}
                  </div>
                  
                  <Dialog open={isUpdateDialogOpen && selectedOrder?._id === order._id} onOpenChange={(open) => {
                    if (open) {
                      setSelectedOrder(order)
                      setUpdateData({
                        status: order.status,
                        paymentStatus: order.paymentStatus,
                        trackingNumber: order.trackingNumber || '',
                        estimatedDelivery: order.estimatedDelivery || '',
                        notes: order.notes || ''
                      })
                    } else {
                      setIsUpdateDialogOpen(false)
                      setSelectedOrder(null)
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Update Order
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Update Order #{order.orderNumber}</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Status</label>
                          <Select value={updateData.status} onValueChange={(value) => setUpdateData(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Payment Status</label>
                          <Select value={updateData.paymentStatus} onValueChange={(value) => setUpdateData(prev => ({ ...prev, paymentStatus: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                              <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Tracking Number</label>
                          <Input
                            value={updateData.trackingNumber}
                            onChange={(e) => setUpdateData(prev => ({ ...prev, trackingNumber: e.target.value }))}
                            placeholder="Enter tracking number"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Estimated Delivery</label>
                          <Input
                            type="date"
                            value={updateData.estimatedDelivery}
                            onChange={(e) => setUpdateData(prev => ({ ...prev, estimatedDelivery: e.target.value }))}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Notes</label>
                          <Textarea
                            value={updateData.notes}
                            onChange={(e) => setUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Add order notes"
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button onClick={updateOrder} className="flex-1">
                            Update Order
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsUpdateDialogOpen(false)
                              setSelectedOrder(null)
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
