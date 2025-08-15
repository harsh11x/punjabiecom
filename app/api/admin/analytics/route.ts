import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'
import Analytics from '@/models/Analytics'
import { verifyAdminAuth } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    const type = searchParams.get('type') || 'overview'

    const periodDays = parseInt(period)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - periodDays)

    if (type === 'overview') {
      // Get overview statistics
      const [
        totalOrders,
        totalRevenue,
        totalProducts,
        recentOrders,
        ordersByStatus,
        revenueByPeriod,
        topProducts,
        topCategories
      ] = await Promise.all([
        // Total orders
        Order.countDocuments({ createdAt: { $gte: startDate } }),
        
        // Total revenue
        Order.aggregate([
          { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: '$total' } } }
        ]),
        
        // Total products
        Product.countDocuments({ isActive: true }),
        
        // Recent orders
        Order.find({ createdAt: { $gte: startDate } })
          .sort({ createdAt: -1 })
          .limit(10)
          .select('orderNumber customerEmail total status createdAt')
          .lean(),
        
        // Orders by status
        Order.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        
        // Revenue by day
        Order.aggregate([
          { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              revenue: { $sum: '$total' },
              orders: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]),
        
        // Top products
        Order.aggregate([
          { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } },
          { $unwind: '$items' },
          {
            $group: {
              _id: '$items.productId',
              name: { $first: '$items.name' },
              quantity: { $sum: '$items.quantity' },
              revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
            }
          },
          { $sort: { quantity: -1 } },
          { $limit: 10 }
        ]),
        
        // Top categories
        Order.aggregate([
          { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } },
          { $unwind: '$items' },
          {
            $lookup: {
              from: 'products',
              localField: 'items.productId',
              foreignField: '_id',
              as: 'product'
            }
          },
          { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
          {
            $group: {
              _id: '$product.category',
              orders: { $sum: 1 },
              revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
            }
          },
          { $sort: { revenue: -1 } },
          { $limit: 5 }
        ])
      ])

      const revenue = totalRevenue[0]?.total || 0
      const avgOrderValue = totalOrders > 0 ? revenue / totalOrders : 0

      // Calculate growth rates (compare with previous period)
      const previousStartDate = new Date(startDate)
      previousStartDate.setDate(previousStartDate.getDate() - periodDays)

      const [previousOrders, previousRevenue] = await Promise.all([
        Order.countDocuments({ 
          createdAt: { $gte: previousStartDate, $lt: startDate } 
        }),
        Order.aggregate([
          { 
            $match: { 
              createdAt: { $gte: previousStartDate, $lt: startDate }, 
              paymentStatus: 'paid' 
            } 
          },
          { $group: { _id: null, total: { $sum: '$total' } } }
        ])
      ])

      const prevRevenue = previousRevenue[0]?.total || 0
      const orderGrowth = previousOrders > 0 ? ((totalOrders - previousOrders) / previousOrders) * 100 : 0
      const revenueGrowth = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0

      return NextResponse.json({
        success: true,
        data: {
          overview: {
            totalOrders,
            totalRevenue: revenue,
            totalProducts,
            avgOrderValue,
            orderGrowth: Math.round(orderGrowth * 100) / 100,
            revenueGrowth: Math.round(revenueGrowth * 100) / 100
          },
          recentOrders: recentOrders.map((order: any) => ({
            _id: order._id?.toString(),
            orderNumber: order.orderNumber,
            customerEmail: order.customerEmail,
            total: order.total,
            status: order.status,
            createdAt: order.createdAt
          })),
          ordersByStatus: ordersByStatus.reduce((acc: any, item: any) => {
            acc[item._id] = item.count
            return acc
          }, {}),
          revenueByPeriod: revenueByPeriod.map((item: any) => ({
            date: item._id,
            revenue: item.revenue,
            orders: item.orders
          })),
          topProducts: topProducts.map((item: any) => ({
            productId: item._id,
            name: item.name,
            quantity: item.quantity,
            revenue: item.revenue
          })),
          topCategories: topCategories.map((item: any) => ({
            category: item._id || 'Unknown',
            orders: item.orders,
            revenue: item.revenue
          }))
        }
      })
    }

    // Handle other analytics types (daily, monthly, yearly)
    if (type === 'daily') {
      const dailyStats = await Analytics.find({
        date: { $gte: startDate }
      }).sort({ date: -1 }).lean()

      return NextResponse.json({
        success: true,
        data: dailyStats.map((stat: any) => ({
          date: stat.date,
          revenue: stat.revenue,
          orders: stat.orders,
          customers: stat.customers,
          avgOrderValue: stat.avgOrderValue
        }))
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid analytics type'
    }, { status: 400 })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}