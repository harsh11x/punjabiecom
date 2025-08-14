import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IAdmin extends mongoose.Document {
  username: string
  email: string
  password: string
  role: 'super_admin' | 'admin' | 'manager'
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const AdminSchema = new mongoose.Schema<IAdmin>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    required: true,
    enum: ['super_admin', 'admin', 'manager'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
})

// Hash password before saving
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Compare password method
AdminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Remove password from JSON output
AdminSchema.methods.toJSON = function() {
  const adminObject = this.toObject()
  delete adminObject.password
  return adminObject
}

// Create indexes (email and username already have unique: true, so skip them)
AdminSchema.index({ isActive: 1 })

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema)