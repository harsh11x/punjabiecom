'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  BarChart3,
  PieChart,
  Calendar,
  RefreshCw,
  IndianRupee
} from 'lucide-react'
import { toast } from 'sonner'

interface RevenueData {
  _id: string
  revenue: number
  orders: number
  averageOrderValue: number
}

interface OrderStatusBreakdown {
  _id: string
  count: number
  revenue: number
}

interface PaymentMethodBreakdown {
  _id: string
  count: number
  revenue: number
}

interface TopProduct {
  _id: string
  totalSold: number
  totalRevenue: number
  averagePrice: number
}

interface AnalyticsData {
  period: string
  days: number
  revenueData: RevenueData[]
  orderStatusBreakdown: OrderStatusBreakdown[]
  paymentMethodBreakdown: PaymentMethodBreakdown[]
  topProducts: TopProduct[]
  summary: {
    totalOrders: number
    totalRevenue: number
    averageOrderValue: number
    paidOrders: number
    pendingOrders: number
  }
  last7Days: RevenueData[]
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [period, setPeriod] = useState('daily')
  const [days, setDays] = useState(30)

  useEffect(() => {
    fetchAnalytics()
  }, [period, days])

  const fetchAnalytics = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true)
      
      const params = new URLSearchParams({
        period,
        days: days.toString()
      })

      const response = await fetch(`/api/admin/analytics/revenue?${params}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
      } else {
        toast.error('Failed to fetch analytics data')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Error fetching analytics data')
    } finally {
      setLoading(false)
      if (showRefreshing) setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchAnalytics(true)
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
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

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'razorpay': return 'bg-blue-100 text-blue-800'
      case 'cod': return 'bg-green-100 text-green-800'
      case 'bank_transfer': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Business insights and revenue analytics</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Business insights and revenue analytics</p>
        </div>
        <div className="flex space-x-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Select value={days.toString()} onValueChange={(value) => setDays(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(data.summary.totalRevenue)}</div>
              <p className="text-xs text-gray-600">
                {data.summary.paidOrders} paid orders
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{data.summary.totalOrders}</div>
              <p className="text-xs text-gray-600">
                {data.summary.pendingOrders} pending
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(data.summary.averageOrderValue)}</div>
              <p className="text-xs text-gray-600">
                Per order
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {data.summary.totalOrders > 0 
                  ? Math.round((data.summary.paidOrders / data.summary.totalOrders) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-gray-600">
                Paid vs total orders
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trend</TabsTrigger>
          <TabsTrigger value="orders">Order Status</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>
                Revenue over the last {days} days ({period} breakdown)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data?.revenueData && data.revenueData.length > 0 ? (
                <div className="space-y-4">
                  {data.revenueData.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{formatDate(item._id)}</p>
                        <p className="text-sm text-gray-600">{item.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(item.revenue)}</p>
                        <p className="text-sm text-gray-600">
                          Avg: {formatCurrency(item.averageOrderValue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No revenue data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Status Breakdown</CardTitle>
              <CardDescription>
                Orders by status for the last {days} days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data?.orderStatusBreakdown && data.orderStatusBreakdown.length > 0 ? (
                <div className="space-y-4">
                  {data.orderStatusBreakdown.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(item._id)}>
                          {item._id.charAt(0).toUpperCase() + item._id.slice(1)}
                        </Badge>
                        <span className="font-medium">{item.count} orders</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(item.revenue)}</p>
                        <p className="text-sm text-gray-600">
                          {item.count > 0 ? Math.round((item.revenue / item.count)) : 0} avg
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No order status data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Breakdown</CardTitle>
              <CardDescription>
                Revenue by payment method for the last {days} days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data?.paymentMethodBreakdown && data.paymentMethodBreakdown.length > 0 ? (
                <div className="space-y-4">
                  {data.paymentMethodBreakdown.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge className={getPaymentMethodColor(item._id)}>
                          {item._id.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <span className="font-medium">{item.count} orders</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(item.revenue)}</p>
                        <p className="text-sm text-gray-600">
                          {item.count > 0 ? Math.round((item.revenue / item.count)) : 0} avg
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No payment method data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Products by Revenue</CardTitle>
              <CardDescription>
                Best performing products for the last {days} days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data?.topProducts && data.topProducts.length > 0 ? (
                <div className="space-y-4">
                  {data.topProducts.map((product, index) => (
                    <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <div>
                          <p className="font-medium">{product._id}</p>
                          <p className="text-sm text-gray-600">
                            {product.totalSold} units sold
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(product.totalRevenue)}</p>
                        <p className="text-sm text-gray-600">
                          Avg: {formatCurrency(product.averagePrice)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No product data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Last 7 Days Quick View */}
      {data?.last7Days && data.last7Days.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Last 7 Days Overview</CardTitle>
            <CardDescription>Daily revenue for the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {data.last7Days.map((day) => (
                <div key={day._id} className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">{formatDate(day._id)}</p>
                  <p className="font-bold text-lg">{formatCurrency(day.revenue)}</p>
                  <p className="text-xs text-gray-500">{day.orders} orders</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
