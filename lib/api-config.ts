// API Configuration for connecting to AWS server
const isProduction = process.env.NODE_ENV === 'production'

// AWS Server Configuration
const AWS_SERVER_IP = '3.111.208.77'
const AWS_SERVER_PORT = '3003'

// Local Development Configuration
const LOCAL_SERVER_PORT = '3003'

// Socket.IO Configuration
export const SOCKET_CONFIG = {
  // Production: Connect to AWS server
  // Development: Connect to local server
  url: isProduction 
    ? `http://${AWS_SERVER_IP}:${AWS_SERVER_PORT}`
    : `http://localhost:${LOCAL_SERVER_PORT}`,
  
  options: {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
    forceNew: true
  }
}

// API Base URLs
export const API_CONFIG = {
  // Production: Use Vercel deployment URL
  // Development: Use local Next.js API routes
  baseURL: isProduction 
    ? 'https://your-vercel-domain.vercel.app/api'
    : 'http://localhost:3000/api',
  
  // Socket server URL for API calls
  socketURL: isProduction 
    ? `http://${AWS_SERVER_IP}:${AWS_SERVER_PORT}`
    : `http://localhost:${LOCAL_SERVER_PORT}`,
  
  // CORS origins
  corsOrigins: isProduction 
    ? [
        'https://your-vercel-domain.vercel.app',
        'https://punjabijuttiandfulkari.com',
        'https://www.punjabijuttiandfulkari.com'
      ]
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003'
      ]
}

// Database Configuration
export const DB_CONFIG = {
  // MongoDB connection string
  // In production, this should be your MongoDB Atlas or AWS MongoDB instance
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/punjabi-heritage',
  
  // Connection options
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }
}

// Payment Configuration (Razorpay)
export const PAYMENT_CONFIG = {
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_your_key',
  keySecret: process.env.RAZORPAY_KEY_SECRET || 'your_secret_key',
  currency: 'INR',
  companyName: 'Punjab Heritage Store',
  description: 'Traditional Punjabi Products'
}

// Environment Variables Check
export const validateEnvironment = () => {
  const required = [
    'MONGODB_URI',
    'JWT_SECRET',
    'NEXT_PUBLIC_RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET'
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.warn('⚠️ Missing environment variables:', missing)
    console.warn('Please set these variables in your .env.local file')
  }

  return missing.length === 0
}

// Server Status Check
export const checkServerStatus = async () => {
  try {
    const response = await fetch(`${SOCKET_CONFIG.url}/health`, {
      method: 'GET',
      timeout: 5000
    })
    return response.ok
  } catch (error) {
    console.error('Server status check failed:', error)
    return false
  }
}

// Export configuration
export default {
  isProduction,
  socket: SOCKET_CONFIG,
  api: API_CONFIG,
  db: DB_CONFIG,
  payment: PAYMENT_CONFIG,
  validateEnvironment,
  checkServerStatus
}