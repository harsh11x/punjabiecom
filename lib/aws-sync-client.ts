interface SyncConfig {
  serverUrl: string;
  authToken: string;
  timeout?: number;
}

interface SyncResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

class AWSyncClient {
  private config: SyncConfig;

  constructor(config: SyncConfig) {
    this.config = {
      timeout: 10000,
      ...config
    };
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<SyncResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(`${this.config.serverUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.authToken}`,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('AWS Sync Error:', error);
      return {
        success: false,
        error: error.message || 'Sync operation failed'
      };
    }
  }

  // Product sync methods
  async syncProduct(action: 'add' | 'update' | 'delete', product: any): Promise<SyncResponse> {
    return this.makeRequest('/api/sync/products', {
      method: 'POST',
      body: JSON.stringify({ action, product })
    });
  }

  async bulkSyncProducts(products: any[]): Promise<SyncResponse> {
    return this.makeRequest('/api/sync/products', {
      method: 'POST',
      body: JSON.stringify({ action: 'bulk_sync', products })
    });
  }

  async getProducts(): Promise<SyncResponse> {
    return this.makeRequest('/api/sync/products');
  }

  // Order sync methods
  async syncOrder(action: 'add' | 'update', order: any): Promise<SyncResponse> {
    return this.makeRequest('/api/sync/orders', {
      method: 'POST',
      body: JSON.stringify({ action, order })
    });
  }

  // Settings sync
  async syncSettings(settings: any): Promise<SyncResponse> {
    return this.makeRequest('/api/sync/settings', {
      method: 'POST',
      body: JSON.stringify({ settings })
    });
  }

  // Health check
  async healthCheck(): Promise<SyncResponse> {
    return this.makeRequest('/api/health');
  }

  // Get sync logs
  async getSyncLogs(limit: number = 100): Promise<SyncResponse> {
    return this.makeRequest(`/api/sync/logs?limit=${limit}`);
  }
}

// Singleton instance
let syncClient: AWSyncClient | null = null;

export const getAWSyncClient = (): AWSyncClient => {
  if (!syncClient) {
    const serverUrl = process.env.NEXT_PUBLIC_AWS_SYNC_SERVER_URL || process.env.AWS_SYNC_SERVER_URL;
    const authToken = process.env.AWS_SYNC_SECRET || 'punjabi-heritage-sync-secret-2024';

    if (!serverUrl) {
      console.warn('AWS Sync Server URL not configured');
      // Return a mock client that logs operations
      return {
        syncProduct: async (action, product) => {
          console.log(`Mock sync: ${action} product`, product);
          return { success: true, message: 'Mock sync completed' };
        },
        bulkSyncProducts: async (products) => {
          console.log('Mock bulk sync:', products.length, 'products');
          return { success: true, message: 'Mock bulk sync completed' };
        },
        getProducts: async () => ({ success: true, data: [] }),
        syncOrder: async (action, order) => {
          console.log(`Mock sync: ${action} order`, order);
          return { success: true, message: 'Mock order sync completed' };
        },
        syncSettings: async (settings) => {
          console.log('Mock settings sync:', settings);
          return { success: true, message: 'Mock settings sync completed' };
        },
        healthCheck: async () => ({ success: true, data: { status: 'mock' } }),
        getSyncLogs: async () => ({ success: true, data: [] })
      } as AWSyncClient;
    }

    syncClient = new AWSyncClient({
      serverUrl,
      authToken
    });
  }

  return syncClient;
};

// Helper functions for common operations
export const syncProductToAWS = async (action: 'add' | 'update' | 'delete', product: any) => {
  const client = getAWSyncClient();
  const result = await client.syncProduct(action, product);
  
  if (!result.success) {
    console.error(`Failed to sync product ${action}:`, result.error);
  }
  
  return result;
};

export const syncOrderToAWS = async (action: 'add' | 'update', order: any) => {
  const client = getAWSyncClient();
  const result = await client.syncOrder(action, order);
  
  if (!result.success) {
    console.error(`Failed to sync order ${action}:`, result.error);
  }
  
  return result;
};

export const syncSettingsToAWS = async (settings: any) => {
  const client = getAWSyncClient();
  const result = await client.syncSettings(settings);
  
  if (!result.success) {
    console.error('Failed to sync settings:', result.error);
  }
  
  return result;
};

export default AWSyncClient;
