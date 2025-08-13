import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'
import { requireAdmin } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    await connectDB()

    // Get customers with order statistics
    const customers = await User.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'customer.email',
          as: 'orders'
        }
      },
      {
        $addFields: {
          orderCount: { $size: '$orders' },
          totalSpent: {
            $sum: {
              $map: {
                input: '$orders',
                as: 'order',
                in: {
                  $cond: [
                    { $eq: ['$$order.paymentStatus', 'paid'] },
                    '$$order.totalAmount',
                    0
                  ]
                }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
          gender: 1,
          address: 1,
          isVerified: 1,
          createdAt: 1,
          orderCount: 1,
          totalSpent: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ])

    return NextResponse.json({
      success: true,
      data: customers
    })
  } catch (error: any) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}
