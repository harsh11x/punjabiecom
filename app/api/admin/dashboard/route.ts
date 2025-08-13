import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import Order from '@/models/Order'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    requireAdmin(request)
    
    await dbConnect()
    
    // Get current date and calculate date ranges
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
    
    // Get total products and stock statistics
    const productStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: { $sum: { $cond: ['$isActive', 1, 0] } },
          inactiveProducts: { $sum: { $cond: ['$isActive', 0, 1] } },
          totalStock: { $sum: '$stock' },
          lowStockProducts: { $sum: { $cond: [{ $lte: ['$stock', 5] }, 1, 0] } },
          outOfStockProducts: { $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] } }
        }
      }
    ])
    
    // Get order statistics
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0] } },
          pendingOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] } },
          processingOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'processing'] }, 1, 0] } },
          shippedOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'shipped'] }, 1, 0] } },
          deliveredOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] } },
          cancelledOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] } }
        }
      }
    ])
    
    // Get user statistics
    const userStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $addToSet: '$customer.email' }
        }
      },
      {
        $project: {
          totalUsers: { $size: '$totalUsers' }
        }
      }
    ])
    
    // Get today's statistics
    const todayStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0] } }
        }
      }
    ])
    
    // Get this week's statistics
    const weekStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: weekAgo }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0] } }
        }
      }
    ])
    
    // Get this month's statistics
    const monthStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: monthAgo }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0] } }
        }
      }
    ])
    
    // Get recent orders with customer info
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber customer totalAmount orderStatus paymentStatus createdAt')
      .lean()
    
    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ])
    
    // Get sales trend for last 7 days
    const salesTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: weekAgo },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])
    
    const stats = {
      products: productStats[0] || {
        totalProducts: 0,
        activeProducts: 0,
        inactiveProducts: 0,
        totalStock: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0
      },
      orders: orderStats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0
      },
      users: {
        totalUsers: userStats[0]?.totalUsers || 0,
        activeUsers: userStats[0]?.totalUsers || 0,
        adminUsers: 1
      },
      today: todayStats[0] || { count: 0, revenue: 0 },
      week: weekStats[0] || { count: 0, revenue: 0 },
      month: monthStats[0] || { count: 0, revenue: 0 },
      recentOrders,
      topProducts,
      salesTrend
    }
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error)
    
    if (error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}