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
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000, // 5 seconds
      socketTimeoutMS: 45000, // 45 seconds  
      connectTimeoutMS: 10000, // 10 seconds
      maxIdleTimeMS: 30000, // 30 seconds
      // Use compression
      compressors: ['zlib' as const],
      // Optimize for faster reads
      readPreference: 'primaryPreferred' as const,
      retryWrites: true,
      retryReads: true,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('MongoDB connection error:', e)
    throw e
  }

  return cached.conn
}

export { dbConnect as connectDB }
export default dbConnect