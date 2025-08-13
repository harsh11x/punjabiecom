'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Package, 
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface Order {
  _id: string
  orderNumber: string
  customer: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
  items: Array<{
    name: string
    punjabiName: string
    price: number
    quantity: number
    size: string
    color: string
    image: string
  }>
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  trackingId?: string
  shippingProvider?: string
  estimatedDelivery?: string
  deliveredAt?: string
  notes?: string
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    fetchOrders()
  }, [pagination.page, statusFilter, searchTerm])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/orders?${params}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.data)
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages
        }))
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, updates: Partial<Order>) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates),
        credentials: 'include'
      })

      if (response.ok) {
        toast.success('Order updated successfully')
        fetchOrders()
        setEditingOrder(null)
      } else {
        toast.error('Failed to update order')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Failed to update order')
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-orange-100 text-orange-800'
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

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'processing': return <AlertCircle className="h-4 w-4" />
      case 'shipped': return <Truck className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600">Manage customer orders and track deliveries</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by order number, customer name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({pagination.total})</CardTitle>
          <CardDescription>
            Showing {orders.length} of {pagination.total} orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-48"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{order.orderNumber}</h3>
                      <p className="text-gray-600">{order.customer.fullName}</p>
                      <p className="text-sm text-gray-500">{order.customer.email} • {order.customer.phone}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getOrderStatusColor(order.orderStatus)}>
                        {getOrderStatusIcon(order.orderStatus)}
                        <span className="ml-1 capitalize">{order.orderStatus}</span>
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        <span className="capitalize">{order.paymentStatus}</span>
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-semibold">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-semibold capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {order.trackingId && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Tracking ID:</strong> {order.trackingId}
                        {order.shippingProvider && ` (${order.shippingProvider})`}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
                          <DialogDescription>
                            Complete order information and customer details
                          </DialogDescription>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Customer Information */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="text-sm text-gray-500">Name</p>
                                  <p className="font-medium">{selectedOrder.customer.fullName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Email</p>
                                  <p className="font-medium">{selectedOrder.customer.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Phone</p>
                                  <p className="font-medium">{selectedOrder.customer.phone}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Address</p>
                                  <p className="font-medium">
                                    {selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                              <div className="space-y-3">
                                {selectedOrder.items.map((item, index) => (
                                  <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                      <h4 className="font-medium">{item.name}</h4>
                                      <p className="text-sm text-gray-600">{item.punjabiName}</p>
                                      <p className="text-sm text-gray-500">
                                        Size: {item.size} • Color: {item.color}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">₹{item.price.toLocaleString()}</p>
                                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Summary */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">Total Amount</span>
                                <span className="text-lg font-bold">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Tracking Information */}
                            {selectedOrder.trackingId && (
                              <div>
                                <h3 className="text-lg font-semibold mb-3">Tracking Information</h3>
                                <div className="p-4 bg-blue-50 rounded-lg">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-500">Tracking ID</p>
                                      <p className="font-medium text-blue-800">{selectedOrder.trackingId}</p>
                                    </div>
                                    {selectedOrder.shippingProvider && (
                                      <div>
                                        <p className="text-sm text-gray-500">Shipping Provider</p>
                                        <p className="font-medium">{selectedOrder.shippingProvider}</p>
                                      </div>
                                    )}
                                    {selectedOrder.estimatedDelivery && (
                                      <div>
                                        <p className="text-sm text-gray-500">Estimated Delivery</p>
                                        <p className="font-medium">{new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}</p>
                                      </div>
                                    )}
                                    {selectedOrder.deliveredAt && (
                                      <div>
                                        <p className="text-sm text-gray-500">Delivered On</p>
                                        <p className="font-medium">{new Date(selectedOrder.deliveredAt).toLocaleDateString()}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Admin Notes */}
                            {selectedOrder.adminNotes && (
                              <div>
                                <h3 className="text-lg font-semibold mb-3">Admin Notes</h3>
                                <div className="p-4 bg-yellow-50 rounded-lg">
                                  <p className="text-sm text-gray-700">{selectedOrder.adminNotes}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingOrder(order)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Update Status
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Order - {editingOrder?.orderNumber}</DialogTitle>
                          <DialogDescription>
                            Update order status and tracking information
                          </DialogDescription>
                        </DialogHeader>
                        {editingOrder && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="orderStatus">Order Status</Label>
                              <Select
                                value={editingOrder.orderStatus}
                                onValueChange={(value) => setEditingOrder({
                                  ...editingOrder,
                                  orderStatus: value
                                })}
                              >
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
                              <Label htmlFor="trackingId">Tracking ID</Label>
                              <Input
                                id="trackingId"
                                value={editingOrder.trackingId || ''}
                                onChange={(e) => setEditingOrder({
                                  ...editingOrder,
                                  trackingId: e.target.value
                                })}
                                placeholder="Enter tracking ID"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Customer will be notified when tracking ID is updated
                              </p>
                            </div>

                            <div>
                              <Label htmlFor="shippingProvider">Shipping Provider</Label>
                              <Select
                                value={editingOrder.shippingProvider || ''}
                                onValueChange={(value) => setEditingOrder({
                                  ...editingOrder,
                                  shippingProvider: value
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select shipping provider" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Blue Dart">Blue Dart</SelectItem>
                                  <SelectItem value="DTDC">DTDC</SelectItem>
                                  <SelectItem value="India Post">India Post</SelectItem>
                                  <SelectItem value="Delhivery">Delhivery</SelectItem>
                                  <SelectItem value="Ecom Express">Ecom Express</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="estimatedDelivery">Estimated Delivery Date</Label>
                              <Input
                                id="estimatedDelivery"
                                type="date"
                                value={editingOrder.estimatedDelivery ? new Date(editingOrder.estimatedDelivery).toISOString().split('T')[0] : ''}
                                onChange={(e) => setEditingOrder({
                                  ...editingOrder,
                                  estimatedDelivery: e.target.value
                                })}
                              />
                            </div>

                            <div>
                              <Label htmlFor="adminNotes">Admin Notes</Label>
                              <Textarea
                                id="adminNotes"
                                value={editingOrder.adminNotes || ''}
                                onChange={(e) => setEditingOrder({
                                  ...editingOrder,
                                  adminNotes: e.target.value
                                })}
                                placeholder="Internal notes about this order"
                                rows={3}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                These notes are only visible to admin
                              </p>
                            </div>

                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => setEditingOrder(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => updateOrderStatus(editingOrder._id, {
                                  orderStatus: editingOrder.orderStatus,
                                  trackingId: editingOrder.trackingId,
                                  shippingProvider: editingOrder.shippingProvider,
                                  estimatedDelivery: editingOrder.estimatedDelivery,
                                  adminNotes: editingOrder.adminNotes
                                })}
                              >
                                Update Order
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders found</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 py-2 text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}