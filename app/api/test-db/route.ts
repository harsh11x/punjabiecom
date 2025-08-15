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
          id: sampleProduct._id?.toString(),
          name: sampleProduct.name,
          category: sampleProduct.category,
          isActive: sampleProduct.isActive
        } : null,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}