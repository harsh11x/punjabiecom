import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB()
    
    // Get product count
    const productCount = await Product.countDocuments()
    const activeProductCount = await Product.countDocuments({ isActive: true })
    
    // Get a sample product
    const sampleProduct = await Product.findOne().lean()
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        totalProducts: productCount,
        activeProducts: activeProductCount,
        sampleProduct: sampleProduct ? {
          id: (sampleProduct as any)._id?.toString() || (sampleProduct as any).id?.toString() || '',
          name: (sampleProduct as any).name || '',
          category: (sampleProduct as any).category || '',
          isActive: (sampleProduct as any).isActive !== false
        } : null,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Database connection failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}