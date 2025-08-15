'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck
} from 'lucide-react'
import { toast } from 'sonner'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  processingOrders: number
  shippedOrders: number
  codOrders: number
  onlineOrders: number
}

interface Product {
  id: string
  name: string
  punjabiName: string
  price: number
  stock: number
  category: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

interface Order {
  _id: string
  orderNumber: string
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  total: number
  status: string
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  items: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    codOrders: 0,
    onlineOrders: 0
  })
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Load products and orders
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/products', { credentials: 'include' }),
        fetch('/api/admin/orders', { credentials: 'include' })
      ])

      if (productsRes.ok && ordersRes.ok) {
        const productsData = await productsRes.json()
        const ordersData = await ordersRes.json()

        if (productsData.success) {
          // Sort products by creation date and take most recent
          const sortedProducts = productsData.products
            .sort((a: any, b: any) => new Date(b.createdAt || b.updatedAt).getTime() - new Date(a.createdAt || a.updatedAt).getTime())
            .slice(0, 5)
          setRecentProducts(sortedProducts)
        }

        if (ordersData.success) {
          setRecentOrders(ordersData.orders.slice(0, 5))
          setStats({
            totalProducts: productsData.products?.length || 0,
            totalOrders: ordersData.stats?.total || 0,
            totalRevenue: ordersData.stats?.totalRevenue || 0,
            pendingOrders: ordersData.stats?.pending || 0,
            processingOrders: ordersData.stats?.processing || 0,
            shippedOrders: ordersData.stats?.shipped || 0,
            codOrders: ordersData.stats?.codOrders || 0,
            onlineOrders: ordersData.stats?.onlineOrders || 0
          })
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />
      case 'processing': return <BarChart3 className="h-3 w-3" />
      case 'shipped': return <Truck className="h-3 w-3" />
      case 'delivered': return <CheckCircle className="h-3 w-3" />
      case 'cancelled': return <AlertCircle className="h-3 w-3" />
      default: return <Clock className="h-3 w-3" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mb-4 mx-auto"></div>
          <p className="text-red-900 font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-red-900 mb-2">Dashboard</h1>
        <p className="text-amber-700">Welcome to Punjab Heritage Store Management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Products</p>
                  <p className="text-2xl font-bold text-red-900">{stats.totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-red-900">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-red-900">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
                  <p className="text-2xl font-bold text-red-900">{stats.pendingOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-red-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              onClick={() => window.location.href = '/admin/products/new'}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
            <Button 
              variant="outline" 
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
              onClick={() => window.location.href = '/admin/orders'}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              View All Orders
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
              onClick={() => window.location.href = '/admin/products'}
            >
              <Package className="h-4 w-4 mr-2" />
              Manage Products
            </Button>
          </div>
        </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Products */}
          <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-900 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Recent Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentProducts.length > 0 ? (
                  recentProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100">
                      <div className="flex-1">
                        <p className="font-semibold text-red-900">{product.name}</p>
                        <p className="text-sm text-amber-700">{product.punjabiName}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600">₹{product.price}</span>
                          <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No products found</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="border-2 border-amber-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-900 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100">
                      <div className="flex-1">
                        <p className="font-semibold text-red-900">#{order.orderNumber}</p>
                        <p className="text-sm text-amber-700">{order.customerInfo.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600">₹{order.total}</span>
                          <Badge variant="outline" className="text-xs">
                            {order.paymentMethod}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={`text-xs border ${getStatusColor(order.status)}`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No orders found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
