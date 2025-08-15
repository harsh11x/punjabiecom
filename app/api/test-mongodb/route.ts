import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import mongoose from 'mongoose'

export async function GET(request: NextRequest) {
  try {
    // Check if MongoDB URI is configured
    const mongoUri = process.env.MONGODB_URI
    
    if (!mongoUri) {
      return NextResponse.json({
        success: false,
        error: 'MongoDB URI not configured',
        details: 'MONGODB_URI environment variable is missing'
      }, { status: 500 })
    }

    console.log('Testing MongoDB connection...')
    console.log('MongoDB URI configured:', mongoUri.substring(0, 20) + '...')

    // Test connection
    const connection = await connectDB()
    
    if (!connection) {
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to MongoDB',
        details: 'Connection returned null'
      }, { status: 500 })
    }

    // Get connection state
    const connectionState = mongoose.connection.readyState
    const stateNames = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }

    // Test a simple operation
    const collections = mongoose.connection.db ? 
      await mongoose.connection.db.listCollections().toArray() : []
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      details: {
        connectionState: stateNames[connectionState as keyof typeof stateNames] || 'unknown',
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        collections: collections.map(col => col.name),
        totalCollections: collections.length
      }
    })

  } catch (error: any) {
    console.error('MongoDB connection test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'MongoDB connection test failed',
      details: {
        message: error.message,
        code: error.code,
        codeName: error.codeName,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 })
  }
}
