import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import { requireAdmin } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'daily' // daily, weekly, monthly
    const days = parseInt(searchParams.get('days') || '30')
    
    const now = new Date()
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    
    let groupBy: any
    let dateFormat: string
    
    switch (period) {
      case 'daily':
        groupBy = {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        }
        dateFormat = '%Y-%m-%d'
        break
      case 'weekly':
        groupBy = {
          $dateToString: { format: '%Y-W%U', date: '$createdAt' }
        }
        dateFormat = '%Y-W%U'
        break
      case 'monthly':
        groupBy = {
          $dateToString: { format: '%Y-%m', date: '$createdAt' }
        }
        dateFormat = '%Y-%m'
        break
      default:
        groupBy = {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        }
        dateFormat = '%Y-%m-%d'
    }
    
    // Get revenue data
    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ])
    
    // Get order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0] } }
        }
      }
    ])
    
    // Get payment method breakdown
    const paymentMethodBreakdown = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      }
    ])
    
    // Get top products by revenue
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid'
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          averagePrice: { $avg: '$items.price' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ])
    
    // Calculate summary statistics
    const summary = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0] } },
          averageOrderValue: { $avg: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0] } },
          paidOrders: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0] } },
          pendingOrders: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] } }
        }
      }
    ])
    
    // Get daily revenue for the last 7 days
    const last7Days = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
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
    
    return NextResponse.json({
      success: true,
      data: {
        period,
        days,
        revenueData,
        orderStatusBreakdown,
        paymentMethodBreakdown,
        topProducts,
        summary: summary[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          paidOrders: 0,
          pendingOrders: 0
        },
        last7Days
      }
    })
  } catch (error: any) {
    console.error('Error fetching revenue analytics:', error)
    
    if (error.message === 'Admin access required' || error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch revenue analytics' },
      { status: 500 }
    )
  }
}
