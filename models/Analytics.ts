import mongoose from 'mongoose'

export interface IDailyStats {
  date: Date
  revenue: number
  orders: number
  customers: number
  products: number
  avgOrderValue: number
  topProducts: Array<{
    productId: string
    name: string
    quantity: number
    revenue: number
  }>
  topCategories: Array<{
    category: string
    orders: number
    revenue: number
  }>
}

export interface IAnalytics extends mongoose.Document {
  date: Date
  revenue: number
  orders: number
  customers: number
  newCustomers: number
  returningCustomers: number
  products: number
  avgOrderValue: number
  conversionRate: number
  topProducts: Array<{
    productId: string
    name: string
    category: string
    quantity: number
    revenue: number
  }>
  topCategories: Array<{
    category: string
    orders: number
    revenue: number
    percentage: number
  }>
  paymentMethods: {
    razorpay: { count: number; revenue: number }
    cod: { count: number; revenue: number }
    bank_transfer: { count: number; revenue: number }
  }
  orderStatuses: {
    pending: number
    confirmed: number
    processing: number
    shipped: number
    delivered: number
    cancelled: number
    refunded: number
  }
  hourlyStats: Array<{
    hour: number
    orders: number
    revenue: number
  }>
  createdAt: Date
  updatedAt: Date
}

const AnalyticsSchema = new mongoose.Schema<IAnalytics>({
  date: {
    type: Date,
    required: true,
    unique: true,
    index: true
  },
  revenue: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  orders: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  customers: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  newCustomers: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  returningCustomers: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  products: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  avgOrderValue: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  conversionRate: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 100
  },
  topProducts: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    revenue: { type: Number, required: true, min: 0 }
  }],
  topCategories: [{
    category: { type: String, required: true },
    orders: { type: Number, required: true, min: 0 },
    revenue: { type: Number, required: true, min: 0 },
    percentage: { type: Number, required: true, min: 0, max: 100 }
  }],
  paymentMethods: {
    razorpay: {
      count: { type: Number, default: 0, min: 0 },
      revenue: { type: Number, default: 0, min: 0 }
    },
    cod: {
      count: { type: Number, default: 0, min: 0 },
      revenue: { type: Number, default: 0, min: 0 }
    },
    bank_transfer: {
      count: { type: Number, default: 0, min: 0 },
      revenue: { type: Number, default: 0, min: 0 }
    }
  },
  orderStatuses: {
    pending: { type: Number, default: 0, min: 0 },
    confirmed: { type: Number, default: 0, min: 0 },
    processing: { type: Number, default: 0, min: 0 },
    shipped: { type: Number, default: 0, min: 0 },
    delivered: { type: Number, default: 0, min: 0 },
    cancelled: { type: Number, default: 0, min: 0 },
    refunded: { type: Number, default: 0, min: 0 }
  },
  hourlyStats: [{
    hour: { type: Number, required: true, min: 0, max: 23 },
    orders: { type: Number, required: true, min: 0 },
    revenue: { type: Number, required: true, min: 0 }
  }]
}, {
  timestamps: true
})

// Create indexes for better query performance
AnalyticsSchema.index({ date: -1 })
AnalyticsSchema.index({ revenue: -1 })
AnalyticsSchema.index({ orders: -1 })

export default mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema)