import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

// Don't throw error during build time, only during runtime
if (!MONGODB_URI && typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  console.warn('Please define the MONGODB_URI environment variable inside .env.local')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface CachedConnection {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

interface GlobalWithMongoose {
  mongoose: CachedConnection | undefined
}

declare global {
  var mongoose: CachedConnection | undefined
}

let cached: CachedConnection = (global as GlobalWithMongoose).mongoose || { conn: null, promise: null }

if (!cached) {
  cached = (global as GlobalWithMongoose).mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  // If no MONGODB_URI is provided, return null (for build time)
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI not provided, skipping database connection')
    return null
  }

  if (cached.conn) {
    // Check if connection is still alive
    if (mongoose.connection.readyState === 1) {
      return cached.conn
    } else {
      // Connection is dead, reset cache
      cached.conn = null
      cached.promise = null
    }
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds  
      connectTimeoutMS: 15000, // 15 seconds
      maxIdleTimeMS: 30000, // 30 seconds
      // Use compression
      compressors: ['zlib' as const],
      // Optimize for faster reads
      readPreference: 'primaryPreferred' as const,
      retryWrites: true,
      retryReads: true,
      // Add these for better DNS resolution
      family: 4, // Use IPv4, skip trying IPv6
      // Add auth source
      authSource: 'admin'
    }

    console.log('Connecting to MongoDB...')
    console.log('URI:', MONGODB_URI.substring(0, 20) + '...')

    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached.conn = await cached.promise
    console.log('MongoDB connected successfully')
    return cached.conn
  } catch (e: any) {
    cached.promise = null
    console.error('MongoDB connection error:', {
      message: e.message,
      code: e.code,
      codeName: e.codeName
    })
    
    // Provide more specific error messages
    if (e.message.includes('querySrv ENOTFOUND')) {
      throw new Error('MongoDB DNS resolution failed. Check your internet connection and MongoDB cluster URL.')
    } else if (e.message.includes('Authentication failed')) {
      throw new Error('MongoDB authentication failed. Check your username and password.')
    } else if (e.message.includes('Server selection timed out')) {
      throw new Error('MongoDB server selection timed out. Check your network connection and MongoDB cluster status.')
    }
    
    throw e
  }
}

export { dbConnect as connectDB }
export default dbConnect