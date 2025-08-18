'use client'

import { useState, useEffect } from 'react'
import { useFirebaseAuth } from '@/components/providers/FirebaseAuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/header'
import { 
  ShoppingBag, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'

interface Order {
  _id: string
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod: string
  total: number
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
    size: string
    color: string
    image: string
  }>
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
  trackingStatus: string
  trackingColor: string
}

export default function OrdersPage() {
  const { user, isAuthenticated, loading: authLoading } = useFirebaseAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
      return
    }

    if (isAuthenticated && user) {
      loadUserOrders()
    }
  }, [isAuthenticated, authLoading, router, user])

  const loadUserOrders = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const token = await user.getIdToken()
      const response = await fetch('/api/user/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setOrders(data.orders)
        } else {
          console.error('Failed to load orders:', data.error)
        }
      } else {
        console.error('Failed to load orders:', response.statusText)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'processing':
        return <Package className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-amber-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-amber-100 mb-2">ਮੇਰੇ ਆਰਡਰ • My Orders</h1>
            <p className="text-amber-200">Track your orders and view order history</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
              <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
              <Link href="/products">
                <Button size="lg">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order._id} className="border-2 border-amber-100 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-red-900">Order #{order.orderNumber}</CardTitle>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <Badge className={order.trackingColor}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span>{order.trackingStatus}</span>
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">No Image</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-500">
                                Size: {item.size} | Color: {item.color}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Information */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2 text-gray-900">Shipping Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="flex items-center mb-1 text-gray-600">
                              <MapPin className="h-3 w-3 mr-2" />
                              {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                            </p>
                            <p className="flex items-center mb-1 text-gray-600">
                              <Phone className="h-3 w-3 mr-2" />
                              {order.shippingAddress.phone}
                            </p>
                          </div>
                          <div>
                            <p className="flex items-center mb-1 text-gray-600">
                              <Mail className="h-3 w-3 mr-2" />
                              {order.shippingAddress.fullName}
                            </p>
                            {order.trackingNumber && (
                              <p className="flex items-center text-gray-600">
                                <Truck className="h-3 w-3 mr-2" />
                                Tracking: {order.trackingNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Total */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total</span>
                          <span className="font-semibold text-lg text-red-900">
                            ₹{order.total.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                          <span>Payment Method: {order.paymentMethod.toUpperCase()}</span>
                          <span>Status: {order.paymentStatus}</span>
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {order.status === 'delivered' && (
                          <Button variant="outline" size="sm">
                            Reorder
                          </Button>
                        )}
                        {(order.status === 'pending' || order.status === 'processing') && (
                          <Button variant="outline" size="sm">
                            Cancel Order
                          </Button>
                        )}
                        {order.trackingNumber && (
                          <Button variant="outline" size="sm">
                            Track Package
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
