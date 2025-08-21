// API Configuration for different environments
export const API_CONFIG = {
  // Development (localhost)
  development: {
    backendUrl: 'http://localhost:3001',
    frontendUrl: 'http://localhost:3000'
  },
  
  // Production (Vercel)
  production: {
    backendUrl: 'https://your-backend-domain.com', // Replace with your backend domain
    frontendUrl: 'https://your-project.vercel.app'  // Replace with your Vercel domain
  }
};

// Auto-detect environment
export const isDevelopment = process.env.NODE_ENV === 'development' || 
                           typeof window !== 'undefined' && window.location.hostname === 'localhost';

export const isProduction = !isDevelopment;

// Get current API configuration
export function getApiConfig() {
  return isDevelopment ? API_CONFIG.development : API_CONFIG.production;
}

// Get backend URL for API calls
export function getBackendUrl() {
  const config = getApiConfig();
  return config.backendUrl;
}

// Get frontend URL
export function getFrontendUrl() {
  const config = getApiConfig();
  return config.frontendUrl;
}

// Build full API endpoint URL
export function getApiEndpoint(endpoint: string) {
  const backendUrl = getBackendUrl();
  return `${backendUrl}${endpoint}`;
}

// Common API endpoints
export const API_ENDPOINTS = {
  orders: '/api/orders',
  products: '/api/products',
  health: '/health',
  admin: {
    orders: '/api/admin/orders'
  }
};

// Helper function to get full URL for any endpoint
export function getFullApiUrl(endpoint: string) {
  return getApiEndpoint(endpoint);
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
  // Skip status check if Socket URL is null (production)
  if (!SOCKET_CONFIG.url) {
    return false
  }
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch(`${SOCKET_CONFIG.url}/health`, {
      method: 'GET',
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    console.warn('Server status check failed (this is optional):', error)
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