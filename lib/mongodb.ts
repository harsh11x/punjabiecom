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

  // Define connection options
  const opts = {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 15000, // Increased from 10 to 15 seconds
    socketTimeoutMS: 60000, // Increased from 45 to 60 seconds  
    connectTimeoutMS: 30000, // Increased from 15 to 30 seconds
    maxIdleTimeMS: 30000, // 30 seconds
    // Use compression
    compressors: ['zlib' as const],
    // Optimize for faster reads
    readPreference: 'primaryPreferred' as const,
    retryWrites: true,
    retryReads: true,
    // DNS resolution settings
    family: 4 // Use IPv4 only for better compatibility
    // Don't specify authSource to use default
  }

  if (!cached.promise) {
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
    
    // Try alternative connection string if available
    const ALT_MONGODB_URI = process.env.ALT_MONGODB_URI
    if (ALT_MONGODB_URI && !MONGODB_URI.includes(ALT_MONGODB_URI)) {
      console.log('Attempting connection with alternative MongoDB URI...')
      try {
        cached.promise = mongoose.connect(ALT_MONGODB_URI, opts)
        cached.conn = await cached.promise
        console.log('MongoDB connected successfully using alternative URI')
        return cached.conn
      } catch (altError) {
        console.error('Alternative MongoDB connection also failed:', altError)
      }
    }
    
    // Provide more specific error messages
    if (e.message.includes('querySrv ENOTFOUND')) {
      console.error('MongoDB DNS resolution failed. Using file-based fallback for critical operations.')
      // Return null instead of throwing to allow fallback to file storage
      return null
    } else if (e.message.includes('Authentication failed')) {
      throw new Error('MongoDB authentication failed. Check your username and password.')
    } else if (e.message.includes('Server selection timed out')) {
      console.error('MongoDB server selection timed out. Using file-based fallback for critical operations.')
      // Return null instead of throwing to allow fallback to file storage
      return null
    }
    
    throw e
  }
}

export { dbConnect as connectDB }
export default dbConnect