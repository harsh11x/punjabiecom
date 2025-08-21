// API Configuration
// Change this to switch between Next.js and Express server

const config = {
  // Set to 'express' to use the Express server, 'nextjs' to use Next.js API routes
  apiMode: 'express',
  
  // Express server configuration
  express: {
    baseUrl: 'http://localhost:3001',
    endpoints: {
      orders: '/api/orders',
      products: '/api/products',
      health: '/health'
    }
  },
  
  // Next.js API routes configuration
  nextjs: {
    baseUrl: '',
    endpoints: {
      orders: '/api/orders',
      products: '/api/products',
      health: '/api/health'
    }
  }
}

// Get current configuration
function getApiConfig() {
  return config.apiMode === 'express' ? config.express : config.nextjs
}

// Get full URL for an endpoint
function getApiUrl(endpoint) {
  const apiConfig = getApiConfig()
  return `${apiConfig.baseUrl}${apiConfig.endpoints[endpoint] || endpoint}`
}

// Check if we should use Express server
function useExpress() {
  return config.apiMode === 'express'
}

module.exports = {
  config,
  getApiConfig,
  getApiUrl,
  useExpress
}
