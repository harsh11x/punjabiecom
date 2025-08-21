// Environment Configuration
export const ENV_CONFIG = {
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'production',
  
  // Backend URLs
  BACKEND_URL: {
    development: 'http://localhost:3001',
    production: 'http://3.111.208.77:3001' // Your AWS server runs on port 3001
  },
  
  // Frontend URLs
  FRONTEND_URL: {
    development: 'http://localhost:3000',
    production: 'https://punjabijuttiandfulkari.com/' // Your custom domain
  },
  
  // API Endpoints
  API_ENDPOINTS: {
    orders: '/api/orders',
    products: '/api/products',
    health: '/health',
    admin: {
      orders: '/api/admin/orders'
    }
  }
};

// Helper functions
export function getBackendUrl(): string {
  const env = ENV_CONFIG.NODE_ENV as 'development' | 'production';
  return ENV_CONFIG.BACKEND_URL[env];
}

export function getFrontendUrl(): string {
  const env = ENV_CONFIG.NODE_ENV as 'development' | 'production';
  return ENV_CONFIG.FRONTEND_URL[env];
}

export function getApiUrl(endpoint: string): string {
  const backendUrl = getBackendUrl();
  return `${backendUrl}${endpoint}`;
}

export function isDevelopment(): boolean {
  return ENV_CONFIG.NODE_ENV === 'development';
}

export function isProduction(): boolean {
  return ENV_CONFIG.NODE_ENV === 'production';
}
