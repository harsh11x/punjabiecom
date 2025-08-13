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
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
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
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
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