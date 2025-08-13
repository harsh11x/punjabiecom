import mongoose from 'mongoose'

export interface ICartItem {
  productId: mongoose.Types.ObjectId
  name: string
  punjabiName: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
  stock: number
}

export interface ICart extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  items: ICartItem[]
  total: number
  itemCount: number
  updatedAt: Date
}

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  punjabiName: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 99
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  }
})

const CartSchema = new mongoose.Schema<ICart>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [CartItemSchema],
  total: {
    type: Number,
    default: 0,
    min: 0
  },
  itemCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
})

// Calculate totals before saving
CartSchema.pre('save', function(next) {
  this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0)
  this.updatedAt = new Date()
  next()
})

// Create indexes
CartSchema.index({ userId: 1 })
CartSchema.index({ updatedAt: -1 })

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema)
