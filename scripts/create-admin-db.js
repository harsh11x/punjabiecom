const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema)

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@punjabijuttiandfulkari.com' })
    if (existingAdmin) {
      console.log('✅ Admin user already exists!')
      console.log('Email: admin@punjabijuttiandfulkari.com')
      console.log('Password: admin123')
      return
    }

    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 12)
    
    const adminUser = new Admin({
      username: 'admin',
      email: 'admin@punjabijuttiandfulkari.com',
      password: passwordHash,
      role: 'admin',
      isActive: true
    })

    await adminUser.save()
    
    console.log('✅ Admin user created successfully!')
    console.log('Email: admin@punjabijuttiandfulkari.com')
    console.log('Password: admin123')
    console.log('\nYou can now access the admin panel at:')
    console.log('- Local: http://localhost:3000/admin')
    console.log('- Production: https://punjabijuttiandfulkari.com/admin')

  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
  }
}

createAdminUser()
