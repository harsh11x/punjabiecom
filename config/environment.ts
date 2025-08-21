// Environment Configuration
export const ENV_CONFIG = {
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Backend URLs
  BACKEND_URL: {
    development: 'http://localhost:3001',
    production: 'https://your-backend-domain.com' // Replace with your actual backend domain
  },
  
  // Frontend URLs
  FRONTEND_URL: {
    development: 'http://localhost:3000',
    production: 'https://your-project.vercel.app' // Replace with your actual Vercel domain
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
