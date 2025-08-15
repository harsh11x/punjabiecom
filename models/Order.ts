import mongoose from 'mongoose'

export interface IOrderItem {
  productId: string
  name: string
  punjabiName: string
  price: number
  quantity: number
  size: string
  color: string
  image: string
}

export interface IShippingAddress {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  phone: string
}

export interface IOrder extends mongoose.Document {
  orderNumber: string
  userId?: string
  customerEmail: string
  items: IOrderItem[]
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: 'razorpay' | 'cod' | 'bank_transfer'
  paymentId?: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  shippingAddress: IShippingAddress
  billingAddress?: IShippingAddress
  trackingNumber?: string
  estimatedDelivery?: Date
  deliveredAt?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  punjabiName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  size: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
})

const ShippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  addressLine1: {
    type: String,
    required: true,
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  }
})

const OrderSchema = new mongoose.Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    index: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  items: [OrderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCost: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
    index: true
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['razorpay', 'cod', 'bank_transfer'],
    default: 'razorpay'
  },
  paymentId: {
    type: String,
    index: true
  },
  razorpayOrderId: {
    type: String,
    index: true
  },
  razorpayPaymentId: {
    type: String,
    index: true
  },
  razorpaySignature: {
    type: String
  },
  shippingAddress: {
    type: ShippingAddressSchema,
    required: true
  },
  billingAddress: {
    type: ShippingAddressSchema
  },
  trackingNumber: {
    type: String,
    trim: true,
    index: true
  },
  estimatedDelivery: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// Create indexes for better query performance
OrderSchema.index({ createdAt: -1 })
OrderSchema.index({ status: 1, createdAt: -1 })
OrderSchema.index({ paymentStatus: 1, createdAt: -1 })
OrderSchema.index({ customerEmail: 1, createdAt: -1 })

// Generate order number before saving
OrderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments()
    this.orderNumber = `PH${Date.now()}${(count + 1).toString().padStart(4, '0')}`
  }
  next()
})

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)