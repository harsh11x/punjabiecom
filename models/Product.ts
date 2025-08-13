import mongoose from 'mongoose'

export interface IProduct extends mongoose.Document {
  name: string
  punjabiName: string
  description: string
  punjabiDescription: string
  price: number
  originalPrice: number
  category: 'men' | 'women' | 'kids' | 'phulkari'
  subcategory?: string
  images: string[]
  colors: string[]
  sizes: string[]
  stock: number
  rating: number
  reviews: number
  badge?: string
  badgeEn?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  punjabiName: {
    type: String,
    required: [true, 'Punjabi name is required'],
    trim: true,
    maxlength: [100, 'Punjabi name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  punjabiDescription: {
    type: String,
    required: [true, 'Punjabi description is required'],
    maxlength: [1000, 'Punjabi description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    required: [true, 'Original price is required'],
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['men', 'women', 'kids', 'phulkari']
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    required: true
  }],
  colors: [{
    type: String,
    required: true
  }],
  sizes: [{
    type: String,
    required: true
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviews: {
    type: Number,
    default: 0,
    min: [0, 'Reviews count cannot be negative']
  },
  badge: {
    type: String,
    trim: true
  },
  badgeEn: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Create indexes for better query performance
ProductSchema.index({ category: 1, isActive: 1 })
ProductSchema.index({ name: 'text', punjabiName: 'text', description: 'text' })
ProductSchema.index({ price: 1 })
ProductSchema.index({ rating: -1 })

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)