import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Admin from '@/models/Admin'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    console.log('Admin setup route called')
    
    const dbConnection = await connectDB()
    if (!dbConnection) {
      return NextResponse.json(
        { success: false, error: 'Database connection not available' },
        { status: 503 }
      )
    }

    console.log('Database connected successfully')

    // Check if any admin users already exist
    const existingAdminCount = await Admin.countDocuments()
    if (existingAdminCount > 0) {
      return NextResponse.json(
        { success: false, error: 'Admin users already exist. This setup can only be run once.' },
        { status: 409 }
      )
    }

    console.log('No existing admins found, creating new admin')

    // Create default admin user
    const adminEmail = 'admin@punjabijuttiandfulkari.com'
    const adminPassword = 'admin123'
    
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    const adminUser = new Admin({
      username: 'admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      isActive: true
    })

    await adminUser.save()
    
    console.log('Admin user created successfully')

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        email: adminEmail,
        password: adminPassword,
        note: 'Please change the password after first login'
      }
    })

  } catch (error: any) {
    console.error('Admin setup error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create admin user: ' + error.message },
      { status: 500 }
    )
  }
}

// This route should only be accessible during initial setup
export async function GET() {
  try {
    const dbConnection = await connectDB()
    if (!dbConnection) {
      return NextResponse.json(
        { success: false, error: 'Database connection not available' },
        { status: 503 }
      )
    }

    const adminCount = await Admin.countDocuments()
    
    return NextResponse.json({
      success: true,
      data: {
        adminExists: adminCount > 0,
        adminCount,
        message: adminCount > 0 
          ? 'Admin users exist. Setup not needed.' 
          : 'No admin users found. POST to this endpoint to create initial admin.'
      }
    })
  } catch (error: any) {
    console.error('Admin setup check error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check admin status: ' + error.message },
      { status: 500 }
    )
  }
}
