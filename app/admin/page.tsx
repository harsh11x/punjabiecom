'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  LogOut,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Star,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'

interface Product {
  _id: string
  name: string
  punjabiName: string
  price: number
  originalPrice: number
  category: string
  subcategory: string
  stock: number
  isActive: boolean
  createdAt: string
  image?: string
}

interface Order {
  _id: string
  orderNumber: string
  customer: {
    fullName: string
    email: string
    phone?: string
  }
  total: number
  status: string
  createdAt: string
  items: number
}

interface Customer {
  _id: string
  name: string
  email: string
  phone?: string
  totalOrders: number
  totalSpent: number
  joinedAt: string
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
    averageOrderValue: 0,
    conversionRate: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

  // Load demo data immediately on component mount
  useEffect(() => {
    loadDemoData()
    // Show welcome toast
    setTimeout(() => {
      toast.success('Welcome to Punjab Heritage Admin Panel! 🎉')
    }, 500)
  }, [])

  const loadDemoData = () => {
    const demoProducts: Product[] = [
      {
        _id: '1',
        name: 'Traditional Punjabi Jutti',
        punjabiName: 'ਪੰਜਾਬੀ ਜੁੱਤੀ',
        price: 1500,
        originalPrice: 2000,
        category: 'Footwear',
        subcategory: 'Traditional',
        stock: 25,
        isActive: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        image: '/jutti-image.jpg'
      },
      {
        _id: '2',
        name: 'Handmade Phulkari Dupatta',
        punjabiName: 'ਫੁਲਕਾਰੀ ਦੁਪਟਾ',
        price: 2500,
        originalPrice: 3000,
        category: 'Clothing',
        subcategory: 'Traditional',
        stock: 15,
        isActive: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        image: '/phulkari-image.jpg'
      },
      {
        _id: '3',
        name: 'Bridal Gold Jutti',
        punjabiName: 'ਵਿਆਹ ਵਾਲੀ ਸੁਨਹਿਰੀ ਜੁੱਤੀ',
        price: 3500,
        originalPrice: 4000,
        category: 'Footwear',
        subcategory: 'Bridal',
        stock: 8,
        isActive: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        image: '/bridal-jutti.jpg'
      },
      {
        _id: '4',
        name: 'Punjabi Paranda Set',
        punjabiName: 'ਪੰਜਾਬੀ ਪਰਾਂਡਾ ਸੈਟ',
        price: 800,
        originalPrice: 1000,
        category: 'Accessories',
        subcategory: 'Hair',
        stock: 30,
        isActive: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        image: '/paranda.jpg'
      },
      {
        _id: '5',
        name: 'Traditional Kada',
        punjabiName: 'ਪਰੰਪਰਾਗਤ ਕੜਾ',
        price: 2000,
        originalPrice: 2500,
        category: 'Jewelry',
        subcategory: 'Traditional',
        stock: 0,
        isActive: false,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        image: '/kada.jpg'
      }
    ]

    const demoOrders: Order[] = [
      {
        _id: '1',
        orderNumber: 'PH-2024-001',
        customer: {
          fullName: 'Simran Kaur',
          email: 'simran.kaur@example.com',
          phone: '+91-98765-43210'
        },
        total: 4000,
        status: 'completed',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        items: 2
      },
      {
        _id: '2',
        orderNumber: 'PH-2024-002',
        customer: {
          fullName: 'Rajveer Singh',
          email: 'rajveer.singh@example.com',
          phone: '+91-87654-32109'
        },
        total: 1500,
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        items: 1
      },
      {
        _id: '3',
        orderNumber: 'PH-2024-003',
        customer: {
          fullName: 'Harpreet Kaur',
          email: 'harpreet@example.com',
          phone: '+91-76543-21098'
        },
        total: 3500,
        status: 'shipped',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        items: 1
      },
      {
        _id: '4',
        orderNumber: 'PH-2024-004',
        customer: {
          fullName: 'Gurpreet Singh',
          email: 'gurpreet@example.com',
          phone: '+91-65432-10987'
        },
        total: 2500,
        status: 'processing',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        items: 1
      }
    ]

    const demoCustomers: Customer[] = [
      {
        _id: '1',
        name: 'Simran Kaur',
        email: 'simran.kaur@example.com',
        phone: '+91-98765-43210',
        totalOrders: 3,
        totalSpent: 8500,
        joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: '2',
        name: 'Rajveer Singh',
        email: 'rajveer.singh@example.com',
        phone: '+91-87654-32109',
        totalOrders: 2,
        totalSpent: 3000,
        joinedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: '3',
        name: 'Harpreet Kaur',
        email: 'harpreet@example.com',
        phone: '+91-76543-21098',
        totalOrders: 1,
        totalSpent: 3500,
        joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    setProducts(demoProducts)
    setOrders(demoOrders)
    setCustomers(demoCustomers)
    
    // Calculate stats
    const totalRevenue = demoOrders.reduce((sum, order) => sum + order.total, 0)
    const pendingOrders = demoOrders.filter(order => order.status === 'pending').length
    
    setStats({
      totalProducts: demoProducts.length,
      totalOrders: demoOrders.length,
      totalRevenue,
      pendingOrders,
      totalCustomers: demoCustomers.length,
      monthlyRevenue: totalRevenue * 0.8, // Mock monthly revenue
      averageOrderValue: totalRevenue / demoOrders.length,
      conversionRate: 3.2
    })
  }

  const handleDeleteProduct = (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    setProducts(products.filter(p => p._id !== productId))
    toast.success('Product deleted successfully!')
  }

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order._id === orderId ? { ...order, status: newStatus } : order
    ))
    toast.success(`Order status updated to ${newStatus}!`)
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.punjabiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-900 via-red-800 to-amber-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">ਪ</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-amber-100">Admin Panel</h1>
                <p className="text-sm text-amber-200">Punjab Heritage Management</p>
              </div>
            </div>
            
<div className="flex items-center space-x-4">
              <Badge className="bg-green-500 text-white">
                Demo Mode
              </Badge>
              <Button
                onClick={() => toast.info('Logout functionality coming soon!')}
                variant="ghost"
                className="text-amber-100 hover:bg-red-700/50 hover:text-white"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'outline'}
            onClick={() => setActiveTab('dashboard')}
            className={activeTab === 'dashboard' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'products' ? 'default' : 'outline'}
            onClick={() => setActiveTab('products')}
            className={activeTab === 'products' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            <Package className="h-4 w-4 mr-2" />
            Products
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveTab('orders')}
            className={activeTab === 'orders' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Orders
          </Button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-red-900">{stats.totalProducts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-red-900">{stats.totalOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-red-900">₹{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-red-500 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pending Orders</p>
                      <p className="text-2xl font-bold text-red-900">{stats.pendingOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50">
                <CardHeader>
                  <CardTitle className="text-red-900">Recent Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {products.slice(0, 5).map((product) => (
                      <div key={product._id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                        <div>
                          <p className="font-semibold text-red-900">{product.name}</p>
                          <p className="text-sm text-amber-700">₹{product.price}</p>
                        </div>
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50">
                <CardHeader>
                  <CardTitle className="text-red-900">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
                        <div>
                          <p className="font-semibold text-red-900">#{order.orderNumber}</p>
                          <p className="text-sm text-amber-700">{order.customer.fullName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-900">₹{order.total}</p>
                          <Badge variant="outline">{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-red-900">Products Management</h2>
              <Button 
                className="bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-800 hover:to-amber-700"
                onClick={() => {
                  // Add product functionality
                  toast.info('Add product functionality coming soon!')
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            <Card className="border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-200">
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-900">{product.name}</h3>
                        <p className="text-sm text-amber-700">{product.punjabiName}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-600">₹{product.price}</span>
                          <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                          <span className="text-sm text-gray-600">{product.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-red-900">Orders Management</h2>

            <Card className="border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-200">
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-900">#{order.orderNumber}</h3>
                        <p className="text-sm text-amber-700">{order.customer.fullName}</p>
                        <p className="text-sm text-gray-600">{order.customer.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-900">₹{order.total}</p>
                        <Badge variant="outline">{order.status}</Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}